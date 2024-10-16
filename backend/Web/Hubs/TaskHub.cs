using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs
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
    }
}