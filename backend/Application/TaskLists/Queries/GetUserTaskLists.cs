using Application.Common.Interfaces;
using Application.TaskLists.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;

namespace Application.TaskLists.Queries.GetUserTaskLists
{
    [Authorize]
    public class GetUserTaskListsQuery : IRequest<List<TaskListDto>>
    {
    }

    public class GetUserTaskListsQueryHandler : IRequestHandler<GetUserTaskListsQuery, List<TaskListDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetUserTaskListsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<TaskListDto>> Handle(GetUserTaskListsQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var taskLists = await _context.TaskLists
                .Include(tl => tl.UserTaskLists)
                .Where(tl => tl.UserTaskLists.Any(utl => utl.UserId == currentUserId && !utl.IsDeleted))
                .Select(tl => new TaskListDto
                {
                    Id = tl.Id,
                    Name = tl.Name,
                    Description = tl.Description,
                    UserIds = tl.UserTaskLists.Where(utl => !utl.IsDeleted).Select(utl => utl.UserId).ToList(),
                    CreatedBy = tl.CreatedBy
                })
                .ToListAsync(cancellationToken);

            return taskLists;
        }
    }
}