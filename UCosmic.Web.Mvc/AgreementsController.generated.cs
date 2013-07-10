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
    public partial class AgreementsController
    {
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        protected AgreementsController(Dummy d) { }

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
        public System.Web.Mvc.ViewResult Show()
        {
            return new T4MVC_System_Web_Mvc_ViewResult(Area, Name, ActionNames.Show);
        }
        [NonAction]
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public System.Web.Mvc.ActionResult Edit()
        {
            return new T4MVC_System_Web_Mvc_ActionResult(Area, Name, ActionNames.Edit);
        }

        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public AgreementsController Actions { get { return MVC.Agreements; } }
        [GeneratedCode("T4MVC", "2.0")]
        public readonly string Area = "";
        [GeneratedCode("T4MVC", "2.0")]
        public readonly string Name = "Agreements";
        [GeneratedCode("T4MVC", "2.0")]
        public const string NameConst = "Agreements";

        static readonly ActionNamesClass s_actions = new ActionNamesClass();
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public ActionNamesClass ActionNames { get { return s_actions; } }
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionNamesClass
        {
            public readonly string Index = "Index";
            public readonly string Show = "Show";
            public readonly string New = "New";
            public readonly string Edit = "Edit";
            public readonly string Settings = "Settings";
        }

        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionNameConstants
        {
            public const string Index = "Index";
            public const string Show = "Show";
            public const string New = "New";
            public const string Edit = "Edit";
            public const string Settings = "Settings";
        }


        static readonly ActionParamsClass_Index s_params_Index = new ActionParamsClass_Index();
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public ActionParamsClass_Index IndexParams { get { return s_params_Index; } }
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionParamsClass_Index
        {
            public readonly string domain = "domain";
        }
        static readonly ActionParamsClass_Show s_params_Show = new ActionParamsClass_Show();
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public ActionParamsClass_Show ShowParams { get { return s_params_Show; } }
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionParamsClass_Show
        {
            public readonly string agreementId = "agreementId";
        }
        static readonly ActionParamsClass_Edit s_params_Edit = new ActionParamsClass_Edit();
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public ActionParamsClass_Edit EditParams { get { return s_params_Edit; } }
        [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
        public class ActionParamsClass_Edit
        {
            public readonly string agreementId = "agreementId";
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
                public readonly string _Bib = "_Bib";
                public readonly string _FormBasicInfo = "_FormBasicInfo";
                public readonly string _FormContacts = "_FormContacts";
                public readonly string _FormEffectiveDatesCurrentStatus = "_FormEffectiveDatesCurrentStatus";
                public readonly string _FormFileAttachments = "_FormFileAttachments";
                public readonly string _FormOverallVisibility = "_FormOverallVisibility";
                public readonly string _FormParticipants = "_FormParticipants";
                public readonly string _FormSidebarNav = "_FormSidebarNav";
                public readonly string _SearchSideBar = "_SearchSideBar";
                public readonly string Form = "Form";
                public readonly string Index = "Index";
                public readonly string Owners = "Owners";
                public readonly string Settings = "Settings";
                public readonly string Show = "Show";
            }
            public readonly string _Bib = "~/Views/Agreements/_Bib.cshtml";
            public readonly string _FormBasicInfo = "~/Views/Agreements/_FormBasicInfo.cshtml";
            public readonly string _FormContacts = "~/Views/Agreements/_FormContacts.cshtml";
            public readonly string _FormEffectiveDatesCurrentStatus = "~/Views/Agreements/_FormEffectiveDatesCurrentStatus.cshtml";
            public readonly string _FormFileAttachments = "~/Views/Agreements/_FormFileAttachments.cshtml";
            public readonly string _FormOverallVisibility = "~/Views/Agreements/_FormOverallVisibility.cshtml";
            public readonly string _FormParticipants = "~/Views/Agreements/_FormParticipants.cshtml";
            public readonly string _FormSidebarNav = "~/Views/Agreements/_FormSidebarNav.cshtml";
            public readonly string _SearchSideBar = "~/Views/Agreements/_SearchSideBar.cshtml";
            public readonly string Form = "~/Views/Agreements/Form.cshtml";
            public readonly string Index = "~/Views/Agreements/Index.cshtml";
            public readonly string Owners = "~/Views/Agreements/Owners.cshtml";
            public readonly string Settings = "~/Views/Agreements/Settings.cshtml";
            public readonly string Show = "~/Views/Agreements/Show.cshtml";
        }
    }

    [GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]
    public class T4MVC_AgreementsController : UCosmic.Web.Mvc.Controllers.AgreementsController
    {
        public T4MVC_AgreementsController() : base(Dummy.Instance) { }

        public override System.Web.Mvc.ActionResult Index(string domain)
        {
            var callInfo = new T4MVC_System_Web_Mvc_ActionResult(Area, Name, ActionNames.Index);
            ModelUnbinderHelpers.AddRouteValues(callInfo.RouteValueDictionary, "domain", domain);
            return callInfo;
        }

        public override System.Web.Mvc.ViewResult Show(int agreementId)
        {
            var callInfo = new T4MVC_System_Web_Mvc_ViewResult(Area, Name, ActionNames.Show);
            ModelUnbinderHelpers.AddRouteValues(callInfo.RouteValueDictionary, "agreementId", agreementId);
            return callInfo;
        }

        public override System.Web.Mvc.ViewResult New()
        {
            var callInfo = new T4MVC_System_Web_Mvc_ViewResult(Area, Name, ActionNames.New);
            return callInfo;
        }

        public override System.Web.Mvc.ActionResult Edit(int agreementId)
        {
            var callInfo = new T4MVC_System_Web_Mvc_ActionResult(Area, Name, ActionNames.Edit);
            ModelUnbinderHelpers.AddRouteValues(callInfo.RouteValueDictionary, "agreementId", agreementId);
            return callInfo;
        }

        public override System.Web.Mvc.ViewResult Settings()
        {
            var callInfo = new T4MVC_System_Web_Mvc_ViewResult(Area, Name, ActionNames.Settings);
            return callInfo;
        }

    }
}

#endregion T4MVC
#pragma warning restore 1591
