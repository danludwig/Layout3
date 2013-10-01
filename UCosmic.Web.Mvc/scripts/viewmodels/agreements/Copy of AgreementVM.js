/// <reference path="../../app/Spinner.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/knockout.mapping/knockout.mapping.d.ts" />
/// <reference path="../../typings/globalize/globalize.d.ts" />
/// <reference path="../../typings/kendo/kendo.all.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
/// <reference path="../../app/App.ts" />
/// <reference path="../../app/Routes.ts" />
/// <reference path="../../app/Spinner.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/sammyjs/sammyjs.d.ts" />
/// <reference path="../establishments/ApiModels.d.ts" />
/// <reference path="./scrollBody.ts" />
/// <reference path="./contacts.ts" />
/// <reference path="./fileAttachments.ts" />
/// <reference path="./datesStatus.ts" />
/// <reference path="./visibility.ts" />
/// <reference path="./participants.ts" />
/// <reference path="./basicInfo.ts" />
/// <reference path="./establishmentSearchNav.ts" />
var InstitutionalAgreementEditModel = (function () {
    function InstitutionalAgreementEditModel() {
        var _this = this;
        this.percentOffBodyHeight = .6;
        //jquery defered for setting body height.
        this.dfdUAgreements = $.Deferred();
        this.dfdPopParticipants = $.Deferred();
        this.dfdPopContacts = $.Deferred();
        this.dfdPopFiles = $.Deferred();
        this.dfdPageFadeIn = $.Deferred();
        this.agreementIsEdit = ko.observable();
        this.agreementId = { val: 0 };
        //set the path for editing an agreement or new agreement.
        this.editOrNewUrl = { val: 'new' };
        this.trail = ko.observableArray([]);
        this.nextForceDisabled = ko.observable(false);
        this.prevForceDisabled = ko.observable(false);
        this.pageNumber = ko.observable();
        this.$genericAlertDialog = undefined;
        //added this because kendo window after selecting a autocomplte and then clicking the window,
        //the body would scroll to the top.
        this.kendoWindowBug = { val: 0 };
        this.isBound = ko.observable();
        this.spinner = new App.Spinner(new App.SpinnerOptions(400, true));
        this.selectConstructor = function (name, id) {
            this.name = name;
            this.id = id;
        };
        this.officialNameDoesNotMatchTranslation = ko.computed(function () {
            return !(this.participants.establishmentOfficialName === this.participants.establishmentTranslatedName);
        });
        $("table.data").children("tbody").addClass("searchResults");
        var culture = $("meta[name='accept-language']").attr("content");
        this.scrollBodyClass = new scrollBody.scroll("participants", "basicInfo", "effectiveDatesCurrentStatus", "contacts", "fileAttachments", "overallVisibility", null, null, null, null, this.kendoWindowBug);
        this.establishmentSearchNavClass = new agreements.establishmentSearchNav(this.editOrNewUrl, this.participantsClass, this.agreementIsEdit, this.agreementId, this.scrollBodyClass, this.dfdPageFadeIn);
        this.participantsClass = new agreements.participants(this.agreementId, this.dfdPopParticipants, this.agreementIsEdit, this.establishmentSearchNavClass.establishmentSearchViewModel, this.establishmentSearchNavClass.hasBoundSearch);
        this.establishmentSearchNavClass.participantsClass = this.participantsClass;
        ko.applyBindings(this.participantsClass, $('#participants')[0]);
        this.basicInfoClass = new agreements.basicInfo(this.agreementId, this.dfdUAgreements);
        ko.applyBindings(this.basicInfoClass, $('#basicInfo')[0]);
        this.contactClass = new agreements.contacts(this.basicInfoClass.isCustomContactTypeAllowed, this.establishmentSearchNavClass.establishmentItemViewModel, this.agreementIsEdit, this.agreementId, this.kendoWindowBug, this.dfdPopContacts);
        ko.applyBindings(this.contactClass, $('#contacts')[0]);
        this.fileAttachmentClass = new agreements.fileAttachments(this.agreementId, this.agreementIsEdit, this.spinner, this.establishmentSearchNavClass.establishmentItemViewModel, this.dfdPopFiles);
        ko.applyBindings(this.fileAttachmentClass, $('#fileAttachments')[0]);
        this.datesStatusClass = new agreements.datesStatus(this.basicInfoClass.isCustomStatusAllowed);
        ko.applyBindings(this.datesStatusClass, $('#effectiveDatesCurrentStatus')[0]);
        this.visibilityClass = new agreements.visibility();
        ko.applyBindings(this.visibilityClass, $('#overallVisibility')[0]);

        if (window.location.href.toLowerCase().indexOf("agreements/new") > 0) {
            Globalize.culture(culture);
            this.editOrNewUrl.val = "new/";
            this.agreementIsEdit(false);
            this.visibilityClass.visibility("Public");
            $("#LoadingPage").hide();
            this.participantsClass.populateParticipants();
            $.when(this.dfdPageFadeIn, this.dfdPopParticipants).done(function () {
                _this.updateKendoDialog($(window).width());
                $("body").css("min-height", ($(window).height() + $("body").height() - ($(window).height() * _this.percentOffBodyHeight)));
            });
        } else {
            this.percentOffBodyHeight = .2;
            this.editOrNewUrl.val = window.location.href.toLowerCase().substring(window.location.href.toLowerCase().indexOf("agreements/") + 11);
            this.editOrNewUrl.val = this.editOrNewUrl.val.substring(0, this.editOrNewUrl.val.indexOf("/edit") + 5) + "/";
            this.agreementIsEdit(true);
            this.agreementId.val = parseInt(this.editOrNewUrl.val.substring(0, this.editOrNewUrl.val.indexOf("/")));
            this.participantsClass.populateParticipants();
            this.fileAttachmentClass.populateFiles();
            this.contactClass.populateContacts();
            Globalize.culture(culture);
            this.populateAgreementData();
            $("#LoadingPage").hide();
            $.when(this.dfdPopContacts, this.dfdPopFiles, this.dfdPopParticipants, this.dfdPageFadeIn).done(function () {
                _this.updateKendoDialog($(window).width());
                $("body").css("min-height", ($(window).height() + $("body").height() - ($(window).height() * _this.percentOffBodyHeight)));
            });
        }

        this.isBound(true);
        this.basicInfoClass.populateUmbrella();
        this.hideOtherGroups();
        this.establishmentSearchNavClass.bindSearch();
        this.getSettings();

        $(window).resize(function () {
            _this.updateKendoDialog($(window).width());
        });
    }
    //to correctly bind with ko, must set visibility to hidden. this removes the visibility to hidden and
    //changes it to display none.
    InstitutionalAgreementEditModel.prototype.hideOtherGroups = function () {
        $("#allParticipants").css("visibility", "").hide();
        $("#estSearch").css("visibility", "").hide();
        $("#addEstablishment").css("visibility", "").hide();
    };

    InstitutionalAgreementEditModel.prototype.populateAgreementData = function () {
        var _this = this;
        $.when(this.dfdUAgreements).done(function () {
            $.get(App.Routes.WebApi.Agreements.get(_this.agreementId.val)).done(function (response) {
                var dropdownlist, editor = $("#agreementContent").data("kendoEditor");

                editor.value(response.content);
                _this.basicInfoClass.content(response.content);
                _this.datesStatusClass.expDate(Globalize.format(new Date(response.expiresOn.substring(0, response.expiresOn.lastIndexOf("T"))), 'd'));
                _this.datesStatusClass.startDate(Globalize.format(new Date(response.startsOn.substring(0, response.startsOn.lastIndexOf("T"))), 'd'));
                if (response.isAutoRenew == null) {
                    _this.datesStatusClass.autoRenew(2);
                } else {
                    _this.datesStatusClass.autoRenew(response.isAutoRenew);
                }
                ;
                _this.basicInfoClass.nickname(response.name);
                _this.basicInfoClass.privateNotes(response.notes);
                _this.visibilityClass.visibility(response.visibility);
                _this.datesStatusClass.isEstimated(response.isExpirationEstimated);
                ko.mapping.fromJS(response.participants, _this.participantsClass.participants);
                _this.dfdPopParticipants.resolve();
                _this.basicInfoClass.uAgreementSelected(response.umbrellaId);
                dropdownlist = $("#uAgreements").data("kendoDropDownList");
                dropdownlist.select(function (dataItem) {
                    return dataItem.value == _this.basicInfoClass.uAgreementSelected();
                });
                _this.datesStatusClass.statusOptionSelected(response.status);
                if (_this.basicInfoClass.isCustomStatusAllowed()) {
                    dropdownlist = $("#statusOptions").data("kendoComboBox");
                    dropdownlist.select(function (dataItem) {
                        return dataItem.name === _this.datesStatusClass.statusOptionSelected();
                    });
                } else {
                    dropdownlist = $("#statusOptions").data("kendoDropDownList");
                    dropdownlist.select(function (dataItem) {
                        return dataItem.text === _this.datesStatusClass.statusOptionSelected();
                    });
                }
                _this.basicInfoClass.typeOptionSelected(response.type);
                if (_this.basicInfoClass.isCustomTypeAllowed()) {
                    dropdownlist = $("#typeOptions").data("kendoComboBox");
                    dropdownlist.select(function (dataItem) {
                        return dataItem.name === _this.basicInfoClass.typeOptionSelected();
                    });
                } else {
                    dropdownlist = $("#typeOptions").data("kendoDropDownList");
                    dropdownlist.select(function (dataItem) {
                        return dataItem.text === _this.basicInfoClass.typeOptionSelected();
                    });
                }
            });
        });
    };

    InstitutionalAgreementEditModel.prototype.updateKendoDialog = function (windowWidth) {
        $(".k-window").css({
            left: (windowWidth / 2 - ($(".k-window").width() / 2) + 10)
        });
    };

    InstitutionalAgreementEditModel.prototype.bindjQueryKendo = function (result) {
        var self = this;

        this.basicInfoClass.isCustomTypeAllowed(result.isCustomTypeAllowed);
        this.basicInfoClass.isCustomStatusAllowed(result.isCustomStatusAllowed);
        this.basicInfoClass.isCustomContactTypeAllowed(result.isCustomContactTypeAllowed);
        this.datesStatusClass.statusOptions.push(new this.selectConstructor("", ""));
        for (var i = 0, j = result.statusOptions.length; i < j; i++) {
            this.datesStatusClass.statusOptions.push(new this.selectConstructor(result.statusOptions[i], result.statusOptions[i]));
        }
        ;
        this.contactClass.contactTypeOptions.push(new this.selectConstructor("", undefined));
        for (var i = 0, j = result.contactTypeOptions.length; i < j; i++) {
            this.contactClass.contactTypeOptions.push(new this.selectConstructor(result.contactTypeOptions[i], result.contactTypeOptions[i]));
        }
        ;
        this.basicInfoClass.typeOptions.push(new this.selectConstructor("", ""));
        for (var i = 0, j = result.typeOptions.length; i < j; i++) {
            this.basicInfoClass.typeOptions.push(new this.selectConstructor(result.typeOptions[i], result.typeOptions[i]));
        }
        ;
        $(".hasDate").each(function (index, item) {
            $(item).kendoDatePicker({
                value: new Date($(item).val()),
                //have to use change event for ko validation-change does a double call so need to check for null
                change: function (e) {
                    if (this.value() != null) {
                        $(e.sender.element).val(Globalize.format(this.value(), 'd'));
                    }
                },
                close: function (e) {
                    if (this.value() != null) {
                        $(e.sender.element).val(Globalize.format(this.value(), 'd'));
                    }
                }
            });
        });
        $(".k-window").css({
            position: 'fixed',
            margin: 'auto',
            top: '20px'
        });

        // create Editor from textarea HTML element
        $("#agreementContent").kendoEditor({
            tools: [
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "fontName",
                "foreColor",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "createLink",
                "unlink",
                "insertImage",
                "subscript",
                "superscript",
                "viewHtml",
                {
                    name: "formatting",
                    items: [
                        { text: "Paragraph", value: "p" },
                        { text: "Quotation", value: "blockquote" },
                        { text: "Heading 2", value: "h2" },
                        { text: "Heading 3", value: "h3" },
                        { text: "Heading 4", value: "h4" },
                        { text: "Heading 5", value: "h5" },
                        { text: "Heading 6", value: "h6" }
                    ],
                    width: "200px"
                }
            ]
        });
        this.basicInfoClass.bindJquery();
        this.contactClass.bindJquery();
        this.fileAttachmentClass.bindJquery();
        this.datesStatusClass.bindJquery();
        this.scrollBodyClass.bindJquery();
    };

    //get settings for agreements.
    InstitutionalAgreementEditModel.prototype.getSettings = function () {
        var _this = this;
        var url = 'App.Routes.WebApi.Agreements.Settings.get()', agreementSettingsGet;

        $.ajax({
            url: eval(url),
            type: 'GET'
        }).done(function (result) {
            _this.bindjQueryKendo(result);
        }).fail(function (xhr) {
            alert('fail: status = ' + xhr.status + ' ' + xhr.statusText + '; message = "' + xhr.responseText + '"');
        });
    };

    InstitutionalAgreementEditModel.prototype.saveUpdateAgreement = function () {
        var _this = this;
        var offset;

        if (!this.datesStatusClass.validateEffectiveDatesCurrentStatus.isValid()) {
            offset = $("#effectiveDatesCurrentStatus").offset();
            this.datesStatusClass.validateEffectiveDatesCurrentStatus.errors.showAllMessages(true);
            $("#navEffectiveDatesCurrentStatus").closest("ul").find("li").removeClass("current");
            $("#navEffectiveDatesCurrentStatus").addClass("current");
        }
        if (!this.basicInfoClass.validateBasicInfo.isValid()) {
            offset = $("#basicInfo").offset();
            this.basicInfoClass.validateBasicInfo.errors.showAllMessages(true);
            $("#navValidateBasicInfo").closest("ul").find("li").removeClass("current");
            $("#navValidateBasicInfo").addClass("current");
        }
        $("#participantsErrorMsg").show();
        if (this.participantsClass.participantsShowErrorMsg()) {
            offset = $("#participants").offset();
            $("#navParticipants").closest("ul").find("li").removeClass("current");
            $("#navParticipants").addClass("current");
        }
        if (offset != undefined) {
            if (!$("body").scrollTop()) {
                $("html, body").scrollTop(offset.top - 20);
            } else {
                $("body").scrollTop(offset.top - 20);
            }
        } else {
            var url, $LoadingPage = $("#LoadingPage").find("strong"), editor = $("#agreementContent").data("kendoEditor"), $LoadingPage = $("#LoadingPage").find("strong"), myAutoRenew = null, data;

            this.spinner.start();

            if (!$("body").scrollTop()) {
                $("html, body").scrollTop(0);
            } else {
                $("body").scrollTop(0);
            }
            $LoadingPage.text("Saving agreement...");

            $("#allParticipants").show().fadeOut(500, function () {
                $("#LoadingPage").hide().fadeIn(500);
            });

            $.each(this.participantsClass.participants(), function (i, item) {
                _this.participantsClass.participantsExport.push({
                    agreementId: item.agreementId,
                    establishmentId: item.establishmentId,
                    establishmentOfficialName: item.establishmentOfficialName,
                    establishmentTranslatedName: item.establishmentTranslatedName,
                    isOwner: item.isOwner,
                    center: item.center
                });
            });
            if (this.datesStatusClass.autoRenew() == 0) {
                myAutoRenew = false;
            } else if (this.datesStatusClass.autoRenew() == 1) {
                myAutoRenew = true;
            }
            this.basicInfoClass.content(editor.value());
            data = ko.mapping.toJS({
                content: this.basicInfoClass.content(),
                expiresOn: this.datesStatusClass.expDate(),
                startsOn: this.datesStatusClass.startDate(),
                isAutoRenew: myAutoRenew,
                name: this.basicInfoClass.nickname(),
                notes: this.basicInfoClass.privateNotes(),
                status: this.datesStatusClass.statusOptionSelected(),
                visibility: this.visibilityClass.visibility(),
                isExpirationEstimated: this.datesStatusClass.isEstimated(),
                participants: this.participantsClass.participantsExport,
                umbrellaId: this.basicInfoClass.uAgreementSelected(),
                type: this.basicInfoClass.typeOptionSelected()
            });
            if (this.agreementIsEdit()) {
                url = App.Routes.WebApi.Agreements.put(this.agreementId.val);
                $.ajax({
                    type: 'PUT',
                    url: url,
                    data: data,
                    success: function (response, statusText, xhr) {
                        $LoadingPage.text("Agreement Saved...");
                        setTimeout(function () {
                            $("#LoadingPage").show().fadeOut(500, function () {
                                $("#allParticipants").hide().fadeIn(500);
                            });
                        }, 5000);
                    },
                    error: function (xhr, statusText, errorThrown) {
                        _this.spinner.stop();
                        if (xhr.status === 400) {
                            _this.establishmentSearchNavClass.establishmentItemViewModel.$genericAlertDialog.find('p.content').html(xhr.responseText.replace('\n', '<br /><br />'));
                            _this.establishmentSearchNavClass.establishmentItemViewModel.$genericAlertDialog.dialog({
                                title: 'Alert Message',
                                dialogClass: 'jquery-ui',
                                width: 'auto',
                                resizable: false,
                                modal: true,
                                buttons: {
                                    'Ok': function () {
                                        _this.establishmentSearchNavClass.establishmentItemViewModel.$genericAlertDialog.dialog('close');
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                url = App.Routes.WebApi.Agreements.post();
                $.post(url, data).done(function (response, statusText, xhr) {
                    var myUrl = xhr.getResponseHeader('Location');

                    _this.agreementId.val = parseInt(myUrl.substring(myUrl.lastIndexOf("/") + 1));
                    _this.fileAttachmentClass.agreementPostFiles(response, statusText, xhr);
                    _this.contactClass.agreementPostContacts(response, statusText, xhr);

                    //change url to edit
                    $LoadingPage.text("Agreement Saved...");
                    setTimeout(function () {
                        if (xhr != undefined) {
                            window.location.hash = "";
                            window.location.href = "/agreements/" + xhr.getResponseHeader('Location').substring(xhr.getResponseHeader('Location').lastIndexOf("/") + 1) + "/edit/";
                        } else {
                            alert("success, but no location");
                        }
                    }, 5000);
                }).fail(function (xhr, statusText, errorThrown) {
                    _this.spinner.stop();
                    if (xhr.status === 400) {
                        _this.establishmentSearchNavClass.establishmentItemViewModel.$genericAlertDialog.find('p.content').html(xhr.responseText.replace('\n', '<br /><br />'));
                        _this.establishmentSearchNavClass.establishmentItemViewModel.$genericAlertDialog.dialog({
                            title: 'Alert Message',
                            dialogClass: 'jquery-ui',
                            width: 'auto',
                            resizable: false,
                            modal: true,
                            buttons: {
                                'Ok': function () {
                                    _this.establishmentSearchNavClass.establishmentItemViewModel.$genericAlertDialog.dialog('close');
                                }
                            }
                        });
                    }
                });
            }
        }
    };
    return InstitutionalAgreementEditModel;
})();