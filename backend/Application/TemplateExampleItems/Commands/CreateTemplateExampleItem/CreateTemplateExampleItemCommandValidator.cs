using FluentValidation;

namespace Application.TemplateExampleItems.Commands.CreateTemplateExampleItem
{

    public class CreateTemplateExampleItemCommandValidator : AbstractValidator<CreateTemplateExampleItemCommand>
    {
        public CreateTemplateExampleItemCommandValidator()
        {
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        }
    }
}
