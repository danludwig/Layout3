﻿Polymer('polymer-content-edit-home-page', {
    cancel: 0,
    addedSection: "",
    ready: function () {
        if (this.notification) {
            var polymerNotification = document.createElement('polymer-notification');
            polymerNotification.message = "testing";
            polymerNotification.type = 'notify';
            polymerNotification.fadeOutDelay = '10000';
            polymerNotification.bindToElement = $("header > .container > .content");

            polymerNotification.setAttribute('id', 'myAlert' + Date.now());
            document.body.appendChild(polymerNotification);
        }
        if (this.homeSections && !this.homeSections[0].title) {
            var homeSections = JSON.parse(this.homeSections);
            if (!homeSections.length) {
                this.homeSections = [];
                this.homeSections[0] = homeSections;
                if (this.homeSections.length) {
                    this.homeSections = null;
                }
            } else {
                this.homeSections = homeSections;
            }
        }
    },
    addSection: function (e) {
        this.$.sectionEditor.style.display = 'block';
        this.$.addNewSection.style.display = 'none';
    },
    addedSectionChanged: function (oldValue, newValue) {
        if (newValue) {
            this.addedSection = false;
            if (!this.homeSections || this.homeSections.length == 0) {
                this.homeSections = [];
                this.homeSections[0] = { title: this.sectionAdded.title, description: this.sectionAdded.description, links: this.sectionAdded.links, id: this.sectionAdded.id, hasPhoto: this.sectionAdded.hasPhoto };
            } else {
                this.homeSections.push({ title: this.sectionAdded.title, description: this.sectionAdded.description, links: this.sectionAdded.links, id: this.sectionAdded.id, hasPhoto: this.sectionAdded.hasPhoto });
            }
        }
    },
    cancelChanged: function (oldValue, newValue) {
        this.$.sectionEditor.style.display = 'none';
        this.$.addNewSection.style.display = 'block';
    }
});