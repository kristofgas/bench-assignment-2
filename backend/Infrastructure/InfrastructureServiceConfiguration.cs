using Application.Common.Interfaces;
using Infrastructure.Options;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Services;
using Infrastructure.Services.Options;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure
{
    public static class InfrastructureServiceConfiguration
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
        {
            services.AddScoped<AuditableEntitySaveChangesInterceptor>();
            services.AddOptions<DatabaseOptions>()
                .Bind(configuration.GetSection(DatabaseOptions.Key));

            services.AddScoped<ICurrentUserService, CurrentUserService>();
            if (!environment.IsEnvironment("Test") && !environment.IsEnvironment("NSwag"))
            {
                var dbOptions = configuration.GetSection(DatabaseOptions.Key).Get<DatabaseOptions>();
                var connectionString = configuration.GetConnectionString("DefaultConnection");

                if (dbOptions is not null)
                {
                    var sqlConnectionStringBuilder = new SqlConnectionStringBuilder()
                    {
                        PersistSecurityInfo = false,
                        MultipleActiveResultSets = false,
                        Encrypt = true,
                        TrustServerCertificate = false,
                        ConnectTimeout = 30
                    };

                    if (dbOptions.Name is not null)
                        sqlConnectionStringBuilder.InitialCatalog = dbOptions.Name;
                    if (dbOptions.Username is not null)
                        sqlConnectionStringBuilder.UserID = dbOptions.Username;
                    if (dbOptions.Password is not null)
                        sqlConnectionStringBuilder.Password = dbOptions.Password;
                        sqlConnectionStringBuilder.Password = dbOptions.Password;
                    if (dbOptions.Server is not null)
                        sqlConnectionStringBuilder.DataSource = dbOptions.Server;

                    connectionString = sqlConnectionStringBuilder.ConnectionString;
                }

                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(
                        connectionString,
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

                services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

                
            }
            services.AddScoped<INotificationService, NotificationService>();

            services.AddOptions<EncryptionOptions>()
                .Bind(configuration.GetSection(EncryptionOptions.OptionsPath));

            services.AddSingleton<IEncryptionService, EncryptionService>();

        }
    }
}
