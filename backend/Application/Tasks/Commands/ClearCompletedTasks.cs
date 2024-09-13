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
        private readonly INotificationService _notificationService;

        public ClearCompletedTasksCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, INotificationService notificationService)
        {
            _context = context;
            _currentUserService = currentUserService;
            _notificationService = notificationService;
        }

        public async Task Handle(ClearCompletedTasksCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var completedTasks = await _context.Tasks
.Include(t => t.TaskList)
.ThenInclude(tl => tl.UserTaskLists)
.Where(t => t.IsCompleted && t.TaskList.UserTaskLists.Any(utl => utl.UserId == currentUserId))
.ToListAsync(cancellationToken);


            _context.Tasks.RemoveRange(completedTasks);
            await _context.SaveChangesAsync(cancellationToken);
            foreach (var task in completedTasks)
            {
                await _notificationService.SendTaskDeletedNotification(task.TaskListId, task.Id);
            }
        }
    }
}