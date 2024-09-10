using Domain.Common;

namespace Domain.Entities
{
    public class User : BaseAuditableEntity
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public ICollection<TaskList> TaskLists { get; set; } = new List<TaskList>();
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    }
}