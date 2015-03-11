﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text.RegularExpressions;
using UCosmic.Domain.Establishments;
using UCosmic.Domain.People;
using UCosmic.Domain.Places;
using MoreLinq;

namespace UCosmic.Domain.Activities
{
    public class ActivityValuesBy : BaseEntitiesQuery<ActivityValues>, IDefineQuery<IQueryable<ActivityValues>>
    {
        public ActivityValuesBy()
        {
        }

        public IPrincipal Principal { get; set; }
        public int? PersonId { get; set; }

        public int? EstablishmentId { get; set; }
        public int? AncestorId { get; set; }

        public string EstablishmentDomain { get; set; }

        public int[] PlaceIds { get; set; }
        public string CountryCode { get; set; }
        public int[] ActivityTypeIds { get; set; }
        public DateTime? Since { get; set; }
        public DateTime? Until { get; set; }
        public bool? IncludeUndated { get; set; }
        public string Keyword { get; set; }
    }

    public class HandleActivityValuesByQuery : IHandleQueries<ActivityValuesBy, IQueryable<ActivityValues>>
    {
        private readonly IProcessQueries _queryProcessor;
        private readonly IQueryEntities _entities;
        private static readonly string PublicText = ActivityMode.Public.AsSentenceFragment();

        public HandleActivityValuesByQuery(IProcessQueries queryProcessor, IQueryEntities entities)
        {
            _queryProcessor = queryProcessor;
            _entities = entities;
        }

        public IQueryable<ActivityValues> Handle(ActivityValuesBy query)
        {

            if (query == null) throw new ArgumentNullException("query");

            IQueryable<ActivityValues> queryable = _entities.Query<ActivityValues>()
                .EagerLoad(_entities, query.EagerLoad)
                .Where(x => x.ModeText == x.Activity.ModeText // only get the values for the mode of the activity
                    && x.Activity.Original == null) // do not load activity work copies
            ;

            if (query.PersonId.HasValue)
            {
                queryable = queryable.Where(x => x.Activity.PersonId == query.PersonId.Value);
            }

            // most cases for this query will be for published activities only.
            // display draft activities only when they are owned by the principal.
            if (query.PersonId.HasValue && query.Principal != null)
            {
                var person = _queryProcessor.Execute(new MyPerson(query.Principal));
                if (person == null || person.RevisionId != query.PersonId.Value)
                {
                    queryable = queryable.Where(x => x.Activity.ModeText == PublicText);
                }
            }
            else
            {
                queryable = queryable.Where(x => x.Activity.ModeText == PublicText);
            }

            queryable = queryable.Where(x => x.Activity.Person.User != null);

            if (query.AncestorId.HasValue)
            {
                queryable = queryable.Where(x => x.Activity.Person.Affiliations.Any(y => y.EstablishmentId == query.AncestorId.Value || y.Establishment.Ancestors.Any(z => z.AncestorId == query.AncestorId.Value)));

            }

            if (query.EstablishmentId.HasValue)
            {
                //queryable = queryable.Where(x => x.Activity.Person.Affiliations.Any(y => y.IsDefault && y.EstablishmentId == query.EstablishmentId.Value));
            }
            else if (!string.IsNullOrWhiteSpace(query.EstablishmentDomain))
            {
                var establishment = _queryProcessor.Execute(new EstablishmentByDomain(query.EstablishmentDomain));
                queryable = queryable.Where(x => x.Activity.Person.Affiliations.Any(y => y.IsDefault && y.EstablishmentId == establishment.RevisionId));
            }

            if (query.ActivityTypeIds != null && query.ActivityTypeIds.Any())
            {
                queryable = queryable.Where(x => x.Types.Any(y => query.ActivityTypeIds.Contains(y.TypeId)));
            }

            // exclude undated items only when specified as false
            if (query.IncludeUndated.HasValue && !query.IncludeUndated.Value)
            {
                queryable = queryable.Where(x => x.StartsOn.HasValue || x.EndsOn.HasValue);
            }

            if (query.Since.HasValue)
            {
                queryable = queryable.Where(x =>
                    x.OnGoing.HasValue && x.OnGoing.Value // always include ongoing activities
                    || (
                        x.EndsOn.HasValue // when it has an end date
                            ? x.EndsOn >= query.Since // include it if the end date is equal or after
                            // when it has neither date, it is undated and handled by a separate filter
                            : !x.StartsOn.HasValue
                                // when it has no end date but does have start date, start must be equal or after
                                || x.StartsOn >= query.Since
                    )
                );
            }

            if (query.Until.HasValue)
            {
                queryable = queryable.Where(x =>
                    x.OnGoing.HasValue && x.OnGoing.Value && x.StartsOn.HasValue // when an activity is ongoing and has a start date
                        ? x.StartsOn <= query.Until // include it only when the start date is equal or after

                        // when an activity is not ongoing and has both start and end dates
                        : x.StartsOn.HasValue && x.EndsOn.HasValue
                            ? x.StartsOn <= query.Until && x.EndsOn <= query.Until // include it when both are equal or before

                            // when an activity is not ongoing and has only start date
                            : x.StartsOn.HasValue
                                ? x.StartsOn <= query.Until // include it when start is equal or before

                                // include all undated, which are handled by a separate filter
                                : !x.EndsOn.HasValue
                                    // when an activity is not ongoing and has only end date
                                    || x.EndsOn <= query.Until // include it when end is equal or before
                );
            }

            // when the query's country code is empty string, match all activities regardless of country.
            if (!string.IsNullOrWhiteSpace(query.CountryCode))
            {
                queryable = queryable.Where(x => x.Locations.Any(y =>
                    y.Place.IsCountry && y.Place.GeoPlanetPlace != null &&
                    query.CountryCode.Equals(y.Place.GeoPlanetPlace.Country.Code, StringComparison.OrdinalIgnoreCase)
                ));
            }

            if (query.PlaceIds != null && query.PlaceIds.Any())
            {
                var placeTag = ActivityTagDomainType.Place.AsSentenceFragment();
                var componentIds = _entities.Query<Place>().Where(x => query.PlaceIds.Contains(x.RevisionId))
                    .SelectMany(x => x.Components.Select(y => y.RevisionId)).ToArray();

                if (query.PlaceIds.Count() == 1)
                {
                    var placeIds = query.PlaceIds.Union(componentIds).ToArray();
                    queryable = queryable.Where(x =>
                        x.Locations.Any(y =>
                            placeIds.Contains(y.PlaceId) // match place exactly

                                // match place's ancestors to queried placeId, unless global
                            || (y.Place.Ancestors.Any(z => placeIds.Except(new[] { 1 }).Contains(z.AncestorId)))
                        )
                            // match based on place tags
                        || x.Tags.Any(y => y.DomainTypeText == placeTag && y.DomainKey.HasValue && placeIds.Contains(y.DomainKey.Value))
                    );
                }
                else
                {
                    var placeIds = query.PlaceIds.ToArray();
                    var greaterThan = -1;
                    //instead of counting components I should remove the id containing components and add it to the components array
                    if(componentIds.Count()>0){
                        greaterThan = 0;
                    }
                    for(int index = 0; index < placeIds.Count(); index++)
                    {
                        if (index > greaterThan)
                        {
                            var placeId = placeIds[index];
                            queryable = queryable.Where(x =>
                                x.Locations.Any(y =>
                                    placeId == y.PlaceId // match place exactly

                                        // match place's ancestors to queried placeId, unless global
                                    || (y.Place.Ancestors.Any(z => placeId == z.AncestorId))
                                )
                                    // match based on place tags
                                || x.Tags.Any(y => y.DomainTypeText == placeTag && y.DomainKey.HasValue && placeId == y.DomainKey.Value)
                            );
                        }
                    }

                    //need to add the placeID that has components to the components array
                    placeIds = componentIds.ToArray();
                    if (componentIds.Count() > 0)
                    {
                        queryable = queryable.Where(x =>
                            x.Locations.Any(y =>
                                placeIds.Contains(y.PlaceId) // match place exactly

                                    // match place's ancestors to queried placeId, unless global
                                || (y.Place.Ancestors.Any(z => placeIds.Except(new[] { 1 }).Contains(z.AncestorId)))
                            )
                                // match based on place tags
                            || x.Tags.Any(y => y.DomainTypeText == placeTag && y.DomainKey.HasValue && placeIds.Contains(y.DomainKey.Value))
                        );
                    }
                }
            }

            if (!string.IsNullOrWhiteSpace(query.Keyword))
            {
                // SQL Server can't handle a complex query like this with eager loading, so we break it up
                // query locations separately from other fields, then get the id's of each separate query, then union them together
                
                query.Keyword = query.Keyword.Replace("+", "+ ");
                var keywords2 = query.Keyword.Split(null);

                string[] keywords = Regex
                    .Matches(query.Keyword, "(?<match>[^\\s\"]+)|\"(?<match>[^\"]*)\"")
                    .Cast<Match>()
                    .Select(m => m.Groups["match"].Value.ToLower())
                    .ToArray();

                List<List<ActivityValues>> queryList = new List<List<ActivityValues>>();

                string[] negativeKeywords = keywords.Where(x => x.IndexOf("-") == 0).ToArray();

                keywords = keywords.Where(x => x.IndexOf("-") != 0).ToArray();
                foreach (var keyword in keywords.Select((x, i) => new { Value = x, Index = i }))
                {

                    if (keyword.Index != 0 && keywords[keyword.Index - 1] == "+" && keywords[keyword.Index] != "+")
                    {
                        queryable = queryable.Where(x =>
                            (x.Title != null && x.Title.Contains(keyword.Value) && x.Title.Contains(keyword.Value))
                            || (x.ContentSearchable != null && x.ContentSearchable.ToLower().Contains(keyword.Value))
                            || (x.Title != null && x.Title.ToLower().Contains(keyword.Value))
                            || (x.Activity.Person.DisplayName.ToLower().Contains(keyword.Value))
                            || (x.Tags.Any(z => z.Text.ToLower().Contains(keyword.Value)))
                            || (x.Types.Any(z => z.Type.Type.ToLower().Contains(keyword.Value)))
                            || (x.Locations.Any(z => z.Place.OfficialName.ToLower().Contains(keyword.Value)))
                            || (x.Locations.Any(l => l.Place.Ancestors.Any(z => z.Ancestor.OfficialName.ToLower().Contains(keyword.Value))))
                            );
                    }
                }

                foreach (var keyword in keywords.Select((x, i) => new { Value = x, Index = i }))
                {

                    if ((keywords[keyword.Index] != "+") && (keyword.Index == 0 || keywords[keyword.Index - 1] != "+"))
                    {
                        var tempQuery = queryable.Where(x =>
                            (x.Title != null && x.Title.Contains(keyword.Value) && x.Title.Contains(keyword.Value))
                            || (x.ContentSearchable != null && x.ContentSearchable.ToLower().Contains(keyword.Value))
                            || (x.Title != null && x.Title.ToLower().Contains(keyword.Value))
                            || (x.Activity.Person.DisplayName.ToLower().Contains(keyword.Value))
                            || (x.Tags.Any(z => z.Text.ToLower().Contains(keyword.Value)))
                            || (x.Types.Any(z => z.Type.Type.ToLower().Contains(keyword.Value)))
                            || (x.Locations.Any(z => z.Place.OfficialName.ToLower().Contains(keyword.Value)))
                            || (x.Locations.Any(l => l.Place.Ancestors.Any(z => z.Ancestor.OfficialName.ToLower().Contains(keyword.Value))))
                        );
                        queryList.Add(tempQuery.ToList());
                    }

                    
                }
                

                List<ActivityValues> myQueryable = null;
                List<ActivityValues> myQueryableLast = null;
                foreach (var myQuery in queryList.ToArray())
                {
                    
                    if(myQueryableLast != null){
                    //myQueryable.Concat(myQueryableLast).DistinctBy(c => c.)
                        myQueryable = myQuery.Union(myQueryableLast).ToList();
                    }
                    else
                    {
                        myQueryable = myQuery;
                    }
                    myQueryableLast = myQuery;
                }
                //myQueryableLast = queryable.ToList();
                //queryable = myQueryableLast.Union(myQueryable).AsQueryable();

                queryable = myQueryable.AsQueryable();

                
                foreach (var keyword in negativeKeywords.Select((x, i) => new { Value = x, Index = i }))
                {
                    var keyword2 = keyword.Value.Replace("-", "");
                    queryable = queryable.Where(x =>
                        (x.Title != null && !x.Title.Contains(keyword2))
                        && (x.ContentSearchable != null && !x.ContentSearchable.ToLower().Contains(keyword2))
                        && (x.Title != null && !x.Title.ToLower().Contains(keyword2))
                        && !x.Activity.Person.DisplayName.ToLower().Contains(keyword2)
                        && !x.Tags.Any(z => z.Text.ToLower().Contains(keyword2))
                        && !x.Types.Any(z => z.Type.Type.ToLower().Contains(keyword2))
                        && !x.Locations.Any(z => z.Place.OfficialName.ToLower().Contains(keyword2))
                        && !x.Locations.Any(l => l.Place.Ancestors.Any(z => z.Ancestor.OfficialName.ToLower().Contains(keyword2)))
                    );
                };

            }

            queryable = queryable.OrderBy(query.OrderBy);

            return queryable;
        }
    }
}
