using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Tasks.Dto;
using Application.Common.Security;
using Application.Common.Security.Attributes;

namespace Application.Tasks.Queries.GetTaskSummary
{
    [Authorize]
    public class GetTaskSummaryQuery : IRequest<TaskSummaryDto>
    {
    }

    public class GetTaskSummaryQueryHandler : IRequestHandler<GetTaskSummaryQuery, TaskSummaryDto>
    {
        private readonly IApplicationDbContext _context;

        public GetTaskSummaryQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TaskSummaryDto> Handle(GetTaskSummaryQuery request, CancellationToken cancellationToken)
        {
            var summary = await _context.Tasks
                .GroupBy(t => 1)
                .Select(g => new TaskSummaryDto
                {
                    TotalTasks = g.Count(),
                    CompletedTasks = g.Sum(t => t.IsCompleted ? 1 : 0)
                })
                .FirstOrDefaultAsync(cancellationToken);

            return summary ?? new TaskSummaryDto();
        }
    }
}