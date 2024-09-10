using Infrastructure.Services;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Linq.Expressions;

namespace Infrastructure.ValueConverters
{
    class EncryptedConverter : ValueConverter<string, string>
    {
        class EncryptedConverterWrapper
        {
            private readonly IEncryptionService _encryptionService;
            private readonly bool _constantIV;

            public EncryptedConverterWrapper(IEncryptionService encryptionService, bool constantIV)
            {
                _encryptionService = encryptionService;
                _constantIV = constantIV;
            }

#pragma warning disable CS8603 // Possible null reference return.
            public Expression<Func<string, string>> Encrypt => x => _encryptionService.EncryptString(x, _constantIV);
            public Expression<Func<string, string>> Decrypt => x => _encryptionService.DecryptString(x, _constantIV);
#pragma warning restore CS8603 // Possible null reference return.
        }


#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.
        public EncryptedConverter(IEncryptionService encryptionService, bool constantIV, ConverterMappingHints mappingHints = default) : this(new EncryptedConverterWrapper(encryptionService, constantIV), mappingHints)
#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.
        { }

        EncryptedConverter(EncryptedConverterWrapper wrapper, ConverterMappingHints mappingHints) : base(wrapper.Encrypt, wrapper.Decrypt, mappingHints)
        { }
    }
}
