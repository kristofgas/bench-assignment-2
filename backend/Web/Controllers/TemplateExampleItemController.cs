using Application.TemplateExampleItems.Commands.CreateTemplateExampleItem;
using Application.TemplateExampleItems.Commands.UpdateTemplateExampleItemsStatus;
using Application.TemplateExampleItems.Queries.GetTemplateExampleItems;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    public class TemplateExampleItemController : ApiControllerBase
    {
        [HttpPost("[Action]")]
        public async Task<ActionResult<int>> Create(CreateTemplateExampleItemCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("[Action]")]
        public async Task<ActionResult> Update(UpdateTemplateExampleItemsStatusCommand command)
        {
            await Mediator.Send(command);
            return Ok();
        }

        [HttpGet("[Action]")]
        public async Task<ActionResult<List<TemplateExampleItemDTO>>> Get([FromQuery] GetTemplateExampleItemsQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}
