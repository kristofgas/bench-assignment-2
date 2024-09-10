using Application.TemplateExampleOrders.Commands.CreateTemplateExampleOrder;
using Application.TemplateExampleOrders.Queries.GetTemplateExampleOrders;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    public class TemplateExampleOrderController : ApiControllerBase
    {
        [HttpPost("[Action]")]
        public async Task<ActionResult<int>> Create(CreateTemplateExampleOrderCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("[Action]")]
        public async Task<ActionResult> DeleteByCustomerId([FromQuery] CreateTemplateExampleOrderCommand command)
        {
            await Mediator.Send(command);
            return Ok();
        }

        [HttpGet("[Action]")]
        public async Task<ActionResult<List<TemplateExampleOrderDTO>>> Get(GetTemplateExampleOrdersQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}
