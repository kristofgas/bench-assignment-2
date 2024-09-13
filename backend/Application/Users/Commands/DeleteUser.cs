using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security.Attributes;
using Domain.Entities;
using MediatR;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.DeleteUser
{
    [Authorize(Domain.Enums.RoleEnum.Admin)]
    public class DeleteUserCommand : IRequest
    {
        public int UserId { get; set; }
    }

    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteUserCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async System.Threading.Tasks.Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .Include(u => u.UserTaskLists)
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
            {
                throw new NotFoundException(nameof(User), request.UserId);
            }

            user.IsDeleted = true;
            user.DeletedAt = DateTimeOffset.UtcNow;

            foreach (var userTaskList in user.UserTaskLists)
            {
                userTaskList.IsDeleted = true;
                userTaskList.DeletedAt = DateTimeOffset.UtcNow;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}