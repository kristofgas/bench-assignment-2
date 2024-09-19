using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.TaskLists.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security.Attributes;

namespace Application.TaskLists.Commands.UpdateTaskList
{
    [Authorize]
    public class UpdateTaskListCommand : IRequest<TaskListDto>
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateTaskListCommandHandler : IRequestHandler<UpdateTaskListCommand, TaskListDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public UpdateTaskListCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<TaskListDto> Handle(UpdateTaskListCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = int.Parse(_currentUserService.UserId!);

            var taskList = await _context.TaskLists
                .Include(tl => tl.UserTaskLists)
                .FirstOrDefaultAsync(tl => tl.Id == request.Id, cancellationToken);

            if (taskList == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.TaskList), request.Id);
            }

            if (!taskList.UserTaskLists.Any(utl => utl.UserId == currentUserId && !utl.IsDeleted))
            {
                throw new ForbiddenAccessException();
            }

            if (request.Name != null)
            {
                taskList.Name = request.Name;
            }

            if (request.Description != null)
            {
                taskList.Description = request.Description;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new TaskListDto
            {
                Id = taskList.Id,
                Name = taskList.Name,
                Description = taskList.Description,
                UserIds = taskList.UserTaskLists.Select(utl => utl.UserId).ToList()
            };
        }
    }
}