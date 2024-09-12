using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Task = Domain.Entities.Task;

namespace Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        IDbContextTransaction BeginTransaction();

        DbSet<TemplateExampleCustomer> TemplateExampleCustomers { get; set; }
        DbSet<TemplateExampleItem> TemplateExampleItems { get; set; }
        DbSet<TemplateExampleOrder> TemplateExampleOrders { get; set; }
        
        DbSet<Task> Tasks { get; set; }

        DbSet<TaskList> TaskLists { get; set; }

        DbSet<User> Users { get; set; }

        DbSet<Role> Roles { get; set; }
        DbSet<UserRole> UserRoles { get; set; }

        DbSet<UserTaskList> UserTaskLists { get; set; }

        //DbSet<IdentityUserRole<int>> UserRoles { get; set; }
        //DbSet<IdentityRole<int>> Roles { get; set; }

    }
}
