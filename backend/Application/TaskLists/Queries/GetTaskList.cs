using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.TaskLists.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;

namespace Application.TaskLists.Queries.GetTaskList
{
    [Authorize]
    public class GetTaskListQuery : IRequest<TaskListDto>
    {
        public int Id { get; set; }
    }

    public class GetTaskListQueryHandler : IRequestHandler<GetTaskListQuery, TaskListDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetTaskListQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<TaskListDto> Handle(GetTaskListQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var taskList = await _context.TaskLists
                .Include(tl => tl.UserTaskLists)
                .Where(tl => tl.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (taskList == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.TaskList), request.Id);
            }

            if (!taskList.UserTaskLists.Any(utl => utl.UserId == currentUserId && !utl.IsDeleted))
            {
                throw new ForbiddenAccessException();
            }

            return new TaskListDto
            {
                Id = taskList.Id,
                Name = taskList.Name,
                Description = taskList.Description,
                UserIds = taskList.UserTaskLists.Select(utl => utl.UserId).ToList()
            };
        }
    }
}