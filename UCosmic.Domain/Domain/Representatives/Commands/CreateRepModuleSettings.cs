using System;
using System.Collections.Generic;
using FluentValidation;

namespace UCosmic.Domain.Representatives
{
    public class CreateRepModuleSettings
    {
        public string WelcomeMessage { get; set; }
        public IEnumerable<string> RecipientEmailAddresses { get; set; }
    }

    public class HandleCreateRepModuleSettingsCommand : IHandleCommands<CreateRepModuleSettings>
    {
        private readonly ICommandEntities _entities;
        //private readonly IHandleCommands<string> _welcomeMessage;
        //private readonly IHandleCommands<ApplicationRecipient> _applicationRecipient;
        private readonly IUnitOfWork _unitOfWork;

        public HandleCreateRepModuleSettingsCommand(ICommandEntities entities, IUnitOfWork unitOfWork)
        {
            _entities = entities;
            //_welcomeMessage = welcomeMessage;
            //_applicationRecipient = applicationRecipient;
            _unitOfWork = unitOfWork;
        }

        public void Handle(CreateRepModuleSettings command)
        {
            if (command == null) throw new ArgumentNullException("command");

            var recipients = new List<ApplicationRecipient>();
            foreach (var email in command.RecipientEmailAddresses)
            {
                var recipient = new ApplicationRecipient();
                recipient.EmailAddress = email;

                recipients.Add(recipient);
            }

            var repModuleSettings = new RepModuleSettings
            {
                WelcomeMessage = command.WelcomeMessage,
                ApplicationRecipients = recipients
            };

            _entities.Create(repModuleSettings);
            _unitOfWork.SaveChanges();
        }
    }
    /*
    public class ValidateCreateRepModuleSettingsCommand : AbstractValidator<CreateRepModuleSettings>
    {

        public ValidateCreateRepModuleSettingsCommand()
        {
            CascadeMode = CascadeMode.StopOnFirstFailure;

            RuleFor(x => x.RecipientEmailAddresses).SetCollectionValidator(
                    new EmailValidator("RecipientEmailAddresses")
                );

        }

    }

    public class EmailValidator : AbstractValidator<string>
    {
     * 
        public EmailValidator(string ApplicationRecipient)
        {
            RuleFor(x => x)
                .EmailAddress();
        }
    }
     * */
}