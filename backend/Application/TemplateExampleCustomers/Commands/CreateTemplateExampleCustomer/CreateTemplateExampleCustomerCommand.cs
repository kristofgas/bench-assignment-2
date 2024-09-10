using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using Application.TemplateExampleCustomers.Commands.Models;
using Domain.Entities;
using Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.TemplateExampleCustomers.Commands.CreateTemplateExampleCustomer
{
    [TODOAuthorize]
    public class CreateTemplateExampleCustomerCommand : CreateUpdateTemplateExampleCustomerDTO, IRequest<int>
    {

        public class CreateTemplateExampleCustomerCommandHandler : IRequestHandler<CreateTemplateExampleCustomerCommand, int>
        {
            private readonly IApplicationDbContext _applicationDbContext;

            public CreateTemplateExampleCustomerCommandHandler(IApplicationDbContext applicationDbContext)
            {
                _applicationDbContext = applicationDbContext;
            }

            public async Task<int> Handle(CreateTemplateExampleCustomerCommand request, CancellationToken cancellationToken)
            {
                var emailInUse = await _applicationDbContext.TemplateExampleCustomers.AnyAsync(x => request.Email.ToLower() == x.Email.ToLower(), cancellationToken);

                if (emailInUse)
                {
                    throw new CommandErrorCodeException(Common.Exceptions.Enums.CommandErrorCode.TemplateExampleEmailInUse, nameof(request.Email), $"{request.Email} is already in use");
                }

                var customer = new TemplateExampleCustomer
                {
                    Address = new TemplateExampleAddress
                    {
                        City = request.Address.City,
                        Country = request.Address.Country,
                        State = request.Address.State,
                        Street = request.Address.Street,
                        ZipCode = request.Address.ZipCode
                    },
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Phone = request.Phone

                };
                _applicationDbContext.TemplateExampleCustomers.Add(customer);

                await _applicationDbContext.SaveChangesAsync(cancellationToken);

                return customer.Id;
            }
        }
    }
}