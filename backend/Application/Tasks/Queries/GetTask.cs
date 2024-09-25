using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Tasks.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;

namespace Application.Tasks.Queries.GetTask
{
    [Authorize]
    public class GetTaskQuery : IRequest<TaskDto>
    {
        public int Id { get; set; }
    }

    public class GetTaskQueryHandler : IRequestHandler<GetTaskQuery, TaskDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetTaskQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<TaskDto> Handle(GetTaskQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var task = await _context.Tasks
                .Include(t => t.TaskList)
                .ThenInclude(tl => tl.UserTaskLists)
                .Where(t => t.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (task == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.Task), request.Id);
            }

            if (task.UserId != currentUserId && !task.TaskList.UserTaskLists.Any(utl => utl.UserId == currentUserId && !utl.IsDeleted))
            {
                throw new ForbiddenAccessException();
            }

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                TaskListId = task.TaskListId,
                UserIds = task.TaskList.UserTaskLists.Select(utl => utl.UserId).ToList(),
                Rank = task.Rank,
                Color = task.Color,
                IsFavorite = task.IsFavorite,
                CreatedBy = task.CreatedBy,
                LastModified = task.LastModified,
                LastModifiedBy = task.LastModifiedBy
            };
        }
    }
}