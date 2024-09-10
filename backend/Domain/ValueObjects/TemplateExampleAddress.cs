using Domain.Common;

namespace Domain.ValueObjects
{
    public class TemplateExampleAddress : ValueObject
    {
        public required string Street { get; init; }
        public required string City { get; init; }
        public required string State { get; init; }
        public required string Country { get; init; }
        public required string ZipCode { get; init; }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            // Using a yield return statement to return each element one at a time
            yield return Street;
            yield return City;
            yield return State;
            yield return Country;
            yield return ZipCode;
        }
    }
}
