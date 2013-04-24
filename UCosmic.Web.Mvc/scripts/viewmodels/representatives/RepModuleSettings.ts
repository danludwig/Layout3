/// <reference path="../../jquery/jquery-1.8.d.ts" />
/// <reference path="../../jquery/jqueryui-1.9.d.ts" />
/// <reference path="../../ko/knockout-2.2.d.ts" />
/// <reference path="../../ko/knockout.mapping-2.0.d.ts" />
/// <reference path="../../ko/knockout.extensions.d.ts" />
/// <reference path="../../ko/knockout.validation.d.ts" />
/// <reference path="../../kendo/kendouiweb.d.ts" />
/// <reference path="../../app/SideSwiper.ts" />
/// <reference path="../../sammy/sammyjs-0.7.d.ts" />

module ViewModels.RepModuleSettings{


    export class RepModuleSettings{
        welcomeMessage: string;
        emailMessage: string;

        constructor(welcomeMessage:string, emailMessage:string){
            this.welcomeMessage = welcomeMessage;
            this.emailMessage = emailMessage;
        }
    }

    function RepModuleSettings(){
        var self = this;

        self.isBound = ko.observable();

        self.back = function () {
            history.back();
        };
    }
}