using Application.Common.Mappings;
using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;

namespace Application.TemplateExampleOrders.Queries.GetTemplateExampleOrders
{
    public class TemplateExampleOrderDTO : IAutoMap<TemplateExampleOrder>
    {
        public required int Id { get; set; }
        public required decimal Total { get; set; }
        public required TemplateExampleAddressDTO ShippingAddress { get; set; }
        public required TemplateExampleOrderStatus Status { get; set; }
        public required IEnumerable<TemplateExampleItemDTO> Items { get; set; }
        public required TemplateExampleCustomerDTO Customer { get; set; }

    }
}
