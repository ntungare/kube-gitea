# Scripts & Utilities

This directory contains TypeScript utilities for secure configuration management using hybrid encryption (RSA + AES).

## Overview

The scripts implement a security model where:
1.  **RSA Pair (4096-bit)**: Used to encrypt/protect the symmetric AES key. The private key itself is password-encryped.
2.  **AES-256 Key**: Used to encrypt the actual large data (configuration files).

This allows you to safely store encrypted configuration files (`encrypted_payload.json`) and the encrypted AES key (`aes256.key.wrap`) in the repository, while keeping the RSA Private Key secret (and password protected).

> [!NOTE]
> The primary purpose of this setup is to ensure that when you run `make-backup.sh` from the root directory, the generated backup archive contains your secrets in an encrypted format, avoiding plaintext password storage.

## Directories

- **`src/`**: TypeScript source code.
- **`keys/`**: Generated keys output directory (IGNORED by git).
- **`token/`**: Output directory for encrypted payloads and decrypted files (IGNORED by git).

## Prerequisites

- Node.js
- `pnpm`

Install dependencies:

```bash
pnpm install
```

## Configuration Schema

The scripts expect a `code/config.yml` file (which is ignored by git) relative to the project root. This file should contain the secrets you wish to encrypt. The only expectation is that the file is a `yaml` file.

## Detailed Usage

### 1. Key Generation

Generates the cryptographic identity for the project.

```bash
pnpm run make-keys
```

**Process:**
1.  Generates a 4096-bit RSA Keypair.
2.  Generates a random 32-byte AES-256 Key.
3.  Prompts for a **password** to encrypt the RSA Private Key.
4.  Encrypts the AES Key using the RSA Public Key.
5.  Saves artifacts to `keys/`:
    - `public_key.pem`: RSA Public Key.
    - `private_key.pem`: Encrypted RSA Private Key.
    - `aes256.key.wrap`: Encrypted AES Key.

### 2. Encryption

Encrypts the `../config.yml` file using the generated keys.

```bash
pnpm run encrypt
```

**Process:**
1.  Reads the plain text configuration from `../config.yml`.
2.  Reads the encrypted RSA Private Key and Wrapped AES Key from `keys/`.
3.  Prompts for the **password** to unlock the RSA Private Key.
4.  Decrypts the AES Key in memory.
5.  Encrypts the content of `config.yml` using **AES-256-GCM**.
6.  Saves the result to `token/encrypted_payload.json`.

**Output Format (`encrypted_payload.json`):**
```json
{
    "iv": "...",   // Base64 Initialization Vector
    "tag": "...",  // Base64 Auth Tag
    "data": "..."  // Base64 Encrypted Content
}
```

### 3. Decryption

Decrypts the payload back to plain text.

```bash
pnpm run decrypt
```

**Process:**
1.  Reads `token/encrypted_payload.json`.
2.  Prompts for the **password** to unlock the RSA Private Key.
3.  Unwraps the AES Key.
4.  Decrypts the payload using **AES-256-GCM**.
5.  Saves the decrypted content to `token/decrypted_github_token.yml`.

### Linting & Formatting

- **Lint**: `pnpm run lint`
- **Format**: `pnpm run format`
