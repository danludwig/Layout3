﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AttributeRouting;
using AttributeRouting.Web.Http;
using AutoMapper;
using FluentValidation;
using UCosmic.Domain.Activities;
using UCosmic.Domain.Employees;
using UCosmic.Domain.Places;
using UCosmic.Web.Mvc.Models;

namespace UCosmic.Web.Mvc.ApiControllers
{
    [Authorize]
    [RoutePrefix("api/activities")]
    public class ActivitiesController : ApiController
    {
        private readonly IProcessQueries _queryProcessor;
        private readonly IHandleCommands<UpdateActivity> _profileUpdateHandler;

        public ActivitiesController(IProcessQueries queryProcessor
                                    , IHandleCommands<UpdateActivity> profileUpdateHandler
            )
        {
            _queryProcessor = queryProcessor;
            _profileUpdateHandler = profileUpdateHandler;
        }

        [POST("page")]
        public PageOfActivityApiModel Page(ActivitySearchInputModel input)
        {
            if (input.PageSize < 1) { throw new HttpResponseException(HttpStatusCode.BadRequest); }

            ActivitiesByPersonIdMode query = Mapper.Map<ActivitySearchInputModel, ActivitiesByPersonIdMode>(input);

            PagedQueryResult<Activity> activities = _queryProcessor.Execute(query);

            PageOfActivityApiModel model = Mapper.Map<PageOfActivityApiModel>(activities);

            return model;
        }

        [GET("types")]
        public ICollection<ActivityTypeNameApiModel> GetTypes()
        {
            var employeeModuleSettings = _queryProcessor.Execute(
                new EmployeeModuleSettingsByUserName(User.Identity.Name));

            var model =
                Mapper.Map<ICollection<ActivityType>, ICollection<ActivityTypeNameApiModel>>(
                    employeeModuleSettings.ActivityTypes);

            return model;
        }

        [GET("locations")]
        public ICollection<ActivityLocationNameApiModel> GetLocations()
        {
            var activityPlaces = _queryProcessor.Execute(new FilteredPlaces
            {
                IsCountry = true,
                //IsBodyOfWater = true,
                IsEarth = true
            });

            var model = Mapper.Map<ICollection<Place>, ICollection<ActivityLocationNameApiModel>>(activityPlaces);

            return model;
        }        
        
        [PUT("")]
        public HttpResponseMessage Put(ActivityApiModel model)
        {
            var command = new UpdateActivity();
            Mapper.Map(model, command);

            try
            {
                _profileUpdateHandler.Handle(command);
            }
            catch (ValidationException ex)
            {
                var badRequest = Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message, "text/plain");
                return badRequest;
            }

            return Request.CreateResponse(HttpStatusCode.OK, "Your activity was saved successfully.");
        }
    }
}
