using Microsoft.AspNetCore.SignalR;

namespace Application.Hubs
{
    public class TaskHub : Hub
    {
        public async Task JoinTaskList(int taskListId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, taskListId.ToString());
        }

        public async Task LeaveTaskList(int taskListId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, taskListId.ToString());
        }

        public async Task TaskUpdated(int taskListId, int taskId)
        {
            await Clients.Group(taskListId.ToString()).SendAsync("TaskUpdated", taskId);
        }

    }
}