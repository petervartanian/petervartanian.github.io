import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const parse = async name => JSON.parse(await read(name));
const models = await Promise.all(['a','b','c','d','e','f'].map(letter => parse(`stpa-${letter}1.json`)));
const [assessments,evidence,staticHTML] = await Promise.all([parse('assessments.json'),parse('evidence.json'),read('pathways.html')]);
const sourceIds = new Set([...evidence.sources,...models.flatMap(m=>m.additionalEvidence?.sources||[])].map(s=>s.id));
const passageIds = new Set([...evidence.passages,...models.flatMap(m=>m.additionalEvidence?.passages||[])].map(p=>p.id));
const context = vm.createContext({window:{}});
vm.runInContext(await read('stpa-data.js'),context);
assert.equal(JSON.stringify(context.window.AuspexSTPAModels),JSON.stringify(Object.fromEntries(models.map(m=>[m.pathway,m]))));
assert.equal(JSON.stringify(context.window.AuspexSTPAData),JSON.stringify(models[0]));
vm.runInContext(await read('stpa.js'),context);
const presentation = context.window.AuspexSTPA;
const reaches = (links, from, to, seen = new Set()) => {
  if (from === to) return true;
  if (seen.has(from)) return false;
  seen.add(from);
  return links.filter(l=>l.from===from).some(l=>reaches(links,l.to,to,seen));
};
let barriers = 0;
for (const m of models) {
  assert(presentation.use(m.pathway));
  assert(presentation.has(m.pathway));
  assert.equal(presentation.model.pathway,m.pathway);
  const indexes = {};
  for (const key of ['losses','hazards','controllers','controlLoops','constraints','nodes','unsafeActions','scenarios','sources','roleTypes']) {
    indexes[key] = new Set(m[key].map(x=>x.id));
    assert.equal(indexes[key].size,m[key].length,`${m.displayId} unique ${key}`);
  }
  const has = (kind, refs) => refs.forEach(id=>assert(indexes[kind].has(id),`${m.displayId} ${kind}: ${id}`));
  for (const h of m.hazards) has('losses',h.losses);
  for (const c of m.constraints) {
    has('hazards',c.hazards); has('controllers',c.owners); has('nodes',c.nodes);
    assert(c.test && c.limit,`Constraint ${c.id} needs a test and limit`);
  }
  for (const l of m.controlLoops) {
    has('controllers',[l.controller,l.process]); has('constraints',l.constraints);
    assert(l.action && l.feedback);
  }
  for (const n of m.nodes) {
    has('constraints',n.constraints); has('sources',n.sources); has('scenarios',n.scenarios); has('roleTypes',[n.type]);
    for (const id of n.references) assert(['hazards','losses','scenarios','unsafeActions'].some(k=>indexes[k].has(id)),`Node reference ${id}`);
    assert(n.role && n.requires && n.mechanism);
    for (const id of n.constraints) assert(m.constraints.find(c=>c.id===id).nodes.includes(n.id),`Constraint cross-reference ${id}/${n.id}`);
  }
  for (const l of m.links) { has('nodes',[l.from,l.to]); has('constraints',l.constraints||[]); assert(l.label && l.kind); }
  for (const u of m.unsafeActions) {
    has('controllers',[u.controller]); has('controlLoops',[u.loop]); has('hazards',u.hazards); has('constraints',u.constraints);
    assert.equal(m.controlLoops.find(l=>l.id===u.loop).controller,u.controller);
    assert(u.action && u.context);
  }
  for (const s of m.scenarios) {
    has('unsafeActions',s.ucas); has('hazards',s.hazards); has('nodes',s.nodes); has('sources',s.evidence); assert(s.unknown);
  }
  assert.equal(m.nodes.filter(n=>n.wing==='centre').length,1);
  const centre=m.nodes.find(n=>n.wing==='centre');
  const recovery=m.nodes.find(n=>n.wing==='recovery');
  assert(recovery,`${m.displayId} has a recovery branch`);
  const links=presentation.projectedLinks();
  assert(reaches(links,centre.id,recovery.id),'Recovery remains possible');
  for (const loss of m.nodes.filter(n=>n.type==='loss')) assert(!reaches(links,recovery.id,loss.id),'Recovery is not a step toward loss');
  assert.equal(new Set(m.unsafeActions.map(u=>u.type)).size,4);
  for (const n of m.nodes.filter(n=>['centre','after','recovery'].includes(n.wing))) assert(m.presentation.conditions[n.id],`${n.id} requires explicit conditions`);
  for (const p of m.additionalEvidence?.passages || []) assert(sourceIds.has(p.source),`Evidence source ${p.id}`);
  const overrides=new Map((m.assessments||[]).map(a=>[a.id,a]));
  const cases=assessments.filter(a=>a.pathway===m.pathway).map(a=>overrides.get(a.id)||a);
  assert.equal(Object.keys(m.presentation.overlays).length,cases.length);
  const base=presentation.renderMap(m.nodes[0].id,null,'');
  assert(!base.includes('data-overlay-barrier='),'No incident must not imply an observed barrier');
  for (const a of cases) {
    const config=m.presentation.overlays[a.incident];
    assert(a.targets.some(t=>t.id===config.target),'Overlay retains its assessed component');
    has('nodes',[config.anchor]);
    assert(config.observed && config.notEstablished && config.limit && config.kind && config.relation);
    assert.deepEqual(Object.keys(config.barriers).sort(),a.barriers.map(b=>b.id).sort());
    const html=presentation.renderMap(centre.id,a,'');
    for (const n of m.nodes) assert(html.includes(`data-node="${n.id}"`),'Overlay preserves all scenario nodes');
    assert(html.includes(`data-overlay-target="${config.target}"`),'Selecting another node does not move the evidence');
    assert(html.includes(`data-overlay-anchor="${config.anchor}"`),'Evidence anchor remains explicit');
    assert(!/undefined|NaN/.test(html),`${m.displayId} renders valid content`);
    for (const id of [...a.evidence,...a.barriers.flatMap(b=>b.evidence),...(a.trace||[]).flatMap(t=>t.evidence)]) assert(passageIds.has(id),`Missing passage ${id}`);
    for (const b of a.barriers) {
      assert(a.targets.some(t=>t.id===b.target),'Barrier assessment uses a scoped target');
      assert(html.includes(`data-overlay-barrier="${b.id}"`));
      const detail=config.barriers[b.id];
      assert(['reinforced','intact','degrading','failed','unknown'].includes(detail.condition));
      assert(['safeguard','capability','opportunity','contingency','mixed','unknown'].includes(detail.limitType));
      assert(detail.conditionBasis && detail.strongerAI,'Observed condition and future brittleness are separate');
      assert(b.action && b.efficacy && b.durability && b.failure && b.evidence.length);
      if (detail.reinforcement) assert(detail.reinforcement.status==='proposed' && detail.reinforcement.proposal && detail.reinforcement.test);
      barriers++;
    }
  }
  assert(staticHTML.includes(presentation.staticPage()),`${m.displayId} static reader matches current model`);
  assert(staticHTML.includes(`${m.displayId.replace('.','')}-EVIDENCE-START`));
}
// A.1's optional coordination and extinction continuation must remain conditional.
const a=models[0];
assert.deepEqual(a.nodes.map(n=>n.number),['01','02','03','04','05','06','07','R']);
assert(reaches(a.links.filter(l=>l.from!=='X-01:5' && l.to!=='X-01:5'),'X-01:4','X-01:6'));
assert(a.links.filter(l=>l.from==='X-01:5'||l.to==='X-01:5').every(l=>l.kind==='optional'));
assert(a.links.filter(l=>l.to==='X-01:7').every(l=>l.from==='X-01:6'&&l.kind==='continuation'));
assert(a.scenarios.some(s=>s.ucas.length===0 && s.archetype.includes('Control action not executed')));
for (const o of Object.values(a.presentation.overlays)) assert.equal(o.target,'X-01:3');
assert(!presentation.has('X-02'),'Unmigrated pathways keep their existing workflow');
console.log(`Validated six STPA models and ${barriers} barriers: traceability, conditional routes, recovery, evidence scope, brittleness, bundle and static reader.`);
