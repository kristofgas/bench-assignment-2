using Application.Common.Interfaces;
using FluentValidation;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using NSwag;
using NSwag.Generation.Processors.Security;
using Web.DocumentProcessors;
using Web.Filters;
using Web.Services;
using IAuthorizationService = Application.Common.Interfaces.IAuthorizationService;

namespace Web
{
    public static class WebServiceConfiguration
    {

        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {

            services.AddCors(options =>
            {
                var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>();
                options.AddPolicy("DefaultCors",
                  builder =>
                  {
                      if (allowedOrigins is not null && allowedOrigins.Length > 0)
                      {
                          builder.WithOrigins(allowedOrigins)
                                 .AllowAnyHeader()
                                 .AllowAnyMethod()
                                 .AllowCredentials();
                      }
                      else
                      {
                          builder.AllowAnyOrigin()
                                 .AllowAnyHeader()
                                 .AllowAnyMethod();
                      }
                  });
            }); ;


            services.AddHttpContextAccessor();
            services.AddHealthChecks().AddDbContextCheck<ApplicationDbContext>();
            services.AddValidatorsFromAssemblyContaining<IApplicationDbContext>();
            services.AddControllers(options =>
                             options.Filters.Add<ApiExceptionFilterAttribute>());


            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            services.AddOpenApiDocument(configure =>
            {
                configure.Title = "Backend API";
                configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.ApiKey,
                    Name = "Authorization",
                    In = OpenApiSecurityApiKeyLocation.Header,
                    Description = "Bearer {your JWT token}."
                });

                configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
                configure.DocumentProcessors.Add(new CustomDocumentProcessor());
            });

            services.AddScoped<IAuthorizationService, Infrastructure.Services.AuthorizationService>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            //services.AddSignalR();
        }
    }
}