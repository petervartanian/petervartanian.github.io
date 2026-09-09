/* A source-linked systems-question view. It adds no causal claims to event records. */
((root) => {
  'use strict';
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lines = (text, length = 29) => {
    const result = []; let current = '';
    for (const word of String(text).split(/\s+/)) {
      if ((current + ' ' + word).trim().length > length && current) { result.push(current); current = word; }
      else current = (current + ' ' + word).trim();
    }
    if (current) result.push(current);
    return result;
  };
  function mount({ element, data, research, quotations, events, onEvent, onTrace, onNavigate, onDialog }) {
    let active = 'inquiry';
    let selectedFinding = 'F06';
    let selectedEvent = null;
    const eventIndex = new Map(events.map(event => [event.id, event]));
    const evidence = research.evidence_items || [];
    const updateIndex = new Map((research.question_updates || []).map(item => [item.question_id, item]));
    const sourceIndex = new Map((research.sources || []).map(item => [item.id || item.source_id, item]));
    let questionFilter = 'all';
    const sections = [['inquiry','Follow a finding'],['evidence','Collected evidence'],['questions','What to collect next'],['structure','Whole system'],['changes','Changes'],['scope','Method']];
    const entities = new Map(['controllers','relationships','findings','improvements','questions','losses','hazards','constraints','systemic_factors'].flatMap((key) => (data[key] || []).map((item) => [item.id, {...item, collection:key}])));
    const prose = (value) => Array.isArray(value) ? value.map((item) => typeof item === 'string' ? item : item.summary || item.description || item.title || '').filter(Boolean).join(' ') : typeof value === 'object' && value ? value.summary || value.description || value.statement || value.artifact || value.title || Object.values(value).filter(v=>typeof v==='string').join(' · ') : value || '';
    const paragraphs = (value) => Array.isArray(value) ? '<ul>' + value.map((item) => `<li>${esc(prose(item))}</li>`).join('') + '</ul>' : `<p>${esc(prose(value))}</p>`;
    const eventLinks = (ids, limit = 6) => (ids || []).length ? `<div class="cast-event-links">${ids.slice(0,limit).map(id=>`<button data-cast-event="${esc(id)}">${esc(id)} ↗</button>`).join('')}${ids.length > limit ? `<span>+${ids.length-limit} in the analysis</span>` : ''}</div>` : '';
    const statusLabel = (item) => String(item.causal_status || item.authority_status || item.status || item.evidence_status || 'Provisional analysis').replaceAll('_',' ');
    const briefStatus = (item) => item.kind === 'analyst_proposal' ? 'Proposed improvement' : item.kind === 'reported_actual' ? 'Reported change' : item.question_id ? 'Open evidence question' : item.controller_ids ? 'Analytical finding' : item.from ? String(item.status).replaceAll('_',' ') : 'Provisional analysis';
    function wireEvents(container) {
      container.querySelectorAll('[data-cast-event]').forEach(button => button.addEventListener('click',()=>onEvent(button.dataset.castEvent, selectedFinding)));
      container.querySelectorAll('[data-cast-item]').forEach(button => button.addEventListener('click',()=>openItem(button.dataset.castItem)));
    }
    function openItem(id) {
      const item = entities.get(id); if (!item) return;
      const additions = evidence.filter(entry => entry.finding_ids?.includes(id) || entry.question_ids?.includes(id));
      const update = updateIndex.get(id);
      const fields = [
        ['Reported observation',item.observation],['Interpretation',item.interpretation],['Context',item.context],
        ['Responsibilities',item.responsibilities],['Known feedback',item.known_feedback],['Relationship',item.details],
        ['Competing explanations',item.alternative_explanations],['What remains unknown',item.unknowns],
        [item.kind === 'reported_actual' ? 'Reported responsible role' : 'Suggested responsible role',item.owner_role],['Verification',item.verification],['Limits',item.limitations],
        ['Evidence to request',item.requested_evidence || item.request || item.evidence_request || item.evidence_needed],
        ['Where to seek it',item.ask],['Why it matters',item.value],
      ].filter(([,value])=>value && (!Array.isArray(value) || value.length));
      const content = `<p class="cast-dialog-status">${esc(statusLabel(item))}</p><p>${esc(item.summary || item.question || '')}</p>${fields.map(([label,value])=>`<h3>${label}</h3>${paragraphs(value)}`).join('')}
        ${update ? `<h3>What the new search established</h3><p>${esc(update.summary)}</p>${collectionSteps(update, item)}` : ''}
        ${additions.length ? `<h3>Additional public evidence</h3>${evidenceCards(additions)}` : ''}
        ${item.collection === 'findings' ? `<button class="trace-button" data-follow-finding="${esc(id)}">Follow this finding in context →</button>` : ''}
        ${item.event_ids?.length ? `<h3>Related records</h3>${eventLinks(item.event_ids,Infinity)}` : ''}
        ${item.question_ids?.filter(q=>q!==id).length ? `<h3>Open questions</h3><div class="cast-event-links">${item.question_ids.filter(q=>q!==id).map(q=>`<button data-cast-item="${esc(q)}">${esc(q)} · ${esc(entities.get(q)?.title || 'Question')}</button>`).join('')}</div>` : ''}
        ${(item.source_evidence || []).length ? `<h3>Evidence and its limits</h3>${item.source_evidence.map(source=>`<div class="dialog-source"><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.source_id || 'Source')} · ${esc(source.locator || 'Primary source')} ↗</a><p>${esc(source.supports || '')}</p></div>`).join('')}` : '<p class="cast-note">This is an analysis question or proposed relationship; it is not an additional historical event.</p>'}`;
      onDialog(item.title || item.label || id,content);
      wireEvents(document.getElementById('dialog-content'));
      wireInquiry(document.getElementById('dialog-content'));
    }
    function graph() {
      const nodes = data.controllers || [];
      const columns = [[],[],[]];
      for (const node of nodes) {
        const organization = String(node.organization || '').toLowerCase();
        const column = organization.includes('hugging') ? 2 : organization.includes('openai') ? 0 : 1;
        columns[column].push(node);
      }
      const rows = Math.max(...columns.map(column=>column.length),1);
      const height = Math.max(630, rows*115+90);
      const locations = new Map();
      columns.forEach((column,c)=>column.forEach((node,r)=>locations.set(node.id,{x:38+c*357,y:78+r*(height-140)/Math.max(1,column.length),w:290,h:76,node})));
      const paths = (data.relationships || []).map((edge,index)=>{
        const from = locations.get(edge.from), to = locations.get(edge.to); if (!from || !to) return '';
        const sameColumn = from.x===to.x;
        const forward = to.x > from.x;
        const x1 = sameColumn ? from.x+from.w : forward ? from.x+from.w : from.x;
        const x2 = sameColumn ? to.x+to.w : forward ? to.x : to.x+to.w;
        const y1=from.y+from.h*.5+(index%3-1)*7, y2=to.y+to.h*.5+(index%3-1)*7;
        const bend = sameColumn ? x1+22+(index%3)*8 : (x1+x2)/2;
        const d=`M${x1},${y1} C${bend},${y1} ${bend},${y2} ${x2},${y2}`;
        return `<g class="cast-edge ${esc(edge.type)} ${esc(edge.status)}"><path d="${d}" marker-end="url(#cast-arrow)"/><path class="cast-edge-hit" data-cast-item="${esc(edge.id)}" d="${d}" tabindex="0" role="button" aria-label="${esc(`${edge.label || edge.title}. ${statusLabel(edge)}`)}"><title>${esc(edge.label || edge.title)} · ${esc(statusLabel(edge))}</title></path></g>`;
      }).join('');
      const boxes=[...locations.values()].map(({x,y,w,h,node})=>`<g class="cast-node" data-controller="${esc(node.id)}" data-cast-item="${esc(node.id)}" role="button" tabindex="0" aria-label="${esc(node.title)}" transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="8"/>${lines(node.title,30).slice(0,3).map((line,i)=>`<text x="17" y="${25+i*17}">${esc(line)}</text>`).join('')}<text class="cast-node-arrow" x="${w-23}" y="${h-14}">↗</text></g>`).join('');
      return `<p class="cast-note">Follow a control or feedback path to inspect its evidence. Dashed paths are proposed, uncertain, or reported missing. Arrows describe control and information relationships, not a proven chain of causes.</p><div class="cast-graph-wrap"><svg class="cast-graph" viewBox="0 0 1080 ${height}" role="group" aria-label="Provisional control structure"><defs><marker id="cast-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10" fill="#93aeb9"/></marker></defs>${['OpenAI','Shared & external boundaries','Hugging Face'].map((text,i)=>`<text class="cast-column-title" x="${38+i*357}" y="31">${esc(text)}</text>`).join('')}${paths}${boxes}</svg></div><div class="cast-map-key"><span>Solid · reported control</span><span>Fine line · feedback</span><span>Dashed · omission, proposal or unknown</span></div><details class="cast-path-register"><summary>Read all ${data.relationships?.length || 0} paths</summary>${cards(data.relationships || [])}</details>`;
    }
    function cards(items) {
      return `<div class="cast-card-grid">${items.map(item=>`<article class="cast-card"><h3><button data-cast-item="${esc(item.id)}">${esc(item.title || item.label || item.question)} <span>↗</span></button></h3><p>${esc(item.summary || item.observation || '')}</p><div class="cast-card-meta">${esc(item.id)} · ${esc(briefStatus(item))}</div>${eventLinks(item.event_ids)}</article>`).join('')}</div>`;
    }
    function collectionSteps(update, question) {
      const steps = update?.collection_plan || [];
      return `<div class="collection-steps">${steps.length ? steps.map(step => typeof step === 'string' ? `<p>${esc(step)}</p>` : `<div><h4>${esc(step.artifact || step.title || 'Evidence to obtain')}</h4><p>${esc(step.holder || step.source || '')}</p><p>${esc(step.method || step.action || '')}</p>${step.decision_test || step.expected_update ? `<p class="decision-test">Would test: ${esc(step.decision_test || step.expected_update)}</p>` : ''}</div>`).join('') : `<p>${esc(question.requested_evidence)}</p><p>${esc(question.ask)}</p>`}</div>`;
    }
    function evidenceCards(items, compact = false) {
      return `<div class="evidence-ledger ${compact ? 'compact' : ''}">${items.map(item => {
        const source = sourceIndex.get(item.source_id);
        const qualification = {public_assurance_lead:'Assurance lead · incident connection unverified',published_question:'Published commentary · investigation questions',methodological_evidence:'Investigation method · not incident evidence',public_gap_rechecked:'Evidence gap rechecked'}[item.evidence_status] || (item.novelty.startsWith('rechecked') || item.novelty.startsWith('existing') ? 'Existing account · rechecked and connected' : 'Additional public evidence');
        return `<article class="evidence-entry" data-research-evidence="${esc(item.id)}"><a href="${esc(item.url || source?.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(item.title)}</span><span aria-hidden="true">↗</span></a><p class="evidence-qualification">${esc(qualification)}</p><p>${esc(item.summary)}</p>${item.implication ? `<p class="evidence-implication">${esc(prose(item.implication))}</p>` : ''}<details><summary>Source, limits & connections</summary><p>${esc(item.source_id)} · ${esc(item.locator || source?.title || '')}</p><p>${esc(source?.relation_to_existing_evidence || '')}</p><p>${esc(prose(item.novelty))}</p>${paragraphs(item.limitations)}<div class="inquiry-links">${(item.finding_ids || []).map(id => `<button data-follow-finding="${esc(id)}">${esc(entities.get(id)?.title || id)} →</button>`).join('')}${(item.question_ids || []).map(id => `<button data-cast-item="${esc(id)}">${esc(id)} · ${esc(entities.get(id)?.title || '')} ↗</button>`).join('')}</div></details></article>`;
      }).join('')}</div>`;
    }
    function questionCard(q) {
      const update = updateIndex.get(q.id);
      const additions = evidence.filter(item => item.question_ids?.includes(q.id));
      return `<article class="collection-question" id="question-${esc(q.id)}"><div class="question-title"><h3><button data-cast-item="${esc(q.id)}">${esc(q.question)} ↗</button></h3><span>${esc(q.id)}</span></div><p class="question-update">${esc(update?.summary || 'The necessary evidence has not been located in public sources.')}</p><details><summary>Evidence to collect & how it would change the analysis</summary>${update?.remaining_evidence ? `<p>${esc(prose(update.remaining_evidence))}</p>` : ''}${collectionSteps(update,q)}${additions.length ? `<h4>Public evidence already collected</h4>${evidenceCards(additions,true)}` : ''}<div class="inquiry-links">${(q.related_finding_ids || []).map(id => `<button data-follow-finding="${esc(id)}">${esc(entities.get(id)?.title || id)} →</button>`).join('')}</div><p class="cast-note">No private evidence request has been sent.</p></details></article>`;
    }
    function questions() {
      const items=(data.questions || []).filter(q=>questionFilter==='all'||q.priority===questionFilter);
      return `<div class="collection-intro"><h3>The next piece of evidence should change something.</h3><p>Every question retains its original identifier. The new public-source findings appear alongside the remaining artifact, its likely holder, and the explanation it could support or rule out.</p></div><div class="cast-question-filter" role="group" aria-label="Question priority">${[['all','All questions'],['P0','Central to the account'],['P1','Further detail']].map(([key,label])=>`<button data-question-filter="${key}" aria-pressed="${questionFilter===key}">${label}</button>`).join('')}</div><div class="collection-register">${items.map(questionCard).join('')}</div>`;
    }
    function researchView() {
      const quotation = quotations.quotations.find(item => item.id === 'leveson-information');
      return `<blockquote class="research-quote"><p>“${esc(quotation.quote)}”</p><cite><a href="${esc(quotation.url)}" target="_blank" rel="noopener noreferrer">${esc(quotation.author)} · CAST Handbook ↗</a></cite></blockquote><p class="cast-note">Collected and reviewed on ${esc(research.checked_on)}. New publications, downloadable artifacts and rechecks are distinguished in each source record. Public accounts and derived chart data cannot settle every question about internal decisions.</p>${evidenceCards(evidence)}<details class="research-audit"><summary>Search trail & evidence inventory</summary>${(research.sources || []).map(source => `<div class="dialog-source"><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.id || source.source_id)} · ${esc(source.title || source.url)} ↗</a>${source.local_artifact ? `<a class="artifact-download" href="${esc(source.local_artifact)}" download>Collected data ↓</a>` : ''}<p>${esc(source.kind?.replaceAll('_',' ') || '')} · ${esc(source.relation_to_existing_evidence || '')}</p>${source.sha256 ? `<p class="artifact-hash">SHA-256 ${esc(source.sha256)}</p>` : ''}</div>`).join('')}<pre>${esc(JSON.stringify(research.searches || [],null,2))}</pre><p>${esc(prose(research.overall_limits))}</p></details>`;
    }
    function inquiry() {
      const finding = entities.get(selectedFinding) || data.findings[0];
      const additions = evidence.filter(item => item.finding_ids?.includes(finding.id));
      const nodes = new Set(finding.controller_ids || []);
      const paths = data.relationships.filter(item => nodes.has(item.from) && nodes.has(item.to) && (item.event_ids?.some(id => finding.event_ids.includes(id)) || (!item.event_ids?.length && item.question_ids?.some(id => finding.question_ids.includes(id)))));
      const relevantQuestions = finding.question_ids.map(id => entities.get(id)).filter(Boolean);
      const records = finding.event_ids.map(id => eventIndex.get(id)).filter(Boolean);
      return `<div class="inquiry-layout"><nav class="finding-nav" aria-label="Choose an investigation finding">${data.findings.map(item => `<button data-follow-finding="${esc(item.id)}" aria-pressed="${item.id===finding.id}"><span>${esc(item.title)}</span><span aria-hidden="true">↗</span></button>`).join('')}</nav><article class="finding-story"><header class="finding-title"><h3>${esc(finding.title)}</h3><p>${esc(finding.summary)}</p></header>${selectedEvent ? `<button class="origin-event" data-cast-event="${esc(selectedEvent)}">From ${esc(selectedEvent)} · ${esc(eventIndex.get(selectedEvent)?.title || '')} ↗</button>` : ''}<div class="finding-control"><h4>Who could act, and what reached them?</h4>${paths.length ? paths.map(path => `<button class="control-thread ${esc(path.status)}" data-cast-item="${esc(path.id)}"><span>${esc(entities.get(path.from)?.title)}</span><span class="control-thread-link"><i aria-hidden="true">⟶</i><b>${esc(path.label || path.title)}</b><small>${esc(path.status.replaceAll('_',' '))} · ${esc(path.type.replaceAll('_',' '))}</small></span><span>${esc(entities.get(path.to)?.title)}</span></button>`).join('') : `<div class="controller-list">${[...nodes].map(id => `<button data-cast-item="${esc(id)}">${esc(entities.get(id)?.title)} ↗</button>`).join('')}</div>`}<div class="constraint-list">${(finding.constraint_ids || []).map(id => `<button data-cast-item="${esc(id)}">${esc(entities.get(id)?.title || id)} ↗</button>`).join('')}</div><p class="cast-note">Control and feedback relationships. These arrows do not establish causation.</p></div><div class="finding-reading"><section><h4>What is reported</h4><p>${esc(finding.observation)}</p><div class="evidence-citations">${finding.source_evidence.map(item => `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.source_id)} · ${esc(item.locator)} ↗</a>`).join('')}</div></section><section><h4>What it may mean</h4><p>${esc(finding.interpretation)}</p><details><summary>Competing explanations & limits</summary>${paragraphs(finding.alternative_explanations)}<p>${esc(finding.context)}</p><p>${esc(finding.causal_status)}</p></details></section></div><section class="finding-records"><div class="finding-section-heading"><h4>Follow the underlying events</h4><div><button class="trace-button" data-trace-view="stream">In the swarm ↗</button><button class="trace-button" data-trace-view="bowtie">In the bow tie ↗</button></div></div><div class="evidence-sequence">${records.map(event => `<button data-cast-event="${esc(event.id)}" class="${selectedEvent===event.id?'selected':''}"><span>${esc(event.id)}</span><span>${esc(event.title)}</span><i aria-hidden="true">↗</i></button>`).join('')}</div></section><section class="finding-new"><h4>What the additional search changes</h4>${additions.length ? evidenceCards(additions,true) : '<p>No additional public evidence was located that resolves this finding. The missing records below remain necessary.</p>'}</section><section class="finding-next"><h4>What would develop this finding further?</h4>${relevantQuestions.map(questionCard).join('')}</section><div class="finding-improvements"><h4>Changes to examine</h4>${cards(data.improvements.filter(item => item.addresses_finding_ids?.includes(finding.id)))}</div></article></div>`;
    }
    function wireInquiry(container) {
      container.querySelectorAll('[data-follow-finding]').forEach(button => button.addEventListener('click', () => {
        const focusId = button.dataset.followFinding;
        if (document.getElementById('info-dialog').open) document.getElementById('info-dialog').close();
        onNavigate(); selectedFinding = focusId; if (!entities.get(focusId)?.event_ids?.includes(selectedEvent)) selectedEvent = null; active = 'inquiry'; render(); element.scrollTop = 0;
        element.querySelector(`[data-follow-finding="${focusId}"]`)?.focus({preventScroll:true});
      }));
      container.querySelectorAll('[data-trace-view]').forEach(button => button.addEventListener('click', () => onTrace(entities.get(selectedFinding), button.dataset.traceView)));
    }
    function scope() {
      return `<div class="cast-scope-intro"><h3>An analysis that changes with the evidence</h3><p>${esc(research.collection_method.method.summary)}</p><p>${esc(data.method.adaptation)} <a href="${esc(data.method.url)}" target="_blank" rel="noopener noreferrer">Read the CAST Handbook ↗</a></p><p>Public-source collection is recorded in the evidence ledger; unfilled requests identify the artifact, holder and explanation to test. ${esc(data.scope.evidence_limit)} ${esc(data.scope.temporal_limit)}</p><p>The analysis links ${data.coverage.linked_event_count} records across ${data.coverage.linked_source_episode_count} source episodes. ${esc(data.coverage.scope)} ${esc(data.method.claim)}</p></div><div class="cast-scope-grid">${[['Losses to examine',data.losses],['Hazardous conditions',data.hazards],['Required protections',data.constraints],['Cross-system factors',data.systemic_factors]].map(([label,items])=>`<section><h3>${label}</h3>${cards(items || [])}</section>`).join('')}</div>`;
    }
    function changes() {
      return `<p class="cast-note">These are grouped changes to controls, linked to the underlying records. Implementation and effectiveness are different questions; each change includes its verification needs.</p><h3 class="cast-section-title">Reported changes</h3>${cards(data.improvements.filter(item=>item.kind==='reported_actual'))}<h3 class="cast-section-title">Proposed improvements</h3><p class="cast-note">Analyst proposals for investigation and testing. These are not historical actions or proven optimal interventions.</p>${cards(data.improvements.filter(item=>item.kind==='analyst_proposal'))}`;
    }
    function render() {
      element.innerHTML=`<div class="cast-shell"><div class="cast-heading"><h2>Follow the evidence.</h2><p>CAST asks how control, feedback and changing conditions shaped the incident. Follow a finding from its reported events to the evidence still needed.</p></div><nav class="cast-nav" aria-label="CAST analysis sections">${sections.map(([key,label])=>`<button data-cast-section="${key}" aria-pressed="${active===key}">${label}</button>`).join('')}</nav><div class="cast-content">${active==='inquiry'?inquiry():active==='evidence'?researchView():active==='structure'?graph():active==='changes'?changes():active==='questions'?questions():scope()}</div></div>`;
      wireEvents(element);
      wireInquiry(element);
      element.querySelectorAll('[data-cast-section]').forEach(button=>button.addEventListener('click',()=>{active=button.dataset.castSection;render(); element.scrollTop=0; onNavigate(); element.querySelector(`[data-cast-section="${active}"]`).focus({preventScroll:true});}));
      element.querySelectorAll('[data-question-filter]').forEach(button=>button.addEventListener('click',()=>{questionFilter=button.dataset.questionFilter;render();element.querySelector(`[data-question-filter="${questionFilter}"]`).focus({preventScroll:true});}));
      element.querySelectorAll('svg [data-cast-item]').forEach(button=>button.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();openItem(button.dataset.castItem);}}));
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) element.querySelector('.cast-content').animate([{opacity:.2,transform:'translateY(9px)'},{opacity:1,transform:'none'}],{duration:360,easing:'cubic-bezier(.2,.75,.15,1)'});
    }
    render();
    return { render, openItem, focusEvidence(id) { active='evidence'; render(); const entry=element.querySelector(`[data-research-evidence="${id}"]`); if (entry) { entry.tabIndex=-1; onNavigate(); element.scrollTop += entry.getBoundingClientRect().top - element.getBoundingClientRect().top - 75; entry.focus({preventScroll:true}); } }, focusFinding(id, eventId = null) { if (entities.has(id)) { selectedFinding=id; selectedEvent=eventId; active='inquiry'; render(); element.scrollTop=0; } }, show(section) { if (sections.some(([key])=>key===section)) { active=section;render();element.scrollTop=0; } } };
  }
  root.HaruspexCast = { mount };
})(window);
