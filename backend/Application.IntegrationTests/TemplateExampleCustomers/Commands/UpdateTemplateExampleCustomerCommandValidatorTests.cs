using Application.Common.Models;
using Application.TemplateExampleCustomers.Commands.UpdateTemplateExampleCustomer;
using FluentValidation.TestHelper;
using Shouldly;
using Xunit;

namespace Application.IntegrationTests.TemplateExampleCustomers.Commands
{
    public class UpdateTemplateExampleCustomerCommandValidatorTests
    {
        private readonly UpdateTemplateExampleCustomerCommandValidator _updateTemplateExampleCustomerCommandValidator;

        public UpdateTemplateExampleCustomerCommandValidatorTests()
        {
            _updateTemplateExampleCustomerCommandValidator = new UpdateTemplateExampleCustomerCommandValidator();
        }

        public static IEnumerable<object[]> GetErrorTemplateExampleCustomerCommandValidatorData()
        {
            int validId = 1;
            const string validEmailInput = "TestEmail@TestEmail.com";
            const string validFirstNameInput = "TestFirstName";
            const string validLastNameInput = "TestLastName";
            const string validPhoneInput = "123456789";

            //Id Tests
            yield return new object[] { default(int), validEmailInput, validFirstNameInput, validLastNameInput, validPhoneInput, nameof(UpdateTemplateExampleCustomerCommand.Id) };
            yield return new object[] { -1, validEmailInput, validFirstNameInput, validLastNameInput, validPhoneInput, nameof(UpdateTemplateExampleCustomerCommand.Id) };

            //Email tests
            yield return new object[] { validId, "TestEmail", validFirstNameInput, validLastNameInput, validPhoneInput, nameof(UpdateTemplateExampleCustomerCommand.Email) };
            yield return new object[] { validId, "TestEmail", validFirstNameInput, validLastNameInput, validPhoneInput, nameof(UpdateTemplateExampleCustomerCommand.Email) };

            //FirstName tests
            yield return new object[] { validId, validEmailInput, "", validLastNameInput, validPhoneInput, nameof(UpdateTemplateExampleCustomerCommand.FirstName) };
            yield return new object[] { validId, validEmailInput, string.Join("", Enumerable.Repeat(0, 101).Select(x => 'x')), validLastNameInput, validPhoneInput, nameof(UpdateTemplateExampleCustomerCommand.FirstName) };

            //LastName tests
            yield return new object[] { validId, validEmailInput, validFirstNameInput, "", validPhoneInput, nameof(UpdateTemplateExampleCustomerCommand.LastName) };
            yield return new object[] { validId, validEmailInput, validFirstNameInput, string.Join("", Enumerable.Repeat(0, 101).Select(x => 'x')), validPhoneInput, nameof(UpdateTemplateExampleCustomerCommand.LastName) };

            //Phone tests
            yield return new object[] { validId, validEmailInput, validFirstNameInput, validLastNameInput, "12", nameof(UpdateTemplateExampleCustomerCommand.Phone) };
            yield return new object[] { validId, validEmailInput, validFirstNameInput, validLastNameInput, string.Join("", Enumerable.Repeat(0, 11).Select(x => '1')), nameof(UpdateTemplateExampleCustomerCommand.Phone) };

        }

        [Theory]
        [MemberData(nameof(GetErrorTemplateExampleCustomerCommandValidatorData))]
        public async Task TestValidate_GivenInvalidInput_ShouldHaveValidationErrorFor(int idInput, string emailInput, string firstNameInput, string lastNameInput, string phoneInput, string invalidInputName)
        {
            const string cityInput = "TestCity";
            const string countryInput = "TestCountry";
            const string stateInput = "TestState";
            const string streetInput = "TestStreet";
            const string zipCodeInput = "TestZipCode";


            var command = new UpdateTemplateExampleCustomerCommand()
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
                Phone = phoneInput,
                Id = idInput
            };

            var result = await _updateTemplateExampleCustomerCommandValidator.TestValidateAsync(command, cancellationToken: CancellationToken.None);
            result.Errors.Count.ShouldBeGreaterThanOrEqualTo(1);
            result.ShouldHaveValidationErrorFor(invalidInputName);
        }
    }
}
