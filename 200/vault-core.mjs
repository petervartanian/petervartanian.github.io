const encoder = new TextEncoder();

export function bytesFromBase64(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

export async function deriveKey(password, settings) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: bytesFromBase64(settings.salt), iterations: settings.iterations, hash: 'SHA-256' },
    material, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
  );
}

export async function decryptBytes(key, payload, path) {
  const bytes = new Uint8Array(payload);
  if (bytes.byteLength < 29) throw new Error('Invalid encrypted file.');
  return crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bytes.slice(0, 12), additionalData: encoder.encode(path), tagLength: 128 },
    key, bytes.slice(12),
  );
}

export async function unpackFile(key, payload, path) {
  const compressed = await decryptBytes(key, payload, path);
  return new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
}

export function privatePath(url, origin) {
  const target = new URL(url, origin);
  if (target.origin !== origin || !target.pathname.startsWith('/200/')) return null;
  let path;
  try { path = decodeURIComponent(target.pathname.slice('/200/'.length)); } catch { return null; }
  if (path.includes('\\') || path.includes('\0') || path.split('/').some(part => part === '.' || part === '..')) return null;
  if (path === '' || path === 'index.html') return 'index.html';
  if (path === 'arcolens' || path === 'arcolens/') return 'arcolens/OPEN_REVIEW.html';
  return path;
}

export function safeNext(value, origin) {
  try {
    const target = new URL(value || '/200/', origin);
    const path = privatePath(target.href, origin);
    if (!path || !(path === 'index.html' || path.startsWith('arcolens/'))) return '/200/';
    return target.pathname + target.search + target.hash;
  } catch { return '/200/'; }
}
