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
using Domain.Common;
using System;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;
        private readonly IEncryptionService _encryptionService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IDateTime _dateTime;

        public ApplicationDbContext(DbContextOptions options, AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor, IEncryptionService encryptionService, ICurrentUserService currentUserService, IDateTime dateTime) : base(options)
        {
            _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
            _encryptionService = encryptionService;
            _currentUserService = currentUserService;
            _dateTime = dateTime;
        }

        public IDbContextTransaction BeginTransaction()
        {
            return BeginTransaction();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedBy = _currentUserService.UserId;
                        entry.Entity.Created = _dateTime.Now;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModifiedBy = _currentUserService.UserId;
                        entry.Entity.LastModified = _dateTime.Now;
                        break;
                }
            }

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

            builder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
            builder.Entity<UserTaskList>().HasQueryFilter(utl => !utl.IsDeleted);
            builder.Entity<Task>().HasQueryFilter(t => !t.User!.IsDeleted);
            builder.Entity<TaskList>().HasQueryFilter(tl => !tl.UserTaskLists.Any(utl => utl.IsDeleted));

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
