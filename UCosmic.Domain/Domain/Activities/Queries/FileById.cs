﻿using System;
using System.Security.Principal;

namespace UCosmic.Domain.Activities
{
    public class FileById : BaseEntityQuery<ActivityDocument>, IDefineQuery<ActivityDocument>
    {
        public FileById(IPrincipal principal, int ActivityId, int fileId)
        {
            if (principal == null) throw new ArgumentNullException("principal");
            Principal = principal;
            ActivityId = ActivityId;
            FileId = fileId;
        }

        public IPrincipal Principal { get; private set; }
        public int ActivityId { get; private set; }
        public int FileId { get; private set; }
    }

    public class HandleFileByIdQuery : IHandleQueries<FileById, ActivityDocument>
    {
        private readonly IQueryEntities _entities;
        private readonly IProcessQueries _queryProcessor;

        public HandleFileByIdQuery(IQueryEntities entities, IProcessQueries queryProcessor)
        {
            _entities = entities;
            _queryProcessor = queryProcessor;
        }

        public ActivityDocument Handle(FileById query)
        {
            if (query == null) throw new ArgumentNullException("query");

            var entity = _entities.Query<ActivityDocument>()
                .EagerLoad(_entities, query.EagerLoad)
                .ByActivityId(query.ActivityId)
                .VisibleTo(query.Principal, _queryProcessor)
                .ById(query.FileId)
            ;

            return entity;
        }
    }
}
