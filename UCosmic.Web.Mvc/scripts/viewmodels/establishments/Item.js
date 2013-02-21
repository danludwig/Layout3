var ViewModels;
(function (ViewModels) {
    (function (Establishments) {
        var gm = google.maps;
        var CeebCodeValidator = (function () {
            function CeebCodeValidator() {
                this.async = true;
                this.message = 'error';
                this._isAwaitingResponse = false;
                this._ruleName = 'validEstablishmentCeebCode';
                ko.validation.rules[this._ruleName] = this;
                ko.validation.addExtender(this._ruleName);
            }
            CeebCodeValidator.prototype.validator = function (val, vm, callback) {
                var _this = this;
                if(this._isValidatable(vm)) {
                    var route = App.Routes.WebApi.Establishments.validateCeebCode(vm.id);
                    this._isAwaitingResponse = true;
                    $.post(route, vm.serializeData()).always(function () {
                        _this._isAwaitingResponse = false;
                    }).done(function () {
                        callback(true);
                    }).fail(function (xhr) {
                        callback({
                            isValid: false,
                            message: xhr.responseText
                        });
                    });
                }
            };
            CeebCodeValidator.prototype._isValidatable = function (vm) {
                if(vm.id && vm.id !== 0) {
                    return !this._isAwaitingResponse && vm && vm.originalValues && vm.originalValues.ceebCode !== vm.ceebCode();
                }
                return vm && vm.ceebCode() && !this._isAwaitingResponse;
            };
            return CeebCodeValidator;
        })();        
        new CeebCodeValidator();
        var Item = (function () {
            function Item(id) {
                var _this = this;
                this.id = 0;
                this._isInitialized = ko.observable(false);
                this.$genericAlertDialog = undefined;
                this.createSpinner = new ViewModels.Spinner(new ViewModels.SpinnerOptions(0));
                this.validatingSpinner = new ViewModels.Spinner(new ViewModels.SpinnerOptions(200));
                this.categories = ko.observableArray();
                this.typeId = ko.observable();
                this.ceebCode = ko.observable();
                this.uCosmicCode = ko.observable();
                this.languages = ko.observableArray();
                this.names = ko.observableArray();
                this.editingName = ko.observable(0);
                this.namesSpinner = new ViewModels.Spinner(new ViewModels.SpinnerOptions(0, true));
                this.urls = ko.observableArray();
                this.editingUrl = ko.observable(0);
                this.urlsSpinner = new ViewModels.Spinner(new ViewModels.SpinnerOptions(0, true));
                this.id = id || 0;
                this._initNamesComputeds();
                this._initUrlsComputeds();
                this.location = new Establishments.Location(this.id);
                this.typeEmptyText = ko.computed(function () {
                    return _this.categories().length > 0 ? '[Select a type]' : '[Loading...]';
                });
                this.typeId.extend({
                    required: {
                        message: 'Establishment type is required'
                    }
                });
                this.ceebCode.extend({
                    validEstablishmentCeebCode: this
                });
                this.ceebCode.subscribe(function (newValue) {
                    if(_this.ceebCode()) {
                        _this.ceebCode($.trim(_this.ceebCode()));
                    }
                });
                var categoriesPact = $.Deferred();
                $.get(App.Routes.WebApi.Establishments.Categories.get()).done(function (data, textStatus, jqXHR) {
                    categoriesPact.resolve(data);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    categoriesPact.reject(jqXHR, textStatus, errorThrown);
                });
                var viewModelPact = $.Deferred();
                if(this.id) {
                    $.get(App.Routes.WebApi.Establishments.get(this.id)).done(function (data, textStatus, jqXHR) {
                        viewModelPact.resolve(data);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        viewModelPact.reject(jqXHR, textStatus, errorThrown);
                    });
                } else {
                    viewModelPact.resolve(undefined);
                }
                $.when(categoriesPact, viewModelPact).then(function (categories, viewModel) {
                    ko.mapping.fromJS(categories, {
                    }, _this.categories);
                    _this.originalValues = viewModel;
                    if(viewModel) {
                        ko.mapping.fromJS(viewModel, {
                            ignore: [
                                'id'
                            ]
                        }, _this);
                    }
                    if(!_this._isInitialized()) {
                        _this._isInitialized(true);
                    }
                }, function (xhr, textStatus, errorThrown) {
                });
                ko.computed(function () {
                    if(!_this.id || !_this._isInitialized()) {
                        return;
                    }
                    var data = _this.serializeData();
                    if(data.typeId == _this.originalValues.typeId) {
                        return;
                    }
                    var url = App.Routes.WebApi.Establishments.put(_this.id);
                    $.ajax({
                        url: url,
                        type: 'PUT',
                        data: data
                    }).done(function (response, statusText, xhr) {
                        App.flasher.flash(response);
                        $.get(App.Routes.WebApi.Establishments.get(_this.id)).done(function (viewModel, textStatus, jqXHR) {
                            _this.originalValues = viewModel;
                            if(viewModel) {
                                ko.mapping.fromJS(viewModel, {
                                    ignore: [
                                        'id'
                                    ]
                                }, _this);
                            }
                        });
                    }).fail(function (xhr, statusText, errorThrown) {
                    });
                }).extend({
                    throttle: 400
                });
                ko.validation.group(this);
            }
            Item.prototype.requestNames = function (callback) {
                var _this = this;
                this.namesSpinner.start();
                $.get(App.Routes.WebApi.Establishments.Names.get(this.id)).done(function (response) {
                    _this.receiveNames(response);
                    if(callback) {
                        callback(response);
                    }
                });
            };
            Item.prototype.receiveNames = function (js) {
                ko.mapping.fromJS(js || [], this._namesMapping, this.names);
                this.namesSpinner.stop();
                App.Obtruder.obtrude(document);
            };
            Item.prototype.addName = function () {
                var apiModel = new Establishments.ServerNameApiModel(this.id);
                if(this.names().length === 0) {
                    apiModel.isOfficialName = true;
                }
                var newName = new Establishments.Name(apiModel, this);
                this.names.unshift(newName);
                newName.showEditor();
                App.Obtruder.obtrude(document);
            };
            Item.prototype._initNamesComputeds = function () {
                var _this = this;
                ko.computed(function () {
                    $.getJSON(App.Routes.WebApi.Languages.get()).done(function (response) {
                        var emptyValue = new ViewModels.Languages.ServerApiModel(undefined, '[Language Neutral]');
                        response.splice(0, 0, emptyValue);
                        _this.languages(response);
                    });
                }).extend({
                    throttle: 1
                });
                this._namesMapping = {
                    create: function (options) {
                        return new Establishments.Name(options.data, _this);
                    }
                };
                this.canAddName = ko.computed(function () {
                    return !_this.namesSpinner.isVisible() && _this.editingName() === 0 && _this.id !== 0;
                });
                ko.computed(function () {
                    if(_this.id) {
                        _this.requestNames();
                    } else {
                        setTimeout(function () {
                            _this.namesSpinner.stop();
                            _this.addName();
                        }, 0);
                    }
                }).extend({
                    throttle: 1
                });
            };
            Item.prototype.requestUrls = function (callback) {
                var _this = this;
                this.urlsSpinner.start();
                $.get(App.Routes.WebApi.Establishments.Urls.get(this.id)).done(function (response) {
                    _this.receiveUrls(response);
                    if(callback) {
                        callback(response);
                    }
                });
            };
            Item.prototype.receiveUrls = function (js) {
                ko.mapping.fromJS(js || [], this._urlsMapping, this.urls);
                this.urlsSpinner.stop();
                App.Obtruder.obtrude(document);
            };
            Item.prototype.addUrl = function () {
                var apiModel = new Establishments.ServerUrlApiModel(this.id);
                if(this.urls().length === 0) {
                    apiModel.isOfficialUrl = true;
                }
                var newUrl = new Establishments.Url(apiModel, this);
                this.urls.unshift(newUrl);
                newUrl.showEditor();
                App.Obtruder.obtrude(document);
            };
            Item.prototype._initUrlsComputeds = function () {
                var _this = this;
                this._urlsMapping = {
                    create: function (options) {
                        return new Establishments.Url(options.data, _this);
                    }
                };
                this.canAddUrl = ko.computed(function () {
                    return !_this.urlsSpinner.isVisible() && _this.editingUrl() === 0 && _this.id !== 0;
                });
                ko.computed(function () {
                    if(_this.id) {
                        _this.requestUrls();
                    } else {
                        setTimeout(function () {
                            _this.urlsSpinner.stop();
                            _this.addUrl();
                        }, 0);
                    }
                }).extend({
                    throttle: 1
                });
            };
            Item.prototype.submitToCreate = function (formElement) {
                var _this = this;
                if(!this.id || this.id === 0) {
                    var me = this;
                    this.validatingSpinner.start();
                    var officialName = this.names()[0];
                    var officialUrl = this.urls()[0];
                    var location = this.location;
                    if(officialName.text.isValidating() || officialUrl.value.isValidating() || this.ceebCode.isValidating()) {
                        setTimeout(function () {
                            var waitResult = _this.submitToCreate(formElement);
                            return false;
                        }, 5);
                        return false;
                    }
                    if(!this.isValid()) {
                        this.errors.showAllMessages();
                    }
                    if(!officialName.isValid()) {
                        officialName.errors.showAllMessages();
                    }
                    if(!officialUrl.isValid()) {
                        officialUrl.errors.showAllMessages();
                    }
                    this.validatingSpinner.stop();
                    if(officialName.isValid() && officialUrl.isValid()) {
                        var url = App.Routes.WebApi.Establishments.post();
                        var data = this.serializeData();
                        data.officialName = officialName.serializeData();
                        data.officialUrl = officialUrl.serializeData();
                        data.location = location.serializeData();
                        this.createSpinner.start();
                        $.post(url, data).done(function (response, statusText, xhr) {
                            window.location.href = App.Routes.Mvc.Establishments.created(xhr.getResponseHeader('Location'));
                        }).fail(function (xhr, statusText, errorThrown) {
                            _this.createSpinner.stop();
                            if(xhr.status === 400) {
                                _this.$genericAlertDialog.find('p.content').html(xhr.responseText.replace('\n', '<br /><br />'));
                                _this.$genericAlertDialog.dialog({
                                    title: 'Alert Message',
                                    dialogClass: 'jquery-ui',
                                    width: 'auto',
                                    resizable: false,
                                    modal: true,
                                    buttons: {
                                        'Ok': function () {
                                            _this.$genericAlertDialog.dialog('close');
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
                return false;
            };
            Item.prototype.serializeData = function () {
                var data = {
                };
                data.typeId = this.typeId();
                data.ceebCode = this.ceebCode();
                return data;
            };
            return Item;
        })();
        Establishments.Item = Item;        
    })(ViewModels.Establishments || (ViewModels.Establishments = {}));
    var Establishments = ViewModels.Establishments;
})(ViewModels || (ViewModels = {}));
