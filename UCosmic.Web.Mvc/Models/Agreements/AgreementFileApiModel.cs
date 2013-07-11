﻿using System;
using AutoMapper;
using UCosmic.Domain.Agreements;

namespace UCosmic.Web.Mvc.Models
{
    public class AgreementFileApiModel
    {
        public int? Id { get; set; }
        public int AgreementId { get; set; }
        public Guid? UploadGuid { get; set; }

        private string _originalName;
        private string _customName;

        public string OriginalName
        {
            get { return _originalName; }
            set
            {
                _originalName = value;
                if (string.IsNullOrWhiteSpace(CustomName))
                    CustomName = value;
            }
        }

        public string CustomName
        {
            get
            {
                if (string.IsNullOrWhiteSpace(_customName))
                    _customName = OriginalName;
                return _customName;
            }
            set { _customName = value; }
        }

        public string Visibility { get; set; }

        public string Extension
        {
            get
            {
                if (string.IsNullOrWhiteSpace(OriginalName)) return null;
                var indexOfDot = OriginalName.LastIndexOf('.');
                return indexOfDot < 0 ? null : OriginalName.Substring(indexOfDot).ToLower();
            }
        }
    }

    public static class AgreementFileProfiler
    {
        public class EntityToModelProfile : Profile
        {
            protected override void Configure()
            {
                CreateMap<AgreementFile, AgreementFileApiModel>()
                    .ForMember(d => d.UploadGuid, o => o.Ignore())
                    .ForMember(d => d.OriginalName, o => o.MapFrom(s => string.IsNullOrWhiteSpace(s.FileName) ? s.Name : s.FileName))
                    .ForMember(d => d.CustomName, o => o.MapFrom(s => s.Name))
                    .ForMember(d => d.Extension, o => o.Ignore())
                ;
            }
        }
    }
}