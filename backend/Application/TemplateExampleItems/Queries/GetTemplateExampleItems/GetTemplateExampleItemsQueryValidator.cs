using FluentValidation;

namespace Application.TemplateExampleItems.Queries.GetTemplateExampleItems
{

    public class GetTemplateExampleItemsQueryValidator : AbstractValidator<GetTemplateExampleItemsQuery>
    {
        public GetTemplateExampleItemsQueryValidator()
        {
            When(x => x.Status.HasValue, () =>
            {
                RuleFor(x => x.Status).IsInEnum();
            });
        }
    }
}
