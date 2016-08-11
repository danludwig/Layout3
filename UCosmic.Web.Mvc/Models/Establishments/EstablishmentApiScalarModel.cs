﻿using System;
using System.Linq;
using AutoMapper;
using UCosmic.Domain.Establishments;

namespace UCosmic.Web.Mvc.Models
{
    public class EstablishmentApiScalarModel
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public int? Rank { get; set; }
        public int TypeId { get; set; }
        public string UCosmicCode { get; set; }
        //public string ExternalId { get; set; }
        public string CeebCode { get; set; }
        public string OfficialName { get; set; }
        public string ContextName { get; set; }
        public bool IsUnverified { get; set; }
        //public string Domain { get; set; }
    }

    public static class EstablishmentApiScalarProfiler
    {
        public class EntityToModelProfile : Profile
        {
            protected override void Configure()
            {
                CreateMap<Establishment, EstablishmentApiScalarModel>()
                    .ForMember(d => d.Id, o => o.MapFrom(s => s.RevisionId))
                    .ForMember(d => d.ParentId, o => o.MapFrom(s => s.Parent != null ? s.Parent.RevisionId : (int?)null))
                    .ForMember(d => d.TypeId, o => o.MapFrom(s => s.Type.RevisionId))
                    .ForMember(d => d.CeebCode, o => o.MapFrom(s => s.CollegeBoardDesignatedIndicator))
                    .ForMember(d => d.Rank, o => o.MapFrom(s => s.VerticalRank))
                    //.ForMember(d => d.Domain, o => o.MapFrom(s => new Uri(s.WebsiteUrl).Host.ToString()))
                    .ForMember(d => d.ContextName, o => o.MapFrom(s =>
                        s.Names.Any(x => x.IsContextName && !x.IsFormerName) ? s.Names.FirstOrDefault(x => x.IsContextName && !x.IsFormerName).Text : null))
                ;
            }
        }

        public class ModelToUpdateCommandProfile : Profile
        {
            protected override void Configure()
            {
                CreateMap<EstablishmentApiScalarModel, UpdateEstablishment>()
                    .ForMember(d => d.Principal, o => o.Ignore())
                ;
            }
        }

        public class ModelToCreateCommandProfile : Profile
        {
            protected override void Configure()
            {
                CreateMap<EstablishmentApiScalarModel, CreateEstablishment>()
                    .ForMember(d => d.Principal, o => o.Ignore())
                    .ForMember(d => d.OfficialName, o => o.Ignore())
                    .ForMember(d => d.OfficialUrl, o => o.Ignore())
                    .ForMember(d => d.Location, o => o.Ignore())
                    .ForMember(d => d.Created, o => o.Ignore())
                    .ForMember(d => d.Rank, o => o.Ignore())
                ;
            }
        }
    }
}