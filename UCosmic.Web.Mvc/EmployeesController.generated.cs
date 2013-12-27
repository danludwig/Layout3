// <auto-generated />
// This file was generated by a T4 template.
// Don't change it directly as your change would get overwritten.  Instead, make changes
// to the .tt file (i.e. the T4 template) and save it to regenerate this file.

// Make sure the compiler doesn't complain about missing Xml comments
#pragma warning disable 1591
#region T4MVC

using System;
using System.Diagnostics;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;
using System.Web.Mvc.Html;
using System.Web.Routing;
using T4MVC;
namespace UCosmic.Web.Mvc.Controllers
{
    public partial class EmployeesController
    {
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        protected EmployeesController(Dummy d) { }

        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        protected RedirectToRouteResult RedirectToAction(ActionResult result)
        {
            var callInfo = result.GetT4MVCResult();
            return RedirectToRoute(callInfo.RouteValueDictionary);
        }

        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        protected RedirectToRouteResult RedirectToActionPermanent(ActionResult result)
        {
            var callInfo = result.GetT4MVCResult();
            return RedirectToRoutePermanent(callInfo.RouteValueDictionary);
        }

        [NonAction]
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public System.Web.Mvc.ActionResult TenantIndex()
        {
            return new T4MVC_System_Web_Mvc_ActionResult(Area, Name, ActionNames.TenantIndex);
        }
        [NonAction]
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public System.Web.Mvc.ActionResult Table()
        {
            return new T4MVC_System_Web_Mvc_ActionResult(Area, Name, ActionNames.Table);
        }

        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public EmployeesController Actions { get { return MVC.Employees; } }
        [GeneratedCode("T4MVC", "2.0")]
        public readonly string Area = "";
        [GeneratedCode("T4MVC", "2.0")]
        public readonly string Name = "Employees";
        [GeneratedCode("T4MVC", "2.0")]
        public const string NameConst = "Employees";

        static readonly ActionNamesClass s_actions = new ActionNamesClass();
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public ActionNamesClass ActionNames { get { return s_actions; } }
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionNamesClass
        {
            public readonly string Index = "Index";
            public readonly string TenantIndex = "TenantIndex";
            public readonly string Table = "Table";
        }

        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionNameConstants
        {
            public const string Index = "Index";
            public const string TenantIndex = "TenantIndex";
            public const string Table = "Table";
        }


        static readonly ActionParamsClass_TenantIndex s_params_TenantIndex = new ActionParamsClass_TenantIndex();
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public ActionParamsClass_TenantIndex TenantIndexParams { get { return s_params_TenantIndex; } }
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionParamsClass_TenantIndex
        {
            public readonly string domain = "domain";
        }
        static readonly ActionParamsClass_Table s_params_Table = new ActionParamsClass_Table();
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public ActionParamsClass_Table TableParams { get { return s_params_Table; } }
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionParamsClass_Table
        {
            public readonly string domain = "domain";
            public readonly string input = "input";
        }
        static readonly ViewsClass s_views = new ViewsClass();
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public ViewsClass Views { get { return s_views; } }
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ViewsClass
        {
            static readonly _ViewNamesClass s_ViewNames = new _ViewNamesClass();
            public _ViewNamesClass ViewNames { get { return s_ViewNames; } }
            public class _ViewNamesClass
            {
                public readonly string _ActivityDatesDisplay = "_ActivityDatesDisplay";
                public readonly string _Bib = "_Bib";
                public readonly string Index = "Index";
                public readonly string Table = "Table";
                public readonly string TenantIndex = "TenantIndex";
            }
            public readonly string _ActivityDatesDisplay = "~/Views/Employees/_ActivityDatesDisplay.cshtml";
            public readonly string _Bib = "~/Views/Employees/_Bib.cshtml";
            public readonly string Index = "~/Views/Employees/Index.cshtml";
            public readonly string Table = "~/Views/Employees/Table.cshtml";
            public readonly string TenantIndex = "~/Views/Employees/TenantIndex.cshtml";
        }
    }

    [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
    public class T4MVC_EmployeesController : UCosmic.Web.Mvc.Controllers.EmployeesController
    {
        public T4MVC_EmployeesController() : base(Dummy.Instance) { }

        public override System.Web.Mvc.ActionResult Index()
        {
            var callInfo = new T4MVC_System_Web_Mvc_ActionResult(Area, Name, ActionNames.Index);
            return callInfo;
        }

        public override System.Web.Mvc.ActionResult TenantIndex(string domain)
        {
            var callInfo = new T4MVC_System_Web_Mvc_ActionResult(Area, Name, ActionNames.TenantIndex);
            ModelUnbinderHelpers.AddRouteValues(callInfo.RouteValueDictionary, "domain", domain);
            return callInfo;
        }

        public override System.Web.Mvc.ActionResult Table(string domain, UCosmic.Web.Mvc.Models.ActivitySearchInputModel input)
        {
            var callInfo = new T4MVC_System_Web_Mvc_ActionResult(Area, Name, ActionNames.Table);
            ModelUnbinderHelpers.AddRouteValues(callInfo.RouteValueDictionary, "domain", domain);
            ModelUnbinderHelpers.AddRouteValues(callInfo.RouteValueDictionary, "input", input);
            return callInfo;
        }

    }
}

#endregion T4MVC
#pragma warning restore 1591
