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
        private readonly ICurrentUserService _currentUserService;

        public ClearCompletedTasksCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(ClearCompletedTasksCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var completedTasks = await _context.Tasks
                .Where(t => t.IsCompleted && t.TaskList.UserTaskLists.Any(utl => utl.UserId == currentUserId))
                .ToListAsync(cancellationToken);

            _context.Tasks.RemoveRange(completedTasks);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}