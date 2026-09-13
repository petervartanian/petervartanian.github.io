import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const m = JSON.parse(await read('stpa-a1.json'));
const indexes = {};
for (const key of ['losses','hazards','controllers','controlLoops','constraints','nodes','unsafeActions','scenarios','sources','roleTypes']) {
  indexes[key] = new Set(m[key].map(x => x.id));
  assert.equal(indexes[key].size, m[key].length, `Unique IDs: ${key}`);
}
const has = (kind, refs) => refs.forEach(id => assert(indexes[kind].has(id), `${kind}: ${id}`));
for (const h of m.hazards) has('losses',h.losses);
for (const c of m.constraints) {
  has('hazards',c.hazards); has('controllers',c.owners); has('nodes',c.nodes);
  assert(c.test && c.limit, `Constraint ${c.id} needs a test and limit`);
}
for (const l of m.controlLoops) {
  has('controllers',[l.controller,l.process]); has('constraints',l.constraints);
  assert(l.action && l.feedback);
}
for (const n of m.nodes) {
  has('constraints',n.constraints); has('sources',n.sources); has('scenarios',n.scenarios);
  has('roleTypes',[n.type]);
  for (const id of n.references) assert(['hazards','losses','scenarios','unsafeActions'].some(k=>indexes[k].has(id)),`Node reference ${id}`);
  assert(n.role && n.requires && n.mechanism);
  for (const id of n.constraints) assert(m.constraints.find(c=>c.id===id).nodes.includes(n.id), `Constraint cross-reference ${id}/${n.id}`);
}
for (const l of m.links) {
  has('nodes',[l.from,l.to]); assert(l.label && l.kind);
}
for (const u of m.unsafeActions) {
  has('controllers',[u.controller]); has('controlLoops',[u.loop]);
  has('hazards',u.hazards); has('constraints',u.constraints);
  assert.equal(m.controlLoops.find(l=>l.id===u.loop).controller,u.controller);
  assert(u.action && u.context);
}
for (const s of m.scenarios) {
  has('unsafeActions',s.ucas); has('hazards',s.hazards); has('nodes',s.nodes); has('sources',s.evidence);
  assert(s.unknown);
}
// These are substantive modeling safeguards, not layout snapshots.
assert.equal(m.nodes.filter(n=>n.wing==='centre').length,1);
assert.deepEqual(m.nodes.map(n=>n.number),['01','02','03','04','05','06','07','R']);
assert(m.links.some(l=>l.from==='X-01:4' && l.to==='X-01:6'), 'Optional coordination must be bypassable');
assert(m.links.filter(l=>l.from==='X-01:5'||l.to==='X-01:5').every(l=>l.kind==='optional'));
assert.equal(m.nodes[5].role,'Loss · L1');
assert.equal(m.nodes[6].role,'Further loss · L2');
assert.equal(new Set(m.unsafeActions.map(u=>u.type)).size,4);
assert(m.scenarios.some(s=>s.ucas.length===0 && s.archetype.includes('Control action not executed')));
assert.equal(m.controlEvidence.constraint,'SC4');
has('sources',[m.controlEvidence.source]);
assert.match(m.controlEvidence.limit,/does not establish successor capture/);
const context = vm.createContext({window:{}});
vm.runInContext(await read('stpa-data.js'),context);
assert.equal(JSON.stringify(context.window.AuspexSTPAData),JSON.stringify(m));
vm.runInContext(await read('stpa.js'),context);
const presentation = context.window.AuspexSTPA;
const reaches = (links, from, to, seen = new Set()) => {
  if (from === to) return true;
  if (seen.has(from)) return false;
  seen.add(from);
  return links.filter(l=>l.from===from).some(l=>reaches(links,l.to,to,seen));
};
const links = presentation.projectedLinks();
const withoutCoordination = links.filter(l=>l.from!=='X-01:5' && l.to!=='X-01:5');
assert(reaches(withoutCoordination,'X-01:4','X-01:6'), 'Coordination is not required');
assert(reaches(links,'X-01:4','X-01:R'), 'Recovery remains possible');
assert(!reaches(links,'X-01:R','X-01:6'), 'Successful recovery is not a step toward loss');
assert(links.filter(l=>l.to==='X-01:7').every(l=>l.from==='X-01:6' && l.kind==='continuation'));
for (const id of ['X-01:4','X-01:R','X-01:6','X-01:7']) assert(m.presentation.conditions[id]);
const allAssessments = JSON.parse(await read('assessments.json'));
const cases = (allAssessments.assessments || allAssessments).filter(a=>a.pathway===m.pathway);
assert.equal(Object.keys(m.presentation.overlays).length,cases.length);
const base = presentation.renderMap('X-01:3',null,'');
assert(!base.includes('data-overlay-barrier='), 'No incident must not imply an observed barrier');
for (const a of cases) {
  const config = m.presentation.overlays[a.incident];
  assert(a.targets.some(t=>t.id===config.target), 'Overlay uses its assessed component');
  assert.equal(config.target,'X-01:3', 'These experiments do not establish later capture');
  assert.deepEqual(Object.keys(config.barriers).sort(),a.barriers.map(b=>b.id).sort());
  const html = presentation.renderMap('X-01:4',a,'');
  for (const n of m.nodes) assert(html.includes(`data-node="${n.id}"`), 'Overlay preserves the scenario nodes');
  assert(html.includes(`data-overlay-target="${config.target}"`), 'Selecting another step does not move the evidence');
  for (const b of a.barriers) {
    assert.equal(b.target,config.target);
    assert(html.includes(`data-overlay-barrier="${b.id}"`));
  }
}
const staticHTML = await read('pathways.html');
assert(staticHTML.includes(context.window.AuspexSTPA.staticPage()),'Static reader matches current model');
assert(staticHTML.includes('A1-EVIDENCE-START'));
console.log('Validated A.1 traceability, incident overlay scope, recovery and conditional routes, control/feedback references, evidence limits, bundle and static reader.');
