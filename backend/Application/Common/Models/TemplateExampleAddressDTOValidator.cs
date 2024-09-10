using FluentValidation;

namespace Application.Common.Models
{

    public class TemplateExampleAddressDTOValidator : AbstractValidator<TemplateExampleAddressDTO>
    {
        public TemplateExampleAddressDTOValidator()
        {
            RuleFor(x => x.City)
                .MinimumLength(1)
                .MaximumLength(20);

            RuleFor(x => x.Country)
                .MinimumLength(1)
                .MaximumLength(20);

            RuleFor(x => x.State)
                .MinimumLength(1)
                .MaximumLength(20);

            RuleFor(x => x.ZipCode)
                .MinimumLength(1)
                .MaximumLength(20);
        }
    }
}
