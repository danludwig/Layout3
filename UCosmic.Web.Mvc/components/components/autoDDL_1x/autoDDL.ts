﻿/// <reference path="../../typediff/mytypes.d.ts" />
// attributes="url,selected,selectedid,list,backgroundcolor,highlightcolor,place_holder_text"
Polymer({
    is: 'is-auto-ddl',
    properties: {
        list: {
            type: Array
            , notify: true
            , observer: 'list_changed'
        }
        , fire_ref: {
            type: Object,
            notify: true
            //, observer: 'fire_ref_changed'
        }
        , is_processing: {
            type: Boolean,
            value: false
        }
        , selectedid: {
            type: Number,
            notify: true
            , value: 0
        }
        , selected: {
            type: String,
            notify: true
            , value: ''
        }
        , lastSearch: {
            type: String,
            notify: true
            , value: ''
        }
        , label: {
            type: String,
            notify: true
            , value: ''
        }
        , backgroundcolor: {
            type: String,
            notify: true
            , value: 'gray'
        }
        , highlightcolor: {
            type: String,
            notify: true
            , value: 'yellow'
        }
    },
    selectedid: 0,
    position: 0,
    isChrome: false,
    is_scrolling: false,
    created: function () {
        var isChromium = window.chrome,
            vendorName = window.navigator.vendor;
        if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc.") {
            this.isChrome = true;
        }
    },
    attached: function () {
        this.listChangeObserver();
    },
    leaveSearch: function (event, detail, sender) {
        if (!this.is_scrolling) {
            setTimeout(() => {
                this.list = [];
            }, 200);
        }
    },
    list_changed: function (newV, oldV) {
        if (newV.length == 1) {
            if (this.selected == newV[0].text) {
                this.list = [];
            }
        }
        if (newV.length > 0) {
            setTimeout(() => {
                this.$.itemsContainer.querySelector("#itemsInnerContainer").style.backgroundColor = this.backgroundcolor;
            }, 200);
        }
    },
    selectedKeyPress: function (event, detail, sender) {
        event = event || window.event;
        var charCode = event.keyCode || event.which;
        console.log(charCode);
        var limit = this.list.length - 1;
        if (charCode == 13 || charCode == 9) {
            if (!this.list || this.list.length > 0) {
                var position = this.position;
                this.selected = this.list[position].text;
                this.selectedid = this.list[position]._id;
                this.fire('selected-updated');
                this.fire('search-updated');
                this.position = 0;
                this.list = [];
            }
        } else if (charCode == 38) {
            if (this.position == 0) {
                this.position = limit
            } else {
                this.position -= 1;
            }
            this.hoverChange(false, 100);
        } else if (charCode == 40) {
            if (this.position == limit) {
                this.position = 0; 
            } else {
                this.position += 1;
            }
            this.hoverChange(false, 100);
        }
        var x = this.$.itemsContainer.children[1]
        if (x) {
            var a = x.children[this.position]
            this.is_scrolling = true;
            a.focus();
            event.target.focus();
        }
    },
    selectedChanged: function (newV, oldV) {
        if (newV == "" && oldV && oldV.length > 0) {
            this.fire('selected-updated');
            this.selected = "";
            this.selectedid = 0;
            this.fire('search-updated');
            this.position = 0;
        }
    },
    select: function (event, detail, sender) {
        var item = this.querySelector("#items").itemForElement(event.target);
        this.selectedid = item._id;
        this.selected = item.text;
        this.fire('selected-updated');
        this.list = [];
        //this.fire('ouch', { msg: 'That hurt!' });//under firing custom events in https://www.polymer-project.org/docs/polymer/polymer.html
    },
    fire_search: function () {
        this.is_scrolling = false;
        this.fire('search-updated');
    },
    listSearch: function (event, detail, sender) {
        if (this.selected == "") {
            this.selectedid = 'all';
            //this.list = [];
            //if (this.lastSearch != "") {
            this.fire('selected-updated');
            //}
        } else {
            this.fire('search-updated');
        }
    },
    listChangeObserverInner: function () {

        var container2 = this.$.itemsContainer.querySelector("#itemsInnerContainer");
        if (container2 != null && this.list.length > 0) {
            var observer2 = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    this.hoverChange(false, 200);
                });
            });
            observer2.observe(container2, {
                childList: true,
            });
        }
    },
    listChangeObserver: function () {
        var observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                this.hoverChange(false, 200);
                this.listChangeObserverInner();
            });
        });
        var container = this.$.itemsContainer;
        observer.observe(container, {
            //attributes: true,
            childList: true,
            //characterData: true
        });
    },

    hoverChange: function (newValue, speed) {
        try {
            var x = 0, elements = this.$.itemsContainer.querySelector("#itemsInnerContainer").children;
            if (elements) {
                for (x; x < elements.length; x++) {
                    if (elements[x].style.backgroundColor == this.highlightcolor) {
                        elements[x].style.backgroundColor = "transparent";
                    };
                }
                elements[this.position].style.backgroundColor = "yellow"; 
            } else {
                setTimeout(() => {
                    if (this.list && this.list.length > 0) {
                        this.hoverChange(newValue, speed)
                    }
                }, 20);
            }
        } catch (e) {
            setTimeout(() => {
                if (this.list && this.list.length > 0) {
                    this.hoverChange(newValue, speed)
                }
            }, 20);
        }
    },
    selectHover: function (event, detail, sender) {
        var item = this.querySelector("#items").itemForElement(event.target);
        this.position = _.findIndex(this.list, item);// + 1;
        this.hoverChange(false, 100);
    },
    selectHoverLeave2: function (event, detail, sender) {
        var tg = (window.event) ? event.srcElement : event.target;
        if ((!tg || tg.id != "itemsInnerContainer") && (!sender || sender.id != "itemsInnerContainer")) {
            return;
        } else {
            setTimeout(() => {
                if (this.position == 10) {
                    this.position = 0;
                    this.hoverChange(false, 200);
                }
            }, 100);
            this.position = 0;
        }
    },
    selectHoverLeave: function (event, detail, sender) {
        var item = this.querySelector("#items").itemForElement(event.target);
        this.position = _.findIndex(this.list, item);// + 1;
        this.hoverChange(true, 100);
    }
}); 