using Infrastructure.Persistence;

namespace Application.IntegrationTests
{
    public class CommandTestBase : IDisposable
    {
        public CommandTestBase()
        {
            Context = ApplicationDbContextFactory.Create();
        }
        public ApplicationDbContext Context { get; }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            ApplicationDbContextFactory.Destroy(Context);
        }
    }
}
