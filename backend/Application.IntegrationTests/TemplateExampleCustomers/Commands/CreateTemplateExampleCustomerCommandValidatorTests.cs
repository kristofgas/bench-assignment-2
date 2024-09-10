using Application.Common.Models;
using Application.TemplateExampleCustomers.Commands.CreateTemplateExampleCustomer;
using FluentValidation.TestHelper;
using Shouldly;
using Xunit;

namespace Application.IntegrationTests.TemplateExampleCustomers.Commands
{
    public class CreateTemplateExampleCustomerCommandValidatorTests
    {
        private readonly CreateTemplateExampleCustomerCommandValidator _createTemplateExampleCustomerCommandValidator;

        public CreateTemplateExampleCustomerCommandValidatorTests()
        {
            _createTemplateExampleCustomerCommandValidator = new CreateTemplateExampleCustomerCommandValidator();
        }

        public static IEnumerable<object[]> GetErrorTemplateExampleCustomerCommandValidatorData()
        {
            const string validEmailInput = "TestEmail@TestEmail.com";
            const string validFirstNameInput = "TestFirstName";
            const string validLastNameInput = "TestLastName";
            const string validPhoneInput = "123456789";

            //Email tests
            yield return new object[] { "TestEmail", validFirstNameInput, validLastNameInput, validPhoneInput, nameof(CreateTemplateExampleCustomerCommand.Email) };
            yield return new object[] { "TestEmail", validFirstNameInput, validLastNameInput, validPhoneInput, nameof(CreateTemplateExampleCustomerCommand.Email) };

            //FirstName tests
            yield return new object[] { validEmailInput, "", validLastNameInput, validPhoneInput, nameof(CreateTemplateExampleCustomerCommand.FirstName) };
            yield return new object[] { validEmailInput, string.Join("", Enumerable.Repeat(0, 101).Select(x => 'x')), validLastNameInput, validPhoneInput, nameof(CreateTemplateExampleCustomerCommand.FirstName) };

            //LastName tests
            yield return new object[] { validEmailInput, validFirstNameInput, "", validPhoneInput, nameof(CreateTemplateExampleCustomerCommand.LastName) };
            yield return new object[] { validEmailInput, validFirstNameInput, string.Join("", Enumerable.Repeat(0, 101).Select(x => 'x')), validPhoneInput, nameof(CreateTemplateExampleCustomerCommand.LastName) };

            //Phone tests
            yield return new object[] { validEmailInput, validFirstNameInput, validLastNameInput, "12", nameof(CreateTemplateExampleCustomerCommand.Phone) };
            yield return new object[] { validEmailInput, validFirstNameInput, validLastNameInput, string.Join("", Enumerable.Repeat(0, 11).Select(x => '1')), nameof(CreateTemplateExampleCustomerCommand.Phone) };

        }

        [Theory]
        [MemberData(nameof(GetErrorTemplateExampleCustomerCommandValidatorData))]
        public async Task TestValidate_GivenInvalidInput_ShouldHaveValidationErrorFor(string emailInput, string firstNameInput, string lastNameInput, string phoneInput, string invalidInputName)
        {
            const string cityInput = "TestCity";
            const string countryInput = "TestCountry";
            const string stateInput = "TestState";
            const string streetInput = "TestStreet";
            const string zipCodeInput = "TestZipCode";


            var command = new CreateTemplateExampleCustomerCommand()
            {
                Address = new TemplateExampleAddressDTO
                {
                    City = cityInput,
                    Country = countryInput,
                    State = stateInput,
                    Street = streetInput,
                    ZipCode = zipCodeInput
                },
                Email = emailInput,
                FirstName = firstNameInput,
                LastName = lastNameInput,
                Phone = phoneInput
            };

            var result = await _createTemplateExampleCustomerCommandValidator.TestValidateAsync(command, cancellationToken: CancellationToken.None);
            result.Errors.Count.ShouldBeGreaterThanOrEqualTo(1);
            result.ShouldHaveValidationErrorFor(invalidInputName);
        }
    }
}
