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
        public ICollection<UserTaskList> UserTaskLists { get; set; } = new List<UserTaskList>();
        public bool IsDeleted { get; set; } = false;
        public DateTimeOffset? DeletedAt { get; set; }

    }
}