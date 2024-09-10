#nullable disable

namespace Infrastructure.Services.Options
{
    public class EncryptionOptions
    {
        public const string OptionsPath = "Encryption";
        public string AesSecret { get; set; }
        public int AesSaltSeed { get; set; }
        public string IVSecret { get; set; }
        public int IVSaltSeed { get; set; }
    }
}
