import fs from 'fs';
import { pki, random, util, md } from 'node-forge';
import path from 'path';
import prompt from 'prompt';

// Generate an RSA key pair with a 4096-bit key size
const keys = pki.rsa.generateKeyPair({ bits: 4096 });
// 32 bytes AES 256 key
const aesKey = random.getBytesSync(32);

const publicKey = keys.publicKey;
const privateKey = keys.privateKey;

console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);

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

        const pathToKeysDir = path.join(path.resolve(), 'keys');

        if (!fs.existsSync(pathToKeysDir)) {
            fs.mkdirSync(pathToKeysDir);
        }

        // Export public key to PEM format
        const pemPublicKey = pki.publicKeyToPem(publicKey);

        // Export private key to PEM format
        const pemPrivateKey = pki.encryptRsaPrivateKey(privateKey, password, { algorithm: 'aes256' });

        // Encrypt the AES 256 Key with the RSA Key
        const encryptedAesKey = publicKey.encrypt(aesKey, 'RSA-OAEP', { md: md.sha256.create() });
        const wrappedEncryptedAesKey = util.encode64(encryptedAesKey);

        console.log('PEM Public Key:\n', pemPublicKey);
        fs.writeFileSync(path.join(pathToKeysDir, 'public_key.pem'), pemPublicKey, 'utf8');
        console.log('PEM Private Key:\n', pemPrivateKey);
        fs.writeFileSync(path.join(pathToKeysDir, 'private_key.pem'), pemPrivateKey, 'utf8');
        console.log('AES 256 Key:\n', wrappedEncryptedAesKey);
        fs.writeFileSync(path.join(pathToKeysDir, 'aes256.key.wrap'), wrappedEncryptedAesKey, 'utf8');
    }
);
