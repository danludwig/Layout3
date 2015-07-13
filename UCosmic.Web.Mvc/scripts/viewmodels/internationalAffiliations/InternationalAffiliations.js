var ViewModels;
(function (ViewModels) {
    var InternationalAffiliations;
    (function (InternationalAffiliations) {
        var InternationalAffiliationSearchInput = (function () {
            function InternationalAffiliationSearchInput() {
            }
            return InternationalAffiliationSearchInput;
        })();
        InternationalAffiliations.InternationalAffiliationSearchInput = InternationalAffiliationSearchInput;
        var InternationalAffiliationList = (function () {
            function InternationalAffiliationList(personId) {
                this.personId = personId;
            }
            InternationalAffiliationList.prototype.load = function () {
                var _this = this;
                var deferred = $.Deferred();
                var affiliationSearchInput = new InternationalAffiliationSearchInput();
                affiliationSearchInput.personId = this.personId;
                affiliationSearchInput.orderBy = "";
                affiliationSearchInput.pageNumber = 1;
                affiliationSearchInput.pageSize = App.Constants.int32Max;
                $.get(App.Routes.WebApi.InternationalAffiliations.get(), affiliationSearchInput)
                    .done(function (data, textStatus, jqXHR) {
                    {
                        ko.mapping.fromJS(data, {}, _this);
                        deferred.resolve();
                    }
                })
                    .fail(function (jqXhr, textStatus, errorThrown) {
                    {
                        deferred.reject(jqXhr, textStatus, errorThrown);
                    }
                });
                return deferred;
            };
            InternationalAffiliationList.prototype.deleteAffiliationById = function (affiliationId) {
                $.ajax({
                    async: false,
                    type: "DELETE",
                    url: App.Routes.WebApi.InternationalAffiliations.del(affiliationId),
                    success: function (data, textStatus, jqXHR) { },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(textStatus);
                    }
                });
            };
            InternationalAffiliationList.prototype.deleteAffiliation = function (data, event, viewModel) {
                $("#confirmInternationalAffiliationDeleteDialog").dialog({
                    dialogClass: 'jquery-ui',
                    width: 'auto',
                    resizable: false,
                    modal: true,
                    buttons: [
                        {
                            text: "Yes, confirm delete", click: function () {
                                viewModel.deleteAffiliationById(data.id());
                                $(this).dialog("close");
                                location.href = App.Routes.Mvc.My.Profile.get("international-affiliation");
                            }
                        },
                        {
                            text: "No, cancel delete", click: function () {
                                $(this).dialog("close");
                            }
                        },
                    ]
                });
            };
            InternationalAffiliationList.prototype.editUrl = function (affiliationId) {
                return App.Routes.Mvc.My.InternationalAffiliations.edit(affiliationId);
            };
            InternationalAffiliationList.prototype.formatLocations = function (locations) {
                var formattedLocations = "";
                for (var i = 0; i < locations.length; i += 1) {
                    if (i > 0) {
                        formattedLocations += ", ";
                    }
                    formattedLocations += locations[i].placeOfficialName();
                }
                return formattedLocations;
            };
            InternationalAffiliationList.prototype.formatDates = function (from, to, onGoing) {
                var formattedDateRange = from.toString();
                if (onGoing) {
                    formattedDateRange += " (Ongoing)";
                }
                else if (to != null) {
                    formattedDateRange += " - " + to.toString();
                }
                if (formattedDateRange.length > 0) {
                    formattedDateRange += "\xa0\xa0";
                }
                return formattedDateRange;
            };
            return InternationalAffiliationList;
        })();
        InternationalAffiliations.InternationalAffiliationList = InternationalAffiliationList;
    })(InternationalAffiliations = ViewModels.InternationalAffiliations || (ViewModels.InternationalAffiliations = {}));
})(ViewModels || (ViewModels = {}));
