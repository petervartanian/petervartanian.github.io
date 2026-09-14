import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import './field-layout.js';
const { create, project, bowtie, calendarTime, calendarPlan, calendarFrame, bowtieWindow, bowtieProject, bowtieFrame, timeTicks } = globalThis.HaruspexLayout;
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

const calendarScatter = create({events:serial,bands:[{key:'field',start:0,end:1}],range:[-1,1001],rect:spacious,bandKey:()=> 'field'}).points.map(p=>p.yWorld);
const scatterMean=calendarScatter.reduce((a,b)=>a+b,0)/calendarScatter.length;
const scatterVariance=calendarScatter.reduce((sum,y)=>sum+(y-scatterMean)**2,0);
for (let lag=1;lag<=24;lag++) {
  const covariance=calendarScatter.slice(lag).reduce((sum,y,i)=>sum+(y-scatterMean)*(calendarScatter[i]-scatterMean),0);
  assert(Math.abs(covariance/scatterVariance)<.2, `Calendar packing has a serial identifier pattern at lag ${lag}.`);
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

// Temporal correctness: the visible axis and the marks must use the same camera.
const xAt = (time, range, geometry = rect) => geometry.left + (time - range[0]) / (range[1] - range[0]) * (geometry.right - geometry.left);
const close = (actual, expected, note) => assert(Math.abs(actual - expected) < .00001, `${note}: ${actual} != ${expected}`);
function snapshot(members, range, geometry = rect) {
  return Object.assign(members.map((e, i) => {
    const p = { event:e, fraction:.35, y:100 + i * 15, radius:3, alpha:1, vx:0, vy:0 };
    p.time = calendarTime(p, range); p.x = xAt(p.time, range, geometry); return p;
  }), { range, geometry, rangeVelocity:[0,0] });
}
const sameInstant = 15 * DAY;
const outgoing = clock('II-at-same-time', sameInstant), incoming = clock('III-at-same-time', sameInstant);
const wideWindow = event('bounded', {start:8*DAY,end:25*DAY,kind:'window',openStart:false});
const old = snapshot([outgoing, wideWindow, unknown[0]], [0, 30 * DAY]);
const next = snapshot([incoming, wideWindow, unknown[0]], [10 * DAY, 35 * DAY]);
const plan = calendarPlan(old, next);
for (const progress of [0, .15, .4, .8, 1]) {
  const frame = calendarFrame(plan, progress, 400);
  const a = frame.points.find(p => p.event.id === outgoing.id), b = frame.points.find(p => p.event.id === incoming.id);
  close(a.x, b.x, 'Same time in different phases must have the same x coordinate');
  for (const point of frame.points) {
    close(point.x, xAt(point.time, frame.range, frame.geometry), 'Every mark must stay on the displayed calendar');
    assert.equal(point.alpha, 1, 'Phase changes do not fade the whole field');
  }
  const bound = frame.points.find(p => p.event.id === unknown[0].id);
  assert.equal(bound.time, unknown[0]._time.end, 'An unknown start is never assigned a fabricated event time');
  const bounded = frame.points.find(p => p.event.id === wideWindow.id);
  assert(bounded.time >= Math.max(wideWindow._time.start, frame.range[0]) && bounded.time <= Math.min(wideWindow._time.end, frame.range[1]));
}
close(calendarFrame(plan, 0, 400).points.find(p => p.event.id === incoming.id).x, xAt(sameInstant, old.range), 'Incoming events start at their dates, never one screen away');
for (const target of [old, next]) {
  const middle = calendarFrame(plan, .4, 400);
  const from = Object.assign(middle.points, {range:middle.range, rangeVelocity:middle.rangeVelocity, geometry:middle.geometry});
  const reversed = calendarPlan(from, target), restart = calendarFrame(reversed, 0, 400);
  for (const point of middle.points) {
    const resumed = restart.points.find(p => p.event.id === point.event.id);
    close(resumed.x, point.x, 'Reversal must preserve displayed x');
    close(resumed.y, point.y, 'Reversal must preserve displayed y');
    close(resumed.radius, point.radius, 'Reversal must preserve marker size');
  }
  restart.rangeVelocity.forEach((v, i) => close(v / DAY, middle.rangeVelocity[i] / DAY, 'Camera velocity must not restart'));
}
// Even an interrupted, extreme zoom must retain a finite, increasing axis.
const fast = Object.assign(snapshot([incoming], [14*DAY,16*DAY]), {rangeVelocity:[30*DAY,-30*DAY]});
const zoomPlan = calendarPlan(fast, next);
for (let i=0;i<=100;i++) {
  const frame=calendarFrame(zoomPlan,i/100,400);
  assert(frame.range.every(Number.isFinite) && frame.range[1]>frame.range[0]);
}
// Use the actual incident data. II and III overlap, rather than being full
// screens apart. Reprojection and the final static layout must agree.
const fullRange = [Math.min(...events.map(e=>e._time.start).filter(Number.isFinite))-DAY, Math.max(...events.map(e=>e._time.end).filter(Number.isFinite))+DAY];
const layout = create({events, bands:[{key:'all',start:0,end:1}], range:fullRange, rect, bandKey:()=> 'all'});
const severity = new Map(data.severity_assessments.records.map(r=>[r.id,r]));
const phaseSnapshot = (phase, impactOnly=false) => {
  const members=events.filter(e=>assignments.get(e.id).lifecycle_id===phase && (!impactOnly || !['context','unresolved'].includes(severity.get(e.id).band)));
  const range=[Math.min(...members.map(e=>e._time.start).filter(Number.isFinite))-DAY, Math.max(...members.map(e=>e._time.end).filter(Number.isFinite))+DAY];
  return Object.assign(project(layout,{range,rect,ids:new Set(members.map(e=>e.id))}), {range,geometry:rect,rangeVelocity:[0,0]});
};
for (const [a,b] of [['before','during'],['during','after'],['after','before']]) {
  const from=phaseSnapshot(a), to=phaseSnapshot(b), plan=calendarPlan(from,to);
  assert(Math.min(from.range[1],to.range[1]) > Math.max(from.range[0],to.range[0]), 'The actual phase windows overlap');
  const last=calendarFrame(plan,1,400);
  for (const point of to) {
    const result=last.points.find(p=>p.event.id===point.event.id);
    close(result.x,point.x,'No final-frame jump to static x');
    close(result.y,point.y,'No final-frame jump to static y');
  }
  for (const t of [0,.25,.5,.75,1]) {
    const frame=calendarFrame(plan,t,400);
    for (const p of frame.points) close(p.x,xAt(p.time,frame.range),'Actual source data remain calendar-aligned');
  }
}
const during=phaseSnapshot('during',true), after=phaseSnapshot('after',true);
const sharedDate=Date.UTC(2026,6,15);
assert(Math.abs(xAt(sharedDate,during.range)-xAt(sharedDate,after.range)) < (rect.right-rect.left)*.2, 'II to III should only shift a July date a small distance');
assert.equal(JSON.stringify(events), untouched, 'Animation must not modify source records');
// Bow-tie focus is a camera over one stable role-based form. It never assigns
// source times to its schematic positions, including the unknown-start cases.
const boxes = {before:[.025,.30,.08,.92],during:[.365,.635,.255,.745],after:[.70,.975,.08,.92]};
const world = Object.entries(boxes).flatMap(([phase,[left,right,top,bottom]]) => bowtie({
  events:events.filter(e=>assignments.get(e.id).lifecycle_id===phase),
  rect:{left:left*1200,right:right*1200,top:top*600,bottom:bottom*600},
  mode:phase==='during'?'knot':phase,
}).map(p=>({...p,worldX:p.x/1200,worldY:p.y/600})));
const bowState = phase => Object.assign(bowtieProject(world,{camera:bowtieWindow(phase),rect,
  ids: phase==='all'?null:new Set(events.filter(e=>assignments.get(e.id).lifecycle_id===phase).map(e=>e.id)),
}), {range:phase==='all'?fullRange:phaseSnapshot(phase).range,geometry:rect,bowCamera:bowtieWindow(phase),rangeVelocity:[0,0]});
for (const [fromPhase,toPhase] of [['all','before'],['before','during'],['during','after'],['after','before'],['during','all']]) {
  const from=bowState(fromPhase),to=bowState(toPhase),plan=calendarPlan(from,to);
  for (const t of [0,.25,.5,.75,1]) {
    const frame=bowtieFrame(plan,t,1550);
    assert(frame.range[1]>frame.range[0]);
    for (const p of frame.points) {
      close(p.x,rect.left+(p.worldX-frame.bowCamera.left)/(frame.bowCamera.right-frame.bowCamera.left)*(rect.right-rect.left),'Bow marks must stay in their own form during focus');
      assert.equal(p.time,undefined,'A schematic bow-tie position must not be returned as a timestamp');
      assert.equal(p.alpha,1,'Bow-tie focus moves through the form without a field crossfade');
    }
  }
  const first=bowtieFrame(plan,0,1550),last=bowtieFrame(plan,1,1550);
  for (const [expected,frame] of [[from,first],[to,last]]) for (const p of expected) {
    const q=frame.points.find(x=>x.event.id===p.event.id);
    close(p.x,q.x,'Bow-tie must not jump at either endpoint');close(p.y,q.y,'Bow-tie y continuity');
  }
  const middle=bowtieFrame(plan,.4,1550);
  const interrupted=Object.assign(middle.points,{range:middle.range,rangeVelocity:middle.rangeVelocity,geometry:middle.geometry,bowCamera:middle.bowCamera,bowVelocity:middle.bowVelocity});
  const reversal=bowtieFrame(calendarPlan(interrupted,from),0,1550);
  for (const p of middle.points) {
    const q=reversal.points.find(x=>x.event.id===p.event.id);
    close(p.x,q.x,'Interrupted bow-tie x must continue');close(p.y,q.y,'Interrupted bow-tie y must continue');
    close(p.radius,q.radius,'Interrupted bow-tie size must continue');
  }
}
const openImpact = bowState('before').filter(p=>p.event._time.openStart && !['context','unresolved'].includes(severity.get(p.event.id).band));
assert.equal(openImpact.length,9);
assert((Math.max(...openImpact.map(p=>p.x))-Math.min(...openImpact.map(p=>p.x)))/(rect.right-rect.left)>.5,'The nine actual Impact open starts must not form a vertical stack');
assert.equal(JSON.stringify(events),untouched,'Restoring bow-tie geometry must leave all source records intact');
const range = [Date.UTC(2026, 4, 1), Date.UTC(2026, 6, 30)];
const ticks = timeTicks(range);
const shifted = timeTicks(range.map(t => t + DAY));
assert(ticks.filter(t => shifted.includes(t)).length >= ticks.length - 1, 'Calendar tick identities must persist during a pan.');
assert(ticks.every((t, i) => !i || t > ticks[i - 1]));
console.log(`Passed: source bounds, stable schematic placement across widths, no serial-ID patterns, calendar-aligned phase overlap, interruption continuity, positive zoom ranges, source-anchored open bounds, stable bow-tie focus and reversals, scattered open starts, and no final-frame jumps.`);
