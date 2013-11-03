declare module Employees.ApiRoutes {

    export interface Employees {
        Activities: Activities;
        //People: People;
        Settings: Settings;
        places(domain: string): string;
    }

    export interface Activities {
        //places(domain: string): string;
        summary(domain: string): string;
    }

    //export interface People {
    //    places(domain: string): string;
    //}

    export interface Settings {
        icon(domain: string, iconName: string): string;
    }
}

declare module Employees.MvcRoutes {

    export interface Employees {
        Activities: Activities;
    }

    export interface Activities {
        edit(activityId: number): string;
    }
}