using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Extensions;
using Infrastructure.Persistence.Interceptors;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Reflection;
using System.Reflection.Emit;
using Task = Domain.Entities.Task;


namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;
        private readonly IEncryptionService _encryptionService;

        public ApplicationDbContext(DbContextOptions options, AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor, IEncryptionService encryptionService) : base(options)
        {
            _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
            _encryptionService = encryptionService;
        }

        public IDbContextTransaction BeginTransaction()
        {
            return BeginTransaction();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await base.SaveChangesAsync(cancellationToken);
        }

   
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

    builder.UseEncryption(_encryptionService);

            builder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                    .HasConversion<string>()
                    .IsRequired();
            });

            builder.Entity<UserRole>()
        .HasKey(ur => new { ur.UserId, ur.RoleId });

    builder.Entity<UserRole>()
        .HasOne(ur => ur.User)
        .WithMany(u => u.UserRoles)
        .HasForeignKey(ur => ur.UserId);

    builder.Entity<UserRole>()
        .HasOne(ur => ur.Role)
        .WithMany(r => r.UserRoles)
        .HasForeignKey(ur => ur.RoleId);

            builder.Entity<UserTaskList>()
    .HasKey(utl => new { utl.UserId, utl.TaskListId });

            builder.Entity<UserTaskList>()
                .HasOne(utl => utl.User)
                .WithMany(u => u.UserTaskLists)
                .HasForeignKey(utl => utl.UserId);

            builder.Entity<UserTaskList>()
                .HasOne(utl => utl.TaskList)
                .WithMany(tl => tl.UserTaskLists)
                .HasForeignKey(utl => utl.TaskListId);

            base.OnModelCreating(builder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
        }


        public DbSet<TemplateExampleCustomer> TemplateExampleCustomers { get; set; }
        public DbSet<TemplateExampleItem> TemplateExampleItems { get; set; }
        public DbSet<TemplateExampleOrderItem> TemplateExampleOrderItems { get; set; }
        public DbSet<TemplateExampleOrder> TemplateExampleOrders { get; set; }
        public DbSet<TaskList> TaskLists { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<UserTaskList> UserTaskLists { get; set; }
        //public DbSet<IdentityUserRole<int>> UserRoles { get; set; }
        //public DbSet<IdentityRole<int>> Roles { get; set; }
        public async System.Threading.Tasks.Task SeedRolesAsync()
        {
            if (!await Roles.AnyAsync())
            {
                await Roles.AddRangeAsync(
                    new Role { Name = RoleEnum.User },
                    new Role { Name = RoleEnum.Admin }
                );
                await SaveChangesAsync();
            }
        }

    }
}
