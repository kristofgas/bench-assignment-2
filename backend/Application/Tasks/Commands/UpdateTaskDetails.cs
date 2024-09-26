using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security.Attributes;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Tasks.Commands.UpdateTaskDetails
{
    [Authorize]
    public class UpdateTaskDetailsCommand : IRequest
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? Rank { get; set; }
        public string? Color { get; set; }
        public bool? IsFavorite { get; set; }
    }

    public class UpdateTaskDetailsCommandHandler : IRequestHandler<UpdateTaskDetailsCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly INotificationService _notificationService;


        public UpdateTaskDetailsCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, INotificationService notificationService)
        {
            _context = context;
            _currentUserService = currentUserService;
            _notificationService = notificationService;
        }

        public async Task Handle(UpdateTaskDetailsCommand request, CancellationToken cancellationToken)
        {
            var task = await _context.Tasks
    .Include(t => t.TaskList)
    .ThenInclude(tl => tl.UserTaskLists.Where(utl => !utl.IsDeleted))
    .FirstOrDefaultAsync(t => t.Id == request.Id && !t.User!.IsDeleted, cancellationToken);

            if (task == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.Task), request.Id);
            }

            var currentUserId = int.Parse(_currentUserService.UserId!);
            if (!task.TaskList.UserTaskLists.Any(utl => utl.UserId == currentUserId))
            {
                throw new ForbiddenAccessException();
            }

            // Only update properties that are provided in the request
            if (request.Rank.HasValue)
            {
                task.Rank = request.Rank.Value;
            }

            if (request.Color != null)
            {
                task.Color = request.Color;
            }

            if (request.IsFavorite.HasValue)
            {
                task.IsFavorite = request.IsFavorite.Value;
            }

            if (request.Title != null)
            {
                task.Title = request.Title;
            }

            if (request.Description != null)
            {
                task.Description = request.Description;
            }

            await _context.SaveChangesAsync(cancellationToken);
            await _notificationService.SendTaskUpdatedNotification(task.TaskListId, task.Id);

        }
    }
}