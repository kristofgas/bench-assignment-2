using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.TemplateExampleCustomers.Queries.GetTemplateExampleCustomers
{
    [TODOAuthorize]

    public class GetTemplateExampleCustomersQuery : IRequest<List<TemplateExampleSimpleCustomerDTO>>
    {

        public class GetTemplateExampleCustomersQueryHandler : IRequestHandler<GetTemplateExampleCustomersQuery, List<TemplateExampleSimpleCustomerDTO>>
        {
            private readonly IApplicationDbContext _applicationDbContext;
            private readonly IMapper _mapper;

            public GetTemplateExampleCustomersQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
            {
                _applicationDbContext = applicationDbContext;
                _mapper = mapper;
            }

            public Task<List<TemplateExampleSimpleCustomerDTO>> Handle(GetTemplateExampleCustomersQuery request, CancellationToken cancellationToken)
            {
                var customers = _applicationDbContext.TemplateExampleCustomers.AsNoTracking()
                    .ProjectTo<TemplateExampleSimpleCustomerDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return customers;
            }
        }
    }
}