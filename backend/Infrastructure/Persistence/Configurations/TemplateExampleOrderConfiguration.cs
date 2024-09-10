using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class TemplateExampleOrderConfiguration : IEntityTypeConfiguration<TemplateExampleOrder>
    {
        public void Configure(EntityTypeBuilder<TemplateExampleOrder> builder)
        {
            builder.HasMany(x => x.OrderItems).WithOne(x => x.Order).HasForeignKey(x => x.OrderId).IsRequired(true);
            builder.HasOne(x => x.Customer).WithMany(x => x.Orders).HasForeignKey(x => x.CustomerId).IsRequired(true);
            builder.OwnsOne(x => x.ShippingAddress);
            builder.Property(x => x.Total).HasPrecision(16, 2);
        }
    }
}
