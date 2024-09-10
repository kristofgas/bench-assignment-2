using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;

namespace Application.Tasks.Commands.UpdateTaskStatus
{
    [TODOAuthorize]
    public class UpdateTaskStatusCommand : IRequest
    {
        public int Id { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class UpdateTaskStatusCommandHandler : IRequestHandler<UpdateTaskStatusCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateTaskStatusCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Tasks.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(Task), request.Id);
            }

            entity.IsCompleted = request.IsCompleted;

            await _context.SaveChangesAsync(cancellationToken);

        }
    }
}