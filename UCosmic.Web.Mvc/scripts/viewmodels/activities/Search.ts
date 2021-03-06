module Activities.ViewModels {

    export interface SearchSettings {
        input: ApiModels.SearchInput;
        output: App.PageOf<ApiModels.SearchResult>;
        //countryOptions: App.ApiModels.SelectOption<string>[];
        activityTypes: ApiModels.ActivityTypeSearchFilter[];
    }

    export enum DataGraphPivot {
        activities = 1,
        people = 2,
    }

    export class ActivityTypeSearchCheckBox {
        // when activity types is null or empty, assume all are checked
        isChecked = ko.observable(!this.settings.input.activityTypeIds || !this.settings.input.activityTypeIds.length ||
            // otherwise, it is only checked when input contains the activity type id
            Enumerable.From(this.settings.input.activityTypeIds).Contains(this.activityType.activityTypeId));


        constructor(public activityType: ApiModels.ActivityTypeSearchFilter, public settings: SearchSettings) { }
    }

    export class Search {
        //#region Construction

        //countryOptions = ko.observableArray(this.settings.countryOptions);
        //countryCode = ko.observable(this.settings.input.countryCode);
        orderBy = ko.observable(this.settings.input.orderBy);
        keyword = ko.observable(this.settings.input.keyword);
        pager = new App.Pager<ApiModels.SearchResult>(this.settings.input.pageNumber.toString(), this.settings.input.pageSize.toString());
        pivot = ko.observable(<DataGraphPivot>this.settings.input.pivot);

        isActivitiesChecked = ko.computed((): boolean => { return this.pivot() != DataGraphPivot.people; });
        isPeopleChecked = ko.computed((): boolean => { return this.pivot() == DataGraphPivot.people; });

        $form: JQuery;
        $location: JQuery;
        $since: JQuery;
        $until: JQuery;
        $placeIds: JQuery;
        loadingSpinner = new App.Spinner()

        constructor(public settings: SearchSettings) {
            this.pager.apply(this.settings.output);
        }

        //#endregion
        //#region Initialization

        applyBindings(element: Element): void {
            ko.applyBindings(this, element);
            kendo.init($(element));
            this._applyKendo();
            this._applySubscriptions();
        }

        private _applyKendo(): void {
            //#region DatePickers

            var kendoSince = this.$since.data('kendoDatePicker');
            kendoSince.element.val(this.settings.input.since);
            var kendoUntil = this.$until.data('kendoDatePicker');
            kendoUntil.element.val(this.settings.input.until);

            //#endregion
            //#region ComboBox for Place(s) filter
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
                    parameterMap: (data: kendo.data.DataSourceTransportParameterMapData, action: string): any => {
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
            var hasPlace = (this.settings.input.placeIds && this.settings.input.placeIds.length
                && this.settings.input.placeNames && this.settings.input.placeNames.length
                && this.settings.input.placeIds[0] && this.settings.input.placeNames[0]) ? true : false;
            var dataSource = hasPlace ? 'server' : 'empty';
            var checkDataSource = (widget: kendo.ui.ComboBox): void => {
                var inputVal = $.trim(widget.input.val());
                if (!inputVal && dataSource == 'empty') return;
                if (inputVal && dataSource == 'server') return;
                if (!inputVal && dataSource != 'empty') {
                    dataSource = 'empty'
                    widget.value('');
                    this.$placeIds.val('');
                    if (this.settings.input.placeIds && this.settings.input.placeIds.length) {
                        //this._submitForm(); // this makes changing location searches annoying
                    } else {
                        widget.setDataSource(emptyDataSource);
                    }
                    return;
                }
                if (inputVal && dataSource != 'server') {
                    dataSource = 'server';
                    widget.setDataSource(serverDataSource);
                    return;
                }
            }
            this.$location.kendoComboBox({
                suggest: true,
                animation: false,
                height: 420,
                dataTextField: 'officialName',
                dataValueField: 'placeId',
                filter: 'contains',
                dataSource: hasPlace ? serverDataSource : emptyDataSource,
                select: (e: kendo.ui.ComboBoxSelectEvent): void => {
                    var dataItem = e.sender.dataItem(e.item.index());

                    if (dataItem.placeId == -1) {
                        e.sender.value('');
                        e.sender.input.val('');
                        this.$placeIds.val('');
                        e.preventDefault();
                        this._submitForm();
                        return;
                    }

                    if (dataItem.officialName == emptyDataItem.officialName) {
                        this.$placeIds.val('');
                        e.preventDefault();
                        return;
                    }

                    if (!this.settings.input.placeIds || !this.settings.input.placeIds.length ||
                        this.settings.input.placeIds[0] != dataItem.placeId) {
                        e.sender.input.val(dataItem.officialName);
                        this.$location.val(dataItem.officialName);
                        this.$placeIds.val(dataItem.placeId);
                        this._submitForm();
                    }
                },
                change: (e: kendo.ui.ComboBoxEvent): void => {
                    var dataItem = e.sender.dataItem(e.sender.select());
                    if (!dataItem) {
                        this.$placeIds.val('');
                        e.sender.value('');
                        checkDataSource(e.sender);
                    } else {
                        e.sender.input.val(dataItem.officialName);
                        this.$location.val(dataItem.officialName);
                        this.$placeIds.val(dataItem.placeId);
                        if (!this.settings.input.placeIds || !this.settings.input.placeIds.length ||
                            this.settings.input.placeIds[0] != dataItem.placeId) {
                            this._submitForm();
                        }
                    }
                },
                //open: (e: kendo.ui.ComboBoxEvent): boolean => {
                //    return false;
                //},
                dataBound: (e: kendo.ui.ComboBoxEvent): void => {
                    var widget = e.sender;
                    var input = widget.input;
                    var inputVal = $.trim(input.val());

                    if (!inputInitialized) {
                        input.attr('name', 'placeNames');
                        this.$location.attr('name', '');
                        input.on('keydown', (): void => {
                            setTimeout((): void => { checkDataSource(widget); }, 0);
                        });
                        if (hasPlace && inputVal) {
                            widget.search(inputVal);
                            widget.close();
                        }
                        inputInitialized = true;
                    }
                    else if (hasPlace) {
                        widget.select(function (dataItem: any): boolean {
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
                        var hasClearer = Enumerable.From(data).Any(function (x: any): boolean {return x.placeId == -1 });
                        if (!hasClearer) dataSource.add({ officialName: '[Clear current selection]', placeId: -1 })
                    }

                }
            });
            var comboBox: kendo.ui.ComboBox = this.$location.data('kendoComboBox');
            comboBox.list.addClass('k-ucosmic');
            //#endregion
        }

        private _applySubscriptions(): void {
            this.pager.input.pageSizeText.subscribe((newValue: string): void => { this._submitForm(); });
            this.pager.input.pageNumberText.subscribe((newValue: string): void => { this._submitForm(); });
            //this.countryCode.subscribe((newValue: string): void => { this._submitForm(); });
            this.orderBy.subscribe((newValue: string): void => { this._submitForm(); });
            //this.pivot.subscribe((newValue: DataGraphPivot): void => { this._submitForm(); });
        }

        //#endregion
        //#region Automatic Form Submits

        private _submitForm(): void {
            if (this.loadingSpinner.isVisible()) return;
            this.loadingSpinner.start();
            this.$form.submit();
        }

        onKeywordInputSearchEvent(viewModel: Search, e: JQueryEventObject): void {
            // this will auto-submit the form when the keyword box's X icon is clicked.
            if ($.trim(this.keyword()) && !$.trim($(e.target).val()) && this.$form)
                this.$form.submit();
        }

        //#endregion
        //#region Activity Type CheckBoxes

        activityTypeCheckBoxes = ko.observableArray<ActivityTypeSearchCheckBox>(Enumerable.From(this.settings.activityTypes)
            .Select((x: ApiModels.ActivityTypeSearchFilter): ActivityTypeSearchCheckBox => {
                return new ActivityTypeSearchCheckBox(x, this.settings)
        }).ToArray());

        isCheckAllActivityTypesDisabled = ko.computed((): boolean => {
            return Enumerable.From(this.activityTypeCheckBoxes())
                .All((x: ActivityTypeSearchCheckBox): boolean => {
                    return x.isChecked();
            });
        });

        isUncheckAllActivityTypesDisabled = ko.computed((): boolean => {
            return Enumerable.From(this.activityTypeCheckBoxes())
                .All((x: ActivityTypeSearchCheckBox): boolean => {
                    return !x.isChecked();
                });
        });

        checkAllActivityTypes(): void {
            Enumerable.From(this.activityTypeCheckBoxes())
                .ForEach((x: ActivityTypeSearchCheckBox): void => {
                    x.isChecked(true);
                })
        }

        uncheckAllActivityTypes(): void {
            Enumerable.From(this.activityTypeCheckBoxes())
                .ForEach((x: ActivityTypeSearchCheckBox): void => {
                    x.isChecked(false);
                })
        }

        //#endregion
        //#region Date Filter Controls

        since = ko.observable(this.settings.input.since);
        until = ko.observable(this.settings.input.until);

        isClearSinceDisabled = ko.computed((): boolean => {
            return this.since() ? false : true;
        });

        isClearUntilDisabled = ko.computed((): boolean => {
            return this.until() ? false : true;
        });

        clearSince(): void {
            this.since('');
        }

        clearUntil(): void {
            this.until('');
        }

        //#endregion
    }
}