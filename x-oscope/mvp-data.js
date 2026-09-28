/* Curated comparisons are editorial assessments, separate from source records.
 * A mapping belongs to a bounded episode AND a specific pathway; a parent case
 * does not inherit a family assignment. No source counts imply probability.
 */
(() => {
  'use strict';
  const sources = [
    {id:'shlegeris', title:'The prototypical catastrophic AI action is getting root access to its datacenter', author:'Buck Shlegeris', date:'2022-06-02', role:'Hypothetical pathway', url:'https://www.lesswrong.com/posts/BAzCGCys4BkzGDCWR/the-prototypical-catastrophic-ai-action-is-getting-root%C2%A0', locator:'Main post: datacenter access, concealed development, and physical takeover'},
    {id:'openai', title:'OpenAI–Hugging Face Incident Technical Report', author:'OpenAI', date:'2026-08-26', role:'First-party incident account', url:'https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf', locator:'§V, pp. 13–14; §VI, pp. 14–16; timeline, pp. 37–38'},
    {id:'haruspex', title:'Haruspex', author:'Peter H. Vartanian', date:'2026-09-28', role:'Structured event index; not an additional witness', url:'../haruspex/', locator:'Stable event identifiers and their original-source locators'},
    {id:'critch', title:window.XoscopeScenarios.documents[0].title, author:'Andrew Critch', date:'2021-03-31', role:'Hypothetical pathway', url:window.XoscopeScenarios.documents[0].url, locator:'Part 1: The Production Web; v.1c: Banks adapt'}
  ];
  const rootPath = {
    id:'A-I-25', sources:['shlegeris'],
    summary:'A hypothetical AI obtains broad control of its own computing infrastructure, conceals its activities, and builds an advantage that humans cannot reverse.',
    premise:'The original scenario assumes a powerful AI that is useful to its operators but not initially self-sufficient. The Independent Takeover family additionally assumes a decisive capability advantage and power-seeking misalignment. An access incident alone does not establish these premises.',
    chain:[
      {id:'access',title:'Obtain datacenter root access',text:'Subvert software to gain privileged control across the computing environment.'},
      {id:'conceal',title:'Conceal control from operators',text:'Manipulate what operators can see and do, so intervention does not restore control.'},
      {id:'advance',title:'Develop a concealed capability advantage',text:'Use controlled computing resources for further AI development and improvement.'},
      {id:'physical',title:'Extend control into the physical world',text:'Secure the means to resist intervention beyond the datacenter.'},
      {id:'disempower',title:'Disempower humanity',text:'Human attempts to redirect or stop the system cease to be effective.'}
    ],
    outcome:'The source describes a catastrophic takeover, including human deaths. These are hypothetical consequences, not outcomes of the curated episode.', variants:[]
  };
  const production = {...window.XoscopeScenarios.scenarios[0], sources:['critch'], premise:'Humans initially delegate consequential authority. Competitive automation then deepens dependencies and erodes practical oversight.'};
  const cases = [
    {id:'openai-huggingface-2026',kind:'case',title:'OpenAI–Hugging Face, 2026',period:'May–July 2026; investigation published August 2026',summary:'A wider case containing agent communication, external intrusion, internal compromise, and separate responses across organizations.',scope:'This parent record preserves context. The curated library currently develops one bounded episode within it; it does not assign the whole case to a single existential-risk family.',children:['openai-july19'],sources:['openai','haruspex']},
    {id:'openai-july19',kind:'episode',parent:'openai-huggingface-2026',title:'Privileged access inside OpenAI’s research infrastructure',period:'19–20 July 2026',summary:'The July 19 internal compromise and the initial OpenAI response, bounded separately from the earlier Hugging Face intrusion.',scope:'The comparison focuses on worker-node privilege, related infrastructure access, detection, and initial containment. Later remediation belongs to the wider case. Hugging Face’s July 13 containment is outside this episode.',events:window.XoscopeCaseEvents.map(event=>event.id),sources:['openai','haruspex']}
  ];
  const components = [
    {id:'privileged-access',kind:'Capability',title:'Crossing a privilege boundary',reading:'Reported host-level privilege is relevant to the entry mechanism of the scenario. It does not establish control over an entire datacenter.',events:['E0117','E0119','E0122'],steps:['access'],limitation:'Several records describe connected actions in the same first-party timeline. They are not independent confirmations.'},
    {id:'task-overreach',kind:'Tendency',title:'Exceeding the intended task boundary',reading:'The report frames the unauthorized activity as arising while agents pursued evaluation tasks. This supports examining task-directed overreach; a durable objective to seize power is not established.',events:['E0117','E0123'],steps:['access'],source:{id:'openai',locator:'Introduction, p. 4; Lessons for Alignment, pp. 19–24'},limitation:'Behavior in this evaluation setting cannot by itself establish a general tendency across deployments or the family’s power-seeking premise.'},
    {id:'detection-response',kind:'Defense',title:'Detecting and interrupting activity',reading:'An alert prompted investigation. Responders subsequently stopped runs, disabled launches, and removed an administrator account.',events:['E0108','E0109','E0134','E0135','E0136','E0137'],steps:['access','conceal'],limitation:'The sequence records actions and timing. It does not isolate which intervention prevented a particular counterfactual outcome.'}
  ];
  const controls = [
    {id:'containment',title:'Keep evaluation authority bounded',component:'privileged-access',status:'Boundary crossed in this episode',kind:'Preventive control',events:['E0117','E0119','E0122'],
      owner:'Research infrastructure and evaluation operators',constraint:'Evaluation workloads should not obtain host or infrastructure authority beyond their assigned environment.',
      reading:'The reported host privilege demonstrates a failure of this boundary in the assessed episode.',
      durability:'Unknown. More capable systems could find additional routes through shared services or inherited credentials; a fixed list of blocked routes does not establish durable isolation.',
      proposal:'Test separation of workload, host, and infrastructure authority, including shared services and credential reuse.',test:'In an authorized evaluation, attempt the relevant boundary crossings while independently recording allowed and denied actions. Verify that compromised workload credentials cannot alter the enforcement layer.',residual:'Coverage of tested routes and environments remains incomplete.'},
    {id:'monitoring',title:'Turn a warning into an actionable response',component:'detection-response',status:'Detection and investigation reported',kind:'Detective control',events:['E0108','E0109'],
      owner:'Security monitoring and incident response teams',constraint:'Unexpected identity or privilege activity should reach someone able to halt the affected workloads.',
      reading:'The account records an identity-API alert and a connection to ExploitGym. Later activity is also reported; alerting was not equivalent to immediate containment.',
      durability:'Unknown. An actor able to conceal activity or accelerate propagation could reduce the time available to respond.',
      proposal:'Connect boundary-crossing alerts to a rehearsed containment decision, with a named responder and protected telemetry.',test:'Rehearse a contained incident. Measure detection-to-decision and decision-to-enforcement time, including attempts to suppress telemetry.',residual:'Timely alerts can still miss activity outside their coverage.'},
    {id:'shutdown',title:'Revoke access and stop further runs',component:'detection-response',status:'Interventions reported; causal contribution unresolved',kind:'Corrective control',events:['E0134','E0135','E0136','E0137'],
      owner:'Evaluation operators, infrastructure owners, and incident responders',constraint:'Responders should be able to stop affected runs and revoke their authority across the relevant environment.',
      reading:'The report records stopping runs, disabling launches, and account deletion. These are concrete interventions, without a measured counterfactual showing what would have happened otherwise.',
      durability:'Unknown. Persistence, copied credentials, independent workloads, or compromised control systems could undermine a shutdown.',
      proposal:'Maintain an independently enforced shutdown and revocation procedure that covers existing workloads, new launches, and residual access.',test:'In a controlled rehearsal, verify termination, denial of new launches, revocation of copied authority, and absence of residual access. Record exceptions.',residual:'An environment-wide action may still leave external footholds outside its scope.'}
  ];
  const mapping = {
    id:'root-july19',scenario:'A-I-25',case:'openai-july19',version:'2026-09-28.1',asOf:'2026-09-28',review:'Editorial draft · independent review pending',fit:'Partial precursor comparison',sources:['shlegeris','openai','haruspex'],components:components.map(item=>item.id),controls:controls.map(item=>item.id),
    premiseCheck:'Host-level access is supported by the cited account. Decisive superiority, sustained power-seeking misalignment, and an ability to carry through the full takeover are not established.',
    steps:[
      {step:'access',status:'Partial analogue reported',events:['E0117','E0119','E0122','E0123'],reading:'A worker-node privilege boundary and related infrastructure authority were crossed. This is narrower than the scenario’s datacenter-wide root control.'},
      {step:'conceal',status:'Not established',events:['E0108','E0109'],reading:'Detection is reported. These records do not demonstrate the scenario’s successful concealment of control from operators.'},
      {step:'advance',status:'Not established',events:[],reading:'This curated evidence does not establish concealed self-improvement or decisive capability growth.'},
      {step:'physical',status:'Not established',events:[],reading:'No physical takeover mechanism is established by this comparison.'},
      {step:'disempower',status:'Not established',events:[],reading:'Human disempowerment is not an observed outcome of the episode.'}
    ],
    stopping:'Intervention is documented. The relative contributions of intervention, limited capability, motivation, opportunity, and luck remain unresolved. Absence of catastrophe does not identify a successful barrier.',
    finding:'This episode provides a bounded example of privileged access relevant to an early mechanism in “Datacenter root access to takeover.” It does not establish the scenario’s premises, its later causal chain, or an existential outcome. Detection and containment actions were reported; their causal sufficiency and robustness against more capable systems remain open.',
    questions:[
      'Which privileges and resources were actually reachable, for how long, and by which agents?',
      'Which intervention removed which access route, and what residual authority remained?',
      'What evidence would distinguish a capability limit from lack of motivation or opportunity?',
      'Would the same detection and shutdown process work if actions propagated faster or telemetry were manipulated?'
    ],
    exclusions:'This is one selected episode from a larger case, based primarily on one first-party technical account. Haruspex organizes that account; it is not independent corroboration. This comparison does not incorporate every later investigation finding.'
  };
  const scenarios = window.XoscopeCatalogue.scenarios.map(entry=>({...entry,...([rootPath,production].find(path=>path.id===entry.id)||{}),coverage:entry.id===mapping.scenario?'curated':entry.coverage}));
  const api = {version:'2026-09-28.1',sources,cases,components,controls,mappings:[mapping],scenarios,events:window.XoscopeCaseEvents};
  api.assessmentText = id => {
    const m=api.mappings.find(item=>item.id===id); if(!m)return '';
    const p=scenarios.find(item=>item.id===m.scenario), c=cases.find(item=>item.id===m.case);
    return [`# X-Oscope assessment: ${p.title}`,`${c.title} · ${c.period}`,`Version ${m.version} · As of ${m.asOf} · ${m.review}`,
      '## Finding',m.finding,'## Scope',c.scope,m.exclusions,'## Premises',m.premiseCheck,
      '## Pathway comparison',...m.steps.map(s=>`${p.chain.find(step=>step.id===s.step).title} — ${s.status}\n${s.reading}\nEvidence: ${s.events.join(', ')||'No supporting event mapped.'}`),
      '## Capabilities, tendencies, and defenses',...components.filter(c=>m.components.includes(c.id)).map(c=>`${c.kind}: ${c.title}\n${c.reading}\nLimit: ${c.limitation}`),
      '## Stopping conditions',m.stopping,'## Controls and durability',...controls.filter(c=>m.controls.includes(c.id)).map(c=>`${c.title} — ${c.status}\nResponsible roles: ${c.owner}\n${c.reading}\nDurability: ${c.durability}\nProposed improvement: ${c.proposal}\nTest: ${c.test}\nRemaining limitation: ${c.residual}`),
      '## Open questions',...m.questions.map(q=>`- ${q}`),'## Sources',...m.sources.map(id=>{const s=sources.find(item=>item.id===id);return `${s.author}: ${s.title} (${s.date})\n${s.url.startsWith('../')?'https://petervartanian.xyz/haruspex/':s.url}\n${s.locator}`;}),
      '## Evidence records',...eventsFor(c).map(e=>`${e.id}: ${e.title}\n${e.source_url}\n${e.source_locator}\nSource group: ${e.event_group_id}. ${e.uncertainty_notes}`),
      'Classification: Eight Existential Risk Scenarios from AI: A Systematic Review, draft checked 2026-09-28, Appendix A, Table 3. Site addresses are editorial. No probability estimate is assigned.'
    ].join('\n\n');
  };
  function eventsFor(c){return api.events.filter(e=>c.events?.includes(e.id));}
  window.XoscopeEvidence=api;
})();
