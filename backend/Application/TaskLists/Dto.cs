namespace Application.TaskLists.Dto
{
    public class TaskListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<int> UserIds { get; set; } = new List<int>();
    }
}