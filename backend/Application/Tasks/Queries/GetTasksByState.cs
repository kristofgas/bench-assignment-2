using Application.Common.Interfaces;
using Application.Common.Security;
using Application.Tasks.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;

namespace Application.Tasks.Queries.GetTasksByState
{
    [Authorize]
    public class GetTasksByStateQuery : IRequest<List<TaskDto>>
    {
        public bool? IsCompleted { get; set; }
    }

    public class GetTasksByStateQueryHandler : IRequestHandler<GetTasksByStateQuery, List<TaskDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetTasksByStateQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskDto>> Handle(GetTasksByStateQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Tasks.AsQueryable();

            if (request.IsCompleted.HasValue)
            {
                query = query.Where(t => t.IsCompleted == request.IsCompleted.Value);
            }

            return await query.Select(t => new TaskDto
            {
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                TaskListId = t.TaskListId
            }).ToListAsync(cancellationToken);
        }
    }
}