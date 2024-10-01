using Application.Common.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Application.Hubs;
using System;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<TaskHub> _hubContext;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(IHubContext<TaskHub> hubContext, ILogger<NotificationService> logger)
        {
            _hubContext = hubContext;
            _logger = logger;

        }

        public async Task SendTaskCreatedNotification(int taskListId, int taskId)
        {
            await SendNotificationToGroup(taskListId, "TaskCreated", taskId);
        }

        public async Task SendTaskListCreatedNotification(int taskListId, int taskId)
        {
            await SendNotificationToGroup(taskListId, "TaskListCreated", taskId);
        }

        public async Task SendTaskUpdatedNotification(int taskListId, int taskId)
        {
            await SendNotificationToGroup(taskListId, "TaskUpdated", taskId);
        }

        public async Task SendTaskDeletedNotification(int taskListId, int taskId)
        {
            await SendNotificationToGroup(taskListId, "TaskDeleted", taskId);
        }

        public async Task SendTaskListSharedNotification(int taskListId, int userId)
        {
            await SendNotificationToGroup(taskListId, "TaskListShared", taskListId);
        }

        private async Task SendNotificationToGroup(int taskListId, string method, object arg)
        {
            try
            {
                await _hubContext.Clients.Group(taskListId.ToString()).SendAsync(method, arg);
                _logger.LogInformation($"Sent {method} notification for task list {taskListId}");
            }
            catch (Exception ex)
            {
                // Log the error
                Console.Error.WriteLine($"Error sending {method} notification: {ex.Message}");
                _logger.LogError(ex, $"Error sending {method} notification for task list {taskListId}");
            }
        }
    }
}