using Infrastructure.Services;
using Infrastructure.ValueConverters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Infrastructure.Extensions
{
    public static class ModelBuilderExtensions
    {
        public static void UseEncryption(this ModelBuilder modelBuilder, IEncryptionService encryptionService)
        {
            if (modelBuilder is null)
                throw new ArgumentNullException(nameof(modelBuilder), "modelBuilder null");
            if (encryptionService is null)
                throw new ArgumentNullException(nameof(encryptionService), "encryptionService null");

            foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (IMutableProperty property in entityType.GetProperties())
                {
                    if (property.GetAnnotations().Any(x => x.Name == PropertyBuilderExtensions.AnnotationName))
                    {
                        property.SetValueConverter(new EncryptedConverter(encryptionService, false));
                        property.RemoveAnnotation(PropertyBuilderExtensions.AnnotationName);
                    }
                    else if (property.GetAnnotations().Any(x => x.Name == PropertyBuilderExtensions.IgnoredIVAnnotationName))
                    {
                        property.SetValueConverter(new EncryptedConverter(encryptionService, true));
                        property.RemoveAnnotation(PropertyBuilderExtensions.IgnoredIVAnnotationName);
                    }

                }
            }

        }
    }
}
