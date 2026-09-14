import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import './field-layout.js';
const { bowtie, timeWind, windFrame, timeTicks } = globalThis.HaruspexLayout;
const DAY = 86400000;
const rect = { left: 40, right: 1240, top: 80, bottom: 700 };
const event = (id, time) => ({ id, _time: time });
const clock = (id, time) => event(id, { start: time, end: time, center: time, kind: 'clock', openStart: false });
const dates = Array.from({ length: 40 }, (_, i) => clock(`dated-${i}`, i * DAY));
const unknown = Array.from({ length: 12 }, (_, i) => event(`unknown-${i}`, { start: null, end: 15 * DAY, center: null, kind: 'window', openStart: true }));
const input = [...dates, ...unknown];
const before = JSON.stringify(input);
const placed = bowtie({ events: input, rect });
assert.equal(JSON.stringify(input), before, 'Packing must not assign source dates.');
assert.deepEqual(bowtie({ events: [...input].reverse(), rect }), placed, 'Input ordering must not change the field.');
const known = placed.filter(p => !p.event._time.openStart);
assert(known.every((p, i) => !i || p.x > known[i - 1].x), 'Dated source order must be preserved.');
const tailed = placed.filter(p => p.event._time.openStart);
assert(tailed.every(p => p.x < known[16].x), 'Unknown starts must respect their upper bounds.');
assert(Math.max(...tailed.map(p => p.x)) - Math.min(...tailed.map(p => p.x)) > 250, 'A shared upper bound must not become a single cluster.');
const onlyUnknown = bowtie({ events: unknown, rect });
assert(Math.max(...onlyUnknown.map(p => p.x)) - Math.min(...onlyUnknown.map(p => p.x)) > 600, 'An entirely undated field must not collapse to an edge.');

// Consecutive identifiers must not produce repeated diagonal placement patterns.
const serial = Array.from({ length: 1000 }, (_, i) => clock(`E${String(i).padStart(4, '0')}`, i));
const spacious = { left: 0, right: 100000, top: 0, bottom: 1000 };
const scattered = bowtie({ events: serial, rect: spacious });
const ys = scattered.map(p => {
  const u = p.x / spacious.right;
  return (p.y - 500) / (.55 + .45 * Math.pow(Math.sin(u * Math.PI), .55));
});
const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
const variance = ys.reduce((s, y) => s + (y - mean) ** 2, 0);
for (let lag = 1; lag <= 24; lag++) {
  const covariance = ys.slice(lag).reduce((sum, y, i) => sum + (y - mean) * (ys[i] - mean), 0);
  assert(Math.abs(covariance / variance) < .2, `Serial identifier pattern at lag ${lag}.`);
}

const data = JSON.parse(await readFile(new URL('./haruspex-atlas-data-v10.json', import.meta.url)));
const temporal = new Map(data.temporal_assessments.records.map(r => [r.event_id, r]));
const assignments = new Map(data.incident_ontology.assignments.map(r => [r.event_id, r]));
const parseDay = d => d ? Date.parse(`${d}T00:00:00Z`) : null;
const events = data.events.map(e => {
  const source = { ...e, ...temporal.get(e.id) };
  let start, end, kind;
  if (source.event_date && source.event_time_utc) {
    start = end = Date.parse(`${source.event_date}T${source.event_time_utc}Z`); kind = 'clock';
  } else if (source.event_date) {
    start = parseDay(source.event_date); end = start + DAY; kind = 'day';
  } else {
    start = parseDay(source.earliest_context_date); end = parseDay(source.latest_context_date_exclusive); kind = 'window';
  }
  return { ...e, _time: { start, end, center: start !== null && end !== null ? (start + end) / 2 : null, kind, openStart: start === null } };
});
const untouched = JSON.stringify(events);
let realOpenSpread;
for (const width of [320, 740, 1440, 1920]) for (const lifecycle of ['before', 'during', 'after']) {
  const members = events.filter(e => assignments.get(e.id).lifecycle_id === lifecycle);
  const box = { left: 25, right: width - 25, top: 180, bottom: 750 };
  const packed = bowtie({ events: members, rect: box, radius: e => e.source_granularity.startsWith('aggregate') ? 4.4 : 2.3 });
  assert.equal(packed.length, members.length);
  assert.equal(new Set(packed.map(p => p.event.id)).size, members.length);
  assert(packed.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= box.left && p.x <= box.right && p.y >= box.top && p.y <= box.bottom));
  if (width === 1920 && lifecycle === 'before') {
    const xs = packed.filter(p => p.event._time.openStart).map(p => p.x);
    realOpenSpread = (Math.max(...xs) - Math.min(...xs)) / (box.right - box.left);
    assert(realOpenSpread > .5, 'The actual unknown-start cases still form a tight cluster.');
  }
}
assert.equal(JSON.stringify(events), untouched);

const point = (id, x, y, extra = {}) => ({ event: { id }, x, y, radius: 3, alpha: 1, vx: 0, vy: 0, ...extra });
const old = [point('outgoing', 150, 80), point('shared', 300, 150)];
const next = [point('incoming', 700, 200), point('shared', 220, 150)];
for (const direction of [-1, 1]) {
  const plan = timeWind(old, next, { width: 800, direction });
  const start = windFrame(plan, 0, 850), end = windFrame(plan, 1, 850);
  assert.deepEqual(start.find(p => p.event.id === 'outgoing'), old[0]);
  assert.equal(end.find(p => p.event.id === 'incoming').x, 700);
  assert.equal(end.find(p => p.event.id === 'shared').x, 220);
  assert(direction > 0 ? start.find(p => p.event.id === 'incoming').x > 800 : start.find(p => p.event.id === 'incoming').x < 0);
  assert(direction > 0 ? end.find(p => p.event.id === 'outgoing').x < 0 : end.find(p => p.event.id === 'outgoing').x > 800);
  for (const progress of [0, .15, .4, .8, 1]) assert(windFrame(plan, progress, 850).every(p => p.alpha === 1), 'Phase changes must travel, not fade.');
  const middle = windFrame(plan, .4, 850);
  const reversed = timeWind(middle, old, { width: 800, direction: -direction });
  const restart = windFrame(reversed, 0, 850);
  for (const p of middle) {
    const resumed = restart.find(q => q.event.id === p.event.id);
    assert.equal(resumed.x, p.x); assert.equal(resumed.y, p.y); assert.equal(resumed.vx, p.vx);
  }
}
const range = [Date.UTC(2026, 4, 1), Date.UTC(2026, 6, 30)];
const ticks = timeTicks(range);
const shifted = timeTicks(range.map(t => t + DAY));
assert(ticks.filter(t => shifted.includes(t)).length >= ticks.length - 1, 'Calendar tick identities must persist during a pan.');
assert(ticks.every((t, i) => !i || t > ticks[i - 1]));
console.log(`Passed: source bounds, stable placement, all 852 events across widths, no serial-ID patterns, ${(realOpenSpread * 100).toFixed(0)}% unknown-start spread, forward/reverse winding, interruption continuity, constant opacity, and anchored calendar ticks.`);
