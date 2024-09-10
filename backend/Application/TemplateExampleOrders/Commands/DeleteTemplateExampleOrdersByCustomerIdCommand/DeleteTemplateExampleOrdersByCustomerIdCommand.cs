using Application.Common.Exceptions;
using Application.Common.Exceptions.Enums;
using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.TemplateExampleOrders.Commands.DeleteTemplateExampleOrdersByCustomerId
{
    [TODOAuthorize]
    public class DeleteTemplateExampleOrdersByCustomerIdCommand : IRequest<Unit>
    {
        public required int CustomerId { get; set; }

        public class DeleteTemplateExampleOrdersByCustomerIdCommandHandler : IRequestHandler<DeleteTemplateExampleOrdersByCustomerIdCommand, Unit>
        {
            private readonly IApplicationDbContext _applicationDbContext;

            public DeleteTemplateExampleOrdersByCustomerIdCommandHandler(IApplicationDbContext applicationDbContext)
            {
                _applicationDbContext = applicationDbContext;
            }

            public async Task<Unit> Handle(DeleteTemplateExampleOrdersByCustomerIdCommand request, CancellationToken cancellationToken)
            {
                var validCustomer = await _applicationDbContext.TemplateExampleCustomers.AnyAsync(x => x.Id == request.CustomerId, cancellationToken);
                if (!validCustomer)
                {
                    throw new CommandErrorCodeException(CommandErrorCode.TemplateExampleEntityNotFound, nameof(request.CustomerId));
                }

                //Warning this will bypass all change tracking and db interceptors, should be used with caution
                await _applicationDbContext.TemplateExampleOrders.Where(x => x.CustomerId == request.CustomerId).ExecuteDeleteAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}