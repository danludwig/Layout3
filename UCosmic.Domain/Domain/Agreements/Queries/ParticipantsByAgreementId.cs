﻿using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Principal;
using UCosmic.Domain.Identity;

namespace UCosmic.Domain.Agreements
{
    public class ParticipantsByAgreementId : BaseEntitiesQuery<AgreementParticipant>, IDefineQuery<AgreementParticipant[]>
    {
        public ParticipantsByAgreementId(IPrincipal principal, int? agreementId)
        {
            if (principal == null) throw new ArgumentNullException("principal");
            Principal = principal;
            AgreementId = agreementId;
        }

        public IPrincipal Principal { get; private set; }
        public int? AgreementId { get; private set; }
    }

    public class HandleParticipantsByAgreementIdQuery : IHandleQueries<ParticipantsByAgreementId, AgreementParticipant[]>
    {
        private readonly IQueryEntities _entities;
        private readonly IProcessQueries _queryProcessor;

        public HandleParticipantsByAgreementIdQuery(IQueryEntities entities, IProcessQueries queryProcessor)
        {
            _entities = entities;
            _queryProcessor = queryProcessor;
        }

        public AgreementParticipant[] Handle(ParticipantsByAgreementId query)
        {
            if (query == null) throw new ArgumentNullException("query");

            // when agreement id is not known or valid, return user's default affiliation
            if (!query.AgreementId.HasValue || query.AgreementId == 0)
            {
                // return nothing when there is no username
                if (string.IsNullOrWhiteSpace(query.Principal.Identity.Name)) return null;

                // return nothing when user is not an agreement manager or supervisor
                if (!query.Principal.IsInAnyRole(RoleName.AgreementManagers)) return null;

                var user = _queryProcessor.Execute(new UserByName(query.Principal.Identity.Name)
                {
                    EagerLoad = new Expression<Func<User, object>>[]
                    {
                        x => x.Person.Affiliations.Select(y => y.Establishment),
                    }
                });
                if (user == null) return null;

                var owningEstablishment = user.Person.DefaultAffiliation.Establishment;
                var participant = new AgreementParticipant
                {
                    IsOwner = true,
                    Agreement = new Agreement(),
                    Establishment = owningEstablishment,
                };
                return new[] { participant };
            }

            var participants = _entities.Query<AgreementParticipant>()
                .EagerLoad(_entities, query.EagerLoad)
                .Where(x => x.Agreement.Id == query.AgreementId.Value)
                .OrderBy(query.OrderBy)
            ;

            return participants.ToArray();
        }
    }
}