import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const origin = 'https://petervartanian.xyz';
const read = path => readFile(new URL(path, root), 'utf8');
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const documents = new Map();
const load = async path => {
  if (!documents.has(path)) documents.set(path, await read(path));
  return documents.get(path);
};
let references = 0;

async function checkReference(reference, from, checkAnchor = true) {
  const url = new URL(decode(reference), `${origin}/${from}`);
  if (url.origin !== origin) return;
  assert(!url.pathname.startsWith('/auspex/'), `${from}: link still uses the old address: ${reference}`);
  const path = decodeURIComponent(url.pathname.slice(1)) + (url.pathname.endsWith('/') ? 'index.html' : '');
  assert((await stat(new URL(path, root))).isFile(), `${from}: missing ${path}`);
  if (checkAnchor && url.hash && path.endsWith('.html')) {
    const id = decodeURIComponent(url.hash.slice(1));
    const ids = new Set(Array.from((await load(path)).matchAll(/\bid=["']([^"']+)["']/g), match => decode(match[1])));
    assert(ids.has(id), `${from}: missing anchor ${path}#${id}`);
  }
  references++;
}

for (const name of ['index.html', 'pathways.html', 'identity.html']) {
  const path = `x-oscope/${name}`;
  const html = await load(path);
  const canonical = `${origin}/x-oscope/${name === 'index.html' ? '' : name}`;
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${name}: incorrect canonical address`);
  if (name === 'pathways.html') {
    for (let i = 1; i <= 6; i++) assert(html.includes(`id="H-0${i}"`), 'Restored comparison must have a reader article');
  }
  for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*\b(?:href|src)="([^"]+)"[^>]*>/g)) {
    await checkReference(match[1], path);
  }
}
for (const name of ['style.css', 'stpa.css', 'controls.css']) {
  const path = `x-oscope/${name}`;
  for (const match of (await read(path)).matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
    if (!match[1].startsWith('#')) await checkReference(match[1], path, false);
  }
}

const cases = [
  ['https://petervartanian.xyz/auspex/', 'https://petervartanian.xyz/x-oscope/'],
  ['https://petervartanian.xyz/auspex/?p=X-1&t=H-01%3A1&i=PFL-2018#choose-title', 'https://petervartanian.xyz/x-oscope/?p=X-1&t=H-01%3A1&i=PFL-2018#choose-title'],
  ['https://petervartanian.xyz/auspex/index.html?p=A.1&overlay=maybe&i=AFK-2024', 'https://petervartanian.xyz/x-oscope/?p=A.1&overlay=maybe&i=AFK-2024'],
  ['https://petervartanian.xyz/auspex/?p=Bonus-1&i=PFL-2018', 'https://petervartanian.xyz/x-oscope/?p=Bonus-1&i=PFL-2018'],
  ['https://petervartanian.xyz/auspex/pathways.html#H-01', 'https://petervartanian.xyz/x-oscope/pathways.html#H-01'],
  ['https://petervartanian.xyz/auspex/pathways.html?from=notes%20%26%20sources#X-01', 'https://petervartanian.xyz/x-oscope/pathways.html?from=notes%20%26%20sources#X-01'],
  ['https://petervartanian.xyz/auspex/identity.html?from=logo#scope', 'https://petervartanian.xyz/x-oscope/identity.html?from=logo#scope'],
  ['http://127.0.0.1:8008/auspex/?p=X-1', 'http://127.0.0.1:8008/x-oscope/?p=X-1'],
  ['file:///fixture/auspex/pathways.html#X-01', 'file:///fixture/x-oscope/pathways.html#X-01'],
  ['https://petervartanian.xyz/auspex/?redirect=https%3A%2F%2Fexample.com#%3Ftest', 'https://petervartanian.xyz/x-oscope/?redirect=https%3A%2F%2Fexample.com#%3Ftest'],
];
for (const [before, expected] of cases) {
  const url = new URL(before);
  const name = url.pathname.endsWith('/') ? 'index.html' : url.pathname.split('/').at(-1);
  const html = await read(`auspex/${name}`);
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert(script, `${name}: missing forwarder`);
  const fallback = { href: html.match(/id="destination" href="([^"]+)"/)?.[1] };
  assert(fallback.href, `${name}: missing fallback link`);
  const expectedPage = name === 'index.html' ? '' : name;
  assert.equal(fallback.href, `../x-oscope/${expectedPage}`);
  const calls = [];
  vm.runInNewContext(script, {
    URL,
    location: { href: before, search: url.search, hash: url.hash, replace: target => calls.push(target) },
    document: { getElementById: id => { assert.equal(id, 'destination'); return fallback; } },
  }, { filename: fileURLToPath(new URL(`auspex/${name}`, root)) });
  assert.deepEqual(calls, [expected], `${before}: wrong destination`);
  assert.equal(fallback.href, expected, `${before}: fallback loses the bookmark`);
}
console.log(`Validated ${references} local asset/page/anchor references and ${cases.length} old-address bookmarks, including queries, encoded values, and fragments.`);
