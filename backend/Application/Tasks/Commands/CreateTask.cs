using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Tasks.Dto;
using MediatR;
using Application.Common.Security.Attributes;



namespace Application.Tasks.Commands.CreateTask
{
    [Authorize]
    public class CreateTaskCommand : IRequest<TaskDto>
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int TaskListId { get; set; }
        public int UserId { get; set; } // Ensure UserId is included
    }

    public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, TaskDto>
    {
        private readonly IApplicationDbContext _context;

        public CreateTaskCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TaskDto> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
        {
            var taskList = await _context.TaskLists.FindAsync(request.TaskListId);
            if (taskList == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.TaskList), request.TaskListId);
            }

            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.User), request.UserId);
            }

            var entity = new Domain.Entities.Task
            {
                Title = request.Title,
                Description = request.Description,
                TaskListId = request.TaskListId,
                UserId = request.UserId // Ensure UserId is assigned
            };

            _context.Tasks.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return new TaskDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                IsCompleted = entity.IsCompleted,
                TaskListId = entity.TaskListId,
                UserId = entity.UserId // Ensure UserId is returned
            };
        }
    }
}