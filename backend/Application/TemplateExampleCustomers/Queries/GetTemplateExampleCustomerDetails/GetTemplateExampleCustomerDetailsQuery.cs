using Application.Common.Exceptions;
using Application.Common.Exceptions.Enums;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.TemplateExampleCustomers.Queries.GetTemplateExampleCustomerDetails
{
    [TODOAuthorize]

    public class GetTemplateExampleCustomerDetailsQuery : IRequest<TemplateExampleDetailedCustomerDTO>
    {
        public required int Id { get; set; }


        public class GetTemplateExampleCustomerDetailsQueryHandler : IRequestHandler<GetTemplateExampleCustomerDetailsQuery, TemplateExampleDetailedCustomerDTO>
        {
            private readonly IApplicationDbContext _applicationDbContext;
            private readonly IMapper _mapper;

            public GetTemplateExampleCustomerDetailsQueryHandler(IApplicationDbContext applicationDbContext, IMapper mapper)
            {
                _applicationDbContext = applicationDbContext;
                _mapper = mapper;
            }

            public async Task<TemplateExampleDetailedCustomerDTO> Handle(GetTemplateExampleCustomerDetailsQuery request, CancellationToken cancellationToken)
            {
                var customer = await _applicationDbContext.TemplateExampleCustomers.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
                if (customer == null)
                {
                    throw new CommandErrorCodeException(CommandErrorCode.TemplateExampleEntityNotFound);
                }

                return _mapper.Map<TemplateExampleDetailedCustomerDTO>(customer);
            }
        }
    }
}