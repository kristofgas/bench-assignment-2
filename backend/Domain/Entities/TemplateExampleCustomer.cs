using Domain.ValueObjects;

namespace Domain.Entities
{
    public class TemplateExampleCustomer
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required TemplateExampleAddress Address { get; set; }
        public ICollection<TemplateExampleOrder>? Orders { get; set; }
    }
}
