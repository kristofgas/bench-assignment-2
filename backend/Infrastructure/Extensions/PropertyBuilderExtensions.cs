using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Extensions
{
    public static class PropertyBuilderExtensions
    {
        public static readonly string IgnoredIVAnnotationName = "ENCRYPTEDPROPERTYIGNORE";
        public static readonly string AnnotationName = "ENCRYPTEDPROPERTY";
        /// <summary>
        /// Automatically encrypt/decrypt the property.
        /// </summary>
        /// <param name="propertyBuilder"></param>
        /// <param name="constantIV">ConstantIV enables the use of a constant IV for AES encryption, this is to allow simple equality queries through EF without the need of serverside decryption.</param>
        /// <returns></returns>
        public static PropertyBuilder<string> Encrypted(this PropertyBuilder<string> propertyBuilder, bool constantIV = false)
        {
            if (constantIV)
            {
                propertyBuilder.Metadata.AddAnnotation(IgnoredIVAnnotationName, null);

            }
            else
            {
                propertyBuilder.Metadata.AddAnnotation(AnnotationName, null);
            }

            return propertyBuilder;
        }
    }
}
