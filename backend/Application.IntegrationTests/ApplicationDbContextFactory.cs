using Application.Common.Interfaces.Application.Common.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;

namespace Application.IntegrationTests
{
    public static class ApplicationDbContextFactory
    {
        public static ApplicationDbContext Create()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var currentUserServiceMock = new Mock<ICurrentUserService>();
            currentUserServiceMock.Setup(x => x.UserId).Returns("TEST");
            var auditableEntitySaveChangesInterceptorMock = new Mock<AuditableEntitySaveChangesInterceptor>(currentUserServiceMock.Object);
            var encryptionServiceMock = new Mock<IEncryptionService>();
            encryptionServiceMock
                .Setup(x => x.EncryptString(It.IsAny<string>(), It.IsAny<bool>()))
                .Returns<string?, bool>((x, y) => x);
            encryptionServiceMock
                .Setup(x => x.DecryptString(It.IsAny<string>(), It.IsAny<bool>()))
                .Returns<string?, bool>((x, y) => x);

            var context = new ApplicationDbContext(options, auditableEntitySaveChangesInterceptorMock.Object, encryptionServiceMock.Object);

            context.Database.EnsureCreated();

            return context;
        }


        public static void Destroy(ApplicationDbContext context)
        {
            context.Database.EnsureDeleted();

            context.Dispose();
        }
    }
}
