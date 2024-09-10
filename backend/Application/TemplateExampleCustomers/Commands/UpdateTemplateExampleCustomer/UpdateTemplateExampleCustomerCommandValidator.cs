using Application.Common.Models;
using FluentValidation;

namespace Application.TemplateExampleCustomers.Commands.UpdateTemplateExampleCustomer
{

    public class UpdateTemplateExampleCustomerCommandValidator : AbstractValidator<UpdateTemplateExampleCustomerCommand>
    {
        public UpdateTemplateExampleCustomerCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .GreaterThanOrEqualTo(1);

            RuleFor(y => y.Phone)
                .MinimumLength(3)
                .MaximumLength(10);

            RuleFor(y => y.Email)
                .EmailAddress();

            RuleFor(y => y.FirstName)
                .MinimumLength(1)
                .MaximumLength(100);

            RuleFor(y => y.LastName)
                .MinimumLength(1)
                .MaximumLength(100);

            RuleFor(x => x.Address)
                .SetValidator(new TemplateExampleAddressDTOValidator());
        }
    }
}
