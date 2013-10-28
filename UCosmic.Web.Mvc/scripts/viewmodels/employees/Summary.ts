/// <reference path="../../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="../../typings/kendo/kendo.all.d.ts" />
/// <reference path="../../app/HistoryJS.ts" />
/// <reference path="../../typings/history/history.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/knockout.mapping/knockout.mapping.d.ts" />
/// <reference path="../../app/Spinner.ts" />
/// <reference path="../../typings/googlecharts/google.charts.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/linq/linq.d.ts" />
/// <reference path="../../google/GeoChart.ts" />
/// <reference path="Server.ts" />
/// <reference path="Models.d.ts" />
/// <reference path="../../app/App.ts" />

module Employees.ViewModels {

    export interface SummarySettings {
        element: Element;
        elementId?: string;
        geoChartElementId: string;
        geoChartWaterOverlaysElementId?: string;
        geoChartOverlayPhantomsElementId?: string;
        geoChartKeepAspectRatio?: boolean;
        tenantDomain: string;
    }

    export interface SummaryRouteState {
        pivot: DataGraphPivot; // enum during build, int at runtime
    }

    export enum DataGraphPivot {
        unknown = 0,
        people = 1,
        activities = 2,
        degress = 3,
    }

    export class ImageSwapper {
        private _state: KnockoutObservable<string> = ko.observable('up');

        isUp = ko.computed((): boolean => {
            return this._state() == 'up';
        });

        isHover = ko.computed((): boolean => {
            return this._state() == 'hover';
        });

        onMouseEnter(self: ImageSwapper, e: JQueryEventObject): void {
            this._state('hover');
        }

        onMouseLeave(self: ImageSwapper, e: JQueryEventObject): void {
            this._state('up');
        }
    }

    export class DataCacher<T> {
        constructor(public loader: () => JQueryPromise<T>) { }

        private _response: T;
        private _promise: JQueryDeferred<T> = $.Deferred();
        ready(): JQueryPromise<T> {
            if (!this._response) {
                this.loader()
                    .done((data: T): void => {
                        this._response = data;
                        this._promise.resolve(this._response);
                    })
                    .fail((xhr: JQueryXHR): void => {
                        this._promise.reject();
                    });
            }
            return this._promise;
        }
    }

    export class Summary {
        //#region Static Google Visualization Library Loading

        private static _googleVisualizationLoadedPromise = $.Deferred();

        static loadGoogleVisualization(): JQueryPromise<void> {
            // this is necessary to load all of the google visualization API's used by this
            // viewmodel. additionally, https://www.google.com/jsapi script must be present
            google.load('visualization', '1', { 'packages': ['corechart', 'geochart'] });

            google.setOnLoadCallback((): void => { // when the packages are loaded
                Summary._googleVisualizationLoadedPromise.resolve();
            });
            return Summary._googleVisualizationLoadedPromise;
        }

        //#endregion
        //#region Construction & Initialization

        constructor(public settings: SummarySettings) {
            // bind history.js to statechange events
            HistoryJS.Adapter.bind(window, 'statechange', (): void => { this._onRouteChanged(); });

            // begin loading data
            this.activitiesSummaryData.ready();
            this._initGeoChart();

            // need to fire this once because route changes before history is bound
            this.bindingsApplied.done((): void => {
                this._applyState();
            });
        }

        private _bindingsApplied: JQueryDeferred<void> = $.Deferred();
        bindingsApplied: JQueryPromise<void> = this._bindingsApplied;
        areBindingsApplied: KnockoutObservable<boolean> = ko.observable(false);

        applyBindings(): void {
            // did we get an element or an element id?
            var element = this.settings.element;
            if (!element) {
                element = document.getElementById(this.settings.elementId);
            }
            ko.applyBindings(this, element);
            this.areBindingsApplied(true);
            this._bindingsApplied.resolve();
        }

        //#endregion
        //#region UI Observables
        //#region Pivot

        private static _pivotDefault = DataGraphPivot.activities;
        private static _pivotKey = 'EmployeeSummaryPivot';
        pivot: KnockoutObservable<DataGraphPivot> = ko.observable(
            parseInt(sessionStorage.getItem(Summary._pivotKey)) || Summary._pivotDefault);

        private _pivotChanged = ko.computed((): void => { this._onPivotChanged(); });
        private _onPivotChanged(): void {
            // compare value with what is stored in the session
            var value = <number>this.pivot();
            var old = parseInt(sessionStorage.getItem(Summary._pivotKey)) || 0;

            // don't do anything unless the value has changed
            if (value !== old) {
                // save the new value to session storage
                sessionStorage.setItem(Summary._pivotKey, value.toString());
            }
        }

        pivotPeople(): void {
            this.pivot(DataGraphPivot.people);
        }

        pivotActivities(): void {
            this.pivot(DataGraphPivot.activities);
        }

        isPivot(pivot: DataGraphPivot): boolean {
            return this.pivot() == pivot;
        }

        isPivotPeople = ko.computed((): boolean => {
            return this.pivot() == DataGraphPivot.people;
        });

        isPivotActivities = ko.computed((): boolean => {
            return this.pivot() == DataGraphPivot.activities;
        });

        //#endregion
        //#endregion
        //#region Routing

        routeState = ko.computed((): SummaryRouteState => {
            return {
                pivot: this.pivot(),
            };
        });

        private _routeStateChanged = ko.computed((): void => {
            this._onRouteStateChanged();
        }).extend({ throttle: 1 });

        private _onRouteStateChanged() {
            var routeState = this.routeState();
            var historyState = HistoryJS.getState();
            if (!historyState.data.pivot) {
                HistoryJS.replaceState(routeState, document.title, '?' + $.param(routeState));
            }
            else {
                HistoryJS.pushState(routeState, document.title, '?' + $.param(routeState));
            }
        }

        private _onRouteChanged() {
            var state = HistoryJS.getState();
            var data: SummaryRouteState = state.data;
            this.pivot(data.pivot);
            this._applyState();
        }

        private _applyState(): void {
            this._drawGeoChart();
        }

        //#endregion
        //#region Pivot Data

        activitiesPlaceData: DataCacher<ApiModels.ActivitiesPlaceApiModel[]> = new DataCacher(
            (): JQueryPromise<ApiModels.ActivitiesPlaceApiModel[]> => {
                return this._loadActivitiesPlaceData();
            });

        private _loadActivitiesPlaceData(): JQueryPromise<ApiModels.ActivitiesPlaceApiModel[]> {
            var promise: JQueryDeferred<ApiModels.ActivitiesPlaceApiModel[]> = $.Deferred();
            var request: ApiModels.ActivitiesPlacesInputModel = {
                countries: true,
            };
            this.geoChartSpinner.start();
            Servers.ActivitiesPlaces(this.settings.tenantDomain, request)
                .done((places: ApiModels.ActivitiesPlaceApiModel[]): void => {
                    promise.resolve(places);
                })
                .fail((xhr: JQueryXHR): void => {
                    App.Failures.message(xhr, 'while trying to load activity location summary data.', true);
                    promise.reject();
                })
                .always((): void => {
                    this.geoChartSpinner.stop();
                });
            return promise;
        }

        peoplePlaceData: DataCacher<ApiModels.PeoplePlaceApiModel[]> = new DataCacher(
            (): JQueryPromise<ApiModels.PeoplePlaceApiModel[]> => {
                return this._loadPeoplePlaceData();
            });

        private _loadPeoplePlaceData(): JQueryPromise<ApiModels.PeoplePlaceApiModel[]> {
            var promise: JQueryDeferred<ApiModels.PeoplePlaceApiModel[]> = $.Deferred();
            var request: ApiModels.PeoplePlacesInputModel = {
                countries: true,
            };
            this.geoChartSpinner.start();
            Servers.PeoplePlaces(this.settings.tenantDomain, request)
                .done((places: ApiModels.PeoplePlaceApiModel[]): void => {
                    promise.resolve(places);
                })
                .fail((xhr: JQueryXHR): void => {
                    App.Failures.message(xhr, 'while trying to load employee location summary data.', true);
                    promise.reject();
                })
                .always((): void => {
                    this.geoChartSpinner.stop();
                });
            return promise;
        }

        //#endregion
        //#region Google GeoChart

        geoChart: App.Google.GeoChart = new App.Google.GeoChart(
            document.getElementById(this.settings.geoChartElementId));
        geoChartSpinner = new App.Spinner(new App.SpinnerOptions(400, true));
        isGeoChartReady: KnockoutObservable<boolean> = ko.observable(false);

        private static _geoChartOptions(settings: SummarySettings): google.visualization.GeoChartOptions {
            // options passed when drawing geochart
            var options: google.visualization.GeoChartOptions = {
                displayMode: 'regions',
                region: 'world',
                keepAspectRatio: settings.geoChartKeepAspectRatio ? true : false,
                height: settings.geoChartKeepAspectRatio ? 480 : 500,
                colorAxis: {
                    minValue: 1,
                    colors: ['#dceadc', '#006400', ],
                },
                backgroundColor: '#acccfd', // google maps water color is a5bfdd, Doug's bg color is acccfd
                //backgroundColor: 'transparent',
            };
            return options;
        }

        private _newGeoChartDataTable(): google.visualization.DataTable {
            // create data table schema
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn('string', 'Place');
            dataTable.addColumn('number', 'Total {0}'
                .format(this.isPivotPeople() ? 'People' : 'Activities'));
            return dataTable;
        }

        private _initGeoChart(): JQueryPromise<void> {
            // just draw the geochart to make sure something is displayed
            // need to make sure we wait until it's done though before drying to draw again
            var promise = $.Deferred();

            if (!this.isGeoChartReady()) {
                var dataTable = this._newGeoChartDataTable();
                var options = Summary._geoChartOptions(this.settings);
                this.geoChart.draw(dataTable, options).then((): void => {
                    // svg injection depends on the chart being ready,
                    // and bindings having been applied, and the
                    // overlays being visible
                    if (!this.isGeoChartReady()) {
                        this.isGeoChartReady(true); // call this before overlaying to ensure positions
                        this.bindingsApplied.done((): void=> {
                            this._svgInjectWaterOverlays();
                        });
                    }
                    promise.resolve();
                });
            }
            else {
                promise.resolve();
            }
            return promise;
        }

        private _drawGeoChart(): void {
            var options = Summary._geoChartOptions(this.settings);
            var dataTable = this._newGeoChartDataTable();

            // hit the server up for data and redraw
            this._initGeoChart().then((): void => {
                if (this.isPivotPeople()) {
                    this.peoplePlaceData.ready()
                        .done((places: ApiModels.PeoplePlaceApiModel[]): void => {
                            $.each(places, (i: number, dataPoint: ApiModels.PeoplePlaceApiModel): void=> {
                                dataTable.addRow([dataPoint.placeName, dataPoint.personIds.length]);
                            });

                            this.geoChart.draw(dataTable, options);
                        });
                }
                else {
                    this.activitiesPlaceData.ready()
                        .done((places: ApiModels.ActivitiesPlaceApiModel[]): void => {
                            $.each(places, (i: number, dataPoint: ApiModels.ActivitiesPlaceApiModel): void=> {
                                dataTable.addRow([dataPoint.placeName, dataPoint.activityIds.length]);
                            });

                            this.geoChart.draw(dataTable, options);
                        });
                }
            });
        }

        //#endregion
        //#region SVG Injection

        private static _isD3Defined(): boolean {
            return typeof d3 !== 'undefined';
        }

        isD3Defined = ko.computed((): boolean => {
            return Summary._isD3Defined();
        });

        isD3Undefined = ko.computed((): boolean => {
            return !Summary._isD3Defined();
        });

        private _svgInjectWaterOverlays(): void {

            // IE8 cannot load the d3 library
            if (!Summary._isD3Defined() || !this.settings.geoChartWaterOverlaysElementId)
                return;

            // overlay may already be drawn
            if ($('#{0}_root'.format(this.settings.geoChartWaterOverlaysElementId)).length) return;

            // svg structure is as follows:
            //  svg
            //      > defs
            //      > g
            //          > rect
            //          > g - map
            //              <----- inject new node here
            //          > g - legend
            //          > g - ?
            //          > g - tooltips

            // use d3 to select the first root g element from the geochart
            var dGoogleG = d3.select('#{0} svg > g'.format(this.settings.geoChartElementId));

            // append a new g element to the geochart's root g element
            // all of the overlays will become children of this g element
            var dInjectRoot = dGoogleG.append('g')
                .attr('id', '{0}_root'.format(this.settings.geoChartWaterOverlaysElementId))
            ; // note this element's id will be removed later, it is here for testing only

            // iterate over the children of the overlays element
            // in the markup the overlays is a UL with each overlay as an LI
            // (however the following code does not take that into account)
            var jContainer = $('#{0}'.format(this.settings.geoChartWaterOverlaysElementId));
            jContainer.show(); // need to do this to get positions & dimensions from jQuery
            var jOverlays = jContainer.children();
            $.each(jOverlays, (i: number, overlay: Element): void => {
                this._svgInjectWaterOverlay(dInjectRoot, overlay);
            });

            jContainer.hide(); // no longer need dimensions, hide the HTML overlays

            //this._svgApplyWaterOverlayHovers();

            // now rearrange the g order
            // now use jQuery to rearrange the order of the elements
            $('#google_geochart svg > g > g:last-child')
                .insertAfter('#google_geochart svg > g > g:nth-child(2)')
            ;
        }

        private _svgInjectWaterOverlay(root: D3.Selection, overlay: Element): D3.Selection {
            // create a new d3 container for this overlay
            var jOverlay = $(overlay);
            var dOverlay = root.append('g').attr('class', jOverlay.attr('class'));
            $.each($(overlay).children(), (i: number, child: any): void => {
                var jChild = $(child);

                // currently this only supports image injection
                if (jChild.prop('tagName').toUpperCase() !== 'IMG') return;

                // need to compute position in case it is defined in a css class
                // it is the parent's offset (the overlay's offset) that determines both x and y
                var x = jOverlay.position().left;
                var y = jOverlay.position().top;

                // width and height will be accessible when shown
                var width = jChild.css('width');
                var height = jChild.css('height');
                var src = jChild.attr('src');
                var display = jChild.css('display');

                // append a d3 image to the overlay g element
                var image = dOverlay.append('image')
                    .attr('xlink:href', src)
                    .attr('x', x).attr('y', y)
                    .attr('width', width).attr('height', height)
                ;

                // hide the hot image in the d3 overlay collection & add classes to both images
                if (display && display.toLowerCase() == 'none') {
                    image.attr('class', 'hover').attr('style', 'display: none;');
                }
                else {
                    image.attr('class', 'no-hover');
                }
            });

            this._svgApplyWaterOverlayHover(dOverlay);

            return dOverlay;
        }

        private _svgApplyWaterOverlayHover(dOverlay: D3.Selection): void {
            // find the phantom for this overlay
            var jOverlay = $('#{0} .{1}'
                .format(this.settings.geoChartOverlayPhantomsElementId, dOverlay.attr('class')));
            // listen to the phantom
            jOverlay.on('mouseenter', (): void => {
                dOverlay.select('image.hover').style('display', '');
                dOverlay.select('image.no-hover').style('display', 'none');
            });
            jOverlay.on('mouseleave', (): void => {
                dOverlay.select('image.no-hover').style('display', '');
                dOverlay.select('image.hover').style('display', 'none');
            });
        }

        //#endregion
        //#region Tooltips

        private _tooltips: KnockoutObservableArray<any>;
        private _initTooltips = ko.computed((): void => { this._onInitTooktips(); });
        private _onInitTooktips(): void {
            var bindingsApplied = this.areBindingsApplied();
            if (bindingsApplied && !this._tooltips) {
                this._tooltips = ko.observableArray();
                var jTarget = $('#{0} .pacific-ocean'
                    .format(this.settings.geoChartOverlayPhantomsElementId));
                jTarget.tooltip({
                    content: 'tooltipping',
                    items: '*',
                    track: true,
                    show: false,
                    hide: false,
                    tooltipClass: 'geochart',
                    position: {
                        my: 'left+15 bottom-15',
                        within: '#{0}'.format(this.settings.geoChartElementId),
                    },
                });

                jTarget = $('#{0} .gulf-of-mexico'
                    .format(this.settings.geoChartOverlayPhantomsElementId));
                jTarget.tooltip({
                    content: 'tooltipping',
                    items: '*',
                    track: true,
                    show: false,
                    hide: false,
                    tooltipClass: 'geochart',
                    position: {
                        my: 'right-15 bottom-15',
                        within: '#{0}'.format(this.settings.geoChartElementId),
                    },
                });
            }
        }

        //#endregion
        //#region Overlay Hotspot Image Swappers

        private static _waterOverlayClassNames: string[] = [
            'pacific-ocean',
            'gulf-of-mexico',
            'caribbean-sea',
            'atlantic-ocean',
            'southern-ocean',
            'arctic-ocean',
            'indian-ocean',
        ];

        pacificOceanSwapper: ImageSwapper = new ImageSwapper();
        gulfOfMexicoSwapper: ImageSwapper = new ImageSwapper();
        caribbeanSeaSwapper: ImageSwapper = new ImageSwapper();
        atlanticOceanSwapper: ImageSwapper = new ImageSwapper();
        southernOceanSwapper: ImageSwapper = new ImageSwapper();
        arcticOceanSwapper: ImageSwapper = new ImageSwapper();
        indianOceanSwapper: ImageSwapper = new ImageSwapper();
        antarcticaSwapper: ImageSwapper = new ImageSwapper();

        //#endregion
        //#region Summaries

        activitiesSummary: KoModels.ActivitiesSummary = {
            personCount: ko.observable('?'),
            activityCount: ko.observable('?'),
            locationCount: ko.observable('?'),
        };
        activitiesSummaryData: DataCacher<ApiModels.ActivitiesSummary> = new DataCacher(
            (): JQueryPromise<ApiModels.ActivitiesSummary> => {
                return this._loadActivitiesSummary();
            });

        private _loadActivitiesSummary(): JQueryPromise<ApiModels.ActivitiesSummary> {
            var promise: JQueryDeferred<ApiModels.ActivitiesSummary> = $.Deferred();
            Servers.ActivitiesSummary(this.settings.tenantDomain)
                .done((summary: ApiModels.ActivitiesSummary): void => {
                    ko.mapping.fromJS(summary, {}, this.activitiesSummary);
                    promise.resolve(summary);
                })
                .fail((xhr: JQueryXHR): void => {
                    App.Failures.message(xhr, 'while trying to load activity total summary data.', true);
                    promise.reject();
                })
            return promise;
        }

        //#endregion
    }
}