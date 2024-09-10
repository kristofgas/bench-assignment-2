using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;

namespace Application.Tasks.Commands.ClearCompletedTasks
{
    [Authorize]
    public class ClearCompletedTasksCommand : IRequest
    {
    }

    public class ClearCompletedTasksCommandHandler : IRequestHandler<ClearCompletedTasksCommand>
    {
        private readonly IApplicationDbContext _context;

        public ClearCompletedTasksCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ClearCompletedTasksCommand request, CancellationToken cancellationToken)
        {
            var completedTasks = await _context.Tasks.Where(t => t.IsCompleted).ToListAsync(cancellationToken);

            _context.Tasks.RemoveRange(completedTasks);
            await _context.SaveChangesAsync(cancellationToken);

        }
    }
}