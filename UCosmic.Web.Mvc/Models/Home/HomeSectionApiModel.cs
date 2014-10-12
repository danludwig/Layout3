﻿using AutoMapper;
using UCosmic.Domain.Home;
using UCosmic.Domain.Files;
using UCosmic.Web.Mvc.Models;
using System;
using System.Collections.Generic;

namespace UCosmic.Web.Mvc.Models
{
    [Serializable]
    public class HomeSectionApiModel
    {
        //public int Id { get; set; }
        public int EstablishmentId { get; set; }
        //public ExternalFile Photo { get; set; }
        public ICollection<HomeLink> Links { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
    [Serializable]
    public class HomeSectionApiModelReturn
    {
        public int Id { get; set; }
        public int EstablishmentId { get; set; }
        //public ExternalFile Photo { get; set; }
        public ICollection<HomeLinksApiModel> Links { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool HasPhoto { get; set; }
    }
    [Serializable]
    public class HomeLinksApiModel
    {
        public string Url { get; set; }
        public string Text { get; set; }
    }
}