namespace Application.Common.Interfaces
{
    public interface INotificationService
    {
        Task SendTaskCreatedNotification(int taskListId, int taskId);
        Task SendTaskUpdatedNotification(int taskListId, int taskId);
        Task SendTaskDeletedNotification(int taskListId, int taskId);
    }
}