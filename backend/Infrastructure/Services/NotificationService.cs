using Application.Common.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Application.Hubs;

namespace Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<TaskHub> _hubContext;

        public NotificationService(IHubContext<TaskHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendTaskCreatedNotification(int taskListId, int taskId)
        {
            await _hubContext.Clients.Group(taskListId.ToString()).SendAsync("TaskCreated", taskId);
        }

        public async Task SendTaskUpdatedNotification(int taskListId, int taskId)
        {
            await _hubContext.Clients.Group(taskListId.ToString()).SendAsync("TaskUpdated", taskId);
        }

        public async Task SendTaskDeletedNotification(int taskListId, int taskId)
        {
            await _hubContext.Clients.Group(taskListId.ToString()).SendAsync("TaskDeleted", taskId);
        }
    }
}