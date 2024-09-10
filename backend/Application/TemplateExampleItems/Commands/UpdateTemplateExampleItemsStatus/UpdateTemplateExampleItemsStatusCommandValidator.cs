using FluentValidation;

namespace Application.TemplateExampleItems.Commands.UpdateTemplateExampleItemsStatus
{

    public class UpdateTemplateExampleItemsStatusCommandValidator : AbstractValidator<UpdateTemplateExampleItemsStatusCommand>
    {
        public UpdateTemplateExampleItemsStatusCommandValidator()
        {
            RuleFor(x => x.ItemIds).NotEmpty();
            RuleFor(x => x.Status).IsInEnum();
        }
    }
}
