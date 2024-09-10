using Application.Common.Models;

namespace Application.TemplateExampleCustomers.Commands.Models
{
    public class CreateUpdateTemplateExampleCustomerDTO
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required TemplateExampleAddressDTO Address { get; set; }

    }
}
