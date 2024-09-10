using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.TemplateExampleOrders.Queries.GetTemplateExampleOrders
{
    [TODOAuthorize]
    public class GetTemplateExampleOrdersQuery : IRequest<List<TemplateExampleOrderDTO>>
    {

        public class GetTemplateExampleOrdersQueryHandler : IRequestHandler<GetTemplateExampleOrdersQuery, List<TemplateExampleOrderDTO>>
        {
            private readonly IApplicationDbContext _applicationDbContext;
            private readonly IMapper _mapper;

            public GetTemplateExampleOrdersQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
            {
                _applicationDbContext = applicationDbContext;
                _mapper = mapper;
            }

            public async Task<List<TemplateExampleOrderDTO>> Handle(GetTemplateExampleOrdersQuery request, CancellationToken cancellationToken)
            {
                var orders = await _applicationDbContext.TemplateExampleOrders
                    .Include(x => x.OrderItems!).ThenInclude(x => x.Item)
                    .Include(x => x.Customer).AsNoTracking()
                    .ProjectTo<TemplateExampleOrderDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return orders;
            }
        }
    }
}