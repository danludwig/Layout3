
var SharedMixin = {
    observable: riot.observable()
};

var app_store = new app_store()
RiotControl.addStore(app_store)
riot.mount('layout') // Kickoff the Riot app.