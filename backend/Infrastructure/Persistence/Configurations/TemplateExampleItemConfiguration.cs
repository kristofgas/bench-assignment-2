using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class TemplateExampleItemConfiguration : IEntityTypeConfiguration<TemplateExampleItem>
    {
        public void Configure(EntityTypeBuilder<TemplateExampleItem> builder)
        {
            builder.HasMany(x => x.OrderItems).WithOne(x => x.Item).HasForeignKey(x => x.ItemId).IsRequired(true);
            builder.Property(x => x.Price).HasPrecision(16, 2);
        }
    }
}
