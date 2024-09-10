using Application.Common.Mappings;
using Domain.Entities;

namespace Application.TemplateExampleCustomers.Queries.GetTemplateExampleCustomers
{
    public class TemplateExampleSimpleCustomerDTO : IAutoMap<TemplateExampleCustomer>
    {
        public required int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
    }
}
