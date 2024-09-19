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
        public bool? IsFavorite { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = false;
        public int? TaskListId { get; set; }
    }

    public class GetTasksByStateQueryHandler : IRequestHandler<GetTasksByStateQuery, List<TaskDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;



        public GetTasksByStateQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<TaskDto>> Handle(GetTasksByStateQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var query = _context.Tasks
                .Where(t => (t.UserId == currentUserId || t.TaskList.UserTaskLists.Any(utl => utl.UserId == currentUserId && !utl.IsDeleted))
                            && !t.User!.IsDeleted)
                .Where(t => request.IsCompleted == null || t.IsCompleted == request.IsCompleted)
                .Where(t => request.IsFavorite == null || t.IsFavorite == request.IsFavorite)
                .Where(t => request.TaskListId == null || t.TaskListId == request.TaskListId);

            if (request.SortBy == "rank")
            {
                query = request.SortDescending
                    ? query.OrderByDescending(t => t.Rank)
                    : query.OrderBy(t => t.Rank);
            }
            else
            {
                query = request.SortDescending
                    ? query.OrderByDescending(t => t.Created)
                    : query.OrderBy(t => t.Created);
            }

            return await query.Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                TaskListId = t.TaskListId,
                UserIds = t.TaskList.UserTaskLists.Select(utl => utl.UserId).ToList(),
                Rank = t.Rank,
                Color = t.Color,
                IsFavorite = t.IsFavorite
            })
            .ToListAsync(cancellationToken);
        }
    }
}