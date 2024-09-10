using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Role : BaseAuditableEntity
    {
        public int Id { get; set; }
        public Domain.Enums.RoleEnum Name { get; set; }
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}