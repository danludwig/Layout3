﻿using System;
using System.Security.Principal;
using FluentValidation;

namespace UCosmic.Domain.Activities
{
    public class CopyActivity
    {
        internal CopyActivity(IPrincipal principal)
        {
            Principal = principal;
        }

        internal IPrincipal Principal { get; private set; }
        internal int ActivityId { get; set; }
        internal ActivityMode Mode { get; set; }
        internal bool NoCommit { get; set; }
        internal Activity CreatedActivity { get; set; }
    }

    public class ValidateCopyActivityCommand : AbstractValidator<CopyActivity>
    {
        public ValidateCopyActivityCommand(IProcessQueries queryProcessor)
        {
            CascadeMode = CascadeMode.StopOnFirstFailure;

            RuleFor(x => x.ActivityId)
                // id must exist in the database
                .MustFindActivityById(queryProcessor)
            ;
        }
    }

    public class HandleCopyActivityCommand : IHandleCommands<CopyActivity>
    {
        private readonly ICommandEntities _entities;
        private readonly IHandleCommands<CreateActivity> _createActivity;

        public HandleCopyActivityCommand(ICommandEntities entities, IHandleCommands<CreateActivity> createActivity)
        {
            _entities = entities;
            _createActivity = createActivity;
        }

        public void Handle(CopyActivity command)
        {
            if (command == null) throw new ArgumentNullException("command");

            var createActivity = new CreateActivity(command.Principal)
            {
                Mode = command.Mode,
                NoCommit = true,
            };

            _createActivity.Handle(createActivity);
            command.CreatedActivity = createActivity.CreatedActivity;

            var originalActivity = _entities.Get<Activity>().ById(command.ActivityId, false);
            command.CreatedActivity.Original = originalActivity;
            originalActivity.WorkCopy = command.CreatedActivity;

            if (!command.NoCommit) _entities.SaveChanges();
        }
    }
}
