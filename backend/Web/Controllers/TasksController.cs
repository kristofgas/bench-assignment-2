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
using Application.TaskLists.Queries.GetTaskList;
using Application.Tasks.Queries.GetTask;
using Application.TaskLists.Commands.UpdateTaskList;
using Application.TaskLists.Queries.GetUserTaskLists;
using Application.Users.Dto;
using Application.Users.Queries.GetUsersByTaskListAssociation;


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

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            return await Mediator.Send(new GetTaskQuery { Id = id });
        }

        [HttpGet("lists/{id}")]
        public async Task<ActionResult<TaskListDto>> GetTaskList(int id)
        {
            return await Mediator.Send(new GetTaskListQuery { Id = id });
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

        [HttpPut("lists/{id}")]
        public async Task<ActionResult<TaskListDto>> UpdateTaskList(int id, UpdateTaskListCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            return await Mediator.Send(command);
        }

        [HttpGet("lists")]
        public async Task<ActionResult<List<TaskListDto>>> GetUserTaskLists()
        {
            return await Mediator.Send(new GetUserTaskListsQuery());
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

        [HttpGet("lists/{taskListId}/summary")]
        public async Task<ActionResult<TaskSummaryDto>> GetTaskSummary(int taskListId)
        {
            return await Mediator.Send(new GetTaskSummaryQuery { TaskListId = taskListId });
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

        [HttpGet("lists/{id}/users")]
        public async Task<ActionResult<List<UserDto>>> GetUsersByTaskListAssociation(int id, [FromQuery] bool isAssociated)
        {
            return await Mediator.Send(new GetUsersByTaskListAssociationQuery { TaskListId = id, IsAssociated = isAssociated });
        }
    }
}