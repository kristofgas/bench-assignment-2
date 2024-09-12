using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;
using Microsoft.Extensions.Logging;

namespace Application.Tasks.Commands.UpdateTaskStatus
{
    [Authorize]
    public class UpdateTaskStatusCommand : IRequest
    {
        public int Id { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class UpdateTaskStatusCommandHandler : IRequestHandler<UpdateTaskStatusCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<UpdateTaskStatusCommandHandler> _logger;

        public UpdateTaskStatusCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, ILogger<UpdateTaskStatusCommandHandler> logger)
        {
            _context = context;
            _currentUserService = currentUserService;
            _logger = logger;
        }

        public async Task Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
        {

            var task = await _context.Tasks
                .Include(t => t.TaskList)
                .ThenInclude(tl => tl.UserTaskLists)
                .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

            if (task == null)
            {
                _logger.LogWarning($"Task with ID {request.Id} not found.");
                throw new NotFoundException(nameof(Task), request.Id);
            }

            var currentUserId = int.Parse(_currentUserService.UserId!);
            if (!task.TaskList.UserTaskLists.Any(utl => utl.UserId == currentUserId))
            {
                _logger.LogWarning($"User {currentUserId} does not have access to task {request.Id}.");
                throw new ForbiddenAccessException();
            }

            task.IsCompleted = request.IsCompleted;
            _logger.LogInformation($"Updating task {request.Id} status to {request.IsCompleted}.");

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}