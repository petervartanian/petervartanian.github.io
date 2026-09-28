import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto, randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { deriveKey, decryptBytes, unpackFile, privatePath, safeNext } from '../200/vault-core.mjs';

const encoder = new TextEncoder();
const origin = 'https://petervartanian.xyz';
const password = 'test-only secret, not a deployment password';
const settings = { version: 1, salt: randomBytes(32).toString('base64'), iterations: 600000, manifest: 'a'.repeat(64) + '.bin' };
const material = await webcrypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
const encryptKey = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', salt: Buffer.from(settings.salt, 'base64'), iterations: settings.iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const key = await deriveKey(password, settings);
async function encrypt(value, name) {
  const iv = randomBytes(12);
  const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(name), tagLength: 128 }, encryptKey, gzipSync(value));
  return Buffer.concat([iv, Buffer.from(ciphertext)]);
}
const privateHTML = Buffer.from('<!doctype html><h1>Private fixture</h1>');
const privateCSV = Buffer.from('id,value\n1,42\n');
const fixtures = {
  'index.html': { file: 'b'.repeat(64) + '.bin', type: 'text/html; charset=utf-8' },
  'arcolens/OPEN_REVIEW.html': { file: 'c'.repeat(64) + '.bin', type: 'text/html; charset=utf-8' },
  'arcolens/downloads/data.csv': { file: 'd'.repeat(64) + '.bin', type: 'text/csv', download: 'data.csv' },
};
const payloads = new Map();
for (const [name, entry] of Object.entries(fixtures)) payloads.set(entry.file, await encrypt(name.endsWith('.csv') ? privateCSV : privateHTML, name));
payloads.set(settings.manifest, await encrypt(JSON.stringify({ version: 1, files: fixtures }), 'manifest'));

function fakeDatabase(state) {
  return {
    open() {
      const request = {};
      request.result = {
        createObjectStore() {}, close() {},
        transaction() {
          const transaction = {};
          transaction.objectStore = () => {
            const operation = (kind, value) => {
              const req = {};
              queueMicrotask(() => {
                if (kind === 'put') state.value = value;
                if (kind === 'delete') state.value = undefined;
                req.result = state.value;
                req.onsuccess?.();
                queueMicrotask(() => transaction.oncomplete?.());
              });
              return req;
            };
            return { get: () => operation('get'), put: value => operation('put', value), delete: () => operation('delete') };
          };
          return transaction;
        },
      };
      queueMicrotask(() => { request.onupgradeneeded?.(); request.onsuccess?.(); });
      return request;
    },
  };
}
const rawWorker = await readFile(new URL('../200/sw.js', import.meta.url), 'utf8');
function worker(state = {}) {
  const listeners = {};
  const requests = [];
  const navigations = [];
  const self = {
    location: { origin },
    addEventListener: (name, callback) => { listeners[name] = callback; },
    skipWaiting: async () => {},
    clients: { claim: async () => {}, matchAll: async () => [{ url: origin + '/200/arcolens/', navigate: async url => navigations.push(url) }, { url: origin + '/', navigate: async url => navigations.push('OUTSIDE:' + url) }] },
  };
  const fetch = async (value, options) => {
    const url = new URL(typeof value === 'string' ? value : value.url, origin);
    requests.push(url.pathname);
    if (url.pathname === '/200/vault/settings.json') return Response.json(state.serverSettings || settings);
    if (url.pathname.startsWith('/200/vault/')) {
      const bytes = payloads.get(url.pathname.split('/').at(-1));
      return bytes ? new Response(bytes) : new Response('Missing', { status: 404 });
    }
    return new Response('<form>Public password gate</form>');
  };
  const context = vm.createContext({ self, indexedDB: fakeDatabase(state), deriveKey, unpackFile, privatePath, safeNext, fetch, Response, Headers, URL, TextDecoder, Date, Promise, Set, Error, Boolean, encodeURIComponent });
  vm.runInContext(rawWorker.replace(/^import[^\n]+\n/, ''), context);
  return {
    state, requests, navigations,
    async message(action, extra = {}, sourceURL = origin + '/200/') {
      let job, result;
      listeners.message({ data: { action, ...extra }, source: { url: sourceURL }, ports: [{ postMessage: value => { result = value; } }], waitUntil: value => { job = value; } });
      await job;
      return result;
    },
    async request(path, mode = 'navigate') {
      let response;
      listeners.fetch({ request: { url: new URL(path, origin).href, mode, method: 'GET' }, respondWith: value => { response = value; } });
      return await response;
    },
  };
}

test('correct key restores binary content; wrong password, tampering and path substitution fail', async () => {
  const bytes = await encrypt(privateCSV, 'arcolens/downloads/data.csv');
  assert.deepEqual(Buffer.from(await unpackFile(key, bytes, 'arcolens/downloads/data.csv')), privateCSV);
  assert.equal(key.extractable, false);
  const wrong = await deriveKey(password + 'wrong', settings);
  await assert.rejects(unpackFile(wrong, bytes, 'arcolens/downloads/data.csv'));
  const tampered = Buffer.from(bytes); tampered[20] ^= 1;
  await assert.rejects(unpackFile(key, tampered, 'arcolens/downloads/data.csv'));
  await assert.rejects(unpackFile(key, bytes, 'index.html'));
});

test('routing rejects foreign URLs and traversal while retaining real deep links', () => {
  assert.equal(privatePath(origin + '/200/arcolens/', origin), 'arcolens/OPEN_REVIEW.html');
  assert.equal(privatePath('https://other.example/200/arcolens/', origin), null);
  assert.equal(privatePath(origin + '/200/%2e%2e%2fprivate', origin), null);
  assert.equal(privatePath(origin + '/200/%00', origin), null);
  assert.equal(privatePath(origin + '/200/%zz', origin), null);
  assert.equal(safeNext('//other.example/path', origin), '/200/');
  assert.equal(safeNext('/agency-costs/', origin), '/200/');
  assert.equal(safeNext('/200/arcolens/finding-IT-C001.html?year2026=on#main', origin), '/200/arcolens/finding-IT-C001.html?year2026=on#main');
});

test('locked navigation reaches the gate and direct file fetches reveal no private bytes', async () => {
  const instance = worker();
  assert.match(await (await instance.request('/200/')).text(), /Public password gate/);
  const page = await instance.request('/200/arcolens/finding-IT-C001.html?year2026=on');
  assert.equal(page.status, 302);
  assert.match(page.headers.get('location'), /next=/);
  const file = await instance.request('/200/arcolens/downloads/data.csv', 'cors');
  assert.equal(file.status, 401);
  assert(!instance.requests.some(url => /[bc d]{64}\.bin/.test(url)));
});

test('wrong password cannot unlock; valid password opens pages and downloads without caching plaintext', async () => {
  const instance = worker();
  assert.equal((await instance.message('unlock', { password: password + 'wrong' })).ok, false);
  assert.equal((await instance.message('status')).unlocked, false);
  assert.equal((await instance.message('unlock', { password })).ok, true);
  const page = await instance.request('/200/arcolens/');
  assert.equal(page.status, 200);
  assert.equal(await page.text(), privateHTML.toString());
  assert.equal(page.headers.get('cache-control'), 'no-store');
  assert.equal(page.headers.get('x-robots-tag'), 'noindex, nofollow');
  const file = await instance.request('/200/arcolens/downloads/data.csv', 'cors');
  assert.equal(await file.text(), privateCSV.toString());
  assert.match(file.headers.get('content-disposition'), /attachment/);
  assert.equal(instance.state.value.key.extractable, false);
  assert(!JSON.stringify(instance.state.value).includes(password));
});

test('worker restart preserves an unexpired session; expiry requires unlocking again', async () => {
  const state = {};
  const first = worker(state);
  assert.equal((await first.message('unlock', { password })).ok, true);
  const restarted = worker(state);
  assert.equal((await restarted.message('status')).unlocked, true);
  assert.equal((await restarted.request('/200/arcolens/')).status, 200);
  state.value.expires = Date.now() - 1;
  const expired = worker(state);
  assert.equal((await expired.message('status')).unlocked, false);
  assert.equal((await expired.request('/200/arcolens/downloads/data.csv', 'cors')).status, 401);
});

test('logout clears persisted access and returns only experiment tabs to the gate', async () => {
  const instance = worker();
  await instance.message('unlock', { password });
  assert.equal((await instance.message('lock')).ok, true);
  assert.equal(instance.state.value, undefined);
  assert.deepEqual(instance.navigations, ['/200/']);
  assert.equal((await instance.message('status')).unlocked, false);
  assert.equal((await instance.request('/200/arcolens/downloads/data.csv', 'cors')).status, 401);
});

test('new deployment returns an open tab to the unlock page before fetching obsolete files', async () => {
  const instance = worker();
  await instance.message('unlock', { password });
  assert.equal((await instance.request('/200/arcolens/')).status, 200);
  instance.state.serverSettings = { ...settings, manifest: 'e'.repeat(64) + '.bin' };
  const response = await instance.request('/200/arcolens/');
  assert.equal(response.status, 302);
  assert.match(response.headers.get('location'), /next=/);
  assert.equal(instance.state.value, undefined);
  assert.equal((await instance.message('status')).unlocked, false);
});

test('the worker leaves public site routes alone and ignores messages from other pages', async () => {
  const instance = worker();
  assert.equal(await instance.request('/portfolio/'), undefined);
  assert.equal(await instance.request('/200/entry.css'), undefined);
  assert.equal(await instance.message('unlock', { password }, origin + '/'), undefined);
  assert.equal(await instance.message('unlock', { password }, 'https://other.example/200/'), undefined);
  assert.equal((await instance.message('status')).unlocked, false);
});

test('unlocked deep-link continuation and slash normalization preserve queries', async () => {
  const instance = worker();
  await instance.message('unlock', { password });
  const slash = await instance.request('/200/arcolens?year2026=on');
  assert.equal(slash.headers.get('location'), origin + '/200/arcolens/?year2026=on');
  const next = await instance.request('/200/?next=%2F200%2Farcolens%2F%3Fyear2026%3Don');
  assert.equal(next.headers.get('location'), origin + '/200/arcolens/?year2026=on');
  const foreign = await instance.request('/200/?next=https://evil.example/');
  assert.equal(foreign.status, 200);
});
