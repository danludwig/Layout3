var Agreements;
(function (Agreements) {
    var Visibility = (function () {
        function Visibility() {
            this.visibility = ko.observable();
        }
        return Visibility;
    })();
    Agreements.Visibility = Visibility;
})(Agreements || (Agreements = {}));
