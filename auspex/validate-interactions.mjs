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

// Follow the actual guide handlers while keeping the chosen pathway intact.
const guideClick=(attribute,value,container='#method-reading')=>{
 const target=targetFor(container,attribute,value);
 target.isConnected=true;target.focus=()=>{focused=container+'|'+attribute+'|'+value;};
 documentListeners.click({target});
 return target;
};
for(const m of models) {
 url=`file:///fixture/auspex/index.html?p=${m.displayId}`;test.readLocation();
 const before=url;
 guideClick('map-guide','paths','#pathway-map');
 assert(elements.get('#method-dialog').open);
 assert(elements.get('#method-reading').innerHTML.includes('aria-controls="a1-guide-content">Paths</button>'));
 guideClick('map-guide','barriers');
 for(const state of context.window.AuspexBarrierStateData.states) {
  guideClick('explore-state',state.id);
  const reading=elements.get('#method-reading').innerHTML;
  assert(reading.includes(`data-explore-state="${state.id}" aria-pressed="true"`));
  assert.equal((reading.match(/class="a1-map-overview"/g)||[]).length,1);
  assert.equal((reading.match(/class="a1-method-guide"/g)||[]).length,1);
  assert(reading.includes('Incidents on the map') && !reading.includes('Haruspex'));
  assert.equal(focused,`[data-explore-state="${state.id}"]`);
 }
 guideClick('map-guide','paths');
 assert(elements.get('#method-reading').innerHTML.includes('data-map-guide="paths" aria-pressed="true"'));
 assert(!elements.get('#method-reading').innerHTML.includes('data-explore-state='));
 elements.get('#close-method').listeners.click();
 elements.get('#method-dialog').listeners.close();
 assert(!elements.get('#method-dialog').open);
 assert.equal(focused,'#pathway-map|map-guide|paths','Closing the guide returns to its original map key');
 assert.equal(url,before,'Guide navigation does not change the selected pathway');
}

let proposedCount=0;
const questionNames=['mechanism','evidence','durability','failure'];
const clickProposal=(route,c=route.controls[0])=>{const target=targetFor('#pathway-map','safeguard',route.id);target.dataset.constraint=c.id;elements.get('#pathway-map').listeners.click({target});};
const assertProposed=(route,incident='',c=route.controls[0])=>{
 assert.equal(test.state.safeguard,route.id,'The route identifies the proposed barrier');
 assert.equal(test.state.inspect,true,'A proposed barrier can open independently');
 assert.equal(test.state.incident,incident,'Inspection does not select or change an incident');
 assert(!elements.get('#workspace').hidden,'The inspector is visible');
 assert(panel().includes(`data-proposed-barrier="${escaped(route.id)}"`));
 assert(panel().includes('Proposed') && panel().includes('Unassessed'));
 assert(panel().includes(test.state.strengthen?'How could this barrier be stronger?':'Would this hold against more capable AI?'));
 assert(!panel().includes('question-lenses') && !panel().includes('role="tablist"'));
 assert.equal((panel().match(/data-constraint=/g)||[]).length,1);
 assert.equal((panel().match(/class="a1-barrier-card-heading"/g)||[]).length,1);
 assert(panel().includes('stpa-barrier-glyph is-unknown'));
 assert.equal(test.state.constraint,c.id);
 assert(panel().includes(`data-constraint="${c.id}"`) && panel().includes(escaped(c.title)));
 assert(!panel().includes('Ibid.'));
 assert.equal(new URL(url).searchParams.get('c'),c.id);
 assert.equal(new URL(url).searchParams.get('s'),route.id);
 assert.equal(new URL(url).searchParams.get('inspect'),'1');
 assert(!new URL(url).searchParams.has('b'),'An incident barrier is not selected at the same time');
};
const assertClosed=(route,c=route.controls[0])=>{
 assert.equal(test.state.safeguard,'');assert.equal(test.state.inspect,false);
 assert(elements.get('#workspace').hidden);
 assert.equal(test.state.strengthen,false);
 for(const name of ['s','c','q','inspect','strengthen'])assert(!new URL(url).searchParams.has(name),`${name} clears on close`);
 assert.equal(focused,`#pathway-map [data-safeguard="${route.id}"][data-constraint="${c.id}"]`,'Focus returns to the route barrier');
};
for(const m of models) {
 url=`file:///fixture/auspex/index.html?p=${m.displayId}`;test.readLocation();
 const proposals=stpa.proposedBarriers();
 assert.equal(proposals.length,m.links.length,'Each modeled route has an inspectable proposal');
 for(const route of proposals) for(const c of route.controls) {
  clickProposal(route,c);assertProposed(route,'',c);
  assert.equal(test.state.question,0);
  assert(!map().includes('id="a1-overlay"'));
  assert(map().includes('<strong>Explanation:</strong>'));
  const selectedURL=url;
  assert(panel().includes(escaped(c.text)) && panel().includes(escaped(c.limit)));
  assert(!panel().includes('<details') && !panel().includes('No assessment of this safeguard'));
  assert(panel().includes('Strengthen this barrier'));
  const assessmentHTML=panel(), originalModels=JSON.stringify(context.window.AuspexSTPAModels);
  const originalMap=map();
  click('#barrier-panel','strengthen','1');assertProposed(route,'',c);
  assert.equal(test.state.strengthen,true);assert.equal(new URL(url).searchParams.get('strengthen'),'1');
  assert(panel().includes(escaped(c.improvement.title)) && panel().includes(escaped(c.improvement.proposal)));
  assert(panel().includes(escaped(c.improvement.test)) && panel().includes(escaped(c.improvement.remaining)));
  assert(!panel().includes('Basis and further work') && !panel().includes('<details'));
  assert.equal(focused,'#barrier-panel [data-strengthen]','Focus follows the replaced action');
  for(const owner of c.owners) {
   const controller=m.controllers.find(x=>x.id===owner);
   assert(panel().includes(escaped(controller.title)));
   assert(!panel().includes(escaped(controller.responsibility)),'The proposal names the responsible owner without repeating their full role');
  }
  const sourcePart=html=>html.split('<div class="a1-barrier-evidence">')[1] || '';
  assert.equal(sourcePart(panel()),sourcePart(assessmentHTML),'Real evidence remains available in both views');
  assert.equal(map(),originalMap,'Trying a proposal does not recolor or change the pathway');
  assert.equal(JSON.stringify(context.window.AuspexSTPAModels),originalModels,'Trying a proposal never changes source data');
  const proposalURL=url;
  test.readLocation();assertProposed(route,'',c);assert.equal(test.state.strengthen,true);assert.equal(url,proposalURL);
  url=selectedURL;windowListeners.popstate();assert.equal(test.state.strengthen,false);assert.equal(panel(),assessmentHTML);
  url=proposalURL;windowListeners.popstate();assert.equal(test.state.strengthen,true);
  click('#barrier-panel','strengthen','0');assert.equal(test.state.strengthen,false);assert.equal(url,selectedURL);assert.equal(panel(),assessmentHTML);
  click('#barrier-panel','strengthen','1');click('#barrier-panel','close-inspector');assertClosed(route,c);
  clickProposal(route,c);assert.equal(test.state.strengthen,false,'Reopening starts with the actual assessment');
  for(const other of route.controls.filter(x=>x.id!==c.id)) assert(!panel().includes(`data-constraint="${other.id}"`),'Only the clicked barrier opens');
  if(m.controlEvidence) assert.equal(panel().includes(escaped(m.controlEvidence.text)),c.id===m.controlEvidence.constraint);
  for(const q of questionNames) {
   const legacy=new URL(selectedURL);legacy.searchParams.set('q',q);url=legacy.href;test.readLocation();
   assertProposed(route,'',c);assert.equal(test.state.question,0);assert(!new URL(url).searchParams.has('q'));
  }
  url=selectedURL;windowListeners.popstate();assertProposed(route,'',c);
  click('#barrier-panel','close-inspector');assertClosed(route,c);
  clickProposal(route,c);keydown('#barrier-panel','Escape');assertClosed(route,c);
  // An older route-only link still opens a real, named barrier.
  const old=new URL(selectedURL);old.searchParams.delete('c');url=old.href;test.readLocation();assertProposed(route);
  proposedCount++;
 }
 const multi=proposals.find(route=>route.controls.length>1);
 if(multi) {
  clickProposal(multi,multi.controls[0]);click('#barrier-panel','strengthen','1');
  clickProposal(multi,multi.controls[1]);assert.equal(test.state.strengthen,false);
 }
 const route=proposals[0];
 const configs=Object.entries(m.presentation.overlays).map(([incident,config])=>({config,a:context.window.AuspexData.assessments.find(a=>a.pathway===m.pathway&&a.incident===incident)}));
 for(const {a} of configs)for(const proposal of proposals)for(const c of proposal.controls) {
  const actual=Array.from(stpa.proposedBarrierView(proposal.id,a,()=>'',c.id).matchAll(/data-related-barrier="([^"]+)"/g),([,id])=>id).sort();
  const expected=Array.from(stpa.barriers(a).filter(b=>c.id===b.constraint),b=>b.id).sort();
  assert.deepEqual(actual,expected,'Incident evidence links only through an explicit constraint ID');
 }
 const [first,second]=configs;
 click('#incident-rail','case',first.a.id);click('#pathway-map','explore-connection');
 click('#pathway-map','safeguard',route.id);assertProposed(route,first.a.incident);singleCase(first.config);
 click('#barrier-panel','strengthen','1');
 click('#pathway-map','clear-incident');assertProposed(route);assert.equal(test.state.strengthen,true);assert(!map().includes('id="a1-overlay"'));
 click('#incident-rail','case',first.a.id);assertProposed(route,first.a.incident);
 click('#incident-rail','case',second.a.id);assertProposed(route,second.a.incident);assert.equal(test.state.strengthen,true);
 assert.equal(test.state.exploration,false);singleCase(second.config);
 const related=stpa.barriers(second.a).find(b=>route.controls[0].id===b.constraint);
 if(related) {
  click('#barrier-panel','related-barrier',related.id);
  assert.equal(test.state.safeguard,'');assert.equal(test.state.barrier,related.id);assert.equal(test.state.inspect,true);assert.equal(test.state.strengthen,false);
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
assert.equal(proposedCount,68);

// Every incident assessment retains its state, its evidence, and its identity when exploring a change.
let incidentImprovements=0;
for(const m of models) {
 for(const incident of Object.keys(m.presentation.overlays)) {
  url=`file:///fixture/auspex/index.html?p=${m.displayId}&i=${incident}`;test.readLocation();
  const a=context.window.AuspexData.assessments.find(a=>a.pathway===m.pathway && a.incident===incident);
  for(const b of stpa.barriers(a)) {
   click('#pathway-map','overlay-barrier',b.id);
   const initial=panel(), initialURL=url, modelBefore=JSON.stringify(m), mapBefore=map();
   const stateHeader=html=>html.match(/<header class="a1-barrier-card-heading">[\s\S]*?<\/header>/)[0];
   assert(initial.includes('Strengthen this barrier') && !initial.includes('<details'));
   click('#barrier-panel','strengthen','1');
   assert.equal(test.state.strengthen,true);assert.equal(stateHeader(panel()),stateHeader(initial));
   assert.equal(map(),mapBefore);assert.equal(JSON.stringify(m),modelBefore);
   const change=b.candidate?m.constraints.find(c=>c.id===b.constraint).improvement:b.reinforcement;
   assert(panel().includes(escaped(change.proposal)) && panel().includes(escaped(change.test)));
   assert(panel().includes(escaped(b.efficacy)),'Incident evidence is visible while developing a proposal');
   assert.equal((panel().match(/class="a1-barrier-card-heading"/g)||[]).length,1,'A proposal is not presented as a second assessed barrier');
   const changedURL=url;test.readLocation();assert.equal(test.state.strengthen,true);assert.equal(url,changedURL);
   click('#barrier-panel','strengthen','0');assert.equal(panel(),initial);assert.equal(url,initialURL);
   click('#barrier-panel','strengthen','1');keydown('#barrier-panel','Escape');assert.equal(test.state.strengthen,false);assert.equal(test.state.inspect,false);
   assert(!new URL(url).searchParams.has('strengthen'));
   incidentImprovements++;
  }
 }
}
assert.equal(incidentImprovements,19);
for(const params of ['p=A-2&strengthen=1','p=A-1&strengthen=1','p=A-1&s=missing&strengthen=1']) {
 url='file:///fixture/auspex/index.html?'+params;test.readLocation();
 assert.equal(test.state.strengthen,false);assert(!new URL(url).searchParams.has('strengthen'));
}


// Feed authored rectangles to draw() to test geometry/button correspondence.
// This does not measure, render, reconstruct, or screenshot the actual page.
const originalQuery=document.querySelector,originalAll=document.querySelectorAll;
const activeDescriptor=Object.getOwnPropertyDescriptor(document,'activeElement');
const decoded=text=>text.replace(/&(amp|lt|gt|quot|#39);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[x]));
let drawnRoutes=0,connectedArrows=0,dashedArrows=0;
for(const mobile of [false,true])for(const m of models) {
 geometryMobile=mobile;stpa.use(m.pathway);
 let active=true,restored='';
 const selected=m.links[0].id,selectedConstraint=m.links[0].constraints[0];
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
 const controls={innerHTML:'',querySelectorAll(){return Array.from(this.innerHTML.matchAll(/<button\b[^>]*data-safeguard="([^"]+)" data-constraint="([^"]+)"/g),([,id,c])=>({dataset:{safeguard:decoded(id),constraint:c},focus(){restored=decoded(id)+'|'+c}}))}};
 const mapElement={offsetWidth:origin.width,dataset:{selectedSafeguard:selected,selectedConstraint},classList:{contains:()=>active},getBoundingClientRect:()=>origin};
 const routeElement={getBoundingClientRect:()=>box(0,30,origin.width,origin.height-30),querySelectorAll:()=>cells};
 const fakeFocused={dataset:{safeguard:selected,constraint:selectedConstraint},closest(selector){return selector==='.a1-route-barrier'?this:null}};
 document.querySelector=selector=>({'#pathway-map':mapElement,'#map-connections':svg,'#a1-route':routeElement,'#stpa-barrier-controls':controls}[selector]||null);
 document.querySelectorAll=selector=>selector==='#a1-route [data-node]'?nodes:[];
 Object.defineProperty(document,'activeElement',{configurable:true,get:()=>fakeFocused});
 stpa.draw();
 assert(svg.innerHTML.includes('id="stpa-arrow" viewBox="0 0 8 8" refX="6.5"'),'Forward marker anchors at its tip');
 assert(svg.innerHTML.includes('id="stpa-arrow-feedback" viewBox="0 0 12 8" refX="10"'),'Feedback marker anchors at its second tip');
 const buttons=Array.from(controls.innerHTML.matchAll(/<button\b([^>]*)>/g),([,attributes])=>{
  const value=name=>attributes.match(new RegExp(`${name}="([^"]*)"`))?.[1];
  const center=value('style')?.match(/left:([-\d.]+)px;top:([-\d.]+)px/);
  assert(center,'An inspectable barrier has finite map-relative coordinates');
  assert.equal(value('aria-controls'),'barrier-panel');
  assert(value('aria-label')?.startsWith('Inspect '));
  return {id:decoded(value('data-safeguard')),constraint:value('data-constraint'),x:Number(center[1]),y:Number(center[2]),pressed:value('aria-pressed')};
 });
 assert.equal(buttons.length,m.links.reduce((n,l)=>n+l.constraints.length,0),`${m.displayId}: every barrier gets one button`);
 assert.equal(new Set(buttons.map(b=>b.id+'|'+b.constraint)).size,buttons.length);
 assert.equal(buttons.filter(b=>b.pressed==='true').length,1);
 assert.equal(buttons.find(b=>b.pressed==='true').id,selected);
 for(const part of svg.innerHTML.split('<g class="stpa-edge').slice(1)) {
  const id=decoded(part.match(/data-link="([^"]+)"/)[1]);
  const link=m.links.find(l=>l.id===id);
  const destination=nodes.find(n=>n.dataset.node===link.to).getBoundingClientRect();
  const tipPath=part.match(/class="stpa-recovery-tip" d="([^"]+)"/);
  const linePaths=Array.from(part.matchAll(/<path class="stpa-connection[^"]*" d="([^"]+)"([^>]*)\/>/g));
  const coordinates=(tipPath?tipPath[1]:linePaths.at(-1)[1]).match(/-?\d+(?:\.\d+)?/g).map(Number);
  const tip=tipPath?coordinates.slice(2,4):coordinates.slice(-2);
  const boxEdges=[destination.left-origin.left,destination.right-origin.left];
  assert(boxEdges.some(x=>Math.abs(tip[0]-x)<.06),`${m.displayId} ${id}: arrow tip meets the destination box border`);
  assert(tip[1]>=destination.top-origin.top && tip[1]<=destination.bottom-origin.top,'Arrow meets the box within its side');
  if(link.kind==='optional') {
   const attributes=linePaths.at(-1)[2];
   const length=Number(attributes.match(/pathLength="([\d.]+)"/)?.[1]);
   const offset=Number(attributes.match(/stroke-dashoffset="([\d.]+)"/)?.[1]);
   assert(attributes.includes('marker-end="url(#stpa-arrow)"'));
   assert(Math.abs((length+offset)%12-7)<.0002,'The dashed route ends with ink touching the arrowhead');
   dashedArrows++;
  }
  connectedArrows++;
  if (!mobile && m.pathway==='X-01' && id==='X-01:2>X-01:4') {
   const pieces=Array.from(part.matchAll(/class="stpa-connection[^"]*" d="([^"]+)"/g),x=>x[1].match(/-?\d+(?:\.\d+)?/g).map(Number));
   const a=pieces[0].slice(0,2),b=pieces.at(-1).slice(-2),length=Math.hypot(b[0]-a[0],b[1]-a[1]);
   for(const piece of pieces)for(let i=0;i<piece.length;i+=2)assert(Math.abs((piece[i]-a[0])*(b[1]-a[1])-(piece[i+1]-a[1])*(b[0]-a[0]))/length<.2,'A-1 1.2 to 2.1 is straight through its barrier');
  }
  const routeButtons=buttons.filter(b=>b.id===id);
  const marks=Array.from(part.matchAll(/class="stpa-proposed-barrier(?: is-selected)?" data-constraint="([^"]+)"[^>]*><path class="a1-barrier-stem" d="([^"]+)"/g));
  assert.equal(marks.length,m.links.find(l=>l.id===id).constraints.length);
  for(const [,constraint,path] of marks) {
   const coordinates=path.match(/-?\d+(?:\.\d+)?/g).map(Number);
   const button=routeButtons.find(b=>b.constraint===constraint);assert(button);
   assert(Math.abs(button.x-(coordinates[0]+coordinates[2])/2)<.11);
   assert(Math.abs(button.y-(coordinates[1]+coordinates[3])/2)<.11);
  }
  for(let i=0;i<routeButtons.length;i++)for(let j=i+1;j<routeButtons.length;j++)assert(Math.hypot(routeButtons[i].x-routeButtons[j].x,routeButtons[i].y-routeButtons[j].y)>=29.8,'Individual targets do not overlap');
 }
 assert.equal(restored,selected+'|'+selectedConstraint,'Redrawing preserves focus on a proposed-barrier control');
 active=false;stpa.draw();assert.equal(controls.innerHTML,'','Inactive maps clear their old hit targets');
 drawnRoutes+=buttons.length;
}
document.querySelector=originalQuery;document.querySelectorAll=originalAll;
Object.defineProperty(document,'activeElement',activeDescriptor);geometryMobile=false;
assert.equal(drawnRoutes,136);
assert.equal(connectedArrows,models.reduce((n,m)=>n+m.links.length,0)*2);
assert.equal(dashedArrows,models.reduce((n,m)=>n+m.links.filter(l=>l.kind==='optional').length,0)*2);
console.log(`Passed all ${count} incident flows and ${proposedCount} individual barrier inspections across seven models, 35 tailored improvements and 19 incident improvement views, unchanged source states, legacy lens links, URL round-trips and history, keyboard access and Escape, focus restoration, independent case switching/clearing, legacy links, cloud context, and all 30 blank cases. Isolated draw checks also match all ${drawnRoutes} desktop/mobile barrier marks to their controls, all ${connectedArrows} arrows to destination borders, and all ${dashedArrows} dashed arrow endings. Authored geometry and source/logic checks only; browser behavior and actual layout are not exercised.`);
