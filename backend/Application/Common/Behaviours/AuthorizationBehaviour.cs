using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security.Attributes;
using Domain.Enums;
using MediatR;
using System.Reflection;

namespace Application.Common.Behaviours
{
    public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IAuthorizationService _authorizationService;

        public AuthorizationBehaviour(
            ICurrentUserService currentUserService,
            IAuthorizationService authorizationService)
        {
            _currentUserService = currentUserService;
            _authorizationService = authorizationService;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();

            if (authorizeAttributes.Any())
            {
                if (_currentUserService.UserId == null)
                {
                    throw new UnauthorizedAccessException();
                }

                var authorizeAttributesWithRoles = authorizeAttributes.Where(a => a.Roles.Any());

                if (authorizeAttributesWithRoles.Any())
                {
                    foreach (var attribute in authorizeAttributesWithRoles)
                    {
                        var authorized = false;
                        foreach (var role in attribute.Roles)
                        {
                            var isInRole = await _authorizationService.IsInRoleAsync(_currentUserService.UserId, role);
                            if (isInRole)
                            {
                                authorized = true;
                                break;
                            }
                        }

                        if (!authorized)
                        {
                            throw new ForbiddenAccessException();
                        }
                    }
                }
            }

            return await next();
        }
    }
}