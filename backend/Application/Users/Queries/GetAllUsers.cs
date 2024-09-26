using Application.Common.Interfaces;
using Application.Users.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;
using Domain.Enums;

namespace Application.Users.Queries.GetAllUsers
{
    [Authorize(RoleEnum.Admin)]
    public class GetAllUsersQuery : IRequest<List<UserDto>>
    {
    }

    public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetAllUsersQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var users = await _context.Users
                .Where(u => u.Id != currentUserId && !u.IsDeleted)
                .Select(u => new UserDto
                {
                    UserId = u.Id,
                    Username = u.Username
                })
                .ToListAsync(cancellationToken);

            return users;
        }
    }
}