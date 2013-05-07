var ViewModels;
(function (ViewModels) {
    (function (RepModuleSettings) {
        var RepModuleSettings = (function () {
            function RepModuleSettings() {
                this.welcomeMessage = ko.observable();
                this.emailMessage = ko.observable();
            }
            return RepModuleSettings;
        })();
        RepModuleSettings.RepModuleSettings = RepModuleSettings;        
    })(ViewModels.RepModuleSettings || (ViewModels.RepModuleSettings = {}));
    var RepModuleSettings = ViewModels.RepModuleSettings;
})(ViewModels || (ViewModels = {}));
