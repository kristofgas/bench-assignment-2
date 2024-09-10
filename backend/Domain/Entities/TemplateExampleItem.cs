using Domain.Enums;

namespace Domain.Entities
{
    public class TemplateExampleItem
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Category { get; set; }
        public required string Description { get; set; }
        public required decimal Price { get; set; }
        public required TemplateExampleItemStatus Status { get; set; }
        public ICollection<TemplateExampleOrderItem>? OrderItems { get; set; }
    }
}
