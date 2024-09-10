using Application.TaskLists;
using Application.TaskLists.Commands.CreateTaskList;
using Application.TaskLists.Dto;
using Application.Tasks.Commands.ClearCompletedTasks;
using Application.Tasks.Commands.CreateTask;
using Application.Tasks.Commands.UpdateTaskStatus;
using Application.Tasks.Dto;
using Application.Tasks.Queries.GetTasksByState;
using Application.Tasks.Queries.GetTaskSummary;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Application.Common.Interfaces;

namespace Web.Controllers
{
    [Authorize]
    public class TasksController : ApiControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public TasksController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPost("lists")]
        public async Task<ActionResult<TaskListDto>> CreateTaskList(CreateTaskListCommand command)
        {
            var userId = _currentUserService.UserId;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
            {
                return BadRequest("Invalid user ID");
            }

            command.UserId = parsedUserId;
            return await Mediator.Send(command);
        }

        [HttpPost("tasks")]
        public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskCommand command)
        {
            var userId = _currentUserService.UserId;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
            {
                return BadRequest("Invalid user ID");
            }

            command.UserId = parsedUserId;
            return await Mediator.Send(command);
        }


        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateTaskStatus(int id, UpdateTaskStatusCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await Mediator.Send(command);
            return NoContent();
        }

        [HttpGet("summary")]
        public async Task<ActionResult<TaskSummaryDto>> GetTaskSummary()
        {
            return await Mediator.Send(new GetTaskSummaryQuery());
        }

        [HttpDelete("clear-completed")]
        public async Task<ActionResult> ClearCompletedTasks()
        {
            await Mediator.Send(new ClearCompletedTasksCommand());
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<ActionResult<List<TaskDto>>> GetTasksByState([FromQuery] GetTasksByStateQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}