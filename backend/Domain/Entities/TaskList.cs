﻿using Domain.Common;

namespace Domain.Entities
{
    public class TaskList : BaseAuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
        public ICollection<UserTaskList> UserTaskLists { get; set; } = new List<UserTaskList>();
    }
}