
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    public class IndexController : ApiControllerBase
    {
        public ActionResult<string> Hello([FromQuery] string name, CancellationToken cancellationToken)
        {
            return $"Hello {name}";
        }
    }
}
