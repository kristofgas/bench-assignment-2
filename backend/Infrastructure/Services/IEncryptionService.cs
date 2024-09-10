namespace Infrastructure.Services
{
    public interface IEncryptionService
    {
        string? EncryptString(string? text, bool constantIV = false);
        string? DecryptString(string? cipherText, bool constantIV = false);
    }
}
