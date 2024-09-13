using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

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
    }
}