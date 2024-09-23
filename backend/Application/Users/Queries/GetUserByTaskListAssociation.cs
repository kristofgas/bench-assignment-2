using Application.Common.Interfaces;
using Application.Users.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries.GetUsersByTaskListAssociation
{
    public class GetUsersByTaskListAssociationQuery : IRequest<List<UserDto>>
    {
        public int TaskListId { get; set; }
        public bool IsAssociated { get; set; }
    }

    public class GetUsersByTaskListAssociationQueryHandler : IRequestHandler<GetUsersByTaskListAssociationQuery, List<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetUsersByTaskListAssociationQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<UserDto>> Handle(GetUsersByTaskListAssociationQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var query = _context.Users.AsQueryable();

            if (request.IsAssociated)
            {
                query = query.Where(u => u.UserTaskLists.Any(utl => utl.TaskListId == request.TaskListId && !utl.IsDeleted) && u.Id != currentUserId);
            }
            else
            {
                query = query.Where(u => !u.UserTaskLists.Any(utl => utl.TaskListId == request.TaskListId && !utl.IsDeleted));
            }

            return await query.Select(u => new UserDto
            {
                UserId = u.Id,
                Username = u.Username
            }).ToListAsync(cancellationToken);
        }
    }
}