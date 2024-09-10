using FluentValidation;

namespace Application.TemplateExampleOrders.Commands.CreateTemplateExampleOrder
{

    public class CreateTemplateExampleOrderCommandValidator : AbstractValidator<CreateTemplateExampleOrderCommand>
    {
        public CreateTemplateExampleOrderCommandValidator()
        {
            RuleFor(x => x.Items)
                .NotEmpty();

            RuleForEach(x => x.Items).ChildRules(items =>
            {
                items.RuleFor(x => x.Count).GreaterThan(0);
                items.RuleFor(x => x.ItemId).NotNull();
            });
        }
    }
}
