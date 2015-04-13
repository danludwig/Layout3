var Activities;
(function (Activities) {
    var ViewModels;
    (function (ViewModels) {
        (function (DataGraphPivot) {
            DataGraphPivot[DataGraphPivot["activities"] = 1] = "activities";
            DataGraphPivot[DataGraphPivot["people"] = 2] = "people";
        })(ViewModels.DataGraphPivot || (ViewModels.DataGraphPivot = {}));
        var DataGraphPivot = ViewModels.DataGraphPivot;
        var ActivityTypeSearchCheckBox = (function () {
            function ActivityTypeSearchCheckBox(activityType, settings) {
                this.activityType = activityType;
                this.settings = settings;
                this.isChecked = ko.observable(!this.settings.input.activityTypeIds || !this.settings.input.activityTypeIds.length || Enumerable.From(this.settings.input.activityTypeIds).Contains(this.activityType.activityTypeId));
            }
            return ActivityTypeSearchCheckBox;
        })();
        ViewModels.ActivityTypeSearchCheckBox = ActivityTypeSearchCheckBox;
        var Search = (function () {
            function Search(settings) {
                var _this = this;
                this.settings = settings;
                this.orderBy = ko.observable(this.settings.input.orderBy);
                this.keyword = ko.observable(this.settings.input.keyword);
                this.pager = new App.Pager(this.settings.input.pageNumber.toString(), this.settings.input.pageSize.toString());
                this.pivot = ko.observable(this.settings.input.pivot);
                this.isActivitiesChecked = ko.computed(function () {
                    return _this.pivot() != 2 /* people */;
                });
                this.isPeopleChecked = ko.computed(function () {
                    return _this.pivot() == 2 /* people */;
                });
                this.loadingSpinner = new App.Spinner();
                this.hasTenancyData = ko.observable(false);
                this.hasEstablishmentSelects = ko.observable(false);
                this.selectedTenant = ko.observable(this.settings.tenantId);
                this.selectedEstablishment = ko.observable(this.settings.input.ancestorId);
                this.tenantOptions = ko.observableArray();
                this.affiliations = ko.mapping.fromJS([]);
                this.MapDataIsLoading = ko.observable(false);
                this.establishmentData = new App.DataCacher(function () {
                    return _this._loadEstablishmentData();
                });
                this.activityTypeCheckBoxes = ko.observableArray(Enumerable.From(this.settings.activityTypes).Select(function (x) {
                    return new ActivityTypeSearchCheckBox(x, _this.settings);
                }).ToArray());
                this.isCheckAllActivityTypesDisabled = ko.computed(function () {
                    return Enumerable.From(_this.activityTypeCheckBoxes()).All(function (x) {
                        return x.isChecked();
                    });
                });
                this.isUncheckAllActivityTypesDisabled = ko.computed(function () {
                    return Enumerable.From(_this.activityTypeCheckBoxes()).All(function (x) {
                        return !x.isChecked();
                    });
                });
                this.since = ko.observable(this.settings.input.since);
                this.until = ko.observable(this.settings.input.until);
                this.isClearSinceDisabled = ko.computed(function () {
                    return _this.since() ? false : true;
                });
                this.isClearUntilDisabled = ko.computed(function () {
                    return _this.until() ? false : true;
                });
                this.pager.apply(this.settings.output);
                this._loadTenancyData();
            }
            Search.prototype._ConstructMapData = function () {
                var _this = this;
                var stringActivityMapData;
                var activityMapData;
                var stringActivityMapDataSearch = sessionStorage.getItem('activityMapDataSearch');
                var ancestorId = this.settings.input.ancestorId ? this.settings.input.ancestorId.toString() : "null";
                var keyword = this.settings.input.keyword ? this.settings.input.keyword : "null";
                if (stringActivityMapDataSearch == ancestorId + keyword) {
                    stringActivityMapData = sessionStorage.getItem('activityMapData');
                    activityMapData = $.parseJSON(stringActivityMapData);
                }
                if (!activityMapData || !activityMapData.length) {
                    var settings = settings || {};
                    var url = '/api/usf.edu/employees/map/?ancestorid=' + ancestorId;
                    if (this.settings.input.keyword) {
                        url += '&keyword=' + keyword;
                    }
                    settings.url = url;
                    this.ajaxMapData = $.ajax(settings).done(function (response) {
                        sessionStorage.setItem('activityMapData', JSON.stringify(response));
                        sessionStorage.setItem('activityMapDataSearch', ancestorId + keyword);
                        _this.MapDataIsLoading(false);
                    }).fail(function (xhr) {
                    });
                }
                else {
                    this.MapDataIsLoading(false);
                }
            };
            Search.prototype._createEstablishmentSelects = function (response) {
                var parentId = this.settings.input.ancestorId;
                if (!parentId) {
                    parentId = this.settings.tenantId;
                }
                var previousParentId = 0;
                while (true) {
                    response.map(function (x, index, array) {
                        x.officialName = x.contextName ? x.contextName : x.officialName && x.officialName.indexOf(',') > -1 ? x.officialName.substring(0, x.officialName.indexOf(',')) : x.officialName;
                        return x;
                    });
                    var options = Enumerable.From(response).Where("x => x.parentId==" + parentId).OrderBy(function (x) {
                        return x.rank;
                    }).ThenBy(function (x) {
                        return x.contextName || x.officialName;
                    }).Select("x =>  {value: x.id, text: x.officialName}").ToArray();
                    if (options.length > 0) {
                        options.unshift({ value: null, text: 'Select sub-affiliation or leave empty' });
                        this.affiliations.unshift(ko.mapping.fromJS([{ options: options, value: previousParentId.toString() }])()[0]);
                    }
                    previousParentId = parentId;
                    var parentCheck = Enumerable.From(response).Where("x => x.id==" + parentId).ToArray();
                    if (parentCheck[0] != undefined) {
                        parentId = parentCheck[0].parentId;
                    }
                    else {
                        this.hasEstablishmentSelects(true);
                        return;
                    }
                }
            };
            Search.prototype._loadEstablishmentData = function () {
                var _this = this;
                var promise = $.Deferred();
                if (!this.mainCampus) {
                    this.mainCampus = this.settings.tenantId;
                }
                var temp = sessionStorage.getItem('campuses' + this.mainCampus);
                if (temp) {
                    var response = $.parseJSON(temp);
                    this._createEstablishmentSelects(response);
                }
                else {
                    var settings = settings || {};
                    settings.url = '/api/establishments/' + this.mainCampus + '/offspring';
                    $.ajax(settings).done(function (response) {
                        promise.resolve(response);
                        sessionStorage.setItem('campuses' + _this.mainCampus, JSON.stringify(response));
                        _this._createEstablishmentSelects(response);
                    }).fail(function (xhr) {
                        promise.reject(xhr);
                    });
                }
                return promise;
            };
            Search.prototype._loadTenancyData = function () {
                var _this = this;
                $.when(Activities.Servers.Single(this.settings.tenantId), Activities.Servers.GetChildren(this.settings.tenantId)).done(function (parentData, childData) {
                    childData = childData || [];
                    var tenants = Enumerable.From(childData).OrderBy(function (x) {
                        return x.rank;
                    }).ToArray();
                    tenants.unshift(parentData);
                    _this.tenantOptions([]);
                    if (childData.length) {
                        var options = Enumerable.From(tenants).Select(function (x) {
                            var option = {
                                value: x.id,
                                text: x.contextName || x.officialName,
                            };
                            return option;
                        }).ToArray();
                        _this.tenantOptions(options);
                    }
                    _this.establishmentData.ready();
                    var myThis = _this;
                    _this.selectedTenant(_this.settings.input.ancestorId);
                    _this.selectedTenant.subscribe(function (newValue) {
                        _this.selectedEstablishment(_this.selectedTenant());
                        _this._submitForm();
                    });
                    $(".campusSelect").change(function () {
                        if (this.value != '') {
                            myThis.selectedEstablishment(this.value);
                        }
                        else {
                            var prevCampusSelect = $(this).parent().parent().prev().find(".campusSelect");
                            if (prevCampusSelect.length) {
                                myThis.selectedEstablishment($(this).parent().parent().prev().find(".campusSelect").val());
                            }
                            else {
                                myThis.selectedEstablishment(myThis.settings.tenantId);
                            }
                        }
                        sessionStorage.setItem('EmployeeSummaryEstablishmentId', myThis.selectedEstablishment().toString());
                        myThis._submitForm();
                    });
                    if (childData.length)
                        _this.hasTenancyData(true);
                }).fail(function (xhr) {
                    App.Failures.message(xhr, 'while trying to load institution organizational data.', true);
                });
            };
            Search.prototype.serializeObject = function (object) {
                var o = {};
                var a = object.serializeArray();
                $.each(a, function () {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    }
                    else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            };
            Search.prototype.applyBindings = function (element) {
                var _this = this;
                ko.applyBindings(this, element);
                kendo.init($(element));
                this._applyKendo();
                this._applySubscriptions();
                this.$form.submit(function (event) {
                    var searchOptions = _this.serializeObject($('form'));
                    searchOptions.placeFilter = 'continents';
                    sessionStorage.setItem(Search.SearchOptions, JSON.stringify(searchOptions));
                    if (_this.ajaxMapData) {
                        _this.ajaxMapData.abort();
                    }
                    sessionStorage.setItem("isMapClick", "0");
                    _this.loadingSpinner.start();
                });
                $('a').click(function () {
                    if (_this.ajaxMapData) {
                        _this.ajaxMapData.abort();
                    }
                    sessionStorage.setItem("isMapClick", "0");
                    _this.loadingSpinner.start();
                });
            };
            Search.prototype._applyKendo = function () {
                var _this = this;
                var kendoSince = this.$since.data('kendoDatePicker');
                kendoSince.element.val(this.settings.input.since);
                var kendoUntil = this.$until.data('kendoDatePicker');
                kendoUntil.element.val(this.settings.input.until);
                var inputInitialized = false;
                var emptyDataItem = {
                    officialName: '[Begin typing to see options]',
                    placeId: undefined,
                };
                var emptyDataSource = new kendo.data.DataSource({ data: [emptyDataItem], });
                var serverDataSource = new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: Routes.Api.Places.Names.autocomplete(),
                        },
                        parameterMap: function (data, action) {
                            if (action == 'read' && data && data.filter && data.filter.filters && data.filter.filters.length) {
                                return {
                                    terms: data.filter.filters[0].value,
                                    maxResults: 20,
                                    granularity: 2,
                                };
                            }
                            return data;
                        }
                    },
                });
                var hasPlace = (this.settings.input.placeIds && this.settings.input.placeIds.length && this.settings.input.placeNames && this.settings.input.placeNames.length && this.settings.input.placeIds[0] && this.settings.input.placeNames[0]) ? true : false;
                var dataSource = hasPlace ? 'server' : 'empty';
                var checkDataSource = function (widget) {
                    var inputVal = $.trim(widget.input.val());
                    if (!inputVal && dataSource == 'empty')
                        return;
                    if (inputVal && dataSource == 'server')
                        return;
                    if (!inputVal && dataSource != 'empty') {
                        dataSource = 'empty';
                        widget.value('');
                        _this.$placeIds.val('');
                        if (_this.settings.input.placeIds && _this.settings.input.placeIds.length) {
                        }
                        else {
                            widget.setDataSource(emptyDataSource);
                        }
                        return;
                    }
                    if (inputVal && dataSource != 'server') {
                        dataSource = 'server';
                        widget.setDataSource(serverDataSource);
                        return;
                    }
                };
                this.$location.kendoComboBox({
                    suggest: true,
                    animation: false,
                    height: 420,
                    dataTextField: 'officialName',
                    dataValueField: 'placeId',
                    filter: 'contains',
                    dataSource: hasPlace ? serverDataSource : emptyDataSource,
                    select: function (e) {
                        $('.eraseMe').remove();
                        var dataItem = e.sender.dataItem(e.item.index());
                        if (dataItem.placeId == -1) {
                            e.sender.value('');
                            e.sender.input.val('');
                            _this.$placeIds.val('');
                            e.preventDefault();
                            _this._submitForm();
                            return;
                        }
                        if (dataItem.officialName == emptyDataItem.officialName) {
                            _this.$placeIds.val('');
                            e.preventDefault();
                            return;
                        }
                        if (!_this.settings.input.placeIds || !_this.settings.input.placeIds.length || _this.settings.input.placeIds[0] != dataItem.placeId) {
                            e.sender.input.val(dataItem.officialName);
                            _this.$location.val(dataItem.officialName);
                            _this.$placeIds.val(dataItem.placeId);
                            _this._submitForm();
                        }
                    },
                    change: function (e) {
                        var dataItem = e.sender.dataItem(e.sender.select());
                        if (!dataItem) {
                            _this.$placeIds.val('');
                            e.sender.value('');
                            checkDataSource(e.sender);
                        }
                        else {
                            e.sender.input.val(dataItem.officialName);
                            _this.$location.val(dataItem.officialName);
                            _this.$placeIds.val(dataItem.placeId);
                            if (!_this.settings.input.placeIds || !_this.settings.input.placeIds.length || _this.settings.input.placeIds[0] != dataItem.placeId) {
                                _this._submitForm();
                            }
                        }
                    },
                    dataBound: function (e) {
                        if (!_this.stopAutocompleteInfiniteLoop) {
                            var widget = e.sender;
                            var input = widget.input;
                            var inputVal = $.trim(input.val());
                            if (!inputInitialized) {
                                input.attr('name', 'placeNames');
                                _this.$location.attr('name', '');
                                input.on('keydown', function () {
                                    setTimeout(function () {
                                        checkDataSource(widget);
                                    }, 0);
                                });
                                if (hasPlace && inputVal) {
                                    widget.search(inputVal);
                                    widget.close();
                                }
                                inputInitialized = true;
                            }
                            else if (hasPlace) {
                                widget.select(function (dataItem) {
                                    return dataItem.placeId == this.settings.input.placeIds[0];
                                });
                                widget.close();
                                input.blur();
                                hasPlace = false;
                            }
                            var value = e.sender.value();
                            if (value) {
                                var dataSource = e.sender.dataSource;
                                var data = dataSource.data();
                                var hasClearer = Enumerable.From(data).Any(function (x) {
                                    return x.placeId == -1;
                                });
                                if (!hasClearer) {
                                    dataSource.add({ officialName: '[Clear current selection]', placeId: -1 });
                                    _this.stopAutocompleteInfiniteLoop = true;
                                }
                            }
                        }
                        else {
                            _this.stopAutocompleteInfiniteLoop = false;
                        }
                    }
                });
                var comboBox = this.$location.data('kendoComboBox');
                comboBox.list.addClass('k-ucosmic');
                if (this.settings.input.placeIds) {
                    $.each(this.settings.input.placeIds, function (index, value) {
                        if (index > 0) {
                            $('<input />').attr('type', 'hidden').attr('name', "placeIds").attr('value', value).addClass('eraseMe').appendTo('form');
                        }
                    });
                }
                var searchOptions = this.serializeObject($('form'));
                searchOptions.placeFilter = 'continents';
                sessionStorage.setItem(Search.SearchOptions, JSON.stringify(searchOptions));
            };
            Search.prototype._applySubscriptions = function () {
                var _this = this;
                this.pager.input.pageSizeText.subscribe(function (newValue) {
                    _this._submitForm();
                });
                this.pager.input.pageNumberText.subscribe(function (newValue) {
                    _this._submitForm();
                });
                this.orderBy.subscribe(function (newValue) {
                    _this._submitForm();
                });
                var myThis = this;
                setTimeout(function () {
                    $('input[name="placeNames"]').bind("change keyup input", function () {
                        if (this.value == "") {
                            $('input[name="placeIds"]')[0].value = '';
                            myThis._submitForm();
                        }
                    });
                }, 500);
            };
            Search.prototype._submitForm = function () {
                if (this.loadingSpinner.isVisible())
                    return;
                this.loadingSpinner.start();
                sessionStorage.setItem("isMapClick", "0");
                this.$form.submit();
            };
            Search.prototype.onKeywordInputSearchEvent = function (viewModel, e) {
                if ($.trim(this.keyword()) && !$.trim($(e.target).val()) && this.$form)
                    this.$form.submit();
            };
            Search.prototype.checkAllActivityTypes = function () {
                Enumerable.From(this.activityTypeCheckBoxes()).ForEach(function (x) {
                    x.isChecked(true);
                });
            };
            Search.prototype.uncheckAllActivityTypes = function () {
                Enumerable.From(this.activityTypeCheckBoxes()).ForEach(function (x) {
                    x.isChecked(false);
                });
            };
            Search.prototype.clearSince = function () {
                this.since('');
            };
            Search.prototype.clearUntil = function () {
                this.until('');
            };
            Search.SearchOptions = 'ActivitySearchOptions';
            return Search;
        })();
        ViewModels.Search = Search;
    })(ViewModels = Activities.ViewModels || (Activities.ViewModels = {}));
})(Activities || (Activities = {}));
