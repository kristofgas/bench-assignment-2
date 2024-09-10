using Application.Common.Mappings;
using Domain.Entities;
using Domain.Enums;

namespace Application.TemplateExampleItems.Queries.GetTemplateExampleItems
{
    public class TemplateExampleItemDTO : IAutoMap<TemplateExampleItem>
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string Category { get; set; }
        public required string Description { get; set; }
        public required decimal Price { get; set; }
        public required TemplateExampleItemStatus Status { get; set; }
    }
}
