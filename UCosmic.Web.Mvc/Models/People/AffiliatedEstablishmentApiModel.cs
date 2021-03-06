﻿using System.Linq;
using AutoMapper;
using UCosmic.Domain.Establishments;

namespace UCosmic.Web.Mvc.Models
{
    public class AffiliatedEstablishmentApiModel
    {
        public int EstablishmentId { get; set; }
        public string DisplayName { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }
    }

    public static class AffiliatedEstablishmentApiProfiler
    {
        public class EntityToModel : Profile
        {
            protected override void Configure()
            {
                CreateMap<Establishment, AffiliatedEstablishmentApiModel>()
                    .ForMember(d => d.EstablishmentId, o => o.MapFrom(s => s.RevisionId))
                    .ForMember(d => d.DisplayName, o => o.MapFrom(s =>
                        s.Names.Any(x => x.IsContextName) ? s.Names.First(x => x.IsContextName).Text : s.TranslatedName.Text))
                    .ForMember(d => d.Type, o => o.MapFrom(s => s.Type.EnglishName))
                    .ForMember(d => d.Category, o => o.MapFrom(s => s.Type.Category.EnglishName))
                ;
            }
        }
    }
}