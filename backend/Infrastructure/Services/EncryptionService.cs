using Infrastructure.Services.Options;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;

namespace Infrastructure.Services
{
    public class EncryptionService : IEncryptionService
    {
        private readonly EncryptionOptions _encryptionOptions;
        private const int _ivLength = 16;
        private const int _aesSaltLength = 8;
        private const int _aesKeyLength = 32;
        private readonly byte[] _aesKey;
        private readonly byte[] _constantIV;

        public EncryptionService(IOptions<EncryptionOptions> encryptionOptions)
        {
            _encryptionOptions = encryptionOptions.Value;
            _aesKey = GenerateKeyFromSecret(_encryptionOptions.AesSecret, _encryptionOptions.AesSaltSeed, _aesKeyLength);
            _constantIV = GenerateKeyFromSecret(_encryptionOptions.IVSecret, _encryptionOptions.IVSaltSeed, _ivLength);
        }

        public string? EncryptString(string? text, bool constantIV = false)
        {
            if (text is null)
                return null;
            var iv = new byte[16];
            if (constantIV)
                iv = _constantIV;
            else
                new Random().NextBytes(iv);

            byte[] encrypted;
            using (Aes aesAlg = Aes.Create())
            {
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(_aesKey, iv);

                using (MemoryStream msEncrypt = new())
                {
                    using (CryptoStream csEncrypt = new(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new(csEncrypt))
                        {
                            swEncrypt.Write(text);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(Combine(encrypted, iv));
        }

        public string? DecryptString(string? cipherText, bool constantIV = false)
        {
            if (cipherText is null)
                return null;
            var encryptedBytes = Convert.FromBase64String(cipherText);
            var encryptedData = new byte[encryptedBytes.Length - _ivLength];
            var iv = new byte[_ivLength];

            Buffer.BlockCopy(encryptedBytes, 0, encryptedData, 0, encryptedBytes.Length - _ivLength); ;
            Buffer.BlockCopy(encryptedBytes, encryptedData.Length, iv, 0, _ivLength);

            var decrypted = "";

            using (Aes aesAlg = Aes.Create())
            {
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(_aesKey, iv);

                using (MemoryStream msDecrypt = new MemoryStream(encryptedData))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            decrypted = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return decrypted;
        }

        private static byte[] GenerateKeyFromSecret(string secret, int saltSeed, int length)
        {
            var salt = new byte[_aesSaltLength];
            new Random(saltSeed).NextBytes(salt);

            var rfc2898DeriveBytes = new Rfc2898DeriveBytes(secret, salt, 1000, HashAlgorithmName.SHA512);

            return rfc2898DeriveBytes.GetBytes(length);
        }

        private static byte[] Combine(byte[] first, byte[] second)
        {
            byte[] newArr = new byte[first.Length + second.Length];
            Buffer.BlockCopy(first, 0, newArr, 0, first.Length);
            Buffer.BlockCopy(second, 0, newArr, first.Length, second.Length);
            return newArr;
        }
    }
}
