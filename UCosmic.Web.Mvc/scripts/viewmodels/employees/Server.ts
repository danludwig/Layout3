/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../app/App.ts" />
/// <reference path="../../app/Routes.d.ts" />
/// <reference path="Routes.d.ts" />
/// <reference path="Models.d.ts" />

module Employees.Servers {

    export function EmployeesPlaces(tenantDomain: any, data: ApiModels.EmployeesPlacesInputModel, settings?: JQueryAjaxSettings): JQueryPromise<ApiModels.EmployeesPlaceApiModel[]> {
        var promise: JQueryDeferred<ApiModels.EmployeesPlaceApiModel[]> = $.Deferred();
        settings = settings || {};
        settings.url = Routes.Api.Employees.places(tenantDomain);
        if (data) settings.data = data;
        $.ajax(settings)
            .done((response: ApiModels.EmployeesPlaceApiModel[]): void => {
                promise.resolve(response);
            })
            .fail((xhr: JQueryXHR): void => {
                promise.reject(xhr);
            });
        return promise;
    }

    export function ActivityCounts(tenantDomain: any, settings?: JQueryAjaxSettings): JQueryPromise<ApiModels.EmployeeActivityCounts> {
        var promise: JQueryDeferred<ApiModels.EmployeeActivityCounts> = $.Deferred();
        settings = settings || {};
        settings.url = Routes.Api.Employees.Activities.counts(tenantDomain);
        $.ajax(settings)
            .done((response: ApiModels.EmployeeActivityCounts): void => {
                promise.resolve(response);
            })
            .fail((xhr: JQueryXHR): void => {
                promise.reject(xhr);
            });
        return promise;
    }
}