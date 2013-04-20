
using System.Collections.Generic;
using FluentValidation;

namespace UCosmic.Domain.Representatives
{
    public class CreateRepModuleSettings
    {
        public string WelcomeMessage { get; set; }

        public class HandleSeedRepModuleSettingsCommand : IHandleCommands<CreateRepModuleSettings>
        {
            public void Handle(CreateRepModuleSettings command)
            {

            }
        }

        public class ValidateCreateRepModuleSettingsCommand : AbstractValidator<CreateRepModuleSettings>
        {
            public ValidateCreateRepModuleSettingsCommand(IValidator<CreateRepModuleSettings> welcomeMessage ,IValidator<CreateRepModuleSettings> emailAddress)
            {
                CascadeMode = CascadeMode.StopOnFirstFailure;

                RuleFor(x => x.WelcomeMessage)
                    .NotEmpty()
                    .WithMessage("Welcome Message must not be blank")
                ;
            }
        }
    }
}