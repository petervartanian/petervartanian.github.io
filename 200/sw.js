import { deriveKey, unpackFile, privatePath, safeNext } from './vault-core.mjs';

const ROOT = '/200/';
const DB_NAME = 'pv-200-session';
const SESSION_MS = 8 * 60 * 60 * 1000;
const SHELL = new Set(['entry.css', 'entry.mjs', 'session.mjs', 'vault-core.mjs', 'sw.js']);
let sessionPromise;
let generation = 0;

function sessionStore(operation, value) {
  return new Promise((resolve, reject) => {
    const opening = indexedDB.open(DB_NAME, 1);
    opening.onupgradeneeded = () => opening.result.createObjectStore('session');
    opening.onerror = () => reject(opening.error);
    opening.onsuccess = () => {
      const db = opening.result;
      const transaction = db.transaction('session', operation === 'get' ? 'readonly' : 'readwrite');
      const store = transaction.objectStore('session');
      const request = operation === 'get' ? store.get('active') : operation === 'put' ? store.put(value, 'active') : store.delete('active');
      let result;
      request.onsuccess = () => { result = request.result; };
      transaction.oncomplete = () => { db.close(); resolve(result); };
      transaction.onerror = () => { db.close(); reject(transaction.error); };
      transaction.onabort = () => { db.close(); reject(transaction.error); };
    };
  });
}

async function encryptedManifest(settings, key) {
  const response = await fetch(ROOT + 'vault/' + settings.manifest, { cache: 'no-store' });
  if (!response.ok) throw new Error('The experiment files could not be loaded.');
  const plain = await unpackFile(key, await response.arrayBuffer(), 'manifest');
  const manifest = JSON.parse(new TextDecoder().decode(plain));
  if (manifest.version !== 1 || !manifest.files || !manifest.files['index.html']) throw new Error('Invalid experiment manifest.');
  return manifest;
}

async function settingsFile() {
  const response = await fetch(ROOT + 'vault/settings.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('The experiment files could not be loaded.');
  const settings = await response.json();
  if (settings.version !== 1 || settings.iterations !== 600000 || !/^[a-f0-9]{64}\.bin$/.test(settings.manifest)) throw new Error('Invalid experiment settings.');
  return settings;
}

async function getSession(refresh = false) {
  if (!sessionPromise) {
    const currentGeneration = generation;
    sessionPromise = (async () => {
      const saved = await sessionStore('get');
      if (!saved || saved.expires <= Date.now()) return null;
      const settings = await settingsFile();
      if (saved.manifest !== settings.manifest) return null;
      const manifest = await encryptedManifest(settings, saved.key);
      if (currentGeneration !== generation) return null;
      return { ...saved, files: manifest.files };
    })().catch(() => null);
  }
  const session = await sessionPromise;
  // A new encrypted deployment needs a fresh unlock, even in an open tab.
  if (refresh && session && session.expires > Date.now()) {
    const settings = await settingsFile();
    if (settings.manifest !== session.manifest) {
      generation += 1;
      sessionPromise = Promise.resolve(null);
      await sessionStore('delete');
      return null;
    }
  }
  return session && session.expires > Date.now() ? session : null;
}

async function unlock(password) {
  const currentGeneration = generation;
  const settings = await settingsFile();
  const key = await deriveKey(password, settings);
  const manifest = await encryptedManifest(settings, key);
  if (currentGeneration !== generation) throw new Error('Please try again.');
  const saved = { key, expires: Date.now() + SESSION_MS, manifest: settings.manifest };
  // A non-extractable CryptoKey survives worker restarts; the password is never stored.
  await sessionStore('put', saved);
  if (currentGeneration !== generation) { await sessionStore('delete'); throw new Error('Please try again.'); }
  sessionPromise = Promise.resolve({ ...saved, files: manifest.files });
}

async function lock() {
  generation += 1;
  sessionPromise = Promise.resolve(null);
  await sessionStore('delete');
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  await Promise.all(windows.filter(client => new URL(client.url).pathname.startsWith(ROOT)).map(client => client.navigate(ROOT)));
}

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  const sourceURL = event.source?.url && new URL(event.source.url);
  if (!sourceURL || sourceURL.origin !== self.location.origin || !sourceURL.pathname.startsWith(ROOT)) return;
  const port = event.ports[0];
  const action = event.data?.action;
  event.waitUntil((async () => {
    try {
      if (action === 'unlock') {
        if (typeof event.data.password !== 'string' || event.data.password.length > 1024) throw new Error('Invalid password.');
        await unlock(event.data.password);
        port?.postMessage({ ok: true });
      } else if (action === 'lock') {
        await lock();
        port?.postMessage({ ok: true });
      } else if (action === 'status') {
        port?.postMessage({ ok: true, unlocked: Boolean(await getSession()) });
      }
    } catch (error) {
      const message = action === 'unlock' && error.name === 'OperationError' ? 'That password didn’t open the experiments. Try again.' : 'Couldn’t open the experiments. Please try again.';
      port?.postMessage({ ok: false, message });
    }
  })());
});

async function servePrivate(request, path) {
  const session = await getSession(request.mode === 'navigate');
  if (!session) {
    if (request.mode === 'navigate') {
      if (path === 'index.html') return fetch(request, { cache: 'no-store' });
      const next = new URL(request.url);
      return Response.redirect(self.location.origin + ROOT + '?next=' + encodeURIComponent(next.pathname + next.search), 302);
    }
    return new Response('Unlock /200 to access this file.', { status: 401, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
  }
  const target = new URL(request.url);
  if (request.mode === 'navigate' && target.pathname === ROOT + 'arcolens') {
    return Response.redirect(target.origin + target.pathname + '/' + target.search, 302);
  }
  if (request.mode === 'navigate' && path === 'index.html' && target.searchParams.has('next')) {
    const next = safeNext(target.searchParams.get('next'), self.location.origin);
    if (next !== ROOT && !next.startsWith(ROOT + '?') && !next.startsWith(ROOT + 'index.html')) return Response.redirect(self.location.origin + next, 302);
  }
  const entry = session.files[path];
  if (!entry) return new Response('File not found.', { status: 404, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
  const epoch = generation;
  try {
    const response = await fetch(ROOT + 'vault/' + entry.file, { cache: 'no-store' });
    if (!response.ok) throw new Error('Unavailable file.');
    const bytes = await unpackFile(session.key, await response.arrayBuffer(), path);
    if (epoch !== generation || session.expires <= Date.now()) return new Response('Session ended.', { status: 401 });
    const headers = new Headers({ 'Content-Type': entry.type, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' });
    if (entry.download) headers.set('Content-Disposition', `attachment; filename="${entry.download}"`);
    return new Response(request.method === 'HEAD' ? null : bytes, { status: 200, headers });
  } catch {
    return new Response('This file could not be opened. Return to /200 and unlock again.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

self.addEventListener('fetch', event => {
  if (!['GET', 'HEAD'].includes(event.request.method)) return;
  const path = privatePath(event.request.url, self.location.origin);
  if (path === null || SHELL.has(path) || path.startsWith('vault/')) return;
  event.respondWith(servePrivate(event.request, path));
});
