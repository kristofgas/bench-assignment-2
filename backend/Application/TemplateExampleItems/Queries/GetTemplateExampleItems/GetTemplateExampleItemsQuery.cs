using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.TemplateExampleItems.Queries.GetTemplateExampleItems
{
    [TODOAuthorize]
    public class GetTemplateExampleItemsQuery : IRequest<List<TemplateExampleItemDTO>>
    {
        public TemplateExampleItemStatus? Status { get; set; }

        public class GetTemplateExampleItemsQueryHandler : IRequestHandler<GetTemplateExampleItemsQuery, List<TemplateExampleItemDTO>>
        {
            private readonly IApplicationDbContext _applicationDbContext;
            private readonly IMapper _mapper;

            public GetTemplateExampleItemsQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
            {
                _applicationDbContext = applicationDbContext;
                _mapper = mapper;
            }

            public async Task<List<TemplateExampleItemDTO>> Handle(GetTemplateExampleItemsQuery request, CancellationToken cancellationToken)
            {

                var query = _applicationDbContext.TemplateExampleItems.AsNoTracking();

                if (request.Status.HasValue)
                {
                    query = query.Where(x => x.Status == request.Status);
                }

                return await query.ProjectTo<TemplateExampleItemDTO>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
            }
        }
    }
}