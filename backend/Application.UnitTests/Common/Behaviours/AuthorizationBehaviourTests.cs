using Application.Common.Behaviours;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using Application.Common.Security.Attributes;
using MediatR;
using Moq;
using Shouldly;
using System.ComponentModel;
using Xunit;

namespace Application.UnitTests.Common.Behaviours
{
    public class AuthorizationBehaviourTests
    {
        //TODO - Missing tests for two Roles with and without EvaluateAll




        [Fact]
        public async Task Handle_AuthorizeAttributeWithScopeAndRoleAndAuthorizationServiceHasScopeReturningTrueAndIsInRoleReturningTrue_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(true);
            authorizationServiceMock.Setup(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(new Role[] { It.IsAny<Role>() }, new Scope[] { It.IsAny<Scope>() }));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithScopeAndRoleAndAuthorizationServiceHasScopeReturningTrueAndIsInRoleReturningFalse_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(true);
            authorizationServiceMock.Setup(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(false);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(new Role[] { It.IsAny<Role>() }, new Scope[] { It.IsAny<Scope>() }));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithScopeAndRoleAndAuthorizationServiceHasScopeReturningFalseAndIsInRoleReturningTrue_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(false);
            authorizationServiceMock.Setup(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(new Role[] { It.IsAny<Role>() }, new Scope[] { It.IsAny<Scope>() }));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithEvaluateAllScopeAndRoleAndAuthorizationServiceHasScopeReturningTrueAndIsInRoleReturningTrue_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(true);
            authorizationServiceMock.Setup(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(new Role[] { It.IsAny<Role>() }, new Scope[] { It.IsAny<Scope>() }, true));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithEvaluateAllScopeAndRoleAndAuthorizationServiceHasScopeReturningTrueAndIsInRoleReturningFalse_ShouldThrowForbiddenAccessException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(true);
            authorizationServiceMock.Setup(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(false);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(new Role[] { It.IsAny<Role>() }, new Scope[] { It.IsAny<Scope>() }, true));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.ThrowAsync<ForbiddenAccessException>(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithEvaluateAllScopeAndRoleAndAuthorizationServiceHasScopeReturningFalseAndIsInRoleReturningTrue_ShouldThrowForbiddenAccessException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(false);
            authorizationServiceMock.Setup(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(new Role[] { It.IsAny<Role>() }, new Scope[] { It.IsAny<Scope>() }, true));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.ThrowAsync<ForbiddenAccessException>(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_MissingIAuthAttribute_ShouldThrowException()
        {
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();
            await Should.ThrowAsync<Exception>(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }


        [Fact]
        public async Task Handle_EmptyAuthorizeAttributeAndCurrentUserServiceReturningUserId_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute());
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_EmptyAuthorizeAttributeAndCurrentUserServiceReturningNullUserId_ShouldThrowUnauthorizedAccessException()
        {
            const string userId = null;
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute());
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.ThrowAsync<UnauthorizedAccessException>(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithScopeAndAuthorizationServiceHasScopeReturningFalse_ShouldThrowForbiddenAccessException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(false);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(It.IsAny<Scope>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.ThrowAsync<ForbiddenAccessException>(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithScopeAndAuthorizationServiceHasScopeReturningTrue_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(It.IsAny<Scope>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithTwoScopesAndAuthorizationServiceHasScopeFirstReturningFalseThenTrue_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.SetupSequence(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(false)
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(It.IsAny<Scope>(), It.IsAny<Scope>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithTwoScopesAndEvaluateAllAndAuthorizationServiceHasScopeFirstReturningFalseThenTrue_ShouldThrowForbiddenAccessException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.SetupSequence(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(false)
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(true, It.IsAny<Scope>(), It.IsAny<Scope>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.ThrowAsync<ForbiddenAccessException>(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithTwoScopesAndEvaluateAllAndAuthorizationServiceHasScopeReturningTrue_ShouldThrowForbiddenAccessException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.SetupSequence(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(true)
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(true, It.IsAny<Scope>(), It.IsAny<Scope>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }


        [Fact]
        public async Task Handle_AuthorizeAttributeWithTwoScopesAndAuthorizationServiceHasScopeReturningTrue_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.SetupSequence(x => x.HasScope(It.IsAny<Scope>()))
                .Returns(true)
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(It.IsAny<Scope>(), It.IsAny<Scope>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }


        /// <summary>

        [Fact]
        public async Task Handle_AuthorizeAttributeWithTwoRolesAndAuthorizationServiceIsInRoleFirstReturningFalseThenTrue_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.SetupSequence(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(false)
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(It.IsAny<Role>(), It.IsAny<Role>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithTwoRolesAndEvaluateAllAndAuthorizationServiceIsInRoleFirstReturningFalseThenTrue_ShouldThrowForbiddenAccessException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.SetupSequence(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(false)
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(true, It.IsAny<Role>(), It.IsAny<Role>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.ThrowAsync<ForbiddenAccessException>(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AuthorizeAttributeWithTwoRolesAndEvaluateAllAndAuthorizationServiceIsInRoleReturningTrue_ShouldThrowForbiddenAccessException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.SetupSequence(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(true)
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(true, It.IsAny<Role>(), It.IsAny<Role>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }


        [Fact]
        public async Task Handle_AuthorizeAttributeWithTwoRolesAndAuthorizationServiceIsInRoleReturningTrue_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.SetupSequence(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(true)
                .Returns(true);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(It.IsAny<Role>(), It.IsAny<Role>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }
        /// </summary>
        /// <returns></returns>

        [Fact]
        public async Task Handle_AuthorizeAttributeWithRoleAndAuthorizationServiceIsInRoleReturningFalse_ShouldThrowForbiddenAccessException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            authorizationServiceMock.Setup(x => x.IsInRole(It.IsAny<Role>()))
                .Returns(false);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AuthorizeAttribute(It.IsAny<Role>()));
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.ThrowAsync<ForbiddenAccessException>(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_TODOAuthorizeAttributeAndCurrentUserServiceReturningNullUserId_ShouldNotThrowException()
        {
            const string? userId = null;
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new TODOAuthorizeAttribute());
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AllowAnonymousAttributeAndCurrentUserServiceReturningNullUserId_ShouldNotThrowException()
        {
            const string? userId = null;
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AllowAnonymous());
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_TODOAuthorizeAttributeAndCurrentUserServiceReturningUserId_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new TODOAuthorizeAttribute());
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AllowAnonymousAttributeAndCurrentUserServiceReturningUserId_ShouldNotThrowException()
        {
            const string userId = "TestUser";
            var authorizationServiceMock = new Mock<IAuthorizationService>();
            var currentUserServiceMock = new Mock<ICurrentUserService>();

            currentUserServiceMock.Setup(x => x.UserId)
                .Returns(userId);

            var authorizationBehaviour = new AuthorizationBehaviour<IRequest<Unit>, Unit>(currentUserServiceMock.Object, authorizationServiceMock.Object);

            var requestMock = new Mock<IRequest<Unit>>();
            TypeDescriptor.AddAttributes(requestMock.Object, new AllowAnonymous());
            var deletegateMock = new Mock<RequestHandlerDelegate<Unit>>();

            await Should.NotThrowAsync(authorizationBehaviour.Handle(requestMock.Object, deletegateMock.Object, CancellationToken.None));
        }


    }
}
