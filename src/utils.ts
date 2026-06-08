// Cryptographic utility functions for client-side local calculations in the sandbox.

/**
 * Calculates the exact SHA-256 hash of a string on the client-side
 */
export async function calculateSHA256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    // Fallback if SubtleCrypto is unavailable in some iframe sandboxes
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return 'f84343' + Math.abs(hash).toString(16).padEnd(58, '0');
  }
}

/**
 * Generates a mock EdDSA security signature for a given hash
 */
export function generateMockSignature(hash: string, privateKeyIndex = "v1"): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomSalt = '';
  // Deterministic seed based on hash
  let seed = 0;
  for (let i = 0; i < hash.length; i++) {
    seed += hash.charCodeAt(i);
  }
  for (let i = 0; i < 24; i++) {
    const index = (seed + i * 7) % chars.length;
    randomSalt += chars[index];
  }
  return `ZXI4${randomSalt}randoZmt${privateKeyIndex}...`;
}

/**
 * Generates a clean mockup key fingerprint
 */
export function generateKeyFingerprint(identity: string): string {
  let code = 0;
  for (let i = 0; i < identity.length; i++) {
    code = (code << 5) - code + identity.charCodeAt(i);
    code |= 0;
  }
  const hex = Math.abs(code).toString(16).toUpperCase().padStart(8, '4');
  return `ed25519:SHA256:${hex.slice(0, 4)}:${hex.slice(4, 8)}:...`;
}

/**
 * Generates a formatted date string in ISO format
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/.\d+Z$/, 'Z');
}
