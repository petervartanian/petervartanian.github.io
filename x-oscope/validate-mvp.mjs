import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const context=vm.createContext({window:{}});
for(const name of ['families.js','scenarios.js','catalogue.js','case-events.js','mvp-data.js']) vm.runInContext(await readFile(new URL(name,import.meta.url),'utf8'),context,{filename:name});
const d=context.window.XoscopeEvidence,review=context.window.AuspexFamilies;
const unique=(items,label)=>assert.equal(new Set(items.map(item=>item.id)).size,items.length,`${label}: duplicate identifiers`);
const get=(items,id)=>{const result=items.find(item=>item.id===id);assert(result,`Unknown reference ${id}`);return result;};
for(const key of ['scenarios','cases','components','controls','mappings','events','sources'])unique(d[key],key);
assert.equal(d.scenarios.length,95);
assert.equal(new Set(d.scenarios.map(s=>s.reviewIndex)).size,95);
for(const family of review.groups.flatMap(g=>g.families))assert.equal(d.scenarios.filter(s=>s.family===family.id).length,family.count,`${family.id}: classification count changed`);
assert.equal(d.scenarios.find(s=>s.title==='The Production Web').id,'A-IV-1','Preserve scenario bookmarks');
assert.equal(d.scenarios.find(s=>s.id==='A-IV-1').variants[0].id,'A-IV-1.c');
assert.equal(d.scenarios.filter(s=>s.chain).length,2);
assert.equal(d.scenarios.filter(s=>s.coverage==='curated').length,1);
assert.equal(d.scenarios.filter(s=>s.coverage==='not-assessed').length,94);
const records=JSON.parse(await readFile(new URL('../haruspex/haruspex-dataset.json',import.meta.url),'utf8')).events;
for(const event of d.events){
  const original=get(records,event.id);
  for(const key of Object.keys(event))assert.equal(event[key],original[key],`${event.id}: source ${key} changed`);
  assert(event.event_group_id&&event.source_locator&&event.uncertainty_notes);
}
for(const c of d.cases){
  assert(c.scope&&c.period&&c.sources.length);
  if(c.kind==='episode'){const parent=get(d.cases,c.parent);assert(parent.children.includes(c.id));assert(c.events.length);}
  for(const id of c.events||[])get(d.events,id);
  for(const id of c.sources)get(d.sources,id);
}
for(const m of d.mappings){
  const s=get(d.scenarios,m.scenario),c=get(d.cases,m.case);
  assert.equal(c.kind,'episode','Do not classify the entire mega-case');
  assert.equal(m.steps.length,s.chain.length,'Every causal step needs a fit or non-fit assessment');
  assert(/pending/.test(m.review),'Do not invent independent approval');
  assert(m.premiseCheck&&m.stopping&&m.exclusions&&m.questions.length);
  for(const step of m.steps){get(s.chain,step.step);assert(step.status&&step.reading);for(const id of step.events){get(d.events,id);assert(c.events.includes(id));}}
  for(const id of m.components){const component=get(d.components,id);assert(component.limitation);component.steps.forEach(id=>get(s.chain,id));component.events.forEach(id=>assert(c.events.includes(id)));}
  for(const id of m.controls){const control=get(d.controls,id);get(d.components,control.component);assert(control.owner&&control.constraint&&control.durability&&control.proposal&&control.test&&control.residual);control.events.forEach(id=>assert(c.events.includes(id)));}
  const text=d.assessmentText(m.id);
  for(const fragment of [m.finding,m.version,m.review,m.exclusions,m.premiseCheck,...c.events])assert(text.includes(fragment),`Export loses ${fragment}`);
  assert(text.includes('https://petervartanian.xyz/haruspex/'),'Export links work outside the site');
  assert(!text.includes('../haruspex/'));
}
assert.equal(d.assessmentText('unknown'),'');
for(const s of d.sources)assert(['https:'].includes(new URL(s.url,'https://petervartanian.xyz/x-oscope/').protocol));
for(const name of ['catalogue.js','case-events.js','mvp-data.js','mvp.js']){
  const text=await readFile(new URL(name,import.meta.url),'utf8');
  assert(!/\/Users\/|docs\.google\.com|overleaf\.com\/project|FI2I_Notes/.test(text),`${name}: private material leaked`);
  new vm.Script(text,{filename:name});
}
console.log('Validated all 95 classifications, stable addresses, episode boundaries, source fidelity, step coverage, component/control links, qualified export, and private-source exclusions.');
