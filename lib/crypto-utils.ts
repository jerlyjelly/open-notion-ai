const ENCRYPTION_SALT = 'open-notion-ai-salt'; // Fixed salt for key derivation
const ENCRYPTION_ITERATIONS = 100000; // PBKDF2 iterations

/**
 * Derives an encryption key from the user's Supabase access token fragment and a fixed salt.
 * Uses a portion of the access token as the 'password' for PBKDF2.
 * IMPORTANT: This is a client-side convenience and not a replacement for true server-side secret management.
 * The key is derived on the client and used to encrypt/decrypt data that is then stored in Supabase.
 * The raw access token fragment is not stored.
 */
async function deriveKeyFromToken(accessToken: string): Promise<CryptoKey> {
  // Use a portion of the access token (e.g., first 32 chars) as the base for the key
  // This is to avoid using the entire token directly, though the security implications are complex.
  // A more robust solution might involve a user-defined password IF we weren't trying to make it seamless.
  const tokenFragment = accessToken.slice(0, 32); 
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(tokenFragment),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(ENCRYPTION_SALT),
      iterations: ENCRYPTION_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a secret string using AES-GCM.
 * @param secret The string to encrypt.
 * @param accessToken The user's Supabase access token to derive the encryption key.
 * @returns A Promise that resolves to a base64 encoded string of "iv.ciphertext".
 */
export async function encryptSecret(secret: string, accessToken: string): Promise<string> {
  if (!secret) throw new Error('Secret cannot be empty.');
  if (!accessToken) throw new Error('Access token is required for encryption.');

  const key = await deriveKeyFromToken(accessToken);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const encodedSecret = new TextEncoder().encode(secret);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedSecret
  );

  // Combine IV and ciphertext: iv.ciphertext, then base64 encode
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  return btoa(String.fromCharCode(...combined)); // Convert Uint8Array to binary string then to base64
}

/**
 * Decrypts a secret string that was encrypted with AES-GCM.
 * @param encryptedDataB64 Base64 encoded string of "iv.ciphertext".
 * @param accessToken The user's Supabase access token to derive the decryption key.
 * @returns A Promise that resolves to the decrypted string.
 */
export async function decryptSecret(encryptedDataB64: string, accessToken: string): Promise<string> {
  if (!encryptedDataB64) throw new Error('Encrypted data cannot be empty.');
  if (!accessToken) throw new Error('Access token is required for decryption.');

  const key = await deriveKeyFromToken(accessToken);
  
  // Decode base64 and split IV from ciphertext
  const combined = Uint8Array.from(atob(encryptedDataB64), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    // It's common for decryption to fail if the key is wrong or data is corrupt.
    // Avoid exposing too much detail from the crypto error itself.
    throw new Error('Failed to decrypt secret. The key might be incorrect or data corrupted.');
  }
} 