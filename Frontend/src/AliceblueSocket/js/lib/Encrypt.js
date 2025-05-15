function encryptBlock(src, publicKey, keySize) {
    var crypt = new JSEncrypt();
    crypt.setPublicKey(publicKey);
    var numberOfBytes = parseInt(parseInt(keySize / 8) - 11);

    var start = 0;
    var end = numberOfBytes;
    var encryptedString = "";

    if (numberOfBytes > src.length)
    {
        end = src.length;
    }

    do {
        var bytes = src.substring(start, end);
        encryptedString += crypt.encrypt(bytes);
        encryptedString += '\n';

        start = end;
        end = end + numberOfBytes;
        if (end > src.length)
        {
            end = src.length;
        }
    } while (end < src.length);

    if ((end - start) > 0)
    {
        var bytes = src.substring(start, end);
        encryptedString += crypt.encrypt(bytes);
        encryptedString += '\n';
    }
    return btoa(encryptedString);
}

function decrypt(privateKey, src) {
    var plainText = '';
    var crypt = new JSEncrypt();
    crypt.setPublicKey(privateKey);
    var encryptedText = atob(src);
    var encryptArray = encryptedText.split('\n');

    for (var i = 0; i < encryptArray.length; i = i + 1)
    {
        var block = encryptArray[i];
        if (block != '')
        {
            plainText += crypt.decrypt(block);
        }
    }
    return plainText;
}