using Application.Common.Interfaces;
using Application.TaskLists.Dto;
using MediatR;
using Application.Common.Security;
using Application.Common.Exceptions;
using Domain.Entities;
using Application.Common.Security.Attributes;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;


namespace Application.TaskLists.Commands.CreateTaskList
{
    [Authorize]
    public class CreateTaskListCommand : IRequest<TaskListDto>
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int UserId { get; set; }
    }

    public class CreateTaskListCommandHandler : IRequestHandler<CreateTaskListCommand, TaskListDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public CreateTaskListCommandHandler(IApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<TaskListDto> Handle(CreateTaskListCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId && !u.IsDeleted);
            if (user == null)
            {
                throw new NotFoundException(nameof(User), request.UserId);
            }

            var entity = new TaskList
            {
                Name = request.Name,
                Description = request.Description,
            };

            _context.TaskLists.Add(entity);

            var userTaskList = new UserTaskList { UserId = request.UserId, TaskList = entity };
            _context.UserTaskLists.Add(userTaskList);

            await _context.SaveChangesAsync(cancellationToken);

            await _notificationService.SendTaskListCreatedNotification(entity.Id, entity.Id);

            return new TaskListDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                UserIds = new List<int> { request.UserId },
                CreatedBy = entity.CreatedBy
            };
        }
    }
}