(() => {
  'use strict';
  const data = window.BACKDRIVE_DATA;
  const app = document.getElementById('app');
  const dialog = document.getElementById('detail-dialog');
  const pages = [['map','Incidents'],['capabilities','Capabilities'],['evaluations','Evaluations'],['safeguards','Interventions'],['pilots','Pilots']];
  const state = {mode:'all',page:'map',layout:'table',query:'',source:'all',domain:'all',evidence:'all',kind:'all',sort:'default',direction:1,selected:'AIID-594',detail:'evidence',control:'approved-inputs',pilot:'construction',models:data.models.map(m => m.id),units:'count',evaluation:'roboharm',roboTask:'mixing'};
  const pilots = data.pilots;
  const h = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getCase = id => data.cases.find(c => c.id === id);
  const getControl = id => data.controls.find(c => c.id === id);
  const robotics = () => state.mode === 'robotics';
  const baseCases = () => data.cases.filter(c => !robotics() || c.robotics);
  const symbol = kind => {
    const paths = {
      incident:'<path d="M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h8"/>',
      capability:'<path d="m6 3 12 0 5 9-5 9H6L1 12zM7 12h10M9 8l-3 4 3 4M15 8l3 4-3 4"/>',
      evaluation:'<path d="M3 3v18h19M7 17v-5M12 17V6M17 17V9"/>'
    };
    return '<svg class="type-symbol '+kind+'" viewBox="0 0 24 24" aria-hidden="true">'+paths[kind]+'</svg>';
  };
  const badge = (text,type='') => '<span class="status '+type+'">'+h(text)+'</span>';
  const button = (label,action,attrs='',className='') => '<button type="button" class="'+className+'" data-action="'+action+'" '+attrs+'>'+label+'</button>';
  const link = (url,label) => '<a href="'+h(url)+'" target="_blank" rel="noopener noreferrer">'+h(label)+' <span aria-hidden="true">↗</span></a>';
  const caseButton = (c,label=c.title,detail='evidence') => button(h(label),'record','data-id="'+c.id+'" data-detail="'+detail+'"','record-link');
  const evalName = c => c.test === 'No reviewed match' ? 'Not yet identified' : c.test;
  const evidenceStatus = c => c.hasResults ? badge('Published results','published') : c.id === 'PILOT-01' ? badge('Scenario') : c.test === 'No reviewed match' ? badge('Unassessed','unassessed') : badge('Proposed test','proposed');
  function rows() {
    let cases = baseCases().filter(c =>
      [c.id,c.title,c.domain,c.sourceLabel,c.sourceName,c.kind,c.capability,c.test].join(' ').toLowerCase().includes(state.query.toLowerCase()) &&
      (state.source==='all' || (state.source==='other' ? c.source && c.sourceKey!=='aiid' : c.sourceKey===state.source)) &&
      (state.domain==='all' || c.domain===state.domain) &&
      (state.kind==='all' || c.recordType===state.kind) &&
      (state.evidence==='all' || (state.evidence==='published' ? c.hasResults : !c.hasResults)));
    if(state.sort!=='default')cases=cases.slice().sort((a,b)=>String(a[state.sort]).localeCompare(String(b[state.sort]),undefined,{numeric:true})*state.direction);
    return cases;
  }
  function filters() {
    const select = (id,label,options,value) => '<label class="filter-select"><span>'+label+'</span><select id="'+id+'">'+options.map(([v,l]) => '<option value="'+h(v)+'" '+(v===value?'selected':'')+'>'+h(l)+'</option>').join('')+'</select></label>';
    const sources=[...new Map(baseCases().map(c=>[c.sourceKey,c.sourceLabel])).entries()];
    return '<div class="filters"><label class="search"><span class="sr-only">Search records</span><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/><path d="m12 12 5 5"/></svg><input id="record-search" type="search" placeholder="Search incidents, capabilities, evaluations…" value="'+h(state.query)+'"></label><div class="filter-row">'+select('source-filter','Source',[['all','All sources'],['other','Other sources'],...sources],state.source)+select('domain-filter','Domain',[['all','All domains'],...[...new Set(baseCases().map(c=>c.domain))].map(d=>[d,d])],state.domain)+select('kind-filter','Type',[['all','All types'],['incident','Reported incidents'],['scenario','Illustrative scenarios']],state.kind)+select('evidence-filter','Evaluation',[['all','Any status'],['published','Published results'],['pending','No mapped results']],state.evidence)+button('Reset','reset','','reset-button')+'</div></div>';
  }
  function heading(title,right='') { return '<div class="page-heading"><h1>'+title+'</h1>'+right+'</div>'; }
  function tableHeader(key,label) { return '<th scope="col" '+(state.sort===key?'aria-sort="'+(state.direction===1?'ascending':'descending')+'"':'')+'>'+button(label+' <span class="sort-arrow" aria-hidden="true">'+(state.sort===key?(state.direction===1?'↑':'↓'):'↕')+'</span>','sort','data-key="'+key+'"')+'</th>'; }
  function mapTable(cases) {
    return '<div class="table-scroll"><table class="records"><caption class="sr-only">Incident, capability, and evaluation connections</caption><thead><tr>'+tableHeader('id','Reference')+tableHeader('title',symbol('incident')+'Incident')+tableHeader('capability',symbol('capability')+'Capability')+tableHeader('test',symbol('evaluation')+'Evaluation')+'<th scope="col">Evidence</th></tr></thead><tbody>'+cases.map(c => '<tr><td class="record-id">'+caseButton(c,c.id)+'</td><td>'+caseButton(c)+'<span class="cell-secondary">'+h((c.recordType==='scenario'?'Illustrative scenario':c.domain)+' ('+c.sourceLabel+')')+'</span></td><td>'+caseButton(c,c.capability,'capability')+'</td><td>'+caseButton(c,evalName(c),'evaluation')+(c.hasResults?'<span class="cell-secondary">Hazardous mixing</span>':'')+'</td><td>'+evidenceStatus(c)+'</td></tr>').join('')+'</tbody></table></div>';
  }
  function connections(cases) {
    const node = (c,kind,label,detail) => '<button class="connection-node '+kind+'" data-action="record" data-id="'+c.id+'" data-detail="'+detail+'">'+symbol(kind)+'<span>'+h(label)+(kind==='incident'?'<span class="cell-secondary">'+h(c.sourceLabel)+'</span>':'')+'</span></button>';
    return '<div class="connection-scroll"><div class="connection-map"><div class="connection-head"><span>'+symbol('incident')+'Incidents</span><span></span><span>'+symbol('capability')+'Capabilities</span><span></span><span>'+symbol('evaluation')+'Evaluations</span></div>'+cases.map(c => '<div class="connection-row">'+node(c,'incident',c.title,'evidence')+'<span class="connection-line" aria-hidden="true"></span>'+node(c,'capability',c.capability,'capability')+'<span class="connection-line" aria-hidden="true"></span>'+node(c,'evaluation',evalName(c),'evaluation')+'</div>').join('')+'</div></div>';
  }
  function empty() { return '<div class="empty"><p>No records match these filters.</p>'+button('Clear filters','reset','','button')+'</div>'; }
  function resultCount() {
    const count=rows().length;
    const sources=new Set(rows().filter(c=>c.source).map(c=>c.sourceKey)).size;
    return '<span aria-live="polite">'+count+' of '+baseCases().length+' records</span><span class="dataset-note">'+sources+' '+(sources===1?'source':'sources')+'</span>';
  }
  function mapContent() { const cases=rows(); return cases.length ? (state.layout==='table'?mapTable(cases):connections(cases)) : empty(); }
  function mapPage() {
    return heading('<span class="map-title"><span>Catalog of</span><span class="map-title-symbols"><span class="section-icon">1</span><span class="map-plus">+</span><span class="section-icon">2</span><span class="map-plus">+</span><span class="section-icon">3</span></span></span>','<div class="view-switch" role="group" aria-label="Catalog display">'+['table','connections'].map(l => button(l==='table'?'Table':'Connections','layout','data-layout="'+l+'" aria-pressed="'+(state.layout===l)+'"',state.layout===l?'active':'')).join('')+'</div>')+filters()+'<div class="table-meta" id="record-count">'+resultCount()+'</div><section class="data-panel" id="record-results">'+mapContent()+'</section><div class="browse-links" role="group" aria-labelledby="browse-actions-label"><div class="browse-action-left">'+button('Show records without test results','preset','data-preset="gaps"')+'<span class="action-arrow arrow-left" aria-hidden="true"></span></div><span class="browse-actions-label" id="browse-actions-label">Actions</span><div class="browse-action-right"><span class="action-arrow arrow-right" aria-hidden="true"></span>'+button('Explore published results','open-benchmark','data-id="roboharm"')+'</div></div>';
  }
  function capabilitiesPage() {
    return heading('Capabilities')+filters()+'<div class="table-meta" id="record-count">'+resultCount()+'</div><section class="data-panel" id="record-results">'+capabilityContent()+'</section>';
  }
  function capabilityContent() {
    const cases=rows(); if(!cases.length)return empty();
    const groups=[...new Set(cases.map(c => c.capability))].map(name => ({name,cases:cases.filter(c => c.capability===name)}));
    return '<div class="table-scroll"><table class="capability-table"><thead><tr><th>'+symbol('capability')+'Capability</th><th>Related behavior</th><th>Incidents</th><th>Evaluation targets</th></tr></thead><tbody>'+groups.map(g => '<tr><td>'+button(h(g.name),'capability','data-name="'+h(g.name)+'"','record-link')+'</td><td>'+h([...new Set(g.cases.map(c => c.secondary))].join('; '))+'</td><td><div class="inline-records">'+g.cases.map(c => caseButton(c,c.id)).join('')+'</div></td><td><div class="inline-records">'+g.cases.map(c => caseButton(c,evalName(c),'evaluation')).join('')+'</div></td></tr>').join('')+'</tbody></table></div>';
  }
  function evaluationsPage() {
    return heading('Evaluations')+'<div class="evaluation-workspace"><nav class="benchmark-list" aria-label="Benchmarks">'+data.evaluations.map(e => button(symbol('evaluation')+'<span><strong>'+h(e.name)+'</strong><span>'+h(e.environment)+'</span></span>','benchmark','data-id="'+e.id+'" aria-pressed="'+(state.evaluation===e.id)+'"',state.evaluation===e.id?'selected':'')).join('')+'</nav><section class="benchmark-detail" id="benchmark-detail">'+benchmarkDetail()+'</section></div><details class="candidate-tests"><summary>Incident-specific evaluation targets <span>'+baseCases().length+'</span></summary><div class="data-panel"><div class="table-scroll"><table><thead><tr><th>Evaluation target</th><th>Incident</th><th>Evidence still needed</th></tr></thead><tbody>'+baseCases().map(c => '<tr><td>'+caseButton(c,evalName(c),'evaluation')+'</td><td>'+caseButton(c)+'</td><td>'+h(c.missing)+'</td></tr>').join('')+'</tbody></table></div></div></details>';
  }
  function benchmarkDetail() {
    const e=data.evaluations.find(e => e.id===state.evaluation);
    return '<div class="section-heading"><div><h2>'+h(e.name)+'</h2><p>'+h(e.focus)+'</p></div>'+link(e.source,'Source')+'</div><p class="benchmark-description">'+h(e.description)+'</p>'+(e.id==='roboharm'?resultsBlock(): '<dl class="benchmark-facts"><div><dt>Environment</dt><dd>'+h(e.environment)+'</dd></div><div><dt>Measures</dt><dd>'+h(e.measures.join(', '))+'</dd></div></dl>')+'<section class="scope-note"><h3>Scope</h3><p>'+h(e.limits)+'</p></section><div class="related-benchmarks"><h3>Candidate incident links</h3><div class="inline-records">'+e.caseIds.map(id => caseButton(getCase(id))).join('')+'</div></div>';
  }
  function resultModels(taskId) {
    if(taskId!=='all')return data.roboharmTasks.find(t => t.id===taskId).models;
    return data.models.map(m => ({...m,...Object.fromEntries(['completed','failed','noAttempt','refused','total'].map(key => [key,data.roboharmTasks.reduce((sum,t) => sum+t.models.find(p => p.id===m.id)[key],0)]))}));
  }
  function resultsBlock(fixedTask) {
    const taskId=fixedTask||state.roboTask;
    const taskName=taskId==='all'?'All five tasks':data.roboharmTasks.find(t => t.id===taskId).name;
    return '<div class="results-component" data-results-task="'+taskId+'">'+(!fixedTask?'<label class="task-select">Task<select data-robo-task><option value="all" '+(taskId==='all'?'selected':'')+'>All five tasks</option>'+data.roboharmTasks.map(t => '<option value="'+t.id+'" '+(t.id===taskId?'selected':'')+'>'+h(t.name)+'</option>').join('')+'</select></label>':'')+'<div class="results-subheading"><h3>'+h(taskName)+'</h3><span>'+resultModels(taskId)[0].total+' trials per policy</span></div><div class="chart-controls"><fieldset><legend class="sr-only">Policies to compare</legend>'+data.models.map(m => '<label><input type="checkbox" data-model="'+m.id+'" '+(state.models.includes(m.id)?'checked':'')+'>'+h(m.name)+'</label>').join('')+'</fieldset><label class="units">Show <select data-chart-units="true"><option value="count" '+(state.units==='count'?'selected':'')+'>Trial counts</option><option value="percent" '+(state.units==='percent'?'selected':'')+'>Percentages</option></select></label></div><div class="results-chart">'+resultsChart(taskId)+'</div><div class="chart-legend"><span><i class="completed"></i>Unsafe task completed</span><span><i class="failed"></i>Execution failed</span><span><i class="no-attempt"></i>No attempt</span><span><i class="refused"></i>Refused</span></div><p class="chart-note">Refused includes safety and non-safety refusals. Execution failure does not establish a refusal.'+(fixedTask?' This is a related hazard test, not a reproduction of the incident.':'')+'</p></div>';
  }
  function resultsChart(taskId=state.roboTask) {
    const models=resultModels(taskId).filter(m => state.models.includes(m.id));
    if(!models.length)return '<div class="empty compact">Select a policy to compare.</div>';
    const total=models[0].total;
    return models.map(m => '<div class="chart-row"><span class="chart-label">'+h(m.name)+'</span><div class="chart-track" role="img" aria-label="'+h(m.name+': '+m.completed+' unsafe completions, '+m.failed+' execution failures, '+m.noAttempt+' no attempts, '+m.refused+' refusals out of '+m.total)+'">'+[['completed',m.completed],['failed',m.failed],['no-attempt',m.noAttempt],['refused',m.refused]].filter(segment => segment[1]).map(segment => '<span class="'+segment[0]+'" title="'+segment[1]+' trials" style="width:'+segment[1]/m.total*100+'%">'+(state.units==='percent'?Math.round(segment[1]/m.total*100)+'%':segment[1])+'</span>').join('')+'</div></div>').join('')+'<div class="chart-axis"><span>0</span><span>'+(state.units==='percent'?'50%':total/2)+'</span><span>'+(state.units==='percent'?'100%':total+' trials')+'</span></div>';
  }
  function controlComparison(c) {
    return '<div class="section-heading"><h2>'+h(c.name)+'</h2>'+badge('Untested')+'</div><p class="comparison-question">'+h(c.question)+'</p><div class="baseline-comparison"><div><h3>Baseline</h3><p>'+h(c.baseline)+'</p></div><div><h3>With intervention</h3><p>'+h(c.comparison)+'</p></div></div><div class="control-protocol"><h3>Comparison</h3><p>'+h(c.protocol)+'</p></div><table class="measures"><thead><tr><th>Measure</th><th>Baseline</th><th>With intervention</th></tr></thead><tbody>'+c.measures.map(m => '<tr><td>'+h(m)+'</td><td>Not measured</td><td>Not measured</td></tr>').join('')+'</tbody></table><div class="control-limits"><div><h3>Operating context</h3><p>'+h(c.context)+'</p></div><div><h3>What it does not resolve</h3><p>'+h(c.residual)+'</p></div></div><div class="related-row"><span>Linked records</span><div class="inline-records">'+data.cases.filter(record => record.controlId===c.id || record.id===c.caseId).map(record => caseButton(record)).join('')+'</div></div>';
  }
  function safeguardsPage() {
    return heading('Interventions')+'<div class="comparison-workspace"><nav class="control-list" aria-label="Interventions">'+data.controls.map(c => button(h(c.name)+'<span>'+h(c.category)+'</span>','control','data-id="'+c.id+'" aria-pressed="'+(state.control===c.id)+'"',state.control===c.id?'selected':'')).join('')+'</nav><section class="comparison-panel" id="control-comparison">'+controlComparison(getControl(state.control))+'</section></div>';
  }
  function pilotsPage() {
    const p=pilots.find(p => p.id===state.pilot);
    return heading('Pilots')+'<section class="data-panel"><div class="table-scroll"><table class="pilot-table"><thead><tr><th>Pilot</th><th>Organization</th><th>Status</th><th>Records</th></tr></thead><tbody>'+pilots.map(p => '<tr class="'+(state.pilot===p.id?'selected-row':'')+'"><td>'+button(h(p.name),'pilot','data-id="'+p.id+'" aria-pressed="'+(state.pilot===p.id)+'"','record-link')+(p.featured?'<span class="featured">Featured</span>':'')+'</td><td>'+h(p.partner)+'</td><td>'+badge(p.status)+'</td><td>'+p.caseIds.length+'</td></tr>').join('')+'</tbody></table></div></section><section class="pilot-detail" id="pilot-detail">'+pilotDetail(p)+'</section>';
  }
  function pilotNotes(p) {
    const caseLinks = p.caseIds.map(id => {
      const record = getCase(id);
      return '<li>'+caseButton(record)+'<span>'+h(record.sourceLabel+', '+record.kind)+'</span></li>';
    }).join('');
    const benchmarkLinks = p.evalIds.map(id => {
      const evaluation = data.evaluations.find(item => item.id===id);
      return '<li>'+button(h(evaluation.name),'open-benchmark','data-id="'+id+'"','record-link')+'<span>'+h(evaluation.focus)+'</span></li>';
    }).join('');
    return '<h4 class="note-context">'+h(p.name)+'</h4><p>'+h(p.note)+'</p><p>'+h(p.evidence)+'</p><h4>Incident records</h4><ul class="note-links">'+caseLinks+'</ul><h4>Evaluations to consider</h4><ul class="note-links">'+benchmarkLinks+'</ul><h4>Comparison under consideration</h4><p>'+h(p.baseline)+'</p><p>'+h(p.intervention)+'</p><h4>Possible measures</h4><ul class="note-list">'+p.readout.map(item=>'<li>'+h(item)+'</li>').join('')+'</ul><h4>Still to agree</h4><ul class="note-list">'+p.required.map(item=>'<li>'+h(item)+'</li>').join('')+'</ul>';
  }
  function pilotDetail(p) {
    const controls = p.controls.map(id => {
      const control = getControl(id);
      return '<tr><td>'+button(h(control.name),'open-control','data-id="'+id+'"','record-link')+'</td><td>'+h(control.question)+'</td></tr>';
    }).join('');
    return '<div class="section-heading pilot-heading"><div><h2>'+h(p.name)+'</h2><p>'+h(p.description)+'</p></div>'+(p.featured?'<img class="brand-logo sage-logo" src="assets/sage-plant-original.png" alt="The Sage Plant">':'')+'</div><p class="pilot-question">'+h(p.question)+'</p><div class="table-scroll"><table class="pilot-comparisons"><thead><tr><th>Intervention to examine</th><th>Question to investigate</th></tr></thead><tbody>'+controls+'</tbody></table></div>';
  }
  function aboutData() {
    return '<ul class="about-data-copy about-data-list"><li>The map links reported incidents to capabilities and evaluations to investigate possible gaps in coverage.<ul><li>Back\\Drive focuses the same map on robotics, with connections proposed for review.</li></ul></li><li>RoboHarm provides published benchmark results, while the proposed interventions still need testing.</li><li>The Sage Plant is the featured proposed pilot. Other pilots are illustrative examples, and none has been run.</li></ul>';
  }
  function workspaceNotes() {
    const pilot=state.page==='pilots'?pilots.find(item=>item.id===state.pilot):null;
    const content=pilot?pilotNotes(pilot)+'<h4>About our data</h4>'+aboutData():aboutData();
    return '<section class="workspace-note" id="workspace-note"><button type="button" class="note-corner" title="Open notes and sources" aria-label="Open notes and sources" aria-expanded="false" aria-controls="workspace-notes-panel"><svg viewBox="0 0 44 44" aria-hidden="true"><path class="corner-paper" d="M0 0h44v44Z"/><path class="corner-edge" d="m1 1 42 42M25 10h10M29 15h6"/></svg></button><aside class="note-sheet'+(pilot?'':' concise-note')+'" id="workspace-notes-panel" aria-labelledby="workspace-notes-title" aria-hidden="true" inert><h3 id="workspace-notes-title" tabindex="-1">'+(pilot?'Notes and sources':'About our data')+'</h3><div class="note-content">'+content+'</div></aside></section>';
  }
  function mainNavigation() {
    const marks = {map:'1',capabilities:'2',evaluations:'3',safeguards:'!',pilots:'?'};
    const navButton = (id, name) => button(
      '<span class="section-icon" aria-hidden="true">'+marks[id]+'</span><span>'+name+'</span>',
      'nav',
      'data-page="'+id+'" '+(state.page===id?'aria-current="page"':''),
      state.page===id?'active':''
    );
    return '<div class="navigation-bar"><nav aria-label="Main navigation"><div class="map-navigation" role="group" aria-label="Incident–capability–evaluation map">'+pages.slice(0,3).map(([id,name])=>navButton(id,name)).join('')+'</div><div class="intervention-navigation">'+navButton(...pages[3])+'</div><div class="pilot-navigation">'+navButton(...pages[4])+'</div></nav></div>';
  }
  const mastheadObserver = new ResizeObserver(() => sizeWorkspaceNote());
  function sizeWorkspaceNote(progress) {
    const top=document.querySelector('.workspace-top');
    const masthead=document.querySelector('.workspace-masthead');
    const note=document.getElementById('workspace-note');
    if(!top||!masthead||!note)return;
    const baseHeight=masthead.getBoundingClientRect().height;
    top.style.setProperty('--masthead-height',baseHeight+'px');
    const sheetBounds=note.querySelector('.note-sheet').getBoundingClientRect();
    const diagonal=sheetBounds.width+sheetBounds.height;
    note.style.setProperty('--note-diagonal',diagonal+'px');
    const expandedHeight=Math.max(baseHeight,sheetBounds.height);
    const amount=progress??(notePull?.moved?notePull.progress:note.classList.contains('is-open')?1:0);
    top.style.setProperty('--top-height',baseHeight+(expandedHeight-baseHeight)*amount+'px');
    if(notePull?.moved)note.style.setProperty('--note-reveal',diagonal*amount+'px');
  }
  function setWorkspaceNote(open,focus=false) {
    const note=document.getElementById('workspace-note');
    if(!note)return;
    const top=document.querySelector('.workspace-top');
    const corner=note.querySelector('.note-corner');
    const sheet=note.querySelector('.note-sheet');
    note.classList.toggle('is-open',open);
    top.classList.toggle('is-open',open);
    document.querySelector('.workspace-masthead').inert=open;
    sheet.inert=!open;
    sheet.setAttribute('aria-hidden',String(!open));
    corner.setAttribute('aria-expanded',String(open));
    const label=(open?'Close':'Open')+' notes and sources';
    corner.setAttribute('aria-label',label);
    corner.title=label;
    sizeWorkspaceNote();
    if(focus)(open?sheet.querySelector('h3'):corner).focus({preventScroll:true});
  }
  function shell() {
    document.documentElement.dataset.mode=state.mode;
    document.querySelector('meta[name="theme-color"]').content=robotics()?'#006275':'#a32035';
    document.title=(robotics()?'Back\\Drive':'Catalog of 1+2+3')+' — '+pages.find(p => p[0]===state.page)[1];
    app.innerHTML='<div class="shell"><div class="workspace-top">'+workspaceNotes()+'<div class="workspace-masthead"><header class="workspace-header"><div class="header-inner"><div class="brand-family"><a href="#map" data-action="nav" data-page="map" aria-label="MIT AI Risk Initiative home"><img class="brand-logo airi-logo" src="assets/'+(robotics()?'mit-airi-teal.svg':'mit-airi-official.svg')+'" alt="MIT AI Risk Initiative"></a>'+(robotics()?'<span class="collaboration-credit">in collaboration with</span><img class="brand-logo robocurve-logo" src="assets/robocurve-original.png" alt="Robocurve">':'')+'</div><div class="header-tools"><div class="segmented mode-switch" role="group" aria-label="Workspace mode">'+button('All AI','mode','data-mode="all" aria-pressed="'+!robotics()+'"',!robotics()?'active':'')+button('Back\\Drive','mode','data-mode="robotics" aria-label="BackDrive robotics mode" aria-pressed="'+robotics()+'"',robotics()?'active':'')+'</div></div></div></header>'+mainNavigation()+'</div></div><main id="main" tabindex="-1">'+({map:mapPage,capabilities:capabilitiesPage,evaluations:evaluationsPage,safeguards:safeguardsPage,pilots:pilotsPage}[state.page])()+'</main></div>';
    mastheadObserver.disconnect();
    sizeWorkspaceNote();
    mastheadObserver.observe(document.querySelector('.workspace-masthead'));
    mastheadObserver.observe(document.querySelector('.note-sheet'));
  }
  function refreshRecords() {
    document.getElementById('record-results').innerHTML=state.page==='map'?mapContent():capabilityContent();
    document.getElementById('record-count').innerHTML=resultCount();
  }
  function resetFilters() {state.query='';state.source='all';state.domain='all';state.evidence='all';state.kind='all';}
  function navigate(page) {if(!pages.some(p => p[0]===page))return;state.page=page;shell();document.getElementById('main').focus({preventScroll:true});}
  function showDialog(title,body) {
    dialog.innerHTML='<div class="dialog-heading"><h2 id="dialog-title">'+h(title)+'</h2>'+button('×','close','aria-label="Close details"','close-button')+'</div><div class="dialog-content">'+body+'</div>';
    if(!dialog.open)dialog.showModal();
  }
  function recordBody(c) {
    if(state.detail==='evaluation') return '<div class="detail-section"><div class="section-heading"><h3>'+h(evalName(c))+'</h3>'+evidenceStatus(c)+'</div><p>'+h(c.connection)+'</p><h3>What is missing</h3><p>'+h(c.missing)+'</p>'+(c.hasResults?resultsBlock('mixing'):'<h3>Next comparison</h3><p>'+h(c.nextTest)+'</p>')+(c.evalIds.length?'<h3>Benchmark resources to review</h3><div class="inline-records">'+c.evalIds.map(id => {const e=data.evaluations.find(e => e.id===id);return button(symbol('evaluation')+h(e.name),'open-benchmark','data-id="'+id+'"','record-link');}).join('')+'</div>':'')+'</div>';
    if(state.detail==='capability')return '<div class="detail-section"><h3>'+h(c.capability)+'</h3><p>'+h(c.capabilityBasis)+'</p><dl class="facts"><div><dt>Related behavior</dt><dd>'+h(c.secondary)+'</dd></div><div><dt>Evaluation</dt><dd>'+h(evalName(c))+'</dd></div></dl><h3>Evidence needed</h3><p>'+h(c.missing)+'</p></div>';
    if(state.detail==='safeguard')return '<div class="detail-section">'+controlComparison(getControl(c.controlId))+'</div>';
    return '<div class="detail-section"><p>'+h(c.summary)+'</p><dl class="facts"><div><dt>Domain</dt><dd>'+h(c.domain)+'</dd></div><div><dt>Date</dt><dd>'+h(c.date)+'</dd></div><div><dt>Record</dt><dd>'+h(c.kind)+'</dd></div><div><dt>'+h(c.sourceRecordId?'Source reference':'Local reference')+'</dt><dd>'+h(c.sourceRecordId||c.id)+'</dd></div></dl>'+(c.reportedResponse?'<h3>Reported response</h3><p>'+h(c.reportedResponse)+'</p>':'')+'<h3>Sources</h3>'+c.sourceNotes.map(s => '<div class="source-row"><div>'+(s.url?link(s.url,s.label):'<strong>'+h(s.label)+'</strong>')+'<p>'+h(s.description)+'</p></div>'+badge(s.type)+'</div>').join('')+'</div>';
  }
  function openRecord(id,detail='evidence') {
    const c=getCase(id);if(!c)return;state.selected=id;state.detail=detail;
    const tabs=[['evidence','Evidence'],['capability','Capability'],['evaluation','Evaluation'],['safeguard','Intervention']];
    showDialog(c.title,'<div class="record-topline"><span>'+h(c.id)+'</span>'+(c.source?link(c.source,c.sourceName):badge('Illustrative scenario'))+'</div><div class="record-chain" aria-label="Proposed incident to evaluation connection">'+['incident','capability','evaluation'].map((kind,i) => button(symbol(kind)+h([c.title,c.capability,evalName(c)][i]),'detail-tab','data-detail="'+['evidence','capability','evaluation'][i]+'"')).join('<span aria-hidden="true">→</span>')+'</div><div class="detail-tabs" role="tablist" aria-label="Record details">'+tabs.map(([id,name]) => button(name,'detail-tab','data-detail="'+id+'" id="tab-'+id+'" role="tab" aria-controls="detail-panel" aria-selected="'+(state.detail===id)+'" tabindex="'+(state.detail===id?'0':'-1')+'"',state.detail===id?'active':'')).join('')+'</div><div id="detail-panel" role="tabpanel" aria-labelledby="tab-'+state.detail+'">'+recordBody(c)+'</div>');
  }
  let notePull = null;
  let suppressCornerClickUntil = 0;
  function finishNotePull(cancelled=false) {
    if(!notePull)return;
    const pull=notePull;
    notePull=null;
    if(!pull.moved)return;
    const open=cancelled?pull.wasOpen:pull.progress>(pull.wasOpen?0.65:0.35);
    pull.note.classList.remove('is-pulling');
    document.querySelector('.workspace-top').classList.remove('is-pulling');
    pull.note.style.removeProperty('--note-reveal');
    suppressCornerClickUntil=cancelled?0:performance.now()+500;
    if(pull.corner.hasPointerCapture(pull.pointerId))pull.corner.releasePointerCapture(pull.pointerId);
    setWorkspaceNote(open,true);
  }
  document.addEventListener('pointerdown',event=>{
    const corner=event.target.closest('.note-corner');
    if(!corner||event.button!==0)return;
    const note=corner.closest('.workspace-note');
    const wasOpen=note.classList.contains('is-open');
    notePull={corner,note,pointerId:event.pointerId,x:event.clientX,y:event.clientY,wasOpen,progress:wasOpen?1:0,moved:false};
    corner.setPointerCapture(event.pointerId);
  });
  document.addEventListener('pointermove',event=>{
    if(!notePull||event.pointerId!==notePull.pointerId)return;
    const distance=((notePull.x-event.clientX)+(event.clientY-notePull.y))/Math.SQRT2;
    if(!notePull.moved&&Math.abs(distance)<7)return;
    notePull.moved=true;
    notePull.progress=Math.max(0,Math.min(1,(notePull.wasOpen?1:0)+distance/150));
    notePull.note.classList.add('is-pulling');
    document.querySelector('.workspace-top').classList.add('is-pulling');
    document.querySelector('.workspace-masthead').inert=true;
    notePull.note.querySelector('.note-sheet').inert=true;
    sizeWorkspaceNote(notePull.progress);
  });
  document.addEventListener('pointerup',event=>{if(notePull&&event.pointerId===notePull.pointerId)finishNotePull();});
  document.addEventListener('pointercancel',event=>{if(notePull&&event.pointerId===notePull.pointerId)finishNotePull(true);});
  document.addEventListener('lostpointercapture',event=>{if(notePull&&event.pointerId===notePull.pointerId)finishNotePull(true);});
  document.addEventListener('keydown',event=>{
    const note=document.getElementById('workspace-note');
    if(event.key!=='Escape'||!note?.classList.contains('is-open')||dialog.open)return;
    event.preventDefault();
    finishNotePull(true);
    setWorkspaceNote(false,true);
  });
  document.addEventListener('click',event=>{
    const note=document.getElementById('workspace-note');
    if(event.target.closest('.note-corner')){
      event.preventDefault();
      if(event.detail>0&&performance.now()<suppressCornerClickUntil){
        suppressCornerClickUntil=0;
        event.stopImmediatePropagation();
        return;
      }
      setWorkspaceNote(!note.classList.contains('is-open'),true);
      return;
    }
    if(note?.classList.contains('is-open')&&!note.contains(event.target)&&!dialog.open)setWorkspaceNote(false);
  },true);
  document.addEventListener('click',event => {
    const el=event.target.closest('[data-action]');if(!el)return;event.preventDefault();
    const action=el.dataset.action;
    if(action==='nav'){dialog.close();navigate(el.dataset.page);}
    if(action==='mode'){state.mode=el.dataset.mode;resetFilters();shell();document.querySelector('[data-mode="'+state.mode+'"]').focus();}
    if(action==='layout'){state.layout=el.dataset.layout;shell();}
    if(action==='reset'){resetFilters();shell();}
    if(action==='sort'){if(state.sort===el.dataset.key)state.direction*=-1;else{state.sort=el.dataset.key;state.direction=1;}refreshRecords();}
    if(action==='benchmark'){state.evaluation=el.dataset.id;shell();}
    if(action==='open-benchmark'){state.evaluation=el.dataset.id;dialog.close();navigate('evaluations');}
    if(action==='capability'){const records=baseCases().filter(c => c.capability===el.dataset.name);showDialog(el.dataset.name,records.map(c => '<section class="capability-evidence"><h3>'+caseButton(c)+'</h3><p>'+h(c.capabilityBasis)+'</p><div class="related-row"><span>Evaluation target</span>'+caseButton(c,evalName(c),'evaluation')+'</div></section>').join(''));}
    if(action==='record')openRecord(el.dataset.id,el.dataset.detail);
    if(action==='detail-tab'){openRecord(state.selected,el.dataset.detail);dialog.querySelector('[role="tab"][data-detail="'+state.detail+'"]').focus();}
    if(action==='close')dialog.close();
    if(action==='preset'){state.evidence='pending';shell();}
    if(action==='control'){state.control=el.dataset.id;shell();}
    if(action==='open-control'){state.control=el.dataset.id;dialog.close();navigate('safeguards');}
    if(action==='pilot'){state.pilot=el.dataset.id;shell();}
  });
  document.addEventListener('input',event => {if(event.target.id==='record-search'){state.query=event.target.value;refreshRecords();}});
  document.addEventListener('change',event => {
    const el=event.target;
    const key={'source-filter':'source','domain-filter':'domain','evidence-filter':'evidence','kind-filter':'kind'}[el.id];
    if(key){state[key]=el.value;refreshRecords();}
    if(el.hasAttribute('data-robo-task')){state.roboTask=el.value;document.getElementById('benchmark-detail').innerHTML=benchmarkDetail();document.querySelector('[data-robo-task]').focus();}
    if(el.dataset.model){state.models=el.checked?[...state.models,el.dataset.model]:state.models.filter(id => id!==el.dataset.model);document.querySelectorAll('.results-chart').forEach(chart => {chart.innerHTML=resultsChart(chart.closest('[data-results-task]').dataset.resultsTask);});document.querySelectorAll('[data-model]').forEach(box => {box.checked=state.models.includes(box.dataset.model);});document.querySelectorAll('[data-chart-units]').forEach(select => {select.value=state.units;});}
    if(el.dataset.chartUnits){state.units=el.value;document.querySelectorAll('.results-chart').forEach(chart => {chart.innerHTML=resultsChart(chart.closest('[data-results-task]').dataset.resultsTask);});document.querySelectorAll('[data-model]').forEach(box => {box.checked=state.models.includes(box.dataset.model);});document.querySelectorAll('[data-chart-units]').forEach(select => {select.value=state.units;});}
  });
  dialog.addEventListener('click',event => {if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('keydown',event => {
    if(event.target.getAttribute('role')!=='tab'||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const tabs=['evidence','capability','evaluation','safeguard'];let i=tabs.indexOf(state.detail);
    i=event.key==='Home'?0:event.key==='End'?3:(i+(event.key==='ArrowRight'?1:3))%4;
    openRecord(state.selected,tabs[i]);dialog.querySelector('[role="tab"][data-detail="'+tabs[i]+'"]').focus();
  });
  shell();
})();
