/*
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.ChangeUserRole
{
    public class ChangeUserRoleCommand : IRequest
    {
        public int UserId { get; set; }
        public RoleEnum Role { get; set; }
        public bool AddRole { get; set; } // True to add role, False to remove role
    }
    public class ChangeUserRoleCommandHandler : IRequestHandler<ChangeUserRoleCommand>
    {
        private readonly IApplicationDbContext context;
        public ChangeUserRoleCommandHandler(IApplicationDbContext context)
        {
            context = context;
        }
        public async Task<Unit> Handle(ChangeUserRoleCommand request, CancellationToken cancellationToken)
        {
            var user = await context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
            if (user == null)
            {
                throw new NotFoundException(nameof(User), request.UserId);
            }
            var role = await context.Roles.FirstOrDefaultAsync(r => r.Name == request.Role, cancellationToken);
            if (role == null)
            {
                throw new NotFoundException(nameof(Role), request.Role.ToString());
            }
            if (request.AddRole)
            {
                if (!user.UserRoles.Any(ur => ur.Role.Name == request.Role))
                {
                    user.UserRoles.Add(new UserRole { User = user, Role = role });
                }
            }
            else
            {
                var userRoleToRemove = user.UserRoles.FirstOrDefault(ur => ur.Role.Name == request.Role);
                if (userRoleToRemove != null)
                {
                    user.UserRoles.Remove(userRoleToRemove);
                }
            }
            await context.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
*/