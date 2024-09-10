using Application.Common.Exceptions;
using Application.Common.Exceptions.Enums;
using Application.Common.Interfaces;
using Application.Common.Security;
using Application.TemplateExampleCustomers.Commands.Models;
using Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.TemplateExampleCustomers.Commands.UpdateTemplateExampleCustomer
{
    [TODOAuthorize]

    public class UpdateTemplateExampleCustomerCommand : CreateUpdateTemplateExampleCustomerDTO, IRequest<Unit>
    {
        public required int Id { get; set; }

        public class UpdateTemplateExampleCustomerCommandHandler : IRequestHandler<UpdateTemplateExampleCustomerCommand, Unit>
        {
            private readonly IApplicationDbContext _applicationDbContext;

            public UpdateTemplateExampleCustomerCommandHandler(IApplicationDbContext applicationDbContext)
            {
                _applicationDbContext = applicationDbContext;
            }

            public async Task<Unit> Handle(UpdateTemplateExampleCustomerCommand request, CancellationToken cancellationToken)
            {
                var customer = await _applicationDbContext.TemplateExampleCustomers.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
                if (customer == null)
                {
                    throw new CommandErrorCodeException(CommandErrorCode.TemplateExampleEntityNotFound);
                }

                if (!request.Email.Equals(customer.Email, StringComparison.CurrentCultureIgnoreCase))
                {
                    var emailInUse = await _applicationDbContext.TemplateExampleCustomers.AnyAsync(x => request.Email.ToLower() == x.Email.ToLower(), cancellationToken);
                    if (emailInUse)
                    {
                        throw new CommandErrorCodeException(CommandErrorCode.TemplateExampleEmailInUse, nameof(request.Email), $"{request.Email} is already in use");
                    }
                    customer.Email = request.Email;
                }

                customer.FirstName = request.FirstName;
                customer.LastName = request.LastName;
                customer.Phone = request.Phone;
                customer.Address = new TemplateExampleAddress
                {
                    City = request.Address.City,
                    Country = request.Address.Country,
                    State = request.Address.State,
                    Street = request.Address.Street,
                    ZipCode = request.Address.ZipCode
                };

                _applicationDbContext.TemplateExampleCustomers.Update(customer);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}