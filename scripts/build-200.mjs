/** Build encrypted experiment resources without placing plaintext Arcolens files in Git. */
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createHash, randomBytes, webcrypto } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argument = name => args[args.indexOf(name) + 1];
if (!args.includes('--arcolens-source') || !args.includes('--delivery-manifest')) throw new Error('Provide --arcolens-source and --delivery-manifest; read the password from standard input.');
const source = path.resolve(argument('--arcolens-source'));
const delivery = JSON.parse(await readFile(argument('--delivery-manifest'), 'utf8'));
const password = readFileSync(0, 'utf8').replace(/\r?\n$/, '');
if (!password || password.length > 1024) throw new Error('A password is required on standard input.');
const output = args.includes('--output') ? path.resolve(argument('--output')) : path.join(root, '200/vault');
await mkdir(output, { recursive: true });
const salt = randomBytes(32);
const iterations = 600000;
const material = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const digest = value => createHash('sha256').update(value).digest('hex');
const files = {};
const emitted = new Set(['settings.json']);
const media = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.csv': 'text/csv; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.zip': 'application/zip', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };

async function encrypt(content, name) {
  const iv = randomBytes(12);
  const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(name), tagLength: 128 }, key, gzipSync(content));
  const payload = Buffer.concat([iv, Buffer.from(ciphertext)]);
  const file = digest(payload) + '.bin';
  await writeFile(path.join(output, file), payload);
  emitted.add(file);
  return file;
}

async function resource(name, content, type, download) {
  files[name] = { file: await encrypt(content, name), type, sha256: digest(content), bytes: content.length };
  if (download) files[name].download = download;
}

const lensPath = args.includes('--brand-mark') ? path.resolve(argument('--brand-mark')) : path.join(path.dirname(source), 'v2/review/presentation-source/brand-mark.svg');
const lens = await readFile(lensPath, 'utf8');
const styleVersion = digest(await readFile(path.join(root, '200/entry.css'))).slice(0, 12);
const marks = {
  arcolens: lens,
  x: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 8 32 32M32 8 8 32" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  haruspex: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 29 12 12 22 25 32 7M12 12 32 7M22 25 35 33" fill="none" stroke="currentColor" stroke-width="1.4"/><g fill="currentColor"><circle cx="5" cy="29" r="2.5"/><circle cx="12" cy="12" r="3"/><circle cx="22" cy="25" r="3"/><circle cx="32" cy="7" r="2.5"/><circle cx="35" cy="33" r="2.5"/></g></svg>',
  agency: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 31V12H17V31M17 31V6H28V31M28 31V20H36V31" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 34H38" stroke="currentColor" stroke-width="1.4"/></svg>',
  catalog: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 10H35M5 20H35M5 30H35M11 6V34M26 6V34" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="10" r="3" fill="currentColor"/><circle cx="26" cy="20" r="3" fill="currentColor"/><circle cx="11" cy="30" r="3" fill="currentColor"/></svg>',
};
const tools = [
  ['Arcolens', '/200/arcolens/', 'AI incident findings, chart settings, and checks of published claims.', 'arcolens', '#216773'],
  ['X-oscope', '/x-oscope/', 'Trace incident pathways, examine risks, and inspect proposed safeguards.', 'x', '#756184'],
  ['Haruspex', '/haruspex/', 'Explore actions, decisions, and uncertainties in the OpenAI–Hugging Face incident.', 'haruspex', '#98664f'],
  ['Agency Costs', '/agency-costs/', 'Evidence packs, loss accounts, and tools for appraising AI-agent risk.', 'agency', '#537580'],
  ['Catalog of 1+2+3', '/backdrive/', 'Connect incidents, capabilities, and evaluations. Includes BackDrive for robotics.', 'catalog', '#85576e'],
];
for (const [, url] of tools.slice(1)) await readFile(path.join(root, url, 'index.html'));
const links = tools.map(([title, url, description, mark, color]) => `<li><a class="experiment-link" href="${url}" style="--accent:${color}"><span class="experiment-mark" aria-hidden="true">${marks[mark]}</span><span><h2>${title}</h2><p>${description}</p></span><span class="open-arrow" aria-hidden="true">↗</span></a></li>`).join('\n');
const catalog = `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow, noarchive"><meta name="referrer" content="same-origin"><title>200 — Experiments</title><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/personal.css"><link rel="stylesheet" href="/200/entry.css"><script type="module" src="/200/session.mjs"></script></head><body data-page="experiments"><a class="skip" href="#main">Skip to content</a><div class="page"><header><p class="site-name"><a href="/">Peter H. Vartanian</a></p><button class="lock-link" data-lock type="button">Lock</button></header><main id="main"><div class="entry-heading"><h1><span class="status-code" aria-label="200"><span>2</span><span>0</span><span>0</span></span><span class="section-name">Experiments</span></h1></div><ul class="experiment-list">${links}</ul></main><footer><a href="/">Back to the main site</a></footer></div></body></html>`;
await resource('index.html', Buffer.from(catalog.replace('/200/entry.css"', `/200/entry.css?v=${styleVersion}"`)), 'text/html; charset=utf-8');

let originalFiles = 0;
for (const [relative, hash] of Object.entries(delivery.files)) {
  if (!relative.startsWith('simon-review/')) throw new Error('Unexpected manifest path.');
  const name = relative.slice('simon-review/'.length);
  if (name.startsWith('/') || name.includes('\\') || name.split('/').some(part => part === '.' || part === '..')) throw new Error('Unsafe manifest path.');
  let bytes = await readFile(path.join(source, name));
  if (digest(bytes) !== hash) throw new Error(`Source checksum changed: ${name}`);
  originalFiles += 1;
  if (name.endsWith('.html') && !name.split('/').includes('downloads')) {
    let html = bytes.toString('utf8');
    html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow, noarchive"><meta name="referrer" content="same-origin"><script type="module" src="/200/session.mjs"></script></head>');
    const actions = '<div class="appbar-actions">';
    if (!html.includes(actions)) throw new Error(`Missing app navigation: ${name}`);
    bytes = Buffer.from(html);
  }
  const ext = path.extname(name).toLowerCase();
  const download = name.split('/').includes('downloads') ? path.basename(name) : null;
  await resource('arcolens/' + name, bytes, media[ext] || 'application/octet-stream', download);
}
const manifest = Buffer.from(JSON.stringify({ version: 1, files }));
const manifestFile = await encrypt(manifest, 'manifest');
const settings = { version: 1, salt: salt.toString('base64'), iterations, manifest: manifestFile };
await writeFile(path.join(output, 'settings.json'), JSON.stringify(settings, null, 2) + '\n');
// Only generated ciphertext from earlier builds is removed; source inputs stay untouched.
for (const name of await readdir(output)) {
  if (/^[a-f0-9]{64}\.bin$/.test(name) && !emitted.has(name)) await rm(path.join(output, name));
}
console.log(JSON.stringify({ status: 'built', protectedResources: Object.keys(files).length, arcolensSourceFiles: originalFiles, catalogEntries: tools.length, output: '200/vault', inputPresentationVersion: delivery.presentation_version, passwordWrittenToRepository: false }, null, 2));
