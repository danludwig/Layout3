﻿//using System;
//using System.Diagnostics;
//using System.Linq;

//namespace UCosmic.Domain.People
//{
//    public class PurgeHorizontalAffiliations : IDefineWork
//    {
//        public TimeSpan Interval { get { return TimeSpan.FromMilliseconds(int.MaxValue); } }
//    }

//    public class PerformPurgeHorizontalAffiliationsWork : IPerformWork<PurgeHorizontalAffiliations>
//    {
//        private readonly ICommandEntities _entities;
//        private readonly ISendMail _mailSender;
//        private readonly ILogExceptions _exceptionLogger;
//        private static bool _mailSent;

//        public PerformPurgeHorizontalAffiliationsWork(ICommandEntities entities, ISendMail mailSender, ILogExceptions exceptionLogger)
//        {
//            _entities = entities;
//            _mailSender = mailSender;
//            _exceptionLogger = exceptionLogger;
//        }

//        public void Perform(PurgeHorizontalAffiliations job)
//        {
//            var reportBuilder = new WorkReportBuilder("Purge Horizontal Affiliations");
//            try
//            {
//                // get all horizontal affiliations from the database
//                var horizontals = _entities.Get<Affiliation>().Where(x => x.DepartmentId.HasValue)
//                    .OrderBy(x => x.PersonId)
//                    .ToArray();

//                // double check to make sure none of these are default affiliations
//                if (horizontals.Any(x => x.IsDefault))
//                    throw new InvalidOperationException("Found unexpected default horizontal affiliation.");

//                // delete all of these
//                var isChanged = false;
//                foreach (var horizontal in horizontals)
//                {
//                    // make sure we have a vertical
//                    var vertical = _entities.Query<Affiliation>()
//                        .SingleOrDefault(x => x.EstablishmentId == horizontal.DepartmentId.Value && x.PersonId == horizontal.PersonId);
//                    if (vertical == null) throw new InvalidOperationException("Cannot delete horizontal affiliation because a matching vertical has not been created.");

//                    _entities.Purge(horizontal);
//                    isChanged = true;
//                }

//                if (isChanged) _entities.SaveChanges();
//            }
//            catch (Exception ex)
//            {
//                reportBuilder.Report("");
//                reportBuilder.Report("JOB FAILED!");
//                reportBuilder.Report(ex.GetType().Name);
//                reportBuilder.Report(ex.Message);
//                reportBuilder.Report(ex.StackTrace);
//                _exceptionLogger.Log(ex);
//                if (!_mailSent)
//                    reportBuilder.Send(_mailSender);
//                _mailSent = true;
//            }
//            //finally // do not want to receive emails indicating success every 10 minutes
//            //{
//            //    if (!_mailSent)
//            //        reportBuilder.Send(_mailSender);
//            //    _mailSent = true;
//            //}
//        }
//    }
//}