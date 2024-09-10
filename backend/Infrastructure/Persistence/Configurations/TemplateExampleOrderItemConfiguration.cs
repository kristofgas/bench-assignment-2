using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class TemplateExampleOrderItemConfiguration : IEntityTypeConfiguration<TemplateExampleOrderItem>
    {
        public void Configure(EntityTypeBuilder<TemplateExampleOrderItem> builder)
        {
            builder.HasKey(x => new { x.OrderId, x.ItemId });
            builder.HasOne(x => x.Order).WithMany(x => x.OrderItems).HasForeignKey(x => x.OrderId).IsRequired(true);
            builder.HasOne(x => x.Item).WithMany(x => x.OrderItems).HasForeignKey(x => x.ItemId).IsRequired(true);
        }
    }
}
