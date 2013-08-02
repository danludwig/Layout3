﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace UCosmic.Web.Mvc.Models
{
    public class FacultyStaffActivityType
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class FacultyStaffInstitutionInfoModel
    {
        public int? InstitutionId { get; set; }
        public bool InstitutionHasCampuses { get; set; }
        public FacultyStaffActivityType[] ActivityTypes { get; set; }
    }

    public class FacultyStaffFilterModel
    {
        public string FilterType { get; set; } // activities or people
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool UndatedActivities { get; set; }
        public int[] LocationIds { get; set; }
        public int[] ActivityTypes { get; set; }
        public int? InstitutionId { get; set; }
        public int? CampusId { get; set; }
        public int? CollegeId { get; set; }
        public int? DepartmentId { get; set; }
    }

    public class FacultyStaffActivityCountModel
    {
        public int TypeId { get; set; }
        public string Type { get; set; }
        public int Count { get; set; }
    }

    public class FacultyStaffActivitiesInCountryModel
    {
        public int PlaceId { get; set; }
        public string OfficialName { get; set; }
        public int Count { get; set; }
        public ICollection<FacultyStaffActivityCountModel> TypeCounts { get; set; }

        public FacultyStaffActivitiesInCountryModel()
        {
            TypeCounts = new Collection<FacultyStaffActivityCountModel>();
        }
    }

    public class FacultyStaffActivitiesSummaryModel
    {
        public int TotalActivities { get; set; }
        public int TotalCountriesWithActivities { get; set; }
        public ICollection<FacultyStaffActivitiesInCountryModel> CountryCounts { get; set; }

        public FacultyStaffActivitiesSummaryModel()
        {
            CountryCounts = new Collection<FacultyStaffActivitiesInCountryModel>();
        }
    }
}