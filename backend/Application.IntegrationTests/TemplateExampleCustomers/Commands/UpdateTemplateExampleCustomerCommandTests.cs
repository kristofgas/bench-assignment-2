using Application.Common.Exceptions;
using Application.Common.Exceptions.Enums;
using Application.Common.Models;
using Application.TemplateExampleCustomers.Commands.UpdateTemplateExampleCustomer;
using Domain.Entities;
using Domain.ValueObjects;
using FluentValidation;
using Shouldly;
using Xunit;

namespace Application.IntegrationTests.TemplateExampleCustomers.Commands
{
    public class UpdateTemplateExampleCustomerCommandTests : CommandTestBase
    {

        private UpdateTemplateExampleCustomerCommandValidator updateTemplateExampleCustomerCommandValidator;

        public UpdateTemplateExampleCustomerCommandTests()
        {
            updateTemplateExampleCustomerCommandValidator = new UpdateTemplateExampleCustomerCommandValidator();
        }

        [Fact]
        public async Task Handle_ValidInput_ShouldPersistTemplateExampleCustomerChanges()
        {
            const string initialPrefix = "test";

            const string emailInput = "TestEmail@TestEmail.TestEmail";
            const string firstNameInput = "TestFirstName";
            const string lastNameInput = "TestLastName";
            const string phoneInput = "TestPhone";
            const string cityInput = "TestCity";
            const string countryInput = "TestCountry";
            const string stateInput = "TestState";
            const string streetInput = "TestStreet";
            const string zipCodeInput = "TestZipCode";

            var initialTemplateExampleCustomer = new TemplateExampleCustomer
            {
                Email = initialPrefix + emailInput,
                FirstName = initialPrefix + firstNameInput,
                LastName = initialPrefix + lastNameInput,
                Phone = initialPrefix + phoneInput,
                Address = new TemplateExampleAddress
                {
                    City = initialPrefix + cityInput,
                    Country = initialPrefix + countryInput,
                    State = initialPrefix + stateInput,
                    Street = initialPrefix + streetInput,
                    ZipCode = initialPrefix + zipCodeInput
                }
            };

            Context.TemplateExampleCustomers.Add(initialTemplateExampleCustomer);
            await Context.SaveChangesAsync(CancellationToken.None);
            var idToUpdate = initialTemplateExampleCustomer.Id;

            var command = new UpdateTemplateExampleCustomerCommand
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
                Id = idToUpdate
            };

            updateTemplateExampleCustomerCommandValidator.ValidateAndThrow(command);

            var handler = new UpdateTemplateExampleCustomerCommand.UpdateTemplateExampleCustomerCommandHandler(Context);

            var result = await handler.Handle(command, CancellationToken.None);

            var templateExampleCustomerResult = Context.TemplateExampleCustomers.FirstOrDefault(x => x.Id == idToUpdate);

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

        [Fact]
        public async Task Handle_ValidInput_ShouldThrowCommandErrorCodeExceptionTemplateExampleEntityNotFound()
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

            var idToUpdate = 1;

            var command = new UpdateTemplateExampleCustomerCommand
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
                Id = idToUpdate
            };

            updateTemplateExampleCustomerCommandValidator.ValidateAndThrow(command);


            var handler = new UpdateTemplateExampleCustomerCommand.UpdateTemplateExampleCustomerCommandHandler(Context);

            var exception = await Should.ThrowAsync<CommandErrorCodeException>(handler.Handle(command, CancellationToken.None));

            exception.CommandErrorCodes.ShouldContainKey(CommandErrorCode.TemplateExampleEntityNotFound.ToString());

        }

        [Theory]
        [InlineData("TestEmail@TestEmail.TestEmail", "TestEmail@TestEmail.TestEmail")]
        [InlineData("testemail@testemail.testemail", "TestEmail@TestEmail.TestEmail")]
        [InlineData("TestEmail@TestEmail.TestEmail", "testemail@testemail.testemail")]
        public async Task Handle_DuplicateEmailInput_ShouldThrowCommandErrorCodeExceptionTemplateExampleEmailInUse(string emailInput, string duplicateInput)
        {
            const string initialPrefix = "test";

            const string firstNameInput = "TestFirstName";
            const string lastNameInput = "TestLastName";
            const string phoneInput = "TestPhone";
            const string cityInput = "TestCity";
            const string countryInput = "TestCountry";
            const string stateInput = "TestState";
            const string streetInput = "TestStreet";
            const string zipCodeInput = "TestZipCode";

            var initialTemplateExampleCustomer = new TemplateExampleCustomer
            {
                Email = initialPrefix + emailInput,
                FirstName = initialPrefix + firstNameInput,
                LastName = initialPrefix + lastNameInput,
                Phone = initialPrefix + phoneInput,
                Address = new TemplateExampleAddress
                {
                    City = initialPrefix + cityInput,
                    Country = initialPrefix + countryInput,
                    State = initialPrefix + stateInput,
                    Street = initialPrefix + streetInput,
                    ZipCode = initialPrefix + zipCodeInput
                }
            };

            Context.TemplateExampleCustomers.Add(initialTemplateExampleCustomer);

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
            var idToUpdate = initialTemplateExampleCustomer.Id;

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
                Email = duplicateInput,
                FirstName = firstNameInput,
                LastName = lastNameInput,
                Phone = phoneInput,
                Id = idToUpdate
            };

            updateTemplateExampleCustomerCommandValidator.ValidateAndThrow(command);

            var handler = new UpdateTemplateExampleCustomerCommand.UpdateTemplateExampleCustomerCommandHandler(Context);

            var exception = await Should.ThrowAsync<CommandErrorCodeException>(handler.Handle(command, CancellationToken.None));

            exception.CommandErrorCodes.ShouldContainKey(CommandErrorCode.TemplateExampleEmailInUse.ToString());
        }

    }
}
