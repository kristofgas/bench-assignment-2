namespace Domain.Entities
{
    public class TemplateExampleOrderItem
    {
        public int OrderId { get; set; }
        public TemplateExampleOrder? Order { get; set; }
        public int ItemId { get; set; }
        public TemplateExampleItem? Item { get; set; }
        public int Count { get; set; }
    }
}
