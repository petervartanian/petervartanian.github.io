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
  function mount({ element, data, onEvent, onDialog }) {
    let active = 'structure';
    let questionFilter = 'all';
    const sections = [['structure','Control map'],['findings','Findings'],['changes','Changes'],['questions','Questions'],['scope','Scope']];
    const entities = new Map(['controllers','relationships','findings','improvements','questions','losses','hazards','constraints','systemic_factors'].flatMap((key) => (data[key] || []).map((item) => [item.id, {...item, collection:key}])));
    const prose = (value) => Array.isArray(value) ? value.map((item) => typeof item === 'string' ? item : item.summary || item.description || item.title || '').filter(Boolean).join(' ') : typeof value === 'object' && value ? value.summary || value.description || value.statement || '' : value || '';
    const paragraphs = (value) => Array.isArray(value) ? '<ul>' + value.map((item) => `<li>${esc(prose(item))}</li>`).join('') + '</ul>' : `<p>${esc(prose(value))}</p>`;
    const eventLinks = (ids, limit = 6) => (ids || []).length ? `<div class="cast-event-links">${ids.slice(0,limit).map(id=>`<button data-cast-event="${esc(id)}">${esc(id)} ↗</button>`).join('')}${ids.length > limit ? `<span>+${ids.length-limit} in the analysis</span>` : ''}</div>` : '';
    const statusLabel = (item) => String(item.causal_status || item.authority_status || item.status || item.evidence_status || 'Provisional analysis').replaceAll('_',' ');
    const briefStatus = (item) => item.kind === 'analyst_proposal' ? 'Proposed improvement' : item.kind === 'reported_actual' ? 'Reported change' : item.question_id ? 'Open evidence question' : item.controller_ids ? 'Analytical finding' : item.from ? String(item.status).replaceAll('_',' ') : 'Provisional analysis';
    function wireEvents(container) {
      container.querySelectorAll('[data-cast-event]').forEach(button => button.addEventListener('click',()=>onEvent(button.dataset.castEvent)));
      container.querySelectorAll('[data-cast-item]').forEach(button => button.addEventListener('click',()=>openItem(button.dataset.castItem)));
    }
    function openItem(id) {
      const item = entities.get(id); if (!item) return;
      const fields = [
        ['Reported observation',item.observation],['Interpretation',item.interpretation],['Context',item.context],
        ['Responsibilities',item.responsibilities],['Known feedback',item.known_feedback],['Relationship',item.details],
        ['Competing explanations',item.alternative_explanations],['What remains unknown',item.unknowns],
        [item.kind === 'reported_actual' ? 'Reported responsible role' : 'Suggested responsible role',item.owner_role],['Verification',item.verification],['Limits',item.limitations],
        ['Evidence to request',item.requested_evidence || item.request || item.evidence_request || item.evidence_needed],
        ['Where to seek it',item.ask],['Why it matters',item.value],
      ].filter(([,value])=>value && (!Array.isArray(value) || value.length));
      const content = `<p class="cast-dialog-status">${esc(statusLabel(item))}</p><p>${esc(item.summary || item.question || '')}</p>${fields.map(([label,value])=>`<h3>${label}</h3>${paragraphs(value)}`).join('')}
        ${item.event_ids?.length ? `<h3>Related records</h3>${eventLinks(item.event_ids,Infinity)}` : ''}
        ${item.question_ids?.filter(q=>q!==id).length ? `<h3>Open questions</h3><div class="cast-event-links">${item.question_ids.filter(q=>q!==id).map(q=>`<button data-cast-item="${esc(q)}">${esc(q)} · ${esc(entities.get(q)?.title || 'Question')}</button>`).join('')}</div>` : ''}
        ${(item.source_evidence || []).length ? `<h3>Evidence and its limits</h3>${item.source_evidence.map(source=>`<div class="dialog-source"><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.source_id || 'Source')} · ${esc(source.locator || 'Primary source')} ↗</a><p>${esc(source.supports || '')}</p></div>`).join('')}` : '<p class="cast-note">This is an analysis question or proposed relationship; it is not an additional historical event.</p>'}`;
      onDialog(item.title || item.label || id,content);
      wireEvents(document.getElementById('dialog-content'));
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
    function questions() {
      const items=(data.questions || []).filter(q=>questionFilter==='all'||q.priority===questionFilter);
      return `<p class="cast-note">These questions carry forward the investigation register. They are open evidence requests; no outreach or private access is implied.</p><div class="cast-question-filter" role="group" aria-label="Question priority">${[['all','All questions'],['P0','Central to the account'],['P1','Further detail']].map(([key,label])=>`<button data-question-filter="${key}" aria-pressed="${questionFilter===key}">${label}</button>`).join('')}</div>${cards(items)}`;
    }
    function scope() {
      return `<div class="cast-scope-intro"><h3>A checklist for investigation</h3><p>${esc(data.method.summary)}</p><p>${esc(data.method.adaptation)} <a href="${esc(data.method.url)}" target="_blank" rel="noopener noreferrer">Read the CAST Handbook ↗</a></p><p>${esc(data.scope.evidence_limit)} ${esc(data.scope.temporal_limit)}</p><p>The analysis links ${data.coverage.linked_event_count} records across ${data.coverage.linked_source_episode_count} source episodes. ${esc(data.coverage.scope)} ${esc(data.method.claim)}</p></div><div class="cast-scope-grid">${[['Losses to examine',data.losses],['Hazardous conditions',data.hazards],['Required protections',data.constraints],['Cross-system factors',data.systemic_factors]].map(([label,items])=>`<section><h3>${label}</h3>${cards(items || [])}</section>`).join('')}</div>`;
    }
    function changes() {
      return `<p class="cast-note">These are grouped changes to controls, linked to the underlying records. Implementation and effectiveness are different questions; each change includes its verification needs.</p><h3 class="cast-section-title">Reported changes</h3>${cards(data.improvements.filter(item=>item.kind==='reported_actual'))}<h3 class="cast-section-title">Proposed improvements</h3><p class="cast-note">Analyst proposals for investigation and testing. These are not historical actions or proven optimal interventions.</p>${cards(data.improvements.filter(item=>item.kind==='analyst_proposal'))}`;
    }
    function render() {
      element.innerHTML=`<div class="cast-shell"><div class="cast-heading"><h2>What allowed this to happen?</h2><p>A preliminary control analysis: what could act, what information arrived, and which protections held or failed.</p></div><nav class="cast-nav" aria-label="CAST analysis sections">${sections.map(([key,label])=>`<button data-cast-section="${key}" aria-pressed="${active===key}">${label}</button>`).join('')}</nav><div class="cast-content">${active==='structure'?graph():active==='findings'?cards(data.findings || []):active==='changes'?changes():active==='questions'?questions():scope()}</div></div>`;
      wireEvents(element);
      element.querySelectorAll('[data-cast-section]').forEach(button=>button.addEventListener('click',()=>{active=button.dataset.castSection;render(); element.querySelector(`[data-cast-section="${active}"]`).focus({preventScroll:true});}));
      element.querySelectorAll('[data-question-filter]').forEach(button=>button.addEventListener('click',()=>{questionFilter=button.dataset.questionFilter;render();element.querySelector(`[data-question-filter="${questionFilter}"]`).focus({preventScroll:true});}));
      element.querySelectorAll('svg [data-cast-item]').forEach(button=>button.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();openItem(button.dataset.castItem);}}));
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) element.querySelector('.cast-content').animate([{opacity:.2,transform:'translateY(9px)'},{opacity:1,transform:'none'}],{duration:360,easing:'cubic-bezier(.2,.75,.15,1)'});
    }
    render();
    return { render, openItem, show(section) { if (sections.some(([key])=>key===section)) { active=section;render();element.scrollTop=0; } } };
  }
  root.HaruspexCast = { mount };
})(window);
