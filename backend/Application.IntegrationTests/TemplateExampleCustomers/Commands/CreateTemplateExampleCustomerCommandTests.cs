using Application.Common.Exceptions;
using Application.Common.Exceptions.Enums;
using Application.Common.Models;
using Application.TemplateExampleCustomers.Commands.CreateTemplateExampleCustomer;
using Domain.Entities;
using Domain.ValueObjects;
using FluentValidation;
using Shouldly;
using Xunit;

namespace Application.IntegrationTests.TemplateExampleCustomers.Commands
{
    public class CreateTemplateExampleCustomerCommandTests : CommandTestBase
    {
        private CreateTemplateExampleCustomerCommandValidator createTemplateExampleCustomerCommandValidator;

        public CreateTemplateExampleCustomerCommandTests()
        {
            createTemplateExampleCustomerCommandValidator = new CreateTemplateExampleCustomerCommandValidator();
        }

        [Fact]
        public async Task Handle_ValidInput_ShouldPersistTemplateExampleCustomer()
        {
            const string emailInput = "TestEmail@TestEmail.TestEmail";
            const string firstNameInput = "TestFirstName";
            const string lastNameInput = "TestLastName";
            const string phoneInput = "TestPhone";
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

            createTemplateExampleCustomerCommandValidator.ValidateAndThrow(command);

            var handler = new CreateTemplateExampleCustomerCommand.CreateTemplateExampleCustomerCommandHandler(Context);

            var result = await handler.Handle(command, CancellationToken.None);

            var templateExampleCustomerResult = Context.TemplateExampleCustomers.FirstOrDefault(x => x.Id == result);

            templateExampleCustomerResult.ShouldNotBeNull();
            templateExampleCustomerResult.Email.ShouldBe(emailInput);
            templateExampleCustomerResult.FirstName.ShouldBe(firstNameInput);
            templateExampleCustomerResult.LastName.ShouldBe(lastNameInput);
            templateExampleCustomerResult.Phone.ShouldBe(phoneInput);

            templateExampleCustomerResult.Address.ShouldBe(new TemplateExampleAddress
            {
                City = cityInput,
                Country = countryInput,
                State = stateInput,
                Street = streetInput,
                ZipCode = zipCodeInput
            });
        }

        [Theory]
        [InlineData("TestEmail@TestEmail.TestEmail", "TestEmail@TestEmail.TestEmail")]
        [InlineData("testemail@testemail.testemail", "TestEmail@TestEmail.TestEmail")]
        [InlineData("TestEmail@TestEmail.TestEmail", "testemail@testemail.testemail")]
        public async Task Handle_DuplicateEmailInput_ShouldThrowCommandErrorCodeExceptionTemplateExampleEmailInUse(string emailInput, string duplicateInput)
        {
            const string firstNameInput = "TestFirstName";
            const string lastNameInput = "TestLastName";
            const string phoneInput = "TestPhone";
            const string cityInput = "TestCity";
            const string countryInput = "TestCountry";
            const string stateInput = "TestState";
            const string streetInput = "TestStreet";
            const string zipCodeInput = "TestZipCode";

            Context.TemplateExampleCustomers.Add(new TemplateExampleCustomer
            {
                Address = new TemplateExampleAddress
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
            });

            await Context.SaveChangesAsync(CancellationToken.None);

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
                Email = duplicateInput,
                FirstName = firstNameInput,
                LastName = lastNameInput,
                Phone = phoneInput
            };

            createTemplateExampleCustomerCommandValidator.ValidateAndThrow(command);

            var handler = new CreateTemplateExampleCustomerCommand.CreateTemplateExampleCustomerCommandHandler(Context);

            var exception = await Should.ThrowAsync<CommandErrorCodeException>(handler.Handle(command, CancellationToken.None));

            exception.CommandErrorCodes.ShouldContainKey(CommandErrorCode.TemplateExampleEmailInUse.ToString());
        }


    }
}
