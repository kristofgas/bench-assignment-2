using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;
using Application.Common.Exceptions;

namespace Application.Tasks.Commands.ClearCompletedTasks
{
    [Authorize]
    public class ClearCompletedTasksCommand : IRequest
    {
        public int TaskListId { get; set; }
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

            var taskList = await _context.TaskLists
                .Include(tl => tl.UserTaskLists)
                .FirstOrDefaultAsync(tl => tl.Id == request.TaskListId, cancellationToken);

            if (taskList == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.TaskList), request.TaskListId);
            }

            if (!taskList.UserTaskLists.Any(utl => utl.UserId == currentUserId && !utl.IsDeleted))
            {
                throw new ForbiddenAccessException();
            }

            var completedTasks = await _context.Tasks
                .Where(t => t.TaskListId == request.TaskListId && t.IsCompleted)
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