using Domain.Enums;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly IApplicationDbContext _context;

        public AuthorizationService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsInRoleAsync(string userId, RoleEnum role)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            return user?.UserRoles.Any(ur => ur.Role.Name == role) ?? false;
        }
    }
}