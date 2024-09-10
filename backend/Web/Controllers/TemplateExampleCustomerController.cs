using Application.TemplateExampleCustomers.Commands.CreateTemplateExampleCustomer;
using Application.TemplateExampleCustomers.Commands.UpdateTemplateExampleCustomer;
using Application.TemplateExampleCustomers.Queries.GetTemplateExampleCustomerDetails;
using Application.TemplateExampleCustomers.Queries.GetTemplateExampleCustomers;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    public class TemplateExampleCustomerController : ApiControllerBase
    {
        [HttpPost("[Action]")]
        public async Task<ActionResult<int>> Create([FromBody] CreateTemplateExampleCustomerCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("[Action]")]
        public async Task<ActionResult> Update(UpdateTemplateExampleCustomerCommand command)
        {
            await Mediator.Send(command);
            return Ok();
        }

        [HttpGet("[Action]")]
        public async Task<ActionResult<TemplateExampleDetailedCustomerDTO>> Get([FromQuery] GetTemplateExampleCustomerDetailsQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet("[Action]")]
        public async Task<ActionResult<List<TemplateExampleSimpleCustomerDTO>>> GetAll([FromQuery] GetTemplateExampleCustomersQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}
