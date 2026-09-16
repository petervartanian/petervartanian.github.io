import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const parse = async name => JSON.parse(await read(name));
const models = await Promise.all(['a','b','c','d','e','f','h'].map(letter => parse(`stpa-${letter}1.json`)));
const [assessments,evidence,staticHTML] = await Promise.all([parse('assessments.json'),parse('evidence.json'),read('pathways.html')]);
const sourceIds = new Set([...evidence.sources,...models.flatMap(m=>m.additionalEvidence?.sources||[])].map(s=>s.id));
const passageIds = new Set([...evidence.passages,...models.flatMap(m=>m.additionalEvidence?.passages||[])].map(p=>p.id));
const context = vm.createContext({window:{}});
vm.runInContext(await read('stpa-data.js'),context);
assert.equal(JSON.stringify(context.window.AuspexSTPAModels),JSON.stringify(Object.fromEntries(models.map(m=>[m.pathway,m]))));
assert.equal(JSON.stringify(context.window.AuspexSTPAData),JSON.stringify(models[0]));
vm.runInContext(await read('stpa.js'),context);
const presentation = context.window.AuspexSTPA;
const stateModel = await parse('barrier-states.json');
assert.equal(JSON.stringify(context.window.AuspexBarrierStateData),JSON.stringify(stateModel));
const stateIds = new Set(stateModel.states.map(s=>s.id));
assert.equal(stateIds.size,stateModel.states.length);
assert.deepEqual([...stateIds].sort(), ['absent','backfiring','degrading','failed','intact','reinforced','unknown']);
assert.equal(new Set(stateModel.states.map(s=>s.path)).size,7,'Each state has a distinct symbol');
assert(!stateIds.has('recovery'));
for (const s of stateModel.states) assert(s.definition && s.question && s.path && stateModel.sources.some(x=>x.id===s.source));
for (const s of stateModel.states) {
  const guide=presentation.stateGuide(s.id);
  assert.equal((guide.match(/data-explore-state=/g)||[]).length,7);
  assert(guide.includes(`data-explore-state="${s.id}" aria-pressed="true"`));
  assert(s.example && stateModel.sources.some(x=>x.id===s.exampleSource));
}
assert.deepEqual(Array.from(presentation.routeDefinitions,r=>r.id),['contribution','optional','recovery','feedback']);
for (const section of ['paths','barriers']) {
  const guide=presentation.mapGuide(section);
  assert(guide.includes(`data-map-guide="${section}" aria-pressed="true"`));
  assert(guide.includes('aria-controls="a1-guide-content">Paths</button>'));
  assert(!guide.includes('Path types'));
  assert.equal((guide.match(/class="a1-map-overview"/g)||[]).length,1);
  assert.equal((guide.match(/class="a1-method-guide"/g)||[]).length,1);
  assert(guide.indexOf('a1-map-overview')<guide.indexOf('a1-guide-tabs'),'The map overview belongs above both symbol categories');
  const symbols=guide.match(/<div id="a1-guide-content">([\s\S]*?)<\/div><div class="a1-map-instructions">/)[1];
  assert(!symbols.includes('a1-stage-guide') && !symbols.includes('a1-method-guide') && !symbols.includes('Inspect a barrier'));
  assert.equal(symbols.includes('a1-proposed-definition'),section==='barriers');
  assert.equal(symbols.includes('Possible progression'),section==='paths');
}
assert.equal(presentation.mapGuide('paths').split('<nav')[0],presentation.mapGuide('barriers').split('<nav')[0]);
assert.equal(presentation.mapGuide('paths').split('<div class="a1-map-instructions">')[1],presentation.mapGuide('barriers').split('<div class="a1-map-instructions">')[1],'Both categories share the same incident and method instructions');
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
    assert(c.improvement && ['title','proposal','test','remaining'].every(key=>c.improvement[key]?.trim()),`${m.displayId} ${c.id} needs a specific improvement and a way to challenge it`);
    assert.notEqual(c.improvement.proposal,c.text,'An improvement develops the control rather than repeating its definition');
    assert(!Object.hasOwn(c.improvement,'condition') && !Object.hasOwn(c.improvement,'states'),'A proposal cannot assign an assessed state');
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
  for (const item of m.presentation.context || []) {
    assert(item.title && item.text);
    has('sources',item.sources);
    has('nodes',(item.targets || []).map(t=>t.node));
    for (const target of item.targets || []) assert(target.text,`Context excerpt for ${target.node}`);
  }
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
  assert(base.includes('class="a1-map-field"') && !base.includes('a1-context-thread'));
  const cloud=presentation.contextCloud();
  assert(cloud.includes('0.</span> Context') && cloud.includes('a1-cloud-atmosphere'));
  assert(!cloud.includes('<button') && !cloud.includes('<details'),'Context is readable without another control');
  assert.equal(m.presentation.cloud.origin,'scenario-setting');
  assert(m.presentation.cloud.conditions.length>0);
  assert(m.presentation.cloud.actors.length>0);
  assert.equal(new Set(m.presentation.cloud.conditions).size,m.presentation.cloud.conditions.length);
  assert.equal(new Set(m.presentation.cloud.actors.map(a=>a.controller)).size,m.presentation.cloud.actors.length);
  assert(m.presentation.cloud.summary);
  for (const actor of m.presentation.cloud.actors) {
    has('controllers',[actor.controller]);
    assert(actor.label && actor.role);
    assert(cloud.includes(`data-controller="${actor.controller}"`));
  }
  for (const condition of m.presentation.cloud.conditions) assert(cloud.includes(condition.replaceAll('&','&amp;')));
  assert(cloud.indexOf('a1-cloud-conditions') < cloud.indexOf('a1-cloud-actors'));
  assert(!/undefined|NaN/.test(cloud));
  assert(staticHTML.includes(presentation.contextCloud(m.pathway)));
  for (const heading of ['1. Precursors','2. Event','3. Consequences','Recovery']) assert(base.includes(`<h3 class="a1-region-heading">${heading}</h3>`));
  for (const [wing,prefix] of [['before','1.'],['centre','2.'],['after','3.']]) {
    assert(m.nodes.filter(n=>n.wing===wing).every((n,i)=>n.number===prefix+(i+1)));
  }
  assert.equal(new Set(m.nodes.map(n=>n.number)).size,m.nodes.length);
  assert(base.includes('data-map-guide="paths"') && base.includes('data-map-guide="barriers"'));
  assert(!base.includes('data-overlay-barrier='),'No incident must not imply an observed barrier');
  for (const a of cases) {
    const config=m.presentation.overlays[a.incident];
    assert(a.targets.some(t=>t.id===config.target),'Overlay retains its assessed component');
    has('nodes',[config.anchor]);
    assert(config.observed && config.notEstablished && config.limit && config.kind && config.relation);
    const tentative=config.tentative;
    assert(tentative && tentative.status==='tentative' && tentative.origin==='editorial');
    has('nodes',[tentative.target]); has('sources',tentative.sources);
    assert(tentative.question.endsWith('?') && tentative.basis && tentative.unresolved && tentative.sources.length);
    const sourceSnapshot=JSON.stringify({assessment:a,config,links:m.links});
    const expanded=presentation.renderMap(centre.id,a,a.barriers[0]?.id,()=>'',true);
    assert(expanded.includes(`data-overlay-target="${config.target}"`));
    assert(expanded.includes(`data-overlay-anchor="${config.anchor}"`));
    assert(!expanded.includes('id="a1-tentative-overlay"'),'Exploration never duplicates or moves the incident');
    assert.equal((expanded.match(/id="a1-overlay"/g)||[]).length,1);
    assert(expanded.includes(tentative.question) && expanded.includes(tentative.unresolved));
    assert(expanded.includes('data-explore-connection aria-expanded="true"'));
    assert(expanded.includes('id="a1-question-detail"><p>'));
    assert(!expanded.includes('a1-connection-footnote') && !expanded.includes('Analyst question.'));
    const questionCell=expanded.match(new RegExp(`<div class="a1-cell[^"]*has-question[^"]*" data-cell="([^"]+)"`));
    assert.equal(questionCell?.[1],tentative.target);
    for (const b of presentation.barriers(a)) assert(expanded.includes(`data-overlay-barrier="${b.id}"`),'Source barriers remain available');
    const detail=expanded.split('id="a1-question-detail">')[1].split('</div>')[0];
    assert(!detail.includes('data-overlay-barrier='),'The question does not acquire a barrier assessment');
    assert(!/undefined|NaN/.test(expanded));
    assert(staticHTML.includes(presentation.tentativeConnection(config,true)),'The reader preserves tentative questions and their basis');
    assert.equal(JSON.stringify({assessment:a,config,links:m.links}),sourceSnapshot,'Exploration cannot mutate evidence, assessments or causal routes');
    assert.deepEqual(Object.keys(config.barriers).sort(),a.barriers.map(b=>b.id).sort());
    const html=presentation.renderMap(centre.id,a,'');
    assert(html.includes('id="a1-question-detail" hidden'),'The open question starts collapsed');
    for (const n of m.nodes) assert(html.includes(`data-node="${n.id}"`),'Overlay preserves all scenario nodes');
    assert(html.includes(`data-overlay-target="${config.target}"`),'Selecting another node does not move the evidence');
    assert(html.includes(`data-overlay-anchor="${config.anchor}"`),'Evidence anchor remains explicit');
    assert(!/undefined|NaN/.test(html),`${m.displayId} renders valid content`);
    for (const id of [...a.evidence,...a.barriers.flatMap(b=>b.evidence),...(a.trace||[]).flatMap(t=>t.evidence)]) assert(passageIds.has(id),`Missing passage ${id}`);
    assert(!html.includes('stpa-condition-legend'), 'No inert state legend');
    assert(html.includes('id="a1-case-reference" href="#a1-case-footnote"'));
    assert(html.includes('id="a1-case-footnote"') && html.includes('href="#a1-case-reference"'));
    assert(!html.includes('Evidence is attached to this component;'));
    for (const id of config.candidates || []) {
      const candidate=presentation.barriers(a).find(b=>b.constraint===id);
      assert(candidate && candidate.candidate && candidate.condition==='unknown');
      assert.deepEqual(Array.from(presentation.barrierStates(candidate)),['unknown']);
      assert(html.includes(`data-overlay-barrier="${candidate.id}"`));
      assert(candidate.efficacy.includes(config.notEstablished) && candidate.reinforcement.test);
    }
    for (const b of a.barriers) {
      assert(a.targets.some(t=>t.id===b.target),'Barrier assessment uses a scoped target');
      assert(html.includes(`data-overlay-barrier="${b.id}"`));
      const detail=config.barriers[b.id];
      assert(stateIds.has(detail.condition));
      for (const state of detail.states || []) assert(stateIds.has(state));
      assert(['safeguard','capability','opportunity','contingency','mixed','unknown'].includes(detail.limitType));
      assert(detail.conditionBasis && detail.strongerAI,'Observed condition and future brittleness are separate');
      assert(b.action && b.efficacy && b.durability && b.failure && b.evidence.length);
      if (detail.reinforcement) assert(detail.reinforcement.status==='proposed' && detail.reinforcement.proposal && detail.reinforcement.test);
      barriers++;
    }
  }
  assert(staticHTML.includes(presentation.staticPage()),`${m.displayId} static reader matches current model`);
  assert(staticHTML.includes(`${m.displayId.replace(/[-.]/g,'')}-EVIDENCE-START`));
}
// A.1's optional coordination and extinction continuation must remain conditional.
const a=models[0];
assert.equal(a.presentation.context.length,3);
assert(presentation.use(a.pathway));
const aMap=presentation.renderMap(a.nodes[0].id,null,'');
assert(!aMap.includes('data-context-for='));
assert(presentation.staticPage().includes('Scope of these warning signs'),'Original warning-sign notes remain in the reader');
assert.deepEqual(a.nodes.map(n=>n.number),['1.1','1.2','1.3','2.1','3.1','3.2','3.3','R']);
assert(reaches(a.links.filter(l=>l.from!=='X-01:5' && l.to!=='X-01:5'),'X-01:4','X-01:6'));
assert(a.links.filter(l=>l.from==='X-01:5'||l.to==='X-01:5').every(l=>l.kind==='optional'));
assert(a.links.filter(l=>l.to==='X-01:7').every(l=>l.from==='X-01:6'&&l.kind==='continuation'));
assert(a.scenarios.some(s=>s.ucas.length===0 && s.archetype.includes('Control action not executed')));
for (const o of Object.values(a.presentation.overlays)) assert.equal(o.target,'X-01:3');
assert(!presentation.has('X-02'),'Unworked pathways have no active model');
console.log(`Validated seven STPA models and ${barriers} barriers: traceability, conditional routes, recovery, evidence scope, brittleness, bundle and static reader.`);

const catalogue = await parse('pathways.json');
for (const p of catalogue.pathways.filter(p=>!models.some(m=>m.pathway===p.id))) assert(staticHTML.includes(`id="${p.id}" data-group="${p.group}" data-unworked="true"`));

// The approved visual family: calm double recovery lines and a capped barrier.
const endpoints=d=>{const n=d.match(/-?\d+\.\d+/g).map(Number);return [n.slice(0,2),n.slice(-2)];};
const paths=[[[0,0],[30,0],[30,80],[60,80]],[[0,0],[200,0]],[[0,0],[0,200]],[[200,20],[0,20]],[[0,0],[0,0],[80,80]],[[0,0],[4,0]]];
for (const path of paths) for (const kind of ['contribution','continuation','optional','feedback','recovery']) for (const safeguard of [false,true]) {
  const geometry=presentation.connectionGeometry(kind,path,safeguard);
  assert(!/NaN|undefined|Infinity/.test(JSON.stringify(geometry)));
  assert(!/[CQ]/.test(geometry.d),'Necessary bends use circular turns rather than waves');
  assert.deepEqual(endpoints(geometry.sections[0].d)[0],path[0]);
  assert.deepEqual(endpoints(geometry.sections.at(-1).d)[1],path.at(-1));
  const terminal=geometry.sections.at(-1);
  assert(terminal.length>0);
  if(kind==='optional') {
    const phase=distance=>((distance+terminal.dashOffset)%12+12)%12;
    assert(Math.abs(phase(terminal.length)-7)<.0002,'The last optional dash ends at the arrowhead');
    assert(phase(terminal.length-Math.min(.01,terminal.length/2))<7,'There is ink immediately before the arrowhead');
    if(terminal.length>12) {
      assert(phase(terminal.length-6.99)<7,'The terminal dash retains its full length');
      assert(phase(terminal.length-7.01)>7,'A real gap separates the final dash from the previous one');
    }
  }
  if(geometry.barrier) {
    assert.equal(geometry.sections.length,2);
    const a=endpoints(geometry.sections[0].d)[1],b=endpoints(geometry.sections[1].d)[0];
    assert(Math.abs(Math.hypot(b[0]-a[0],b[1]-a[1])-4)<.15,'A four-pixel gap gives the barrier breathing room');
    const [top,bottom]=endpoints(geometry.barrier.stem);
    assert(Math.abs(Math.hypot(bottom[0]-top[0],bottom[1]-top[1])-10)<.15);
    assert(Math.abs((bottom[0]-top[0])*geometry.tangent[0]+(bottom[1]-top[1])*geometry.tangent[1])<.2,'Barrier crosses the route');
  }
  if(kind==='recovery') {
    assert.equal(geometry.rails.length,geometry.sections.length*2);
    assert.deepEqual(Array.from(geometry.head.tip),path.at(-1));
    for(let i=0;i<geometry.rails.length;i+=2) {
      const a=endpoints(geometry.rails[i].d)[0],b=endpoints(geometry.rails[i+1].d)[0];
      assert(Math.abs(Math.hypot(b[0]-a[0],b[1]-a[1])-2.5)<.15,'Recovery lines stay visibly separate');
    }
  } else assert.equal(geometry.rails.length,0);
}
assert.equal(presentation.connectionGeometry('optional',[[0,0],[200,0]]).sections[0].length,200);
assert(Math.abs(presentation.connectionGeometry('optional',[[0,0],[30,0],[30,80],[60,80]]).sections[0].length-(140-48+12*Math.PI))<.0001,'Dash calibration includes the length removed by rounded corners');
for (const kind of ['contribution','optional','feedback','recovery']) {
  const straight=presentation.connectionGeometry(kind,[[0,0],[80,40],[160,80]],2);
  assert(!/[ACQ]/.test(straight.d),'A clear, collinear connection stays straight');
  const bent=presentation.connectionGeometry(kind,[[0,0],[45,0],[45,160],[90,160]],3);
  assert(bent.d.includes(' A'),'Necessary elbows receive gentle curves');
  assert.equal(bent.barriers.length,3);
  if (kind==='recovery') for(let i=0;i<bent.rails.length;i+=2) {
    const arcs=rail=>Array.from(rail.d.matchAll(/A([\d.]+),([\d.]+) 0 0 ([01]) ([\d.-]+),([\d.-]+)/g),m=>m.slice(1).map(Number));
    const outer=arcs(bent.rails[i]),inner=arcs(bent.rails[i+1]);
    assert.equal(outer.length,inner.length);
    for(let j=0;j<outer.length;j++) assert(Math.abs(Math.abs(outer[j][0]-inner[j][0])-2.5)<.02,'Recovery rails keep their spacing through curved turns');
  }
}
const obstacle={left:40,right:60,top:20,bottom:40};
assert(presentation.clearSegment([0,0],[100,0],[obstacle]));
assert(!presentation.clearSegment([0,30],[100,30],[obstacle]));
assert(!presentation.clearSegment([100,30],[0,30],[obstacle]));
assert(!presentation.clearSegment([50,0],[50,80],[obstacle]));
assert(presentation.clearSegment([20,0],[20,80],[obstacle]));
assert(!presentation.clearSegment([0,0],[100,60],[obstacle]));
const css=await read('stpa.css');
assert(css.includes('.stpa-connection.is-feedback { stroke-dasharray: .1 4.8'));
assert(css.includes('.stpa-connection.is-optional { stroke-dasharray: 7 5'));
assert(css.includes('.stpa-recovery-rail { fill: none; stroke: #6d8976; stroke-width: 1;'));
assert(presentation.routeSymbol('safeguard').includes('a1-barrier-stem'));
assert(presentation.routeSymbol('recovery').includes('route-rail'));
const optionalSymbol=presentation.routeSymbol('optional');
assert.equal((Number(optionalSymbol.match(/pathLength="([\d.]+)"/)[1])+Number(optionalSymbol.match(/stroke-dashoffset="([\d.]+)"/)[1]))%10,6,'The optional-route key also ends with an attached dash');
assert(!css.includes('route-twist') && !css.includes('a1-gate-'));
assert(presentation.mapGuide('barriers').includes('Each mark on a route represents one proposed barrier.'));
assert(presentation.mapGuide('barriers').includes('a1-proposed-definition'));
assert(!presentation.pathsGuide().includes('a1-safeguard-definition'),'Proposed safeguards belong under Barriers, not among route types');
assert.equal(presentation.mapGuide('recovery'),presentation.mapGuide('paths'),'A removed guide falls back to the path key');
for (const m of models) {
  presentation.use(m.pathway);
  const guide=presentation.pathsGuide(true)+presentation.guide()+presentation.stateGuide();
  const prose=guide.replace(/<[^>]*>/g,'').replace(/&[^;]+;/g,'');
  assert(!prose.includes(';'),'Guide explanations use full sentences');
  assert(!guide.includes('Possible means a transition could happen'));
  assert(!guide.includes('Conditional names what else must hold'));
  assert(!guide.includes('Recovery & reinforcement') && !guide.includes('Brittleness & recovery'));
  assert(!guide.includes('stpa-recovery-guide'));
  assert(guide.includes('Systems-Theoretic Process Analysis'));
  assert(!guide.includes('Haruspex') && !guide.includes('Both sites'));
  assert(guide.includes('CAST investigates how control broke down'));
  assert(guide.includes('The related component is highlighted, while'));
  const method=presentation.guide().match(/<section class="a1-method-guide">([\s\S]*?)<\/section>/)[1];
  assert(!method.includes('↗'));
  const citations=Array.from(method.matchAll(/<a class="source-dot"[^>]*href="([^"]+)"[^>]*title="([^"]+)"[^>]*aria-label="([^"]+)"[^>]*><span class="source-disc" aria-hidden="true">([^<]+)<\/span><\/a>/g));
  assert.deepEqual(citations.map(c=>c[4]),['i','ii','iii']);
  for(const citation of citations) {
    assert(citation[1].startsWith('https://'));
    assert(citation[2].startsWith(citation[4]+'. '));
    assert(citation[3].startsWith('Open source '+citation[4]+': '));
  }
  const register=presentation.staticPage().match(/<ol class="stpa-sources">([\s\S]*?)<\/ol>/)[1];
  assert.equal((register.match(/class="source-disc"/g)||[]).length,m.sources.length);
  assert(!register.includes('↗'));
  assert(!presentation.staticPage().includes('Haruspex'));
  const recovery=m.nodes.find(n=>n.type==='recovery');
  assert(!presentation.renderMap(recovery.id,null,'').includes('data-recovery-info'));
  for (const route of presentation.proposedBarriers()) for (const c of route.controls) {
    const view=presentation.proposedBarrierView(route.id,null,()=>'',c.id);
    assert.equal((view.match(/data-constraint=/g)||[]).length,1);
    assert(view.includes(`data-constraint="${c.id}"`));
    assert(!view.includes('Ibid.') && !view.includes('Proposed safeguard'));
    assert(!view.includes('<details') && !view.includes('No assessment of this safeguard'));
    assert(view.includes('Strengthen this barrier'));
    const changed=presentation.proposedBarrierView(route.id,null,()=>'',c.id,{strengthen:true});
    assert(changed.includes('Back to assessment') && changed.includes('Proposed change'));
    const heading=html=>html.match(/<header class="a1-barrier-card-heading">[\s\S]*?<\/header>/)[0];
    assert.equal(heading(changed),heading(view),'Proposing a change preserves the original status and glyph');
    assert(!changed.includes('<details') && !changed.includes('No assessment of this safeguard'));
    assert.equal((changed.match(/class="a1-barrier-card-heading"/g)||[]).length,1);
    assert(staticHTML.includes(c.improvement.title.replace(/&/g,'&amp;')),'Every improvement is available without JavaScript');
  }
}
assert(!staticHTML.includes('stpa-recovery-guide'));
assert(!staticHTML.includes('data-strengthen='),'The static reader has no inactive strengthening controls');
const staticKey=staticHTML.match(/<!-- MAP-KEY-START -->([\s\S]*?)<!-- MAP-KEY-END -->/)[1];
assert.equal((staticKey.match(/class="a1-map-overview"/g)||[]).length,1);
assert.equal((staticKey.match(/class="a1-method-guide"/g)||[]).length,1);
assert(staticKey.includes('<h3>Paths</h3>') && staticKey.includes('<h3>Barriers</h3>'));
assert(!staticKey.includes('Haruspex') && !staticKey.includes('Path types'));

for (const path of [[[0,0],[61,0]],[[0,0],[33,0],[33,30],[66,30]],[[0,0],[0,160]]]) {
 const count=path.at(-1)[1]===160?4:2;
 for(const kind of ['contribution','optional','feedback','recovery']) {
  const g=presentation.connectionGeometry(kind,path,count);
  assert.equal(g.barriers.length,count);
  assert.equal(g.sections.length,count+1);
  for(let i=0;i<count;i++)for(let j=i+1;j<count;j++)assert(Math.hypot(g.barriers[i].center[0]-g.barriers[j].center[0],g.barriers[i].center[1]-g.barriers[j].center[1])>=29.9);
 }
}
