(() => {
  'use strict';
  const data=window.XoscopeEvidence, catalogue=window.XoscopeCatalogue;
  const groups=window.AuspexFamilies.groups, families=groups.flatMap(g=>g.families);
  const stages=[['path','Pathway'],['evidence','Episode'],['components','Capabilities, tendencies & defenses'],['controls','Controls & durability'],['finding','Finding']];
  const params=()=>new URLSearchParams(location.search);
  const validX=id=>[...groups,...families,...data.scenarios,...data.scenarios.flatMap(p=>p.variants||[])].some(n=>n.id===id);
  // Keep established p= worked-example bookmarks on their existing reader.
  const initial=params();
  const active=!initial.has('p')||validX(initial.get('x'))||['view','case','component','event'].some(key=>initial.has(key));
  window.XoscopeMVP={active};
  if(!active)return;
  const $=id=>document.getElementById(id);
  const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const href=query=>{const p=new URLSearchParams();Object.entries(query).forEach(([k,v])=>{if(v)p.set(k,v);});return p.size?`?${p}`:'./';};
  const link=(label,query,cls='')=>`<a class="${cls}" href="${escape(href(query))}" data-mvp-link>${escape(label)}</a>`;
  const external=(label,url)=>`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`;
  const tag=(label,cls='')=>`<span class="m-tag ${cls}">${escape(label)}</span>`;
  const source=id=>data.sources.find(s=>s.id===id);
  const coverageLabels={'curated':'Curated example available','not-assessed':'Not yet assessed','no-match':'No suitable case in reviewed material'};
  const coverage=path=>tag(coverageLabels[path.coverage],path.coverage==='curated'?'m-positive':'');
  const familyOf=path=>families.find(f=>f.id===path.family);
  const groupOf=family=>groups.find(g=>g.families.some(f=>f.id===family.id));
  const mappedCases=path=>data.mappings.filter(m=>m.scenario===path.id);
  const sourceLinks=ids=>`<div class="m-source-links">${ids.map(id=>external(source(id).title,source(id).url)).join('')}</div>`;
  const eventLinks=ids=>ids.length?`<div class="m-evidence-links">${ids.map(id=>link(id,{event:id},'m-event-link')).join('')}</div>`:'<p class="m-muted">No supporting event mapped.</p>';
  const heading=(kicker,title,description='')=>{
    const level=[...params().keys()].some(key=>key!=='q')?'h1':'h2';
    return `<header class="m-page-head"><p class="m-kicker">${escape(kicker)}</p><${level} id="m-title" tabindex="-1">${escape(title)}</${level}>${description?`<p class="m-lead">${escape(description)}</p>`:''}</header>`;
  };
  const breadcrumbs=items=>`<nav class="m-breadcrumbs" aria-label="Location">${[link('Pathways',{}),...items.map(([label,query])=>link(label,query))].join('<span aria-hidden="true">/</span>')}</nav>`;
  const pathCrumbs=path=>{const f=familyOf(path),g=groupOf(f);return breadcrumbs([[g.title,{x:g.id}],[f.title,{x:f.id}],[path.title,{x:path.id}]]);};
  const searchField=(label,placeholder='Search titles, authors or addresses')=>`<div class="m-search"><label for="m-search">${escape(label)}</label><input id="m-search" type="search" value="${escape(params().get('q')||'')}" placeholder="${escape(placeholder)}" autocomplete="off"></div>`;
  const matches=(query,text)=>query.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\s+/).filter(Boolean).every(term=>text.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(term));
  const assessmentLink=(m,label='Explore this comparison',stage='path')=>link(label,{x:m.scenario,case:m.case,stage},'m-button');
  const scenarioList=(entries,q='')=>{
    const filtered=entries.filter(p=>matches(q,`${p.id} ${p.title} ${p.citation} ${familyOf(p).title} ${(p.variants||[]).map(v=>`${v.title} ${v.id}`).join(' ')}`));
    return `<p class="m-count" role="status">${filtered.length} scenario${filtered.length===1?'':'s'}${q?' found':''}</p><div class="m-scenario-list">${filtered.map(p=>`<article>${link(`${p.id} · ${p.title}`,{x:p.id})}<p>${escape(p.citation)}</p>${coverage(p)}</article>`).join('')||'<p class="m-empty">No matching scenarios. Try another title, author, family or address.</p>'}</div>`;
  };
  const familyCard=family=>`<article class="m-family" style="--family-color:var(--m-${family.id[0]})"><p class="m-kicker">${family.id} · ${family.count} scenario${family.count===1?'':'s'}</p><h3>${link(family.title,{x:family.id})}</h3><p>${escape(family.premise)}</p><p class="m-small">${data.mappings.filter(m=>data.scenarios.find(p=>p.id===m.scenario).family===family.id).length} curated comparison${family.id==='A-I'?'':'s'}</p></article>`;
  function home(){
    const q=params().get('q')||'';
    return heading('Explore the review','Choose a pathway','Three presentation groups, eight families, 95 document scenarios. Begin with a family, or search for a particular scenario.')+
      `<div class="m-stats">${tag('95 scenarios indexed')}${tag('1 curated comparison')}${tag('Draft assessments')}</div>`+searchField('Find a scenario')+
      (q?scenarioList(data.scenarios,q):groups.map(g=>`<section class="m-group"><h3>${link(`${g.id} · ${g.title}`,{x:g.id})}</h3><div class="m-family-grid">${g.families.map(familyCard).join('')}</div></section>`).join(''))+
      `<aside class="m-callout"><p class="m-kicker">First worked comparison</p><h3>Datacenter root access to takeover</h3><p>Follow the July 19 OpenAI episode through the full assessment. A partial precursor comparison, with explicit limits.</p>${assessmentLink(data.mappings[0])}</aside><p class="m-small">Corpus counts describe the literature reviewed. They are not probabilities, priorities, or counts of observed incidents.</p>`;
  }
  function familyPage(family){
    const group=groupOf(family);
    return breadcrumbs([[group.title,{x:group.id}]])+heading(family.id,family.title,family.premise)+
      `<details class="m-disclosure"><summary>Read the generalized family pathway</summary><ol class="m-chain">${family.chain.map(([title,text])=>`<li><h3>${escape(title)}</h3><p>${escape(text)}</p></li>`).join('')}</ol><p class="m-small">Family summary, distinct from the specific document scenarios below.</p></details>`+
      `<h3>Choose a document scenario</h3>`+searchField('Search this family')+scenarioList(data.scenarios.filter(p=>p.family===family.id),params().get('q')||'');
  }
  function chain(path,mapping){
    return `<ol class="m-chain">${path.chain.map((step,index)=>{
      const evidence=mapping?.steps.find(s=>s.step===step.id), comps=mapping?data.components.filter(c=>mapping.components.includes(c.id)&&c.steps.includes(step.id)):[];
      return `<li id="step-${escape(step.id)}"><div class="m-chain-heading"><span class="m-step-number" aria-hidden="true">${index+1}</span><h3>${escape(step.title)}</h3></div><p>${escape(step.text)}</p>${evidence?`<div class="m-overlay">${tag(evidence.status,evidence.events.length&&step.id==='access'?'m-positive':'')}<p>${escape(evidence.reading)}</p>${eventLinks(evidence.events)}${comps.length?`<p class="m-small">Inspect: ${comps.map(c=>link(c.title,{component:c.id})).join(' · ')}</p>`:''}</div>`:''}</li>`;
    }).join('')}</ol>`;
  }
  function scenarioPage(path,variant){
    const candidates=mappedCases(path),selected=params().get('case'),mapping=candidates.find(m=>m.case===selected);
    if(selected&&!mapping)return notFound('This episode has no curated mapping to the selected pathway.',link('Return to the pathway',{x:path.id}));
    let stage=params().get('stage')||'path';
    if(!stages.some(([id])=>id===stage))return notFound('That assessment step does not exist.',link('Open the comparison',{x:path.id,case:selected,stage:'path'}));
    let html=pathCrumbs(path)+heading(`${path.id} · ${path.citation}`,variant?`${path.title}: ${variant.title}`:path.title,path.summary||'This document scenario is indexed from the review. Its causal pathway and incident comparison have not yet been reconstructed here.');
    if(variant)html+=`<div class="m-note"><strong>Author-supplied variant: ${escape(variant.sourceLabel)}</strong><p>${escape(variant.text)}</p><p class="m-small">Applied below at ${variant.changes.map(id=>escape(path.chain.find(step=>step.id===id).title)).join(', ')}. The other steps remain shared.</p></div>`;
    if(mapping){
      const c=data.cases.find(c=>c.id===mapping.case);
      html+=`<div class="m-selected-case"><div><p class="m-kicker">Selected episode · ${escape(c.period)}</p>${link(c.title,{case:c.id})}<p>${escape(mapping.fit)} · ${escape(mapping.review)}</p></div>${link('Pathway without overlay',{x:path.id},'m-text-button')}</div>`;
      html+=`<nav class="m-workflow" aria-label="Assessment steps">${stages.map(([id,label],index)=>`<a data-mvp-link href="${escape(href({x:path.id,case:c.id,stage:id}))}"${stage===id?' aria-current="step"':''}><span>${index+1}</span>${escape(label)}</a>`).join('')}</nav>`;
      if(stage==='evidence')html+=caseEvidence(c,true);
      if(stage==='components')html+=`<section><h3>The intermediate layer</h3><p>Compare what the systems could do, how they behaved, and how the environment constrained or interrupted them. Each component keeps its evidence and its limits.</p><div class="m-component-grid">${data.components.filter(c=>mapping.components.includes(c.id)).map(componentCard).join('')}</div><div class="m-callout"><h3>Do the pathway’s premises hold?</h3><p>${escape(mapping.premiseCheck)}</p></div></section>`;
      if(stage==='controls')html+=`<section><h3>What limited escalation?</h3><p>${escape(mapping.stopping)}</p><div class="m-control-list">${data.controls.filter(c=>mapping.controls.includes(c.id)).map(controlCard).join('')}</div><p class="m-small">Improvement proposals and tests are analyst suggestions. No simulated counterfactual or successful test is implied.</p></section>`;
      if(stage==='finding')html+=finding(mapping);
    }
    if(!mapping||stage==='path'){
      if(path.chain){
        const displayedPath=variant?{...path,chain:path.chain.map(step=>variant.changes.includes(step.id)?{...step,text:variant.text}:step)}:path;
        html+=`<section><h3>Premises</h3><p>${escape(path.premise)}</p>${mapping?`<div class="m-note"><strong>Episode check</strong><p>${escape(mapping.premiseCheck)}</p></div>`:''}<h3>Causal pathway${mapping?' with the episode overlaid':''}</h3><p class="m-small">An editorial reconstruction of the source’s hypothetical argument. Numbering shows causal order, not measured progress toward catastrophe.</p>${chain(displayedPath,mapping)}<p class="m-outcome"><strong>Stated outcome.</strong> ${escape(path.outcome)}</p>${sourceLinks(path.sources)}</section>`;
        if(path.variants?.length)html+=`<section class="m-callout"><h3>Author-supplied variant</h3>${path.variants.map(v=>`${link(v.title,{x:v.id})}<p>${escape(v.text)}</p><p class="m-small">${escape(v.sourceLabel)} · changes ${escape(v.changes.join(', '))}; not an additional document scenario.</p>`).join('')}</section>`;
      }
      if(!mapping)html+=candidates.length?`<section class="m-callout"><p class="m-kicker">Curated example</p>${candidates.map(m=>{const c=data.cases.find(c=>c.id===m.case);return `<h3>${escape(c.title)}</h3><p>${escape(c.period)} · ${escape(m.fit)}</p>${assessmentLink(m,'Overlay this episode')}`;}).join('')}</section>`:
        `<section class="m-empty"><h3>${escape(coverageLabels[path.coverage])}</h3><p>${path.coverage==='no-match'?'No suitable case was identified within the documented search scope. This does not establish that no relevant incident exists.':'No curated incident comparison has been completed for this scenario. This does not mean the pathway is safe or that no relevant incident exists.'}</p>${link('Browse the incident library',{view:'library'})}</section>`;
    }
    if(mapping){const index=stages.findIndex(([id])=>id===stage);html+=`<nav class="m-next" aria-label="Continue assessment">${index?assessmentLink(mapping,`← ${stages[index-1][1]}`,stages[index-1][0]):'<span></span>'}${index<stages.length-1?assessmentLink(mapping,`${stages[index+1][1]} →`,stages[index+1][0]):link('Back to the incident library',{view:'library'},'m-button')}</nav>`;}
    return html;
  }
  function componentCard(c){return `<article class="m-component"><p class="m-kicker">${escape(c.kind)}</p><h3>${link(c.title,{component:c.id})}</h3><p>${escape(c.reading)}</p>${eventLinks(c.events)}<p class="m-small"><strong>Limit.</strong> ${escape(c.limitation)}</p></article>`;}
  function controlCard(c){return `<article class="m-control"><p class="m-kicker">${escape(c.kind)}</p><h3>${escape(c.title)}</h3>${tag(c.status)}<p>${escape(c.reading)}</p>${eventLinks(c.events)}<dl><dt>Responsible roles</dt><dd>${escape(c.owner)}</dd><dt>Required constraint</dt><dd>${escape(c.constraint)}</dd><dt>Against more capable AI</dt><dd>${escape(c.durability)}</dd></dl><details class="m-disclosure"><summary>Strengthen this control</summary><p>${escape(c.proposal)}</p><h4>How to test it</h4><p>${escape(c.test)}</p><p><strong>Remaining limitation.</strong> ${escape(c.residual)}</p>${tag('Proposal · not tested')}</details></article>`;}
  function eventCard(e){return `<article class="m-event"><div><p class="m-kicker">${escape(e.id)} · ${escape(e.event_date||'Date not established')}</p><h4>${link(e.title,{event:e.id})}</h4></div><p class="m-small">${escape(e.source_locator)}</p><p class="m-small">Reported in the cited account · source group ${escape(e.event_group_id)}</p></article>`;}
  function caseEvidence(c,embedded=false){
    return `<section>${embedded?`<h3>${escape(c.title)}</h3><p>${escape(c.summary)}</p>`:''}<div class="m-note"><strong>Episode boundary</strong><p>${escape(c.scope)}</p>${c.parent?link('See the wider OpenAI–Hugging Face case',{case:c.parent}):''}</div><h3>Selected source records</h3><p class="m-small">These entries come from one account, organized in Haruspex. Separate entries are not independent witnesses; episode timestamps do not date every component action precisely.</p><div class="m-event-list">${data.events.filter(e=>c.events?.includes(e.id)).map(eventCard).join('')}</div>${sourceLinks(c.sources)}</section>`;
  }
  function library(){
    const q=params().get('q')||'',kind=params().get('kind')||'all';
    const entries=data.cases.filter(c=>(kind==='all'||c.kind===kind)&&matches(q,`${c.title} ${c.period} ${c.summary} ${c.scope}`));
    return heading('Curated library','Incidents, episodes & evidence','Open the evidence independently of the pathway browser. One wider case and one bounded episode are currently curated.')+
      searchField('Search the library','Search a case, organization or date')+`<div class="m-filter"><label for="m-kind">Record type</label><select id="m-kind">${[['all','All records'],['case','Wider cases'],['episode','Bounded episodes']].map(([v,t])=>`<option value="${v}"${kind===v?' selected':''}>${t}</option>`).join('')}</select></div><p class="m-count" role="status">${entries.length} record${entries.length===1?'':'s'}</p><div class="m-library-grid">${entries.map(c=>`<article class="m-library-card"><p class="m-kicker">${c.kind==='case'?'Wider case':'Bounded episode'} · ${escape(c.period)}</p><h3>${link(c.title,{case:c.id})}</h3><p>${escape(c.summary)}</p>${c.parent?link('Part of the OpenAI–Hugging Face case',{case:c.parent}):tag('Context · not a pathway assignment')}<p class="m-small">${data.mappings.filter(m=>m.case===c.id).length} direct pathway mapping${c.kind==='case'?'s':''}</p></article>`).join('')||'<p class="m-empty">No matching records. Change the search or record type.</p>'}</div><aside class="m-note"><strong>Curated, not exhaustive</strong><p>Select a defensible example for each populated pathway. One episode may support several separately argued comparisons. This library does not continuously ingest every incident.</p></aside>`;
  }
  function casePage(c){
    const direct=data.mappings.filter(m=>m.case===c.id),childMappings=data.mappings.filter(m=>c.children?.includes(m.case));
    return breadcrumbs([['Incident library',{view:'library'}],...(c.parent?[[data.cases.find(p=>p.id===c.parent).title,{case:c.parent}]]:[])])+heading(c.kind==='case'?'Wider case':'Bounded episode',c.title,c.summary)+`<p class="m-small">${escape(c.period)}</p>`+
      (c.kind==='episode'?caseEvidence(c):`<p>${escape(c.scope)}</p><h3>Curated episodes within this case</h3>${c.children.map(id=>{const child=data.cases.find(c=>c.id===id);return `<article class="m-callout"><h4>${link(child.title,{case:child.id})}</h4><p>${escape(child.period)}</p><p>${escape(child.summary)}</p></article>`;}).join('')}<p>Other episodes remain accessible in ${external('Haruspex','../haruspex/')}. They have not been assigned to pathways here.</p>${sourceLinks(c.sources)}`)+
      `<section class="m-mappings"><h3>${c.kind==='case'?'Comparisons through its curated episodes':'Mapped pathways'}</h3>${[...direct,...childMappings].map(m=>{const p=data.scenarios.find(p=>p.id===m.scenario);return `<article class="m-callout"><p class="m-kicker">${escape(familyOf(p).title)} · ${escape(m.fit)}</p><h4>${escape(p.title)}</h4><p>${escape(m.finding)}</p>${assessmentLink(m,'Open the pathway with this episode')}</article>`;}).join('')||'<p>No curated pathway mapping has been completed.</p>'}</section>`;
  }
  function componentPage(c){
    const mappings=data.mappings.filter(m=>m.components.includes(c.id));
    return breadcrumbs([['Incident library',{view:'library'}]])+heading(c.kind,c.title,c.reading)+`<div class="m-note"><strong>Limits</strong><p>${escape(c.limitation)}</p></div><h3>Connected evidence</h3>${data.events.filter(e=>c.events.includes(e.id)).map(eventCard).join('')}${c.source?`<p>${external(source(c.source.id).title,source(c.source.id).url)} · ${escape(c.source.locator)}</p>`:''}<h3>Connected pathway comparisons</h3>${mappings.map(m=>`<article class="m-callout"><h4>${escape(data.scenarios.find(p=>p.id===m.scenario).title)}</h4><p>Relevant to: ${c.steps.map(step=>escape(data.scenarios.find(p=>p.id===m.scenario).chain.find(s=>s.id===step).title)).join('; ')}.</p>${assessmentLink(m,'Return to the intermediate layer','components')}</article>`).join('')}<h3>Related controls</h3>${data.controls.filter(control=>control.component===c.id).map(controlCard).join('')||'<p>No control assessment is attached to this component.</p>'}`;
  }
  function eventPage(e){
    const cases=data.cases.filter(c=>c.events?.includes(e.id));
    return breadcrumbs([['Incident library',{view:'library'}],...cases.map(c=>[c.title,{case:c.id}])])+heading(`Source record ${e.id}`,e.title)+`<p>${escape(e.event_date)} · Reported in the cited account</p><dl><dt>Source locator</dt><dd>${escape(e.source_locator)}</dd><dt>Granularity</dt><dd>${escape(e.source_granularity)}</dd><dt>Uncertainty</dt><dd>${escape(e.uncertainty_notes)}</dd><dt>Source group</dt><dd>${escape(e.event_group_id)} · related entries may describe the same underlying action.</dd></dl><div class="m-actions">${external('Open the original report',e.source_url)}${external('Inspect this event in Haruspex',`../haruspex/?event=${encodeURIComponent(e.id)}`)}</div><h3>Used in these components</h3>${data.components.filter(c=>c.events.includes(e.id)).map(componentCard).join('')||'<p>This record supplies episode context.</p>'}`;
  }
  function finding(m){
    return `<section class="m-finding"><p class="m-kicker">Qualified finding · version ${escape(m.version)}</p><h3>What this comparison supports</h3><p class="m-lead">${escape(m.finding)}</p><p>${escape(m.exclusions)}</p><h3>Questions that would change the assessment</h3><ul>${m.questions.map(q=>`<li>${escape(q)}</li>`).join('')}</ul><p class="m-small">As of ${escape(m.asOf)} · ${escape(m.review)}</p><div class="m-actions"><button class="m-button" data-export="${m.id}">Download assessment</button><button class="m-button" data-copy-link>Copy assessment link</button><button class="m-text-button" data-print>Print finding</button></div><div id="m-copy-fallback" hidden><label for="m-share-url">Select and copy this assessment link</label><input id="m-share-url" readonly type="url"></div><details class="m-disclosure"><summary>Preview the full export</summary><pre class="m-export">${escape(data.assessmentText(m.id))}</pre></details>${sourceLinks(m.sources)}</section>`;
  }
  function method(){
    return heading('Method & sources','Read the comparison at the right scale','A pathway is a hypothetical causal argument. An incident can inform particular premises, mechanisms or controls without instantiating the whole argument.')+
      `<div class="m-method"><section><h3>Follow either route</h3><p>Start with group → family → document scenario → curated episode. Or open the incident library and follow an episode’s mapped pathway. Both lead to the same evidence, intermediate layer, controls, and finding.</p><p>The intermediate layer separates capabilities, tendencies, and defenses. These components connect evidence to particular pathway steps; they are not additional families.</p></section><section><h3>Keep the unit of analysis explicit</h3><p>A wider case may contain many bounded episodes; episodes contain source records. One episode may support several distinct comparisons. The larger case does not inherit those classifications. Records sharing a source or source group are not independent corroboration.</p></section><section><h3>Coverage</h3><dl><dt>Curated example available</dt><dd>A specific episode has a documented, provisional mapping to this pathway.</dd><dt>Not yet assessed</dt><dd>No incident comparison has been completed. This says nothing about whether relevant incidents exist.</dd><dt>No suitable case in reviewed material</dt><dd>A scoped search found no suitable example. Use this status only with its search scope and date recorded; no pathway currently has this status.</dd></dl><p>All 95 scenarios are indexed. Two have reconstructed pathways; one has a curated comparison. The Production Web retains its author-supplied Banks adapt variant. Other entries remain visibly unassessed.</p></section><section><h3>Controls and uncertainty</h3><p>Distinguish a failed boundary, a reported intervention, and an intervention shown to be causally sufficient. Limited capability, motivation, opportunity, and luck remain possible explanations where the evidence does not decide. Proposals are not historical events or proven protections.</p><p>There is no estimated catastrophe probability, progress percentage, automated feed, or simulated counterfactual in this assessment.</p></section><section><h3>Classification provenance</h3><p><cite>${escape(catalogue.title)}</cite>, draft checked ${escape(catalogue.version)}, Appendix A, Table 3. The review supplies scenario labels and family assignments. The three groups are presentational; site addresses are editorial and are not paper identifiers.</p><p>The private manuscript is not distributed here. Counts describe the review corpus, not the complete space of possible futures or the priority of an idea’s authorship.</p></section><section><h3>Assessment maintenance</h3><p>Version ${escape(data.version)}. Editorial draft; independent review pending. To add a comparison, define the episode boundary, select source records, document the fit and non-fit of each step, assess the intermediate components and controls, and record what evidence would change the finding. New source versions require a fresh assessment, not silent promotion of a previous claim.</p></section><section><h3>Public sources</h3>${data.sources.map(s=>`<article class="m-source"><h4>${external(s.title,s.url)}</h4><p>${escape(s.author)} · ${escape(s.date)} · ${escape(s.role)}</p><p>${escape(s.locator)}</p></article>`).join('')}</section><section><h3>Earlier worked examples</h3><p>The earlier six STPA examples remain available through their existing addresses. Their model identifiers are separate from the current review’s family and scenario addresses.</p><div class="m-source-links">${['A-1','B-1','C-1','D-1','E-1','F-1'].map(id=>`<a href="?p=${id}">${id} worked example</a>`).join('')}<a href="pathways.html">Static reader</a></div></section></div>`;
  }
  function notFound(message,action=link('Browse all pathways',{})){return heading('Address unavailable','This view could not be found',message)+`<div class="m-callout">${action}</div>`;}
  function content(){
    const p=params(),x=p.get('x');
    if(x){
      const group=groups.find(g=>g.id===x);if(group)return breadcrumbs([])+heading(group.id,group.title)+`<div class="m-family-grid">${group.families.map(familyCard).join('')}</div>`;
      const family=families.find(f=>f.id===x);if(family)return familyPage(family);
      const path=data.scenarios.find(s=>s.id===x||s.variants?.some(v=>v.id===x));if(path)return scenarioPage(path,path.variants?.find(v=>v.id===x));
      return notFound('The supplied group, family or scenario address is not in this catalogue.');
    }
    if(p.has('event')){const event=data.events.find(e=>e.id===p.get('event'));return event?eventPage(event):notFound('This event is not included in the curated library.');}
    if(p.has('component')){const component=data.components.find(c=>c.id===p.get('component'));return component?componentPage(component):notFound('This component is not in the current assessment.');}
    if(p.has('case')){const c=data.cases.find(c=>c.id===p.get('case'));return c?casePage(c):notFound('This case or episode is not in the current library.');}
    if(p.get('view')==='library')return library();
    if(p.get('view')==='method')return method();
    if(p.has('view'))return notFound('This page is not part of X-Oscope.');
    return home();
  }
  function render(focus=true){
    const p=params(),isHome=![...p.keys()].some(k=>k!=='q'),current=p.get('view')==='method'?'method':p.get('view')==='library'||['case','event','component'].some(k=>p.has(k))&&!p.has('x')?'library':'pathways';
    $('mvp-nav').innerHTML=[['pathways','Pathways',{}],['library','Incident library',{view:'library'}],['method','Method & sources',{view:'method'}]].map(([id,label,q])=>`<a data-mvp-link href="${escape(href(q))}"${current===id?' aria-current="page"':''}>${label}</a>`).join('');
    document.querySelector('.opening-shell').hidden=!isHome;
    $('mvp').classList.toggle('m-compact',Boolean(p.get('case')&&p.get('x')&&p.get('stage')!=='path'));
    $('mvp').innerHTML=content();
    document.title=`${$('m-title').textContent} · X-Oscope`;
    if(focus){$('m-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
    $('announcement').textContent=$('m-title').textContent;
  }
  function navigate(url){history.pushState(null,'',url);render();}
  document.body.classList.add('mvp-active');
  $('app').hidden=true;$('mvp').hidden=false;$('mvp-nav').hidden=false;$('fallback').hidden=true;
  document.querySelector('.skip').href='#m-title';document.querySelector('.skip').textContent='Skip to content';
  $('auspex-home').dataset.mvpLink='';
  document.addEventListener('click',async event=>{
    const a=event.target.closest('a[data-mvp-link]');
    if(a&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&event.button===0){event.preventDefault();navigate(a.href);return;}
    const download=event.target.closest('[data-export]');
    if(download){const text=data.assessmentText(download.dataset.export);const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`x-oscope-${download.dataset.export}-${data.version}.md`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('announcement').textContent='Assessment download requested.';}
    if(event.target.closest('[data-copy-link]')){
      const fallback=$('m-copy-fallback'),field=$('m-share-url'),url=location.href;
      fallback.hidden=false;field.value=url;$('announcement').textContent='Assessment link ready to copy.';
      try {if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(url);if(field.isConnected)$('announcement').textContent='Assessment link copied.';}
      catch{if(field.isConnected){field.focus();field.select();$('announcement').textContent='Select and copy the link shown below.';}}
    }
    if(event.target.closest('[data-print]'))window.print();
  });
  document.addEventListener('input',event=>{
    if(event.target.id!=='m-search')return;
    const input=event.target,start=input.selectionStart,end=input.selectionEnd,p=params();
    if(input.value)p.set('q',input.value);else p.delete('q');history.replaceState(null,'',p.size?`?${p}`:'./');render(false);$('m-search').focus({preventScroll:true});$('m-search').setSelectionRange(start,end);
  });
  document.addEventListener('change',event=>{if(event.target.id==='m-kind'){const p=params();p.set('kind',event.target.value);history.replaceState(null,'',`?${p}`);render(false);$('m-kind').focus({preventScroll:true});}});
  window.addEventListener('popstate',()=>render());
  render(false);
})();
