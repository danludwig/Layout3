﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Web.Http;
using AttributeRouting;
using AttributeRouting.Web.Http;
using AutoMapper;
using Links;
using UCosmic.Domain.Places;
using UCosmic.Web.Mvc.Models;
using PlaceByWoeId = UCosmic.Domain.Places.PlaceByWoeId;

namespace UCosmic.Web.Mvc.ApiControllers
{
    [RoutePrefix("api/places")]
    public class PlacesController : ApiController
    {
        private readonly IProcessQueries _queryProcessor;

        public PlacesController(IProcessQueries queryProcessor)
        {
            _queryProcessor = queryProcessor;
        }

        //[CacheHttpGet(Duration = 3600)]
        [GET("")]
        public IEnumerable<PlaceApiModel> Get([FromUri] PlaceFilterInputModel input)
        {
            IEnumerable<PlaceApiModel> models = new Collection<PlaceApiModel>();
            //System.Threading.Thread.Sleep(2000); // test api latency

            /* TBD - To get around issue with KendoUI Multiselect. */
            if (input.Keyword != "~")
            {
                var query = Mapper.Map<FilteredPlaces>(input);
                query.EagerLoad = new Expression<Func<Place, object>>[]
                {
                    x => x.Parent,
                    x => x.GeoPlanetPlace,
                };
                var entities = _queryProcessor.Execute(query);
                models = Mapper.Map<PlaceApiModel[]>(entities);
            }

            return models;
        }

        //[CacheHttpGet(Duration = 3600)]
        [GET("{placeId:int}")]
        public PlaceApiModel Get(int placeId)
        {
            //System.Threading.Thread.Sleep(2000); // test api latency

            var query = new PlaceById(placeId);
            var entity = _queryProcessor.Execute(query);
            var model = Mapper.Map<PlaceApiModel>(entity);
            return model;
        }

        //[CacheHttpGet(Duration = 3600)]
        [GET("by-coordinates/{latitude}/{longitude}")]
        public IEnumerable<PlaceApiModel> Get(double latitude, double longitude)
        {
            //System.Threading.Thread.Sleep(5000); // test api latency

            var foundWoeId = _queryProcessor.Execute(new WoeIdByCoordinates(latitude, longitude));
            if (foundWoeId > 0 && foundWoeId != GeoPlanetPlace.EarthWoeId)
            {
                var place = _queryProcessor.Execute(new PlaceByWoeId(foundWoeId)
                {
                    EagerLoad = new Expression<Func<Place, object>>[]
                    {
                        x => x.Ancestors.Select(y => y.Ancestor),
                    },
                });
                var maxDepth = 5;
                var places = new List<Place>();
                var ancestor = place.Parent;// = ancestors;
                for (var i = 0; i < maxDepth; i++)
                {
                    places.Add(ancestor);
                    ancestor = ancestor.Parent;
                    if (ancestor == null)
                    {
                        i = 5;
                    }
                }


                places.Add(place);
                return Mapper.Map<PlaceApiModel[]>(places);
            }
            return Enumerable.Empty<PlaceApiModel>();
        }

        //[CacheHttpGet(Duration = 3600)]
        [GET("{placeId:int}/children")]
        public IEnumerable<PlaceApiModel> GetChildren(int placeId)
        {

            var query = new PlaceById(placeId)
            {
                EagerLoad = new Expression<Func<Place, object>>[]
                {
                    x => x.Children.Select(y => y.GeoPlanetPlace),
                }
            };
            var entity = _queryProcessor.Execute(query);
            var models = Mapper.Map<PlaceApiModel[]>(entity.Children);
            return models;
        }
    }
}
