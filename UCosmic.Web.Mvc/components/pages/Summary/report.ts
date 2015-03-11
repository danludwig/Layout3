﻿/// <reference path="../../typediff/mytypes.d.ts" />
//class activityCount{
//    locationCount: number;
//    type: string;
//    typeCount: number;
//    constructor(type: string = "", typeCount: number = 0, locationCount: number = 0){
//        this.type = type;
//        this.typeCount = typeCount;
//        this.locationCount = locationCount;    }

//}


Polymer('is-page-summary-report', {
    isAjaxing: false,
    activityTypeCounts: [],
    agreementTypeCounts: [],
    establishmentSearch: "",
    selectedCountry: 0,
    selectedCountryCode: 'any',
    selectedPlaceId: 0,
    expertiseCountLoaded: false,
    affiliationCountLoaded: false,
    lastEstablishmentSearch: "",
    selectedEstablishmentId: 0,
    degreeCountLoaded: false,
    agreementTypeCountsLoaded: false,
    activityTypeCountsLoaded: false,
    ready: function () {

    },
    selectCountry: function (event, detail, sender) {
        var index = sender.selectedIndex;
        if (index != 0) {
            this.selectedPlaceId = this.countries[index - 1].id;
            this.selectedPlaceName = this.countries[index - 1].name;
            this.selectedCountryCode = this.countries[index - 1].code;
            //this.selectedPlaceId = this.countries[newVal - 1].id;
            //this.selectedPlaceName = this.countries[newVal - 1].name;
            //this.selectedCountryCode = this.countries[newVal - 1].code;
        } else {
            this.selectedPlaceId = 0;
            this.selectedPlaceName = undefined;
            this.selectedCountryCode = '';
        }
        this.$.ajax_activities.go();
        this.$.ajax_agreements.go();
        this.$.ajax_degrees.go();
    },
    leaveEstablishmentSearch: function (event, detail, sender) {
        setTimeout(() => {
            this.establishmentList = [];
        }, 200);
    },
    establishmentSelected: function (event, detail, sender) {
        //this.selectedEstablishmentId = sender.getAttribute('data-id');
        ////if (index != 0) {
        ////    this.selectedEstablishmentId = this.establishmentList[index - 1].forEstablishmentId;
        ////} else {
        ////    this.selectedEstablishmentId = 0;
        ////}
        //this.establishmentSearch = sender.textContent || sender.innerText || "";
        //this.$.ajax_activities.go();
        if (this.establishmentSearch != "") {
            this.activityTypeCounts = [];
        }else{
            this.$.ajax_activities.go();
        }
        this.$.ajax_agreements.go();
        this.$.ajax_degrees.go();
        //this.$.ajax_establishmentsList.go();
    },
    establishmentListSearch: function (event, detail, sender) {
        if (this.establishmentSearch == "") {
            this.establishmentList = [];
        } else {
            if (this.isAjaxing != true) {
                this.isAjaxing = true;
                this.$.ajax_establishmentsList.go();
                this.lastEstablishmentSearch = this.establishmentSearch;
            } else {
                setTimeout(() => {
                    if (this.lastEstablishmentSearch != this.establishmentSearch) {
                        this.isAjaxing = true;
                        this.$.ajax_establishmentsList.go();
                        this.lastEstablishmentSearch = this.establishmentSearch;
                    }
                }, 500);
            }
        }
    },
    selectedCountryChanged: function (oldVal, newVal) {
        if (newVal != 0) {
            this.selectedPlaceId = this.countries[newVal - 1].id;
            this.selectedPlaceName = this.countries[newVal - 1].name;
            this.selectedCountryCode = this.countries[newVal - 1].code;
        } else {
            this.selectedPlaceId = 0;
            this.selectedPlaceName = undefined;
            this.selectedCountryCode = 'any';
        }
        this.$.ajax_activities.go();
        this.$.ajax_agreements.go();
        this.$.ajax_degrees.go();
    },
    activitiesResponse: function (response) {
        this.isAjaxing = false;
        this.activityTypeCountsLoaded = true;

        if (!response.detail.response.error) {
            this.activityTypeCounts = response.detail.response;
            //console.log(response.detail.response)
            //this.countries = response.detail.response
            //response.detail.response.forEach(function (value: any, index: number, array: Array<Object>) {
            //    if (index == indexes[1]) {
            //        value.isSelected = true;
            //    } else {
            //        value.isSelected = false;
            //    }
            //});
        } else {

            console.log(response.detail.response.error)
        }

    },
    agreementsResponse: function (response) {
        this.agreementTypeCountsLoaded = true;
        this.isAjaxing = false;
        if (!response.detail.response.error) {
            this.agreementTypeCounts = response.detail.response;
        } else {

            console.log(response.detail.response.error)
        }
    },
    degreesResponse: function (response) {
        this.degreeCountLoaded = true;
        this.isAjaxing = false;
        if (!response.detail.response.error) {
            this.degrees = response.detail.response[0];
        } else {

            console.log(response.detail.response.error)
        }
    },
    affiliationsResponse: function (response) {
        this.isAjaxing = false;
        this.affiliationCountLoaded = true;
        if (!response.detail.response.error) {
            this.affiliations = response.detail.response[0];
        } else {

            console.log(response.detail.response.error)
        }
    },
    expertisesResponse: function (response) {
        this.isAjaxing = false;
        this.expertiseCountLoaded = true;
        if (!response.detail.response.error) {
            this.expertises = response.detail.response[0];
        } else {

            console.log(response.detail.response.error)
        }
    },
    countriesResponse: function (response) {
        this.isAjaxing = false;

        if (!response.detail.response.error) {
            //console.log(response.detail.response)
            this.countries = response.detail.response
        } else {

            console.log(response.detail.response.error)
        }

    },
    establishmentResponse: function (response) {
        this.isAjaxing = false;

        if (!response.detail.response.error) {
            //console.log(response.detail.response)
            //this.countries = response.detail.response
            
            var list = response.detail.response
            for (var i = 0; i < list.length; i++) {
                list[i]._id = list[i].forestablishmentId;
                delete list[i].forestablishmentId;
            }
            this.establishmentList = response.detail.response;
        } else {

            console.log(response.detail.response.error)
        }

    },
    ajaxError: function (response) {
        this.isAjaxing = false;

        if (!response.detail.response.error) {
            console.log(response.detail.response)
            //this.countries = response.detail.response
        } else {

            console.log(response.detail.response.error)
        }

    },
}); 