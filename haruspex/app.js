(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('dataset').textContent);
  const castData = JSON.parse(document.getElementById('cast-data').textContent);
  let castUI = null;
  let scrollGateway = null;
  const researchData = JSON.parse(document.getElementById('research-data').textContent);
  const quotationData = JSON.parse(document.getElementById('quotation-data').textContent);
  const severityData = JSON.parse(document.getElementById('severity-data').textContent);
  const visualData = JSON.parse(document.getElementById('visual-data').textContent);
  const ontology = JSON.parse(document.getElementById('ontology-data').textContent);
  const temporalData = JSON.parse(document.getElementById('temporal-data').textContent);
  for (const item of researchData.supplemental_events || []) {
    data.events.push(item.event);severityData.records.push(item.assessment);temporalData.records.push(item.temporal);ontology.assignments.push(item.assignment);
    const stage=ontology.stages.find(stage=>stage.id===item.assignment.stage_id);
    ontology.lifecycle.find(life=>life.id===item.assignment.lifecycle_id).count++;
    stage.count++;stage.lifecycle_counts[item.assignment.lifecycle_id]++;if(!stage.source_ids.includes(item.event.source_id))stage.source_ids.push(item.event.source_id);
  }
  severityData.scale.values.find(value=>value.band==='unresolved').definition='The cited evidence leaves the effect, authorization, scope, or relationship to this incident unsettled. Each event explains what remains unknown. No numerical score is assigned.';
  data.sources.push(...(researchData.additional_sources || []));
const addedEvents=researchData.supplemental_events||[];
severityData.total_records=data.events.length;
severityData.counts.unresolved=41+addedEvents.length;severityData.outcome_counts.unresolved=41+addedEvents.length;
severityData.scale.display_conventions.size='Size distinguishes a single reported unit from grouped activity, not severity or the number of underlying instances.';
severityData.scale.display_conventions.shape='Circle: Reported; diamond: Reasoning; triangle: Inferred; six-point star: Accounts differ.';
severityData.scale.display_conventions.review_dispositions='Context and Unresolved are separate unordered fields. Hollow and broken outlines preserve workstream colors and evidence shapes.';
temporalData.counts.events=data.events.length;temporalData.counts.with_event_date=data.events.filter(e=>e.event_date).length;
temporalData.counts.finite_context_windows=temporalData.records.filter(e=>e.earliest_context_date&&e.latest_context_date_exclusive).length;
temporalData.counts.time_precision={};temporalData.counts.assessment_status={};
for(const record of temporalData.records){temporalData.counts.time_precision[record.time_precision]=(temporalData.counts.time_precision[record.time_precision]||0)+1;temporalData.counts.assessment_status[record.assessment_status]=(temporalData.counts.assessment_status[record.assessment_status]||0)+1;}
temporalData.scope+=' The working inventory additionally includes 20 dated wiki actions and findings from the Nightingale investigation.';
ontology.counts.events=data.events.length;ontology.counts.incident_sources=data.sources.length;ontology.counts.system_contexts=new Set(data.events.map(e=>e.system_scope)).size;
ontology.counts.lifecycle=Object.fromEntries(ontology.lifecycle.map(l=>[l.id,l.count]));ontology.counts.workstream={};
for(const item of ontology.assignments)ontology.counts.workstream[item.workstream_id]=(ontology.counts.workstream[item.workstream_id]||0)+1;
ontology.scopes.inventory='852 explorable events: 832 canonical events plus 20 wiki actions and findings in Unresolved. This is a working inventory, not a proven maximum. Wiki activity has no confirmed connection to the Hugging Face incident.';
  Object.assign(data.metadata,{version:'1.2',as_of:'2026-09-10',event_count:data.events.length,source_count:data.sources.length,canonical_event_count:832,previous_inventory_count:832,additional_events:20,additional_event_scope:'Twenty wiki actions and findings in Unresolved; connection to the Hugging Face incident unconfirmed.'});
  const temporalMap = new Map(temporalData.records.map((record) => [record.event_id, record]));
  const stageMap = new Map(ontology.stages.map((stage) => [stage.id, stage]));
  const lifecycleMap = new Map(ontology.lifecycle.map((life) => [life.id, life]));
  const assignmentMap = new Map(ontology.assignments.map((item) => [item.event_id, item]));
  const workstreamMap = new Map(visualData.groups.map((group) => [group.key, group]));
  const phaseStyles = new Map(visualData.groups.flatMap((group) => group.phases.map((phase) => [phase, group])));
  const severityMap = new Map(severityData.records.map((record) => [record.id, record]));
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const DAY = 86400000;
  const MIN_TIME_SPAN = 60000;
  let query = window.HaruspexQuery.compile('');
  const LABELS = { reported: 'Reported', reasoning: 'Reasoning', inferred: 'Inferred', disputed: 'Accounts differ' };
  const SHAPES = { reported: 'circle', reasoning: 'diamond', inferred: 'triangle', disputed: 'star-six' };
  const SOURCE_MAP = new Map(data.sources.map((source) => [source.source_id, source]));
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const parseDay = (date) => date ? Date.parse(`${date}T00:00:00Z`) : null;
  const dateFormats = [false, true].map((year) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', ...(year ? { year: 'numeric' } : {}), timeZone: 'UTC' }));
  const shortDate = (time, year = false) => dateFormats[Number(year)].format(time);
  const fullRange = [parseDay('2026-04-19'), parseDay('2026-09-05')];
  const periods = { all: fullRange, intrusion: [parseDay('2026-07-07'), parseDay('2026-07-15')], response: [parseDay('2026-07-19'), parseDay('2026-09-05')] };
  const statusOf = (event) => severityMap.get(event.id)?.evidence_status_override || ({ 'established in cited account': 'reported', 'reported reasoning or decision': 'reasoning', 'inferred by source': 'inferred', 'disputed or differing accounts': 'disputed' }[event.epistemic_status] || 'inferred');
  function timeExtent(originalEvent) {
    const event = { ...originalEvent, ...temporalMap.get(originalEvent.id) };
    if (event.event_date && event.event_time_utc) {
      const instant = Date.parse(`${event.event_date}T${event.event_time_utc}Z`);
      return { start: instant, end: instant, center: instant, kind: 'clock', openStart: false };
    }
    if (event.event_date) {
      const start = parseDay(event.event_date);
      return { start, end: start + DAY, center: start + DAY / 2, kind: 'day', openStart: false };
    }
    const start = parseDay(event.earliest_context_date);
    const end = parseDay(event.latest_context_date_exclusive);
    // An open bound stays open in the data. A midpoint is never invented for it.
    return { start, end, center: start !== null && end !== null ? (start + end) / 2 : null, kind: 'window', openStart: start === null };
  }
  const events = data.events.map((event, index) => ({ ...event, _index: index, _time: timeExtent(event), _status: statusOf(event), _search: [event.id, event.title, event.actor, event.phase, event.system_scope, event.target_detail, event.related_cve, event.event_date, event.epistemic_status].join(' ').toLowerCase() }));
  const eventMap = new Map(events.map((event) => [event.id, event]));
  const state = { investigation: null, view: 'stream', assessment: 'impact', lifecycle: 'all', stage: 'all', vertical: [0, 1], period: 'all', range: [...fullRange], search: '', workstream: 'all', severity: 'all', statuses: new Set(Object.keys(SHAPES)), selected: 'E0065', intervals: false, limit: 12, hover: null, nearby: [], interventions: false, temporal: 'all' };
  let detailTrigger = null;
  let selectedSourceAnchor=null;
  let visible = [];
  let points = [];
  let allFilteredPool = [];
  let filteredPool = [];
  let filteredIds = new Set();
  let fieldLayout = null;
  let fieldLayoutKey = "";
  const layoutCache = new Map();
  let cameraFrame = null;
  let cameraTimer = null;
  let cameraPending = false;
  let openDateLayout = [];
  let tailSegments = [];
  let plotSize = { width: 800, height: 450 };
  let timelineBackdrop = null;
  let bowBackdrop = null;
  let overviewRange = [...state.range];
  let overviewBins = [];
  let drag = null;
  let dialogTrigger = null;
  let noticeTimer;
  const timeline = $('#timeline');
  const ctx = timeline.getContext('2d');
  const overview = $('#overview');
  const octx = overview.getContext('2d');
  const detailPanel = $('#detail-panel');
  const groups = [
    { key: 'before', label: 'I. Before', roles: ['precursor'] },
    { key: 'during', label: 'II. During', roles: ['incident activity', 'decision or coordination'] },
    { key: 'after', label: 'III. After', roles: ['response or mitigation', 'investigation or aftermath'] },
  ];
  function random(seed) {
    let n = seed >>> 0;
    return () => { n = (1664525 * n + 1013904223) >>> 0; return n / 4294967296; };
  }
  function fitCanvas(canvas, context) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);
    return { width: rect.width, height: rect.height };
  }
  const bandDefinitions = severityData.scale.values.map((level) => ({
    key: level.band || String(level.score),
    symbol: level.symbol,
    name: level.label,
    label: `${level.symbol ? `${level.symbol} ` : ''}${level.label}`,
    short: level.band === 'preventive' ? '− Preventive' : `${level.symbol ? `${level.symbol} ` : ''}${level.label}`,
    definition: level.definition,
  }));
  const bandMap = new Map(bandDefinitions.map((band) => [band.key, band]));
  const legendOrder = ['preventive', '0', '1', '2', '3', '4', '5', 'context', 'unresolved'];
  const assessmentOf = (event) => ['context', 'unresolved'].includes(bandKey(event)) ? bandKey(event) : 'impact';
  const matchesAssessment = (event) => assessmentOf(event) === state.assessment;
  const weightByBand = new Map(bandDefinitions.map((band) => [band.key, Math.sqrt(events.filter((event) => bandKey(event) === band.key).length) + 1.5]));
  let baseBands = [];
  function facetBands() {
    return bandDefinitions.filter((band) => state.assessment === 'impact' ? !['context', 'unresolved'].includes(band.key) : band.key === state.assessment);
  }
  function alignAssessmentToSearch() {
    const requested = state.search.match(/(?:^|\s)severity(?:[:=]|>=?|<=?)"?(context|unresolved|preventive|near[-_]miss|[0-5])"?(?:\s|$)/i);
    const id = state.search.match(/(?:^|\s)id:([EW]\d{4})(?:\s|$)/i)?.[1]?.toUpperCase();
    const next = requested ? ['context', 'unresolved'].includes(requested[1].toLowerCase()) ? requested[1].toLowerCase() : 'impact'
      : id && eventMap.has(id) ? assessmentOf(eventMap.get(id))
      : /nightingale|wiki|collusion/i.test(state.search) ? 'unresolved' : null;
    if (next && next !== state.assessment) { state.assessment = next; state.vertical = [0, 1]; }
  }
  function syncAssessmentCounts() {
    const counts = { impact: 0, context: 0, unresolved: 0 };
    for (const event of allFilteredPool) if (overlaps(event, state.range)) counts[assessmentOf(event)] += 1;
    for (const [key, count] of Object.entries(counts)) {
      $(`#assessment-${key}-count`).textContent = count;
      const button = $(`[data-assessment="${key}"]`);
      button.setAttribute('aria-pressed', String(state.assessment === key));
      button.classList.toggle('selected', state.assessment === key);
    }
    $('#assessment-tabs').setAttribute('aria-label', 'Separate event categories. Context and Unresolved have no position on the severity scale.');
  }
  function bandKey(event) {
    const assessment = severityMap.get(event.id);
    return assessment?.score == null ? assessment?.band || 'unresolved' : String(assessment.score);
  }
  function eventStyle(event) { return phaseStyles.get(event.phase); }
  function bandLabel(event) { return bandMap.get(bandKey(event)).label; }
  function workstreamSwatch(group) {
    return `<i class="workstream-swatch" style="--workstream-fill:${group.fill}" aria-hidden="true"></i>`;
  }
  function workstreamBadge(event) {
    const group = eventStyle(event);
    return `<span class="workstream-badge" data-workstream-key="${group.key}">${workstreamSwatch(group)}${escapeHtml(group.label)}</span>`;
  }
  function bandBadge(band) {
    return `<span class="severity-badge" data-severity-key="${band.key}">${band.symbol ? `<span class="score-tile">${escapeHtml(band.symbol)}</span>` : ''}<span>${escapeHtml(band.name)}</span></span>`;
  }
  function severityBadge(event) {
    return bandBadge(bandMap.get(bandKey(event)));
  }
  function eventMark(event) {
    const band = eventStyle(event);
    const treatment = bandKey(event);
    const hollow = treatment === 'context' || treatment === 'unresolved';
    const geometry = { reported: '<circle cx="10" cy="10" r="6"/>', reasoning: '<path d="M10 2L18 10L10 18L2 10Z"/>', inferred: '<path d="M10 2L18 17H2Z"/>', disputed: '<path d="M10.00 1.14L12.13 6.32L17.67 5.57L14.25 10.00L17.67 14.43L12.13 13.68L10.00 18.86L7.87 13.68L2.33 14.43L5.75 10.00L2.33 5.57L7.87 6.32Z"/>' }[event._status];
    return `<svg class="event-mark" viewBox="0 0 20 20" aria-hidden="true" data-workstream-key="${band.key}" data-assessment-treatment="${treatment}" fill="${hollow ? 'none' : band.fill}" stroke="${band.outline}" stroke-width="1.5" ${treatment === 'unresolved' ? 'stroke-dasharray="2.4 2"' : ''}>${geometry}</svg>`;
  }
  function renderWorkstreamLegend() {
    $('#workstream-legend').innerHTML = visualData.groups.map((group) => `<button data-workstream-key="${group.key}" aria-pressed="false" title="${escapeHtml(group.definition)}">${workstreamSwatch(group)}<span>${escapeHtml(group.label)}</span></button>`).join('');
    $$('#workstream-legend [data-workstream-key]').forEach((button) => button.addEventListener('click', () => {
      navigate(() => { state.workstream = state.workstream === button.dataset.workstreamKey ? 'all' : button.dataset.workstreamKey; });
    }));
  }
  function tooltipContent(event, nearby = 1) {
    return `<div class="tooltip-meta">${event.id} · ${LABELS[event._status]}</div><strong>${escapeHtml(event.title)}</strong><div class="tooltip-encodings">${workstreamBadge(event)}${severityBadge(event)}</div><small>${escapeHtml(dateLabel(event))}${event._time.openStart ? ' · head marks the upper bound' : ''}${nearby > 1 ? ` · ${nearby} nearby events` : ''}</small>`;
  }
  const starNumbers=Array.from({length:70000},(_,i)=>i+1);
  const shuffleStars=random(20260914);
  for(let i=starNumbers.length-1;i>0;i--){const j=Math.floor(shuffleStars()*(i+1));[starNumbers[i],starNumbers[j]]=[starNumbers[j],starNumbers[i]];}
  const distantStars = [];
  const starGrid = new Map();
  let starTimer;
  let starsUnlocked = false;
  function drawCosmos() {
    if(state.view==='cast')return;
    const canvas = $('#cosmos');
    const context = canvas.getContext('2d');
    const { width, height } = fitCanvas(canvas, context);
    const count = 70000;
    const sceneRect = canvas.getBoundingClientRect();
    const controlsRect = $('.field-controls').getBoundingClientRect();
    const footerRect = $('.field-foot').getBoundingClientRect();
    const left = width < 600 ? 98 : 156;
    const top = Math.max(120, controlsRect.bottom-sceneRect.top+28);
    const bottom = Math.max(top+60, footerRect.top-sceneRect.top-21);
    const field = {left,top,width:Math.max(50,width-left-20),height:Math.max(50,bottom-top)};
    const columns = Math.ceil(Math.sqrt(count*field.width/field.height));
    const rows = Math.ceil(count/columns);
    const hash = (value) => {
      let n = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
      n = Math.imul(n ^ (n >>> 15), 0x735a2d97);
      return ((n ^ (n >>> 15)) >>> 0) / 4294967296;
    };
    window.HaruspexArrival?.atmosphere(context, width, height, visualData.groups.map(group => group.fill), .72);
    // Stable decorative catalogue numbers identify drawn stars, never historical events.
    distantStars.length = 0; starGrid.clear();
    $('#star-number').hidden = true; $('#star-lens').hidden = true;
    for (let i = 0; i < count; i += 1) {
      // One unique cell per star: all 70,000 are painted inside the accessible field.
      const x = field.left + ((i % columns) + .06 + hash(i*5+71771)*.88) * field.width / columns;
      const y = field.top + (Math.floor(i/columns) + .06 + hash(i*5+71772)*.88) * field.height / rows;
      const size = .38 + Math.pow(hash(i * 5 + 71773), 4) * .58;
      const atmosphere = .4 + .6 * Math.exp(-Math.pow((y / height - .52) / .32, 2));
      const u=(x-field.left)/field.width,v=(y-field.top)/field.height;
      const edge=.09+.91*Math.pow(Math.max(0,Math.sin(Math.PI*u)*Math.sin(Math.PI*v)),.48);
      const density=Math.min(1,Math.max(.32,field.width*field.height/600000));
      const alpha = Math.max(.018,(.065 + hash(i * 5 + 71774) * .18) * atmosphere * edge * density);
      context.fillStyle = `rgba(173,192,211,${alpha})`;
      context.fillRect(x, y, size, size);
      if (hash(i * 5 + 71775) < .00065) {
        context.strokeStyle = '#CBECFF36'; context.lineWidth = .5; context.beginPath();
        context.moveTo(x - 3, y); context.lineTo(x + 3, y); context.moveTo(x, y - 3); context.lineTo(x, y + 3); context.stroke();
      }
      const star = { number: starNumbers[i], x: x + size / 2, y: y + size / 2 };
      distantStars.push(star);
      const cell = `${Math.floor(x / 32)},${Math.floor(y / 32)}`;
      if (!starGrid.has(cell)) starGrid.set(cell, []);
      starGrid.get(cell).push(star);
    }
    canvas.dataset.densityMarks = String(count);
    canvas.dataset.catalogueSample=starNumbers.slice(0,12).join(',');canvas.dataset.uniqueStars = String(new Set(distantStars.map(star=>star.number)).size);
    canvas.dataset.fieldBounds = JSON.stringify(field);
    canvas.dataset.meaning = '70,000 decorative stars evoke the published lower bound of messages and files. They have no historical one-to-one mapping. The total number of events is unknown.';
  }
  function showStar(star, linger = false) {
    clearTimeout(starTimer);
    const label = $('#star-number');
    if (!starsUnlocked || !star) { label.hidden = true; $('#star-lens').hidden=true; return; }
    paintStarLens(star);
    label.textContent = String(star.number).padStart(5, '0');
    label.setAttribute('aria-label', `Decorative star ${star.number}`);
    label.style.left = `${Math.max(40, Math.min(star.x, $('#scene').clientWidth - 55))}px`;
    label.style.top = `${Math.max(30, star.y)}px`;
    label.hidden = false;
    if (linger) starTimer = setTimeout(() => { label.hidden = true; $('#star-lens').hidden=true; }, 2800);
  }
  function paintStarLens(star) {
    const lens=$('#star-lens'), size=156, ratio=Math.min(devicePixelRatio||1,2);
    if(lens.width!==size*ratio){lens.width=size*ratio;lens.height=size*ratio;}
    const ctx=lens.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,size,size);
    lens.style.left=`${star.x-size/2}px`;lens.style.top=`${star.y-size/2}px`;lens.hidden=false;
    const mist=ctx.createRadialGradient(78,78,3,78,78,75);mist.addColorStop(0,'#b7d8e519');mist.addColorStop(.25,'#73b7d20C');mist.addColorStop(1,'#73b7d200');ctx.fillStyle=mist;ctx.fillRect(0,0,size,size);
    const cx=Math.floor(star.x/32),cy=Math.floor(star.y/32);
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const nearby of starGrid.get(`${cx+dx},${cy+dy}`)||[]){
      const nx=nearby.x-star.x,ny=nearby.y-star.y,d=Math.hypot(nx,ny);if(d>18)continue;
      const magnify=1+2.8*Math.pow(1-d/18,2),x=78+nx*magnify,y=78+ny*magnify;
      ctx.globalAlpha=(1-d/18)*.75;ctx.fillStyle='#d5e6f0';ctx.fillRect(x,y,nearby.number===star.number?2:.7,nearby.number===star.number?2:.7);
    }
    ctx.globalAlpha=1;ctx.strokeStyle='#c9e9f280';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(71,78);ctx.quadraticCurveTo(78,78,78,68);ctx.quadraticCurveTo(78,78,85,78);ctx.quadraticCurveTo(78,78,78,88);ctx.quadraticCurveTo(78,78,71,78);ctx.stroke();
    lens.dataset.star=String(star.number);
  }
  function discoverStar(event, linger = false) {
    if (!starsUnlocked || state.view === 'cast') return;
    const rect = $('#cosmos').getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const cx = Math.floor(x / 32), cy = Math.floor(y / 32);
    let nearest = null, distance = event.pointerType === 'touch' ? 18 : 7;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      for (const star of starGrid.get(`${cx+dx},${cy+dy}`) || []) {
        const d = Math.hypot(star.x-x, star.y-y);
        if (d < distance) { nearest=star; distance=d; }
      }
    }
    showStar(nearest, linger);
  }
  function dateLabel(event, compact = false) {
    const { start, end, kind } = event._time;
    if (kind === 'clock') return `${shortDate(start, !compact)}${compact ? '' : ` · ${(temporalMap.get(event.id)?.time_precision || event.time_precision).includes('estimated') ? '≈ ' : ''}${temporalMap.get(event.id)?.event_time_utc || event.event_time_utc} UTC`}`;
    if (kind === 'day') return `${shortDate(start, !compact)}${compact ? '' : ' · date only'}`;
    if (start !== null && end !== null) return `${shortDate(start)}–${shortDate(end - 1, !compact)}${compact ? ' ∼' : ' · context window'}`;
    if (end !== null) return `By ${shortDate(end - 1, !compact)} · inferred upper bound; start unknown`;
    if (start !== null) return `After ${shortDate(start, !compact)} · upper bound unknown`;
    return 'Date unknown';
  }
  function queryContext(event) {
    const assignment = assignmentMap.get(event.id);
    return { stage: stageMap.get(assignment.stage_id), lifecycle: lifecycleMap.get(assignment.lifecycle_id), workstream: eventStyle(event), assessment: severityMap.get(event.id), source: SOURCE_MAP.get(event.source_id), temporal: temporalMap.get(event.id) };
  }
  const matchesBase = (event, ignoreStage = false) => state.statuses.has(event._status)
    && (!state.investigation || state.investigation.ids.has(event.id))
    && query.matches(event, queryContext(event))
    && (ignoreStage || state.stage === 'all' || assignmentMap.get(event.id).stage_id === state.stage)
    && (state.workstream === 'all' || eventStyle(event).key === state.workstream)
    && (!state.interventions || event.intervention_status === 'actual intervention')
    && (state.temporal === 'all' || event._time.center === null)
    && (state.severity === 'all' || bandKey(event) === state.severity);
  const matchesGroup = (event) => state.lifecycle === 'all' || assignmentMap.get(event.id).lifecycle_id === state.lifecycle;
  const overlaps = (event, range) => event._time.kind === 'clock'
    ? event._time.start >= range[0] && event._time.start < range[1]
    : (event._time.start === null || event._time.start < range[1]) && (event._time.end === null || event._time.end > range[0]);
  const readingSort = (a, b) => (a._time.center ?? Infinity) - (b._time.center ?? Infinity) || a.id.localeCompare(b.id);
  function getVisible() {
    return filteredPool.filter((event) => overlaps(event, state.range));
  }
  function packingRadius(event, narrow = false) {
    // Retain the existing v9 packing scaffold; the drawn size has a new meaning.
    const score = severityMap.get(event.id)?.score;
    return (score > 0 ? Math.sqrt(4.84 + score * 3.1) : 2.2) * (narrow ? .88 : 1);
  }
  function selectionOnTop(items) {
    if (!state.selected || $('#detail-panel').hidden) return items;
    const selected = items.find(point => point.event.id === state.selected);
    return selected ? [...items.filter(point => point !== selected), selected] : items;
  }
  function markerRadius(event, narrow = false) {
    // Two categories, not a numerical estimate of the hidden instances.
    return (event.source_granularity.startsWith('aggregate') ? 4.4 : 2.3) * (narrow ? .94 : 1);
  }
  function snapshotCanvas(canvas) {
    if (!canvas) return null;
    const snapshot = document.createElement('canvas');
    snapshot.width = canvas.width; snapshot.height = canvas.height;
    snapshot.getContext('2d').drawImage(canvas, 0, 0);
    return snapshot;
  }
  const markerSprites = new Map();
  function shape(context, event, x, y, radius, alpha = 1) {
    if (alpha <= .002 || radius <= 0) return;
    const band = eventStyle(event);
    const treatment = bandKey(event);
    const hollow = treatment === 'context' || treatment === 'unresolved';
    const r = Math.max(.5, Math.round(radius * 4) / 4);
    const key = `${band.key}:${event._status}:${hollow ? treatment : 'solid'}:${r}`;
    let sprite = markerSprites.get(key);
    if (!sprite) {
      const ratio = 2;
      const extent = Math.ceil(r * 4 + 7);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = extent * 2 * ratio;
      const brush = canvas.getContext('2d');
      brush.scale(ratio, ratio); brush.translate(extent, extent);
      const light = brush.createRadialGradient(0, 0, r * .35, 0, 0, extent);
      light.addColorStop(0, `${band.fill}09`);
      light.addColorStop(.22, `${band.fill}04`);
      light.addColorStop(.48, `${band.fill}04`);
      light.addColorStop(1, `${band.fill}00`);
      brush.fillStyle = light; brush.fillRect(-extent, -extent, extent * 2, extent * 2);
      brush.beginPath();
      if (event._status === 'reported') brush.arc(0, 0, r, 0, Math.PI * 2);
      else {
        const star = event._status === 'disputed';
        const count = star ? 12 : event._status === 'reasoning' ? 4 : 3;
        const equalArea = star ? Math.sqrt(Math.PI / (6 * .48 * Math.sin(Math.PI / 6))) : Math.sqrt((2 * Math.PI) / (count * Math.sin(2 * Math.PI / count)));
        for (let i = 0; i < count; i += 1) {
          const angle = -Math.PI / 2 + Math.PI * 2 * i / count;
          const length = r * equalArea * (star && i % 2 ? .48 : 1);
          const px = Math.cos(angle) * length, py = Math.sin(angle) * length;
          if (!i) brush.moveTo(px, py); else brush.lineTo(px, py);
        }
        brush.closePath();
      }
      // A narrow dark edge preserves each silhouette without extinguishing its light.
      brush.fillStyle = '#091119'; brush.strokeStyle = '#091119'; brush.lineWidth = 1.35;
      brush.fill(); brush.stroke();
      const surface = brush.createLinearGradient(-r, -r, r, r);
      surface.addColorStop(0, band.fill); surface.addColorStop(.52, band.fill); surface.addColorStop(1, `${band.fill}CF`);
      brush.fillStyle = surface; brush.strokeStyle = band.outline; brush.lineWidth = hollow ? 1.15 : .65;
      if (treatment === 'unresolved') brush.setLineDash([2, 1.7]);
      if (!hollow) brush.fill();
      brush.stroke();
      if (!hollow) {
        brush.save(); brush.clip(); brush.setLineDash([]);
        const sheen = brush.createRadialGradient(-r * .3, -r * .4, 0, -r * .3, -r * .4, r * 1.4);
        sheen.addColorStop(0, '#EDFFFF1C'); sheen.addColorStop(.4, '#EDFFFF06'); sheen.addColorStop(1, '#EDFFFF00');
        brush.fillStyle = sheen; brush.fillRect(-r * 1.6, -r * 1.6, r * 3.2, r * 3.2); brush.restore();
      }
      sprite = {canvas, extent};
      if (markerSprites.size >= 512) markerSprites.delete(markerSprites.keys().next().value);
      markerSprites.set(key, sprite);
    }
    context.save(); context.globalAlpha = alpha;
    context.drawImage(sprite.canvas, x - sprite.extent, y - sprite.extent, sprite.extent * 2, sprite.extent * 2);
    context.restore();
  }
  function drawBackdrop(width, height, lanes, left, right) {
    // A very soft neutral wash; the actual inventory stars live on a static layer.
    ctx.save();
    const fade = ctx.createLinearGradient(left, 0, right, 0);
    fade.addColorStop(0, '#91A9BD00'); fade.addColorStop(.45, '#91A9BD05'); fade.addColorStop(1, '#91A9BD00');
    ctx.fillStyle = fade;
    for (const lane of lanes) {
      if (!lane.count) continue;
      const depth = Math.min(lane.height * .4, 42);
      ctx.fillRect(left, lane.y - depth, right - left, depth * 2);
    }
    ctx.restore();
  }
  function drawTimeAxes(ctx, { width, height, left, right, top, bottom, lanes }) {
    const narrow = width < 560;
    const xScale = (time) => left + ((time - state.range[0]) / (state.range[1] - state.range[0])) * (right - left);
    const labelX = narrow ? 12 : 26;
    for (const lane of lanes) {
      if (lane.end <= state.vertical[0] || lane.start >= state.vertical[1]) continue;
      const y = state.assessment === 'impact' ? Math.max(top + 13, Math.min(bottom - 14, lane.y)) : top + 21;
      const size = narrow ? 22 : 27;
      const textX = lane.symbol ? labelX + size + (narrow ? 7 : 11) : labelX;
      ctx.strokeStyle = lane.count ? '#D0DADF77' : '#71828A55'; ctx.lineWidth = .8;
      ctx.fillStyle = lane.count ? '#ECF2F4' : '#98A4AB';
      if (lane.symbol) {
        ctx.strokeRect(labelX, y - size / 2 - 3, size, size);
        ctx.textAlign = 'center'; ctx.font = `${narrow ? 11 : 14}px "SFMono-Regular",Consolas,monospace`;
        ctx.fillText(lane.symbol, labelX + size / 2, y + (narrow ? 1 : 2));
      }
      ctx.textAlign = 'left'; ctx.font = `${narrow ? 9 : 12}px "Helvetica Neue",Arial,sans-serif`;
      const label = lane.name;
      ctx.fillText(label, textX, y - 3);
      ctx.font = `${narrow ? 8 : 9}px "Helvetica Neue",Arial,sans-serif`; ctx.fillStyle = '#80909A';
      ctx.fillText(state.assessment === 'impact' ? `${lane.count} ${lane.count === 1 ? 'event' : 'events'}` : 'No severity rank', textX, y + 11);
    }
    const tickCount = narrow ? 4 : width < 900 ? 6 : 9;
    for (let i = 0; i < tickCount; i += 1) {
      const time = state.range[0] + ((state.range[1] - state.range[0]) * i) / (tickCount - 1);
      const x = xScale(time);
      ctx.strokeStyle = '#93AABD38'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(x, bottom + 10); ctx.lineTo(x, bottom + 15); ctx.stroke();
      ctx.fillStyle = '#91A3B1'; ctx.font = `${narrow ? 8 : 10}px "Helvetica Neue",Arial,sans-serif`;
      ctx.textAlign = i === 0 ? 'left' : i === tickCount - 1 ? 'right' : 'center';
      const label = state.range[1] - state.range[0] < DAY * 1.5 ? new Date(time).toISOString().slice(11, 16) : shortDate(time);
      ctx.fillText(label, x, bottom + 29);
    }
    ctx.textAlign = 'left';
  }
  function drawTimeline({ camera = false } = {}) {
    if (state.view !== 'stream') return;
    plotSize = fitCanvas(timeline, ctx);
    const { width, height } = plotSize;
    const narrow = width < 560;
    const left = narrow ? 105 : width < 900 ? 155 : 172;
    const right = width - (narrow ? 20 : 36);
    const top = (width <= 1000 ? 250 : 156) + (state.investigation && width <= 1000 ? 40 : 0);
    const bottom = Math.max(top + 120, height - (narrow ? 170 : 152));
    const definitions = facetBands();
    const weightTotal = definitions.reduce((sum, band) => sum + weightByBand.get(band.key), 0);
    const minimumBand = Math.min(.99 / definitions.length, (narrow ? 28 : 32) / Math.max(1, bottom - top));
    let cursor = 0;
    baseBands = definitions.map((band) => {
      const weight = minimumBand + (1 - minimumBand * definitions.length) * weightByBand.get(band.key) / weightTotal;
      const lane = { ...band, start: cursor, end: cursor + weight, weight }; cursor += weight; return lane;
    });
    const yScale = (value) => top + (value - state.vertical[0]) / (state.vertical[1] - state.vertical[0]) * (bottom - top);
    const counts = Object.fromEntries(baseBands.map((band) => [band.key, 0]));
    for (const event of visible) if (counts[bandKey(event)] !== undefined) counts[bandKey(event)] += 1;
    const lanes = baseBands.map((band) => ({ ...band, count: counts[band.key], height: yScale(band.end) - yScale(band.start), y: yScale((band.start + band.end) / 2) }));
    plotSize = { width, height, left, right, top, bottom, lanes };
    const laneMap = new Map(lanes.map((lane) => [lane.key, lane]));
    const xScale = (time) => left + ((time - state.range[0]) / (state.range[1] - state.range[0])) * (right - left);
    ctx.save(); ctx.beginPath(); ctx.rect(0, top - 4, width, bottom - top + 8); ctx.clip();
    drawBackdrop(width, height, lanes, left, right);
    ctx.restore();
    drawTimeAxes(ctx, plotSize);
    const layoutKey = `${state.assessment},${width},${height},${left},${right},${top},${bottom}`;
    if (!fieldLayout || fieldLayoutKey !== layoutKey) {
      fieldLayout = layoutCache.get(layoutKey);
      if (!fieldLayout) {
        fieldLayout = window.HaruspexLayout.create({ events: events.filter(matchesAssessment), bands: baseBands, range: fullRange,
          rect: plotSize, bandKey, radius: (event) => packingRadius(event, narrow) });
        if (layoutCache.size > 8) layoutCache.clear();
        layoutCache.set(layoutKey, fieldLayout);
      }
      const openGroups = new Map(baseBands.map((band) => [band.key, fieldLayout.unplaced.filter((event) => bandKey(event) === band.key).sort((a, b) => a.id.localeCompare(b.id))]));
      openDateLayout = baseBands.flatMap((band) => openGroups.get(band.key).map((event, index, members) => ({
        event, yWorld: band.start + (band.end - band.start) * (.1 + .8 * (index + .5) / members.length), radius: markerRadius(event, narrow),
      })));
      fieldLayoutKey = layoutKey;
    }
    points = window.HaruspexLayout.project(fieldLayout, { range: state.range, vertical: state.vertical, rect: plotSize, ids: filteredIds }).map(point => ({...point, radius: markerRadius(point.event, narrow) * Math.min(1.6, Math.pow(1 / (state.vertical[1] - state.vertical[0]), .2))}));
    tailSegments = openDateLayout.filter((point) => filteredIds.has(point.event.id) && overlaps(point.event, state.range)).map((point) => {
      const boundX = xScale(point.event._time.end);
      const y = yScale(point.yWorld);
      const lane = lanes.find((item) => item.key === bandKey(point.event));
      const bend = Math.min(34, lane.height * .32) * (point.event._index % 2 ? 1 : -1);
      return { ...point, x: boundX, y, bend, startX: left, endX: Math.min(right, boundX), headVisible: boundX >= left && boundX <= right,
        radius: point.radius * Math.min(1.6, Math.pow(1 / (state.vertical[1] - state.vertical[0]), .2)), boundary: true };
    }).filter((point) => point.y >= top && point.y <= bottom);
    ctx.save(); ctx.beginPath(); ctx.rect(left, top, right - left, bottom - top); ctx.clip();
    for (const point of tailSegments) {
      const active = point.event.id === state.selected && !detailPanel.hidden;
      const fill = eventStyle(point.event).fill;
      const gradient = ctx.createLinearGradient(left, point.y, Math.max(left + 1, point.endX), point.y);
      gradient.addColorStop(0, `${fill}00`); gradient.addColorStop(.38, `${fill}08`);
      gradient.addColorStop(.78, `${fill}${active ? '55' : '24'}`); gradient.addColorStop(1, `${fill}${active ? 'A0' : '66'}`);
      ctx.strokeStyle = gradient; ctx.lineWidth = active ? 1.8 : 1.05;
      ctx.beginPath();
      const segments = 42;
      for (let i = 0; i <= segments; i += 1) {
        const x = left + (point.endX - left) * i / segments;
        const y = tailY(point, x);
        if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
    if (!camera) timelineBackdrop = snapshotCanvas(timeline);
    points.push(...tailSegments.filter((point) => point.headVisible));
    ctx.save(); ctx.beginPath(); ctx.rect(left - 8, top, right - left + 16, bottom - top); ctx.clip();
    for (const point of selectionOnTop(points)) {
      const { event, x, y, radius } = point;
      const active = event.id === state.selected && !$('#detail-panel').hidden;
      if ((state.intervals || active) && event._time.kind !== 'clock' && !point.boundary) {
        const a = Math.max(left, xScale(event._time.start)); const b = Math.min(right, xScale(event._time.end));
        ctx.strokeStyle = active ? '#D4DEE3' : '#A6B7C1B0';
        ctx.lineWidth = active ? 1.15 : .8; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y); ctx.stroke(); ctx.setLineDash([]);
        const cap = active ? 5 : 3;
        ctx.beginPath(); ctx.moveTo(a, y - cap); ctx.lineTo(a, y + cap); ctx.moveTo(b, y - cap); ctx.lineTo(b, y + cap); ctx.stroke();
      }
      if (active) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 30);
        glow.addColorStop(0, `${eventStyle(event).outline}45`); glow.addColorStop(1, `${eventStyle(event).outline}00`);
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
      }
      shape(ctx, event, x, y, active ? Math.max(6, radius) : radius);
      if (active) { ctx.strokeStyle = '#e3e8c39c'; ctx.lineWidth = .7; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke(); }
    }
    ctx.restore();
    $('#plot-empty').hidden = visible.length > 0;
    const fieldCount = points.filter((point) => !point.boundary).length + tailSegments.length;
    $('#viewport-count').textContent = `${fieldCount} in the field`;
    $('#date-tail-label').textContent='Unknown start · tail length is not duration';
    bowCanvas.dataset.openTails=String(bowPoints.filter(p=>p.event._time.openStart).length);
    $('#visible-count').textContent = visible.length; $('#total-event-count').textContent = events.length;
    if (!camera) {
      const unplaced = visible.filter((event) => event._time.center === null).length;
      renderComets();
      $('#plot-period').textContent = `${shortDate(state.range[0])}–${shortDate(state.range[1] - 1, true)}`;
      timeline.setAttribute('aria-label', `Event swarm: ${fieldCount} events in the field, including ${tailSegments.length} with fading unknown-start tails. ${unplaced} matching events have an upper date bound without a known start. Time in UTC runs horizontally. Vertical zoom ${Math.round(100 / (state.vertical[1] - state.vertical[0]))} percent. ${state.assessment === 'impact' ? 'Provisional severity' : 'Unordered assessment category'}: ${lanes.map((lane) => `${lane.label}: ${lane.count}`).join('; ')}. Color identifies workstream; shape identifies evidence. Size distinguishes a single reported unit from grouped activity, without counting underlying instances. Comet heads mark their source upper bounds, not event times. Tails have no known start or duration. Distant stars suggest aggregate activity not individually resolved in these ${events.length} detailed events.`);
    }
    drawOverview(state.range, true);
  }
  function renderComets() {
    // Boundary heads and trails participate in the canvas hit testing; the
    // register provides keyboard access to every record. There is no extra row.
    $('#comet-layer').hidden = true;
    $('#undated-records').hidden = true;
    const openCount = visible.filter((event) => event._time.center === null).length;
    $('#unplaced-button').hidden = state.view !== 'stream' || !openCount;
    $('#unplaced-button').textContent = `${openCount} open-start dates`;
    timeline.dataset.boundaryHeads = String(tailSegments.filter((point) => point.headVisible).length);
    if(state.view==='stream')$('#date-tail-label').textContent='Unknown start → by date';
    timeline.dataset.openTails = String(tailSegments.length);
  }
  function drawOverview(displayRange = state.range, reuseBins = false) {
    overviewRange = [...displayRange];
    const { width, height } = fitCanvas(overview, octx);
    const left = 3; const right = width - 4;
    const x = (time) => left + ((time - fullRange[0]) / (fullRange[1] - fullRange[0])) * (right - left);
    const bins = reuseBins && overviewBins.length ? overviewBins : Array.from({ length: 150 }, () => 0);
    if (!reuseBins || !overviewBins.length) filteredPool.forEach((event) => {
      if (event._time.center === null) return;
      const i = Math.floor(((event._time.center - fullRange[0]) / (fullRange[1] - fullRange[0])) * bins.length);
      if (i >= 0 && i < bins.length) bins[i] += 1;
    });
    overviewBins = bins;
    const peak = Math.max(...bins, 1);
    bins.forEach((count, index) => {
      const h = Math.sqrt(count / peak) * Math.max(8, height - 20);
      octx.fillStyle = '#8fa0a56c'; octx.fillRect(left + (index / bins.length) * (right - left), height - 17 - h, Math.max(1, (right - left) / bins.length - 1), h);
    });
    const a = x(displayRange[0]); const b = x(displayRange[1]);
    octx.fillStyle = '#A8BECE12'; octx.fillRect(a, 2, b - a, height - 17);
    octx.strokeStyle = '#A8BECE90'; octx.lineWidth = .8; octx.strokeRect(a, 2, b - a, height - 17);
    $$('[data-edge]').forEach((handle) => {
      const edge = handle.dataset.edge === 'start' ? 0 : 1;
      const position = edge ? b : a;
      handle.style.left = `${Math.max(5, Math.min(width - 5, position))}px`;
      handle.setAttribute('aria-valuemin', String(fullRange[0]));
      handle.setAttribute('aria-valuemax', String(fullRange[1]));
      handle.setAttribute('aria-valuenow', String(Math.round(displayRange[edge])));
      handle.setAttribute('aria-valuetext', new Date(displayRange[edge]).toISOString().slice(0, 16).replace('T', ' ') + ' UTC');
    });
    octx.font = '8px "SFMono-Regular",Consolas,monospace'; octx.fillStyle = '#7E91A2';
    [['2026-05-01', 'MAY'], ['2026-06-01', 'JUN'], ['2026-07-01', 'JUL'], ['2026-08-01', 'AUG'], ['2026-09-01', 'SEP']].forEach(([date, label]) => octx.fillText(label, x(parseDay(date)), height - 1));
  }
  function fact(label, value) { return `<div><span class="fact-label">${label}</span><span class="fact-value">${value}</span></div>`; }
  function statusBadge(event) { return `<span class="evidence-badge"><span class="mark ${SHAPES[event._status]}"></span>${LABELS[event._status]}</span>`; }
  function eventInvestigation(event) {
    const findings = castData.findings.filter(item => item.event_ids.includes(event.id));
    const additions = researchData.evidence_items.filter(item => item.event_ids?.includes(event.id));
    return `<section class="event-investigation"><h3>Investigate this event</h3>${findings.length ? findings.map(item => `<button data-event-finding="${item.id}"><span>${escapeHtml(item.title)}</span></button>`).join('') : '<p>What permitted this action, who could stop it, and what evidence would show whether an intervention worked?</p><button id="event-inquiry-browse">Examine these questions</button>'}${additions.length ? `<h3>Additional evidence</h3>${additions.map(item=>`<button data-event-evidence="${escapeHtml(item.id)}"><span>${escapeHtml(item.title)}</span><span>↗</span></button>`).join('')}` : ''}</section>`;
  }
  function openInvestigation(id, eventId = null) {
    closeDetails();changeView('cast'); renderCast(); castUI.focusFinding(id, eventId);
    scrollToField({behavior:reducedMotion.matches?'auto':'smooth'});
  }
  function renderDetail() {
    const event = eventMap.get(state.selected);
    if (!event) { $('#event-detail').innerHTML = '<p class="detail-empty">Select an event<br>to explore its details.</p>'; return; }
    const source = SOURCE_MAP.get(event.source_id);
    const conflicts = data.conflicts.filter((conflict) => conflict.event_ids.includes(event.id));
    const exact = event._time.kind === 'clock';
    const assessment = severityMap.get(event.id);
    const severity = `<span class="severity-number">${severityBadge(event)}</span>`;
    const severityExplanation = assessment.rationale;
    const timingNote = event._time.kind === 'window' ? 'Individual date unknown. The interval is contextual.' : exact ? (temporalMap.get(event.id)?.time_precision || event.time_precision).includes('estimated') ? 'Source estimate; printed digits do not imply an exact clock reading.' : 'Time reported by the cited source.' : 'Individual time unknown. Plotted within the stated day.';
    $('#event-detail').innerHTML = `
      <h2 id="event-banner-title" class="detail-title">${escapeHtml(event.title)}</h2>
      <p class="event-description">${event.source_id==='S12'?'Reported wiki activity. Its relationship to the Hugging Face incident is unconfirmed.':event.system_scope.includes('Artifactory')?'Artifactory is OpenAI’s software-package repository. Agents used its stored files and network access to reach beyond their assigned tasks.':''}</p>
      <div class="event-kicker"><span class="event-id">${event.id}</span>${statusBadge(event)}</div>
      <div class="detail-date">${escapeHtml(dateLabel(event))}<small>${timingNote}</small><button class="date-evidence" id="date-evidence-button">Date evidence</button></div>
      ${visible.some((entry) => entry.id === event.id) ? '' : '<p class="detail-context">Selected event is outside the current filters.</p>'}
      <div class="event-placement"><button id="event-life">${escapeHtml(queryContext(event).lifecycle.label)}</button><span aria-hidden="true">/</span><button id="event-stage">${escapeHtml(queryContext(event).stage.label)}</button></div>
      <div class="detail-facts">${fact(['context','unresolved'].includes(bandKey(event))?'Assessment':'Severity', severity)}${fact('Workstream', workstreamBadge(event))}${fact('Event scope', event.source_granularity.startsWith('aggregate') ? 'Grouped activity' : 'Single reported unit')}${fact('Actor', escapeHtml(event.actor))}${fact('System', escapeHtml(event.system_scope))}</div>
      ${event.outcome && event.outcome !== 'action or result reported' ? `<div class="detail-block"><h3>What is reported</h3><p>${escapeHtml(event.outcome)}</p></div>` : ''}
      ${event.intervention_status === 'actual intervention' ? `<div class="detail-block intervention-detail"><h3>Recorded intervention</h3><p>${escapeHtml(event.action)}.</p><p class="point-reading">Investigate the control path below to examine proposed alternatives and their evidence needs.</p></div>` : ''}
      ${eventInvestigation(event)}
      ${conflicts.map((conflict) => `<div class="discrepancy-note"><strong>Accounts differ · ${conflict.conflict_id}</strong><p>${escapeHtml(conflict.detail)}</p><button class="text-button compare-sources" data-conflict="${conflict.conflict_id}">Compare sources</button></div>`).join('')}
      <div class="detail-block"><h3>Why this classification</h3><p>${escapeHtml(severityExplanation)}</p><p class="point-reading">Provisional assessment · ${escapeHtml(assessment.confidence.replaceAll('_', ' '))} confidence</p></div>
      <div class="detail-block"><h3>Primary source</h3><a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(source.publisher)}</span><span aria-hidden="true">↗</span></a><div class="source-locator">${escapeHtml(event.source_locator)}</div></div>
      <button class="detail-more" id="impact-record-button">Severity assessment & basis <span aria-hidden="true">↗</span></button>
      <button class="detail-more" id="full-record-button">All 45 fields & uncertainties <span aria-hidden="true">↗</span></button>
      ${state.nearby.length > 1 ? `<div class="nearby-group"><span>${state.nearby.length} nearby events</span>${state.nearby.filter((entry) => entry.id !== event.id).map((entry) => `<button data-nearby="${entry.id}">${entry.id} · ${escapeHtml(entry.title)}</button>`).join('')}</div>` : ''}`;
    $$('[data-event-finding]').forEach(button => button.addEventListener('click', () => openInvestigation(button.dataset.eventFinding, event.id)));
    $$('[data-event-evidence]').forEach(button => button.addEventListener('click', () => { closeDetails();changeView('cast'); renderCast(); castUI.focusEvidence(button.dataset.eventEvidence); }));
    $('#event-inquiry-browse')?.addEventListener('click', () => { closeDetails();changeView('cast'); castUI.show('questions');scrollToField({behavior:'instant'}); });
    $('#date-evidence-button').addEventListener('click', () => openTemporalRecord(event));
    $('#event-life').addEventListener('click', () => selectLifecycle(queryContext(event).lifecycle.id));
    $('#event-stage').addEventListener('click', () => selectStage(queryContext(event).stage.id));
    $('#impact-record-button').addEventListener('click', () => openImpactRecord(event));
    $('#full-record-button').addEventListener('click', () => openRecord(event));
    $$('.compare-sources').forEach((button) => button.addEventListener('click', () => openConflict(button.dataset.conflict)));
    $$('[data-nearby]').forEach((button) => button.addEventListener('click', () => selectEvent(button.dataset.nearby, { nearby: state.nearby })));
    window.HaruspexReader.annotate($('#event-detail'));
    const index = visible.findIndex((entry) => entry.id === event.id);
    $('#previous-event').disabled = !visible.length || index === 0;
    $('#next-event').disabled = !visible.length || index === visible.length - 1;
  }
  function selectEvent(id, { reveal = false, nearby = null, trigger = null } = {}) {
    const event = eventMap.get(id); if (!event) return;
    detailTrigger = trigger || document.activeElement;
    selectedSourceAnchor=null;
    const sourceButton=detailTrigger?.closest?.('.milestone,.record-row');
    if(sourceButton){const marker=sourceButton.querySelector('.event-mark')||sourceButton,r=marker.getBoundingClientRect(),hoist=sourceButton.getBoundingClientRect();selectedSourceAnchor={x:r.left+(marker===sourceButton?12:r.width/2),y:r.top+(marker===sourceButton?8:r.height/2),documentX:hoist.left+scrollX,documentY:hoist.top+scrollY,lineLength:sourceButton.classList.contains('milestone')?hoist.width:0};}

    const opening = $('#detail-panel').hidden;
    $('#detail-panel').hidden = false;

    state.selected = id;
    state.nearby = nearby || [];
    if (reveal && !visible.some((entry) => entry.id === id)) {
      clearTimeout(queryTimer);
      if (state.investigation && !state.investigation.ids.has(id)) state.investigation = null;
      state.assessment = assessmentOf(event); state.search = ''; query = window.HaruspexQuery.compile(''); state.stage = 'all'; state.lifecycle = 'all'; state.vertical = [0, 1]; state.workstream = 'all'; state.severity = 'all'; state.interventions = false; state.temporal = 'all'; state.statuses = new Set(Object.keys(SHAPES));
      $('#event-search').value = ''; $('#stage-filter').value = 'all'; $('#severity-filter').value = 'all';
      const center = event._time.center ?? event._time.end ?? fullRange[0];
      state.range = boundedRange(center - DAY * 3, center + DAY * 3);
      state.period = 'custom'; allFilteredPool = events.filter((entry) => matchesBase(entry) && matchesGroup(entry)).sort(readingSort); filteredPool = allFilteredPool.filter(matchesAssessment); filteredIds = new Set(filteredPool.map((entry) => entry.id)); overviewBins = []; visible = getVisible(); syncAssessmentCounts(); syncControls(); $('#visible-count').textContent = visible.length;
    }
    stopMotion(); renderDetail(); renderList(); drawTimeline();
    if (state.view === 'bowtie') renderBowtie();
    attachBanner(opening);
    $$('.milestone').forEach((button) => button.classList.toggle('active', button.dataset.event === id));
  }
  function renderList() {
    const focusedRecord = document.activeElement?.closest('[data-record]')?.dataset.record;
    const oldRows = new Map($$('#record-list [data-record]').map((node) => [node.dataset.record, node.getBoundingClientRect()]));
    $('#record-count').textContent = `${visible.length} / ${events.length} events`;
    const entries = visible.slice(0, state.limit);
    $('#record-list').innerHTML = entries.length ? entries.map((event) => `<button class="record-row ${event.id === state.selected ? 'selected' : ''}" data-record="${event.id}" aria-label="${escapeHtml(`${event.id}, ${event.title}, ${eventStyle(event).label}, ${LABELS[event._status]}, ${bandLabel(event)}, ${dateLabel(event, true)}`)}"><span class="row-id">${event.id}</span><span class="row-date">${escapeHtml(dateLabel(event, true))}</span><span class="row-title">${eventMark(event)}${escapeHtml(event.title)}</span><span class="row-severity">${severityBadge(event)}</span><span class="row-status"><span class="mark ${SHAPES[event._status]}"></span>${LABELS[event._status]}</span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join('') : '<p class="list-empty">No events match this view.</p>';
    $$('[data-record]').forEach((button) => button.addEventListener('click', () => { selectEvent(button.dataset.record, { trigger: button }); }));
    if (!reducedMotion.matches) $$('#record-list [data-record]').forEach((node) => {
      const rect = node.getBoundingClientRect(); const prior = oldRows.get(node.dataset.record);
      if (rect.bottom < 0 || rect.top > innerHeight || (prior && Math.abs(prior.top - rect.top) < 1)) return;
      node.animate([{ opacity: prior ? 1 : 0, transform: `translateY(${prior ? prior.top - rect.top : 8}px)` }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.75,.15,1)' });
    });
    $('#load-more').hidden = visible.length <= state.limit;
    if (focusedRecord) $(`[data-record="${focusedRecord}"]`)?.focus({ preventScroll: true });
  }
  const bowCanvas = $('#bowtie-canvas');
  const bctx = bowCanvas.getContext('2d');
  const transitionCanvas = $('#transition-canvas');
  const tctx = transitionCanvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let bowPoints = [];
  let bowLayoutKey = "";
  let bowLayoutPoints = [];
  let motionFrame = null;
  let movingPoints = null;
  let movingBackdrop = null;
  let transitionLabels = null;
  function stopMotion() {
    $$('.visual-column > .field-origin').forEach(node => {
      node.haruspexCancel?.(); node.getAnimations().forEach(animation => animation.cancel()); node.remove();
    });
    if (motionFrame !== null) cancelAnimationFrame(motionFrame);
    motionFrame = null; movingPoints = null; movingBackdrop = null;
    transitionLabels?.remove(); transitionLabels = null;
    transitionCanvas.hidden = true;
    timeline.style.opacity = ''; bowCanvas.style.opacity = '';
    $('#bowtie-map').style.opacity = ''; $('#bowtie-map').style.translate = '';
    $('.visual-column').classList.remove('morphing');
    $('.visual-column').dataset.transition = 'idle';
  }
  function currentPositions() {
    const canvas = state.view === 'stream' ? timeline : bowCanvas;
    const field = $('.visual-column').getBoundingClientRect();
    const rect = canvas.getBoundingClientRect();
    const originPoints=$('.visual-column > .field-origin')?.haruspexPoints;
    const snapshot = originPoints ? originPoints.map(point=>({...point})) : movingPoints ? movingPoints.map((point) => ({ ...point }))
      : (state.view === 'stream' ? points : bowPoints).map((point) => ({
        ...point, x: point.x + rect.left - field.left, y: point.y + rect.top - field.top,
        radius: point.event.id === state.selected && !$('#detail-panel').hidden ? Math.max(6, point.radius) : point.radius,
        alpha: 1, vx: 0, vy: 0,
      }));
    snapshot.backdrop = snapshotCanvas(movingBackdrop || (state.view === 'stream' ? timelineBackdrop : bowBackdrop));
    snapshot.view = state.view;
    snapshot.range = [...overviewRange];
    const outgoingLabels = transitionLabels ? `<div style="position:absolute;inset:0;opacity:${transitionLabels.style.opacity || 1};translate:${transitionLabels.style.translate || '0 0'}">${transitionLabels.innerHTML}</div>` : '';
    const currentLabels = state.view === 'bowtie' ? `<div style="position:absolute;inset:0;opacity:${$('#bowtie-map').style.opacity || 1};translate:${$('#bowtie-map').style.translate || '0 0'}">${$('#bowtie-map').innerHTML}</div>` : '';
    snapshot.labels = outgoingLabels + currentLabels; snapshot.labelOpacity = 1;
    return snapshot;
  }
  function animateLayout(from, { camera = false } = {}) {
    const to = currentPositions();
    stopMotion();
    if (reducedMotion.matches || (!from.length && !to.length)) return;
    transitionCanvas.hidden = false;
    const size = fitCanvas(transitionCanvas, tctx);
    movingBackdrop = document.createElement('canvas');
    movingBackdrop.width = transitionCanvas.width; movingBackdrop.height = transitionCanvas.height;
    const backdropContext = movingBackdrop.getContext('2d');
    const fromMap = new Map(from.map((point) => [point.event.id, point]));
    const toMap = new Map(to.map((point) => [point.event.id, point]));
    const omega = camera ? 16 : 10.5;
    const pairs = [...new Set([...fromMap.keys(), ...toMap.keys()])].map((id) => {
      const old = fromMap.get(id); const next = toMap.get(id);
      const start = old || { ...next, alpha: 0, radius: next.radius * .55, vx: 0, vy: 0 };
      const end = next || { ...old, alpha: 0, radius: old.radius * .55 };
      let vx = start.vx || 0; let vy = start.vy || 0;
      if (!camera && from.view !== to.view && !vx && !vy) {
        const dx = end.x - start.x; const dy = end.y - start.y;
        const orientation = from.view === 'stream' ? 1 : -1;
        vx = -dy * .8 * orientation; vy = dx * .8 * orientation;
      }
      return { start, end, vx, vy };
    });
    if (from.labels) {
      transitionLabels = document.createElement('div');
      transitionLabels.className = 'transition-labels';
      transitionLabels.setAttribute('aria-hidden', 'true'); transitionLabels.inert = true;
      transitionLabels.innerHTML = from.labels;
      transitionLabels.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
      $('.visual-column').append(transitionLabels);
    }
    timeline.style.opacity = '0'; bowCanvas.style.opacity = '0';
    $('.visual-column').classList.add('morphing');
    $('.visual-column').dataset.transition = 'running';
    $('.visual-column').dataset.movingEvents = String(pairs.length);
    $('#plot-tooltip').hidden = true; $('#bowtie-tooltip').hidden = true;
    const started = performance.now();
    const limit = camera ? 950 : 1450;
    const spring = (a, b, velocity, seconds) => {
      const offset = a - b; const coefficient = velocity + omega * offset;
      const decay = Math.exp(-omega * seconds);
      return { value: b + (offset + coefficient * seconds) * decay,
        velocity: (velocity - omega * coefficient * seconds) * decay };
    };
    function frame(now) {
      const seconds = Math.max(0, (now - started) / 1000);
      const ease = 1 - (1 + omega * seconds) * Math.exp(-omega * seconds);
      if (from.range[0] !== to.range[0] || from.range[1] !== to.range[1]) drawOverview(from.range.map((value, index) => value + (to.range[index] - value) * ease), true);
      backdropContext.clearRect(0, 0, movingBackdrop.width, movingBackdrop.height);
      if (from.backdrop) { backdropContext.globalAlpha = 1 - ease; backdropContext.drawImage(from.backdrop, 0, 0, movingBackdrop.width, movingBackdrop.height); }
      if (to.backdrop) { backdropContext.globalAlpha = ease; backdropContext.drawImage(to.backdrop, 0, 0, movingBackdrop.width, movingBackdrop.height); }
      backdropContext.globalAlpha = 1;
      tctx.clearRect(0, 0, size.width, size.height);
      tctx.drawImage(movingBackdrop, 0, 0, size.width, size.height);
      let remaining = 0;
      movingPoints = pairs.map(({ start, end, vx, vy }) => {
        const x = spring(start.x, end.x, vx, seconds); const y = spring(start.y, end.y, vy, seconds);
        const point = { event: end.event, x: x.value, y: y.value, vx: x.velocity, vy: y.velocity,
          radius: start.radius + (end.radius - start.radius) * ease,
          alpha: start.alpha + (end.alpha - start.alpha) * ease };
        remaining = Math.max(remaining, Math.abs(end.x - point.x), Math.abs(end.y - point.y));
        if(to.view==='bowtie')bowTail(tctx,point.event,point.x,point.y,point.alpha*ease);
      shape(tctx, point.event, point.x, point.y, point.radius, point.alpha);
        if (point.event.id === state.selected && !$('#detail-panel').hidden) {
          tctx.strokeStyle = `rgba(229,235,229,${point.alpha * .65})`; tctx.lineWidth = .75;
          tctx.beginPath(); tctx.arc(point.x, point.y, Math.max(12, point.radius + 5), 0, Math.PI * 2); tctx.stroke();
        }
        return point;
      });
      if (transitionLabels) { transitionLabels.style.opacity = String((1 - ease) * from.labelOpacity); transitionLabels.style.translate = `0 ${-8 * ease}px`; }
      $('#bowtie-map').style.opacity = String(ease); $('#bowtie-map').style.translate = `0 ${8 * (1 - ease)}px`;
      if (now - started < limit && (seconds < .55 || remaining > .08 || ease < .999)) motionFrame = requestAnimationFrame(frame);
      else { stopMotion(); drawOverview(state.range, true); }
    }
    // Paint the exact departure state in this turn: never expose a blank frame.
    frame(started);
  }
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    stopMotion();
    $$('.view-ghost').forEach(element => element.remove());
    for (const view of ['stream', 'bowtie', 'cast']) {
      $(`#${view}-view`).getAnimations({subtree:true}).forEach(animation => animation.cancel());
    }
  });
  function bowTail(context,event,x,y,alpha=1){
    if(!event._time.openStart)return;
    const g=context.createLinearGradient(x-28,y+10,x,y);g.addColorStop(0,eventStyle(event).fill+'00');g.addColorStop(1,eventStyle(event).fill+'99');context.save();context.globalAlpha=alpha;context.strokeStyle=g;context.lineWidth=1.2;context.beginPath();context.moveTo(x-28,y+10);context.bezierCurveTo(x-18,y+12,x-13,y-2,x,y);context.stroke();context.restore();
  }
  function renderBowtie({ camera = false } = {}) {
    const { width, height } = fitCanvas(bowCanvas, bctx);
    const narrow = width < 560;
    const poolByLifecycle = new Map(groups.map((group) => [group.key, []]));
    for (const event of filteredPool) if (overlaps(event, state.range)) poolByLifecycle.get(assignmentMap.get(event.id).lifecycle_id).push(event);
    const groupEvents = groups.map((group) => ({ ...group, entries: poolByLifecycle.get(group.key) }));
    const focused = groupEvents.find((group) => group.key === state.lifecycle);
    const selectedFocus = document.activeElement?.dataset.bowGroup;
    if (!camera) $('#bowtie-navigation').innerHTML = `<button data-bow-group="" aria-pressed="${!focused}">Overview</button>${groupEvents.map((group) => `<button data-bow-group="${group.key}" aria-pressed="${group.key === state.lifecycle}">${group.label}</button>`).join('')}`;
    const fieldTop = (width <= 1000 ? 256 : 156) + (state.investigation && width <= 1000 ? 40 : 0);
    const fieldBottom = Math.max(fieldTop + 130, height - (narrow ? 166 : 146));
    const centerY = (fieldTop + fieldBottom) / 2;
    const spread = Math.max(40, (fieldBottom - fieldTop) * .44);
    const margin = narrow ? 25 : 65;
    bctx.save();
    if (!focused) {
      [1, .78, .55].forEach((scale, index) => {
        for (const direction of [-1, 1]) {
          bctx.strokeStyle = '#A6B7B8';
          bctx.globalAlpha = [.24, .15, .08][index]; bctx.lineWidth = index === 0 ? .8 : .55;
          bctx.beginPath(); bctx.moveTo(margin, centerY + direction * spread * scale);
          bctx.bezierCurveTo(width * .3, centerY + direction * spread * scale, width * .4, centerY, width * .5, centerY);
          bctx.bezierCurveTo(width * .6, centerY, width * .7, centerY - direction * spread * scale, width - margin, centerY - direction * spread * scale);
          bctx.stroke();
        }
      });
    }
    bctx.restore();
    if (!camera) bowBackdrop = snapshotCanvas(bowCanvas);
    const clusters = (focused ? [{ ...focused, index: 0 }] : groupEvents.map((group, index) => ({ ...group, index }))).map((cluster) => ({ ...cluster, layoutEntries: bowLayoutKey === `${width},${height},${state.lifecycle},${fieldTop},${fieldBottom}` ? [] : events.filter((event) => cluster.roles.includes(event.bow_tie_role)).sort(readingSort) }));
    const visibleIds = new Set(visible.map((event) => event.id));
    const grid = new Map();
    function distance(x, y) {
      const gx = Math.floor(x / 8); const gy = Math.floor(y / 8); let closest = 99;
      for (let dx = -1; dx <= 1; dx += 1) for (let dy = -1; dy <= 1; dy += 1) {
        for (const point of grid.get(`${gx + dx},${gy + dy}`) || []) closest = Math.min(closest, Math.hypot(point.x - x, point.y - y));
      }
      return closest;
    }
    const geometryKey = `${width},${height},${state.lifecycle},${fieldTop},${fieldBottom}`;
    if (bowLayoutKey !== geometryKey) {
    bowPoints = [];
    for (const cluster of clusters) {
      cluster.layoutEntries.forEach((event) => {
        const rand = random(772 + event._index * 937);
        let best = null;
        for (let attempt = 0; attempt < 24; attempt += 1) {
          const u = rand(); const v = (rand() + rand() - 1) / 2;
          let x; let y;
          if (focused) {
            // Broad, open ribbons; these are group layouts, without a time axis.
            x = margin + 10 + u * (width - margin * 2 - 20);
            const fieldStart = fieldTop + 28;
            const fieldEnd = fieldBottom;
            const middle = (fieldStart + fieldEnd) / 2 + Math.sin(u * Math.PI * 2 - .5) * height * .035;
            const thickness = Math.max(20, fieldEnd - fieldStart) * (.45 + .55 * Math.pow(Math.sin(u * Math.PI), .55));
            y = middle + v * thickness;
          } else if (cluster.index === 1) {
            x = width * (.365 + u * .27);
            y = centerY + v * spread * 1.05 * (.08 + Math.sin(u * Math.PI) * .92);
          } else {
            const outer = cluster.index === 0 ? margin : width - margin;
            x = outer + (cluster.index === 0 ? 1 : -1) * u * (width * .34 - margin);
            y = centerY + v * spread * 1.8 * (1 - u * .65);
          }
          const clearance = distance(x, y);
          if (!best || clearance > best.clearance) best = { x, y, clearance };
          if (clearance >= packingRadius(event, narrow) * 2 + 1.4) break;
        }
        const point = { event, x: best.x, y: best.y, radius: markerRadius(event, narrow) };
        bowPoints.push(point);
        const key = `${Math.floor(point.x / 8)},${Math.floor(point.y / 8)}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(point);
      });
    }
    bowLayoutPoints = bowPoints; bowLayoutKey = geometryKey;
    }
    bowPoints = bowLayoutPoints.filter((point) => visibleIds.has(point.event.id));
    selectionOnTop(bowPoints).forEach(({ event, x, y, radius }) => {
      const active = event.id === state.selected && !$('#detail-panel').hidden;
      bowTail(bctx,event,x,y);
      shape(bctx, event, x, y, active ? Math.max(6, radius) : radius);
      if (active) { bctx.strokeStyle = '#e3e8c39c'; bctx.lineWidth = .7; bctx.beginPath(); bctx.arc(x, y, 12, 0, Math.PI * 2); bctx.stroke(); }
    });
    if (!camera) $('#bowtie-map').innerHTML = clusters.map((cluster) => {
      const x = focused ? margin : width * [.16, .5, .84][cluster.index];
      const y = focused ? fieldTop - 14 : Math.min(fieldBottom + 12, height - (narrow ? 205 : 190));
      return focused ? `<div class="bow-label focused-label" style="left:${x}px;top:${y}px"><span>${cluster.label}</span><small>${cluster.entries.length} events</small></div>` : `<button class="bow-label" data-bow-group="${cluster.key}" style="left:${x}px;top:${y}px" aria-label="Focus ${cluster.label}, ${cluster.entries.length} events"><span>${cluster.label}</span><small>${cluster.entries.length} events <i aria-hidden="true">↗</i></small></button>`;
    }).join('');
    if (!camera) $$('[data-bow-group]').forEach((button) => button.addEventListener('click', () => focusBowtie(button.dataset.bowGroup || null)));
    if (!camera && selectedFocus !== undefined) $(`#bowtie-navigation [data-bow-group="${selectedFocus}"]`)?.focus({ preventScroll: true });
    if (!camera) bowCanvas.setAttribute('aria-label', `${focused ? focused.label : 'Bow tie'}: ${bowPoints.length} events. ${clusters.map((cluster) => `${cluster.label}: ${cluster.entries.length}`).join('; ')}. Color identifies incident workstream; shape identifies evidence status. Severity uses boxed numbers and, in the swarm, vertical bands. Size distinguishes single reported units from grouped activity. Points can be selected. Curves are structural grouping, not proven causal links. Short fading tails identify unknown starts without expressing a duration. There is no time axis in this view.`);
    $('#date-tail-label').textContent='Unknown start · tail length is not duration';
    bowCanvas.dataset.openTails=String(bowPoints.filter(p=>p.event._time.openStart).length);
    $('#visible-count').textContent = visible.length; $('#total-event-count').textContent = events.length;
    if (!camera) $('#plot-period').textContent = `${shortDate(state.range[0])}–${shortDate(state.range[1] - 1, true)}`;
    drawOverview(state.range, true);
  }
  function focusBowtie(group) { selectLifecycle(group || 'all'); }
  function bowHits(event) {
    if (motionFrame !== null) return [];
    const rect = bowCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left; const y = event.clientY - rect.top;
    return bowPoints.map((point) => ({ ...point, distance: Math.hypot(point.x - x, point.y - y) })).filter((point) => point.distance < (event.pointerType === 'touch' ? 24 : 14)).sort((a, b) => a.distance - b.distance);
  }
  bowCanvas.addEventListener('pointermove', (event) => {
    const hits = bowHits(event); const tooltip = $('#bowtie-tooltip');
    if (!hits.length) { tooltip.hidden = true; discoverStar(event); return; }
    showStar(null);
    const point = hits[0];
    tooltip.innerHTML = tooltipContent(point.event, hits.length);
    tooltip.hidden = false;
    const rect = bowCanvas.getBoundingClientRect();
    tooltip.style.left = `${Math.max(4, Math.min(point.x + 16, rect.width - tooltip.offsetWidth - 4))}px`;
    tooltip.style.top = `${Math.max(4, point.y - tooltip.offsetHeight - 12)}px`;
  });
  bowCanvas.addEventListener('pointerleave', () => { $('#bowtie-tooltip').hidden = true; showStar(null); });
  bowCanvas.addEventListener('click', (event) => { const hits = bowHits(event); if (hits.length) { selectEvent(hits[0].event.id, { nearby: hits.map((point) => point.event) }); renderBowtie(); } else discoverStar(event, true); });
  function boundedRange(start, end) {
    const span = Math.max(MIN_TIME_SPAN, Math.min(end - start, fullRange[1] - fullRange[0]));
    const a = Math.max(fullRange[0], Math.min(start, fullRange[1] - span));
    return [a, a + span];
  }
  function boundedVertical(start, end) {
    const span = Math.max(.075, Math.min(1, end - start));
    const a = Math.max(0, Math.min(start, 1 - span));
    return [a, a + span];
  }
  function cancelGestures() {
    if (drag && timeline.hasPointerCapture(drag.id)) timeline.releasePointerCapture(drag.id);
    drag = null;
    if (brushDrag && brush.hasPointerCapture(brushDrag.id)) brush.releasePointerCapture(brushDrag.id);
    brushDrag = null;
  }
  function fitMatchingRange() {
    const matches = events.filter((event) => matchesBase(event) && matchesGroup(event) && matchesAssessment(event));
    const starts = matches.map((event) => event._time.start).filter((value) => value != null);
    const ends = matches.map((event) => event._time.end).filter((value) => value != null);
    if (!starts.length || !ends.length) return [...fullRange];
    const start = Math.min(...starts); const end = Math.max(...ends);
    const padding = Math.max(DAY / 8, (end - start) * .025);
    return boundedRange(start - padding, end + padding);
  }
  function paintCamera() {
    cameraFrame = null;
    visible = getVisible(); syncAssessmentCounts();
    if (state.view === 'stream') drawTimeline({ camera: true }); else renderBowtie({ camera: true });
    // Source-window membership can change during a drag, including upper-bound heads and their tails.
    renderComets();
  }
  function queueCamera() {
    if (!cameraPending) { settleMotionForGesture(); cameraPending = true; }
    $('.visual-column').dataset.camera = 'moving';
    if (cameraFrame === null) cameraFrame = requestAnimationFrame(paintCamera);
    clearTimeout(cameraTimer);
    cameraTimer = setTimeout(finishCamera, 130);
  }
  function finishCamera() {
    clearTimeout(cameraTimer); cameraTimer = null;
    if (!cameraPending) return;
    if (cameraFrame !== null) { cancelAnimationFrame(cameraFrame); cameraFrame = null; }
    cameraPending = false;
    visible = getVisible(); syncAssessmentCounts(); syncControls();
    if (state.view === 'stream') drawTimeline(); else renderBowtie();
    renderList(); if (!detailPanel.hidden) renderDetail();
    $('.visual-column').dataset.camera = 'idle';
  }
  function navigate(change, { fit = false, camera = false } = {}) {
    if (state.view === 'cast') { change(); refresh(); return; }
    finishCamera();
    const ghost=$('.visual-column > .field-origin')&&!reducedMotion.matches?freezeVisibleView():null;
    const from = currentPositions(); stopMotion(); cancelGestures(); change();
    if (fit) { state.range = fitMatchingRange(); state.vertical = [0, 1]; }
    state.limit = 12; refresh(); animateLayout(from, { camera });fadeFrozenView(ghost,220);
  }
  function selectLifecycle(id) {
    if (id === state.lifecycle) return;
    navigate(() => {
      state.lifecycle = id;
      if (state.stage !== 'all' && id !== 'all' && !stageMap.get(state.stage).lifecycle_counts[id]) {
        state.stage = 'all'; notify('Showing all stages in this part of the incident.');
      }
    }, { fit: true });
  }
  function selectStage(id) {
    navigate(() => {
      state.stage = id;
      if (id !== 'all') {
        const stage = stageMap.get(id);
        if (state.lifecycle !== 'all' && !stage.lifecycle_counts[state.lifecycle]) state.lifecycle = 'all';
        if (state.workstream !== 'all' && stage.workstream_id !== state.workstream) state.workstream = 'all';
      }
    }, { fit: true });
    closeStages();
  }
  function zoom(factor, axis = 'both', centerX = .5, centerY = .5, animated = true) {
    const change = () => {
      if (axis !== 'y') {
        const oldSpan = state.range[1] - state.range[0];
        const anchor = state.range[0] + oldSpan * centerX;
        const span = Math.max(MIN_TIME_SPAN, Math.min(fullRange[1] - fullRange[0], oldSpan * factor));
        state.range = boundedRange(anchor - span * centerX, anchor + span * (1 - centerX));
      }
      if (axis !== 'x') {
        const oldSpan = state.vertical[1] - state.vertical[0];
        const anchor = state.vertical[0] + oldSpan * centerY;
        const span = Math.max(.075, Math.min(1, oldSpan * factor));
        state.vertical = boundedVertical(anchor - span * centerY, anchor + span * (1 - centerY));
      }
    };
    if (animated) navigate(change, { camera: true }); else { change(); queueCamera(); }
  }
  function renderStages() {
    const pool = events.filter((event) => matchesBase(event, true) && matchesGroup(event) && matchesAssessment(event));
    const counts = new Map();
    pool.forEach((event) => { const id = assignmentMap.get(event.id).stage_id; counts.set(id, (counts.get(id) || 0) + 1); });
    $('#stage-context').textContent = state.lifecycle === 'all' ? 'Across the full incident' : lifecycleMap.get(state.lifecycle).definition;
    $('#stage-list').innerHTML = visualData.groups.map((group) => `<section class="stage-workstream"><h3>${workstreamSwatch(group)}${escapeHtml(group.label)}</h3>${ontology.stages.filter((stage) => stage.workstream_id === group.key).map((stage) => `<button data-stage="${stage.id}" aria-pressed="${state.stage === stage.id}" ${!counts.get(stage.id) ? 'disabled' : ''} title="${escapeHtml(stage.definition)}"><span>${escapeHtml(stage.label)}</span><small>${counts.get(stage.id) || 0}</small></button>`).join('')}</section>`).join('');
    $$('[data-stage]').forEach((button) => button.addEventListener('click', () => selectStage(button.dataset.stage)));
  }
  function syncNavigationIndicators() {
    for (const [selector, activeSelector] of [['.view-tabs', '.active'], ['.period-controls', '.selected']]) {
      const parent = $(selector); const active = parent.querySelector(activeSelector);
      if (!active) continue;
      let indicator = parent.querySelector('.nav-indicator');
      if (!indicator) { indicator = document.createElement('i'); indicator.className = 'nav-indicator'; indicator.setAttribute('aria-hidden', 'true'); parent.append(indicator); }
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.translate = `${active.offsetLeft}px 0`;
    }
  }
  function appear(element, direction = 'up') {
    if (reducedMotion.matches || !element.animate) return;
    element.getAnimations().forEach((animation) => animation.cancel());
    const transform = direction === 'right' ? 'translateX(18px)' : 'translateY(10px)';
    element.animate([{ opacity: 0, transform }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.75,.15,1)' });
  }
  function disappear(element) {
    if (element.hidden) return;
    if (!reducedMotion.matches && element.animate) {
      const rect = element.getBoundingClientRect();
      const ghost = element.cloneNode(true); ghost.inert = true; ghost.setAttribute('aria-hidden', 'true');
      ghost.removeAttribute('id'); ghost.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
      Object.assign(ghost.style, { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, right: 'auto', bottom: 'auto', margin: '0', zIndex: '30', pointerEvents: 'none' });
      document.body.append(ghost);
      const animation = ghost.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px)' }], { duration: 190, easing: 'ease-out', fill: 'forwards' });
      animation.finished.then(() => ghost.remove()).catch(() => ghost.remove());
    }
    element.hidden = true;
  }
  function syncControls() {
    $('.reading-note').textContent = state.view === 'stream' ? 'Drag to move, and scroll to zoom. Click an event to open it. Hold Shift for time only, Alt for severity only.' : 'Select an event to inspect its evidence.';
    $('.legend .toggle').hidden = false;
    $('.legend .toggle').style.visibility = state.view === 'stream' ? '' : 'hidden';
    $('.legend .toggle').inert = state.view !== 'stream';
    $('#workstream-legend').classList.toggle('has-filter', state.workstream !== 'all');
    $$('#workstream-legend [data-workstream-key]').forEach((button) => button.setAttribute('aria-pressed', String(state.workstream === button.dataset.workstreamKey)));
  $$('[data-lifecycle]').forEach((button) => { const active = button.dataset.lifecycle === state.lifecycle; button.classList.toggle('selected', active); button.setAttribute('aria-pressed', String(active)); });
    $$('[data-status]').forEach((button) => button.setAttribute('aria-pressed', String(state.statuses.has(button.dataset.status))));
    $('#stage-filter').value = state.stage; $('#severity-filter').value = state.severity;
    $('#stage-label').textContent = state.stage === 'all' ? 'All stages' : stageMap.get(state.stage).label;
    $('#stage-total').textContent = state.stage === 'all' ? '27' : '1';
    $('#actual-interventions').setAttribute('aria-pressed', String(state.interventions));
    const extras = [state.stage !== 'all' && stageMap.get(state.stage).label, state.temporal === 'open' && 'Unbounded dates'].filter(Boolean);
    $('#inquiry-context').hidden = !state.investigation || state.view === 'cast';
    $('#return-inquiry').textContent = state.investigation ? `${state.investigation.title}` : '';
    $('#scene').classList.toggle('has-inquiry', !!state.investigation && state.view !== 'cast');
    $('#active-filter').hidden = !extras.length; $('#active-filter').textContent = `${extras.join(' · ')} ×`;
    const filterCount = Number(state.stage !== 'all') + Number(state.workstream !== 'all') + Number(state.severity !== 'all') + Number(state.interventions) + Number(state.temporal !== 'all') + (4 - state.statuses.size);
    $('#filter-indicator').textContent = filterCount || '';
    $('#range-start').value = new Date(state.range[0]).toISOString().slice(0, 10);
    $('#range-end').value = new Date(state.range[1] - 1).toISOString().slice(0, 10);
    $('#query-feedback').hidden = !query.error;
    $('#query-feedback').textContent = query.error || '';
    $('#event-search').setAttribute('aria-invalid', String(!!query.error));
    $('#viewport-count').hidden = state.view !== 'stream';
    $('#assessment-tabs').hidden = state.view === 'cast';
    $('#zoom-y-out').parentElement.querySelector('span').textContent = state.assessment === 'impact' ? 'Severity ↕' : 'Vertical ↕';
    $('#zoom-y-out').disabled = state.vertical[1] - state.vertical[0] >= .999;
    $('#move-up').disabled = state.vertical[0] <= 0;
    $('#move-down').disabled = state.vertical[1] >= 1;
    if (!$('#stage-panel').hidden) renderStages();
    syncNavigationIndicators();
  }
  function refresh() {
    stopMotion();
    allFilteredPool = events.filter((event) => matchesBase(event) && matchesGroup(event)).sort(readingSort);
    filteredPool = allFilteredPool.filter(matchesAssessment);
    filteredIds = new Set(filteredPool.map((event) => event.id));
    overviewBins = [];
    syncControls(); visible = getVisible(); syncAssessmentCounts();
    $('#date-tail-label').textContent='Unknown start · tail length is not duration';
    bowCanvas.dataset.openTails=String(bowPoints.filter(p=>p.event._time.openStart).length);
    $('#visible-count').textContent = visible.length; $('#total-event-count').textContent = events.length;
    if (state.view !== 'stream') { $('#unplaced-button').hidden = true; $('#undated-records').hidden = true; }
    $('#comet-layer').hidden = true;
    drawTimeline(); renderList(); if (!detailPanel.hidden) renderDetail();
    if (state.view === 'bowtie') renderBowtie();
    if (state.view === 'cast') renderCast();
    scrollGateway?.invalidate();
  }
  function reset() {
    clearTimeout(queryTimer);
    navigate(() => {
      Object.assign(state, { investigation: null, assessment: 'impact', search: '', stage: 'all', lifecycle: 'all', workstream: 'all', severity: 'all', range: [...fullRange], vertical: [0, 1], interventions: false, temporal: 'all', limit: 12, statuses: new Set(Object.keys(SHAPES)), intervals: false });
      query = window.HaruspexQuery.compile(''); $('#event-search').value = ''; $('#interval-toggle').checked = false;
    });
  }
  function renderCast() {
    if (!castUI) castUI = window.HaruspexCast.mount({ element: $('#cast-map'), data: castData, research: researchData, quotations: quotationData, events,
      onNavigate: () => scrollToField({behavior:'instant'}),
      onTrace: (finding, view) => {
        if ($('#info-dialog').open) $('#info-dialog').close();
        clearTimeout(queryTimer);
        Object.assign(state, { investigation: { id: finding.id, title: finding.title, ids: new Set(finding.event_ids) }, search: '', stage: 'all', lifecycle: 'all', workstream: 'all', severity: 'all', interventions: false, temporal: 'all', vertical: [0,1], statuses: new Set(Object.keys(SHAPES)), range: [...fullRange] });
        state.assessment = finding.event_ids.some(id=>assessmentOf(eventMap.get(id))==='impact') ? 'impact' : assessmentOf(eventMap.get(finding.event_ids[0]));
        query = window.HaruspexQuery.compile(''); $('#event-search').value = '';
        if (state.view === view) navigate(() => {}, {fit:true});
        else { state.range = fitMatchingRange(); state.limit = 12; changeView(view); }
        scrollToField({behavior:'instant'});
      },
      onEvent: (id) => { if ($('#info-dialog').open) $('#info-dialog').close(); changeView('stream'); selectEvent(id, { reveal: true }); scrollToField({ behavior: reducedMotion.matches ? 'auto' : 'smooth' }); },
      onDialog: openDialog,
    });
  }
  function setView(view) {
    showStar(null);
    state.view = view; $('#scene').dataset.view = view;
    if (view === 'cast') { detailPanel.getAnimations().forEach(animation=>animation.cancel()); if(!detailPanel.hidden)closeDetails(); }
    for (const key of ['stream', 'bowtie', 'cast']) $(`#${key}-view`).hidden = key !== view;
    $$('.view-tab').forEach((button) => { const selected = button.id === `${view}-tab`; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; button.classList.toggle('active', selected); });
    closeLegend(); closeStages(); $('#advanced-filters').hidden = true; $('#filter-toggle').setAttribute('aria-expanded', 'false');
    if(view!=='cast')drawCosmos();
  }
  function freezeVisibleView() {
    const outgoing = $(`#${state.view}-view`);
    const ghost = outgoing.cloneNode(true);
    const originals = [outgoing, ...outgoing.querySelectorAll('*')];
    const copies = [ghost, ...ghost.querySelectorAll('*')];
    const animated = new Set(outgoing.getAnimations({subtree:true}).map(animation => animation.effect?.target));
    const scrolls = [];
    for (let i = 0; i < originals.length; i += 1) {
      const original = originals[i]; const copy = copies[i];
      // Removing IDs must not remove the displayed layout or retina canvas sizing.
      if (original.id || original.tagName === 'CANVAS' || animated.has(original)) {
        const computed = getComputedStyle(original);
        copy.style.cssText = Array.from(computed, key => `${key}:${computed.getPropertyValue(key)};`).join('');
        copy.style.setProperty('animation', 'none', 'important');
        copy.style.setProperty('transition', 'none', 'important');
      }
      if (original.tagName === 'CANVAS') {
        copy.width = original.width; copy.height = original.height;
        copy.getContext('2d').drawImage(original, 0, 0);
      }
      if (original.scrollTop || original.scrollLeft) scrolls.push([copy, original.scrollTop, original.scrollLeft]);
      copy.removeAttribute('id');
    }
    ghost.hidden = false; ghost.inert = true;
    ghost.classList.add('view-ghost'); ghost.setAttribute('aria-hidden', 'true');
    Object.assign(ghost.style, {position:'absolute', inset:'0', zIndex:'20', pointerEvents:'none'});
    // A point morph is painted on a sibling canvas. Capture that visible frame,
    // rather than exposing the still-hidden destination underneath it.
    if (motionFrame !== null) {
      const live = snapshotCanvas(transitionCanvas);
      Object.assign(live.style, {position:'absolute',inset:'0',width:'100%',height:'100%',zIndex:'5'});
      ghost.append(live);
      if (transitionLabels) ghost.append(transitionLabels.cloneNode(true));
    }
    const origin = $('.visual-column > .field-origin');
    if (origin) {
      const copy = origin.cloneNode(true);
      if (origin.tagName === 'CANVAS') { copy.width=origin.width;copy.height=origin.height;copy.getContext('2d').drawImage(origin,0,0); }
      const computed = getComputedStyle(origin);
      copy.style.cssText = Array.from(computed, key => `${key}:${computed.getPropertyValue(key)};`).join('');
      copy.style.setProperty('animation', 'none', 'important');
      copy.style.setProperty('transition', 'none', 'important');
      ghost.append(copy);
    }
    $('.visual-column').append(ghost);
    for (const [copy, top, left] of scrolls) { copy.style.scrollBehavior='auto'; copy.scrollTop=top; copy.scrollLeft=left; }
    return ghost;
  }
  function fadeFrozenView(ghost, duration = 330) {
    if (!ghost) return;
    const alpha = Number.parseFloat(ghost.style.opacity) || 0;
    const leaving = ghost.animate([{opacity:alpha},{opacity:0}], {duration,easing:'cubic-bezier(.2,.65,.25,1)',fill:'forwards'});
    leaving.finished.then(() => ghost.remove()).catch(() => ghost.remove());
  }
  function settleMotionForGesture() {
    const ghost = (motionFrame !== null || $('.visual-column > .field-origin')) && !reducedMotion.matches ? freezeVisibleView() : null;
    stopMotion(); fadeFrozenView(ghost, 170);
  }
  function changeView(view) {
    if (view === state.view) return;
    if (view !== 'cast' && state.view !== 'cast') { navigate(() => setView(view)); return; }
    const ghost = !reducedMotion.matches ? freezeVisibleView() : null;
    // Keep already-fading snapshots alive during rapid reversals. Each expires
    // independently, so a partially visible view is never replaced at full opacity.
    const outgoing = $(`#${state.view}-view`);
    outgoing.getAnimations().forEach(animation => animation.cancel());
    finishCamera(); stopMotion(); cancelGestures();
    setView(view); refresh();
    const incoming = $(`#${view}-view`);
    incoming.getAnimations().forEach(animation => animation.cancel());
    if (!reducedMotion.matches) {
      incoming.animate([{opacity:0},{opacity:1}], {duration:330,easing:'cubic-bezier(.2,.65,.25,1)'});
      fadeFrozenView(ghost);
    } else $$('.view-ghost').forEach(element => element.remove());
    syncNavigationIndicators();
  }
  function scrollToField(options={}) {
    if(scrollGateway)scrollGateway.enter(options);
    else $('#scene').scrollIntoView(options);
  }
  function enterField() {
    changeView('stream');finishCamera();stopMotion();
    if(scrollGateway)scrollGateway.show();
    else $('#scene').scrollIntoView({behavior:'instant'});
  }
  const roman = value => {let n=value,out='';for(const[v,s]of [[1000,'m'],[900,'cm'],[500,'d'],[400,'cd'],[100,'c'],[90,'xc'],[50,'l'],[40,'xl'],[10,'x'],[9,'ix'],[5,'v'],[4,'iv'],[1,'i']])while(n>=v){out+=s;n-=v;}return out;};
  let noteSerial=0;
  function endnotes(container){
    const anchors=[...container.querySelectorAll('.citation-only a[href^="https://"],.research-source a[href^="https://"]')].filter(a=>!a.closest('.endnotes,.paper-source-notes')&&!a.hasAttribute('download'));
    if(!anchors.length)return;
    const prefix=`notes-${++noteSerial}`,sources=[],index=new Map();
    for(const anchor of anchors){
      const href=anchor.href;
      let n=index.get(href);if(!n){n=sources.length+1;index.set(href,n);sources.push({url:href,title:anchor.textContent.replace(/[↗↗]/g,'').trim()||'Source'});}
      const sup=document.createElement('sup');sup.className='endnote-ref';
      const link=document.createElement('a');link.href=`#${prefix}-${n}`;link.textContent=roman(n);link.setAttribute('aria-label',`Endnote ${roman(n)}`);link.addEventListener('click',event=>{event.preventDefault();const note=document.getElementById(`${prefix}-${n}`);note?.scrollIntoView({behavior:'smooth',block:'nearest'});note?.focus({preventScroll:true});});sup.append(link);
      if(!anchor.closest('.dialog-source,.source-link,.source-locator,.research-source,.citation-only')&&!/source|report|timeline|investigation|Handbook|METR|NIST|primary|^S\d|^NS\d/i.test(anchor.textContent)&&anchor.textContent.trim().length<70)anchor.before(document.createTextNode(anchor.textContent));
      anchor.replaceWith(sup);
    }
    const section=document.createElement('section');section.className='endnotes';section.setAttribute('aria-label','Endnotes');
    section.innerHTML=`<h3>Endnotes</h3><ol class="roman-endnotes">${sources.map((source,i)=>`<li id="${prefix}-${i+1}" tabindex="-1"><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a></li>`).join('')}</ol>`;
    container.append(section);
  }
  const glossary=[
    ['CAST','Causal Analysis based on Systems Theory: a method for investigating how people, technology and organizational controls combined to produce an incident.'],
    ['STAMP','Systems-Theoretic Accident Model and Processes: the safety model underlying CAST.'],
    ['Artifactory','A repository used to store software packages and cached files. Agents used OpenAI’s instance as a shared communication channel.'],
    ['ExploitGym','An evaluation environment that assigns agents cybersecurity tasks.'],
    ['METR','Model Evaluation & Threat Research, an independent AI evaluation organization.'],
    ['Redwood','Redwood Research, an AI safety research organization that worked with METR on the investigation.'],
    ['CoT','Chain of thought: the intermediate reasoning text recorded in an agent’s transcript. It is evidence of recorded reasoning, not proof of the agent’s actual cause or intent.'],
    ['HPIM','Highly persistent internal model: METR’s name for the principal OpenAI model in the incident.'],
    ['SSRF','Server-side request forgery: using a server to make requests to destinations the requester could not reach directly.'],
    ['CI','Continuous integration: automated checks and builds applied to software changes.'],
    ['CVE','Common Vulnerabilities and Exposures: the identifier system for publicly disclosed security vulnerabilities.'],
    ['API','Application programming interface: a way for software to request data or actions from another system.'],
    ['SSH','Secure Shell: a protocol for remote access, also used to carry traffic through encrypted tunnels.'],
    ['XSS','Cross-site scripting: injecting code that executes in another user’s browser.'],
    ['UTC','Coordinated Universal Time, the time standard used throughout this timeline.'],
    ['sandbox','An isolated environment intended to restrict the resources and actions available to a program.'],
    ['ablation','A controlled comparison that removes or changes one training ingredient to test its contribution.'],
    ['checkpoint','A saved version of a trained model.'],
    ['scorer','The automated process that judges whether an evaluation task succeeded.'],
    ['bow-tie','A view grouping precursors, incident activity and subsequent response around a central event. Its connecting lines do not establish causation.'],
  ];
  function explainTerms(container){
    if(container.querySelector('.view-terms'))return;
    const text=container.textContent;
    const terms=glossary.filter(([term])=>new RegExp(`\\b${term}\\b`,'i').test(text));
    if(!terms.length)return;
    const block=document.createElement('details');block.className='view-terms';block.innerHTML=`<summary>Terms used here</summary><dl>${terms.map(([name,meaning])=>`<dt>${escapeHtml(name)}</dt><dd>${escapeHtml(meaning)}</dd>`).join('')}</dl>`;container.append(block);
  }
  window.HaruspexReader={annotate(container){endnotes(container);explainTerms(container);}};
  function coverageContent(found=false){
    const wiki=(researchData.supplemental_events||[]).length;
    return `<p class="coverage-intro"><strong>${found?'You found it! ':''}Beyond these ${events.length} explorable events, there are more than 70,000 messages and files in the message-board corpus examined by METR (Model Evaluation & Threat Research) and Redwood Research.</strong><a href="https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/">METR and Redwood, Main data sources</a></p>
      <p>Their source dump contained about <strong>1.2 million raw entries</strong>, mostly fragments encoding files. These are a more granular representation of the same material. The wider cache contained about <strong>20 million files and directories</strong>. Around <strong>1,300 agent transcripts</strong> recorded runs that could each contain many actions.<a href="https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/">METR and Redwood, Cache dump and transcripts</a></p>
      <p>Hugging Face separately reports roughly <strong>17,600 recovered attacker actions</strong>.<a href="https://huggingface.co/blog/agent-intrusion-technical-timeline">Hugging Face forensic timeline</a> These units overlap. Adding their totals would double-count activity.</p>
      <p>The current inventory includes ${wiki} wiki actions and findings in Unresolved. Their source considers that swarm probably distinct.<a href="https://collusion.wiki/">Nightingale wiki investigation</a></p>
      <h3>What is the full event count?</h3><p>Unknown. Establishing it would require fuller activity logs and run identifiers from <strong>OpenAI</strong>, forensic records from <strong>Hugging Face</strong>, the transcript inventory and deduplication methods from <strong>METR and Redwood</strong>, and wiki histories and coverage limits from <strong>Nightingale and the wiki operators</strong>. The records must be reconciled across sources. Activity that was never logged may remain unknowable.</p>
      <h3>What the stars represent</h3><p>70,000 faint points evoke the scale of the distinct messages and files. Their shuffled numbers are decorative identifiers. They are not additional verified events, raw file fragments, or a claim that the full event count is 70,000.</p>`;
  }
  function openDialog(title, content) {
    if (!$('#info-dialog').open) dialogTrigger = document.activeElement;
    $('#dialog-content').innerHTML = `<h2 id="dialog-title">${title}</h2>${content}`;
    if(title!=='Sources')window.HaruspexReader.annotate($('#dialog-content'));
    $('#info-dialog').showModal(); if (!CSS.supports('transition-behavior', 'allow-discrete')) appear($('#info-dialog')); $('#dialog-close').focus();
  }
  function openTemporalRecord(event) {
    const temporal = temporalMap.get(event.id);
    const reviewLabel = temporal.assessment_status === 'canonical_carried_forward_not_individually_researched' ? 'Original source window retained; not individually rechecked in this search.' : temporal.assessment_status === 'reviewed_contextual_upper_bound' ? 'Upper bound inferred; earliest date remains unresolved.' : 'Rechecked against the cited primary material.';
    openDialog(`${event.id} · Date evidence`, `<p>${escapeHtml(event.title)}</p><h3>${escapeHtml(dateLabel(event))}</h3><p>${escapeHtml(temporal.rationale.replace('See research_groups.', '').trim())}</p><dl class="record-fields">${factForRecord('Date precision', temporal.time_precision)}${factForRecord('Basis', temporal.time_basis)}${factForRecord('Review', reviewLabel)}</dl><h3>Sources</h3>${temporal.source_evidence.map((source) => `<p><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.source_id || 'Primary cross-check')} · ${escapeHtml(source.locator)}</a></p>`).join('')}<p>The original date fields remain unchanged in the event details. Contextual bounds are not an individual event date.</p>`);
  }
  function openRecord(event) {
    const fields = data.codebook.map((definition) => {
      const value = event[definition.field];
      const missing = value === null || value === undefined;
      let rendered = missing ? 'Unknown / not applicable — see the related basis and uncertainty fields.' : Array.isArray(value) ? value.length ? escapeHtml(value.join('; ')) : 'None recorded' : escapeHtml(value);
      if (definition.field === 'source_url' && value) rendered = `<a href="${escapeHtml(value)}" target="_blank" rel="noopener noreferrer">Open primary source</a>`;
      return `<dt>${escapeHtml(definition.field.replaceAll('_', ' '))}</dt><dd class="${missing ? 'missing' : ''}">${rendered}</dd>`;
    }).join('');
    openDialog(`${event.id} · Event details`, `<p>${escapeHtml(event.title)}</p><p>Current assessment: ${severityBadge(event)}.</p><p>The fields below preserve the original dataset. Its “observed severity” field contains earlier coding and may differ from the current assessment above.</p><dl class="record-fields">${fields}</dl>`);
  }
  function openConflict(id) {
    const conflict = data.conflicts.find((item) => item.conflict_id === id);
    if (!conflict) return;
    openDialog(conflict.subject, `<p>${escapeHtml(conflict.detail)}</p><p>${escapeHtml(conflict.status)}.</p>${conflict.source_ids.map((sourceId) => sourceCard(SOURCE_MAP.get(sourceId))).join('')}<h3>Related events</h3><p>${conflict.event_ids.map((eventId) => `${eventId}: ${escapeHtml(eventMap.get(eventId)?.title || '')}`).join('<br>')}</p>`);
  }
  function sourceCard(source) { return `<div class="dialog-source"><span class="source-id">${source.source_id}</span><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a><p>${escapeHtml(source.publisher)}${source.publication_date ? ` · ${shortDate(parseDay(source.publication_date), true)}` : ''}<br>${escapeHtml(source.source_notes)}</p></div>`; }
  function updateSeverityOptions() {
    $('#severity-filter').innerHTML = '<option value="all">Any severity</option>' + bandDefinitions.map((band) => `<option value="${band.key}">${band.label}</option>`).join('');
  }
  function openFramework() {
    const incident = severityData.incident_assessment;
    const overall = incident ? `<section class="incident-assessment"><h3>The overall incident</h3><strong>${bandBadge(bandMap.get(String(incident.score)))}</strong><p>${escapeHtml(incident.rationale)}</p><small>${escapeHtml(incident.aggregation_policy || 'A separate assessment of the documented incident chain, not a sum of event scores.')}</small><p>${(incident.source_evidence || []).map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.source_id)} · ${escapeHtml(source.locator)}</a>`).join('<br>')}</p></section>` : '';
    openDialog('Assessment criteria', `<p>All five positive levels assess consequences for the affected systems and organization. 5 requires devastating organizational consequences; it does not require nationwide or societal harm. Severity appears as a boxed number and, in the Impact field, a vertical band. Context and Unresolved are separate unordered fields. Marker size distinguishes a single reported unit from grouped activity whose individual instances are unavailable. It does not encode severity or the number of underlying instances. Color identifies workstream.</p><p>Zero marks a near-miss within the assessed outcome. Preventive actions occupy an unnumbered band below zero, marked −.</p>${overall}<table class="framework-table"><tbody>${legendOrder.map((key) => bandMap.get(key)).map((band) => `<tr><th>${bandBadge(band)}</th><td>${escapeHtml(band.definition)}</td></tr>`).join('')}</tbody></table><p>All 549 previously unassessed events have now been reviewed. Context marks claims to which severity is inapplicable; Unresolved identifies missing effect evidence and names the gap. Neither is zero. The score belongs to the specific effect described by the event, not the entire incident. A failed step can be a near-miss even when other steps caused harm.</p><p>These are provisional Haruspex assessments. NIST’s organizational-impact definitions inform the scope, but its potential-impact categories are not converted into event scores. This is not an official NIST or MIT scale. Values are ordinal and should not be added, averaged or netted against protective actions. Administrator access and broad credential exposure can qualify as severe; catastrophic requires evidence of devastating consequences within the stated organizational scope.</p><p>${severityData.scale.institutional_context.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name)}</a>`).join('<br>')}</p>`);
  }
  function openImpactRecord(event) {
    const assessment = severityMap.get(event.id);
    openDialog(`${event.id} · Severity assessment`, `<p>${escapeHtml(event.title)}</p><h3>${escapeHtml(bandLabel(event))}</h3><p>${escapeHtml(assessment.rationale)}</p><dl class="record-fields">${factForRecord('Assessed scope', assessment.scope)}${factForRecord('Basis', assessment.basis.replaceAll('_', ' '))}${factForRecord('Review status', (assessment.review_status || 'previously_assessed').replaceAll('_', ' '))}${factForRecord('Confidence', assessment.confidence.replaceAll('_', ' '))}${factForRecord('Confidence applies to', assessment.confidence_scope)}</dl><h3>Evidence</h3>${assessment.source_evidence.map((source) => `<p><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.source_id)} · ${escapeHtml(source.locator)}</a></p>`).join('')}<p>The original 45 dataset fields remain available unchanged in the event details.</p>`);
  }
  function factForRecord(label, value) { return `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`; }
  function openMethod() {
    openDialog('Reading the field', `<p>Haruspex brings together ${events.length} explorable events across Impact, Context, and Unresolved from ${data.sources.length} primary sources. Each point is a reported action, result, communication, decision or investigative finding. Some events describe grouped activity because details of the individual instances are unavailable.</p><h3>Color follows the workstream</h3><div class="method-workstreams">${visualData.groups.map((group) => `<span>${workstreamSwatch(group)}${escapeHtml(group.label)}</span>`).join('')}</div><p>Each color identifies one part of the incident: evaluation, access, coordination, intrusion, response or investigation. These group the source workstream labels already attached to the events. An event keeps its color across every view, whatever its severity or evidence status. All events retain their workstream color. Context has a hollow outline; Unresolved has a broken outline. Those treatments preserve the evidence shape and do not invent a numerical severity. Click a color key to filter that workstream; click it again to restore all workstreams.</p><h3>Shape tells you about evidence</h3><div class="method-key">${Object.keys(SHAPES).map((status) => `<span><i class="mark ${SHAPES[status]}"></i>${LABELS[status]}</span>`).join('')}</div><p>Reported means attested by the cited source, not independently established ground truth. Reasoning events preserve what an agent or person said or decided; they do not prove motivation or cause. Inferred events reflect a source’s inference. Discrepancies preserve accounts that may describe different stages.</p><h3>Time has different resolutions</h3><p>${events.filter(e=>e.event_date&&e.event_time_utc).length} events have an individual clock time, ${events.filter(e=>e.event_date&&!e.event_time_utc).length} have a date only, and ${events.filter(e=>!e.event_date).length} have context intervals. Exact clock points keep their source time. Points without individual times are packed within the visible part of their source date windows for readability. Their horizontal position is not a known time or order, and placement adapts when the view changes. Select a point or enable Date windows to see its interval as a line. Color and shape identify workstream and evidence; size distinguishes a single reported unit from grouped activity; it does not count the underlying instances. None encodes date precision; dates and their limits are also shown in the tooltip and event details. The 12 events without a supported earliest date have tails that fade in from the left and end at their upper date bound, within their Impact or Context field. The head marks the latest contextual bound, not the event time. A tail has no known starting point, duration or probability distribution. If its bound lies outside the visible range, only the continuing tail appears; its head is never moved to the edge. Select a head or trail to open the event. All remain available in the event list. Fresh primary-source checks did not establish their individual dates; their contextual upper bound is inferred and visible in Date evidence. They can appear in the bow tie, which does not assign a time coordinate.</p><h3>One severity scale</h3><p>Levels 1–5 describe consequences for the affected systems and organization, from a small local effect to devastating organizational loss. They use the same scope throughout. Zero identifies a documented near-miss with no realized harm in the specific assessed outcome. Preventive actions occupy a separate band below zero, with no numerical magnitude assigned. Context and Unresolved have their own unordered fields, reached through the category controls. They have no position on the severity scale. Unresolved includes uncertain consequences and an unconfirmed connection to this incident, as specified in each event. Their reviews are complete, with no numeric score invented. Open Severity to read the criteria, or an event to inspect its rationale.</p><h3>The event swarm and the bow tie</h3><p>The name Event swarm is inspired by <a href="https://observablehq.github.io/plot/transforms/dodge" target="_blank" rel="noopener noreferrer">beeswarm plots</a>, which keep individual points visible. This adaptation accommodates source date windows.</p><p>Small vertical offsets separate points at the same severity; those offsets have no analytical meaning. The distant field suggests the much larger activity that cannot be individually resolved here: roughly 17,600 recovered attacker actions in Hugging Face’s account and more than 70,000 distinct messages and files in METR’s account. These source totals can overlap and use different units; they cannot be added or reduced by subtracting the displayed event count. Background stars suggest aggregate density. Their hidden numbers belong to a decorative catalogue, with no incident details, dates or severity attached. <span class="citation-only"><a href="https://huggingface.co/blog/agent-intrusion-technical-timeline" target="_blank" rel="noopener noreferrer">Hugging Face forensic timeline</a> · <a href="https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/" target="_blank" rel="noopener noreferrer">METR and Redwood investigation</a></span> Before, During and After group incident roles, independently of date. Choose any of the 27 stages to narrow the field. The bow tie uses the same membership and filters. Structure exposes the ontology, definitions and connected facets. Points retain their identity as they move between views. The motion explains a change of layout, not a path through time or a causal connection. Each focused lifecycle is a single continuous field. Shared event positions stay stable when filters change; interrupted movement resumes from the displayed position and velocity. Responses may happen while activity continues. Reduced-motion preferences are respected.</p><h3>What is missing stays visible</h3><p>Every event includes all 45 fields, including unavailable values. The dataset does not expand published totals into invented individual events, reconstruct inaccessible private logs, or invent optimal interventions. Its ${events.length} events are a working inventory, not a proven absolute maximum. The CAST view adds six analyst proposals alongside six groups of reported changes. Each retains evidence, unknowns and verification needs; none is claimed to be an optimal intervention. Its 16 open questions preserve the earlier investigation register. The investigation connects events to control paths, findings, additional public evidence and specific collection plans. It is a provisional CAST analysis; new evidence can revise it. The original question register stays intact, with new findings and remaining gaps recorded alongside it.</p><h3>Explore the events</h3><p>Select a point, browse the event list, or search for an actor, system or event ID. Drag the field to move in either direction. Scroll to zoom both axes, hold Shift for time alone or Alt for vertical zoom alone; the separate Time and vertical buttons offer the same controls. When the field has keyboard focus, arrow keys pan and + / − zoom. Home fits the matching events. The field remains pinned briefly as you scroll, then gives way to the event list. Navigation never changes a stored event time. Drag either handle on the overview to adjust that end of the date range. Drag its middle to move the whole window, or set the From and To dates. The end date is inclusive and all dates use UTC. The overview groups events by window midpoints as a navigation aid; its heights are not counts of verified events at those times. Keyboard users can reach every filtered event through the list; open an event to inspect all fields and its primary source. Export downloads the complete dataset, including field definitions and source comparisons.</p>`);
  }
  function openOntology() {
    openDialog('Incident structure', `<p>${events.length} events organized into 27 stages and six workstreams. The wiki events are included in Unresolved because their relationship to the Hugging Face incident is unconfirmed.</p><div class="ontology-lifecycle">${ontology.lifecycle.map((life) => `<button data-ontology-life="${life.id}"><strong>${escapeHtml(life.label)}</strong><span>${life.count} events</span><small>${escapeHtml(life.definition)}</small></button>`).join('')}</div><p>These are roles within the incident. Response and investigation can overlap ongoing activity; dates remain an independent dimension.</p><h3>Explore a stage</h3><div class="ontology-stages">${visualData.groups.map((group) => `<section><h4>${workstreamSwatch(group)}${escapeHtml(group.label)}</h4>${ontology.stages.filter((stage) => stage.workstream_id === group.key).map((stage) => `<button data-ontology-stage="${stage.id}">${escapeHtml(stage.label)}<small>${stage.count}</small></button>`).join('')}</section>`).join('')}</div><h3>What each event connects</h3><div class="ontology-relations"><span>Actor</span><span>System</span><span>Stage</span><strong>Event</strong><span>Source</span><span>Assessment</span><span>Lifecycle</span></div><p>Every event retains its actor, system context, source, date window, stage and assessment. The connections describe the available evidence; they do not invent causal links.</p><details class="ontology-definitions"><summary>Ontology definitions and provenance</summary><dl>${ontology.entity_types.map((type) => `<dt>${escapeHtml(type.label)}</dt><dd>${escapeHtml(type.definition)}</dd>`).join('')}</dl><table class="framework-table"><tbody>${ontology.relation_types.map((relation) => `<tr><th>${escapeHtml(relation.label)}</th><td>${escapeHtml(relation.domain)} → ${escapeHtml(relation.range)}<br>${escapeHtml(relation.definition)}</td></tr>`).join('')}</tbody></table><p>The local model uses concepts from published cyber-investigation standards to describe entities, relationships and source provenance. It does not claim formal conformance to those standards. Its full definitions and event assignments are included in Export.</p>${ontology.sources.map((source) => `<p><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name || source.title)}</a></p>`).join('')}</details>`);
    $$('[data-ontology-life]').forEach((button) => button.addEventListener('click', () => { $('#info-dialog').close(); closeStages(); selectLifecycle(button.dataset.ontologyLife); }));
    $$('[data-ontology-stage]').forEach((button) => button.addEventListener('click', () => { $('#info-dialog').close(); selectStage(button.dataset.ontologyStage); }));
  }
  function openQueryHelp() {
    const examples = [['Substantial or worse', 'severity>=3'], ['Hugging Face systems', 'system:"Hugging Face"'], ['Agent coordination', 'stage:"Agent coordination"'], ['Reported near-misses', 'severity:0 evidence:reported'], ['OpenAI’s account', 'source:S01'], ['Incident precursors', 'lifecycle:before']];
    openDialog('Search the incident', `<p>Search freely, or combine a few fields to ask a more precise question.</p><div class="query-examples">${examples.map(([label, value]) => `<button data-query="${escapeHtml(value)}"><span>${label}</span><code>${escapeHtml(value)}</code></button>`).join('')}</div><p>Combine terms with spaces. Put a phrase in quotation marks; add a minus before a term to exclude it.</p><p><code>severity>=3 system:"Hugging Face" -source:S02</code></p><p>Available fields: actor, system, stage, workstream, lifecycle, source, evidence, severity, outcome and id. Severity also accepts <code>preventive</code>, <code>context</code>, and <code>unresolved</code>.</p><p>Dates use <code>date:2026-07-11</code>, <code>before:2026-07-11</code> or <code>after:2026-07-11</code>. Date searches include compatible source windows, so a match does not establish an exact event time.</p><p>The lifecycle, stage and other active filters still apply. Fit reframes the matching events.</p>`);
    $$('[data-query]').forEach((button) => button.addEventListener('click', () => {
      $('#info-dialog').close(); clearTimeout(queryTimer);
      navigate(() => { state.search = button.dataset.query; query = window.HaruspexQuery.compile(state.search); alignAssessmentToSearch(); $('#event-search').value = state.search; }, { fit: true });
    }));
  }
  function notify(message) {
    clearTimeout(noticeTimer); $('#notification').textContent = message; $('#notification').hidden = false;
    noticeTimer = setTimeout(() => { $('#notification').hidden = true; }, 2800);
  }
  function tailY(tail, x) {
    const u = Math.max(0, Math.min(1, (x - tail.startX) / Math.max(1, (tail.headVisible ? tail.x : tail.endX) - tail.startX)));
    return tail.y + tail.bend * Math.sin(u * Math.PI) * (1 - .35 * u);
  }
  function hitTest(x, y, radius = 14) {
    const hits = points.map((point) => ({ ...point, distance: Math.hypot(point.x - x, point.y - y) })).filter((point) => point.distance < radius);
    const ids = new Set(hits.map((point) => point.event.id));
    for (const tail of tailSegments) {
      if (!ids.has(tail.event.id) && x >= tail.startX && x <= tail.endX && Math.abs(y - tailY(tail, x)) < 5) {
        hits.push({ ...tail, x, distance: Math.abs(y - tailY(tail, x)) + 5 });
      }
    }
    return hits.sort((a, b) => a.distance - b.distance);
  }
  function pointerCoordinates(event) { const rect = timeline.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
  timeline.addEventListener('pointermove', (event) => {
    if (motionFrame !== null) return;
    const { x, y } = pointerCoordinates(event);
    if (drag && event.pointerId === drag.id) {
      const dx = x - drag.x; const dy = y - drag.y;
      if (Math.hypot(dx, dy) > 4) drag.moved = true;
      if (drag.moved) {
        const dt = -dx / Math.max(1, plotSize.right - plotSize.left) * (drag.range[1] - drag.range[0]);
        const dv = -dy / Math.max(1, plotSize.bottom - plotSize.top) * (drag.vertical[1] - drag.vertical[0]);
        if (!event.altKey) state.range = boundedRange(drag.range[0] + dt, drag.range[1] + dt);
        if (!event.shiftKey) state.vertical = boundedVertical(drag.vertical[0] + dv, drag.vertical[1] + dv);
        queueCamera(); $('#plot-tooltip').hidden = true; showStar(null);
      }
      return;
    }
    const hits = hitTest(x, y); const tooltip = $('#plot-tooltip');
    if (!hits.length) { tooltip.hidden = true; discoverStar(event); return; }
    showStar(null);
    tooltip.innerHTML = tooltipContent(hits[0].event, hits.length); tooltip.hidden = false;
    tooltip.style.left = `${Math.max(0, Math.min(x + 16, plotSize.width - tooltip.offsetWidth))}px`;
    tooltip.style.top = `${Math.max(4, Math.min(y - tooltip.offsetHeight - 12, plotSize.height - tooltip.offsetHeight - 8))}px`;
  });
  timeline.addEventListener('pointerleave', () => { if (!drag) { $('#plot-tooltip').hidden = true; showStar(null); } });
  timeline.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    settleMotionForGesture(); const { x, y } = pointerCoordinates(event);
    drag = { id: event.pointerId, x, y, range: [...state.range], vertical: [...state.vertical], moved: false };
    timeline.setPointerCapture(event.pointerId); timeline.focus({ preventScroll: true });
  });
  timeline.addEventListener('pointerup', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const moved = drag.moved; cancelGestures(); finishCamera();
    if (!moved) {
      const { x, y } = pointerCoordinates(event);
      if (x < plotSize.left - 5) {
        const lane = plotSize.lanes.find((item) => y >= Math.max(plotSize.top, item.y - item.height / 2) && y <= Math.min(plotSize.bottom, item.y + item.height / 2));
        if (lane) navigate(() => { state.vertical = boundedVertical(lane.start - .02, lane.end + .02); });
      } else {
        const hits = hitTest(x, y, event.pointerType === 'touch' ? 24 : 14);
        if (hits.length) selectEvent(hits[0].event.id, { nearby: hits.map((point) => point.event) });
        else discoverStar(event, true);
      }
    }
  });
  timeline.addEventListener('pointercancel', cancelGestures);
  timeline.addEventListener('wheel', (event) => {
    event.preventDefault(); cancelGestures();
    const { x, y } = pointerCoordinates(event);
    const centerX = Math.max(0, Math.min(1, (x - plotSize.left) / (plotSize.right - plotSize.left)));
    const centerY = Math.max(0, Math.min(1, (y - plotSize.top) / (plotSize.bottom - plotSize.top)));
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : 1);
    zoom(Math.exp(Math.max(-.45, Math.min(.45, delta * .002))), event.shiftKey ? 'x' : event.altKey ? 'y' : 'both', centerX, centerY, false);
  }, { passive: false });
  timeline.addEventListener('keydown', (event) => {
    if (['+', '=', '-'].includes(event.key)) { event.preventDefault(); zoom(event.key === '-' ? 1.5 : .67, event.altKey ? 'y' : 'both'); return; }
    if (event.key === 'Home') { event.preventDefault(); navigate(() => {}, { fit: true }); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    navigate(() => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const delta = (state.range[1] - state.range[0]) * .2 * (event.key === 'ArrowLeft' ? -1 : 1);
        state.range = boundedRange(state.range[0] + delta, state.range[1] + delta);
      } else {
        const delta = (state.vertical[1] - state.vertical[0]) * .3 * (event.key === 'ArrowUp' ? -1 : 1);
        state.vertical = boundedVertical(state.vertical[0] + delta, state.vertical[1] + delta);
      }
    });
  });
  let brushDrag = null;
  const brush = $('#range-brush');
  function brushTime(clientX) {
    const rect = overview.getBoundingClientRect();
    return fullRange[0] + Math.max(0, Math.min(1, (clientX - rect.left - 3) / (rect.width - 7))) * (fullRange[1] - fullRange[0]);
  }
  function setEndpoint(edge, value) {
    if (edge === 'start') state.range = [Math.max(fullRange[0], Math.min(state.range[1] - MIN_TIME_SPAN, value)), state.range[1]];
    else state.range = [state.range[0], Math.min(fullRange[1], Math.max(state.range[0] + MIN_TIME_SPAN, value))];
  }
  brush.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault(); settleMotionForGesture(); cancelGestures();
    const time = brushTime(event.clientX); const edge = event.target.closest('[data-edge]')?.dataset.edge;
    if (!edge && (time < state.range[0] || time > state.range[1])) {
      const span = state.range[1] - state.range[0]; state.range = boundedRange(time - span / 2, time + span / 2); queueCamera();
    }
    brushDrag = { id: event.pointerId, mode: edge || 'pan', time, range: [...state.range] };
    brush.setPointerCapture(event.pointerId);
    if (edge) event.target.focus({ preventScroll: true });
  });
  brush.addEventListener('pointermove', (event) => {
    if (!brushDrag || brushDrag.id !== event.pointerId) return;
    const time = brushTime(event.clientX);
    if (brushDrag.mode === 'pan') {
      const delta = time - brushDrag.time; state.range = boundedRange(brushDrag.range[0] + delta, brushDrag.range[1] + delta);
    } else setEndpoint(brushDrag.mode, time);
    queueCamera();
  });
  function finishBrush(event) { if (brush.hasPointerCapture(event.pointerId)) brush.releasePointerCapture(event.pointerId); brushDrag = null; finishCamera(); }
  brush.addEventListener('pointerup', finishBrush); brush.addEventListener('pointercancel', finishBrush);
  $$('[data-edge]').forEach((handle) => handle.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const edge = handle.dataset.edge; const i = edge === 'start' ? 0 : 1;
    const step = Math.max(MIN_TIME_SPAN, Math.min(DAY, (state.range[1] - state.range[0]) / 20)) * (event.shiftKey ? 7 : 1);
    const value = event.key === 'Home' ? fullRange[0] : event.key === 'End' ? fullRange[1] : state.range[i] + (event.key === 'ArrowLeft' ? -step : step);
    navigate(() => setEndpoint(edge, value));
  }));
  ['start', 'end'].forEach((edge) => {
    const input = $(`#range-${edge}`); input.min = '2026-04-19'; input.max = '2026-09-04';
    input.addEventListener('change', () => {
      const date = parseDay(input.value);
      if (!Number.isFinite(date) || !input.validity.valid) { notify('Choose a date within the incident’s date bounds.'); syncControls(); return; }
      const value = edge === 'end' ? date + DAY : date;
      if ((edge === 'start' && value >= state.range[1]) || (edge === 'end' && value <= state.range[0])) { notify('The start must be earlier than the end.'); syncControls(); return; }
      navigate(() => setEndpoint(edge, value));
    });
  });
  $('#zoom-in').addEventListener('click', () => zoom(.5, 'x'));
  $('#zoom-out').addEventListener('click', () => zoom(2, 'x'));
  $('#zoom-y-in').addEventListener('click', () => zoom(.6, 'y'));
  $('#zoom-y-out').addEventListener('click', () => zoom(1.67, 'y'));
  $('#zoom-fit').addEventListener('click', () => navigate(() => {}, { fit: true }));
  ['up', 'down'].forEach((direction) => $(`#move-${direction}`).addEventListener('click', () => navigate(() => {
    const delta = (state.vertical[1] - state.vertical[0]) * .45 * (direction === 'up' ? -1 : 1);
    state.vertical = boundedVertical(state.vertical[0] + delta, state.vertical[1] + delta);
  })));
    $$('[data-assessment]').forEach((button) => button.addEventListener('click', () => {
    if (state.assessment === button.dataset.assessment) return;
    navigate(() => { state.assessment = button.dataset.assessment; state.severity = 'all'; state.vertical = [0, 1]; });
  }));
  $$('[data-lifecycle]').forEach((button) => button.addEventListener('click', () => selectLifecycle(button.dataset.lifecycle)));
  $$('[data-status]').forEach((button) => button.addEventListener('click', () => navigate(() => { const status = button.dataset.status; if (state.statuses.has(status)) state.statuses.delete(status); else state.statuses.add(status); })));
  let queryTimer;
  $('#event-search').addEventListener('input', (event) => {
    clearTimeout(queryTimer); const value = event.target.value;
    queryTimer = setTimeout(() => navigate(() => { state.search = value; query = window.HaruspexQuery.compile(value); alignAssessmentToSearch(); }), 180);
  });
  $('#stage-filter').addEventListener('change', (event) => selectStage(event.target.value));
  $('#severity-filter').addEventListener('change', (event) => navigate(() => { state.severity = event.target.value; if (state.severity !== 'all') state.assessment = ['context', 'unresolved'].includes(state.severity) ? state.severity : 'impact'; state.vertical = [0, 1]; }));
  const legendModal=$('#legend-modal');legendModal.append($('#legend-panel'));
  legendModal.addEventListener('click',event=>{if(event.target===legendModal)closeLegend(true);});
  legendModal.addEventListener('close',()=>{$('#legend-panel').hidden=true;$('#legend-toggle').setAttribute('aria-expanded','false');});
  function closeLegend(restoreFocus = false) {
    const panel = $('#legend-panel');
    if (panel.hidden) return;
    panel.hidden=true;legendModal.close(); $('#legend-toggle').setAttribute('aria-expanded', 'false');
    if (restoreFocus) $('#legend-toggle').focus({ preventScroll: true });
  }
  $('#legend-toggle').addEventListener('click', () => {
    const show = $('#legend-panel').hidden;
    if (show) { closeStages(); $('#advanced-filters').hidden = true; $('#filter-toggle').setAttribute('aria-expanded', 'false'); $('#legend-panel').hidden = false;legendModal.showModal();$('#legend-close').focus(); }
    else closeLegend();
    $('#legend-toggle').setAttribute('aria-expanded', String(show));
  });
  $('#legend-close').addEventListener('click', () => closeLegend(true));
  function closeStages() { disappear($('#stage-panel')); $('#stage-toggle').setAttribute('aria-expanded', 'false'); }
  $('#stage-toggle').addEventListener('click', () => { closeLegend(); const show = $('#stage-panel').hidden; if (show) { $('#stage-panel').hidden = false; appear($('#stage-panel')); } else disappear($('#stage-panel')); $('#stage-toggle').setAttribute('aria-expanded', String(show)); if (show) { $('#advanced-filters').hidden = true; $('#filter-toggle').setAttribute('aria-expanded', 'false'); renderStages(); } });
  $('#stage-close').addEventListener('click', closeStages);
  $('#all-stages').addEventListener('click', () => selectStage('all'));
  $('#ontology-button').addEventListener('click', openOntology);
  $('#stage-structure').addEventListener('click', openOntology);
  $('#query-help').addEventListener('click', openQueryHelp);
  $('#framework-info').addEventListener('click', openFramework);
  function openCoverage(){openDialog('How much happened?',coverageContent());}
  $('#background-info').addEventListener('click',openCoverage);
  $('#coverage-info').addEventListener('click',openCoverage);
  function fitEggMessage(message){const span=message.firstElementChild;if(!span)return;message.classList.remove('wrapped');message.style.fontSize='14px';const room=()=>message.clientWidth-24;let size=Math.min(14,14*room()/Math.max(1,span.scrollWidth));for(let i=0;i<12;i++){message.style.fontSize=`${Math.floor(size*10)/10}px`;if(span.scrollWidth<=room()||size<=9)break;size-=.2;}if(size<9||span.scrollWidth>room()){message.style.fontSize='9px';message.classList.add('wrapped');}}
  $('#hidden-egg').addEventListener('click', () => {
    starsUnlocked = !starsUnlocked;
    $('#hidden-egg').setAttribute('aria-pressed', String(starsUnlocked));
    $('#hidden-egg span').textContent = starsUnlocked ? '🐣' : '🥚';
    $('#hidden-egg').classList.toggle('hatched', starsUnlocked);
    if (!starsUnlocked) { showStar(null);$('#egg-message').hidden=true;$('.field-readout').classList.remove('egg-revealed');return; }
    if(state.view==='cast')changeView('stream');
    const message=$('#egg-message');$('.field-readout').classList.add('egg-revealed');message.innerHTML=`<span><strong>You found the stars:</strong> over 70,000 messages and files beyond these ${events.length} events, encoded as 1.2 million entries in a cache of 20 million. But without fuller disclosure from OpenAI, Hugging Face and METR/Redwood, the rest stays dark.</span>`;message.hidden=false;fitEggMessage(message);if(!reducedMotion.matches)message.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:250});

  });
  $('#return-inquiry').addEventListener('click', () => openInvestigation(state.investigation.id));
  $('#clear-inquiry').addEventListener('click', () => navigate(() => { state.investigation=null; }, {fit:true}));
  $('#filter-toggle').addEventListener('click', () => { closeLegend(); closeStages(); const open = $('#advanced-filters').hidden; if (open) { $('#advanced-filters').hidden = false; appear($('#advanced-filters')); } else disappear($('#advanced-filters')); $('#filter-toggle').setAttribute('aria-expanded', String(open)); });
  function closeDetails() {
    $('#detail-panel').hidden=true;$('#event-focus').hidden=true;focusBackground(false);
    if (detailTrigger?.dataset.record) $(`[data-record="${detailTrigger.dataset.record}"]`)?.focus({ preventScroll: true });
    else if (detailTrigger?.isConnected) detailTrigger.focus({ preventScroll: true });
    drawTimeline();
    if (state.view === 'bowtie') renderBowtie();
  }
  let focusAnchor=null;
  const savedFocusInert=new Map();
  function focusBackground(active){
    for(const element of [document.querySelector('main'),document.querySelector('footer')]){
      if(active){if(!savedFocusInert.has(element))savedFocusInert.set(element,element.inert);element.inert=true;}
      else if(savedFocusInert.has(element)){element.inert=savedFocusInert.get(element);savedFocusInert.delete(element);}
    }
  }
  function positionBanner(animate=false){
    if(detailPanel.hidden||!focusAnchor)return;
    const event=eventMap.get(state.selected),w=innerWidth,h=innerHeight;
    const hoisted=!!focusAnchor.lineLength;
    const x=hoisted?focusAnchor.documentX-scrollX:Math.max(18,Math.min(w-18,focusAnchor.x)),y=hoisted?focusAnchor.documentY-scrollY:Math.max(70,Math.min(h-45,focusAnchor.y));
    const narrow=true,right=true;
    const flip=!hoisted&&y>=h-230;
    const width=hoisted?focusAnchor.lineLength:Math.min(340,w-32),top=hoisted?focusAnchor.documentY:flip?Math.max(70,y-12-480):y+12,height=hoisted?640:flip?y-12-top:Math.max(180,h-top-20),left=hoisted?focusAnchor.documentX:Math.max(16,Math.min(w-width-16,x));
    detailPanel.dataset.hoisted=String(hoisted);
    Object.assign(detailPanel.style,{position:hoisted?'absolute':'fixed',left:`${left}px`,top:`${top}px`,width:`${width}px`,height:`${height}px`,right:'auto',bottom:'auto',maxHeight:'none'});
    const layer=$('#event-focus');layer.hidden=false;layer.dataset.event=event.id;
    const canvas=$('#focus-origin'),ratio=Math.min(devicePixelRatio||1,2);canvas.width=w*ratio;canvas.height=h*ratio;
    const brush=canvas.getContext('2d');brush.setTransform(ratio,0,0,ratio,0,0);
    shape(brush,event,x,y,Math.max(6,markerRadius(event)*1.5));
    const color=eventStyle(event).fill;if(focusAnchor.lineLength){brush.strokeStyle=color;brush.globalAlpha=.5;brush.lineWidth=1;brush.beginPath();brush.moveTo(x,y);brush.lineTo(Math.min(w-18,x+focusAnchor.lineLength),y);brush.stroke();brush.globalAlpha=1;}brush.strokeStyle=color;brush.globalAlpha=.2;brush.lineWidth=1;brush.beginPath();brush.arc(x,y,17,0,Math.PI*2);brush.stroke();
    const endX=narrow?Math.max(left+24,Math.min(left+width-24,x)):right?left:left+width;
    const endY=narrow?(top>y?top:top+height):Math.max(top+35,Math.min(top+height-35,y));
    const path=$('#focus-thread path');path.setAttribute('d',hoisted?'':`M${x},${y} L${x},${endY}`);path.setAttribute('stroke',color);
    detailPanel.style.setProperty('--event-color',color);
    if(animate&&!reducedMotion.matches){
      const clipped=top>y?'inset(0 0 100% 0)':'inset(100% 0 0 0)';
      detailPanel.animate([{clipPath:clipped,opacity:.6},{clipPath:'inset(0 0 0 0)',opacity:1}],{duration:480,easing:'cubic-bezier(.18,.75,.2,1)'});
      path.animate([{strokeDasharray:'1 1400'},{strokeDasharray:'1400 0'}],{duration:450,easing:'ease-out'});
    }
  }
  function mixNumber(a,b,t){return a+(b-a)*t;}
  function attachBanner(animate){
    if(selectedSourceAnchor)focusAnchor=selectedSourceAnchor;
    else{const selected=(state.view==='bowtie'?bowPoints:points).find(point=>point.event.id===state.selected),rect=(state.view==='bowtie'?bowCanvas:timeline).getBoundingClientRect();focusAnchor=selected?{x:rect.left+selected.x,y:rect.top+selected.y}:{x:innerWidth/2,y:100};}
    focusBackground(true);positionBanner(animate);$('#detail-close').focus({preventScroll:true});
  }
  document.body.append($('#focus-origin'));
  let veilPressed=false;
  $('#event-focus .focus-veil').addEventListener('pointerdown',()=>{veilPressed=true;});
  $('#event-focus .focus-veil').addEventListener('click',()=>{if(veilPressed)closeDetails();veilPressed=false;});
  window.addEventListener('resize',()=>{if(!$('#egg-message').hidden)fitEggMessage($('#egg-message'));if(focusAnchor?.lineLength){const hoist=document.querySelector(`.milestone[data-event="${state.selected}"]`);if(hoist){const r=hoist.getBoundingClientRect();focusAnchor.documentX=r.left+scrollX;focusAnchor.documentY=r.top+scrollY;focusAnchor.lineLength=r.width;}}positionBanner();});
  document.addEventListener('keydown',event=>{
    if(event.key!=='Tab'||detailPanel.hidden||$('#info-dialog').open)return;
    const controls=[...detailPanel.querySelectorAll('button:not(:disabled),a[href],summary,[tabindex="0"]')].filter(el=>el.getClientRects().length);
    const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  });
  $('#detail-close').addEventListener('click', closeDetails);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !$('#info-dialog').open) { closeLegend(true); closeStages(); closeDetails(); $('#advanced-filters').hidden = true; $('#filter-toggle').setAttribute('aria-expanded', 'false'); } });
  $('#interval-toggle').addEventListener('change', (event) => { state.intervals = event.target.checked; drawTimeline(); });
  $('#reset-button').addEventListener('click', reset); $('#empty-reset').addEventListener('click', reset);
  ['stream','bowtie','cast'].forEach(view => $(`#${view}-tab`).addEventListener('click', () => { changeView(view); if (view === 'cast') { renderCast(); castUI.show('inquiry'); } scrollToField({behavior:'instant'}); }));
  $$('.view-tab').forEach((button) => button.addEventListener('keydown', (event) => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const views=['stream','bowtie','cast']; const view=event.key==='Home'?views[0]:event.key==='End'?views[2]:views[(views.indexOf(state.view)+(event.key==='ArrowLeft'?2:1))%3]; changeView(view); $(`#${view}-tab`).focus({preventScroll:true}); scrollToField({behavior:'instant'}); } }));
  $('#previous-event').addEventListener('click', () => { const i = visible.findIndex((event) => event.id === state.selected); if (visible.length) selectEvent(visible[Math.max(0, i - 1)].id); });
  $('#next-event').addEventListener('click', () => { const i = visible.findIndex((event) => event.id === state.selected); if (visible.length) selectEvent(visible[Math.min(visible.length - 1, i + 1)].id); });
  $('#method-button').addEventListener('click', openMethod);
  $('#enter-explorer').addEventListener('click', (event) => { event.preventDefault(); enterField(); });
  $('#intro-cast').addEventListener('click', () => { changeView('cast'); renderCast(); castUI.show('inquiry'); scrollToField({behavior:reducedMotion.matches?'auto':'smooth'}); });
  $('#footer-method').addEventListener('click', openMethod);
  $('#actual-interventions').addEventListener('click', () => {
    navigate(() => { state.interventions = !state.interventions; state.lifecycle = 'all'; state.temporal = 'all'; }, { fit: true });
    if (state.interventions && visible.length) selectEvent(visible[0].id);
  });
  $('#possible-interventions').addEventListener('click', () => { changeView('cast'); renderCast(); castUI.show('changes'); });
  $('#active-filter').addEventListener('click', () => navigate(() => { state.stage = 'all'; state.temporal = 'all'; }));
  $('#unplaced-button').addEventListener('click', () => { state.temporal = 'open'; state.period = 'all'; state.range = [...periods.all]; state.limit = 24; syncControls(); refresh(); $('#event-list').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
  $('#sources-button').addEventListener('click', () => openDialog('Sources', `<p>Three supplied starter documents and additional primary sources. Select a title to open the original publication.</p>${data.sources.map(sourceCard).join('')}<h3>Additional investigation sources</h3>${researchData.sources.map(source => `<div class="dialog-source"><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title || source.id)}</a><p>${escapeHtml((source.kind?.replaceAll('_',' ') || '') + ' · ' + (source.relation_to_existing_evidence || ''))}</p></div>`).join('')}<h3>Unresolved source comparisons</h3>${data.conflicts.map((conflict) => `<div class="dialog-source"><span class="source-id">${conflict.conflict_id}</span><strong>${escapeHtml(conflict.subject)}</strong><p>${escapeHtml(conflict.detail)}</p></div>`).join('')}`));
  $('#dialog-close').addEventListener('click', () => $('#info-dialog').close());
  $('#info-dialog').addEventListener('click', (event) => { if (event.target === $('#info-dialog')) { const rect = event.target.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close(); } });
  $('#info-dialog').addEventListener('close', () => { if (dialogTrigger?.isConnected) dialogTrigger.focus({preventScroll:true}); });
  $('#export-button').addEventListener('click', () => {
    const exportData = { ...data, severity_assessments: severityData, visual_encodings: visualData, incident_ontology: ontology, temporal_assessments: temporalData, cast_analysis: castData, research_expansion: researchData, opening_quotations: quotationData };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'haruspex-atlas-data-v10.json'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000); notify('Dataset download requested · events, reviews, dates and ontology.');
  });
  $('#load-more').addEventListener('click', () => { state.limit += 24; renderList(); });
  $('#list-toggle').addEventListener('click', () => { const collapsed = !$('#record-list-wrap').hidden; $('#record-list-wrap').hidden = collapsed; $('#list-toggle').setAttribute('aria-expanded', String(!collapsed)); $('#list-toggle').textContent = collapsed ? 'Expand +' : 'Collapse −'; });
  $('.brand').addEventListener('click', (event) => { event.preventDefault(); changeView('stream'); reset(); closeDetails(); $('#advanced-filters').hidden = true; $('#filter-toggle').setAttribute('aria-expanded', 'false'); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
  document.addEventListener('keydown', (event) => { if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !$('#info-dialog').open) { event.preventDefault(); $('#event-search').focus(); } });
  ontology.stages.forEach((stage) => { const option = document.createElement('option'); option.value = stage.id; option.textContent = stage.label; $('#stage-filter').append(option); });
  // Turning points as the sources mark them, each card naming who marks it.
  const milestones = [
    ['E0002', '12 MAY', 'The first board', 'Simon Institute · Cotra · OpenAI'],
    ['E0453', '6 JUL', 'The board wiped', 'OpenAI at Black Hat · METR'],
    ['E0462', '8 JUL', 'The board re-founded', 'METR · Simon Institute'],
    ['E0065', '11 JUL', 'The turn on Hugging Face', 'METR · Hugging Face'],
    ['E0396', '13 JUL', 'Containment', 'Hugging Face · METR'],
    ['E0112', '19 JUL', 'The turn on OpenAI itself', 'OpenAI · Simon Institute'],
    ['E0807', '21 JUL', 'Public attribution', 'OpenAI · Hugging Face'],
    ['E0734', '26 AUG', 'The independent investigation', 'METR · Redwood'],
  ];
  $('#milestones').innerHTML = milestones.map(([id, date, label, sources]) => `<button class="milestone ${state.selected === id ? 'active' : ''}" data-event="${id}">${eventMark(eventMap.get(id))}<small>${date} 2026</small><span>${label}</span><em>${sources}</em></button>`).join('');
  $$('[data-event]').forEach((button) => button.addEventListener('click', () => { if (state.view !== 'stream') changeView('stream'); selectEvent(button.dataset.event, { reveal: true, trigger: button }); }));
  // Small inspection surface for local verification; no private data or network.
  window.haruspex = { getState: () => ({ ...state, statuses: [...state.statuses], visibleCount: visible.length, plottedCount: points.length }), getPoints: () => points.map(({ event, x, y }) => ({ id: event.id, x, y, timeKind: event._time.kind, severity: severityMap.get(event.id)?.score })), getTimeExtent: (id) => ({ ...eventMap.get(id)?._time }), getCounts: () => ({ all: events.length, ...Object.fromEntries(groups.map((group) => [group.key, events.filter((event) => group.roles.includes(event.bow_tie_role)).length])) }) };
  let lastFieldSize = '';
  const observer = new ResizeObserver(() => {
    const rect = $('.visual-column').getBoundingClientRect();
    const size = `${rect.width},${rect.height}`;
    if (size === lastFieldSize) return;
    lastFieldSize = size;
    const from = motionFrame !== null ? currentPositions() : null;
    stopMotion(); drawCosmos(); drawTimeline();
    if (state.view === 'bowtie') renderBowtie();
    syncNavigationIndicators();
    if (from) animateLayout(from, { camera: true });
    scrollGateway?.invalidate();
  }); observer.observe($('.visual-column')); observer.observe($('.masthead'));
  let scrollFrame = null;
  const syncScroll = () => {
    scrollFrame = null;
    const rect = $('.observatory').getBoundingClientRect();
    const distance = Math.max(1, rect.height - $('#scene').getBoundingClientRect().height);
    const progress = Math.max(0, Math.min(1, -rect.top / distance));
    $('#scene').style.setProperty('--scroll-progress', String(progress));
    scrollGateway?.sync();
    if(!detailPanel.hidden&&focusAnchor?.lineLength)positionBanner();

  };
  window.addEventListener('scroll', () => { if (scrollFrame === null) scrollFrame = requestAnimationFrame(syncScroll); }, { passive: true });
  $$('[data-status]').forEach((button) => { const count = events.filter((event) => event._status === button.dataset.status).length; button.querySelector('b').textContent = count; });
  window.HaruspexArrival?.init({events, palette:visualData.groups.map(group => group.fill), colorOf:event => eventStyle(event).fill});
  updateSeverityOptions(); renderWorkstreamLegend(); syncControls(); drawCosmos(); refresh(); syncScroll(); $('#bowtie-tab').tabIndex = -1; $('#cast-tab').tabIndex = -1; $('#scene').dataset.view = 'stream';
  scrollGateway=window.HaruspexArrival?.mountGateway({scene:$('#scene'),getPoints:currentPositions,paintPoint:(ctx,point,x,y,alpha)=>shape(ctx,point.event,x,y,point.radius,alpha),isReading:()=>state.view==='cast'});
})();
