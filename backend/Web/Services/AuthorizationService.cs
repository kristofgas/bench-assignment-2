using Domain.Enums;
using Application.Common.Interfaces;
using Application.Common.Security;

namespace Web.Services
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthorizationService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Task<bool> IsInRoleAsync(string userId, RoleEnum role)
        {
            throw new NotImplementedException();
        }

    }
}
