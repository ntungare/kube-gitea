import fs from 'fs';
import { pki, util, md, random, cipher } from 'node-forge';
import path from 'path';
import prompt from 'prompt';

// // RSA public key in PEM format
// const publicKeyPem = fs
//     .readFileSync(path.join(path.resolve(), 'keys', 'public_key.pem'), 'utf8')
//     .toString();

// RSA private key in PEM format
const privateKeyPem = fs
    .readFileSync(path.join(path.resolve(), 'keys', 'private_key.pem'), 'utf8')
    .toString();

// Your private key in PEM format
const wrappedEncryptedAesKey = fs
    .readFileSync(path.join(path.resolve(), 'keys', 'aes256.key.wrap'), 'utf8')
    .toString();

const pathToPlainTextTokenFile = path.join(path.resolve(), '../config.yml');
if (!fs.existsSync(pathToPlainTextTokenFile)) {
    throw new Error(
        `Could not find token in plain text, expecting token at file path: ${pathToPlainTextTokenFile}`
    );
}

const textToEncrypt = fs.readFileSync(pathToPlainTextTokenFile, 'utf8').toString();

prompt.start();
prompt.get<{ password: string }>(
    {
        properties: {
            password: {
                description: 'Enter a password to encrypt the private key',
                hidden: true,
                replace: '*',
            },
        },
    },
    (err, result) => {
        if (err) {
            console.error('Error getting password:', err);
            return;
        }
        const password = result.password;

        console.error('Received password:', password);

        // Convert PEM to Forge private key object
        const privateKey = pki.decryptRsaPrivateKey(privateKeyPem, password);

        const encryptedAesKey = util.decode64(wrappedEncryptedAesKey);
        const aesKey = privateKey.decrypt(encryptedAesKey, 'RSA-OAEP', { md: md.sha256.create() });

        // 12 byte iv for AES-256-GCM
        const encryptionIv = random.getBytesSync(12);

        const cipherClient = cipher.createCipher('AES-GCM', aesKey);
        cipherClient.start({ iv: encryptionIv });
        cipherClient.update(util.createBuffer(textToEncrypt, 'utf8'));
        const cipherResult = cipherClient.finish();

        if (!cipherResult) {
            throw new Error("Encryption Failed");
        }

        const encryptedText = cipherClient.output.getBytes();
        const authTag = cipherClient.mode.tag.getBytes();

        // Encode the result to Base64 for easy handling/transmission
        const wrappedEncryptionIv = util.encode64(encryptionIv);
        const wrappedEncryptedText = util.encode64(encryptedText);
        const wrappedAuthTag = util.encode64(authTag);

        const payload = {
            iv: wrappedEncryptionIv,
            tag: wrappedAuthTag,
            data: wrappedEncryptedText,
        };

        console.log('Original Text:\n', textToEncrypt);
        console.log('Encrypted (Base64):\n', JSON.stringify(payload, null, 4));

        const pathToTokenDir = path.join(path.resolve(), 'token');

        if (!fs.existsSync(pathToTokenDir)) {
            fs.mkdirSync(pathToTokenDir);
        }

        // Save the encrypted text to a file
        fs.writeFileSync(
            path.join(pathToTokenDir, 'encrypted_payload.json'),
            JSON.stringify(payload, null, 4),
            'utf8'
        );
    }
);
