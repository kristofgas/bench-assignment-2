using Domain.Common;
using Domain.Enums;
using Domain.ValueObjects;

namespace Domain.Entities
{
    public class TemplateExampleOrder : BaseAuditableEntity
    {
        public int Id { get; set; }
        public decimal Total { get; set; }
        public required TemplateExampleAddress ShippingAddress { get; set; }
        public int CustomerId { get; set; }
        public TemplateExampleCustomer? Customer { get; set; }
        public ICollection<TemplateExampleOrderItem>? OrderItems { get; set; }
        public TemplateExampleOrderStatus Status { get; set; }

    }
}
