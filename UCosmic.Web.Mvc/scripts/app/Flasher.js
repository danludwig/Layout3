var App;
(function (App) {
    var ticks;
    var tickInterval;

    function init(flasher) {
        if (flasher.text()) {
            window.clearInterval(tickInterval);
            ticks = 9;
            flasher.tickCount(ticks);
            tickInterval = window.setInterval(function () {
                tick(flasher);
            }, 1000);
            flasher.isDismissing(false);
            flasher.isDismissed(false);
            flasher.$element.hide().removeClass('hide').fadeIn('fast');
        } else {
            flasher.isDismissed(true);
            flasher.isDismissing(false);
            if (tickInterval)
                window.clearInterval(tickInterval);
            if (flasher.$element)
                flasher.$element.addClass('hide');
        }
    }

    function tick(flasher) {
        if (ticks <= 0) {
            ticks = 0;
            window.clearInterval(tickInterval);
            flasher.dismiss();
        } else {
            --ticks;
        }
        flasher.tickCount(ticks);
    }

    var Flasher = (function () {
        function Flasher() {
            var _this = this;
            this.text = ko.observable();
            this.tickCount = ko.observable(9);
            this.isDismissing = ko.observable();
            this.isDismissed = ko.observable();
            this.$element = undefined;
            ko.computed(function () {
                init(_this);
            });
        }
        Flasher.prototype.flash = function (text) {
            this.text(undefined);
            if (text)
                this.text(text);
        };

        Flasher.prototype.dismiss = function () {
            var _this = this;
            this.isDismissing(true);
            this.$element.fadeOut('slow', function () {
                _this.text('');
                _this.$element.addClass('hide');
            });
        };
        return Flasher;
    })();
    App.Flasher = Flasher;

    App.flasher = new Flasher();

    var FlasherProxy = (function () {
        function FlasherProxy() {
            var _this = this;
            this.text = ko.computed(function () {
                return App.flasher.text();
            });
            this.isVisible = ko.computed(function () {
                if (App.flasher.isDismissing() || App.flasher.isDismissed()) {
                    return false;
                }
                return _this.text() ? true : false;
            });
        }
        FlasherProxy.prototype.dismiss = function () {
            App.flasher.dismiss();
        };
        return FlasherProxy;
    })();
    App.FlasherProxy = FlasherProxy;
})(App || (App = {}));
