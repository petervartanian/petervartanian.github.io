import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const read=name=>readFile(new URL(name,import.meta.url),'utf8');
const elements=new Map();
const documentListeners={},windowListeners={};
let focused='';
function element(key) {
  if(elements.has(key)) return elements.get(key);
  const e={key,innerHTML:'',textContent:'',value:'',dataset:{},hidden:false,open:false,style:{setProperty(){}},
    classList:{toggle(){},add(){},remove(){}},listeners:{},attributes:{},
    addEventListener(type,fn){this.listeners[type]=fn},setAttribute(k,v){this.attributes[k]=String(v)},getAttribute(k){return this.attributes[k]||null},
    append(){},prepend(){},insertBefore(){},focus(){focused=this.key},scrollIntoView(){},querySelector:element,querySelectorAll(){return []},
    contains(other){return other===this || other?.container===key || other?.key?.startsWith(key+' ')},
    close(){this.open=false},showModal(){this.open=true},
    click(){const match=key.match(/\[data-([\w-]+)="([^"]*)"\]/);if(match)click(match[1]==='question'?'#barrier-panel':'#pathway-map',match[1],match[2])}};
  elements.set(key,e);return e;
}
let url='file:///fixture/auspex/index.html';
const location={get href(){return url},get search(){return new URL(url).search}};
const nodeButtons=()=>Array.from((elements.get('#map-nodes')?.innerHTML || '').matchAll(/data-node="([^"]+)"/g),([,id])=>Object.assign(element('node-'+id),{dataset:{node:id,target:id}}));
const document={querySelector:element,getElementById:id=>element('#'+id),querySelectorAll:selector=>selector.includes('#a1-route')?nodeButtons():[],createElement:tag=>element('created-'+tag),addEventListener(type,fn){documentListeners[type]=fn},get activeElement(){return element(focused)}};
let geometryMobile=false;
const matchMedia=query=>({matches:geometryMobile && query==='(max-width: 740px)',addEventListener(){}});
const history={pushState(a,b,next){url=String(next)},replaceState(a,b,next){url=String(next)}};
const context=vm.createContext({window:{matchMedia,scrollTo(){}},document,location,history,URL,URLSearchParams,matchMedia,requestAnimationFrame(){},addEventListener(type,fn){windowListeners[type]=fn},console});
for(const file of ['data.js','stpa-data.js','inspection.js','stpa.js']) vm.runInContext(await read(file),context);
let app=await read('app.js');
app=app.slice(0,app.lastIndexOf('\n  readLocation();'))+'\nwindow.test={state,readLocation,selectPathway,selectIncident,showOverview,renderEvidenceMap};})();';
vm.runInContext(app,context);
const {test,AuspexSTPA:stpa}=context.window;
const matchesSelector=(target,selector)=>selector.split(',').some(part=>{
 const candidate=part.trim();
 const attribute=candidate.match(/\[data-([\w-]+)(?:="([^"]*)")?\]/);
 const tag=candidate.match(/^[a-z]+/i)?.[0];
 const className=candidate.match(/\.([\w-]+)/)?.[1];
 if(tag && target.tagName?.toLowerCase()!==tag.toLowerCase())return false;
 if(className && !String(target.className||'').split(/\s+/).includes(className))return false;
 if(attribute){const key=attribute[1].replace(/-([a-z])/g,(_,x)=>x.toUpperCase());return Object.hasOwn(target.dataset||{},key) && (attribute[2]===undefined || target.dataset[key]===attribute[2]);}
 return Boolean(className || tag);
});
const targetFor=(container,attribute,value='')=>{
 const attr='data-'+attribute;
 return {container,tagName:'BUTTON',className:attribute==='safeguard'?'a1-route-barrier':'',dataset:{[attribute.replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]:value},hasAttribute:name=>name===attr,
  closest(selector){return matchesSelector(this,selector)?this:matchesSelector(element(container),selector)?element(container):null}};
};
const click=(container,attribute,value='')=>elements.get(container).listeners.click({target:targetFor(container,attribute,value)});
const keydown=(container,key,attribute='',value='')=>{
 const target=targetFor(container,attribute,value);
 const event={target,key,preventDefault(){},metaKey:false,ctrlKey:false,altKey:false};
 elements.get(container)?.listeners.keydown?.(event);
 documentListeners.keydown?.(event);
};
const map=()=>elements.get('#map-nodes').innerHTML;
const rail=()=>elements.get('#incident-rail').innerHTML;
const cloud=()=>elements.get('created-section').innerHTML;
const panel=()=>elements.get('#barrier-panel').innerHTML;
const escaped=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const models=Object.values(context.window.AuspexSTPAModels);
let count=0;
function singleCase(config) {
 assert.equal((map().match(/id="a1-overlay"/g)||[]).length,1,'One incident card');
 assert(map().includes(`data-overlay-target="${config.target}"`));
 assert(map().includes(`data-overlay-anchor="${config.anchor}"`));
 assert(!map().includes('a1-tentative-overlay'));
 assert(!map().includes('Analyst question.'));
 assert(map().includes('<strong>Caveat /</strong>'));
 assert(!map().includes('Evidence limits /'));
 assert(!map().includes('Barrier modes ↗'));
 assert(map().includes('<strong>Barriers ↗</strong><small>'));
}
for(const m of models) {
 url=`file:///fixture/auspex/index.html?p=${m.displayId}`;
 test.readLocation();
 assert.equal(test.state.incident,'');
 assert.equal(test.state.overlay,false);
 assert.equal((rail().match(/data-case=/g)||[]).length,2,'Both dated incidents are always available');
 assert(!rail().includes('data-tentative-overlay') && !rail().includes('data-enable-overlay'));
 assert(cloud().includes('a1-cloud-atmosphere'));
 assert(!cloud().includes('<button') && !cloud().includes('<details'));
 assert(!map().includes('id="a1-overlay"'));
 const configs=Object.entries(m.presentation.overlays);
 for(const [incident,config] of configs) {
  const a=context.window.AuspexData.assessments.find(a=>a.pathway===m.pathway&&a.incident===incident);
  click('#incident-rail','case',a.id);
  assert.equal(test.state.target,config.anchor);
  assert.equal(test.state.incident,incident);
  assert.equal(test.state.exploration,false);
  assert(map().includes('id="a1-question-detail" hidden'));
  assert(map().includes(config.tentative.question));
  singleCase(config);
  click('#pathway-map','explore-connection');
  assert.equal(test.state.target,config.tentative.target);
  assert.equal(test.state.exploration,true);
  assert(/id="a1-question-detail"(?! hidden)/.test(map()));
  assert(map().includes(config.tentative.unresolved));
  assert(map().includes('has-question'));
  singleCase(config);
  const openURL=url;
  assert.equal(new URL(url).searchParams.get('explore'),'1');
  assert(!new URL(url).searchParams.has('overlay'));
  test.readLocation();assert.equal(url,openURL);assert.equal(test.state.exploration,true);
  const b=stpa.barriers(a)[0];
  if(b) {
   click('#pathway-map','overlay-barrier',b.id);
   assert.equal(test.state.inspect,true);
   assert.equal(test.state.target,b.target===config.target?config.anchor:b.target);
   assert.equal(test.state.exploration,true);
   assert(!elements.get('#workspace').hidden);
   assert(elements.get('#barrier-panel').innerHTML.includes(b.title));
   assert(panel().includes(escaped(b.strongerAI || b.durability || b.failure)));
   assert(panel().includes('a1-barrier-card') && panel().includes('stpa-barrier-glyph'));
   assert(!panel().includes('question-lenses'));
   const reference=`#a1-overlay-barrier-${b.id}`;
   assert(panel().includes(`href="${reference}"`) && panel().includes('<em>Ibid.</em>'));
   assert(map().includes(`id="${reference.slice(1)}"`),'A repeated incident name points to the visible original');
   singleCase(config);
  }
  click('#pathway-map','explore-connection');
  assert.equal(test.state.exploration,false);
  assert.equal(test.state.target,config.anchor);
  singleCase(config);
  click('#pathway-map','clear-incident');
  assert.equal(test.state.incident,'');assert.equal(test.state.barrier,'');
  assert.equal(test.state.exploration,false);assert.equal(test.state.inspect,false);
  assert(!map().includes('id="a1-overlay"'));
  click('#incident-rail','case',a.id);click('#incident-rail','case',a.id);
  assert.equal(test.state.incident,'','Selecting the active case clears it');
  count++;
 }
 const [first,second]=configs.map(([incident,config])=>({config,a:context.window.AuspexData.assessments.find(a=>a.pathway===m.pathway&&a.incident===incident)}));
 click('#incident-rail','case',first.a.id);click('#pathway-map','explore-connection');
 click('#incident-rail','case',second.a.id);
 assert.equal(test.state.incident,second.a.incident);assert.equal(test.state.exploration,false);singleCase(second.config);
}
for(const params of ['p=A.1&overlay=1','p=A-1&overlay=maybe','p=A-1&i=invalid&explore=1','p=A-1&ctx=0']) {
 url='file:///fixture/auspex/index.html?'+params;test.readLocation();
 assert.equal(test.state.incident,'');assert.equal(test.state.exploration,false);
 assert(!new URL(url).searchParams.has('overlay'));assert(!new URL(url).searchParams.has('ctx'));
}
url='file:///fixture/auspex/index.html?p=A.1&overlay=maybe&i=AFK-2024';test.readLocation();
assert.equal(test.state.exploration,true);assert.equal(new URL(url).searchParams.get('explore'),'1');singleCase(stpa.model.presentation.overlays['AFK-2024']);
for(const p of context.window.AuspexData.pathways.filter(p=>!stpa.has(p.id))) {
 url='file:///fixture/auspex/index.html?p='+p.displayId+'&i=AFK-2024&explore=1';test.readLocation();
 assert.equal(test.state.incident,'');assert.equal(test.state.exploration,false);
 assert.equal(elements.get('#app').dataset.blank,'true');assert.equal(map(),'');assert(elements.get('created-section').hidden);
}
test.selectPathway(models[0].pathway);
assert.equal(elements.get('#app').dataset.blank,'false');assert(cloud().includes('a1-cloud-title') && cloud().includes('Context'));

let proposedCount=0;
const questionNames=['mechanism','evidence','durability','failure'];
const assertProposed=(route,incident='')=>{
 assert.equal(test.state.safeguard,route.id,'The route identifies the proposed barrier');
 assert.equal(test.state.inspect,true,'A proposed barrier can open independently');
 assert.equal(test.state.incident,incident,'Inspection does not select or change an incident');
 assert(!elements.get('#workspace').hidden,'The inspector is visible');
 assert(panel().includes(`data-proposed-barrier="${escaped(route.id)}"`));
 assert(panel().includes('Proposed') && panel().includes('Unassessed'));
 assert(panel().includes('Would this hold against more capable AI?'));
 assert(!panel().includes('question-lenses') && !panel().includes('role="tablist"'));
 assert.equal((panel().match(/data-constraint=/g)||[]).length,route.controls.length);
 assert.equal((panel().match(/class="a1-barrier-card-heading"/g)||[]).length,route.controls.length);
 assert(panel().includes('stpa-barrier-glyph is-unknown'));
 assert.equal(new URL(url).searchParams.get('s'),route.id);
 assert.equal(new URL(url).searchParams.get('inspect'),'1');
 assert(!new URL(url).searchParams.has('b'),'An incident barrier is not selected at the same time');
};
const assertClosed=route=>{
 assert.equal(test.state.safeguard,'');assert.equal(test.state.inspect,false);
 assert(elements.get('#workspace').hidden);
 for(const name of ['s','q','inspect'])assert(!new URL(url).searchParams.has(name),`${name} clears on close`);
 assert.equal(focused,`#pathway-map [data-safeguard="${route.id}"]`,'Focus returns to the route barrier');
};
for(const m of models) {
 url=`file:///fixture/auspex/index.html?p=${m.displayId}`;test.readLocation();
 const proposals=stpa.proposedBarriers();
 assert.equal(proposals.length,m.links.length,'Each modeled route has an inspectable proposal');
 for(const route of proposals) {
  assert.equal(stpa.proposedBarrier(route.id).id,route.id);
  click('#pathway-map','safeguard',route.id);assertProposed(route);
  assert.equal(test.state.question,0);
  assert(!map().includes('id="a1-overlay"'),'No incident is required');
  const mechanismURL=url;
  for(const c of route.controls) {
   assert(panel().includes(escaped(c.text)),`Mechanism includes ${m.displayId} ${c.id}`);
   for(const owner of c.owners) assert(panel().includes(escaped(m.controllers.find(x=>x.id===owner).title)),`Accountability includes ${owner}`);
  }
  for(const c of route.controls) {
   assert(panel().includes(escaped(c.limit)),`Brittleness includes ${c.id}`);
   assert(panel().includes(escaped(c.test)),`Supporting detail retains the proposed test for ${c.id}`);
  }
  if(m.controlEvidence) {
   const linked=route.controls.some(c=>c.id===m.controlEvidence.constraint);
   assert.equal(panel().includes(escaped(m.controlEvidence.text)),linked,'Research evidence appears only on its explicitly linked constraint');
  }
  for(let q=0;q<4;q++) {
   const legacy=new URL(mechanismURL);legacy.searchParams.set('q',questionNames[q]);url=legacy.href;test.readLocation();
   assertProposed(route);assert.equal(test.state.question,0);assert(!new URL(url).searchParams.has('q'),'Old lens links normalize to the single reading');
  }
  url=mechanismURL;windowListeners.popstate();assertProposed(route);assert.equal(test.state.question,0);
  click('#barrier-panel','close-inspector');assertClosed(route);
  click('#pathway-map','safeguard',route.id);keydown('#barrier-panel','Escape');assertClosed(route);
  proposedCount++;
 }
 const route=proposals[0];
 const configs=Object.entries(m.presentation.overlays).map(([incident,config])=>({config,a:context.window.AuspexData.assessments.find(a=>a.pathway===m.pathway&&a.incident===incident)}));
 for(const {a} of configs)for(const proposal of proposals) {
  const actual=Array.from(stpa.proposedBarrierView(proposal.id,a).matchAll(/data-related-barrier="([^"]+)"/g),([,id])=>id).sort();
  const expected=Array.from(stpa.barriers(a).filter(b=>proposal.controls.some(c=>c.id===b.constraint)),b=>b.id).sort();
  assert.deepEqual(actual,expected,'Incident evidence links only through an explicit constraint ID');
 }
 const [first,second]=configs;
 click('#incident-rail','case',first.a.id);click('#pathway-map','explore-connection');
 click('#pathway-map','safeguard',route.id);assertProposed(route,first.a.incident);singleCase(first.config);
 click('#pathway-map','clear-incident');assertProposed(route);assert(!map().includes('id="a1-overlay"'));
 click('#incident-rail','case',first.a.id);assertProposed(route,first.a.incident);
 click('#incident-rail','case',second.a.id);assertProposed(route,second.a.incident);
 assert.equal(test.state.exploration,false);singleCase(second.config);
 const related=stpa.barriers(second.a).find(b=>route.controls.some(c=>c.id===b.constraint));
 if(related) {
  click('#barrier-panel','related-barrier',related.id);
  assert.equal(test.state.safeguard,'');assert.equal(test.state.barrier,related.id);assert.equal(test.state.inspect,true);
  assert(panel().includes(escaped(related.title)));
  click('#pathway-map','safeguard',route.id);assertProposed(route,second.a.incident);
 }
 const b=stpa.barriers(second.a)[0];
 if(b) {
  click('#pathway-map','overlay-barrier',b.id);
  assert.equal(test.state.safeguard,'');assert.equal(test.state.barrier,b.id);assert.equal(test.state.inspect,true);
  assert(!new URL(url).searchParams.has('s'));assert(panel().includes(escaped(b.title)));
 }
 click('#pathway-map','safeguard',route.id);click('#incident-rail','case',second.a.id);assertProposed(route);
 test.selectIncident(first.a.id);assert.equal(test.state.safeguard,'');assert.equal(test.state.inspect,false);
 click('#incident-rail','case',second.a.id);assert.equal(test.state.safeguard,'');assert.equal(test.state.inspect,false);
 click('#pathway-map','safeguard',route.id);
 const other=models.find(x=>x.pathway!==m.pathway);
 test.selectPathway(other.pathway);assert.equal(test.state.safeguard,'');assert.equal(test.state.inspect,false);
 test.selectPathway(m.pathway);click('#pathway-map','safeguard',route.id);
 test.showOverview();assert.equal(test.state.pathway,'');assert.equal(test.state.safeguard,'');assert.equal(test.state.inspect,false);
 // A route from another pathway, an unknown route, and a constraint ID are not interchangeable.
 for(const invalid of [other.links[0].id,'missing-route','SC1']) {
  const params=new URLSearchParams({p:m.displayId,s:invalid,q:'failure',inspect:'1'});
  url='file:///fixture/auspex/index.html?'+params;test.readLocation();
  assert.equal(test.state.safeguard,'');assert.equal(test.state.inspect,false);
  assert(!new URL(url).searchParams.has('s'));assert(elements.get('#workspace').hidden);
 }
}
for(const p of context.window.AuspexData.pathways.filter(p=>!stpa.has(p.id))) {
 const params=new URLSearchParams({p:p.displayId,s:models[0].links[0].id,inspect:'1'});
 url='file:///fixture/auspex/index.html?'+params;test.readLocation();
 assert.equal(test.state.safeguard,'');assert.equal(test.state.inspect,false);
 assert(!new URL(url).searchParams.has('s'));assert.equal(map(),'');
}
assert.equal(proposedCount,42);

// Feed authored rectangles to draw() to test geometry/button correspondence.
// This does not measure, render, reconstruct, or screenshot the actual page.
const originalQuery=document.querySelector,originalAll=document.querySelectorAll;
const activeDescriptor=Object.getOwnPropertyDescriptor(document,'activeElement');
const decoded=text=>text.replace(/&(amp|lt|gt|quot|#39);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[x]));
let drawnRoutes=0;
for(const mobile of [false,true])for(const m of models) {
 geometryMobile=mobile;stpa.use(m.pathway);
 let active=true,restored='';
 const selected=m.links[0].id;
 const origin={left:37,top:61,width:mobile?520:1400,height:1700};
 const box=(left,top,width,height)=>({left:left+origin.left,top:top+origin.top,right:left+origin.left+width,bottom:top+origin.top+height,width,height});
 const counts={before:0,centre:0,after:0,recovery:0};
 const cells=[],nodes=[];
 let ordinal=0;
 for(const n of m.nodes) {
  const wing=n.type==='recovery'?'recovery':n.wing;
  const col=['before','centre','after','recovery'].indexOf(wing),row=counts[wing]++;
  const rect=box(mobile?120:55+col*335,mobile?100+ordinal++*145:100+row*160,220,70);
  const cell={getBoundingClientRect:()=>({...rect,bottom:rect.bottom+30,height:100})};
  const region={dataset:{wing}};
  const button={dataset:{node:n.id},getBoundingClientRect:()=>rect,closest:selector=>selector==='.a1-cell'?cell:selector==='.a1-region'?region:null};
  cells.push(cell);nodes.push(button);
 }
 const svg={innerHTML:'',setAttribute(){}};
 const controls={innerHTML:'',querySelectorAll(){return Array.from(this.innerHTML.matchAll(/<button\b[^>]*data-safeguard="([^"]+)"/g),([,id])=>({dataset:{safeguard:decoded(id)},focus(){restored=decoded(id)}}))}};
 const mapElement={offsetWidth:origin.width,dataset:{selectedSafeguard:selected},classList:{contains:()=>active},getBoundingClientRect:()=>origin};
 const routeElement={getBoundingClientRect:()=>box(0,30,origin.width,origin.height-30),querySelectorAll:()=>cells};
 const fakeFocused={dataset:{safeguard:selected},closest(selector){return selector==='.a1-route-barrier'?this:null}};
 document.querySelector=selector=>({'#pathway-map':mapElement,'#map-connections':svg,'#a1-route':routeElement,'#stpa-barrier-controls':controls}[selector]||null);
 document.querySelectorAll=selector=>selector==='#a1-route [data-node]'?nodes:[];
 Object.defineProperty(document,'activeElement',{configurable:true,get:()=>fakeFocused});
 stpa.draw();
 const buttons=Array.from(controls.innerHTML.matchAll(/<button\b([^>]*)>/g),([,attributes])=>{
  const value=name=>attributes.match(new RegExp(`${name}="([^"]*)"`))?.[1];
  const center=value('style')?.match(/left:([-\d.]+)px;top:([-\d.]+)px/);
  assert(center,'An inspectable barrier has finite map-relative coordinates');
  assert.equal(value('aria-controls'),'barrier-panel');
  assert(value('aria-label')?.startsWith('Inspect proposed barrier from '));
  return {id:decoded(value('data-safeguard')),x:Number(center[1]),y:Number(center[2]),pressed:value('aria-pressed')};
 });
 assert.equal(buttons.length,m.links.length,`${m.displayId}: every synthetic route produces one button`);
 assert.equal(new Set(buttons.map(b=>b.id)).size,buttons.length);
 assert.equal(buttons.filter(b=>b.pressed==='true').length,1);
 assert.equal(buttons.find(b=>b.pressed==='true').id,selected);
 for(const part of svg.innerHTML.split('<g class="stpa-edge').slice(1)) {
  const id=decoded(part.match(/data-link="([^"]+)"/)[1]);
  const path=part.match(/class="a1-barrier-stem" d="([^"]+)"/)?.[1];
  assert(path,`${id} has a visible stem`);
  const coordinates=path.match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.equal(coordinates.length,4);
  const button=buttons.find(b=>b.id===id);assert(button);
  assert(Math.abs(button.x-(coordinates[0]+coordinates[2])/2)<.11,`${id} button x matches its mark`);
  assert(Math.abs(button.y-(coordinates[1]+coordinates[3])/2)<.11,`${id} button y matches its mark`);
 }
 assert.equal(restored,selected,'Redrawing preserves focus on a proposed-barrier control');
 active=false;stpa.draw();assert.equal(controls.innerHTML,'','Inactive maps clear their old hit targets');
 drawnRoutes+=buttons.length;
}
document.querySelector=originalQuery;document.querySelectorAll=originalAll;
Object.defineProperty(document,'activeElement',activeDescriptor);geometryMobile=false;
assert.equal(drawnRoutes,84);
console.log(`Passed all ${count} incident flows and ${proposedCount} proposed-route inspections across seven models, single readings and legacy lens links, URL round-trips and history, keyboard access and Escape, focus restoration, independent case switching/clearing, legacy links, cloud context, and all 30 blank cases. Isolated draw checks also match all ${drawnRoutes} desktop/mobile barrier marks to their controls. Authored geometry and source/logic checks only; browser behavior and actual layout are not exercised.`);

// Repeated safeguards refer to a stable occurrence within the current case.
let repeatCount=0;
for (const m of models) {
 url='file:///fixture/auspex/index.html?p='+m.displayId;test.readLocation();
 const routes=stpa.proposedBarriers(),first=new Map();
 const incident=Object.keys(m.presentation.overlays)[0];
 const assessment=context.window.AuspexData.assessments.find(a=>a.pathway===m.pathway && a.incident===incident);
 click('#incident-rail','case',assessment.id);
 for (const route of routes) for (const c of route.controls) {
  if (!first.has(c.id)) {first.set(c.id,route);continue;}
  click('#pathway-map','safeguard',route.id);
  const before=url,original=first.get(c.id);
  const heading=panel().match(new RegExp(`<h4 id="a1-proposed-${c.id}"[^>]*>(.*?)</h4>`))[1];
  assert(heading.includes('<em>Ibid.</em>'));
  assert(heading.includes(`title="${escaped(c.title)}"`),'The full name remains available');
  const href=heading.match(/href="([^"]+)"/)[1].replaceAll('&amp;','&');
  const target=targetFor('#barrier-panel','safeguard-reference',original.id);
  Object.assign(target,{tagName:'A',className:'a1-ibid'});target.dataset.controlReference=c.id;
  let prevented=false;
  elements.get('#barrier-panel').listeners.click({target,preventDefault(){prevented=true},ctrlKey:true});
  assert(!prevented && url===before,'Modified clicks keep ordinary link behavior');
  elements.get('#barrier-panel').listeners.click({target,preventDefault(){prevented=true}});
  assert(prevented);assertProposed(original,incident);
  assert.equal(focused,`#a1-proposed-${c.id}`,'The reference reveals the named original');
  assert(panel().includes(`>${escaped(c.title)}</h4>`));
  url=before;windowListeners.popstate();assertProposed(route,incident);
  url=new URL(href,url).href;test.readLocation();assertProposed(original,incident);
  url=before;test.readLocation();assertProposed(route,incident);
  repeatCount++;
 }
}
assert(repeatCount>0);
console.log(`Validated ${repeatCount} Ibid. references across seven cases, including direct links, focus, history, and preserved incident selection.`);
