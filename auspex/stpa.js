(() => {
  'use strict';
  const model = window.AuspexSTPAData;
  if (!model) return;
  const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = (list, id) => list.find(x => x.id === id);
  const node = id => byId(model.nodes, id);
  const source = id => byId(model.sources, id);
  const cite = ids => `<span class="stpa-citations">${ids.map(id => `<a href="${esc(source(id).url)}" target="_blank" rel="noopener noreferrer" title="${esc(source(id).title)}">${esc(id)} ↗</a>`).join('')}</span>`;
  const tag = s => `<span class="stpa-id">${esc(s)}</span>`;
  const refs = ids => ids.map(tag).join(' ');
  const control = id => byId(model.constraints,id);
  const controller = id => byId(model.controllers,id);
  const controlLink = id => `<a class="stpa-control-link" href="#stpa-${id}" data-stpa-open="${id}"><span aria-hidden="true">‖</span> ${esc(control(id).title)}</a>`;

  const labels = {
    'X-01:1': 'AI shapes its successor',
    'X-01:2': 'Warnings fail to stop development',
    'X-01:3': 'Checks miss hidden goals',
    'X-01:4': 'Humans lose control',
    'X-01:5': 'Rival AIs coordinate',
    'X-01:6': 'Permanent disempowerment',
    'X-01:7': 'Human extinction',
    'X-01:R': 'Control restored',
  };
  const overlayNames = Object.fromEntries(Object.entries(model.presentation.overlays).map(([id,o])=>[id,o.title]));
  const projectedLinks = () => model.links;
  function overlay(a, inspectedBarrier) {
    const config=model.presentation.overlays[a.incident];
    return `<section class="a1-overlay" id="a1-overlay" data-overlay-incident="${esc(a.incident)}" data-overlay-target="${esc(config.target)}" aria-label="${esc(config.title)} overlaid on step 03">
      <p class="a1-overlay-title">${esc(overlayNames[a.incident])}</p>
      ${a.barriers.map(b=>`<div class="a1-observed-control"><button data-overlay-barrier="${esc(b.id)}" aria-label="Inspect ${esc(b.title)}" aria-pressed="${inspectedBarrier===b.id}" aria-controls="workspace"><span class="a1-dotted-mark" aria-hidden="true"></span><span>${esc(config.barriers[b.id].title)}</span></button><p>${esc(config.barriers[b.id].result)}</p></div>`).join('')}
      <p class="a1-overlay-limit">${esc(config.limit)}</p>
    </section>`;
  }
  function renderMap(selected, a, inspectedBarrier) {
    const ids = ['X-01:1','X-01:2','X-01:3','X-01:4','X-01:R','X-01:5','X-01:6','X-01:7'];
    return `<div id="a1-route" class="a1-route${a?' has-overlay':''}" aria-label="Possible pathway with recovery and optional coordination">${ids.map(id=>{
      const n=node(id), optional=n.type==='amplifier', mapped=a?.targets.some(t=>t.id===id);
      const condition=model.presentation.conditions[id];
      return `<div class="a1-cell a1-cell-${n.number.toLowerCase()}${optional?' is-optional':''}${mapped?' is-overlaid':''}">
        ${condition?`<p class="a1-condition">${esc(condition)}</p>`:''}
        <button class="a1-step" data-node="${id}" data-target="${id}" aria-pressed="${selected===id}" aria-controls="a1-node-note" aria-label="${n.number}. ${esc(labels[id])}${optional?' (optional)':''}"><span class="a1-number">${n.number}</span><strong>${esc(labels[id])}${optional?'<span class="a1-optional-label"> (optional)</span>':''}</strong></button>
        ${mapped?overlay(a,inspectedBarrier):''}
      </div>`;
    }).join('')}</div>
    <p class="a1-node-note" id="a1-node-note" tabindex="-1">${a?.targets.some(t=>t.id===selected)?'Select a dotted barrier in the overlay to inspect it.':esc(node(selected)?.text || model.summary)}</p>
    <p class="a1-map-key">Hypothetical pathway · Dotted crossbars mark possible safeguards.</p>`;
  }
  function targetButton(id) { return document.querySelector(`#a1-route [data-node="${id}"]`); }
  function analysis() {
    return `<div class="stpa-analysis-body">
      <p class="stpa-provisional">Provisional analyst model. The scenario is drawn from AI 2027; the control requirements, causal formulation and test questions are this worked example.</p>
      <section class="stpa-method-section"><h3>1. Define the purpose and boundary</h3><p>${esc(model.purpose)}</p><p>${esc(model.scope)}</p><p class="stpa-muted">${esc(model.boundary)}</p>
        <div class="stpa-register-pair"><div><h4>Losses to prevent</h4>${model.losses.map(x=>`<article><h5>${tag(x.id)} ${esc(x.title)}</h5><p>${esc(x.text)}</p></article>`).join('')}</div><div><h4>Hazardous system states</h4>${model.hazards.map(x=>`<article><h5>${tag(x.id)} ${esc(x.title)}</h5><p>${esc(x.text)} ${refs(x.losses)}</p></article>`).join('')}</div></div>
      </section>
      <section class="stpa-method-section"><h3>2. Model control and feedback</h3><p>Who can change the system, and what evidence tells them what it is actually doing?</p>
        <div class="stpa-loops">${model.controlLoops.map(l=>`<article class="stpa-loop"><div class="stpa-loop-row"><div>${tag(l.controller)}<strong>${esc(controller(l.controller).title)}</strong></div><div class="stpa-action"><span>${tag(l.id)} ${esc(l.action)}</span><span aria-hidden="true">→</span></div><div>${tag(l.process)}<strong>${esc(controller(l.process).title)}</strong></div></div><p class="stpa-feedback"><span aria-hidden="true">↶</span> Feedback: ${esc(l.feedback)}</p><p class="stpa-loop-refs">Required constraints: ${refs(l.constraints)}</p></article>`).join('')}</div>
        <details><summary>Responsibilities and assumptions</summary>${model.controllers.map(c=>`<article class="stpa-responsibility"><h4>${tag(c.id)} ${esc(c.title)}</h4><p>${esc(c.responsibility)}</p><p><strong>Feedback needed:</strong> ${esc(c.feedback)}</p><p><strong>Assumption to test:</strong> ${esc(c.assumption)}</p></article>`).join('')}</details>
        <h4>Required controls and their limits</h4><p class="stpa-muted">These are proposed constraints. Naming a control does not establish that it exists or works.</p>
        <div class="stpa-controls">${model.constraints.map(c=>`<article id="stpa-${c.id}" tabindex="-1"><h4>${tag(c.id)} ${esc(c.title)}</h4><p class="stpa-role">${esc(c.role)} · owners ${esc(c.owners.join(', '))} · ${esc(c.hazards.join(', '))}</p><p>${esc(c.text)}</p><p><strong>Test:</strong> ${esc(c.test)}</p><p><strong>Could be defeated by:</strong> ${esc(c.limit)}</p>${c.id==='SC4'?'<a href="#stpa-control-evidence">Compare the Haruspex incident ↓</a>':''}</article>`).join('')}</div>
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
      <section class="stpa-method-section"><h3>Method and source boundaries</h3><p>${esc(model.limits)}</p><p>${esc(model.numbering)}</p><p>${esc(model.schema)}</p><p>${esc(model.bowtie)}</p><p>Proximal and distal describe causal distance from a specified event or loss. They are not fixed stages or severity ranks. Here the centre is H1; recovery and later losses are examined relative to that boundary.</p>${sourceRegister()}</section>
    </div>`;
  }
  function controlEvidence() {
    const c=model.controlEvidence;
    return `<section id="stpa-control-evidence" class="stpa-control-evidence" tabindex="-1"><p class="stpa-kicker">${esc(c.kind)} · ${tag(c.constraint)}</p><h3>${esc(c.title)}</h3><p>${esc(c.text)} ${cite([c.source])}</p><p class="stpa-muted">${esc(c.limit)}</p><div class="stpa-limit-types">${c.questions.map(q=>`<article><h4>${esc(q.title)}</h4><p>${esc(q.text)}</p></article>`).join('')}</div><a href="../haruspex/" target="_blank" rel="noopener noreferrer">Read the investigation in Haruspex ↗</a></section>`;
  }
  function sourceRegister() {
    return `<ol class="stpa-sources">${model.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><p>${esc(s.locator)}. ${esc(s.use)}</p></li>`).join('')}</ol>`;
  }
  function guide() {
    return '<p>Choose an incident to overlay its evidence on the pathway, then select a dotted barrier to inspect it.</p><p>This is a possible scenario. Each overlay provides evidence only about its mapped component.</p>';
  }
  function research() {
    return `<ul class="a1-sources">${model.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></li>`).join('')}</ul><p><a href="pathways.html#X-01">Full research notes ↗</a></p>`;
  }
  function staticPage() {
    return `<section class="stpa-static"><h2>${esc(model.title)}</h2><p>${esc(model.status)}</p><p>${esc(model.summary)}</p><p>${esc(model.numbering)}</p><p>${esc(model.presentation.fidelity)}</p>${model.nodes.map(n=>`<section><h4>${esc(n.number)} · ${esc(n.title)}</h4><p>${esc(n.role)}. ${esc(n.text)}</p><p><strong>Mechanism:</strong> ${esc(n.mechanism)}</p><p><strong>Requires:</strong> ${esc(n.requires)}</p><p>Controls: ${refs(n.constraints)} ${cite(n.sources)}</p></section>`).join('')}${analysis()}</section>`;
  }
  function draw() {
    const map=document.querySelector('#pathway-map');
    const svg=document.querySelector('#map-connections');
    if (!map?.offsetWidth || !map.classList.contains('stpa-active')) return;
    const bounds=map.getBoundingClientRect();
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    const mobile=matchMedia('(max-width: 740px)').matches;
    const links=projectedLinks();
    const paths=links.map((link,index)=>{
      const from=map.querySelector(`[data-node="${link.from}"]`);
      const to=map.querySelector(`[data-node="${link.to}"]`);
      const a=from.getBoundingClientRect(), b=to.getBoundingClientRect();
      const cell=to.closest('.a1-cell').getBoundingClientRect();
      const aCell=from.closest('.a1-cell').getBoundingClientRect();
      const incoming=links.filter(l=>l.to===link.to);
      const slot=incoming.indexOf(link)-(incoming.length-1)/2;
      const y1=a.top+a.height/2-bounds.top;
      const y2=b.top+b.height/2-bounds.top+slot*9;
      const sameColumn=Math.abs(aCell.left-cell.left)<2;
      let d, barrierX, barrierY, verticalBarrier;
      if (mobile || sameColumn) {
        const x=Math.min(aCell.left,cell.left)-bounds.left-14-(mobile?index*4:link.kind==='optional'?6:0);
        d=`M${a.left-bounds.left-2},${y1} H${x} V${y2} H${b.left-bounds.left-3}`;
        barrierX=x; barrierY=(y1+y2)/2; verticalBarrier=false;
      } else {
        const x1=a.right-bounds.left+3, x2=b.left-bounds.left-3;
        const lane=(aCell.right+cell.left)/2-bounds.left+(link.kind==='optional'?8:0);
        d=`M${x1},${y1} C${lane},${y1} ${lane},${y2} ${x2},${y2}`;
        barrierX=(x1+6*lane+x2)/8; barrierY=(y1+y2)/2; verticalBarrier=true;
      }
      const safeguards={'X-01:1/X-01:3':'Independent checks','X-01:2/X-01:4':'Action on warnings','X-01:3/X-01:4':'Access limits','X-01:4/X-01:R':'Interruption and recovery','X-01:4/X-01:6':'Resource controls'};
      const safeguard=safeguards[`${link.from}/${link.to}`];
      const crossbar=safeguard?`<path class="a1-possible-barrier" d="${verticalBarrier?`M${barrierX},${barrierY-10}v20`:`M${barrierX-10},${barrierY}h20`}"><title>Possible safeguard: ${safeguard}</title></path>`:'';
      return `<path class="stpa-connection ${link.kind==='optional'?'is-optional':''}${link.kind==='recovery'?' is-recovery':''}" data-from="${link.from}" data-to="${link.to}" d="${d}" marker-end="url(#stpa-arrow)"><title>${esc(link.label)}</title></path>${crossbar}`;
    }).join('');
    svg.innerHTML=`<defs><marker id="stpa-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="#8e919b" stroke-width="1.2"/></marker></defs>${paths}`;
  }
  window.AuspexSTPA={model,node,renderMap,analysis,guide,research,staticPage,draw,projectedLinks,targetButton,overlayNames};
})();
