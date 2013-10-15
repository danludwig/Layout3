/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/knockout.mapping/knockout.mapping.d.ts" />
/// <reference path="../../typings/sammyjs/sammyjs.d.ts" />
/// <reference path="../../app/App.ts" />
/// <reference path="../../app/PagedSearch.ts" />
/// <reference path="../../app/SideSwiper.ts" />
/// <reference path="../../app/Routes.ts" />
/// <reference path="../places/ApiModels.d.ts" />
/// <reference path="SearchResult.ts" />
/// <reference path="ApiModels.d.ts" />
/// <reference path="./publicView.ts" />

module Agreements.ViewModels {

    export interface Lens {
        text: string;
        value: string;
    }

    export class Search extends App.PagedSearch {

        static KeywordSessionKey = 'AgreementSearchKeyword';
        static PageSizeSessionKey = 'AgreementSearchPageSize';
        static OrderBySessionKey = 'AgreementSearchOrderBy';
        static CountrySessionKey = 'AgreementSearchCountry';
        static PageNumberSessionKey = 'AgreementSearchPageNumber';

        constructor(public domain, public initDefaultPageRoute: boolean = true) {
            super();
            //this.publicViewClass = new Agreements.ViewModels.PublicView();
            //ko.applyBindings(this.publicViewClass, $('#publicView')[0]);

            //this.domain = window.location.href.toLowerCase();
            //this.domain = this.domain.substring(this.domain.indexOf("agreements/") + 11);
            //var domainIndexOf = (this.domain.indexOf("/") > 0) ? this.domain.indexOf("/") : this.domain.length;
            //this.domain = this.domain.substring(0, domainIndexOf);

            //this.clickAction = <() => boolean > this.clickAction.bind(this);


            this._init();

            this.changeLens(this.lenses()[0]);
            this.requestResults = <() => void > this.requestResults.bind(this);
        }
        header = ko.observable();
        $searchResults = $("#searchResults");
        deferredFadeInOut = $.Deferred();
        deferredFadeInOut2 = $.Deferred();
        optionsEnabled = ko.observable(true);
        //domain;
        //imported classes
        publicViewClass

        private _init() {
            this._setupCountryDropDown();
            this._setupPagingSubscriptions();
            this._setupLensing();
            this._setupPagingDefaults();
            this._applySession();
            this._setupSammy();
            this._setupSessionStorage();
        }

        // countries dropdown
        private _setupCountryDropDown(): void {
            ko.computed((): void => {

                // populate countryCode based on last value when paging backwards
                var lastCountryCode = $('input[type=hidden][data-bind="value: countryCode"]').val();

                $.get(App.Routes.WebApi.Countries.get()) // hit the API
                    .done((response: Places.ApiModels.Country[]): void => {
                        // setup empty value
                        var emptyValue: Places.ApiModels.Country = {
                            code: '-1',
                            name: '[Without country]'
                        };
                        response.splice(response.length, 0, emptyValue);

                        this.countries(response); // push into observable array

                        // restore selected value when paging backwards
                        if (lastCountryCode && lastCountryCode !== this.countryCode())
                            this.countryCode(lastCountryCode);
                    });
            })
                .extend({ throttle: 1 });
        }

        // paging subscriptions
        private _setupPagingSubscriptions(): void {
            // whenever pageNumber changes, set the location for sammy
            this.pageNumber.subscribe((newValue: number) => {
                this.setLocation();
            });
        }

        // lensing
        private _setupLensing(): void {
            this.changeLens = (lens: Lens): void => {
                this.lens(lens.value);
            };
        }

        // sammy & URL hashing
        sammy: Sammy.Application = Sammy();
        sammyBeforeRoute: any = /\#\/page\/(.*)\//;
        sammyGetPageRoute: any = '#/page/:pageNumber/';
        //sammyDefaultPageRoute: any = '/agreements/(.*?\..*)[\/]?';
        sammyDefaultPageRoute: string = '{0}/agreements[\/]?'.format(this.domain);
        private _setupSammy(): void {
            var self = this;
            //self.beforePage(this.sammy());
            self.sammy.before(self.sammyBeforeRoute, function () {
                self.beforePage(this);
            });

            self.sammy.get(self.sammyGetPageRoute, function () {
                self.getPage(this);
            });

            if (self.initDefaultPageRoute) {
                // match /establishments or /establishments/
                self.sammy.get(self.sammyDefaultPageRoute, function () {
                    self.initPageHash(this);
                });
            }
            //this.unlockAnimation();

            ko.computed((): void => {
                self.requestResults();
            }).extend({ throttle: 1 });
        }

        getPage(sammyContext: Sammy.EventContext): void {
            //var windowHref = window.location.href;
            //if (windowHref.indexOf("agreements/new") != -1
            //    || windowHref.indexOf("agreements/settings") != -1
            //    || parseInt(windowHref.substr(windowHref.indexOf("agreements/") + 11, 1)) > 0 ){
            //        this.sammy.destroy();
            //        window.location.hash = "";
            //        window.location.reload;
            //    //window.location.replace(window.location.href);
            // // to do the following I need to set a location with sammy
            ////$("nav.bib .search").removeClass("current");
            ////$("nav.bib ul").append("<li class='view current'><span> View </span></ li>");
            ////this.publicViewClass.agreementId.val = viewModel.id();
            ////this.publicViewClass.getData();
            ////$("#search").fadeOut(500, function () {
            ////    $("#publicView").fadeIn(500);
            ////});
            //    return ;
            //}
            var trail = this.trail(),
                clone;
            if (trail.length > 0 && trail[trail.length - 1] === sammyContext.path) return;
            if (trail.length > 1 && trail[trail.length - 2] === sammyContext.path) {
                // swipe backward
                trail.pop();
                return;
            } else if (trail.length > 0) {
                // swipe forward
            }
            trail.push(sammyContext.path);
        }

        beforePage(sammyContext: Sammy.EventContext): boolean {
            var pageNumber;
            if (this.nextForceDisabled() || this.prevForceDisabled())
                return false;

            pageNumber = sammyContext.params['pageNumber'];

            // make sure the viewmodel pagenumber is in sync with the route
            if (pageNumber && parseInt(pageNumber) !== Number(this.pageNumber()))
                this.pageNumber(parseInt(pageNumber));
            return true;
        }

        initPageHash(sammyContext: Sammy.EventContext): void {
            sammyContext.app.setLocation('#/page/1/');
        }

        setLocation(): void {
            var location = '#/page/' + this.pageNumber() + '/';
            if (this.sammy.getLocation() !== location)
                this.sammy.setLocation(location);
        }

        // filtering
        countries: KnockoutObservableArray<Places.ApiModels.Country> = ko.observableArray();
        countryCode: KnockoutObservable<string> = ko.observable();

        // lensing
        lenses: KnockoutObservableArray<Lens> = ko.observableArray([
            { text: 'Table', value: 'table' },
            { text: 'List', value: 'list' }//,
            //{ text: 'Grid', value: 'grid' },
            //{ text: 'Map', value: 'map' },
            //{ text: 'Tree', value: 'tree' }
        ]);
        lens: KnockoutObservable<string> = ko.observable();
        changeLens: (lens: Lens) => void;

        // items page
        $itemsPage: JQuery = undefined;
        sideSwiper = new App.SideSwiper({
            frameWidth: 710,
            speed: 'fast',
            root: '#search'
        });
        trail: KnockoutObservableArray<string> = ko.observableArray([]);
        lockAnimation(): void {
            this.nextForceDisabled(true);
            this.prevForceDisabled(true);
        }
        unlockAnimation(): void {
            this.nextForceDisabled(false);
            this.prevForceDisabled(false);
        }

        // results
        resultsMapping = {
            'items': {
                key: function (data) {
                    return ko.utils.unwrapObservable(data.id);
                },
                create: function (options) {
                    return new SearchResult(options.data, options.parent);
                }
            },
            ignore: ['pageSize', 'pageNumber']
        };
        swipeCallback(): void {
        }
        receiveResults(js: ApiModels.FlatEstablishment[]): void {
            if (!js) {
                ko.mapping.fromJS({
                    items: [],
                    itemTotal: 0
                }, this.resultsMapping, this);
            }
            else {
                ko.mapping.fromJS(js, this.resultsMapping, this);
            }
            App.WindowScroller.restoreTop(); // restore scroll when coming back from detail page
            this.transitionedPageNumber(this.pageNumber());
            this.deferredFadeInOut2.resolve();
        }

        requestResults(): void {
            this.optionsEnabled(false);
            if (this.pageSize() === undefined || this.orderBy()=== undefined || this.pageNumber() === undefined
                || this.keyword() !== this.throttledKeyword())
                return;
            this.lockAnimation();
            this.spinner.start();
            this.deferredFadeInOut = $.Deferred();
            this.deferredFadeInOut2 = $.Deferred();
            $.when(this.deferredFadeInOut2)
                .done(() => {
                    this.spinner.stop();
                    this.$searchResults.fadeIn(400, () => {
                        this.unlockAnimation();
                        this.optionsEnabled(true);
                        this.$searchResults.children().offset({ top: this.$searchResults.offset().top });
                    });
                    //this.deferredFadeInOut = $.Deferred();
                    //this.deferredFadeInOut2 = $.Deferred();
                });
            if (this.$searchResults.is(":visible")) {
                this.$searchResults.fadeOut(400, () => {
                    this.deferredFadeInOut.resolve();
                });
            } else {
                this.deferredFadeInOut.resolve();
            }
            //$.when(this.deferredSessionLoaded)
                //.done(() => {
                    $.get(App.Routes.WebApi.Agreements.Search.get(this.domain), {
                        pageSize: this.pageSize(),
                        pageNumber: this.pageNumber(),
                        countryCode: this.countryCode(),
                        keyword: this.throttledKeyword(),
                        orderBy: this.orderBy(),
                        //myDomain: this.domain
                    })
                        .done((response: ApiModels.FlatEstablishment[]): void => {
                            $.when(this.deferredFadeInOut)
                                .done(() => {
                                    this.receiveResults(response);
                                });
                        });
                //});
        }

        // go to add new
        gotoAddNew(): boolean {
            return true;
        }

        // click item
        // TODO: is this still needed?
        clickAction(viewModel: SearchResult, e: JQueryEventObject): boolean {

            return true;
        }

        // TODO: this is also not used anywhere, detailHref on SearchResult is though.
        detailHref(id: number): string {
            return App.Routes.Mvc.Establishments.show(id);
        }

        //detailTooltip(): string {
        //    return 'View & edit this agreement\'s details';
        //}

        private _setupPagingDefaults(): void {
            this.orderBy('country');
            this.pageSize(10);
        }


        private _setupSessionStorage(): void {
            this.keyword.subscribe((newValue: string): void => {
                sessionStorage.setItem(Search.KeywordSessionKey, newValue);
            });
            this.pageSize.subscribe((newValue: number): void => {
                sessionStorage.setItem(Search.PageSizeSessionKey, newValue.toString());
            });
            this.orderBy.subscribe((newValue: string): void => {
                sessionStorage.setItem(Search.OrderBySessionKey, newValue);
            });
            this.countryCode.subscribe((newValue: string): void => {
                sessionStorage.setItem(Search.CountrySessionKey, newValue);
            });
            this.pageNumber.subscribe((newValue: number): void => {
                sessionStorage.setItem(Search.PageNumberSessionKey, newValue.toString());
            });
        }

        private _applySession(): void {
            this.keyword(sessionStorage.getItem(Search.KeywordSessionKey) || this.keyword());
            //this.keyword.notifySubscribers;
            this.pageSize(parseInt(sessionStorage.getItem(Search.PageSizeSessionKey)) || Number(this.pageSize()));
            //this.pageSize(parseInt(window.sessionStorage.getItem('UserSearchPageSize'))
            //    || Number(this.pageSize()));
            this.orderBy(sessionStorage.getItem(Search.OrderBySessionKey) || this.orderBy());
            if (sessionStorage.getItem(Search.CountrySessionKey) !== "undefined") {
                this.countryCode(sessionStorage.getItem(Search.CountrySessionKey) || this.countryCode());
            }

            this.pageNumber(parseInt(sessionStorage.getItem(Search.PageNumberSessionKey)) || Number(this.pageNumber()));

        }
    }
}
