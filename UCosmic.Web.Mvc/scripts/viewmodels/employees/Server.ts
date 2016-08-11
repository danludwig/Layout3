﻿module Employees.Servers {

    export function GetEmployeesPlaces(tenantId: any, data: ApiModels.EmployeesPlacesInputModel, settings?: JQueryAjaxSettings): JQueryPromise<ApiModels.EmployeesPlaceApiModel[]> {
        var promise: JQueryDeferred<ApiModels.EmployeesPlaceApiModel[]> = $.Deferred();
        settings = settings || {};
        settings.url = Routes.Api.Employees.places(tenantId);
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


    export function GetSettingsByPerson(personId: number = 0, settings?: JQueryAjaxSettings): JQueryPromise<ApiModels.EmployeeSettings> {
        var promise: JQueryDeferred<ApiModels.EmployeeSettings> = $.Deferred();
        settings = settings || {};
        settings.url = Routes.Api.Employees.Settings.byPerson(personId);
        $.ajax(settings)
            .done((response: ApiModels.EmployeeSettings): void => {
            promise.resolve(response);
        })
            .fail((xhr: JQueryXHR): void => {
            if (xhr.status === 404) promise.resolve(null);
            else promise.reject(xhr);
        });
        return promise;
    } 
}