using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Tasks.Dto;
using MediatR;
using Application.Common.Security.Attributes;
using Microsoft.EntityFrameworkCore;



namespace Application.Tasks.Commands.CreateTask
{
    [Authorize]
    public class CreateTaskCommand : IRequest<TaskDto>
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int TaskListId { get; set; }
        public int UserId { get; set; }
        public int Rank { get; set; } = 1; // Default to "Standard"
        public string Color { get; set; } = "Default";
        public bool IsFavorite { get; set; } = false;


    }

    public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, TaskDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly INotificationService _notificationService;


        public CreateTaskCommandHandler(IApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<TaskDto> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
        {
            var taskList = await _context.TaskLists
                    .Include(tl => tl.UserTaskLists.Where(utl => !utl.IsDeleted))
                    .FirstOrDefaultAsync(tl => tl.Id == request.TaskListId, cancellationToken);

            if (taskList == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.TaskList), request.TaskListId);
            }

            if (!taskList.UserTaskLists.Any(utl => utl.UserId == request.UserId))
            {
                throw new ForbiddenAccessException();
            }

            var entity = new Domain.Entities.Task
            {
                Title = request.Title,
                Description = request.Description,
                TaskListId = request.TaskListId,
                UserId = request.UserId,
                Rank = request.Rank,
                Color = request.Color,
                IsFavorite = request.IsFavorite
            };

            _context.Tasks.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            await _notificationService.SendTaskCreatedNotification(entity.TaskListId, entity.Id);
            return new TaskDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                IsCompleted = entity.IsCompleted,
                TaskListId = entity.TaskListId,
                UserIds = taskList.UserTaskLists.Select(utl => utl.UserId).ToList(),
                Rank = entity.Rank,
                Color = entity.Color,
                IsFavorite = entity.IsFavorite
            };
        }
    }
}