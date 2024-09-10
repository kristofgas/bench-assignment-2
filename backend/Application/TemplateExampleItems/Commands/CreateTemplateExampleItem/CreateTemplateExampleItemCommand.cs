using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;
using Domain.Enums;
using MediatR;

namespace Application.TemplateExampleItems.Commands.CreateTemplateExampleItem
{
    [TODOAuthorize]
    public class CreateTemplateExampleItemCommand : IRequest<int>
    {
        public required string Name { get; set; }
        public required string Category { get; set; }
        public required string Description { get; set; }
        public required decimal Price { get; set; }


        public class CreateTemplateExampleItemCommandHandler : IRequestHandler<CreateTemplateExampleItemCommand, int>
        {
            private readonly IApplicationDbContext _applicationDbContext;

            public CreateTemplateExampleItemCommandHandler(IApplicationDbContext applicationDbContext)
            {
                _applicationDbContext = applicationDbContext;
            }

            public async Task<int> Handle(CreateTemplateExampleItemCommand request, CancellationToken cancellationToken)
            {
                var item = new TemplateExampleItem
                {
                    Name = request.Name,
                    Category = request.Category,
                    Description = request.Description,
                    Price = request.Price,
                    Status = TemplateExampleItemStatus.UnPublished
                };
                _applicationDbContext.TemplateExampleItems.Add(item);
                await _applicationDbContext.SaveChangesAsync(cancellationToken);

                return item.Id;
            }
        }
    }
}