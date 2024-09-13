using Domain.Common;

namespace Domain.Entities
{
    public class Task : BaseAuditableEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public int TaskListId { get; set; }
        public TaskList TaskList { get; set; } = null!;
        public int? UserId { get; set; }
        public User? User { get; set; }
        public int Rank { get; set; } = 1; 
        public string Color { get; set; } = "Default"; 
        public bool IsFavorite { get; set; } = false;
    }
}