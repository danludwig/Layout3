﻿using System.Collections.Generic;
using AutoMapper;
using UCosmic.Domain.Identity;

namespace UCosmic.Web.Mvc.Models
{
    public class UserApiModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PersonId { get; set; }
        public string PersonDisplayName { get; set; }
        public IEnumerable<RoleGrant> RoleGrants { get; set; }

        public class RoleGrant
        {
            public string Id { get; set; }
            public int RoleId { get; set; }
            public string RoleName { get; set; }
            public string RoleDescription { get; set; }
        }
    }

    public class PageOfUserApiModel : PageOf<UserApiModel> { }

    public static class UserApiProfiler
    {
        public class EntityToModelProfile : Profile
        {
            protected override void Configure()
            {
                CreateMap<User, UserApiModel>()
                    .ForMember(d => d.Id, o => o.MapFrom(s => s.RevisionId))
                    .ForMember(d => d.PersonId, o => o.MapFrom(s => s.Person.RevisionId))
                    .ForMember(d => d.RoleGrants, o => o.MapFrom(s => s.Grants))
                ;

                CreateMap<RoleGrant, UserApiModel.RoleGrant>()
                    .ForMember(d => d.Id, o => o.MapFrom(s => s.RevisionId))
                    .ForMember(d => d.RoleId, o => o.MapFrom(s => s.Role.RevisionId))
                ;
            }
        }

        public class PagedQueryResultToPageOfItemsProfile : Profile
        {
            protected override void Configure()
            {
                CreateMap<PagedQueryResult<User>, PageOfUserApiModel>();
            }
        }
    }
}