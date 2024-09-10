using Infrastructure.Services;
using Infrastructure.Services.Options;
using Microsoft.Extensions.Options;
using Moq;
using Shouldly;
using Xunit;

namespace Infrastructure.UnitTests.Services
{
    public class EncryptionServiceTests
    {

        [Fact]
        public void EncryptString_ConstantIVFalse_ShouldReturnEncryptedString()
        {
            const string AesSecret = "TestSecret";
            const int AesSaltSeed = 200;
            const string IVSecret = "TestSecret";
            const int IVSaltSeed = 100;

            const string textToEncrypt = "EncryptText";

            var options = new EncryptionOptions
            {
                AesSecret = AesSecret,
                AesSaltSeed = AesSaltSeed,
                IVSecret = IVSecret,
                IVSaltSeed = IVSaltSeed
            };

            var optionsMock = new Mock<IOptions<EncryptionOptions>>();

            optionsMock.Setup(x => x.Value)
                .Returns(options);

            var encryptionService = new EncryptionService(optionsMock.Object);

            var cipherText = encryptionService.EncryptString(textToEncrypt);

            textToEncrypt.ShouldNotBe(cipherText);
        }

        [Fact]
        public void EncryptString_EncryptingSameTextTwiceConstantIVFalse_ShouldReturnDifferentEncryptedStrings()
        {
            const string AesSecret = "TestSecret";
            const int AesSaltSeed = 200;
            const string IVSecret = "TestSecret";
            const int IVSaltSeed = 100;

            const string textToEncrypt = "EncryptText";

            var options = new EncryptionOptions
            {
                AesSecret = AesSecret,
                AesSaltSeed = AesSaltSeed,
                IVSecret = IVSecret,
                IVSaltSeed = IVSaltSeed
            };

            var optionsMock = new Mock<IOptions<EncryptionOptions>>();

            optionsMock.Setup(x => x.Value)
                .Returns(options);

            var encryptionService = new EncryptionService(optionsMock.Object);

            var cipherText1 = encryptionService.EncryptString(textToEncrypt);
            var cipherText2 = encryptionService.EncryptString(textToEncrypt);

            cipherText1.ShouldNotBe(cipherText2);
        }


        [Fact]
        public void EncryptString_EncryptingSameTextTwiceConstantIVTrue_ShouldReturnEqualEncryptedStrings()
        {
            const string AesSecret = "TestSecret";
            const int AesSaltSeed = 200;
            const string IVSecret = "TestSecret";
            const int IVSaltSeed = 100;

            const string textToEncrypt = "EncryptText";

            var options = new EncryptionOptions
            {
                AesSecret = AesSecret,
                AesSaltSeed = AesSaltSeed,
                IVSecret = IVSecret,
                IVSaltSeed = IVSaltSeed
            };

            var optionsMock = new Mock<IOptions<EncryptionOptions>>();

            optionsMock.Setup(x => x.Value)
                .Returns(options);

            var encryptionService = new EncryptionService(optionsMock.Object);

            var cipherText1 = encryptionService.EncryptString(textToEncrypt, true);
            var cipherText2 = encryptionService.EncryptString(textToEncrypt, true);

            cipherText1.ShouldBe(cipherText2);
        }

        [Fact]
        public void EncryptString_ConstantIVFalse_ShouldBeDecryptedToOriginalText()
        {
            const string AesSecret = "TestSecret";
            const int AesSaltSeed = 200;
            const string IVSecret = "TestSecret";
            const int IVSaltSeed = 100;

            const string textToEncrypt = "EncryptText";

            var options = new EncryptionOptions
            {
                AesSecret = AesSecret,
                AesSaltSeed = AesSaltSeed,
                IVSecret = IVSecret,
                IVSaltSeed = IVSaltSeed
            };

            var optionsMock = new Mock<IOptions<EncryptionOptions>>();

            optionsMock.Setup(x => x.Value)
                .Returns(options);

            var encryptionService = new EncryptionService(optionsMock.Object);

            var cipherText = encryptionService.EncryptString(textToEncrypt);

            var decryptedCipherText = encryptionService.DecryptString(cipherText);

            decryptedCipherText.ShouldBe(textToEncrypt);
        }

        [Fact]
        public void EncryptString_EncryptingSameTextTwiceConstantIVFalse_ShouldBothBeDecryptedToOriginalText()
        {
            const string AesSecret = "TestSecret";
            const int AesSaltSeed = 200;
            const string IVSecret = "TestSecret";
            const int IVSaltSeed = 100;

            const string textToEncrypt = "EncryptText";

            var options = new EncryptionOptions
            {
                AesSecret = AesSecret,
                AesSaltSeed = AesSaltSeed,
                IVSecret = IVSecret,
                IVSaltSeed = IVSaltSeed
            };

            var optionsMock = new Mock<IOptions<EncryptionOptions>>();

            optionsMock.Setup(x => x.Value)
                .Returns(options);

            var encryptionService = new EncryptionService(optionsMock.Object);

            var cipherText1 = encryptionService.EncryptString(textToEncrypt);
            var cipherText2 = encryptionService.EncryptString(textToEncrypt);

            var decryptedCipherText1 = encryptionService.DecryptString(cipherText1);
            var decryptedCipherText2 = encryptionService.DecryptString(cipherText2);

            decryptedCipherText1.ShouldBe(textToEncrypt);
            decryptedCipherText2.ShouldBe(textToEncrypt);
        }


        [Fact]
        public void EncryptString_EncryptingSameTextTwiceConstantIVTrue_ShouldBothBeDecryptedToOriginalText()
        {
            const string AesSecret = "TestSecret";
            const int AesSaltSeed = 200;
            const string IVSecret = "TestSecret";
            const int IVSaltSeed = 100;

            const string textToEncrypt = "EncryptText";

            var options = new EncryptionOptions
            {
                AesSecret = AesSecret,
                AesSaltSeed = AesSaltSeed,
                IVSecret = IVSecret,
                IVSaltSeed = IVSaltSeed
            };

            var optionsMock = new Mock<IOptions<EncryptionOptions>>();

            optionsMock.Setup(x => x.Value)
                .Returns(options);

            var encryptionService = new EncryptionService(optionsMock.Object);


            var cipherText1 = encryptionService.EncryptString(textToEncrypt, true);
            var cipherText2 = encryptionService.EncryptString(textToEncrypt, true);

            var decryptedCipherText1 = encryptionService.DecryptString(cipherText1, true);
            var decryptedCipherText2 = encryptionService.DecryptString(cipherText2, true);

            decryptedCipherText1.ShouldBe(textToEncrypt);
            decryptedCipherText2.ShouldBe(textToEncrypt);
        }
    }
}
