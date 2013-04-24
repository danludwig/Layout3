using System;
using FluentValidation;

namespace UCosmic.Domain.Representatives
{
    public class CreateRepModuleSettings
    {
        private string WelcomeMessage { get; set; }
        private ApplicationRecipient Recipient { get; set; }

        public class HandleCreateRepModuleSettingsCommand : IHandleCommands<CreateRepModuleSettings>
        {
            private readonly ICommandEntities _entities;
            private readonly IHandleCommands<string> _welcomeMessage;
            private readonly IHandleCommands<ApplicationRecipient> _applicationRecipient;
            private readonly IUnitOfWork _unitOfWork;

            public HandleCreateRepModuleSettingsCommand(ICommandEntities entities, IHandleCommands<string> welcomeMessage, IHandleCommands<ApplicationRecipient> applicationRecipient, IUnitOfWork unitOfWork)
            {
                _entities = entities;
                _welcomeMessage = welcomeMessage;
                _applicationRecipient = applicationRecipient;
                _unitOfWork = unitOfWork;
            }

            public void Handle(CreateRepModuleSettings command)
            {
                if (command == null) throw new ArgumentNullException("command");

                var repModuleSettings = new RepModuleSettings
                {
                    WelcomeMessage = command.WelcomeMessage,
                };
            }
        }


        public class ValidateCreateRepModuleSettingsCommand : AbstractValidator<CreateRepModuleSettings>
        {
            public ValidateCreateRepModuleSettingsCommand()
            {
                CascadeMode = CascadeMode.StopOnFirstFailure;

                RuleFor(x => x.WelcomeMessage)
                    .NotEmpty()
                    .WithMessage("Welcome Message must not be blank")
                    ;

                RuleFor(x => x.Recipient.EmailAddress)
                    .EmailAddress()
                    .WithMessage("Must be a valid Email Address")
                    ;
            }

        }
    }
}