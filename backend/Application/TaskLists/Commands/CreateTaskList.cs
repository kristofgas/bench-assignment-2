using Application.Common.Interfaces;
using Application.TaskLists.Dto;
using MediatR;
using Application.Common.Security;
using Application.Common.Exceptions;
using Domain.Entities;
using Application.Common.Security.Attributes;


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

        public CreateTaskListCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TaskListDto> Handle(CreateTaskListCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                throw new NotFoundException(nameof(User), request.UserId);
            }

            var entity = new Domain.Entities.TaskList
            {
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId
            };

            _context.TaskLists.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return new TaskListDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                UserId = entity.UserId
            };
        }
    }
}