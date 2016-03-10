﻿

using System;
namespace UCosmic.Web.Mvc.Models
{
    public class ActivityMapCountsApiQueryResultModel
    {
        public int id { get; set; }
        public int personId { get; set; }
        public string name { get; set; }
        public float latitude { get; set; }
        public float longitude { get; set; }
        public bool isContinent { get; set; }
        public bool isCountry { get; set; }
        public bool isRegion { get; set; }
        public bool isWater { get; set; }
        public string code { get; set; }
        public MapPointModel center
        {
            get{
                return new MapPointModel { Latitude = latitude, Longitude = longitude };
            }
            private set
            {
                
            }
        }
    }
    public class ActivitySnapShotApiQueryResultModel
    {
        public int id { get; set; }
        public int revisionId { get; set; }
        public int personId { get; set; }
        public string name { get; set; }
        public string countryCode { get; set; }
        public int typeId { get; set; }
        public DateTime startsOn { get; set; }
        public DateTime endsOn { get; set; }
        public bool ongoing { get; set; }

    }
    
    public class ActivityMapCountsAllApiQueryResultModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public float latitude { get; set; }
        public float longitude { get; set; }
        public bool isContinent { get; set; }
        public string code { get; set; }
        public MapPointModel center
        {
            get
            {
                return new MapPointModel { Latitude = latitude, Longitude = longitude };
            }
            private set
            {

            }
        }
    }
}