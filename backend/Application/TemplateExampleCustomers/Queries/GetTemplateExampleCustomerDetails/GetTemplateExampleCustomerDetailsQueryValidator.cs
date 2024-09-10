using FluentValidation;

namespace Application.TemplateExampleCustomers.Queries.GetTemplateExampleCustomerDetails
{

    public class GetTemplateExampleCustomerDetailsQueryValidator : AbstractValidator<GetTemplateExampleCustomerDetailsQuery>
    {
        public GetTemplateExampleCustomerDetailsQueryValidator()
        {
            RuleFor(x => x.Id)
                .NotNull();
        }
    }
}
