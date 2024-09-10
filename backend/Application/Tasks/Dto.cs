namespace Application.Tasks.Dto
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public int TaskListId { get; set; }
        public int UserId { get; set; }
    }

    public class TaskSummaryDto
    {
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
    }
}