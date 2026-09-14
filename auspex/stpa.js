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
  const cite = ids => `<span class="stpa-citations">${list(ids).map(id => source(id) ? `<a href="${esc(source(id).url)}" target="_blank" rel="noopener noreferrer" title="${esc(source(id).title)}">${esc(id)} ↗</a>` : '').join('')}</span>`;
  const tag = s => `<span class="stpa-id">${esc(s)}</span>`;
  const refs = ids => list(ids).map(tag).join(' ');
  const control = id => byId(model.constraints,id);
  const controller = id => byId(model.controllers,id) || {title: id};
  const conditionNames = {reinforced:'Reinforced', intact:'Holding', degrading:'Crumbling', failed:'Broken', unknown:'Unassessed'};
  const conditionLabel = condition => conditionNames[condition] || conditionNames.unknown;
  const conditionKey = condition => Object.hasOwn(conditionNames, condition) ? condition : 'unknown';
  const glyphPaths = {
    reinforced: '<path d="M12 5v22M19 5v22M10 5h11M10 27h11"/>',
    intact: '<path d="M16 5v22M12 5h8M12 27h8"/>',
    degrading: '<path d="M16 5v7l-3 3 5 3-2 3v6M12 5h8M12 27h8"/><path class="stpa-glyph-fragment" d="m22 13 2 2m-14 7-2 2"/>',
    failed: '<path d="M14 5v7l-3 3M21 20l-3 3v5M10 5h8M14 28h8"/>',
    unknown: '<path class="stpa-glyph-unknown" d="M16 4v3m0 18v3"/><path d="M12 12c0-5 8-5 8 0 0 3-4 3-4 6m0 3h0"/>'
  };
  function barrierGlyph(condition) {
    const key=conditionKey(condition);
    return `<svg class="stpa-barrier-glyph is-${key}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path class="stpa-glyph-flow" d="M2 16h8m13 0h7m-3-3 3 3-3 3"/>${glyphPaths[key]}</svg>`;
  }
  const overlayNames = () => Object.fromEntries(Object.entries(model.presentation?.overlays || {}).map(([id,o])=>[id,o.title]));
  const projectedLinks = () => list(model.links);
  const use = id => { const next=registry()[id]; if (!next) return false; model=next; return true; };
  const has = id => Boolean(registry()[id]);
  function overlayConfig(a) { return a && model.presentation?.overlays?.[a.incident]; }
  function overlayAnchor(a) {
    const config=overlayConfig(a);
    if (!config) return null;
    if (node(config.anchor)) return config.anchor;
    if (node(config.target)) return config.target;
    const edge=projectedLinks().find(l=>l.id===config.target);
    return edge?.from || list(a.targets).find(t=>node(t.id))?.id || null;
  }
  function assessedBarriers(a,config) {
    const data=Array.isArray(config.barriers) ? Object.fromEntries(config.barriers.map(b=>[b.id,b])) : (config.barriers || {});
    const items=list(a.barriers).map(b=>({...b,...data[b.id]}));
    for (const [id,b] of Object.entries(data)) if (!items.some(x=>x.id===id)) items.push({id,...b});
    return items;
  }
  function overlay(a, inspectedBarrier) {
    const config=overlayConfig(a);
    if (!config) return '';
    const anchor=node(overlayAnchor(a)), barriers=assessedBarriers(a,config);
    const kind=config.kind || 'Source evidence';
    const relation={mechanism:'mechanism evidence',context:'context only',observed:'observed component'}[config.relation] || 'evidence overlay';
    return `<section class="a1-overlay" id="a1-overlay" data-overlay-incident="${esc(a.incident)}" data-overlay-target="${esc(config.target)}" data-overlay-anchor="${esc(anchor?.id)}" aria-label="${esc(config.title)}: evidence relevant to ${esc(anchor?.title)}">
      <p class="a1-overlay-kicker">${esc(kind)} · ${esc(relation)}</p>
      <h4 class="a1-overlay-title">${esc(config.title)}</h4>
      ${config.observed?`<p class="a1-overlay-observed"><span>Observed</span>${esc(config.observed)}</p>`:''}
      ${config.notEstablished?`<p class="a1-overlay-unestablished"><span>Not established</span>${esc(config.notEstablished)}</p>`:''}
      ${barriers.length?`<div class="a1-overlay-barriers">${barriers.map(b=>`<div class="a1-observed-control"><button data-overlay-barrier="${esc(b.id)}" aria-label="Inspect ${esc(b.title)}: ${esc(conditionLabel(b.condition))}" aria-pressed="${inspectedBarrier===b.id}" aria-controls="workspace">${barrierGlyph(b.condition)}<span><strong>${esc(b.title)}</strong><small class="a1-barrier-condition">${esc(conditionLabel(b.condition))}</small></span><span class="a1-inspect-arrow" aria-hidden="true">↗</span></button><p>${esc(b.result || b.conditionBasis || '')}</p></div>`).join('')}</div>`:'<p class="a1-no-barrier">Barrier performance not established.</p>'}
      ${config.limit && config.limit.trim() !== `${config.observed} ${config.notEstablished}`.trim()?`<p class="a1-overlay-limit">${esc(config.limit)}</p>`:''}
    </section>`;
  }
  function barrierLegend() {
    return `<div class="stpa-condition-legend" aria-label="Barrier conditions">${Object.keys(conditionNames).map(condition=>`<span>${barrierGlyph(condition)}${esc(conditionLabel(condition))}</span>`).join('')}<p>Condition describes the cited evidence. Brittleness asks how that protection changes with stronger AI or different conditions.</p></div>`;
  }
  function renderMap(selected, a, inspectedBarrier) {
    const groups={before:[],centre:[],after:[],recovery:[]};
    for (const n of model.nodes) {
      const wing=n.type==='recovery' ? 'recovery' : (groups[n.wing] ? n.wing : 'after');
      groups[wing].push(n);
    }
    const anchor=overlayAnchor(a), config=overlayConfig(a);
    const cell=n=>{
      const optional=n.type==='amplifier', mapped=config && anchor===n.id;
      const condition=model.presentation?.conditions?.[n.id];
      const label=n.shortLabel || n.title;
      return `<div class="a1-cell${optional?' is-optional':''}${mapped?' is-overlaid':''}${n.wing==='centre'?' is-centre':''}${n.type==='recovery'?' is-recovery':''}" data-cell="${esc(n.id)}">
        ${condition?`<p class="a1-condition">${esc(condition)}</p>`:''}
        <button class="a1-step" data-node="${esc(n.id)}" data-target="${esc(n.id)}" aria-pressed="${selected===n.id}" aria-controls="a1-node-note" aria-label="${esc(n.number)}. ${esc(label)}${optional?' (optional)':''}"><span class="a1-number">${esc(n.number)}</span><strong>${esc(label)}${optional?'<span class="a1-optional-label">optional</span>':''}</strong></button>
        ${mapped?overlay(a,inspectedBarrier):''}
      </div>`;
    };
    const headings={before:'Contributing conditions',centre:'Loss of control',after:'Conditional consequences',recovery:'Recovery route'};
    return `<div id="a1-route" class="a1-route${config?' has-overlay':''}" data-model-pathway="${esc(model.pathway)}" aria-label="Hypothetical pathway: contributing conditions, loss of control, conditional consequences and recovery">${['before','centre','after','recovery'].map(wing=>groups[wing].length?`<section class="a1-region a1-region-${wing}" data-wing="${wing}" aria-label="${headings[wing]}"><h3 class="a1-region-heading">${headings[wing]}</h3>${groups[wing].map(cell).join('')}</section>`:'').join('')}</div>
    <p class="a1-node-note" id="a1-node-note" tabindex="-1">${config && selected===anchor?'Evidence is attached to this component; it does not establish the rest of the pathway.':esc(node(selected)?.text || model.summary)}</p>
    <div class="a1-map-key"><span><i aria-hidden="true"></i>Possible contribution</span>${projectedLinks().some(l=>(l.kind || l.type)==='optional')?'<span><i class="is-optional" aria-hidden="true"></i>Optional route</span>':''}<span><i class="is-recovery" aria-hidden="true"></i>Recovery</span><span><i class="is-proposed" aria-hidden="true"></i>Proposed safeguard · untested</span></div>
    ${config?barrierLegend():''}`;
  }
  function targetButton(id) { return Array.from(document.querySelectorAll('#a1-route [data-node]')).find(el=>el.dataset.node===id); }
  function analysis() {
    return `<div class="stpa-analysis-body">
      <p class="stpa-provisional">Provisional STPA model. Source evidence and hypothetical scenarios are distinguished throughout; the control requirements and test questions are analyst proposals.</p>
      <section class="stpa-method-section"><h3>1. Define the purpose and boundary</h3><p>${esc(model.purpose)}</p><p>${esc(model.scope)}</p><p class="stpa-muted">${esc(model.boundary)}</p>
        <div class="stpa-register-pair"><div><h4>Losses to prevent</h4>${model.losses.map(x=>`<article><h5>${tag(x.id)} ${esc(x.title)}</h5><p>${esc(x.text)}</p></article>`).join('')}</div><div><h4>Hazardous system states</h4>${model.hazards.map(x=>`<article><h5>${tag(x.id)} ${esc(x.title)}</h5><p>${esc(x.text)} ${refs(x.losses)}</p></article>`).join('')}</div></div>
      </section>
      <section class="stpa-method-section"><h3>2. Model control and feedback</h3><p>Who can change the system, and what evidence tells them what it is actually doing?</p>
        <div class="stpa-loops">${model.controlLoops.map(l=>`<article class="stpa-loop"><div class="stpa-loop-row"><div>${tag(l.controller)}<strong>${esc(controller(l.controller).title)}</strong></div><div class="stpa-action"><span>${tag(l.id)} ${esc(l.action)}</span><span aria-hidden="true">→</span></div><div>${tag(l.process)}<strong>${esc(controller(l.process).title)}</strong></div></div><p class="stpa-feedback"><span aria-hidden="true">↶</span> Feedback: ${esc(l.feedback)}</p><p class="stpa-loop-refs">Required constraints: ${refs(l.constraints)}</p></article>`).join('')}</div>
        <details><summary>Responsibilities and assumptions</summary>${model.controllers.map(c=>`<article class="stpa-responsibility"><h4>${tag(c.id)} ${esc(c.title)}</h4><p>${esc(c.responsibility)}</p><p><strong>Feedback needed:</strong> ${esc(c.feedback)}</p><p><strong>Assumption to test:</strong> ${esc(c.assumption)}</p></article>`).join('')}</details>
        <h4>Required controls and their limits</h4><p class="stpa-muted">These are proposed constraints. Naming a control does not establish that it exists or works.</p>
        <div class="stpa-controls">${model.constraints.map(c=>`<article id="stpa-${c.id}" tabindex="-1"><h4>${tag(c.id)} ${esc(c.title)}</h4><p class="stpa-role">${esc(c.role)} · owners ${esc(c.owners.join(', '))} · ${esc(c.hazards.join(', '))}</p><p>${esc(c.text)}</p><p><strong>Test:</strong> ${esc(c.test)}</p><p><strong>Could be defeated by:</strong> ${esc(c.limit)}</p>${c.id===model.controlEvidence?.constraint?'<a href="#stpa-control-evidence">Compare source evidence ↓</a>':''}</article>`).join('')}</div>
      </section>
      <section class="stpa-method-section"><h3>3. Identify unsafe control actions</h3><p>Each entry specifies a controller, an action and the context in which that action becomes hazardous. These four categories classify unsafe control; they are not four events in a timeline.</p>
        <div class="stpa-ucas">${model.unsafeActions.map(u=>`<article><p class="stpa-role">${tag(u.id)} ${esc(u.type)}</p><h4>${esc(controller(u.controller).title)}: ${esc(u.action.toLowerCase())}</h4><p><strong>Unsafe when:</strong> ${esc(u.context)}</p><p class="stpa-trace">${refs([u.loop,...u.hazards,...u.constraints])}</p></article>`).join('')}</div>
        <p class="stpa-muted">Illustrative coverage across selected actions. A complete analysis must examine every relevant control action under all four categories.</p>
      </section>
      <section class="stpa-method-section"><h3>4. Explain the loss scenarios</h3><p>Examine both why unsafe control actions might occur and why an appropriate control action might fail to execute or achieve its intended effect.</p>
        ${model.scenarios.map(s=>`<article class="stpa-scenario"><h4>${tag(s.id)} ${esc(s.title)}</h4><p class="stpa-role">${esc(s.archetype)}</p><p>${esc(s.text)}</p><p><strong>Unresolved:</strong> ${esc(s.unknown)}</p><p class="stpa-trace">${refs([...s.ucas,...s.hazards])} · milestones ${esc(s.nodes.map(id=>node(id).number).join(', '))} ${cite(s.evidence)}</p></article>`).join('')}
      </section>
      <section class="stpa-method-section"><h3>What might limit progression?</h3><p>A safeguard, a lack of capability and a lack of opportunity have different implications as AI develops.</p><div class="stpa-limit-types">${model.limitingConditions.map(l=>`<article><h4>${esc(l.kind)}</h4><p>${esc(l.example)}</p><p>${esc(l.question)}</p></article>`).join('')}</div></section>
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
  function guide() {
    return '<p>Choose a case to see what was observed at the relevant component, then inspect a barrier and its brittleness: would it hold under more capable AI or different conditions?</p><p>The pathway is hypothetical. Evidence of a mechanism does not establish progression through the scenario.</p>';
  }
  function research() {
    return `<ul class="a1-sources">${model.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></li>`).join('')}</ul><p><a href="pathways.html#${esc(model.pathway)}">Full research notes ↗</a></p>`;
  }
  function staticPage() {
    return `<section class="stpa-static"><h2>${esc(model.title)}</h2><p>${esc(model.status)}</p><p>${esc(model.summary)}</p><p>${esc(model.numbering)}</p><p>${esc(model.presentation.fidelity)}</p>${model.nodes.map(n=>`<section><h4>${esc(n.number)} · ${esc(n.title)}</h4><p>${esc(n.role)}. ${esc(n.text)}</p><p><strong>Mechanism:</strong> ${esc(n.mechanism)}</p><p><strong>Requires:</strong> ${esc(n.requires)}</p><p>Controls: ${refs(n.constraints)} ${cite(n.sources)}</p></section>`).join('')}${analysis()}</section>`.replace(/(id="|href="#)stpa-/g, `$1${model.pathway}-stpa-`).replace(/[ \t]+\n/g, '\n');
  }
  function roundedPath(points, radius=7) {
    const clean=points.filter((point,index)=>!index || point[0]!==points[index-1][0] || point[1]!==points[index-1][1]);
    const point=p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`;
    let d=`M${point(clean[0])}`;
    for (let i=1;i<clean.length-1;i++) {
      const a=clean[i-1],b=clean[i],c=clean[i+1],ab=Math.hypot(b[0]-a[0],b[1]-a[1]),bc=Math.hypot(c[0]-b[0],c[1]-b[1]);
      const r=Math.min(radius,ab/2,bc/2);
      const enter=[b[0]+(a[0]-b[0])*r/ab,b[1]+(a[1]-b[1])*r/ab],leave=[b[0]+(c[0]-b[0])*r/bc,b[1]+(c[1]-b[1])*r/bc];
      d+=` L${point(enter)} Q${point(b)} ${point(leave)}`;
    }
    return `${d} L${point(clean[clean.length-1])}`;
  }
  function proposedSafeguard(link) {
    if (link.safeguard) return link.safeguard;
    const ids=list(link.constraints);
    const shared=ids.length ? ids : list(node(link.from)?.constraints).filter(id=>list(node(link.to)?.constraints).includes(id));
    return shared.map(id=>control(id)?.title).filter(Boolean).join('; ');
  }
  function draw() {
    const map=document.querySelector('#pathway-map'), svg=document.querySelector('#map-connections'), route=document.querySelector('#a1-route');
    if (!map?.offsetWidth || !svg || !route || !map.classList.contains('stpa-active')) return;
    const bounds=map.getBoundingClientRect(),routeBox=route.getBoundingClientRect();
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    const mobile=matchMedia('(max-width: 740px)').matches, links=projectedLinks();
    const rect=element=>{
      const b=element.getBoundingClientRect();
      return {left:b.left-bounds.left,right:b.right-bounds.left,top:b.top-bounds.top,bottom:b.bottom-bounds.top,width:b.width,height:b.height};
    };
    const cells=Array.from(route.querySelectorAll('.a1-cell')).map(rect);
    const minLeft=Math.min(...cells.map(c=>c.left));
    const all=[];
    const ports={};
    for (const link of links) {
      const from=targetButton(link.from),to=targetButton(link.to);
      if (!from || !to) continue;
      const a=rect(from),b=rect(to),ac=rect(from.closest('.a1-cell')),bc=rect(to.closest('.a1-cell'));
      all.push({link,a,b,ac,bc,from,to});
    }
    // Independent entry ports keep converging arrows visible at the destination.
    for (const entry of all) {
      const incoming=all.filter(x=>x.link.to===entry.link.to), slot=incoming.indexOf(entry)-(incoming.length-1)/2;
      ports[entry.link.from+'→'+entry.link.to]=slot*Math.min(9,entry.b.height/(incoming.length+1));
    }
    const mobileLanes=[];
    const paths=all.map((entry,index)=>{
      const {link,a,b,ac,bc,from,to}=entry, kind=link.kind || link.type || 'contribution';
      const y1=a.top+a.height/2,y2=b.top+b.height/2+ports[link.from+'→'+link.to];
      const sameColumn=Math.abs(ac.left-bc.left)<3;
      let points;
      if (mobile) {
        const low=Math.min(y1,y2)-8,high=Math.max(y1,y2)+8;
        let lane=mobileLanes.findIndex(intervals=>intervals.every(([l,h])=>high<l || low>h));
        if (lane<0) { lane=mobileLanes.length; mobileLanes.push([]); }
        mobileLanes[lane].push([low,high]);
        const x=Math.max(7,minLeft-15-lane*8);
        points=[[a.left-2,y1],[x,y1],[x,y2],[b.left-5,y2]];
      } else if (sameColumn) {
        const wing=from.closest('.a1-region')?.dataset.wing;
        const rightSide=wing==='after' || wing==='centre';
        const sameSideBefore=all.slice(0,index).filter(x=>Math.abs(x.ac.left-x.bc.left)<3 && (x.from.closest('.a1-region')?.dataset.wing===wing)).length;
        const x=rightSide?Math.max(ac.right,bc.right)+17+sameSideBefore*10:Math.min(ac.left,bc.left)-17-sameSideBefore*10;
        points=rightSide?[[a.right+2,y1],[x,y1],[x,y2],[b.right+5,y2]]:[[a.left-2,y1],[x,y1],[x,y2],[b.left-5,y2]];
      } else {
        const forward=bc.left>ac.left, x1=forward?a.right+2:a.left-2,x2=forward?b.left-5:b.right+5;
        const between=cells.filter(c=>forward?c.left>ac.right+3 && c.right<bc.left-3:c.left>bc.right+3 && c.right<ac.left-3);
        if (between.length) {
          // Skip links travel above all cards; they never cut through a middle column.
          const top=routeBox.top-bounds.top+7;
          const startLane=forward?ac.right+20:ac.left-20,endLane=forward?bc.left-20:bc.right+20;
          points=[[x1,y1],[startLane,y1],[startLane,top],[endLane,top],[endLane,y2],[x2,y2]];
        } else {
          const lane=(forward?(ac.right+bc.left):(bc.right+ac.left))/2;
          const siblings=all.filter(x=>Math.abs(x.ac.left-ac.left)<3 && Math.abs(x.bc.left-bc.left)<3);
          const offset=(siblings.indexOf(entry)-(siblings.length-1)/2)*8;
          points=[[x1,y1],[lane+offset,y1],[lane+offset,y2],[x2,y2]];
        }
      }
      const d=roundedPath(points),safeguard=proposedSafeguard(link);
      const segments=points.slice(1).map((point,i)=>({a:points[i],b:point,length:Math.hypot(point[0]-points[i][0],point[1]-points[i][1])}));
      const segment=segments.reduce((longest,current)=>current.length>longest.length?current:longest,segments[0]);
      const x=(segment.a[0]+segment.b[0])/2,y=(segment.a[1]+segment.b[1])/2,vertical=Math.abs(segment.a[0]-segment.b[0])<1;
      const crossbar=safeguard && segment.length>27?`<path class="a1-possible-barrier" d="${vertical?`M${x-7},${y}h14`:`M${x},${y-7}v14`}"><title>Proposed safeguard, not demonstrated by this pathway: ${esc(safeguard)}</title></path>`:'';
      const marker=kind==='recovery'?'stpa-arrow-recovery':'stpa-arrow';
      return `<path class="stpa-connection${kind==='optional'?' is-optional':''}${kind==='recovery'?' is-recovery':''}" data-link="${esc(link.id || link.from+'→'+link.to)}" data-from="${esc(link.from)}" data-to="${esc(link.to)}" d="${d}" marker-end="url(#${marker})"><title>${esc(link.label || 'Possible contribution')}</title></path>${crossbar}`;
    }).join('');
    const marker=(id,color)=>`<marker id="${id}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1.5 1.5 6.5 4 1.5 6.5" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></marker>`;
    svg.innerHTML=`<defs>${marker('stpa-arrow','#928896')}${marker('stpa-arrow-recovery','#6d8976')}</defs>${paths}`;
  }
  window.AuspexSTPA={get model(){return model;},get overlayNames(){return overlayNames();},use,has,node,renderMap,analysis,guide,research,staticPage,draw,projectedLinks,targetButton,barrierGlyph,conditionLabel};
})();
