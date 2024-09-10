using FluentValidation;

namespace Application.TemplateExampleOrders.Commands.DeleteTemplateExampleOrdersByCustomerId
{

    public class DeleteTemplateExampleOrdersByCustomerIdCommandValidator : AbstractValidator<DeleteTemplateExampleOrdersByCustomerIdCommand>
    {
        public DeleteTemplateExampleOrdersByCustomerIdCommandValidator()
        {
            RuleFor(x => x.CustomerId).NotNull();
        }
    }
}
