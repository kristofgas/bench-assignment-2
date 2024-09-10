using Domain.Entities;
using Domain.Enums;

namespace Application.Common.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user, IList<Domain.Enums.RoleEnum> roles);
    }
}