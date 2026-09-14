(() => {
  'use strict';

  const data = window.AuspexData;
  if (!data?.pathways?.length) return;

  // Worked examples carry their own source-scoped assessments alongside the catalogue.
  for (const model of Object.values(window.AuspexSTPAModels || {})) {
    for (const assessment of model.assessments || []) {
      const index = data.assessments.findIndex((item) => item.id === assessment.id);
      if (index >= 0) data.assessments[index] = assessment;
      else data.assessments.push(assessment);
    }
    for (const key of ['sources', 'passages']) for (const item of model.additionalEvidence?.[key] || []) {
      if (!data.evidence[key].some((existing) => existing.id === item.id)) data.evidence[key].push(item);
    }
  }

  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
  const icons = {
    right: 'M6 4l4 4-4 4',
    down: 'M4 6l4 4 4-4',
    up: 'M8 12V4M4 8l4-4 4 4',
    forward: 'M4 8h8M8 4l4 4-4 4',
    external: 'M4 12l8-8M5 4h7v7',
    check: 'M3 8.5l3 3 7-7',
  };
  const icon = (name, className = '') => `<svg class="ui-icon ${className}" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${icons[name]}"/></svg>`;
  const pathways = new Map(data.pathways.map((p) => [p.id, p]));
  const aliases = new Map(data.pathways.flatMap((p) => [p.displayId, p.displayId.replace('-', '.')].map(label => [label.toLowerCase(), p.id])));
  const incidents = new Map(data.incidents.map((i) => [i.id, i]));
  const sources = new Map(data.evidence.sources.map((s) => [s.id, s]));
  const passages = new Map(data.evidence.passages.map((p) => [p.id, p]));
  const groups = new Map(data.groups.map((g) => [g.id, g]));
  const roles = new Map(data.typology.roles.map((r) => [r.id, r]));
  const aiStages = new Map(data.typology.aiStages.map((r) => [r.id, r]));
  const controlRoles = new Map(data.typology.barrierRoles.map((r) => [r.id, r]));
  const stpaNode = (step) => window.AuspexSTPA?.node(step.id);
  const roleLabel = (step) => stpaNode(step)?.role || step.roles.map((id) => roles.get(id).label).join(' · ');
  const stageLabel = (step) => stpaNode(step)?.role || step.aiStages.map((id) => aiStages.get(id).label).join(' · ');
  const relationLabels = { component: 'Component evidence', 'mechanism-comparison': 'Mechanism comparison', challenge: 'Evidence challenging the link', countermeasure: 'Countermeasure evidence' };
  const groupLabel = (id) => `${groups.get(id).ordinal} (${groups.get(id).shortTitle})`;
  // Family motifs encode subject matter, never severity or evidence strength.
  const familyMotifs = {
    X: '<ellipse cx="27" cy="12" rx="24" ry="10"/><ellipse cx="27" cy="12" rx="15" ry="6"/><ellipse cx="27" cy="12" rx="5" ry="2"/>',
    P: '<path d="M27 7v5H10v6m17-6v6m0-6h17v6"/><rect x="24" y="1" width="6" height="6" rx=".8" fill="currentColor"/><rect x="8" y="18" width="4" height="4" rx=".4"/><rect x="25" y="18" width="4" height="4" rx=".4"/><rect x="42" y="18" width="4" height="4" rx=".4"/>',
    W: '<g fill="currentColor" stroke="none"><path d="M12 1l11 3-11 3Z M12 9l11 3-11 3Z M12 17l11 3-11 3Z M42 1l-11 3 11 3Z M42 9l-11 3 11 3Z M42 17l-11 3 11 3Z"/></g>',
    B: '<g fill="currentColor" stroke="none"><circle cx="7" cy="9" r="3"/><circle cx="16" cy="17" r="2"/><circle cx="23" cy="6" r="2"/><circle cx="28" cy="15" r="4"/><circle cx="39" cy="6" r="3"/><circle cx="46" cy="17" r="2.5"/><circle cx="5" cy="21" r="1"/><circle cx="52" cy="7" r="1"/></g>',
    S: '<g fill="currentColor" fill-opacity=".14"><path d="M3.514 4.000 L6.514 4.000 L6.514 21.000 L3.514 21.000Z"/><path d="M18.840 4.369 L21.694 5.296 L16.440 21.464 L13.587 20.536Z"/><path d="M34.298 6.680 L36.662 8.527 L26.196 21.923 L23.832 20.077Z"/><path d="M48.986 11.201 L50.486 13.799 L35.764 22.299 L34.264 19.701Z"/></g>',
    F: '<path d="M2 6c8-9 17 9 25 0s17 9 25 0M2 12c8-9 17 9 25 0s17 9 25 0M2 18c8-9 17 9 25 0s17 9 25 0"/>',
  };
  const familyMotif = (id) => familyMotifs[id] ? `<svg class="family-motif" data-motif="${id}" viewBox="0 0 54 24" aria-hidden="true" focusable="false">${familyMotifs[id]}</svg>` : '';

  const dialog = $('#pathway-dialog');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 800px)');
  const compactMap = matchMedia('(max-width: 700px)');
  const state = { pathway: '', target: '', incident: '', barrier: '', safeguard: '', constraint: '', observation: 0, question: 0, overlay: false, exploration: false, inspect: false, strengthen: false };
  const isSTPA = (id = state.pathway) => !!window.AuspexSTPA?.has(id);
  const pathwayTitle = p => window.AuspexSTPAModels?.[p.id]?.title || p.title;
  const overlayConfig = () => window.AuspexSTPA?.model?.presentation.overlays[state.incident];
  const modelTarget = (id) => {
    if (!isSTPA()) return id;
    const config = overlayConfig();
    if (id === config?.target) return config.anchor;
    return window.AuspexSTPA.node(id)?.id || pathways.get(state.pathway)?.edges.find((edge) => edge.id === id)?.from || id;
  };
  const a1Tools = document.createElement('div');
  a1Tools.id = 'a1-overlay-tools';
  a1Tools.className = 'a1-overlay-tools';
  a1Tools.hidden = true;
  $('#causal-argument').insertBefore(a1Tools, $('#pathway-map'));
  const a1Context = document.createElement('section');
  a1Context.id = 'a1-context-panel';
  a1Context.className = 'a1-context-panel';
  a1Context.setAttribute('aria-label', '0. Context');
  $('.pathway-heading').append(a1Context);
  const a1ResearchLink = document.createElement('a');
  a1ResearchLink.className = 'a1-research-link';
  a1ResearchLink.href = 'pathways.html#X-01';
  a1ResearchLink.textContent = 'Sources ↗';
  a1ResearchLink.target = '_blank';
  a1ResearchLink.rel = 'noopener noreferrer';
  a1ResearchLink.hidden = true;
  $('#selected-pathway').append(a1ResearchLink);
  const inspection = window.AuspexInspection;
  for (const incident of data.incidents) if (incident.view) inspection.incidents[incident.id] = incident.view;
  for (const a of data.assessments) for (const b of a.barriers) if (b.view) inspection.barriers[b.id] = b.view;
  const questionNames = ['mechanism', 'evidence', 'durability', 'failure'];
  const questions = ['(How) did the barrier work?', 'What makes us think so?', 'How brittle is that protection?', 'What could make it fail?'];
  let readingKey = '';
  let sourceReturn;
  let methodReturn;

  const announce = (message) => { $('#announcement').textContent = message; };
  const pathwayAssessments = () => isSTPA() ? data.assessments.filter((a) => a.pathway === state.pathway) : [];
  const localAssessments = () => pathwayAssessments().filter((a) => a.targets.some((t) => t.id === state.target));
  const assessment = () => (isSTPA() ? pathwayAssessments() : localAssessments()).find((a) => a.incident === state.incident);
  const localBarriers = () => isSTPA() ? window.AuspexSTPA.barriers(assessment()) : [];
  const barrier = () => localBarriers().find((b) => b.id === state.barrier);
  const proposedBarrier = () => isSTPA() ? window.AuspexSTPA.proposedBarrier(state.safeguard) : null;
  const inspectedBarrier = () => state.safeguard ? proposedBarrier() : barrier();
  const observationEntries = () => assessment()?.trace?.length ? assessment().trace : inspection.incidents[state.incident]?.observations || [];
  const sourceLink = (source, text = source.title, fragment = '') => `<a href="${escape(source.url)}${fragment ? `#${escape(fragment)}` : ''}" target="_blank" rel="noopener noreferrer">${escape(text)} ${icon('external')}</a>`;
  const rich = (text) => escape(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([A-Z0-9]+)\]/g, (match, id) => {
      const source = sources.get(id);
      return source ? `<a class="citation" href="${escape(source.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(source.title)}">[${id}]</a>` : match;
    });
  const causalText = (text) => rich(text.replace(/\b\d+(?:→\d+)+\b/g, (reference) => {
    const p = pathways.get(state.pathway);
    const components = reference.split('→').map((number) => p.steps[Number(number) - 1]);
    return components.every(Boolean) ? components.map(stepLabel).join(' → ') : reference;
  }));
  const focusAndReveal = (element, returnToTop = false) => {
    element.focus({ preventScroll: true });
    if (returnToTop) window.scrollTo({ top: 0, behavior: 'instant' });
    else element.scrollIntoView({ block: 'start', behavior: reduced.matches || isSTPA() ? 'instant' : 'smooth' });
  };

  function normalize() {
    if (!pathways.has(state.pathway)) {
      Object.assign(state, { pathway: '', target: '', incident: '', barrier: '', safeguard: '', constraint: '', observation: 0, question: 0, overlay: false, exploration: false, inspect: false, strengthen: false });
      window.AuspexSTPA?.use('');
      readingKey = '';
      return;
    }
    const p = pathways.get(state.pathway);
    if (!isSTPA(p.id)) {
      Object.assign(state, { target: '', incident: '', barrier: '', safeguard: '', constraint: '', observation: 0, question: 0, overlay: false, exploration: false, inspect: false, strengthen: false });
      readingKey = '';
      return;
    }
    window.AuspexSTPA?.use(p.id);
    if (state.safeguard && !proposedBarrier()) { state.safeguard = ''; state.inspect = false; }
    state.constraint=proposedBarrier()?.controls.find(c=>c.id===state.constraint)?.id || proposedBarrier()?.controls[0]?.id || '';
    // Edge evidence keeps its assessed target; the card is positioned at an explicit anchor.
    state.target = modelTarget(state.target);
    if (!(isSTPA(p.id) ? window.AuspexSTPA.model.nodes : [...p.steps, ...p.edges]).some((target) => target.id === state.target)) {
      const initial = pathwayAssessments().find((a) => a.incident === state.incident) || pathwayAssessments()[0];
      state.target = initial?.barriers.find((b) => b.id === state.barrier)?.target
        || initial?.targets[0]?.id || p.steps[0].id;
    }
    state.target = modelTarget(state.target);
    const choices = isSTPA(p.id) ? (state.overlay ? pathwayAssessments() : []) : localAssessments();
    if (!choices.some((a) => a.incident === state.incident)) state.incident = '';
    state.overlay = Boolean(state.incident);
    state.exploration = Boolean(state.incident && overlayConfig()?.tentative && state.exploration);
    if (!state.incident && !state.safeguard) state.inspect = false;
    const barriers = localBarriers();
    if (!barriers.some((b) => b.id === state.barrier)) state.barrier = barriers[0]?.id || '';
    const key = state.safeguard ? [state.pathway, 'proposed', state.safeguard, state.constraint].join('|') : [state.pathway, state.target, state.incident, state.barrier].join('|');
    if (key !== readingKey) {
      state.observation = state.barrier
        ? inspection.barriers[state.barrier]?.observation ?? -1
        : Math.max(0, observationEntries().length - 1);
      state.question = 0;
      state.strengthen = false;
      readingKey = key;
    }
    if (!state.inspect) state.strengthen = false;
  }

  function writeLocation(replace = false) {
    const url = new URL(location.href);
    url.search = '';
    url.hash = '';
    if (state.pathway) url.searchParams.set('p', pathways.get(state.pathway).displayId);
    if (state.target) url.searchParams.set('t', state.target);
    if (state.incident) url.searchParams.set('i', state.incident);
    if (state.incident && state.exploration) url.searchParams.set('explore', '1');
    if (state.safeguard && state.inspect) { url.searchParams.set('s', state.safeguard); url.searchParams.set('c', state.constraint); }
    else if (state.barrier && (!isSTPA() || state.inspect)) url.searchParams.set('b', state.barrier);
    if (!isSTPA() && state.incident && state.observation >= 0) url.searchParams.set('o', String(state.observation));
    if (state.question && !isSTPA()) url.searchParams.set('q', questionNames[state.question]);
    if (isSTPA() && state.inspect) url.searchParams.set('inspect', '1');
    if (isSTPA() && state.inspect && state.strengthen) url.searchParams.set('strengthen', '1');
    // The interface also works when opened directly from disk.
    try {
      if (url.href !== location.href) history[replace ? 'replaceState' : 'pushState'](null, '', url);
    } catch { /* Some file:// contexts restrict history updates. */ }
  }

  function readLocation() {
    const params = new URLSearchParams(location.search);
    state.pathway = aliases.get((params.get('p') || '').toLowerCase()) || params.get('p') || '';
    state.target = params.get('t') || '';
    state.overlay = isSTPA() && params.has('i');
    state.exploration = isSTPA() && (params.get('explore') === '1' || params.get('overlay') === 'maybe');
    state.safeguard = params.get('s') || '';
    state.constraint = params.get('c') || '';
    state.inspect = isSTPA() && (Boolean(state.safeguard) || (state.overlay && (params.get('inspect') === '1' || params.has('b'))));
    state.incident = params.get('i') || '';
    state.barrier = params.get('b') || '';
    const requested = [state.pathway, state.incident, state.barrier].join('|');
    normalize();
    state.strengthen = Boolean(state.inspect && params.get('strengthen') === '1');
    const requestedObservation = Number(params.get('o'));
    if (params.has('o') && Number.isInteger(requestedObservation) && requestedObservation >= 0 && requestedObservation < observationEntries().length) state.observation = requestedObservation;
    state.question = state.pathway && state.inspect && !isSTPA() ? Math.max(0, questionNames.indexOf(params.get('q'))) : 0;
    if (requested !== [state.pathway, state.incident, state.barrier].join('|') && (params.has('i') || params.has('b') || (params.has('p') && !pathways.has(params.get('p'))))) {
      announce(state.pathway ? `${pathways.get(state.pathway).displayId} · ${pathwayTitle(pathways.get(state.pathway))}` : 'Choose a pathway');
    }
    render();
    writeLocation(true);
  }

  function sourceList(ids) {
    return `<ul class="source-list">${ids.map((id) => {
      const source = sources.get(id);
      return `<li><span class="code">${id}</span>${sourceLink(source)}</li>`;
    }).join('')}</ul>`;
  }

  function renderPassage(id) {
    const passage = passages.get(id);
    const source = sources.get(passage.source);
    return `<article class="evidence-passage" id="evidence-${escape(id)}">
      <p class="passage-link">${sourceLink(source, passage.title, passage.anchor)}<span class="locator">${escape(passage.locator)}</span></p>
      ${passage.kind === 'quote' ? `<blockquote>“${escape(passage.text)}”</blockquote>` : `<p>${escape(passage.text)}</p>`}
      <p>${escape(passage.scope)}</p>
    </article>`;
  }

  function renderIncidents() {
    const active = assessment();
    const incident = incidents.get(state.incident);
    const simplePathway = isSTPA() && !!window.AuspexSTPA;
    if (simplePathway) {
      $('#workspace').hidden = !state.inspect || !inspectedBarrier();
      $('.incident-section').hidden = $('#workspace').hidden;
      $('#incidents-title').hidden = false;
      return;
    }
    $('.incident-section').hidden = false;
    $('#workspace').hidden = false;
    $('#incidents-title').hidden = false;
    $('#incident-list').innerHTML = active ? `<div class="case-heading"><p class="case-date">${escape(incident.date)} · ${escape(incident.causalFactors.setting)}</p><h3 id="incident-${incident.id}" data-incident="${incident.id}" tabindex="-1">${escape(incident.title)}</h3></div>` : `<p class="empty-incidents">No incident assessment yet</p><button class="find-incidents" data-find-incidents>Browse documented incidents ${icon('forward')}</button>`;
    const target = active?.targets.find((t) => t.id === state.target);
    $('#incident-scope').innerHTML = active ? `<span class="target-evidence">${escape(relationLabels[active.relation])} · ${escape(target.label)}</span>${escape(active.scope)}` : '';
    $('#incident-classification').hidden = !active;
    const factors = incident?.causalFactors;
    $('#incident-factors').innerHTML = factors ? `<dl class="causal-factors">${[['Entity', factors.entity], ['Intent', factors.intent], ['Setting', factors.setting]].map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl><p>${escape(factors.note)}</p>` : '';
    const trace = observationEntries();
    $('#incident-trace').hidden = !trace.length;
    $('#incident-trace').innerHTML = trace.map((item, index) => `<li class="${index === state.observation ? 'is-current' : ''}"><button class="observation" data-observation="${index}" aria-pressed="${index === state.observation}" aria-controls="barrier-panel"><span><span class="observation-label">${escape(inspection.incidents[state.incident]?.labels[index] || '')}</span><span class="observation-text">${escape(item.text)}</span></span></button><div class="observation-sources">${evidenceButtons(item.evidence)}${index === state.observation ? `<button class="inspect-current" data-inspect-barrier>Inspect barrier ${icon('down')}</button>` : ''}</div></li>`).join('');
  }

  function evidenceButtons(ids) {
    const groups = [...new Set(ids.map((id) => passages.get(id).source))];
    return groups.map((id,index) => `<button class="source-dot" data-passages="${ids.filter((p) => passages.get(p).source === id).join(' ')}" aria-haspopup="dialog" aria-controls="source-dialog" title="${window.AuspexSTPA.sourceNumber(index)}. ${escape(sources.get(id).title)}" aria-label="Read source evidence ${window.AuspexSTPA.sourceNumber(index)}: ${escape(sources.get(id).title)}"><span class="source-disc" aria-hidden="true">${window.AuspexSTPA.sourceNumber(index)}</span></button>`).join('');
  }

  const stepLabel = (step) => stpaNode(step)?.title || step.shortLabel || window.AuspexLabels?.[state.pathway]?.[step.number - 1] || step.text;
  const targetCount = (id) => pathwayAssessments().filter((a) => a.targets.some((t) => t.id === id)).length;
  const countLabel = (count) => `${count} case${count === 1 ? '' : 's'}`;
  const shortIncidentDate = date => {
    const range=date.match(/\b(\d{4})[–-](\d{4})\b/);
    if (range) return `${range[1]}–${range[2]}`;
    const year=date.match(/\b(?:19|20)\d{2}\b/)?.[0];
    const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
    const month=date.match(new RegExp(`\\b(${months.join('|')})\\b`,'i'))?.[0];
    return month && year ? `Q${Math.floor(months.findIndex(m=>m.toLowerCase()===month.toLowerCase())/3)+1} ${year}` : year || date;
  };

  function renderEvidenceMap() {
    const p = pathways.get(state.pathway);
    if (isSTPA(p.id)) {
      const names = window.AuspexSTPA.overlayNames;
      $('#incident-rail').innerHTML = `<div class="a1-incident-ribbon" id="evidence-map-title" tabindex="-1" role="group" aria-label="Choose an incident to overlay">${pathwayAssessments().map(a=>{
        const selected=a.incident===state.incident, date=incidents.get(a.incident).date;
        return `<button class="a1-incident-branch" data-case="${a.id}" aria-pressed="${selected}" aria-controls="a1-route" title="${escape(date)}" aria-label="${selected?'Remove':'Overlay'} ${escape(names[a.incident])}. ${escape(date)}. Evidence at ${escape(window.AuspexSTPA.node(window.AuspexSTPA.overlayAnchor(a)).number)}"><span class="a1-case-date">${escape(shortIncidentDate(date))}:</span> <span class="a1-case-name">${escape(names[a.incident])}</span></button>`;
      }).join('')}</div>`;
      return;
    }
    const targets = p.steps.flatMap((s) => [s, ...p.edges.filter((e) => e.from === s.id)]);
    const mapped = targets.filter((t) => targetCount(t.id));
    const label = (t) => t.from ? `${stepLabel(p.steps.find((s) => s.id === t.from))} → ${stepLabel(p.steps.find((s) => s.id === t.to))}` : stepLabel(t);
    $('#incident-rail').innerHTML = `<div class="evidence-map-heading"><h3 id="evidence-map-title" tabindex="-1">Evidence on this pathway</h3><span>${countLabel(p.coverage.incidents.length)}</span></div><p class="coverage-note">${escape(p.coverage.note)}</p>${mapped.map((t) => `<section class="evidence-target"><h4><button data-evidence-target="${t.id}" aria-controls="step-detail" aria-label="Select ${escape(label(t))}">${escape(label(t))} ${icon('up')}</button></h4><div class="mapped-cases">${pathwayAssessments().filter((a) => a.targets.some((target) => target.id === t.id)).map((a) => {
      const incident = incidents.get(a.incident);
      return `<article class="mapped-case${a.incident === state.incident && t.id === state.target ? ' is-selected' : ''}"><button data-case="${a.id}" aria-pressed="${a.incident === state.incident && t.id === state.target}" aria-controls="workspace"><span>${escape(incident.title)} ${icon('down')}</span><small>${escape(incident.causalFactors.setting)} · ${escape(relationLabels[a.relation])}</small></button>${a.barriers.length ? a.barriers.filter((b) => b.target === t.id).map((b) => `<button class="mapped-barrier" data-map-barrier="${b.id}" data-assessment="${a.id}" aria-controls="barrier-panel"><span aria-hidden="true" class="barrier-mark">‖</span><span>${escape(b.title)}<small>${escape(b.outcome)}</small></span></button>`).join('') : '<p class="unidentified-barrier">Stopping barrier not identified</p>'}</article>`;
    }).join('')}</div></section>`).join('')}`;
  }

  function renderMap() {
    const p = pathways.get(state.pathway);
    const useSTPA = isSTPA(p.id);
    $('#pathway-map').classList.toggle('stpa-active', useSTPA);
    $('#pathway-map').dataset.selectedSafeguard = state.inspect ? state.safeguard : '';
    $('#pathway-map').dataset.selectedConstraint = state.inspect ? state.constraint : '';
    $('#stpa-barrier-controls').innerHTML = '';
    if (useSTPA) {
      $('#map-nodes').innerHTML = window.AuspexSTPA.renderMap(state.target, state.overlay ? assessment() : null, state.inspect && !state.safeguard ? state.barrier : '', evidenceButtons, state.exploration);
      $('#map-connections').innerHTML = '';
      renderEvidenceMap();
      requestAnimationFrame(drawConnections);
      return;
    }
    const selectedEdge = p.edges.find((edge) => edge.id === state.target);
    $('#map-nodes').style.setProperty('--steps', p.steps.length);
    $('#map-nodes').innerHTML = p.steps.map((step) => {
      const count = targetCount(step.id);
      const related = selectedEdge && [selectedEdge.from, selectedEdge.to].includes(step.id);
      const node = `<button class="map-node${related ? ' is-related' : ''}" data-target="${step.id}" aria-pressed="${state.target === step.id}" aria-controls="step-detail incident-list barrier-panel" aria-label="${escape(stageLabel(step))}: ${escape(stepLabel(step))}${count ? `; ${countLabel(count)}` : '; No case mapped to this component'}"><span class="map-number">${step.aiStages.map((id) => `<span>${escape(aiStages.get(id).label)}</span>`).join('')}</span><span class="map-label">${escape(stepLabel(step))}</span>${count ? `<span class="map-count">${countLabel(count)}</span>` : ''}</button>`;
      const edge = p.edges.find((item) => item.from === step.id);
      if (!edge) return node;
      const edgeCount = targetCount(edge.id);
      const label = `${edge.from.split(':')[1]} → ${edge.to.split(':')[1]}`;
      return `${node}<button class="map-edge${edgeCount ? ' has-incidents' : ''}" data-target="${edge.id}" aria-pressed="${state.target === edge.id}" aria-controls="step-detail incident-list barrier-panel" aria-label="Connection ${label}: ${escape(stepLabel(step))} to ${escape(stepLabel(p.steps[step.number]))}${edgeCount ? `; ${countLabel(edgeCount)}` : ''}"><span aria-hidden="true">→</span>${edgeCount ? `<span class="map-count">${countLabel(edgeCount)}</span>` : ''}</button>`;
    }).join('');
    renderEvidenceMap();
    requestAnimationFrame(drawConnections);
  }

  function drawConnections() {
    const p = pathways.get(state.pathway);
    const map = $('#pathway-map');
    if (!p || !map.offsetWidth) return;
    if (isSTPA(p.id)) return window.AuspexSTPA.draw();
    const bounds = map.getBoundingClientRect();
    const svg = $('#map-connections');
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const paths = p.edges.map((edge) => {
      const from = $(`#map-nodes [data-target="${edge.from}"] .map-number`).getBoundingClientRect();
      const to = $(`#map-nodes [data-target="${edge.to}"] .map-number`).getBoundingClientRect();
      const x1 = from.left + from.width / 2 - bounds.left;
      const y1 = from.top + from.height / 2 - bounds.top;
      const x2 = to.left + to.width / 2 - bounds.left;
      const y2 = to.top + to.height / 2 - bounds.top;
      let start; let end; let c1; let c2;
      if (compactMap.matches) {
        start = [x1, from.bottom - bounds.top + 3];
        end = [x2, to.top - bounds.top - 3];
        c1 = [x1, y1 + 44];
        c2 = [x2, y2 - 44];
      } else {
        start = [x1, from.top - bounds.top - 4];
        end = [x2, to.top - bounds.top - 4];
        c1 = [x1 + (x2 - x1) * .25, y1 - 50];
        c2 = [x1 + (x2 - x1) * .75, y2 - 50];
      }
      const midpoint = start.map((value, i) => (value + 3 * c1[i] + 3 * c2[i] + end[i]) / 8);
      const button = $(`#pathway-map .map-edge[data-target="${edge.id}"]`);
      button.style.left = `${compactMap.matches ? midpoint[0] - 22 : midpoint[0]}px`;
      button.style.top = `${midpoint[1]}px`;
      return `<path data-edge="${edge.id}" class="${edge.id === state.target ? 'is-selected' : ''}" d="M${start} C${c1} ${c2} ${end}" marker-end="url(#map-arrow)"/>`;
    });
    svg.innerHTML = `<defs><marker id="map-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 L7 4 L1 7" fill="none" stroke="context-stroke"/></marker></defs>${paths.join('')}`;
  }

  function renderStepDetail() {
    const p = pathways.get(state.pathway);
    const selected = isSTPA(p.id) && window.AuspexSTPA.node(state.target);
    if (selected) {
      $('#step-detail').innerHTML = `<h3 id="selection-title" class="sr-only" tabindex="-1">${selected.number} · ${escape(selected.title)}</h3>`;
      return;
    }
    const edge = p.edges.find((item) => item.id === state.target);
    const steps = edge ? p.steps.filter((step) => [edge.from, edge.to].includes(step.id))
      : p.steps.filter((step) => step.id === state.target);
    const label = steps.map(stageLabel).join(' → ');
    const full = steps.map((step) => `<p>${rich(step.text)}</p>`).join('');
    $('#step-detail').innerHTML = `<h3 id="selection-title" tabindex="-1">${escape(label)}</h3>${assessment() ? `<details class="pathway-context"><summary>Pathway context & causal roles</summary><p class="causal-role-note">${escape(steps.map(roleLabel).join(' → '))}</p>${full}</details>` : `<p class="causal-role-note">${escape(steps.map(roleLabel).join(' → '))}</p>${full}`}`;
  }

  function renderPathwayDetails() {
    const p = pathways.get(state.pathway);
    if (isSTPA(p.id)) {
      $('#pathway-details').innerHTML = window.AuspexSTPA.research();
      return;
    }
    $('#pathway-details').innerHTML = [
      ['Required conditions', p.conditions],
      ['Weakest bridge', p.weakestBridge],
      ['Variants / overlap', p.variants],
      ['Shared continuation', p.continuation],
    ].filter(([, text]) => text).map(([label, text]) => `<details><summary>${label}</summary><p>${causalText(text)}</p></details>`).join('')
      + `<details id="pathway-sources"><summary>Sources</summary><p>${rich(p.basis).replace(/^N(?=[ ,])/, '<abbr title="Source narrative or model">N</abbr>').replace(/^R(?=[ ,])/, '<abbr title="Reconstructed causal sequence">R</abbr>').replace(/^O(?=[ ,])/, '<abbr title="Observation or experiment">O</abbr>')}</p>${sourceList(p.sources)}</details>`;
  }

  function renderBarrier() {
    const p = pathways.get(state.pathway);
    const a = assessment();
    const selected = barrier();
    if (isSTPA(p.id)) {
      const proposed = proposedBarrier();
      if (!state.inspect || (!proposed && !selected)) { $('#barrier-panel').innerHTML = ''; return; }
      const context = proposed ? 'Proposed barrier / '+window.AuspexSTPA.node(proposed.from).number+' → '+window.AuspexSTPA.node(proposed.to).number : window.AuspexSTPA.overlayNames[a.incident];
      $('#barrier-panel').innerHTML = `<div class="a1-inspector-heading"><h3 id="barrier-question">${state.strengthen?'How could this barrier be stronger?':'Would this hold against more capable AI?'}</h3><button class="a1-close-inspector" data-close-inspector>Close</button></div><p class="a1-inspector-case">${escape(context)}</p><div id="barrier-reading" aria-labelledby="barrier-question">${proposed ? window.AuspexSTPA.proposedBarrierView(proposed.id,a,evidenceButtons,state.constraint,{strengthen:state.strengthen}) : window.AuspexSTPA.incidentBarrierReading(selected,evidenceButtons,{strengthen:state.strengthen})}</div>`;
      return;
    }
    if (!selected) {
      if (a) {
        $('#barrier-panel').innerHTML = `<div class="barrier-candidates"><h3>What stopped it?</h3><p class="unassessed">Not assessed</p>${window.AuspexVisual.draw({ incident: a.incident, labels: inspection.incidents[a.incident]?.labels || [], observation: state.observation, question: 0 })}<div class="source-notes">${evidenceButtons(a.evidence)}</div><details><summary>Candidate barriers</summary><p>${causalText(p.barrierCandidates)}</p></details><button class="back-to-incident" data-return-incident>${icon('right', 'icon-back')} ${escape(incidents.get(a.incident).title)}</button></div>`;
        return;
      }
      $('#barrier-panel').innerHTML = `<div class="barrier-candidates"><h3>Candidate barriers</h3><details><summary>Read proposed controls</summary><p>${causalText(p.barrierCandidates)}</p></details><details><summary>Sources</summary>${sourceList(p.sources)}</details></div>`;
      return;
    }
    const incident = incidents.get(a.incident);
    const choices = localBarriers();
    const config = inspection.barriers[selected.id];
    const answers = [selected.action, selected.efficacy, selected.durability, selected.failure];
    const evidence = selected.evidence.map((id) => passages.get(id));
    const visual = state.question === 1
      ? `<div class="evidence-board">${evidence.map((item) => `<button class="evidence-document" data-passages="${item.id}" aria-haspopup="dialog" aria-controls="source-dialog"><span class="document-mark" aria-hidden="true">▤</span><span><span class="code">${item.source}</span><strong>${escape(item.title)}</strong><span class="document-locator">${escape(item.locator)}</span></span><span aria-hidden="true">↗</span></button>`).join('')}</div>`
      : window.AuspexVisual.draw({ incident: a.incident, config, reinforcement: selected.reinforcement, labels: inspection.incidents[a.incident]?.labels || [], observation: state.observation, question: state.question, outcome: selected.outcome });
    $('#barrier-panel').innerHTML = `${choices.length > 1 ? `<div class="barrier-tabs" role="group" aria-label="Barriers">${choices.map((b) => `<button data-barrier="${b.id}" aria-pressed="${b.id === state.barrier}" aria-controls="barrier-reading">${escape(b.title)}</button>`).join('')}</div>` : ''}
      <div id="barrier-reading"><h3 class="barrier-title">${escape(selected.title)}</h3><p class="barrier-outcome"><span title="${escape(controlRoles.get(selected.role).definition)}">${escape(controlRoles.get(selected.role).label)}</span> · ${escape(selected.outcome)}</p>
      <div class="question-lenses" role="tablist" aria-label="Barrier questions">${questions.map((question, index) => `<button role="tab" id="question-${index}" data-question="${index}" aria-selected="${index === state.question}" tabindex="${index === state.question ? '0' : '-1'}" aria-controls="barrier-lens" aria-label="${data.typology.barrierQuestions[index].label}: ${question}">${data.typology.barrierQuestions[index].label}</button>`).join('')}</div>
      <div id="barrier-lens" class="barrier-lens lens-${questionNames[state.question]}" role="tabpanel" aria-labelledby="question-${state.question}" tabindex="0"><h4 class="barrier-question">${questions[state.question]}</h4><p class="question-focus">${data.typology.barrierQuestions[state.question].focus}</p>${visual}<p class="lens-answer${answers[state.question] ? '' : ' unassessed'}">${escape(answers[state.question] || 'Not assessed')}</p>${state.question === 2 ? renderRobustness(selected) : ''}<div class="source-notes">${evidenceButtons(selected.evidence)}</div></div>
      <button class="back-to-incident" data-return-incident>${icon('right', 'icon-back')} ${escape(incident.title)}</button></div>`;
  }

  function renderRobustness(selected) {
    return `<div class="robustness-context">${selected.reinforcement ? `<details class="reinforcement"><summary>Possible reinforcement</summary><p class="proposal-status">${escape(selected.reinforcement.basis)}</p><p>${escape(selected.reinforcement.proposal)}</p><h5>What to test</h5><p>${escape(selected.reinforcement.test)}</p></details>` : ''}</div>`;
  }

  function render() {
    const p = pathways.get(state.pathway);
    $('.opening-shell').classList.toggle('is-focused', !!p);
    $('.opening-shell').inert = !!p;
    $('.opening-shell').setAttribute('aria-hidden', String(!!p));
    $('#app').dataset.pathway = p?.id || '';
    const enhanced = !!p && isSTPA(p.id);
    $('#app').dataset.stpa = String(enhanced);
    $('#app').dataset.incidentSelected = String(Boolean(state.incident));
    a1Context.hidden = !enhanced;
    if (enhanced) a1Context.innerHTML = window.AuspexSTPA.contextCloud();
    $('#app').dataset.blank = String(!!p && !enhanced);
    $('#causal-argument').hidden = !!p && !enhanced;
    a1ResearchLink.href = `pathways.html#${p?.id || 'X-01'}`;
    a1Tools.hidden = !enhanced;
    a1ResearchLink.hidden = !enhanced;
    if (enhanced) a1Tools.append($('#incidents-title'), $('#incident-rail'));
    else {
      $('.incident-section').prepend($('#incidents-title'));
      $('#causal-argument').append($('#incident-rail'));
    }
    $('#incidents-title .section-label').textContent = enhanced ? 'Overlay an incident' : 'Trace the incidents';
    $('.incident-section').setAttribute('aria-labelledby', enhanced ? 'barrier-section-title' : 'incidents-title');
    if (isSTPA(p?.id)) $('#causal-argument').open = true;
    $('.research-details > summary').textContent = isSTPA(p?.id) ? 'Sources' : 'Assumptions & sources';
    $('#pathway-overview').hidden = !!p;
    $('#selected-pathway').hidden = !p;
    $('#all-pathways').hidden = !p;
    $('#app').dataset.group = p?.group || '';
    $('.skip').href = enhanced ? '#incidents-title' : p ? '#pathway-title' : '#choose-title';
    $('.skip').textContent = enhanced ? 'Overlay an incident' : 'Choose a pathway';
    if (!p) {
      document.title = 'Auspex';
      $('#pathway-family').textContent = '';
      $('#selected-code').textContent = '';
      $('#selected-name').textContent = '';
      renderOverview();
      return;
    }
    $('#selected-code').textContent = p.displayId;
    const selectedTitle = pathwayTitle(p);
    $('#selected-name').textContent = selectedTitle;
    $('#choose-pathway').setAttribute('aria-label', `Choose a pathway: ${p.displayId} · ${selectedTitle}`);
    $('#pathway-family').innerHTML = `${familyMotif(p.group)}<span>${escape(groupLabel(p.group))}</span>`;
    const endpoint = p.endpoint.split(';')[0];
    $('#pathway-endpoint').textContent = endpoint.charAt(0).toUpperCase() + endpoint.slice(1);
    $('#pathway-endpoint').hidden = isSTPA(p.id);
    document.title = `Auspex · ${p.displayId}`;
    if (!enhanced) {
      $('#workspace').hidden = true;
      for (const selector of ['#map-nodes','#map-connections','#stpa-barrier-controls','#incident-rail','#step-detail','#barrier-panel','#pathway-details']) $(selector).innerHTML = '';
      return;
    }
    renderStepDetail();
    renderIncidents();
    renderMap();
    renderPathwayDetails();
    renderBarrier();
  }

  function selectPathway(id, reveal = false) {
    if (!pathways.has(id)) return;
    const enteringPathway = !state.pathway;
    state.pathway = id;
    state.overlay = false;
    state.exploration = false;
    state.inspect = false;
    state.target = '';
    state.incident = '';
    state.barrier = '';
    state.safeguard = '';
    $('#causal-argument').open = true;
    $('#incident-classification').open = false;
    normalize();
    render();
    writeLocation();
    announce(`${pathways.get(id).displayId} · ${pathwayTitle(pathways.get(id))}`);
    if (reveal) focusAndReveal($('#pathway-title'), enteringPathway);
  }

  const searchable = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const searchIndex = new Map(data.pathways.map((p) => [p.id, searchable([
    p.id, p.displayId, p.displayId.replace('-', '.'), pathwayTitle(p), data.groups.find(g=>g.id===p.group).title,
    ...(isSTPA(p.id) ? [p.title, p.endpoint, p.conditions, p.basis, p.variants,
    p.reach.local, p.reach.systemic || '', p.steps.flatMap((s) => [...s.roles.map((id) => roles.get(id).label), ...s.aiStages.map((id) => aiStages.get(id).label)]).join(' '),
    data.groups.find((g) => g.id === p.group).title,
    p.steps.map((s) => s.text).join(' '),
    p.sources.map((id) => sources.get(id).title).join(' '),
    ...data.assessments.filter((a) => a.pathway === p.id).flatMap((a) => [
      incidents.get(a.incident).title, a.scope,
      ...incidents.get(a.incident).sources.map((id) => sources.get(id).title),
      ...(a.trace || []).map((entry) => entry.text),
    ]),] : []),
  ].join(' '))]));

  function renderOverview() {
    const terms = searchable($('#overview-search').value.trim()).split(/\s+/).filter(Boolean);
    const results = matchingPathways(terms);
    $('#overview-count').textContent = terms.length ? `${results.length} pathway${results.length===1?'':'s'}` : '';
    $('#overview-incidents').innerHTML = incidentResults(terms);
    $('#overview-groups').innerHTML = results.length ? data.groups.map((group) => {
      const members = results.filter((p) => p.group === group.id);
      if (!members.length) return '';
      return `<details class="overview-group${group.id === 'H' ? ' comparisons' : ''}" data-group="${group.id}"${terms.length ? ' open' : ''}><summary><span class="cluster-index">${group.ordinal}</span><span class="cluster-text">${escape(group.shortTitle)}</span>${familyMotif(group.id)}<small class="cluster-count">${members.length} ${group.id === 'H' ? 'comparison' : 'pathway'}${members.length===1?'':'s'}</small></summary><ul>${members.map((p) => {
        const count = isSTPA(p.id) ? data.assessments.filter((a) => a.pathway === p.id).length : 0;
        return `<li><button class="overview-pathway" data-overview-pathway="${p.id}"><span class="code">${p.displayId}</span><span>${escape(pathwayTitle(p))}${count ? `<small class="pathway-coverage">${countLabel(count)}</small>` : ''}</span>${icon('right', 'choice-icon')}</button></li>`;
      }).join('')}</ul></details>`;
    }).join('') : '<p class="no-results">No matching pathways</p>';
  }
  $('#overview-search').addEventListener('input', renderOverview);
  $('#overview-search').addEventListener('keydown', (event) => {
    if (!['Enter', 'ArrowDown'].includes(event.key)) return;
    const first = $('#overview-incidents [data-search-incident]') || $('#overview-groups [data-overview-pathway]');
    if (!first) return;
    event.preventDefault();
    if (event.key === 'Enter') first.click();
    else {
      if (first.closest('details')) first.closest('details').open = true;
      first.focus();
    }
  });
  $('#overview-groups').addEventListener('click', (event) => {
    const button = event.target.closest('[data-overview-pathway]');
    if (button) selectPathway(button.dataset.overviewPathway, true);
  });
  function incidentResults(terms, all = false) {
    if (!terms.length && !all) return '';
    const text = (a) => searchable(`${a.incident} ${incidents.get(a.incident).title} ${a.scope}`);
    const candidates = data.assessments.filter((a) => isSTPA(a.pathway) && terms.every((term) => text(a).includes(term)));
    const words = termPatterns(terms);
    const exact = candidates.filter((a) => words.every((word) => word.test(text(a))));
    const matches = exact.length ? exact : candidates;
    return matches.length ? `<section class="incident-matches"><h3>Incidents</h3>${matches.map((a) => `<button class="incident-result" data-search-incident="${a.id}"><span>${escape(incidents.get(a.incident).title)}</span><span class="code">${pathways.get(a.pathway).displayId} ${icon('right', 'choice-icon')}</span></button>`).join('')}</section>` : '';
  }
  function selectIncident(id) {
    const a = data.assessments.find((item) => item.id === id);
    if (!a) return;
    const enteringPathway = !state.pathway;
    state.pathway = a.pathway;
    state.overlay = isSTPA(a.pathway);
    state.exploration = false;
    state.inspect = false;
    state.target = a.targets[0].id;
    state.incident = a.incident;
    state.barrier = '';
    state.safeguard = '';
    $('#causal-argument').open = true;
    $('#incident-classification').open = false;
    normalize();
    render();
    writeLocation();
    focusAndReveal(isSTPA(a.pathway) ? $('#incidents-title') : $(`#incident-${a.incident}`), enteringPathway);
    announce(incidents.get(a.incident).title);
  }
  $('#overview-incidents').addEventListener('click', (event) => {
    const result = event.target.closest('[data-search-incident]');
    if (result) selectIncident(result.dataset.searchIncident);
  });
  function showOverview() {
    state.pathway = '';
    normalize();
    $('#overview-search').value = '';
    render();
    writeLocation();
    focusAndReveal($('#choose-title'), true);
    announce('Choose a pathway');
  }
  $('#all-pathways').addEventListener('click', showOverview);
  $('#auspex-home').addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showOverview();
  });

  function renderResults() {
    const terms = searchable($('#pathway-search').value.trim()).split(/\s+/).filter(Boolean);
    const results = matchingPathways(terms);
    $('#search-count').textContent = String(results.length).padStart(2, '0');
    $('#pathway-results').innerHTML = incidentResults(terms) + (results.length ? data.groups.map((group) => {
      const members = results.filter((p) => p.group === group.id);
      if (!members.length) return '';
       return `<section class="result-group${group.id === 'H' ? ' comparison-group' : ''}" data-group="${group.id}" aria-labelledby="group-${group.id}"><h3 id="group-${group.id}">${familyMotif(group.id)}${escape(groupLabel(group.id))}<span>${members.length}</span></h3><ul>${members.map((p) => `<li><button class="pathway-result" data-pathway="${p.id}" aria-current="${p.id === state.pathway}"><span class="code">${p.displayId}</span><span>${escape(pathwayTitle(p))}</span>${icon(p.id === state.pathway ? 'check' : 'right', 'choice-icon result-arrow')}</button></li>`).join('')}</ul></section>`;
    }).join('') : '<p class="no-results">No matching pathways</p>');
    $('#pathway-results').scrollTop = 0;
  }

  function matchingPathways(terms) {
    const matches = data.pathways.filter((p) => terms.every((term) => searchIndex.get(p.id).includes(term)));
    const words = termPatterns(terms);
    const exact = matches.filter((p) => words.every((word) => word.test(searchIndex.get(p.id))));
    return exact.length ? exact : matches;
  }
  function termPatterns(terms) {
    return terms.map((term) => new RegExp(`(^|\\W)${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\W|$)`));
  }

  $('#choose-pathway').addEventListener('click', () => {
    $('#dialog-title').textContent = 'Choose a pathway';
    $('#pathway-search').value = '';
    renderResults();
    // Establish the return target even when Safari did not focus the click.
    $('#choose-pathway').focus({ preventScroll: true });
    dialog.showModal();
    $('#choose-pathway').setAttribute('aria-expanded', 'true');
    $('#pathway-search').focus({ preventScroll: true });
  });
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => $('#choose-pathway').setAttribute('aria-expanded', 'false'));
  // Only backdrop clicks dismiss; dragging from inside the dialog does not.
  let backdropStart = false;
  dialog.addEventListener('pointerdown', (event) => {
    const rect = dialog.getBoundingClientRect();
    backdropStart = event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && backdropStart) dialog.close();
    backdropStart = false;
  });
  $('#pathway-search').addEventListener('input', renderResults);
  $('#pathway-results').addEventListener('click', (event) => {
    const incident = event.target.closest('[data-search-incident]');
    if (incident) {
      dialog.close();
      selectIncident(incident.dataset.searchIncident);
      return;
    }
    const button = event.target.closest('[data-pathway]');
    if (!button) return;
    dialog.close();
    selectPathway(button.dataset.pathway, true);
  });
  dialog.addEventListener('keydown', (event) => {
    // Search inputs can otherwise consume Escape to clear their own value.
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
      $('#choose-pathway').focus({ preventScroll: true });
      return;
    }
    const buttons = [...dialog.querySelectorAll('[data-pathway], [data-search-incident]')];
    const index = buttons.indexOf(event.target);
    const input = event.target === $('#pathway-search');
    if (input && event.key === 'Enter' && buttons.length) {
      event.preventDefault();
      buttons[0].click();
    } else if ((input || index >= 0) && ['ArrowDown', 'ArrowUp'].includes(event.key) && buttons.length) {
      event.preventDefault();
      const next = input ? (event.key === 'ArrowDown' ? 0 : buttons.length - 1)
        : Math.max(0, Math.min(buttons.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
      buttons[next].focus();
    } else if (index >= 0 && ['Home', 'End'].includes(event.key)) {
      event.preventDefault();
      buttons[event.key === 'Home' ? 0 : buttons.length - 1].focus();
    }
  });

  function clearIncident() {
    const previous = assessment()?.id;
    state.overlay = false;
    state.incident = '';
    state.barrier = '';
    state.exploration = false;
    state.inspect = Boolean(state.safeguard);
    normalize(); render(); writeLocation();
    focusAndReveal(previous ? $(`[data-case="${previous}"]`) : $('#evidence-map-title'));
    announce('Incident overlay cleared.');
  }
  $('#incident-rail').addEventListener('click', (event) => {
    const target = event.target.closest('[data-evidence-target]');
    if (target) {
      $(`#map-nodes [data-target="${target.dataset.evidenceTarget}"]`).click();
      focusAndReveal($('#selection-title'));
      return;
    }
    const mappedBarrier = event.target.closest('[data-map-barrier]');
    if (mappedBarrier) {
      const a = pathwayAssessments().find((item) => item.id === mappedBarrier.dataset.assessment);
      state.target = a.barriers.find((b) => b.id === mappedBarrier.dataset.mapBarrier).target;
      state.incident = a.incident;
      state.barrier = mappedBarrier.dataset.mapBarrier;
      normalize(); render(); writeLocation();
      focusAndReveal($('#barrier-panel'));
      announce(barrier().title);
      return;
    }
    const button = event.target.closest('[data-case]');
    if (!button) return;
    const a = pathwayAssessments().find((item) => item.id === button.dataset.case);
    if (isSTPA()) {
      if (state.incident === a.incident) { clearIncident(); return; }
      state.overlay = true;
      state.exploration = false;
      state.inspect = Boolean(state.safeguard);
      state.target = window.AuspexSTPA.overlayAnchor(a);
      state.incident = a.incident;
      state.barrier = '';
      normalize(); render(); writeLocation();
      $(`[data-case="${a.id}"]`).focus({ preventScroll: true });
      announce(`${window.AuspexSTPA.overlayNames[a.incident]} overlaid at its assessed component.${localBarriers().length ? ' Select a barrier to explore it.' : ''}`);
      return;
    }
    state.target = a.targets[0].id;
    state.incident = a.incident;
    state.barrier = '';
    normalize();
    render();
    writeLocation();
    focusAndReveal($(`#incident-${state.incident}`));
  });
  $('#incident-trace').addEventListener('click', (event) => {
    const button = event.target.closest('[data-observation]');
    if (!button) return;
    state.observation = Number(button.dataset.observation);
    if (state.barrier && inspection.barriers[state.barrier]?.observation === undefined) {
      state.barrier = localBarriers().find((b) => inspection.barriers[b.id]?.observation !== undefined)?.id || state.barrier;
    }
    state.question = 0;
    renderIncidents();
    renderBarrier();
    writeLocation();
    $(`[data-observation="${state.observation}"]`).focus({ preventScroll: true });
    announce(inspection.incidents[state.incident]?.labels[state.observation] || 'Incident observation selected');
  });
  $('#pathway-map').addEventListener('click', (event) => {
    const proposed = event.target.closest('button[data-safeguard]');
    if (proposed && isSTPA()) { inspectProposedBarrier(proposed.dataset.safeguard,proposed.dataset.constraint); return; }
    if (isSTPA() && event.target.closest('[data-clear-incident]')) { clearIncident(); return; }
    if (isSTPA() && event.target.closest('[data-explore-connection]')) {
      state.exploration = !state.exploration;
      state.inspect = false;
      state.safeguard = '';
      state.target = window.AuspexSTPA.overlayAnchor(assessment(), state.exploration);
      normalize(); render(); writeLocation();
      $('[data-explore-connection]').focus({ preventScroll: true });
      announce(state.exploration ? 'Open question expanded. Its related component is highlighted.' : 'Open question collapsed.');
      return;
    }
    const overlayBarrier = event.target.closest('[data-overlay-barrier]');
    if (overlayBarrier && isSTPA()) {
      state.safeguard = '';
      state.barrier = overlayBarrier.dataset.overlayBarrier;
      state.target = localBarriers().find(b=>b.id===state.barrier).target;
      state.inspect = true;
      normalize(); renderMap(); renderIncidents(); renderBarrier(); writeLocation();
      focusAndReveal($('#barrier-panel'));
      return;
    }
    const button = event.target.closest('[data-target]');
    if (!button) return;
    state.target = button.dataset.target;
    normalize();
    renderMap();
    renderStepDetail();
    renderIncidents();
    renderBarrier();
    writeLocation();
    announce(`${$('#selection-title').textContent} · ${localAssessments().length ? countLabel(localAssessments().length) : 'No incident assessment yet'}`);
    if (narrow.matches && !$('#a1-node-note')?.hidden) focusAndReveal($('#a1-node-note') || $('#selection-title'));
    else $(`#pathway-map [data-target="${state.target}"]`).focus({ preventScroll: true });
  });
  $('#pathway-map').addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const p = pathways.get(state.pathway);
    const order = isSTPA(p.id) ? [...document.querySelectorAll('#a1-route [data-target]')].map(button => button.dataset.target)
      : p.steps.flatMap((step) => [step.id, ...p.edges.filter((edge) => edge.from === step.id).map((edge) => edge.id)]);
    const current = order.indexOf(event.target.closest('[data-target]')?.dataset.target);
    if (current < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? order.length - 1
      : Math.max(0, Math.min(order.length - 1, current + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1)));
    $(`#pathway-map [data-target="${order[next]}"]`).focus({ preventScroll: true });
  });
  function revealMap() {
    $('#causal-argument').open = true;
    drawConnections();
    focusAndReveal((isSTPA() && window.AuspexSTPA?.targetButton(state.target)) || $(`#pathway-map [data-target="${state.target}"]`));
  }
  $('#causal-argument').addEventListener('toggle', () => {
    if ($('#causal-argument').open) drawConnections();
  });
  $('#return-map').addEventListener('click', revealMap);
  $('#barrier-panel').addEventListener('click', (event) => {
    const strengthen = event.target.closest('[data-strengthen]');
    if (strengthen && isSTPA() && state.inspect) {
      state.strengthen = strengthen.dataset.strengthen === '1';
      renderBarrier(); writeLocation();
      $('#barrier-panel [data-strengthen]')?.focus({preventScroll:true});
      announce(state.strengthen ? 'Proposed change. The recorded barrier state is unchanged.' : 'Back to the barrier assessment.');
      return;
    }
    const related = event.target.closest('[data-related-barrier]');
    if (related && isSTPA()) {
      const selected = localBarriers().find(b=>b.id===related.dataset.relatedBarrier);
      if (!selected) return;
      state.safeguard = ''; state.barrier = selected.id; state.target = selected.target; state.inspect = true;
      normalize(); renderMap(); renderIncidents(); renderBarrier(); writeLocation();
      focusAndReveal($('#barrier-panel'));
      return;
    }
    if (event.target.closest('[data-close-inspector]')) {
      closeA1Inspector();
      return;
    }
    const scene = event.target.closest('[data-scene-observation]');
    if (scene) {
      state.observation = Number(scene.dataset.sceneObservation);
      renderIncidents();
      renderBarrier();
      writeLocation();
      const observation = $(`[data-observation="${state.observation}"]`);
      if (narrow.matches) focusAndReveal(observation);
      else observation.focus({ preventScroll: true });
      announce(inspection.incidents[state.incident]?.labels[state.observation]);
      return;
    }
    const button = event.target.closest('[data-barrier]');
    if (button) {
      state.barrier = button.dataset.barrier;
      normalize();
      renderIncidents();
      renderBarrier();
      writeLocation();
      $(`[data-barrier="${state.barrier}"]`).focus({ preventScroll: true });
      announce(barrier().title);
    }
    const question = event.target.closest('[data-question]');
    if (question && !isSTPA()) {
      state.question = Number(question.dataset.question);
      renderBarrier();
      writeLocation();
      $(`[data-question="${state.question}"]`).focus({ preventScroll: true });
    }
    if (event.target.closest('[data-return-incident]')) returnToObservation();
  });
  function returnToObservation() {
    if (isSTPA()) { closeA1Inspector(); return; }
    focusAndReveal($(`[data-observation="${state.observation}"]`) || $(`#incident-${state.incident}`));
  }
  function closeA1Inspector() {
    const safeguard = state.safeguard, constraint = state.constraint;
    state.inspect = false; state.strengthen = false;
    state.safeguard = ''; state.constraint = '';
    $('#pathway-map').dataset.selectedSafeguard = '';
    $('#pathway-map').dataset.selectedConstraint = '';
    renderIncidents(); renderBarrier(); writeLocation();
    if (safeguard) {
      drawConnections();
      const button = $(`#pathway-map [data-safeguard="${safeguard}"][data-constraint="${constraint}"]`);
      button?.setAttribute('aria-pressed','false');
      focusAndReveal(button || $('#pathway-title'));
    } else {
      renderMap();
      focusAndReveal($(`[data-overlay-barrier="${state.barrier}"]`) || $('#pathway-title'));
    }
  }
  function inspectProposedBarrier(id, constraint = '') {
    if (!window.AuspexSTPA.proposedBarrier(id)) return;
    state.safeguard = id; state.constraint = constraint; state.inspect = true;
    normalize();
    $('#pathway-map').dataset.selectedSafeguard = id;
    $('#pathway-map').dataset.selectedConstraint = state.constraint;
    renderMap(); renderIncidents(); renderBarrier(); writeLocation();
    focusAndReveal($('#barrier-panel'));
    announce(`${proposedBarrier().controls.find(c=>c.id===state.constraint).title}. This barrier is proposed, and its performance is unassessed.`);
  }
  $('#barrier-panel').addEventListener('keydown', (event) => {
    if (isSTPA()) return;
    const scene = event.target.closest('[data-scene-observation]');
    if (scene && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      scene.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return;
    }
    const tab = event.target.closest('[data-question]');
    if (!tab || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = Number(tab.dataset.question);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3
      : (current + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : 3)) % 4;
    $(`[data-question="${next}"]`).click();
  });
  document.addEventListener('click', (event) => {
    const footnote = event.target.closest('a[href^="#a1-"]');
    if (footnote && (footnote.classList.contains('a1-note-reference') || footnote.closest('.a1-footnote'))) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(footnote.getAttribute('href').slice(1));
      if (target) { event.preventDefault(); focusAndReveal(target); }
      return;
    }
    const stateInfo = event.target.closest('[data-state-info]');
    const mapInfo = event.target.closest('[data-map-guide]');
    const exploreState = event.target.closest('[data-explore-state]');
    if (exploreState) {
      $('#method-reading').innerHTML = window.AuspexSTPA.mapGuide('barriers',exploreState.dataset.exploreState);
      $(`[data-explore-state="${exploreState.dataset.exploreState}"]`).focus({ preventScroll: true });
      return;
    }
    if (stateInfo || mapInfo) {
      const wasOpen = $('#method-dialog').open;
      const section = mapInfo?.dataset.mapGuide || 'barriers';
      if (!wasOpen) {
        methodReturn = stateInfo || mapInfo;
        methodReturn.focus({ preventScroll: true });
      }
      $('#method-title').textContent = 'Path & barrier key';
      $('#method-reading').innerHTML = window.AuspexSTPA.mapGuide(section,stateInfo?.dataset.stateInfo);
      $('#method-dialog').dataset.group = $('#app').dataset.group || '';
      if (!wasOpen) $('#method-dialog').showModal();
      else $(`#method-reading [data-map-guide="${section}"]`).focus({ preventScroll: true });
      return;
    }
    if (event.target.closest('[data-show-cases]')) {
      $('#causal-argument').open = true;
      drawConnections();
      focusAndReveal($('#evidence-map-title'));
      return;
    }
    if (event.target.closest('[data-find-incidents]')) {
      $('#choose-pathway').click();
      $('#dialog-title').textContent = 'Choose an incident';
      $('#pathway-results').innerHTML = incidentResults([], true);
      $('#search-count').textContent = String(data.assessments.length);
      return;
    }
    if (event.target.closest('[data-inspect-barrier]')) {
      focusAndReveal($('#barrier-panel'));
      return;
    }
    const method = event.target.closest('[data-method]');
    if (method) {
      $('#method-title').textContent = 'How to read a pathway';
      methodReturn = method;
      method.focus({ preventScroll: true });
      const definitions = (items) => `<dl class="role-definitions">${items.map((r) => `<div><dt>${escape(r.label)}${r.parent ? `<small>${escape(r.parent)}</small>` : ''}</dt><dd>${escape(r.definition)}${r.sources ? `<p>${r.sources.map((id) => sourceLink(sources.get(id), id)).join(' · ')}</p>` : ''}</dd></div>`).join('')}</dl>`;
      const enforcement = data.typology.enforcement;
      $('#method-reading').innerHTML = isSTPA() && window.AuspexSTPA ? window.AuspexSTPA.guide() : `<p class="method-intro">Trace what AI changes, what the evidence reaches, and what each barrier depends on.</p><h3>AI-specific stages</h3><p>${escape(data.typology.aiBasis)}</p>${definitions(data.typology.aiStages)}<details><summary>Causal roles</summary><p>${escape(data.typology.basis)}</p>${definitions(data.typology.roles)}</details><h3>Evidence and scope</h3>${data.typology.rules.map((rule) => `<p>${escape(rule)}</p>`).join('')}<p>Case records include incidents, experiments, deployment and procurement reports, and historical non-AI comparisons, with settings shown beside each case. Counts describe component coverage, not independent replication or proof of a complete causal chain. “Mechanism comparison” means the mechanism was examined in a different setting. “Evidence challenging the link” and “Countermeasure evidence” can constrain a pathway rather than support its progression. The paired-bar mark locates an assessed control; its adjacent text states the outcome. Neither line thickness nor color encodes a probability or strength score.</p><h3>Barrier roles</h3>${definitions(data.typology.barrierRoles)}<h3>${escape(enforcement.title)}</h3><p>${escape(enforcement.scope)}</p><dl class="role-definitions">${enforcement.questions.map((q) => `<div><dt>${escape(q.label)}</dt><dd>${escape(q.text)}</dd></div>`).join('')}</dl><p>${escape(enforcement.limit)}</p><p>${enforcement.sources.map((id) => sourceLink(sources.get(id))).join('')}</p><h3>Entity, intent, and setting</h3><p>Incident factors adapt the MIT Risk Repository’s entity, intent, and timing dimensions. Setting records the activity actually reported; it does not assume that an evaluation model was pre-deployment. “Unresolved” preserves uncertainty about intent. These factors describe the incident, not the hypothetical catastrophe.</p><h3>Method & sources</h3><ul>${data.typology.references.map((ref) => `<li>${sourceLink(ref)}${ref.note ? `<p>${escape(ref.note)}</p>` : ''}</li>`).join('')}</ul>`;
      $('#method-dialog').dataset.group = $('#app').dataset.group || '';
      $('#method-dialog').showModal();
      return;
    }
    const button = event.target.closest('[data-passages]');
    if (!button) return;
    const ids = button.dataset.passages.split(' ').filter((id) => passages.has(id));
    if (!ids.length) return;
    sourceReturn = button;
    button.focus({ preventScroll: true });
    $('#source-reading').innerHTML = ids.map(renderPassage).join('');
    $('#source-dialog').dataset.group = $('#app').dataset.group || '';
    $('#source-dialog').showModal();
  });
  $('#close-source').addEventListener('click', () => $('#source-dialog').close());
  $('#close-method').addEventListener('click', () => $('#method-dialog').close());
  $('#method-dialog').addEventListener('close', () => {
    if (methodReturn?.isConnected) methodReturn.focus({ preventScroll: true });
  });
  $('#source-dialog').addEventListener('close', () => {
    if (sourceReturn?.isConnected) sourceReturn.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', (event) => {
    if ($('#source-dialog').open || $('#method-dialog').open) return;
    const editing = /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable;
    if (event.key === '/' && !editing && !dialog.open && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      if (state.pathway) $('#choose-pathway').click();
      else $('#overview-search').focus();
    }
    if (event.key === 'Escape' && !dialog.open && $('#barrier-panel').contains(event.target) && state.inspect) {
      event.preventDefault();
      if (isSTPA()) closeA1Inspector();
      else returnToObservation();
    }
    if (event.key === 'Escape' && !dialog.open && $('#pathway-sources')?.contains(event.target)) {
      revealMap();
    }
  });
  addEventListener('popstate', () => {
    if (dialog.open) dialog.close();
    if ($('#source-dialog').open) $('#source-dialog').close();
    if ($('#method-dialog').open) $('#method-dialog').close();
    readLocation();
    announce(state.pathway ? `${pathways.get(state.pathway).displayId} · ${pathwayTitle(pathways.get(state.pathway))}` : 'Choose a pathway');
  });

  readLocation();
  $('#app').hidden = false;
  $('#fallback').hidden = true;
  new ResizeObserver(drawConnections).observe($('#pathway-map'));
  document.fonts.ready.then(drawConnections);
  // Fit the headline to the copy's measured height, retaining the type proportions.
  const openingColumns = window.matchMedia('(min-width: 701px)');
  const fitOpening = () => {
    const title = $('#opening-title');
    const display = $('.opening-display');
    title.style.height = '';
    display.style.height = 'auto';
    display.style.fontSize = '';
    const height = $('.opening-copy > p').getBoundingClientRect().height;
    if (!openingColumns.matches) return;
    const naturalHeight = display.getBoundingClientRect().height;
    const fontSize = parseFloat(getComputedStyle(display).fontSize);
    if (!height || !naturalHeight) return;
    const scale = Math.min(1, (height - .5) / naturalHeight);
    display.style.fontSize = `${fontSize * scale}px`;
    title.style.height = `${height}px`;
    display.style.height = '100%';
  };
  new ResizeObserver(fitOpening).observe($('.opening-copy > p'));
  new ResizeObserver(() => {
    $('.opening-shell').style.setProperty('--opening-height', `${Math.ceil($('.opening').getBoundingClientRect().height)}px`);
  }).observe($('.opening'));
  openingColumns.addEventListener('change', fitOpening);
  document.fonts.ready.then(fitOpening);
  // Align badges to the capital-height center; descenders must not pull the badge down.
  const alignSectionNumeral = (heading) => {
    if (!heading.offsetHeight) return;
    const numeral = heading.querySelector('.section-numeral');
    const label = heading.querySelector('.section-label');
    const style = getComputedStyle(label);
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const bounds = context.measureText(label.textContent);
    if (CSS.supports('text-box-trim', 'trim-both')) {
      numeral.style.setProperty('--numeral-offset', '0px');
    } else {
      const probe = document.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      label.append(probe);
      const top = probe.getBoundingClientRect().top - bounds.actualBoundingBoxAscent;
      probe.remove();
      numeral.style.setProperty('--numeral-offset', '0px');
      const badge = numeral.getBoundingClientRect();
      const cap = context.measureText('H').actualBoundingBoxAscent;
      const labelCenter = top + bounds.actualBoundingBoxAscent - cap / 2;
      numeral.style.setProperty('--numeral-offset', `${labelCenter - (badge.top + badge.bottom) / 2}px`);
    }
  };
  const headingObserver = new ResizeObserver((entries) => entries.forEach(({ target }) => alignSectionNumeral(target)));
  document.querySelectorAll('.section-heading').forEach((heading) => headingObserver.observe(heading));
  document.fonts.ready.then(() => document.querySelectorAll('.section-heading').forEach(alignSectionNumeral));


})();
