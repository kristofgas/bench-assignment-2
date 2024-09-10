using Domain.Entities;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class TemplateExampleCustomerConfiguration : IEntityTypeConfiguration<TemplateExampleCustomer>
    {
        public void Configure(EntityTypeBuilder<TemplateExampleCustomer> builder)
        {
            builder.OwnsOne(x => x.Address);
            builder.Property(x => x.FirstName).Encrypted(true);
            builder.HasMany(x => x.Orders).WithOne(x => x.Customer).HasForeignKey(x => x.CustomerId).IsRequired(true);
        }
    }
}
