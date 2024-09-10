using Application.Common.Mappings;
using Domain.ValueObjects;


namespace Application.Common.Models
{
    public class TemplateExampleAddressDTO : IAutoMap<TemplateExampleAddress>
    {
        public required string Street { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }
        public required string Country { get; set; }
        public required string ZipCode { get; set; }
    }
}
