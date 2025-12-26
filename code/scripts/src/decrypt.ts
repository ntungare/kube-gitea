import fs from 'fs';
import { pki, util, md, cipher } from 'node-forge';
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

const pathToTokenDir = path.join(path.resolve(), 'token');

const payload: {
    iv: string;
    tag: string;
    data: string;
} = JSON.parse(
    fs.readFileSync(path.join(pathToTokenDir, 'encrypted_payload.json'), 'utf8').toString()
);

prompt.start();
prompt.get<{ password: string }>(
    {
        properties: {
            password: {
                description: 'Enter a password to decrypt the private key',
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

        const encryptionIv = util.decode64(payload.iv);
        const encryptedText = util.decode64(payload.data);
        const authTag = util.decode64(payload.tag);

        const decipherClient = cipher.createDecipher('AES-GCM', aesKey);
        decipherClient.start({
            iv: encryptionIv,
            tag: util.createBuffer(authTag),
        });
        decipherClient.update(util.createBuffer(encryptedText));
        const decipherResult = decipherClient.finish();

        if (!decipherResult) {
            throw new Error('Decryption Failed');
        }

        const decryptedText = decipherClient.output.toString();

        console.log('Encrypted (Base64):\n', payload.data);
        console.log('Original Text:\n', decryptedText);

        // Save the encrypted text to a file
        fs.writeFileSync(
            path.join(pathToTokenDir, 'decrypted_github_token.yml'),
            decryptedText,
            'utf8'
        );
    }
);
