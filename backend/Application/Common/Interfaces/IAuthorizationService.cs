using Domain.Enums;

namespace Application.Common.Interfaces
{
    public interface IAuthorizationService
    {
        Task<bool> IsInRoleAsync(string userId, RoleEnum role);
    }
}