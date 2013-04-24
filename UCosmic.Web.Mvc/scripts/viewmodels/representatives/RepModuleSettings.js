var ViewModels;
(function (ViewModels) {
    (function (RepModuleSettings) {
        var RepModuleSettings = (function () {
            function RepModuleSettings(welcomeMessage, emailMessage) {
                this.welcomeMessage = welcomeMessage;
                this.emailMessage = emailMessage;
            }
            return RepModuleSettings;
        })();
        RepModuleSettings.RepModuleSettings = RepModuleSettings;        
        function RepModuleSettings() {
            var self = this;
            self.isBound = ko.observable();
            self.back = function () {
                history.back();
            };
        }
    })(ViewModels.RepModuleSettings || (ViewModels.RepModuleSettings = {}));
    var RepModuleSettings = ViewModels.RepModuleSettings;
})(ViewModels || (ViewModels = {}));
