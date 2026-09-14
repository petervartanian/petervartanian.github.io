(() => {
  'use strict';
  const registry = () => window.AuspexSTPAModels || (window.AuspexSTPAData ? {[window.AuspexSTPAData.pathway]: window.AuspexSTPAData} : {});
  let model = window.AuspexSTPAData || Object.values(registry())[0];
  if (!model) return;
  const esc = (s = '') => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = value => Array.isArray(value) ? value : [];
  const byId = (items, id) => list(items).find(x => x.id === id);
  const node = id => byId(model.nodes, id);
  const source = id => byId(model.sources, id);
  const sourceNumber = index => {
    let n=index+1, result='';
    for (const [value,symbol] of [[1000,'m'],[900,'cm'],[500,'d'],[400,'cd'],[100,'c'],[90,'xc'],[50,'l'],[40,'xl'],[10,'x'],[9,'ix'],[5,'v'],[4,'iv'],[1,'i']]) {
      while (n>=value) { result+=symbol; n-=value; }
    }
    return result;
  };
  const sourceMark = (s,index=0) => `<a class="source-dot" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" title="${sourceNumber(index)}. ${esc(s.title)}" aria-label="Open source ${sourceNumber(index)}: ${esc(s.title)}"><span class="source-disc" aria-hidden="true">${sourceNumber(index)}</span></a>`;
  const cite = ids => `<span class="stpa-citations" role="group" aria-label="Sources">${list(ids).map(source).filter(Boolean).map(sourceMark).join('')}</span>`;
  const notedTitle = (title,id,note,label) => {
    const words=String(title).match(/^(.*\s)?(\S+)$/) || ['', '', title];
    return `${esc(words[1] || '')}<span class="a1-noted-word">${esc(words[2])}<sup><a class="a1-note-reference" id="${esc(id)}" href="#${esc(note)}" aria-label="${esc(label)}">*</a></sup></span>`;
  };
  function contextPanel(staticMode=false) {
    const items=list(model.presentation?.context);
    const prefix=staticMode?`${model.pathway}-context`:'a1-context';
    const targets=item=>list(item.targets).map(t=>{
      const n=node(t.node);
      const label=`<span class="a1-context-ref">${esc(n.number)}</span>${esc(t.label)}`;
      return staticMode?`<a href="#${esc(n.id)}" class="a1-context-link">${label}</a>`:`<button class="a1-context-link" data-context-target="${esc(n.id)}" aria-label="Go to ${esc(n.number)}: ${esc(n.shortLabel || n.title)}">${label}</button>`;
    }).join('');
    const body=items.length?`<div class="a1-context-body">${items.map((item,index)=>`<div class="a1-context-item"><h4>${esc(item.title)}</h4><p>${item.note?notedTitle(item.text,`${prefix}-${index}-reference`,`${prefix}-${index}-footnote`,'Scope of these warning signs'):esc(item.text)}${staticMode?` ${cite(item.sources)}`:''}</p>${item.targets?.length?`<div class="a1-context-targets">${targets(item)}</div>`:''}</div>`).join('')}${items.map((item,index)=>item.note?`<p class="a1-footnote" id="${prefix}-${index}-footnote" tabindex="-1"><a href="#${prefix}-${index}-reference" aria-label="Return to warning signs">*</a> ${esc(item.note)}</p>`:'').join('')}</div>`:`<p class="a1-context-scope">${esc(model.scope)}</p>`;
    return `<section class="${staticMode?'a1-context-reading':'a1-context'}${items.length?' has-signals':''}" aria-labelledby="${prefix}-title"><h3 class="a1-context-heading" id="${prefix}-title">${staticMode?'':'<span>0.</span> '}${items.some(item=>item.note)?'Background & warning signs':'System scope'}</h3>${body}</section>`;
  }
  function contextCloud(prefix = 'a1') {
    const setting=model.presentation.cloud, id=prefix+'-cloud';
    if (!setting) return '';
    return `<figure class="a1-context-cloud" aria-labelledby="${id}-title" aria-describedby="${id}-caption">
      <svg class="a1-cloud-atmosphere" viewBox="0 0 600 250" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs><radialGradient id="${id}-mist"><stop stop-color="var(--accent)" stop-opacity=".13"/><stop offset=".64" stop-color="var(--accent)" stop-opacity=".055"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></radialGradient></defs>
        <ellipse cx="196" cy="106" rx="195" ry="101" fill="url(#${id}-mist)"/><ellipse cx="380" cy="113" rx="211" ry="110" fill="url(#${id}-mist)"/><ellipse cx="300" cy="69" rx="137" ry="68" fill="url(#${id}-mist)"/>
        <g class="a1-cloud-wisps"><path d="M38 117C17 79 68 53 106 65C120 17 196 18 225 49C264 9 340 18 357 47C413 8 480 45 474 75C534 48 588 103 554 133"/><path d="M60 166C30 140 62 111 97 122M502 148C558 135 578 168 539 188M126 202C174 224 221 204 247 209C287 229 352 226 385 207C426 226 478 212 491 194"/><path class="a1-cloud-drift" d="M155 83C123 105 196 114 169 139M321 66C363 98 282 115 302 141M460 96C436 118 478 126 456 149"/></g>
      </svg>
      <div class="a1-cloud-title" id="${id}-title"><span>0.</span> Context</div>
      <div class="a1-cloud-conditions" aria-label="Upstream conditions">${setting.conditions.map(label=>`<span>${esc(label)}</span>`).join('')}</div>
      <div class="a1-cloud-actors" aria-label="Authority and control within this setting">${setting.actors.map(actor=>`<div data-controller="${esc(actor.controller)}" title="${esc(controller(actor.controller).responsibility)}"><strong>${esc(actor.label)}</strong><span>${esc(actor.role)}</span></div>`).join('')}</div>
      <figcaption id="${id}-caption">${esc(setting.summary)}</figcaption>
    </figure>`;
  }
  const tag = s => `<span class="stpa-id">${esc(s)}</span>`;
  const refs = ids => list(ids).map(tag).join(' ');
  const control = id => byId(model.constraints,id);
  const controller = id => byId(model.controllers,id) || {title: id};
  const stateModel = window.AuspexBarrierStateData;
  const stateDefinitions = stateModel.states;
  const conditionNames = Object.fromEntries(stateDefinitions.map(s => [s.id,s.label]));
  const conditionLabel = condition => conditionNames[condition] || conditionNames.unknown;
  const conditionKey = condition => Object.hasOwn(conditionNames, condition) ? condition : 'unknown';
  const glyphPaths = Object.fromEntries(stateDefinitions.map(s => [s.id,`<path d="${s.path}"/>`]));
  const barrierStates = b => list(b.states).length ? b.states : [conditionKey(b.condition)];
  function barrierGlyph(condition) {
    const key=conditionKey(condition);
    const flow = ['intact','reinforced','degrading'].includes(key)
      ? 'M2 16h8m-3-3 3 3-3 3'
      : key==='backfiring' ? 'M2 16h8M23 16h7M24 12l4 4-4 4M28 12l3 4-3 4'
      : key==='unknown' ? 'M2 16h5m18 0h5' : 'M2 16h28m-3-3 3 3-3 3';
    return `<svg class="stpa-barrier-glyph is-${key}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path class="stpa-glyph-flow" d="${flow}"/>${glyphPaths[key]}</svg>`;
  }
  const overlayNames = () => Object.fromEntries(Object.entries(model.presentation?.overlays || {}).map(([id,o])=>[id,o.title]));
  const projectedLinks = () => list(model.links);
  const use = id => { const next=registry()[id]; if (!next) return false; model=next; return true; };
  const has = id => Boolean(registry()[id]);
  function overlayConfig(a) { return a && model.presentation?.overlays?.[a.incident]; }
  function overlayAnchor(a, tentative = false) {
    const config=overlayConfig(a);
    if (!config) return null;
    if (tentative) return node(config.tentative?.target)?.id || null;
    if (node(config.anchor)) return config.anchor;
    if (node(config.target)) return config.target;
    const edge=projectedLinks().find(l=>l.id===config.target);
    return edge?.from || list(a.targets).find(t=>node(t.id))?.id || null;
  }
  function barriers(a) {
    const config=overlayConfig(a);
    if (!config) return [];
    const items=list(a.barriers).map(b=>({...b,...config.barriers?.[b.id]}));
    for (const id of list(config.candidates)) {
      const c=control(id);
      if (!c) continue;
      items.push({id:`candidate-${id}`, title:c.title, target:config.target, candidate:true, constraint:id,
        condition:'unknown', states:['unknown'], conditionBasis:'This safeguard is proposed. The announcement does not establish its implementation or effectiveness.',
        result:id==='SC1'?'Would an unlawful order be blocked?':'Would adverse findings change the decision?', outcome:'Proposed barrier',
        action:c.text, efficacy:`${config.observed} ${config.notEstablished}`, evidence:list(a.evidence),
        durability:c.limit, failure:c.limit, strongerAI:c.limit, limitType:'safeguard',
        view:{input:id==='SC1'?'Disputed orders':'Adverse findings',control:c.title,result:'Protection unassessed',dependency:id==='SC1'?'Independent authorization':'Uncensored oversight'},
        reinforcement:{proposal:c.text,test:c.test,status:'proposed'}});
    }
    return items;
  }
  function barrierView(b, question) {
    const v=b.view;
    if (!v || ![0,2].includes(question)) return '';
    const result=b.id==='training-assurance'?'Compliance without preference change':v.result;
    return `<figure class="a1-barrier-study${b.candidate?' is-candidate':''}" data-condition="${esc(b.condition)}" aria-label="${esc(v.input)}, ${esc(v.control)}, ${esc(result)}"><div class="a1-study-flow"><span>${esc(v.input)}</span><i aria-hidden="true"></i><span class="a1-study-control">${barrierGlyph(b.condition)}<strong>${esc(v.control)}</strong></span><i aria-hidden="true"></i><span class="a1-study-result">${esc(result)}</span></div>${question===2 && v.dependency?`<figcaption class="a1-study-dependency"><span>Depends on</span>${esc(v.dependency)}</figcaption>`:''}</figure>`;
  }
  function tentativeConnection(config, staticMode = false) {
    const link=config.tentative;
    if (!link) return '';
    const target=node(link.target);
    return `<div class="a1-tentative-connection" data-tentative-target="${esc(link.target)}">
      ${staticMode?`<p class="a1-overlay-kicker">Open question for ${esc(target.number)}</p>`:''}
      <p class="a1-connection-question">${esc(link.question)}</p>
      <dl class="a1-connection-reason"><dt>Why ask?</dt><dd>${esc(link.basis)}${cite(link.sources)}</dd><dt>What remains unknown</dt><dd>${esc(link.unresolved)}</dd></dl>
    </div>`;
  }
  function overlay(a, inspectedBarrier, evidenceMarks, exploration = false) {
    const config=overlayConfig(a);
    if (!config) return '';
    const anchor=node(overlayAnchor(a)), items=barriers(a);
    const kind=config.kind || 'Source evidence';
    return `<section class="a1-overlay" id="a1-overlay" tabindex="-1" data-overlay-incident="${esc(a.incident)}" data-overlay-target="${esc(config.target)}" data-overlay-anchor="${esc(anchor?.id)}" aria-label="${esc(config.title)}: evidence relevant to ${esc(anchor?.title)}">
      <button class="a1-overlay-close" data-clear-incident aria-label="Remove the incident overlay">×</button>
      <p class="a1-overlay-kicker">${esc(kind)} at ${esc(anchor.number)}</p>
      <h4 class="a1-overlay-title">${notedTitle(config.title,'a1-case-reference','a1-case-footnote','Scope of this case')}<span class="source-dots">${evidenceMarks(a.evidence)}</span></h4>
      <p class="a1-overlay-observed">${esc(config.observed)}</p>
      <div class="a1-case-assessment">${items.length?`<div class="a1-overlay-barriers">${items.map(b=>`<div class="a1-observed-control a1-barrier-card"><button id="a1-overlay-barrier-${esc(b.id)}" data-overlay-barrier="${esc(b.id)}" aria-label="Inspect ${esc(b.title)}: ${esc(barrierStates(b).map(conditionLabel).join(', '))}" aria-pressed="${inspectedBarrier===b.id}" aria-controls="workspace">${barrierGlyph(b.condition)}<span><strong>${esc(b.title)}</strong><small class="a1-barrier-condition">${esc(barrierStates(b).map(conditionLabel).join(' · '))}</small></span><span class="a1-inspect-arrow" aria-hidden="true">↗</span></button><p>${esc(b.result || b.conditionBasis || '')}</p></div>`).join('')}</div>`:''}
      <p class="a1-case-evidence"><strong>Caveat /</strong> ${esc(config.notEstablished)}</p></div>
      ${config.tentative?`<div class="a1-open-question"><span>Open question for ${esc(node(config.tentative.target).number)}</span><button data-explore-connection aria-expanded="${exploration}" aria-controls="a1-question-detail">${esc(config.tentative.question)}<span class="a1-question-toggle" aria-hidden="true">${exploration?'−':'+'}</span></button><div class="a1-question-detail" id="a1-question-detail"${exploration?'':' hidden'}><p>${esc(config.tentative.basis)}${cite(config.tentative.sources)}</p><p>${esc(config.tentative.unresolved)}</p></div></div>`:''}
    </section>`;
  }
  function proposedBarrierGuide() {
    return `<section class="a1-barrier-card a1-proposed-definition"><header class="a1-barrier-card-heading">${routeSymbol('safeguard')}<div><h4>Proposed barriers</h4></div></header><p>Each mark on a route represents one proposed barrier. Select a mark to inspect that barrier and what could defeat it.</p><p>A proposal describes how a safeguard should work. Its performance remains unassessed until relevant evidence establishes how it performs.</p></section>`;
  }
  function stateGuide(selected = 'unknown') {
    const current=byId(stateDefinitions,selected) || byId(stateDefinitions,'unknown');
    const exampleSource=byId(stateModel.sources,current.exampleSource);
    return `${proposedBarrierGuide()}<h3 class="a1-barrier-states-heading">Barrier states</h3><div class="stpa-state-explorer"><div class="stpa-state-menu" role="group" aria-label="Explore barrier states">${stateDefinitions.map(s=>`<button data-explore-state="${s.id}" aria-pressed="${s.id===current.id}" aria-controls="state-definition">${barrierGlyph(s.id)}<span>${esc(s.label)}</span></button>`).join('')}</div><section id="state-definition" class="stpa-state-definition" aria-live="polite">${barrierGlyph(current.id)}<div><h3>${esc(current.label)}</h3><p>${esc(current.definition)}</p><p class="stpa-state-question">${esc(current.question)}</p><p class="stpa-state-example">${esc(current.example)} ${sourceMark(exampleSource)}</p></div></section><p>A barrier can hold in one incident and still be brittle. Ask what would defeat it as AI capabilities and operating conditions change.</p></div>`;
  }
  function routeSymbol(kind) {
    const path=kind==='recovery'
      ? '<path class="route-rail" d="M2 10.75H25M2 13.25H25"/><path class="route-tip" d="M25 8l7 4-7 4z"/>'
      : kind==='feedback'?'<path class="route-line" d="M29 17H8A3 3 0 0 1 5 14V7A3 3 0 0 1 8 4H26"/><path d="m21 1 4 3-4 3m5-6 4 3-4 3"/>'
      : kind==='safeguard'?'<path d="M2 12H15M19 12H32"/><path class="a1-barrier-stem" d="M17 7V17"/><path class="a1-barrier-caps" d="M15 7H19M15 17H19"/>'
      : '<path class="route-line" d="M2 10H30"/><path d="m25 6 5 4-5 4"/>';
    return `<svg class="a1-route-symbol is-${kind}" viewBox="0 0 34 24" aria-hidden="true" focusable="false">${path}</svg>`;
  }
  const routeDefinitions=[
    {id:'contribution',label:'Possible progression',definition:'One component may contribute to another if the stated conditions hold. An arrow does not assign a probability.'},
    {id:'optional',label:'Optional route',definition:'A dashed branch can be bypassed. The pathway can continue through another route.'},
    {id:'recovery',label:'Recovery',definition:'Two fine parallel green lines point toward containing harm or restoring control. The outcome depends on the intervention working.'},
    {id:'feedback',label:'Feedback',definition:'A dotted return line with two arrowheads shows how an outcome changes an earlier input or decision. It can amplify harm or help correct it.'}
  ];
  function overlayGuide() {
    return '<h3>Inspect a barrier</h3><p>Select a barrier mark to ask whether the protection would hold against more capable AI. The card shows what could defeat it, with its basis and possible changes underneath.</p><h3>Incidents on the map</h3><p>Select a dated case to see what happened at the relevant component. Its barrier buttons open the assessments supported by that case. Select another case to switch, or close the card to clear it.</p><p>Open the question inside the incident card to read what the case leaves unanswered. The related component is highlighted, while the incident evidence and barrier assessments stay at their original location.</p>';
  }
  function pathsGuide(staticMode=false) {
    return `<div class="a1-path-guide"><div class="a1-stage-guide"><span><b>0.</b> Context</span><span><b>1.</b> Precursors</span><span><b>2.</b> Event</span><span><b>3.</b> Consequences</span><span class="is-recovery"><b>R</b> Recovery</span></div><p>The cloud at 0 shows the assumed upstream conditions and the authority exercised within them. Those conditions shape decisions and controls. Feedback can change the setting in turn.</p><p>Precursors may lead to the central loss-of-control event. Consequences depend on what follows, and recovery may interrupt that progression.</p><dl class="a1-path-definitions">${routeDefinitions.map(r=>`<div>${routeSymbol(r.id)}<dt>${esc(r.label)}</dt><dd>${esc(r.definition)}</dd></div>`).join('')}</dl>${overlayGuide()}${methodGuide()}${staticMode?`<h3>Barriers</h3>${proposedBarrierGuide()}<h4>Barrier states</h4><dl class="a1-path-definitions a1-barrier-definitions">${stateDefinitions.map(s=>`<div class="a1-barrier-card">${barrierGlyph(s.id)}<dt>${esc(s.label)}</dt><dd>${esc(s.definition)}</dd></div>`).join('')}</dl>`:''}</div>`;
  }
  function mapGuide(mode='paths',selected='unknown') {
    const tabs=[['paths','Path types'],['barriers','Barriers']];
    const active=tabs.some(([id])=>id===mode)?mode:'paths';
    return `<nav class="a1-guide-tabs" aria-label="Map key sections">${tabs.map(([id,label])=>`<button data-map-guide="${id}" aria-pressed="${id===active}" aria-controls="a1-guide-content">${label}</button>`).join('')}</nav><div id="a1-guide-content">${active==='barriers'?stateGuide(selected):pathsGuide()}</div>`;
  }
  function renderMap(selected, a, inspectedBarrier, evidenceMarks = () => '', exploration = false) {
    const groups={before:[],centre:[],after:[],recovery:[]};
    for (const n of model.nodes) {
      const wing=n.type==='recovery' ? 'recovery' : (groups[n.wing] ? n.wing : 'after');
      groups[wing].push(n);
    }
    const anchor=overlayAnchor(a), config=anchor?overlayConfig(a):null;
    const tentativeAnchor=exploration?overlayAnchor(a,true):null;
    const cell=n=>{
      const optional=n.type==='amplifier', mapped=config && anchor===n.id, tentative=config && tentativeAnchor===n.id;
      const condition=model.presentation?.conditions?.[n.id];
      const label=n.shortLabel || n.title;
      const shownSources=n.type==='recovery'?list(n.sources):[];
      return `<div class="a1-cell${optional?' is-optional':''}${mapped?' is-overlaid':''}${tentative?' has-question':''}${n.wing==='centre'?' is-centre':''}${n.type==='recovery'?' is-recovery':''}" data-cell="${esc(n.id)}">
        ${condition?`<p class="a1-condition">${esc(condition)}</p>`:''}
        <div class="a1-step-box${shownSources.length?' has-sources':''}"><button class="a1-step" data-node="${esc(n.id)}" data-target="${esc(n.id)}" aria-pressed="${selected===n.id}" aria-controls="a1-node-note" aria-label="${esc(n.number)}. ${esc(label)}${optional?' (optional)':''}"><span class="a1-number">${esc(n.number)}</span><strong>${esc(label)}${optional?'<span class="a1-optional-label">optional</span>':''}</strong></button>${shownSources.length?`<div class="a1-step-sources">${cite(shownSources)}</div>`:''}</div>
        ${mapped?overlay(a,inspectedBarrier,evidenceMarks,Boolean(tentativeAnchor)):''}
      </div>`;
    };
    const headings={before:'1. Precursors',centre:'2. Event',after:'3. Consequences',recovery:'R. Recovery'};
    const kinds=new Set(projectedLinks().map(l=>(l.kind || l.type)==='continuation'?'contribution':l.kind || l.type));
    return `<section class="a1-map-field"><div id="a1-route" class="a1-route${config?' has-overlay':''}" data-model-pathway="${esc(model.pathway)}" aria-label="Hypothetical pathway: contributing conditions, loss of control, conditional consequences, and recovery">${['before','centre','after','recovery'].map(wing=>groups[wing].length?`<section class="a1-region a1-region-${wing}" data-wing="${wing}" aria-label="${headings[wing]}"><h3 class="a1-region-heading">${headings[wing]}</h3>${groups[wing].map(cell).join('')}</section>`:'').join('')}</div></section>
    <p class="a1-node-note" id="a1-node-note" tabindex="-1"${config && (selected===anchor || selected===tentativeAnchor)?' hidden':''}><strong>Explanation:</strong> ${esc(node(selected)?.text || model.summary)}</p>${config?`<p class="a1-footnote" id="a1-case-footnote" tabindex="-1"><a href="#a1-case-reference" aria-label="Return to case title">*</a> ${esc(config.limit)}</p>`:''}
    <div class="a1-map-key" role="group" aria-label="Path and barrier key">${routeDefinitions.filter(r=>kinds.has(r.id)).map(r=>`<button data-map-guide="paths" aria-haspopup="dialog" aria-label="Explain ${esc(r.label.toLowerCase())}">${routeSymbol(r.id)}<span>${esc(r.label)}</span></button>`).join('')}<button class="a1-barrier-key" data-map-guide="barriers" aria-haspopup="dialog" aria-label="Explain barriers, including proposed barriers and barrier states">${barrierGlyph('intact')}<span><strong>Barriers ↗</strong><small>${routeSymbol('safeguard')}Proposed barriers</small></span></button></div>`;
  }
  function targetButton(id) { return Array.from(document.querySelectorAll('#a1-route [data-node]')).find(el=>el.dataset.node===id); }
  function analysis() {
    return `<div class="stpa-analysis-body">
      <p class="stpa-provisional">This STPA model is provisional. Source evidence and hypothetical scenarios are distinguished throughout. The control requirements and test questions are analyst proposals.</p>
      <section class="stpa-method-section"><h3>1. Define the purpose and boundary</h3><p>${esc(model.purpose)}</p><p>${esc(model.scope)}</p><p class="stpa-muted">${esc(model.boundary)}</p>
        <div class="stpa-register-pair"><div><h4>Losses to prevent</h4>${model.losses.map(x=>`<article><h5>${tag(x.id)} ${esc(x.title)}</h5><p>${esc(x.text)}</p></article>`).join('')}</div><div><h4>Hazardous system states</h4>${model.hazards.map(x=>`<article><h5>${tag(x.id)} ${esc(x.title)}</h5><p>${esc(x.text)} ${refs(x.losses)}</p></article>`).join('')}</div></div>
      </section>
      <section class="stpa-method-section"><h3>2. Model control and feedback</h3><p>Who can change the system, and what evidence tells them what it is actually doing?</p>
        <div class="stpa-loops">${model.controlLoops.map(l=>`<article class="stpa-loop"><div class="stpa-loop-row"><div>${tag(l.controller)}<strong>${esc(controller(l.controller).title)}</strong></div><div class="stpa-action"><span>${tag(l.id)} ${esc(l.action)}</span><span aria-hidden="true">→</span></div><div>${tag(l.process)}<strong>${esc(controller(l.process).title)}</strong></div></div><p class="stpa-feedback"><span aria-hidden="true">↶</span> Feedback: ${esc(l.feedback)}</p><p class="stpa-loop-refs">Required constraints: ${refs(l.constraints)}</p></article>`).join('')}</div>
        <details><summary>Responsibilities and assumptions</summary>${model.controllers.map(c=>`<article class="stpa-responsibility"><h4>${tag(c.id)} ${esc(c.title)}</h4><p>${esc(c.responsibility)}</p><p><strong>Feedback needed:</strong> ${esc(c.feedback)}</p><p><strong>Assumption to test:</strong> ${esc(c.assumption)}</p></article>`).join('')}</details>
        <h4>Required controls and their limits</h4><p class="stpa-muted">These are proposed constraints. Naming a control does not establish that it exists or works.</p>
        <div class="stpa-controls">${model.constraints.map(c=>`<article class="a1-barrier-card" id="stpa-${c.id}" tabindex="-1"><header class="a1-barrier-card-heading">${barrierGlyph('unknown')}<div><h4>${tag(c.id)} ${esc(c.title)}</h4><p class="a1-barrier-meta">Proposed barrier / Unassessed</p></div></header><p class="stpa-role">${esc(c.role)} · owners ${esc(c.owners.join(', '))} · ${esc(c.hazards.join(', '))}</p><p>${esc(c.text)}</p><p><strong>Test:</strong> ${esc(c.test)}</p><p><strong>Failure conditions:</strong> ${esc(c.limit)}</p>${c.id===model.controlEvidence?.constraint?'<a href="#stpa-control-evidence">Compare source evidence ↓</a>':''}</article>`).join('')}</div>
      </section>
      <section class="stpa-method-section"><h3>3. Identify unsafe control actions</h3><p>Each entry specifies a controller, an action, and the context in which that action becomes hazardous. These four categories classify unsafe control. They are not four events in a timeline.</p>
        <div class="stpa-ucas">${model.unsafeActions.map(u=>`<article><p class="stpa-role">${tag(u.id)} ${esc(u.type)}</p><h4>${esc(controller(u.controller).title)}: ${esc(u.action.toLowerCase())}</h4><p><strong>Unsafe when:</strong> ${esc(u.context)}</p><p class="stpa-trace">${refs([u.loop,...u.hazards,...u.constraints])}</p></article>`).join('')}</div>
        <p class="stpa-muted">The examples cover selected control actions. A complete analysis must examine every relevant control action under all four categories.</p>
      </section>
      <section class="stpa-method-section"><h3>4. Explain the loss scenarios</h3><p>Examine both why unsafe control actions might occur and why an appropriate control action might fail to execute or achieve its intended effect.</p>
        ${model.scenarios.map(s=>`<article class="stpa-scenario"><h4>${tag(s.id)} ${esc(s.title)}</h4><p class="stpa-role">${esc(s.archetype)}</p><p>${esc(s.text)}</p><p><strong>Unresolved:</strong> ${esc(s.unknown)}</p><p class="stpa-trace">${refs([...s.ucas,...s.hazards])} · milestones ${esc(s.nodes.map(id=>node(id).number).join(', '))} ${cite(s.evidence)}</p></article>`).join('')}
      </section>
      <section class="stpa-method-section"><h3>What might limit progression?</h3><p>A safeguard, a lack of capability, and a lack of opportunity have different implications as AI develops.</p><div class="stpa-limit-types">${model.limitingConditions.map(l=>`<article><h4>${esc(l.kind)}</h4><p>${esc(l.example)}</p><p>${esc(l.question)}</p></article>`).join('')}</div></section>
      ${controlEvidence()}
      <section class="stpa-method-section"><h3>Method and source boundaries</h3><p>${esc(model.limits)}</p><p>${esc(model.numbering)}</p><p>${esc(model.schema)}</p><p>${esc(model.bowtie)}</p><p>Proximal and distal describe causal distance from a specified event or loss. They are not fixed stages or severity ranks. Recovery and later losses are examined relative to the specified loss-of-control boundary.</p>${sourceRegister()}</section>
    </div>`;
  }
  function controlEvidence() {
    const c=model.controlEvidence;
    if (!c) return '';
    return `<section id="stpa-control-evidence" class="stpa-control-evidence" tabindex="-1"><p class="stpa-kicker">${esc(c.kind)} · ${tag(c.constraint)}</p><h3>${esc(c.title)}</h3><p>${esc(c.text)} ${cite([c.source])}</p><p class="stpa-muted">${esc(c.limit)}</p><div class="stpa-limit-types">${c.questions.map(q=>`<article><h4>${esc(q.title)}</h4><p>${esc(q.text)}</p></article>`).join('')}</div>${c.source==='HF'?'<a href="../haruspex/" target="_blank" rel="noopener noreferrer">Read the investigation in Haruspex ↗</a>':''}</section>`;
  }
  function sourceRegister() {
    return `<ol class="stpa-sources">${model.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><p>${esc(s.locator)}. ${esc(s.use)}</p></li>`).join('')}</ol>`;
  }
  function methodGuide() {
    return `<section class="a1-method-guide"><h3>STPA in Auspex</h3><p>Systems-Theoretic Process Analysis examines how control can become inadequate. It begins with the losses to prevent and the hazardous conditions that could produce them. It then maps who controls what, the actions available to them, and the feedback they need.</p><p>Each control action is examined in context. Could harm follow if it is omitted, provided, mistimed, or continued for the wrong duration? Loss scenarios explain how those situations could arise, including how an appropriate action might fail to take effect. The findings inform safety constraints and proposed barriers. <a href="https://psas.scripts.mit.edu/home/papers/2025_System_Safety_for_Health_Information_Tec.pdf" target="_blank" rel="noopener noreferrer">MIT · STPA method ↗</a></p><p>Each worked case links selected control actions and loss scenarios to its proposed barriers. The cloud supplies their context. The full research notes contain the control relationships and assumptions behind the map. These examples remain provisional.</p><h3>CAST and bow-tie</h3><p>Haruspex uses CAST to investigate how control broke down in a reported incident. Auspex uses STPA to examine how a future loss could arise. Both draw on STAMP’s view of safety as a control problem. <a href="https://psas.scripts.mit.edu/home/wp-content/uploads/2013/04/STPA_advanced_tutorial1.pdf" target="_blank" rel="noopener noreferrer">MIT · STAMP, STPA, and CAST ↗</a></p><p>Both sites use a bow-tie to arrange contributing threats, a central loss-of-control event, and potential consequences, with barriers along the routes. Here, the map summarizes part of the analysis. Its arrows and numbering are drawing conventions specific to the site. <a href="https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/about-bowtie/how-does-bowtie-work/" target="_blank" rel="noopener noreferrer">UK CAA · Bow-tie structure ↗</a></p></section>`;
  }
  function guide() {
    return `${methodGuide()}${overlayGuide()}`;
  }
  function research() {
    return `<ul class="a1-sources">${model.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></li>`).join('')}</ul><p><a href="pathways.html#${esc(model.pathway)}">Full research notes ↗</a></p>`;
  }
  function staticPage() {
    return `<section class="stpa-static"><h2>${esc(model.title)}</h2><p>${esc(model.status)}</p><p>${esc(model.summary)}</p><p>${esc(model.numbering)}</p><p>${esc(model.presentation.fidelity)}</p>${contextCloud(model.pathway)}${contextPanel(true)}${model.nodes.map(n=>`<section id="${esc(n.id)}"><h4>${esc(n.number)} · ${esc(n.title)}</h4><p><strong>Explanation:</strong> ${esc(n.text)}</p><p><strong>Mechanism:</strong> ${esc(n.mechanism)}</p><p><strong>Requires:</strong> ${esc(n.requires)}</p><p>Controls: ${refs(n.constraints)} ${cite(n.sources)}</p></section>`).join('')}${analysis()}</section>`.replace(/(id="|href="#)stpa-/g, `$1${model.pathway}-stpa-`).replace(/[ \t]+\n/g, '\n');
  }
  function proposedSafeguard(link) {
    if (link.safeguard) return link.safeguard;
    const ids=list(link.constraints);
    const shared=ids.length ? ids : list(node(link.from)?.constraints).filter(id=>list(node(link.to)?.constraints).includes(id));
    return joinNames(shared.map(id=>control(id)?.title).filter(Boolean));
  }
  const joinNames = names => names.length<3?names.join(' and '):names.slice(0,-1).join(', ')+', and '+names.at(-1);
  function proposedBarriers() {
    return projectedLinks().map(link=>{
      const ids=list(link.constraints);
      const shared=ids.length?ids:list(node(link.from)?.constraints).filter(id=>list(node(link.to)?.constraints).includes(id));
      return {id:link.id,title:proposedSafeguard(link),from:link.from,to:link.to,controls:shared.map(control).filter(Boolean)};
    }).filter(b=>b.id && b.title && b.controls.length);
  }
  const proposedBarrier = id => proposedBarriers().find(b=>b.id===id);
  function barrierCardHeading(title, condition, states, {proposed=false, proposalLabel='Proposed barrier', note='', staticMode=false, titleId=''} = {}) {
    const labels=states.map(id=>staticMode?'<span>'+esc(conditionLabel(id))+'</span>':`<button data-state-info="${esc(id)}" aria-haspopup="dialog" aria-controls="method-dialog">${esc(conditionLabel(id))}</button>`).join(' ');
    return `<header class="a1-barrier-card-heading">${barrierGlyph(condition)}<div><h4${titleId?` id="${esc(titleId)}" tabindex="-1"`:''}>${esc(title)}</h4><p class="a1-barrier-meta">${proposed?esc(proposalLabel)+' / ':''}<span class="a1-barrier-states">${labels}${note?`<sup><a class="a1-note-reference" id="${esc(note)}-reference" href="#${esc(note)}-footnote" aria-label="Evidence for this state">*</a></sup>`:''}</span></p></div></header>`;
  }
  function incidentBarrierReading(b, evidenceMarks = () => '', {staticMode=false,note='a1-state'} = {}) {
    const answer=b.strongerAI || b.durability || b.failure;
    const reinforcement=b.reinforcement;
    const titleId=note+'-title';
    return `<article class="a1-barrier-card" data-inspected-barrier="${esc(b.id)}" data-condition="${esc(b.condition)}">${barrierCardHeading(b.title,b.condition,barrierStates(b),{proposed:b.candidate,note,staticMode,titleId})}
      ${b.result?`<p class="a1-barrier-result">${esc(b.result)}</p>`:''}<p class="a1-barrier-answer">${esc(answer)}</p>
      <details class="a1-barrier-support"><summary>Basis and further work</summary>${barrierView(b,2)}<p>${esc(b.action)}</p><p>${esc(b.efficacy)}<span class="source-dots">${evidenceMarks(b.evidence)}</span></p>${b.failure && b.failure!==answer?`<p>${esc(b.failure)}</p>`:''}
      ${reinforcement?(b.candidate?`<p><strong>Proposed test /</strong> ${esc(reinforcement.test)}</p>`:`<section class="a1-barrier-card a1-proposed-change">${barrierCardHeading('Possible reinforcement','unknown',['unknown'],{proposed:true,proposalLabel:'Proposed reinforcement',staticMode})}<p>${esc(reinforcement.proposal)}</p><p><strong>Proposed test /</strong> ${esc(reinforcement.test)}</p></section>`):''}</details>
      <p class="a1-footnote" id="${esc(note)}-footnote" tabindex="-1"><a href="#${esc(note)}-reference" aria-label="Return to barrier state">*</a> ${esc(b.conditionBasis)}</p></article>`;
  }
  function proposedBarrierView(id, assessment, evidenceMarks = () => '', constraint = '') {
    const b=proposedBarrier(id);
    if (!b) return '';
    const selected=b.controls.find(c=>c.id===constraint) || b.controls[0];
    return `<div class="a1-proposed-study" data-proposed-barrier="${esc(id)}">${[selected].map(c=>{
      const comparison=model.controlEvidence?.constraint===c.id?model.controlEvidence:null;
      const related=barriers(assessment).filter(item=>item.constraint===c.id);
      let evidence=comparison?`<p>${esc(comparison.text)}${cite([comparison.source])}</p><p class="a1-evidence-boundary">${esc(comparison.limit)}</p>`:'<p>No assessment of this safeguard’s effectiveness is linked here.</p>';
      if (related.length) evidence=related.map(item=>`<p>${esc(item.efficacy)}<span class="source-dots">${evidenceMarks(item.evidence)}</span></p><button class="a1-related-barrier" data-related-barrier="${esc(item.id)}">Inspect ${esc(overlayConfig(assessment).title)} evidence ↗</button>`).join('');
      return `<article class="a1-barrier-card" data-constraint="${esc(c.id)}">${barrierCardHeading(c.title,'unknown',['unknown'],{proposed:true,titleId:'a1-proposed-'+c.id})}<p class="a1-barrier-purpose">${esc(c.text)}</p><p class="a1-barrier-answer">${esc(c.limit)}</p><details class="a1-barrier-support"><summary>Basis and further work</summary>${evidence}<p><strong>Proposed test /</strong> ${esc(c.test)}</p><dl class="a1-control-owners">${c.owners.map(owner=>`<div><dt>${esc(controller(owner).title)}</dt><dd>${esc(controller(owner).responsibility)}</dd></div>`).join('')}</dl></details></article>`;
    }).join('')}</div>`;
  }
  function barrierButton(b, c, center, selected, selectedConstraint) {
    return `<button class="a1-route-barrier" data-safeguard="${esc(b.id)}" data-constraint="${esc(c.id)}" style="left:${center[0].toFixed(1)}px;top:${center[1].toFixed(1)}px" aria-label="Inspect ${esc(c.title)} on ${esc(node(b.from).number)} to ${esc(node(b.to).number)}" title="${esc(c.title)}" aria-pressed="${selected===b.id && selectedConstraint===c.id}" aria-controls="barrier-panel"><span class="sr-only">${esc(c.title)}</span></button>`;
  }
  const pointText = p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const polyline = points => points.map((p,i)=>`${i?'L':'M'}${pointText(p)}`).join(' ');
  function roundedCorners(points) {
    return points.map((p,i)=>{
      if (!i || i===points.length-1) return null;
      const a=points[i-1],b=points[i+1],incoming=Math.hypot(p[0]-a[0],p[1]-a[1]),outgoing=Math.hypot(b[0]-p[0],b[1]-p[1]);
      if (!incoming || !outgoing) return null;
      const u=[(p[0]-a[0])/incoming,(p[1]-a[1])/incoming],v=[(b[0]-p[0])/outgoing,(b[1]-p[1])/outgoing];
      const cross=u[0]*v[1]-u[1]*v[0];
      if (Math.abs(cross)<1e-6) return null;
      const tangent=Math.tan(Math.acos(Math.max(-1,Math.min(1,u[0]*v[0]+u[1]*v[1])))/2);
      return {u,v,turn:Math.sign(cross),tangent,radius:Math.min(12,incoming*.45/tangent,outgoing*.45/tangent)};
    });
  }
  function roundedPath(points, corners=roundedCorners(points), offset=0) {
    if (!points.length) return '';
    let d='M'+pointText(points[0]);
    for (let i=1;i<points.length;i++) {
      const p=points[i],corner=corners[i];
      if (!corner) { d+=' L'+pointText(p); continue; }
      // Offset recovery rails share a centre of curvature at each turn.
      const radius=Math.max(.1,corner.radius-offset*corner.turn),trim=radius*corner.tangent;
      const start=p.map((v,j)=>v-corner.u[j]*trim),end=p.map((v,j)=>v+corner.v[j]*trim);
      d+=` L${pointText(start)} A${radius.toFixed(2)},${radius.toFixed(2)} 0 0 ${corner.turn>0?1:0} ${pointText(end)}`;
    }
    return d;
  }
  function clearSegment(a,b,boxes,margin=8) {
    return boxes.every(box=>{
      let low=0,high=1;
      for (let axis=0;axis<2;axis++) {
        const min=(axis?box.top:box.left)-margin,max=(axis?box.bottom:box.right)+margin,delta=b[axis]-a[axis];
        if (Math.abs(delta)<1e-8) { if (a[axis]<min || a[axis]>max) return true; }
        else {
          const t1=(min-a[axis])/delta,t2=(max-a[axis])/delta;
          low=Math.max(low,Math.min(t1,t2));high=Math.min(high,Math.max(t1,t2));
          if (low>high) return true;
        }
      }
      return false;
    });
  }
  function offsetPolyline(points, offset) {
    const normals=points.slice(1).map((b,i)=>{
      const a=points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      return [-(b[1]-a[1])/length,(b[0]-a[0])/length];
    });
    return points.map((p,i)=>{
      const before=normals[Math.max(0,i-1)],after=normals[Math.min(i,normals.length-1)];
      const divisor=1+before[0]*after[0]+before[1]*after[1];
      const shift=divisor>.1?[(before[0]+after[0])*offset/divisor,(before[1]+after[1])*offset/divisor]:before.map(n=>n*offset);
      return [p[0]+shift[0],p[1]+shift[1]];
    });
  }
  function connectionGeometry(kind, points, barrierCount = 0) {
    const unique=points.filter((p,i)=>!i || p[0]!==points[i-1][0] || p[1]!==points[i-1][1]);
    const clean=unique.filter((p,i)=>{
      if (!i || i===unique.length-1) return true;
      const a=unique[i-1],b=unique[i+1];
      return (p[0]-a[0])*(b[1]-p[1])!==(p[1]-a[1])*(b[0]-p[0]) || (p[0]-a[0])*(b[0]-p[0])+(p[1]-a[1])*(b[1]-p[1])<=0;
    });
    const segments=clean.slice(1).map((b,i)=>({a:clean[i],b,index:i,length:Math.hypot(b[0]-clean[i][0],b[1]-clean[i][1])}));
    const longest=segments.reduce((best,current)=>!best || current.length>best.length?current:best,null);
    if (!longest) return {d:polyline(clean),sections:[],rails:[],barriers:[],barrier:null,head:null,midpoint:clean[0] || [0,0],tangent:[0,0]};
    const midpoint=[(longest.a[0]+longest.b[0])/2,(longest.a[1]+longest.b[1])/2];
    const tangent=[longest.b[0]-longest.a[0],longest.b[1]-longest.a[1]];
    const count=Math.max(0,Math.floor(Number(barrierCount))), placements=[];
    const point=(segment,distance)=>segment.a.map((v,i)=>v+(segment.b[i]-v)*distance/segment.length);
    // Keep each individual barrier inside its own 28px target, with a small gap.
    for (const segment of [...segments].sort((a,b)=>b.length-a.length)) {
      if (placements.length===count) break;
      const capacity=segment.length>32?Math.floor((segment.length-28)/30)+1:0;
      for (let take=Math.min(count-placements.length,capacity);take>0;take--) {
        const group=Array.from({length:take},(_,i)=>{
          const distance=segment.length/2+(i-(take-1)/2)*30;
          return {segment,distance,center:point(segment,distance)};
        });
        if (group.some(p=>placements.some(q=>Math.hypot(p.center[0]-q.center[0],p.center[1]-q.center[1])<30))) continue;
        placements.push(...group);break;
      }
    }
    placements.sort((a,b)=>a.segment.index-b.segment.index || a.distance-b.distance);
    const barriers=placements.map(p=>{
      const {segment,distance}=p,ux=(segment.b[0]-segment.a[0])/segment.length,uy=(segment.b[1]-segment.a[1])/segment.length;
      const at=(d,offset=0)=>[p.center[0]+ux*d-uy*offset,p.center[1]+uy*d+ux*offset];
      return {segment:segment.index,distance,center:p.center,tangent:[ux,uy],before:at(-2),after:at(2),stem:polyline([at(0,-5),at(0,5)]),caps:polyline([at(-2,-5),at(2,-5)])+' '+polyline([at(-2,5),at(2,5)])};
    });
    const sections=[];let current=[clean[0]];
    for (const segment of segments) {
      for (const barrier of barriers.filter(b=>b.segment===segment.index)) {
        current.push(barrier.before);sections.push(current);current=[barrier.after];
      }
      current.push(segment.b);
    }
    sections.push(current);
    let head=null,rails=[];
    if (kind==='recovery') {
      const last=sections.at(-1),a=last.at(-2),tip=last.at(-1);
      const length=Math.hypot(tip[0]-a[0],tip[1]-a[1]),ux=(tip[0]-a[0])/length,uy=(tip[1]-a[1])/length;
      const size=Math.min(7,length/2),halfWidth=size*4/7;
      const base=[tip[0]-ux*size,tip[1]-uy*size];
      head={tip,d:polyline([[base[0]-uy*halfWidth,base[1]+ux*halfWidth],tip,[base[0]+uy*halfWidth,base[1]-ux*halfWidth]])+' Z'};
      rails=sections.flatMap((section,index)=>{
        const trimmed=index===sections.length-1?section.slice(0,-1).concat([base]):section;
        const corners=roundedCorners(trimmed);
        return [-1.25,1.25].map(offset=>({d:roundedPath(offsetPolyline(trimmed,offset),corners,offset),section:index,offset}));
      });
    }
    return {d:sections.map(p=>roundedPath(p)).join(' '),sections:sections.map(p=>({d:roundedPath(p)})),rails,barriers,barrier:barriers[0] || null,head,midpoint,tangent};
  }
  function draw() {
    const map=document.querySelector('#pathway-map'), svg=document.querySelector('#map-connections'), route=document.querySelector('#a1-route'), controls=document.querySelector('#stpa-barrier-controls');
    if (!map?.offsetWidth || !svg || !route || !map.classList.contains('stpa-active')) {
      if (controls) controls.innerHTML='';
      return;
    }
    const focused=document.activeElement?.closest?.('.a1-route-barrier')?.dataset;
    const focusedRoute=focused?.safeguard, focusedConstraint=focused?.constraint;
    const buttons=[];
    const bounds=map.getBoundingClientRect(),routeBox=route.getBoundingClientRect();
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    const mobile=matchMedia('(max-width: 740px)').matches, links=projectedLinks();
    const rect=element=>{
      const b=element.getBoundingClientRect();
      return {left:b.left-bounds.left,right:b.right-bounds.left,top:b.top-bounds.top,bottom:b.bottom-bounds.top,width:b.width,height:b.height};
    };
    const cells=Array.from(route.querySelectorAll('.a1-cell')).map(rect);
    const headings=Array.from(route.querySelectorAll('.a1-region-heading')).map(rect);
    const minLeft=Math.min(...cells.map(c=>c.left));
    const all=[];
    for (const link of links) {
      const from=targetButton(link.from),to=targetButton(link.to);
      if (!from || !to) continue;
      const a=rect(from),b=rect(to),ac=rect(from.closest('.a1-cell')),bc=rect(to.closest('.a1-cell'));
      const sameColumn=Math.abs(ac.left-bc.left)<3;
      const wing=from.closest('.a1-region')?.dataset.wing;
      const fromSide=mobile?'left':sameColumn?(wing==='after' || wing==='centre'?'right':'left'):bc.left>ac.left?'right':'left';
      const toSide=mobile || sameColumn?fromSide:fromSide==='right'?'left':'right';
      all.push({link,a,b,ac,bc,from,to,sameColumn,wing,fromSide,toSide});
    }
    // Keep incoming tips separate from outgoing lines on the same edge of a card.
    const attachments=new Map();
    for (const entry of all) {
      for (const [id,side,box,peer,key] of [[entry.link.from,entry.fromSide,entry.a,entry.b,'y1'],[entry.link.to,entry.toSide,entry.b,entry.a,'y2']]) {
        const groupKey=id+':'+side;
        if (!attachments.has(groupKey)) attachments.set(groupKey,[]);
        attachments.get(groupKey).push({entry,box,key,order:peer.top+peer.height/2});
      }
    }
    for (const group of attachments.values()) {
      group.sort((a,b)=>a.order-b.order);
      group.forEach((port,index)=>{
        const step=Math.min(12,port.box.height/(group.length+1));
        port.entry[port.key]=port.box.top+port.box.height/2+(index-(group.length-1)/2)*step;
      });
    }
    const mobileLanes=[];
    const sideLanes=new Map();
    const reserveLane=(lanes,low,high)=>{
      let lane=lanes.findIndex(intervals=>intervals.every(([l,h])=>high<l || low>h));
      if (lane<0) { lane=lanes.length; lanes.push([]); }
      lanes[lane].push([low,high]);
      return lane;
    };
    const paths=all.map(entry=>{
      const {link,a,b,ac,bc,sameColumn,wing,fromSide,y1,y2}=entry, kind=link.kind || link.type || 'contribution';
      let points;
      if (mobile) {
        const lane=reserveLane(mobileLanes,Math.min(y1,y2)-3,Math.max(y1,y2)+3);
        const x=kind==='recovery'?Math.max(7,minLeft-60):Math.max(7,minLeft-15-lane*8);
        points=[[a.left-2,y1],[x,y1],[x,y2],[b.left-5,y2]];
      } else if (sameColumn) {
        const rightSide=fromSide==='right', key=wing+':'+fromSide;
        if (!sideLanes.has(key)) sideLanes.set(key,[]);
        const lane=reserveLane(sideLanes.get(key),Math.min(y1,y2)-3,Math.max(y1,y2)+3);
        const edge=rightSide?Math.max(ac.right,bc.right):Math.min(ac.left,bc.left);
        const nextEdge=rightSide?Math.min(bounds.width-5,...cells.filter(c=>c.left>edge+3).map(c=>c.left)):Math.max(5,...cells.filter(c=>c.right<edge-3).map(c=>c.right));
        const offset=kind==='recovery'?Math.min(60,Math.max(12,Math.abs(nextEdge-edge)-12)):17+lane*8;
        const x=Math.max(8,Math.min(bounds.width-8,edge+(rightSide?offset:-offset)));
        points=rightSide?[[a.right+2,y1],[x,y1],[x,y2],[b.right+5,y2]]:[[a.left-2,y1],[x,y1],[x,y2],[b.left-5,y2]];
      } else {
        const forward=bc.left>ac.left, x1=forward?a.right+2:a.left-2,x2=forward?b.left-5:b.right+5;
        const between=cells.filter(c=>forward?c.left>ac.right+3 && c.right<bc.left-3:c.left>bc.right+3 && c.right<ac.left-3);
        const betweenHeadings=headings.filter(h=>forward?h.left>ac.right && h.right<bc.left:h.left>bc.right && h.right<ac.left);
        if (between.length && !clearSegment([x1,y1],[x2,y2],[...between,...betweenHeadings])) {
          // Obstructed spans pass above the cards with rounded turns.
          const top=routeBox.top-bounds.top+7;
          const startInset=kind==='feedback'?10:20;
          const startLane=forward?ac.right+startInset:ac.left-startInset,endLane=forward?bc.left-20:bc.right+20;
          points=[[x1,y1],[startLane,y1],[startLane,top],[endLane,top],[endLane,y2],[x2,y2]];
        } else {
          // A clear span needs no bend, including across an empty middle column.
          points=[[x1,y1],[x2,y2]];
        }
      }
      const safeguard=proposedSafeguard(link), proposed=proposedBarrier(link.id);
      const geometry=connectionGeometry(kind,points,proposed?.controls.length || 0);
      geometry.barriers.forEach((mark,index)=>buttons.push(barrierButton(proposed,proposed.controls[index],mark.center,map.dataset.selectedSafeguard,map.dataset.selectedConstraint)));
      const marker=kind==='feedback'?'stpa-arrow-feedback':'stpa-arrow';
      const classes=`stpa-connection${kind==='optional'?' is-optional':''}${kind==='feedback'?' is-feedback':''}`;
      const route=kind==='recovery'
        ? geometry.rails.map(rail=>`<path class="stpa-recovery-rail" d="${rail.d}"/>`).join('')+(geometry.head?`<path class="stpa-recovery-tip" d="${geometry.head.d}"/>`:'')
        : geometry.sections.map((section,index)=>`<path class="${classes}" d="${section.d}"${index===geometry.sections.length-1?` marker-end="url(#${marker})"`:''}/>`).join('');
      const protection=geometry.barriers.map((mark,index)=>`<g class="stpa-proposed-barrier${map.dataset.selectedSafeguard===link.id && map.dataset.selectedConstraint===proposed.controls[index].id?' is-selected':''}" data-constraint="${esc(proposed.controls[index].id)}" aria-hidden="true"><path class="a1-barrier-stem" d="${mark.stem}"/><path class="a1-barrier-caps" d="${mark.caps}"/></g>`).join('');
      return `<g class="stpa-edge${kind==='recovery'?' is-recovery':''}" data-link="${esc(link.id || link.from+'→'+link.to)}" data-from="${esc(link.from)}" data-to="${esc(link.to)}"><title>${esc(link.label || 'Possible contribution')}${safeguard?` — Proposed barrier: ${esc(safeguard)}`:''}</title>${route}${protection}</g>`;
    }).join('');
    const marker=(id,color)=>`<marker id="${id}" viewBox="0 0 8 8" refX="7" refY="4" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto"><path d="M1.5 1.5 6.5 4 1.5 6.5" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></marker>`;
    const feedbackMarker='<marker id="stpa-arrow-feedback" viewBox="0 0 12 8" refX="11" refY="4" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="8" orient="auto"><path d="m1 1 4 3-4 3m5-6 4 3-4 3" fill="none" stroke="#928896" stroke-width="1.1"/></marker>';
    svg.innerHTML=`<defs>${marker('stpa-arrow','#928896')}${feedbackMarker}</defs>${paths}`;
    if (controls) {
      controls.innerHTML=buttons.join('');
      if (focusedRoute) Array.from(controls.querySelectorAll('[data-safeguard]')).find(button=>button.dataset.safeguard===focusedRoute && button.dataset.constraint===focusedConstraint)?.focus({preventScroll:true});
    }
  }
  window.AuspexSTPA={get model(){return model;},get overlayNames(){return overlayNames();},use,has,node,renderMap,analysis,guide,research,staticPage,draw,projectedLinks,targetButton,barrierGlyph,conditionLabel,barrierStates,barriers,barrierView,stateGuide,sourceNumber,notedTitle,mapGuide,pathsGuide,routeDefinitions,overlayAnchor,tentativeConnection,overlayGuide,contextCloud,connectionGeometry,clearSegment,routeSymbol,proposedBarriers,proposedBarrier,proposedBarrierView,incidentBarrierReading,barrierCardHeading,barrierButton};
})();
