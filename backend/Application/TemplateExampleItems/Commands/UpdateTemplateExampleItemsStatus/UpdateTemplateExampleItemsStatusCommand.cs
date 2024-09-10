using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.TemplateExampleItems.Commands.UpdateTemplateExampleItemsStatus
{
    [TODOAuthorize]
    public class UpdateTemplateExampleItemsStatusCommand : IRequest<Unit>
    {
        public required List<int> ItemIds { get; set; }
        public required TemplateExampleItemStatus Status { get; set; }

        public class UpdateTemplateExampleItemsStatusCommandHandler : IRequestHandler<UpdateTemplateExampleItemsStatusCommand, Unit>
        {
            private readonly IApplicationDbContext _applicationDbContext;

            public UpdateTemplateExampleItemsStatusCommandHandler(IApplicationDbContext applicationDbContext)
            {
                _applicationDbContext = applicationDbContext;
            }

            public async Task<Unit> Handle(UpdateTemplateExampleItemsStatusCommand request, CancellationToken cancellationToken)
            {
                //Warning this will bypass all change tracking and db interceptors, should be used with caution
                await _applicationDbContext.TemplateExampleItems
                    .Where(x => request.ItemIds.Contains(x.Id))
                    .ExecuteUpdateAsync(x =>
                        x.SetProperty(s => s.Status, s => request.Status), cancellationToken);

                return Unit.Value;
            }
        }
    }
}