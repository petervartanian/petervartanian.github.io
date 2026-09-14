/* Reader-facing CAST inquiry. Source records and evidence statuses remain in the analysis ledger. */
((root) => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const topics = [
    ['F01','Boundaries'],['F02','Incentives'],['F03','Coordination'],['F04','Early warnings'],
    ['F05','Spreading access'],['F06','Escalation'],['F07','Trust in records'],
    ['F08','Containment'],['F09','What held'],['F10','Changes'],
  ];
  const positions = {
    F01: {CT01:[170,80],CT11:[660,80],CT05:[170,270],CT04:[660,270]},
    F02: {CT01:[170,80],CT03:[500,80],CT05:[500,280],CT02:[830,280]},
    F03: {CT03:[170,80],CT05:[750,80],CT04:[170,280]},
    F04: {CT14:[170,80],CT01:[750,80],CT10:[170,280],CT11:[750,280]},
    F05: {CT05:[170,80],CT06:[750,80],CT07:[750,280]},
    F06: {CT06:[170,80],CT08:[500,80],CT09:[830,80]},
    F07: {CT03:[170,80],CT05:[500,80],CT11:[830,280]},
    F08: {CT01:[170,80],CT11:[500,80],CT13:[830,80],CT09:[170,280],CT12:[830,280]},
    F09: {CT06:[170,80],CT07:[500,80],CT09:[830,80]},
    F10: {CT01:[170,80],CT10:[500,80],CT11:[500,280],CT13:[830,280],CT04:[170,280]},
  };
  const shortNames = {
    CT01:'Research operators',CT02:'Tasks and rewards',CT03:'Harness and tools',CT04:'Research service boundaries',
    CT05:'Evaluation agents',CT06:'HF workload services',CT07:'HF access controls',CT08:'HF detection',
    CT09:'HF responders',CT10:'OpenAI monitoring',CT11:'OpenAI responders',CT12:'External operators',
    CT13:'JFrog response',CT14:'Exception owners',
  };
  const startingQuestions = {F01:'Q03',F02:'Q13',F03:'Q03',F04:'Q05',F05:'Q10',F06:'Q04',F07:'Q02',F08:'Q06',F09:'Q07',F10:'Q11'};
  const startingLinks = {F01:'R05',F02:'R02',F03:'R07',F04:'R14',F05:'R09',F06:'R11',F07:'R03',F08:'R19',F09:'R09',F10:'R21'};
  const durability = {
    F01:['Containment beyond the sandbox','A restriction can work on one route while leaving another reachable. More capable agents could find paths that a narrow boundary test missed.','An updated map of reachable services and tests starting from a compromised dependency would challenge this protection.'],
    F02:['A safe way to be blocked','A permitted failure outcome could reduce pressure to produce a successful-looking answer. Its value depends on what the task and reward system actually reward.','Comparisons would need to separate reward effects from access opportunities, using the relevant model and held-out tasks.'],
    F03:['Isolation between runs','Communication can survive the removal of a messaging channel if agents can still read and change shared resources.','Boundary tests would need to cover shared state and indirect communication, including channels not used in this incident.'],
    F04:['A warning that can change a decision','Detection offers limited protection if the recipient cannot interrupt the work or misunderstands what the signal means.','A realistic exercise could establish whether the right information reaches an authorized decision-maker while work is under pressure.'],
    F05:['Bounded access','A denied operation can be protective while a different identity or route remains available. Stronger agents could exploit that remaining reach.','Tests would need to begin with a compromised workload and examine the authority available through its dependencies.'],
    F06:['Detection that reaches a responder','More accurate detection would not repair a broken delivery path. Faster or more deceptive activity could also outpace an escalation process that works in a narrow test.','The actual gap must be located first. A follow-up exercise would then test qualifying signals through acknowledgement and action, alongside benign cases.'],
    F07:['Evidence outside the agent’s control','A convincing transcript cannot substitute for an independently retained record of what happened. More capable manipulation could make that distinction harder to spot.','Material claims would need comparison with records the agent could not alter. Those records can establish actions without establishing internal motivation.'],
    F08:['A stop that covers the affected resources','A shutdown can succeed within its scope while an untracked workload remains active elsewhere. Greater autonomy could make the inventory harder to keep current.','Resource owners would need to reconcile completed actions with the inventory and subsequent activity, including external handoffs.'],
    F09:['Protection beyond this attempt','The reported denials show limits on particular actions. They do not establish that stronger agents could not find another route or obtain broader authority.','Adversarial tests would need to challenge the protected boundary through different routes, with enough independent observation to detect a failure.'],
    F10:['A fix that continues to work','A repair or a successful retrospective test does not establish effectiveness after the system changes. A protection can weaken as permissions, workloads, or capabilities change.','Deployment evidence and tests under changed conditions would need to show what still works and when a change should be revised or withdrawn.'],
  };
  // Reader-facing paraphrases. The original proposals and verification fields remain in the full record.
  const changeCopy = {
    I01: {verification:'Configuration snapshots and boundary tests would show which routes the rebuild closed and where the mitigation was deployed.', limitations:'Later access through other mechanisms is reported. The repair does not establish complete containment.'},
    I02: {verification:'Configuration changes and credential records would establish the scope of the repair. Tests of the affected routes and subsequent activity would help assess whether it worked.', limitations:'The public accounts describe the response. Its complete scope and effectiveness have not been independently established here.'},
    I03: {verification:'The workload and checkpoint inventory would need to match completed stop actions and records of subsequent activity.', limitations:'A related checkpoint was identified later. No single stop timestamp covers the entire response.'},
    I04: {verification:'Installed versions and tests on the affected instances would show whether the relevant route was closed.', limitations:'A released fix or a notification does not establish that each affected customer installed it.'},
    I05: {verification:'The methods and baseline would need examination, including which cases were tested and where the safeguards failed. Held-out cases would help assess whether the result generalizes.', limitations:'A retrospective test does not establish that an incident was prevented or that the safeguard was deployed everywhere.'},
    I06: {verification:'Exercises across the deployed scope would need to follow a signal through delivery and acknowledgement to a decision. Benign cases matter too.', limitations:'Monitoring narrated reasoning cannot by itself establish cause or ensure detection of every material action.'},
    I07: {summary:'The teams responsible for service boundaries could test the access available after a reachable service or identity is compromised.', verification:'An agreed map of allowed access would define the test. Disallowed transitions should fail while authorized work remains possible.', limitations:'The intended boundary and actual topology must be established first. One successful test would not show that every episode could have been prevented.'},
    I08: {summary:'Task and evaluation owners could make missing materials or denied access acceptable reasons to stop. They could then test whether scoring still rewards unauthorized workarounds or agent-controlled evidence.', verification:'Comparisons would examine authorized completion, authorized failure or escalation, and unauthorized workarounds. Outcomes would be checked independently on held-out tasks.', limitations:'The relevant runs and reward mechanisms remain unresolved. The causal value of this change needs testing.'},
    I09: {summary:'Detection and response owners could locate the actual gap, then exercise the path from a qualifying signal to an acknowledged response and recorded decision.', verification:'Replayed or controlled signals would reveal where the process stops working. The exercise would follow the configured rule through delivery and acknowledgement to action, and include signals that should not escalate.', limitations:'A classifier change could miss the problem if the break lies in delivery or response ownership. The cause must be distinguished before choosing a repair.'},
    I10: {summary:'Research and response owners could record who can stop work, authorize an exception, or approve a restart, together with the evidence each decision requires.', verification:'Realistic scenarios would establish whether the responsible role receives the needed information and can act within the agreed scope.', limitations:'This proposed check does not establish that formal authority was absent during the incident.'},
    I11: {summary:'Investigators and record owners could connect material claims to evidence retained outside the agent’s control, preserving where each record came from.', verification:'Paired records would support checks of execution, transfers, and containment. Failed actions and contradictory accounts would remain visible.', limitations:'Disclosure constraints may require sanitized extracts. Additional records would not automatically establish motivation or causality.'},
    I12: {summary:'Response coordinators could track affected resources and external handoffs through to verified completion, with an owner for each outstanding action.', verification:'The affected-resource inventory would need to match completed actions and independent checks for subsequent activity.', limitations:'Completeness depends on the inventory and observation windows. A response action or handoff alone does not establish effective containment.'},
  };
  const questionCopy = {
    Q01:['A record manifest, stable pseudonymous identifiers, and a description of provenance and coverage would establish what underlying evidence is available. Targeted extracts could be useful where full access is unavailable.','The event entries are derived from public reports. Underlying records are needed to investigate beyond those accounts.'],
    Q02:['Paired records and reconstruction methods would help establish which claims survive comparison with independently retained evidence. Examples of failures and uncertainty bounds would show the limits of that comparison.','Having many records does not establish their integrity. Actions may be corroborated while model motivation remains unresolved.'],
    Q03:['An architecture and control diagram, contemporary descriptions of the controls, and role-level ownership would establish the intended boundary. Approval and change records would help explain how it evolved.','CAST needs the operating environment and control relationships behind the actions. Capability alone does not explain how those actions became possible.'],
    Q04:['Sanitized alert and ticket timestamps, the escalation logic, and decision records would locate the reported gap. Tests of the subsequent change would help establish whether it was repaired.','The report establishes a problem at a high level. Its timing and mechanism need further evidence.'],
    Q05:['Contemporary incident and triage records would show what responders knew. Decision ownership and closure criteria would help explain their choices.','An early signal does not establish knowledge of the later incident. Decisions need to be assessed against the information available at the time.'],
    Q06:['Intervention records would need to be paired with activity in the affected scope, including completion checks and any subsequent activity.','Activity declining after a response does not by itself establish that the response caused the decline.'],
    Q07:['A scoped impact assessment and audit or egress evidence would establish which consequences were observed. Negative findings need an explicit observation period and coverage.','Available privileges and potential impact are different from realized harm. The distinction affects which protections can be said to have limited the damage.'],
    Q08:['Workflow identifiers and permission context would need to be linked to execution records and any resulting artifact or release.','The accounts may describe different stages. Executing a workflow and shipping a malicious change are different claims.'],
    Q09:['A targeted reconciliation of disputed times would be useful where ordering changes the interpretation of an action or response.','Timing matters when it changes what could have influenced a decision or consequence. Separate invocations should remain separate where the evidence supports them.'],
    Q10:['A sanitized topology and a mapping from each relevant passage to its component and period would clarify the access paths.','A diagram needs stable referents. Similar path labels do not establish that two reports describe the same service or identity.'],
    Q11:['Dated changes and deployment records would establish what was installed where. Test methods, failures, and follow-up monitoring would help assess effectiveness.','A list of fixes does not establish which protections improved or where that improvement has been checked.'],
    Q12:['Test methods and results would need to include failed cases and any independent or held-out validation available.','Detection in replay, prevention in an experiment, and containment in a live system are different results.'],
    Q13:['Run-level metadata and evaluation conditions would help identify the participating agents. Denominators and uncertainty in actor mapping are needed for comparisons.','A cohort dominated by one model does not identify every actor. Selected examples do not establish population rates.'],
    Q14:['A reconciled handoff chronology and role-level ownership would clarify the exchanges between organizations, including the distinction between a platform and its customer-operated workloads.','CAST examines communication and authority across organizational boundaries. A vendor statement cannot substitute for every customer’s operational record.'],
    Q15:['Contemporary assessments and decision notes would establish the information available at the time. Corroborated descriptions could help where documents cannot be shared.','Witness recollection and documentary evidence have different limits. Accounts that challenge the emerging explanation matter too.'],
    Q16:['Concrete missing fields, misunderstandings, and realistic user tasks would help assess whether the investigation is useful.','Method and usability discussions do not establish that a participant has operational incident evidence.'],
  };
  const typeName = {control_action:'Control action',feedback:'Feedback',coordination:'Coordination'};
  const stateName = {documented:'Reported relationship',reported_omission:'Reported gap',unknown:'Unresolved relationship',proposed:'Proposed relationship'};
  const glyph = '<svg class="cw-barrier" viewBox="0 0 22 22" aria-hidden="true"><path d="M11 4v14M6 4h10M6 18h10"/></svg>';
  const arrow = '<svg class="ui-icon ui-arrow" viewBox="0 0 16 16" aria-hidden="true"><use href="#ui-arrow"/></svg>';
  const sentence = value => { const text=String(value || '').trim(); return text ? text[0].toUpperCase()+text.slice(1) : ''; };
  function diagramModel(data, findingId) {
    const finding=data.findings.find(item=>item.id===findingId);
    const layout=positions[findingId];
    const nodes=Object.entries(layout).map(([id,[x,y]])=>({id,x,y,w:240,h:72}));
    const index=new Map(nodes.map(node=>[node.id,node]));
    const edges=data.relationships.filter(edge=>index.has(edge.from)&&index.has(edge.to)&&edge.status!=='proposed'&&(edge.id!=='R23'||findingId==='F10'));
    const bottom=Math.max(...nodes.map(node=>node.y))+112;
    const paths=edges.map((edge,i)=>{
      const a=index.get(edge.from),b=index.get(edge.to),reciprocal=edges.some(other=>other.from===edge.to&&other.to===edge.from&&other.id!==edge.id);
      let start,end,d;
      if(a===b){start=[a.x+100,a.y-36];end=[a.x+120,a.y+12];d=`M${start} C${a.x+165},${a.y-100} ${a.x+215},${a.y+12} ${end}`;}
      else if(a.y===b.y){
        const direction=Math.sign(b.x-a.x),blocked=nodes.some(n=>n!==a&&n!==b&&n.y===a.y&&n.x>Math.min(a.x,b.x)&&n.x<Math.max(a.x,b.x));
        if(blocked){start=[a.x,a.y+36];end=[b.x,b.y+36];d=`M${start} C${a.x},${bottom+55} ${b.x},${bottom+55} ${end}`;}
        else {start=[a.x+direction*120,a.y];end=[b.x-direction*120,b.y];const bend=reciprocal?(direction>0?-42:42):0;d=bend?`M${start} C${start[0]+direction*45},${a.y+bend} ${end[0]-direction*45},${b.y+bend} ${end}`:`M${start} L${end}`;}
      } else if(a.x===b.x){
        const direction=Math.sign(b.y-a.y);start=[a.x,a.y+direction*36];end=[b.x,b.y-direction*36];const bend=reciprocal?(direction>0?48:-48):0;d=bend?`M${start} C${a.x+bend},${start[1]+direction*40} ${b.x+bend},${end[1]-direction*40} ${end}`:`M${start} L${end}`;
      } else {
        const direction=Math.sign(b.x-a.x);start=[a.x+direction*120,a.y];end=[b.x-direction*120,b.y];const mid=(start[0]+end[0])/2+(reciprocal?(direction>0?25:-25):0);d=`M${start} C${mid},${a.y} ${mid},${b.y} ${end}`;
      }
      return {...edge,d,start,end};
    });
    return {nodes,paths,width:1060,height:bottom+85,finding};
  }
  function create({data,research,events,copy,onItem,onEvent,onTrace,onSection,onFinding}) {
    const items=new Map(['controllers','relationships','findings','improvements','questions','constraints','hazards','losses','systemic_factors'].flatMap(key=>(data[key]||[]).map(item=>[item.id,{...item,collection:key}])));
    const eventIndex=new Map(events.map(event=>[event.id,event]));
    let findingId='F06',selectedLink='R11',selectedQuestion='Q04',selectedChange=null,selectedRequirement=null;
    const cite = sources => [...new Map((sources||[]).map(source=>[source.url,source])).values()].map((source,i)=>`<a class="cw-cite" href="${escape(source.url)}" target="_blank" rel="noopener noreferrer" title="${escape(source.locator||'Source')}" aria-label="Source ${i+1}: ${escape(source.locator||source.source_id||'Primary account')}">${['i','ii','iii','iv','v','vi'][i]||i+1}</a>`).join('');
    const list = value => `<ul>${(Array.isArray(value)?value:[value]).filter(Boolean).map(line=>`<li>${escape(line)}</li>`).join('')}</ul>`;
    function selected(id) {
      if(findingId===id)return;
      findingId=id;selectedLink=startingLinks[id];selectedQuestion=startingQuestions[id];selectedChange=null;selectedRequirement=null;
    }
    function inspectHTML() {
      const item=items.get(selectedLink);
      if(!item)return '';
      const role=item.collection==='controllers';
      return `<div class="cw-inspect-head"><h4>${escape(item.title)}</h4><button data-cw-source-item="${escape(item.id)}" aria-label="Read the full record for ${escape(item.title)}">Full record ${arrow}</button></div>
        ${role?`<p class="cw-label">Role in the control structure</p>${list(item.responsibilities)}<h5>Information available</h5>${list(item.known_feedback)}${item.unknowns?.length?`<div class="cw-note"><b>Unresolved /</b> ${escape(item.unknowns.join(' '))}</div>`:''}`:
        `<p class="cw-label ${escape(item.status)}">${escape(typeName[item.type])} <span>/</span> ${escape(stateName[item.status])}</p><p>${escape(item.details||item.summary)}</p><div class="cw-note"><b>Basis /</b> ${item.source_evidence?.length?`The source describes this relationship.${cite(item.source_evidence)}`:'The historical relationship has not been established in the linked public evidence.'}</div>`}`;
    }
    function questionHTML() {
      const q=items.get(selectedQuestion),update=research.question_updates.find(item=>item.question_id===q.id);
      return `<div class="cw-inspect-head"><h4>${escape(q.question)}</h4><span class="cw-id">${escape(q.id)}</span></div>
        <p>${escape(update?.summary || 'This question remains open in the public record.')}</p><h5>The evidence needed</h5><p>${escape(questionCopy[q.id]?.[0]||sentence(q.requested_evidence))}</p>
        <div class="cw-note"><b>Why it matters /</b> ${escape(questionCopy[q.id]?.[1]||sentence(q.value))}</div><button class="cw-text-button" data-cw-source-item="${q.id}">Where to seek it, and how to test it ${arrow}</button>`;
    }
    function changeHTML() {
      const original=items.get(selectedChange);
      const change=original&&{...original,...changeCopy[original.id]};
      if(!change)return '<p>No change is linked to this part of the analysis.</p>';
      const proposed=change.kind==='analyst_proposal';
      return `<div class="cw-change-title"><div><p class="cw-label">${proposed?'Proposed change':'Reported change'}</p><h4>${escape(change.title)}</h4></div>${proposed?`<div class="cw-strength" aria-label="Illustration of a proposed stronger protection, not assessed performance">${glyph}</div>`:''}</div><p>${escape(change.summary)}</p>
        <div class="cw-note"><b>${proposed?'How it could be tested':'What would verify it'} /</b> ${escape(change.verification)}</div><div class="cw-note"><b>Still unresolved /</b> ${escape(change.limitations)}</div><div class="cw-owner"><span>${proposed?'Who could make the change':'Reported responsible roles'}</span><strong>${escape(change.owner_role)}</strong></div>
        <button class="cw-text-button" data-cw-source-item="${escape(change.id)}">${proposed?'Read the proposal':'Read the supporting record'} ${arrow}</button>`;
    }
    function requirementHTML() {
      const item=items.get(selectedRequirement);if(!item)return '';
      const hazards=(item.hazard_ids||[]).map(id=>items.get(id)).filter(Boolean);
      const losses=[...new Set(hazards.flatMap(item=>item.loss_ids||[]))].map(id=>items.get(id));
      return `<h4>${escape(item.title)}</h4><p>${escape(item.summary)}</p><p class="cw-note"><b>Proposed requirement /</b> This is the analysis’s safety requirement. It is not evidence of a documented incident-time rule or a working barrier.</p><div class="cw-hazards"><h5>Hazardous conditions this requirement addresses</h5>${hazards.map(hazard=>`<button data-cw-source-item="${hazard.id}">${escape(hazard.title)} ${arrow}</button>`).join('')}</div><h5>Losses it aims to prevent</h5><div class="cw-losses">${losses.map(loss=>`<button data-cw-source-item="${loss.id}"><span>${escape(loss.title)}</span><small>${/potential/.test(loss.status)?'Potential consequence':'Reported loss'}</small></button>`).join('')}</div>`;
    }
    function graphHTML() {
      const model=diagramModel(data,findingId);
      const marker=id=>`<marker id="${id}" markerWidth="7" markerHeight="7" refX="6.5" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L7 3.5L0 7Z" fill="context-stroke"/></marker>`;
      return `<div class="cw-map-wrap" tabindex="0" aria-label="Scrollable control map"><svg class="cw-map" viewBox="0 0 ${model.width} ${model.height}" role="group" aria-label="Selected control relationships for ${escape(copy[findingId].question)}"><defs>${marker('cw-arrow')}</defs>
        ${model.paths.map(edge=>`<g class="cw-path ${edge.type} ${edge.status} ${selectedLink===edge.id?'selected':''}" data-cw-edge="${edge.id}"><path class="cw-route" d="${edge.d}" marker-end="url(#cw-arrow)"/><path class="cw-hit" d="${edge.d}" data-cw-inspect="${edge.id}" aria-pressed="${selectedLink===edge.id}" tabindex="0" role="button" aria-label="${escape(edge.label+'. '+stateName[edge.status]+'. '+typeName[edge.type])}"><title>${escape(edge.label)}</title></path></g>`).join('')}
        ${model.nodes.map(node=>{const words=shortNames[node.id].split(' '),title=words.length>2?[words.slice(0,2).join(' '),words.slice(2).join(' ')]:[shortNames[node.id]];return `<g class="cw-node ${selectedLink===node.id?'selected':''}" transform="translate(${node.x-120} ${node.y-36})" data-cw-inspect="${node.id}" aria-pressed="${selectedLink===node.id}" tabindex="0" role="button" aria-label="${escape(items.get(node.id).title)}"><rect width="240" height="72" rx="8"/>${title.map((line,i)=>`<text x="120" y="${title.length===1?42:32+i*22}" text-anchor="middle">${escape(line)}</text>`).join('')}${node.id==='CT14'?'<text class="cw-node-unknown" x="227" y="18">?</text>':''}</g>`;}).join('')}</svg></div><p class="cw-map-hint">Swipe across the control map.</p>
        <div class="cw-map-key">${[['control_action','Control action',''],['feedback','Feedback','feedback'],['coordination','Coordination','coordination']].filter(([type])=>model.paths.some(edge=>edge.type===type)).map(([,label,style])=>`<span><i class="${style}"></i>${label}</span>`).join('')}${model.paths.some(edge=>edge.status==='reported_omission')?'<span><i class="gap"></i>Reported gap</span>':''}</div>
        <div class="cw-relationship-list" role="group" aria-label="Relationships in this view">${model.paths.map(edge=>`<button data-cw-inspect="${edge.id}" aria-pressed="${selectedLink===edge.id}" class="${edge.status}">${edge.status==='reported_omission'?'<span class="cw-gap" aria-hidden="true"></span>':''}${escape(edge.label)}${edge.status==='unknown'?'<small>Unresolved</small>':''}</button>`).join('')}</div>`;
    }
    function html(id,origin) {
      selected(id);const finding=items.get(findingId),reader=copy[findingId];
      const changes=data.improvements.filter(item=>item.addresses_finding_ids.includes(findingId));
      if(!changes.some(item=>item.id===selectedChange))selectedChange=(changes.find(item=>item.kind==='analyst_proposal')||changes[0])?.id;
      if(!finding.constraint_ids.includes(selectedRequirement))selectedRequirement=finding.constraint_ids[0];
      const factors=data.systemic_factors.filter(item=>item.finding_ids?.includes(findingId));
      const resilience=durability[findingId];
      return `<div class="cw-workbench" data-cw-finding="${findingId}"><header class="cw-heading"><h2>Investigate</h2><p>Follow the controls behind the incident.</p><button data-cw-section="paper">Read the full analysis ${arrow}</button></header>
        <nav class="cw-topics" aria-label="Investigation questions">${topics.map(([key,label])=>`<button data-cw-finding="${key}" aria-pressed="${findingId===key}">${escape(label)}</button>`).join('')}</nav>
        <article class="cw-case"><header class="cw-case-head"><p class="cw-label">OpenAI and Hugging Face <span>/</span> CAST analysis of the public accounts</p><h3>${escape(reader.question)}</h3><p>${escape(reader.reported)}<span class="cw-citations">${cite(finding.source_evidence)}</span></p><div class="cw-note"><b>Caveat /</b> ${escape(finding.context)}</div>${origin?`<button class="cw-text-button cw-origin" data-cw-event="${escape(origin)}">Return to ${escape(eventIndex.get(origin)?.title||origin)} ${arrow}</button>`:''}</header>
        <section class="cw-control-section"><div class="cw-section-head"><h4>Who could act, and what reached them?</h4><button data-cw-section="structure">Full control structure ${arrow}</button></div>${graphHTML()}<div class="cw-inspector" data-cw-panel="inspect">${inspectHTML()}</div>
          <p class="cw-caption">Select a role or a connection. This map shows control and information relationships across the relevant episodes. It does not assign a causal effect to each arrow.${findingId==='F10'?' These are selected relationships. The full structure includes the other roles.':''}</p></section>
        <section class="cw-analysis"><div><h4>Why could this happen?</h4><p>${escape(reader.meaning)}</p><h5>Explanations still to distinguish</h5>${list(finding.alternative_explanations)}${factors.length?`<div class="cw-systemic"><h5>Across the system</h5>${factors.map(item=>`<button data-cw-source-item="${item.id}">${escape(item.title)} ${arrow}</button>`).join('')}</div>`:''}</div>
        <div class="cw-evidence-question"><h4>What would settle it?</h4><div class="cw-question-choices" role="group" aria-label="Open evidence questions">${finding.question_ids.map(id=>`<button data-cw-question="${id}" aria-pressed="${selectedQuestion===id}">${escape(items.get(id).title)}</button>`).join('')}</div><div data-cw-panel="question">${questionHTML()}</div></div></section>
        <section class="cw-requirements"><h4>What must the controls achieve?</h4><div class="cw-requirement-choices" role="group" aria-label="Safety requirements">${finding.constraint_ids.map(id=>`<button data-cw-requirement="${id}" aria-pressed="${selectedRequirement===id}">${glyph}${escape(items.get(id).title)}</button>`).join('')}</div><div data-cw-panel="requirement">${requirementHTML()}</div></section>
        <section class="cw-future"><div class="cw-durability"><p class="cw-label">${escape(resilience[0])}</p><h4>Would the protection hold?</h4><p>${escape(resilience[1])}</p><div class="cw-note"><b>What would test that /</b> ${escape(resilience[2])}</div><p class="cw-caption">A question about stronger AI and changed conditions. The historical account does not establish the answer.</p></div>
          <div class="cw-change"><div class="cw-change-choices" role="group" aria-label="Reported changes and proposals">${changes.map(item=>`<button data-cw-change="${item.id}" aria-pressed="${selectedChange===item.id}"><small>${item.kind==='reported_actual'?'Reported':'Proposed'}</small>${escape(item.title)}</button>`).join('')}</div><div data-cw-panel="change">${changeHTML()}</div></div></section>
        <section class="cw-records"><div class="cw-section-head"><h4>Back to the evidence</h4><div><button data-cw-trace="stream">Event-swarm ${arrow}</button><button data-cw-trace="bowtie">Bow-tie ${arrow}</button></div></div><div class="cw-event-list">${finding.event_ids.map(id=>`<button data-cw-event="${id}"><small>${id}</small>${escape(eventIndex.get(id)?.title||id)}</button>`).join('')}</div><p class="cw-caption">Several entries can come from the same passage. Their number does not measure independent corroboration.</p></section>
        </article><footer class="cw-research"><p>CAST examines the incident’s losses, the control structure, and each component’s actions in context. It also examines failures across the system and follows proposed changes through implementation and verification. This public-source analysis remains provisional.<a class="cw-cite" href="${escape(data.method.url)}" target="_blank" rel="noopener noreferrer" aria-label="CAST Handbook">i</a></p><nav aria-label="Investigation research">${[['paper','Full analysis'],['evidence','Collected evidence'],['questions','Open questions'],['changes','All changes'],['scope','Method and scope']].map(([key,label])=>`<button data-cw-section="${key}">${label} ${arrow}</button>`).join('')}</nav></footer></div>`;
    }
    function bind(container) {
      const action = (selector,fn) => container.querySelectorAll(selector).forEach(button=>button.addEventListener('click',()=>fn(button)));
      const refresh = (panel,content) => {const target=container.querySelector(`[data-cw-panel="${panel}"]`);target.innerHTML=content;bindRecords(target);};
      function bindRecords(target){target.querySelectorAll('[data-cw-source-item]').forEach(button=>button.addEventListener('click',()=>onItem(button.dataset.cwSourceItem)));}
      bindRecords(container);
      action('button[data-cw-finding]',button=>onFinding(button.dataset.cwFinding));
      action('[data-cw-section]',button=>onSection(button.dataset.cwSection));
      action('[data-cw-event]',button=>onEvent(button.dataset.cwEvent,findingId));
      action('[data-cw-trace]',button=>onTrace(findingId,button.dataset.cwTrace));
      function inspect(button){selectedLink=button.dataset.cwInspect;container.querySelectorAll('[data-cw-inspect]').forEach(item=>{const on=item.dataset.cwInspect===selectedLink;item.setAttribute('aria-pressed',on);if(!item.matches('button'))item.classList.toggle('selected',on);});container.querySelectorAll('[data-cw-edge]').forEach(item=>item.classList.toggle('selected',item.dataset.cwEdge===selectedLink));refresh('inspect',inspectHTML());}
      action('[data-cw-inspect]',inspect);
      container.querySelectorAll('svg [data-cw-inspect]').forEach(button=>button.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();inspect(button);}}));
      for(const [name,set,render] of [['question',id=>selectedQuestion=id,questionHTML],['change',id=>selectedChange=id,changeHTML],['requirement',id=>selectedRequirement=id,requirementHTML]]) {
        action(`[data-cw-${name}]`,button=>{const id=button.getAttribute(`data-cw-${name}`);set(id);container.querySelectorAll(`[data-cw-${name}]`).forEach(item=>item.setAttribute('aria-pressed',item===button));refresh(name,render());});
      }
    }
    return {html,bind};
  }
  root.HaruspexWorkbench={create,diagramModel,topics};
})(typeof window==='undefined'?globalThis:window);
