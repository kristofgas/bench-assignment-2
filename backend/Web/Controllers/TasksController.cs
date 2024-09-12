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
using Application.TaskLists.Commands.ShareTaskList;
using Application.Common.Exceptions;
using Application.Tasks.Commands.UpdateTaskDetails;

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

        [HttpPost("lists/{id}/share")]
        public async Task<ActionResult> ShareTaskList(int id, [FromBody] List<int> userIdsToShare)
        {
            await Mediator.Send(new ShareTaskListCommand { TaskListId = id, UserIdsToShare = userIdsToShare });
            return NoContent();
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

            try
            {
                await Mediator.Send(command);
            }
            catch (NotFoundException)
            {
                return NotFound();
            }
            catch (ForbiddenAccessException)
            {
                return Forbid();
            }

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

        [HttpPut("{id}/details")]
        public async Task<ActionResult> UpdateTaskDetails(int id, UpdateTaskDetailsCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            try
            {
                await Mediator.Send(command);
            }
            catch (NotFoundException)
            {
                return NotFound();
            }
            catch (ForbiddenAccessException)
            {
                return Forbid();
            }

            return NoContent();
        }
    }
}