import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(path.join(root, name), 'utf8');

test('Correlator loads its compiled assets from its own subdirectory', () => {
  const html = read('correlator/index.html');
  assert(html.includes('<title>AI Risk Correlator</title>'));
  const assets = [...html.matchAll(/(?:src|href)="(\/correlator\/assets\/[^"#?]+)"/g)].map(match => match[1]);
  assert(assets.length >= 4);
  for (const asset of assets) assert(existsSync(path.join(root, asset)), asset);
  assert(!html.includes('src="/assets/'));
  assert(!html.includes('href="/assets/'));
  assert(existsSync(path.join(root, 'correlator/embed.js')));
});

test('unpublished research is excluded and retired routes are absent', () => {
  assert(!existsSync(path.join(root, 'correlator/sources/ero-preprint.pdf')));
  assert(!existsSync(path.join(root, 'correlator/assets/preprint-page.png')));
  for (const directory of ['x-oscope', 'auspex']) {
    assert(!existsSync(path.join(root, directory)), `Retired route must remain absent: /${directory}/`);
  }
});

test('existing encrypted catalogues display the new entry without changing session checks', () => {
  const heading = {}, description = {}, mark = { classList: { add(value) { this.added = value; } } };
  const style = { setProperty(key, value) { this[key] = value; } };
  const link = { style, querySelector(selector) { return { h2: heading, p: description, '.experiment-mark': mark }[selector]; } };
  const events = [];
  const timers = [];
  vm.runInNewContext(read('200/session.mjs'), {
    document: {
      querySelectorAll(selector) { return selector === '.experiment-list a[href="/x-oscope/"]' ? [link] : []; },
      addEventListener(name) { events.push(name); },
    },
    window: { addEventListener(name) { events.push(name); } },
    setInterval(callback, delay) { timers.push(delay); },
  });
  assert.equal(link.href, '/correlator/');
  assert.equal(heading.textContent, 'AI Risk Correlator');
  assert.equal(description.textContent, 'What do AI incidents tell us about existential risk?');
  assert.equal(style['--accent'], '#634178');
  assert.equal(mark.textContent, 'AI');
  assert.deepEqual(events, ['pageshow', 'visibilitychange']);
  assert.deepEqual(timers, [60000]);
  assert(read('scripts/build-200.mjs').includes("['AI Risk Correlator', '/correlator/'"));
});
