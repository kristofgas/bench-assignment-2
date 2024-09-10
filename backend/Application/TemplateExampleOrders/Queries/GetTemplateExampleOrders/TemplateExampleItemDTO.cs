using Application.Common.Mappings;
using Domain.Entities;

namespace Application.TemplateExampleOrders.Queries.GetTemplateExampleOrders
{
    public class TemplateExampleItemDTO : IAutoMap<TemplateExampleItem>
    {
        public required string Name { get; set; }
        public required string Category { get; set; }
        public required string Description { get; set; }
        public required decimal Price { get; set; }
    }
}
