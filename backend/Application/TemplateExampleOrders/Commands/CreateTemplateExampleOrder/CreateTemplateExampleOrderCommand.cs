using Application.Common.Exceptions;
using Application.Common.Exceptions.Enums;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Entities;
using Domain.Enums;
using Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.TemplateExampleOrders.Commands.CreateTemplateExampleOrder
{
    [TODOAuthorize]
    public class CreateTemplateExampleOrderCommand : IRequest<int>
    {
        public required TemplateExampleAddressDTO ShippingAddress { get; set; }
        public required int CustomerId { get; set; }
        public required ICollection<TemplateExampleOrderItemDTO> Items { get; set; }


        public class CreateTemplateExampleOrderCommandHandler : IRequestHandler<CreateTemplateExampleOrderCommand, int>
        {
            private readonly IApplicationDbContext _applicationDbContext;

            public CreateTemplateExampleOrderCommandHandler(IApplicationDbContext applicationDbContext)
            {
                _applicationDbContext = applicationDbContext;
            }

            public async Task<int> Handle(CreateTemplateExampleOrderCommand request, CancellationToken cancellationToken)
            {

                var validCustomer = await _applicationDbContext.TemplateExampleCustomers.AnyAsync(x => x.Id == request.CustomerId, cancellationToken);
                if (!validCustomer)
                {
                    throw new CommandErrorCodeException(CommandErrorCode.TemplateExampleEntityNotFound, nameof(request.CustomerId));
                }

                var orderItems = await _applicationDbContext.TemplateExampleItems.Join(request.Items, item => item.Id, orderItemDTO => orderItemDTO.ItemId,
                    (item, orderItemDTO) => new { item, orderItemDTO }).ToListAsync(cancellationToken);

                if (orderItems.Count != request.Items.Count)
                {
                    throw new CommandErrorCodeException(CommandErrorCode.TemplateExampleEntityNotFound, nameof(request.Items), "One or more items not found");
                }

                var order = new TemplateExampleOrder
                {
                    CustomerId = request.CustomerId,
                    ShippingAddress = new TemplateExampleAddress
                    {
                        City = request.ShippingAddress.City,
                        Country = request.ShippingAddress.Country,
                        State = request.ShippingAddress.State,
                        Street = request.ShippingAddress.Street,
                        ZipCode = request.ShippingAddress.ZipCode
                    },
                    OrderItems = orderItems.Select(x => new TemplateExampleOrderItem
                    {
                        ItemId = x.item.Id,
                        Count = x.orderItemDTO.Count
                    }).ToList(),
                    Total = orderItems.Sum(y => y.item.Price * y.orderItemDTO.Count),
                    Status = TemplateExampleOrderStatus.Recieved
                };

                _applicationDbContext.TemplateExampleOrders.Add(order);

                await _applicationDbContext.SaveChangesAsync(cancellationToken);


                return order.Id;
            }
        }
    }
}