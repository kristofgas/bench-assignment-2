using Application.Common.Mappings;
using Application.Common.Models;
using Domain.Entities;

namespace Application.TemplateExampleOrders.Queries.GetTemplateExampleOrders
{
    public class TemplateExampleCustomerDTO : IAutoMap<TemplateExampleCustomer>
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required TemplateExampleAddressDTO Address { get; set; }
    }
}
