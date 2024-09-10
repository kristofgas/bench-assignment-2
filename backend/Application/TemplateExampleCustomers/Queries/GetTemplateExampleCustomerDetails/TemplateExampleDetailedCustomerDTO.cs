using Application.Common.Mappings;
using Application.Common.Models;
using Domain.Entities;

namespace Application.TemplateExampleCustomers.Queries.GetTemplateExampleCustomerDetails
{
    public class TemplateExampleDetailedCustomerDTO : IAutoMap<TemplateExampleCustomer>
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required TemplateExampleAddressDTO Address { get; set; }

    }
}
