using Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class UserTaskList : BaseAuditableEntity
    {
        [Key]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        [Key]
        public int TaskListId { get; set; }
        public TaskList TaskList { get; set; } = null!;

        public bool IsDeleted { get; set; } = false;
        public DateTimeOffset? DeletedAt { get; set; }
    }
}