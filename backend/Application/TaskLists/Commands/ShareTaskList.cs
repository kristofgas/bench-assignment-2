using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;

namespace Application.TaskLists.Commands.ShareTaskList
{
    [Authorize]
    public class ShareTaskListCommand : IRequest
    {
        public int TaskListId { get; set; }
        public List<int> UserIdsToShare { get; set; } = new List<int>();
    }

    public class ShareTaskListCommandHandler : IRequestHandler<ShareTaskListCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public ShareTaskListCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task Handle(ShareTaskListCommand request, CancellationToken cancellationToken)
        {
            var taskList = await _context.TaskLists
                .Include(tl => tl.UserTaskLists)
                .FirstOrDefaultAsync(tl => tl.Id == request.TaskListId, cancellationToken);

            if (taskList == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.TaskList), request.TaskListId);
            }

            var currentUserId = int.Parse(_currentUserService.UserId!);
            if (!taskList.UserTaskLists.Any(utl => utl.UserId == currentUserId))
            {
                throw new ForbiddenAccessException();
            }

            foreach (var userId in request.UserIdsToShare)
            {
                if (!taskList.UserTaskLists.Any(utl => utl.UserId == userId))
                {
                    var userTaskList = new Domain.Entities.UserTaskList { UserId = userId, TaskListId = taskList.Id };
                    _context.UserTaskLists.Add(userTaskList);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}