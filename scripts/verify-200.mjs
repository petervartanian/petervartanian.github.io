/** Decrypt and verify the deployed resource bundle locally; password comes from stdin. */
import { readFile, readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveKey, unpackFile } from '../200/vault-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const vault = args.includes('--vault') ? path.resolve(args[args.indexOf('--vault') + 1]) : path.join(root, '200/vault');
const password = readFileSync(0, 'utf8').replace(/\r?\n$/, '');
const settings = JSON.parse(await readFile(path.join(vault, 'settings.json'), 'utf8'));
const key = await deriveKey(password, settings);
const plain = await unpackFile(key, await readFile(path.join(vault, settings.manifest)), 'manifest');
const manifest = JSON.parse(new TextDecoder().decode(plain));
let resources = 0, htmlPages = 0;
const expected = new Set(['settings.json', settings.manifest]);
const known = new Set(Object.keys(manifest.files));
for (const [name, entry] of Object.entries(manifest.files)) {
  expected.add(entry.file);
  const content = Buffer.from(await unpackFile(key, await readFile(path.join(vault, entry.file)), name));
  if (createHash('sha256').update(content).digest('hex') !== entry.sha256 || content.length !== entry.bytes) throw new Error(`Invalid resource: ${name}`);
  if (name.endsWith('.html') && !name.includes('/downloads/')) {
    const html = content.toString('utf8');
    if (!html.includes('noindex, nofollow') || !html.includes('/200/session.mjs')) throw new Error(`Missing page access metadata: ${name}`);
    if (name === 'index.html' && !html.includes('data-lock')) throw new Error('Missing catalog lock control.');
    if (name.startsWith('arcolens/') && (html.includes('aria-label="All experiments"') || html.includes('data-lock'))) throw new Error(`Unexpected header controls: ${name}`);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const reference = match[1].replaceAll('&amp;', '&');
      if (/^(?:https?:|mailto:|data:|#)/.test(reference)) continue;
      const resolved = new URL(reference, 'https://petervartanian.xyz/200/' + name);
      if (!resolved.pathname.startsWith('/200/')) continue;
      let relative = decodeURIComponent(resolved.pathname.slice('/200/'.length));
      if (!relative || relative === 'arcolens/') continue;
      if (known.has(relative)) continue;
      if (['session.mjs', 'entry.css'].includes(relative)) continue;
      throw new Error(`Unresolved protected link: ${name} -> ${reference}`);
    }
    htmlPages += 1;
  }
  resources += 1;
}
const actual = new Set(await readdir(vault));
if (expected.size !== actual.size || [...actual].some(name => !expected.has(name))) throw new Error('Unexpected or missing ciphertext files.');
if (await readFile(path.join(root, 'sitemap.xml'), 'utf8').then(text => text.includes('/200/'))) throw new Error('Experiments must stay out of the sitemap.');
console.log(JSON.stringify({ status: 'passed', decryptedResourcesVerified: resources, protectedHTMLPagesVerified: htmlPages, ciphertextFilesOnly: true, protectedLinksResolved: true, noindexAndSessionControlsPresent: true, catalogLockControlPresent: true, passwordIncludedInOutput: false }, null, 2));
