module ViewModels.LanguageExpertises {

    export class LanguageExpertise {
        /* True if any field changes. */
        dirtyFlag: KnockoutObservable<boolean> = ko.observable(false);

        /* Languages */
        languageList: any;

        /* Proficiencies */
        proficiencyInfo: any;

        /* Api Model */
        id: KnockoutObservable<number>;           // if 0, new expertise
        version: KnockoutObservable<string>;      // byte[] converted to base64
        personId: KnockoutObservable<number>;
        whenLastUpdated: KnockoutObservable<string>;
        whoLastUpdated: KnockoutObservable<string>;
        languageId: KnockoutObservable<any>;
        dialect: KnockoutObservable<string>;
        other: KnockoutObservable<string>;
        speakingProficiency: KnockoutObservable<number>;
        listeningProficiency: KnockoutObservable<number>;
        readingProficiency: KnockoutObservable<number>;
        writingProficiency: KnockoutObservable<number>;

        /* Validation */
        errors: KnockoutValidationErrors;
        isValid: () => boolean;
        isAnyMessageShown: () => boolean;

        languageDroplist: any;
        isOther: KnockoutObservable<boolean> = ko.observable(false);

        _initialize(expertiseId: number): void {
            this.id = ko.observable(expertiseId);
        }

        setupWidgets(languageInputId: string,
            speakingInputId: string,
            listeningInputId: string,
            readingInputId: string,
            writingInputId: string
            ): void {

            $("#" + languageInputId).kendoDropDownList({
                animation: false,
                dataTextField: "name",
                dataValueField: "id",
                optionLabel: "Select...",
                dataSource: this.languageList,
                value: this.languageId() != null ? this.languageId() : 0,
                change: (e: any) => {
                    if (e.sender.selectedIndex > 0) {
                        var item = this.languageList[e.sender.selectedIndex - 1];
                        if (item.name == "Other") {
                            this.languageId(null);
                        } else {
                            this.languageId(item.id);
                        }
                    }
                    else {
                        this.languageId(null);
                    }
                }
            });

            /* For some reason, setting the value in the droplist creation above to 0,
                does not set the item to "Other" */
            this.languageDroplist = $("#" + languageInputId).data("kendoDropDownList");
            if (this.languageId() == null) {
                this.languageDroplist.select(function (dataItem) { return dataItem.name === "Other" });
            }

            $("#" + speakingInputId).kendoDropDownList({
                animation: false,
                dataTextField: "title",
                dataValueField: "weight",
                height: 500,
                dataSource: this.proficiencyInfo.speakingMeanings,
                value: this.speakingProficiency().toString(),
                template: kendo.template($("#proficiency-template").html())
            });

            $("#" + listeningInputId).kendoDropDownList({
                animation: false,
                dataTextField: "title",
                dataValueField: "weight",
                height: 500,
                dataSource: this.proficiencyInfo.listeningMeanings,
                value: this.listeningProficiency().toString(),
                template: kendo.template($("#proficiency-template").html())
            });

            $("#" + readingInputId).kendoDropDownList({
                animation: false,
                dataTextField: "title",
                dataValueField: "weight",
                height: 500,
                dataSource: this.proficiencyInfo.readingMeanings,
                value: this.readingProficiency().toString(),
                template: kendo.template($("#proficiency-template").html())
            });

            $("#" + writingInputId).kendoDropDownList({
                animation: false,
                dataTextField: "title",
                dataValueField: "weight",
                height: 500,
                dataSource: this.proficiencyInfo.writingMeanings,
                value: this.writingProficiency().toString(),
                template: kendo.template($("#proficiency-template").html())
            });
        }

        setupValidation(): void {

            //ko.validation.rules['otherRequired'] = {
            //    validator: (val: any, otherVal: any): boolean => {
            //        debugger;

            //        var selectedIndex = this.languageDroplist.select();
            //        var selectedName = this.languageList[selectedIndex].name;
            //        if (selectedName !== "Other") {
            //            return true;
            //        }
            //        return (this.other !== null) && (this.other.length > 0);
            //    },
            //    message: 'Please provide the other language.'
            //};

            //ko.validation.registerExtenders();

            this.languageId.extend({
                notEqual: {
                    params: 0,
                    message: 'Please select a language or \'Other\' from this menu. ',
                }
            });
            //this.other.extend({ otherRequired: true });

            ko.validation.group(this);
        }

        setupSubscriptions(): void {
            this.languageId.subscribe((newValue: any): void => { this.dirtyFlag(true); });
            this.other.subscribe((newValue: any): void => { this.dirtyFlag(true); });
            this.dialect.subscribe((newValue: any): void => { this.dirtyFlag(true); });
            this.speakingProficiency.subscribe((newValue: any): void => { this.dirtyFlag(true); });
            this.listeningProficiency.subscribe((newValue: any): void => { this.dirtyFlag(true); });
            this.readingProficiency.subscribe((newValue: any): void => { this.dirtyFlag(true); });
            this.writingProficiency.subscribe((newValue: any): void => { this.dirtyFlag(true); });
        }

        constructor(expertiseId: string, personId: string) {
            this.personId = ko.observable(parseInt(personId));
            this._initialize(parseInt(expertiseId));
        }

        load(): JQueryPromise<any> {
            var deferred: JQueryDeferred<void> = $.Deferred();

            var proficienciesPact = $.Deferred();
            $.get(App.Routes.WebApi.LanguageExpertise.Proficiencies.get())
                .done((data: any, textStatus: string, jqXHR: JQueryXHR): void => {
                    proficienciesPact.resolve(data);
                })
                .fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string): void => {
                    proficienciesPact.reject(jqXHR, textStatus, errorThrown);
                });

            var languagesPact = $.Deferred();
            $.get(App.Routes.WebApi.Languages.get())
                .done((data: any, textStatus: string, jqXHR: JQueryXHR): void => {
                    languagesPact.resolve(data);
                })
                .fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string): void => {
                    languagesPact.reject(jqXHR, textStatus, errorThrown);
                });

            if (this.id() == 0) {
                this.version = ko.observable(null);
                //this.personId = ko.observable(0);
                this.whenLastUpdated = ko.observable(null);
                this.whoLastUpdated = ko.observable(null);
                this.languageId = ko.observable(0);
                this.dialect = ko.observable(null);
                this.other = ko.observable(null);
                this.speakingProficiency = ko.observable(0);
                this.listeningProficiency = ko.observable(0);
                this.readingProficiency = ko.observable(0);
                this.writingProficiency = ko.observable(0);

                $.when(languagesPact, proficienciesPact)
                    .done((languages: any, proficiencyInfo: any, data: any): void => {

                        this.languageList = languages;
                        this.languageList.push({ name: "Other", code: "", id: 0 });

                        this.proficiencyInfo = proficiencyInfo;

                        deferred.resolve();
                    })
                    .fail((xhr: JQueryXHR, textStatus: string, errorThrown: string): void => {
                        deferred.reject(xhr, textStatus, errorThrown);
                    });
            }
            else {
                var dataPact = $.Deferred();
                $.ajax({
                    type: "GET",
                    url: App.Routes.WebApi.LanguageExpertise.get(this.id()),
                    success: function (data: any, textStatus: string, jqXhr: JQueryXHR): void
                    { dataPact.resolve(data); },
                    error: function (jqXhr: JQueryXHR, textStatus: string, errorThrown: string): void
                    { dataPact.reject(jqXhr, textStatus, errorThrown); },
                });

                $.when(languagesPact, proficienciesPact, dataPact)
                    .done((languages: any, proficiencyInfo: any, data: any): void => {

                        this.languageList = languages;
                        this.languageList.push({ name: "Other", code: "", id: 0 });

                        this.proficiencyInfo = proficiencyInfo;

                        ko.mapping.fromJS(data, {}, this);

                        deferred.resolve();
                    })
                    .fail((xhr: JQueryXHR, textStatus: string, errorThrown: string): void => {
                        deferred.reject(xhr, textStatus, errorThrown);
                    });
            }

            return deferred;
        }

        save(viewModel: any, event: any): void {

            if (!this.isValid()) {
                // TBD - need dialog here.
                this.errors.showAllMessages();
                return;
            }

            var selectedLanguageIndex = this.languageDroplist.select() - 1;
            var selectedLanguageName = this.languageList[selectedLanguageIndex].name;
            if (selectedLanguageName === "Other") {
                if ((this.other() == null) || (this.other().length == 0)) {
                    this.isOther(true)
                    return;
                }
            }

            var mapSource = {
                id: this.id,
                version: this.version,
                personId: this.personId,
                whenLastUpdated: this.whenLastUpdated,
                whoLastUpdated: this.whoLastUpdated,
                languageId: this.languageId,
                dialect: this.dialect,
                other: this.other,
                speakingProficiency: this.speakingProficiency,
                listeningProficiency: this.listeningProficiency,
                readingProficiency: this.readingProficiency,
                writingProficiency: this.writingProficiency,
            };

            var model = ko.mapping.toJS(mapSource);

            var url = (viewModel.id() == 0) ?
                App.Routes.WebApi.LanguageExpertise.post() :
                App.Routes.WebApi.LanguageExpertise.put(viewModel.id());
            var type = (viewModel.id() == 0) ? "POST" : "PUT";

            $.ajax({
                type: type,
                async: false,
                url: url,
                data: model,
                success: (data: any, textStatus: string, jqXhr: JQueryXHR): void => {
                },
                error: (jqXhr: JQueryXHR, textStatus: string, errorThrown: string): void => {
                    alert(textStatus + " | " + errorThrown);
                },
                complete: (jqXhr: JQueryXHR, textStatus: string): void => {
                    //location.href = App.Routes.Mvc.My.Profile.get( "language-expertise" );
                    location.href = Routes.Mvc.Employees.LanguageExpertise.detail(this.personId());
                }
            });
        }

        cancel(item: any, event: any, mode: string): void {
            if (this.dirtyFlag() == true) {
                var $dialog = $('#cancelConfirmDialog');
                $dialog.dialog({
                    modal: true,
                    resizable: false,
                    width: 'auto',
                    buttons: [
                        {
                            text: 'Yes, cancel & lose changes',
                            click: (): void => {
                                location.href = Routes.Mvc.Employees.LanguageExpertise.detail(this.personId());
                                $dialog.dialog('close');
                            },
                        },
                        {
                            text: 'No, do not cancel',
                            click: (): void => {
                                $dialog.dialog('close');
                            },
                            'data-css-link': true,
                        },
                    ],
                });
            }
            else {
                location.href = Routes.Mvc.Employees.LanguageExpertise.detail(this.personId());
            }
        }
    }
}
