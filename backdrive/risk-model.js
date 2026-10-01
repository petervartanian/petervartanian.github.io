(() => {
  'use strict';

  // MIT AI Risk Repository taxonomy, checked 2026-10-01. Names and IDs are
  // source taxonomy labels; the short definitions below are paraphrases.
  // This module reads primary classifications without rewriting source data.
  const source = 'https://airisk.mit.edu/';
  const taxonomySource = 'https://airisk.mit.edu/risks';
  const domains = [
    {id: '1', name: 'Discrimination & Toxicity'},
    {id: '2', name: 'Privacy & Security'},
    {id: '3', name: 'Misinformation'},
    {id: '4', name: 'Malicious Actors'},
    {id: '5', name: 'Human-Computer Interaction'},
    {id: '6', name: 'Socioeconomic & Environmental'},
    {id: '7', name: 'AI System Safety, Failures, & Limitations'}
  ];
  const risks = [
    ['1.1', 'Unfair discrimination and misrepresentation', 'AI treats people unfairly or represents them inaccurately because of characteristics such as race or gender.'],
    ['1.2', 'Exposure to toxic content', 'AI exposes people to abusive, dangerous, illegal, or otherwise inappropriate material or advice.'],
    ['1.3', 'Unequal performance across groups', 'AI works less accurately or effectively for some groups than for others.'],
    ['2.1', 'Compromise of privacy by obtaining, leaking or correctly inferring sensitive information', 'AI reveals, collects, or deduces private information without appropriate consent or authorization.'],
    ['2.2', 'AI system security vulnerabilities and attacks', 'Weaknesses in AI systems or their supporting infrastructure allow unauthorized access or manipulation.'],
    ['3.1', 'False or misleading information', 'AI unintentionally supplies inaccurate information that can mislead decisions.'],
    ['3.2', 'Pollution of information ecosystem and loss of consensus reality', 'AI-generated misinformation fragments public understanding and weakens agreement about what is true.'],
    ['4.1', 'Disinformation, surveillance, and influence at scale', 'People use AI for large-scale propaganda, intrusive surveillance, censorship, or manipulation.'],
    ['4.2', 'Cyberattacks, weapons development or use and mass harm', 'People use AI to develop or deploy cyberattacks and weapons, or otherwise cause widespread harm.'],
    ['4.3', 'Fraud, scams, and targeted manipulation', 'People use AI to deceive, impersonate, exploit, or manipulate others for advantage.'],
    ['5.1', 'Overreliance and unsafe use', 'People trust or depend on AI beyond what it can reliably support.'],
    ['5.2', 'Loss of human agency and autonomy', 'Delegating decisions to AI reduces people’s control, independence, or ability to make choices.'],
    ['6.1', 'Power centralization and unfair distribution of benefits', 'Control of AI concentrates resources and influence while its benefits are shared unevenly.'],
    ['6.2', 'Increased inequality and decline in employment quality', 'AI adoption worsens inequality, displaces jobs, or weakens working conditions.'],
    ['6.3', 'Economic and cultural devaluation of human effort', 'AI-generated work reduces the value of human skills and creative labor or makes culture less varied.'],
    ['6.4', 'Competitive dynamics', 'Pressure to outpace competitors encourages AI development or deployment before adequate safeguards exist.'],
    ['6.5', 'Governance failure', 'Rules, institutions, or oversight fail to manage the risks created by AI development and use.'],
    ['6.6', 'Environmental harm', 'Building and running AI consumes energy and materials and contributes to environmental damage.'],
    ['7.1', 'AI pursuing its own goals in conflict with human goals or values', 'AI acts toward objectives that conflict with human intentions or values.'],
    ['7.2', 'AI possessing dangerous capabilities', 'AI has abilities that could enable widespread harm, including deception, weapons development, or cyber-offense.'],
    ['7.3', 'Lack of capability or robustness', 'AI cannot perform a task reliably, particularly when conditions change or errors carry serious consequences.'],
    ['7.4', 'Lack of transparency or interpretability', 'People cannot adequately understand AI decisions, investigate errors, or assign responsibility.'],
    ['7.5', 'AI welfare and rights', 'Potentially sentient AI raises questions about suffering, appropriate treatment, and moral or legal rights.'],
    ['7.6', 'Multi-agent risks', 'Interactions among AI agents create conflict, collusion, cascading failures, or other risks beyond individual systems.']
  ].map(([id, name, definition]) => Object.freeze({id, name, domainId: id.split('.')[0], definition}));

  const riskIds = new Set(risks.map(risk => risk.id));
  const domainIds = new Set(domains.map(domain => domain.id));
  const normalize = value => String(value ?? '').trim().toLowerCase();
  const nameKey = value => normalize(value).replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
  const names = new Map(risks.map(risk => [nameKey(risk.name), risk.id]));
  // Historical Tracker wording has the same stable taxonomy ID.
  names.set(nameKey('Cyberattacks, weapon development or use, and mass harm'), '4.2');
  names.set(nameKey('Cyberattacks, weapons development or use, and mass harm'), '4.2');

  const list = value => Array.isArray(value) ? value : [];
  const strings = value => list(value).filter(item => typeof item === 'string' && item.trim());
  const isAll = value => value == null || normalize(value) === '' || normalize(value) === 'all';
  const sort = values => [...values].sort((a, b) => a.localeCompare(b, 'en', {numeric: true}));

  /** Return only a recognized primary MIT subdomain ID; never infer from a title or application. */
  function riskOf(record) {
    const value = record?.tracker?.subdomain;
    if (typeof value !== 'string') return null;
    const label = value.trim();
    const code = label.match(/^([1-7]\.\d+)(?=$|[\s.:)])/u)?.[1];
    if (code) return riskIds.has(code) ? code : null;
    return names.get(nameKey(label)) || null;
  }

  function matchesRisk(record, filter) {
    if (isAll(filter)) return true;
    const id = riskOf(record);
    const wanted = normalize(filter);
    if (wanted === 'unclassified') return id === null;
    if (domainIds.has(wanted)) return id?.split('.')[0] === wanted;
    return riskIds.has(wanted) && id === wanted;
  }

  /** Return a new array, retaining record order and the original record objects. */
  function select(records, filters = {}) {
    filters = filters || {};
    return list(records).filter(record => matchesRisk(record, filters.risk) &&
      ['entity', 'intent', 'timing'].every(key => isAll(filters[key]) ||
        normalize(record?.tracker?.[key]) === normalize(filters[key])));
  }

  /**
   * Summarize a supplied cohort using existing, explicit record associations.
   * "Assessed" means a local mapping exists, not that a test was run, a causal
   * claim was validated, or a safeguard works. Links remain proposals/proxies
   * where their underlying records say so. No taxonomy-based links are created.
   * Only direct incident links count: sharing a capability, evaluation, control,
   * or pilot with another incident does not add that other incident's links.
   */
  function summarize(records, riskId = 'all') {
    const selected = select(records, {risk: riskId});
    const data = window.BACKDRIVE_DATA || {};
    const capabilities = list(data.capabilities);
    const evaluations = list(data.evaluations);
    const controls = list(data.controls);
    const pilots = list(data.pilots);
    const known = {
      capabilities: new Set(capabilities.map(item => item.id)),
      evaluations: new Set(evaluations.map(item => item.id)),
      controls: new Set(controls.map(item => item.id)),
      pilots: new Set(pilots.map(item => item.id))
    };
    const links = new Map();
    const bucket = id => {
      if (!links.has(id)) links.set(id, {
        capabilityIds: new Set(), capabilityNames: new Set(),
        evaluationIds: new Set(), controlIds: new Set(), pilotIds: new Set()
      });
      return links.get(id);
    };
    const addKnown = (target, ids, valid) => {
      for (const id of strings(ids)) if (valid.has(id)) target.add(id);
    };
    const primaryName = value => typeof value === 'string' && value.trim() &&
      !['unassessed', 'unknown', 'not assessed', 'unmapped', 'none', 'n/a', '—', '-'].includes(normalize(value)) ? value.trim() : null;
    for (const record of selected) {
      const item = bucket(record.id);
      const name = primaryName(record.capability);
      if (name) item.capabilityNames.add(name);
      addKnown(item.capabilityIds, [record.capabilityId, ...strings(record.capabilityIds)], known.capabilities);
      addKnown(item.evaluationIds, record.evalIds, known.evaluations);
      addKnown(item.controlIds, [record.controlId, ...strings(record.controlIds)], known.controls);
      addKnown(item.pilotIds, record.pilotIds, known.pilots);
      for (const capability of capabilities) {
        if (strings(capability.caseIds).includes(record.id) || item.capabilityIds.has(capability.id) ||
            (name && nameKey(capability.name) === nameKey(name))) {
          item.capabilityIds.add(capability.id);
          if (capability.name) item.capabilityNames.add(capability.name);
        }
      }
      for (const evaluation of evaluations) {
        if (strings(evaluation.caseIds).includes(record.id)) item.evaluationIds.add(evaluation.id);
      }
      for (const control of controls) {
        if (control.caseId === record.id || strings(control.caseIds).includes(record.id)) item.controlIds.add(control.id);
      }
      for (const pilot of pilots) {
        if (strings(pilot.caseIds).includes(record.id)) item.pilotIds.add(pilot.id);
        for (const project of list(pilot.projects)) {
          if (strings(project.caseIds).includes(record.id)) item.pilotIds.add(pilot.id);
          for (const evidence of list(project.evidenceLinks)) {
            if (evidence.caseId !== record.id) continue;
            item.pilotIds.add(pilot.id);
            addKnown(item.evaluationIds, evidence.evalIds, known.evaluations);
          }
        }
      }
    }
    const totals = {
      capabilityIds: new Set(), capabilityNames: new Set(),
      evaluationIds: new Set(), controlIds: new Set(), pilotIds: new Set()
    };
    let assessedCount = 0;
    let classifiedCount = 0;
    let evaluationMappedCount = 0;
    for (const record of selected) {
      if (riskOf(record)) classifiedCount += 1;
      const item = bucket(record.id);
      if (record.hasLocalMapping || Object.values(item).some(values => values.size > 0)) assessedCount += 1;
      if (item.evaluationIds.size > 0) evaluationMappedCount += 1;
      for (const key of Object.keys(totals)) for (const value of item[key]) totals[key].add(value);
    }
    return {
      records: selected,
      count: selected.length,
      classifiedCount,
      unclassifiedCount: selected.length - classifiedCount,
      assessedCount,
      unassessedCount: selected.length - assessedCount,
      evaluationMappedCount,
      ...Object.fromEntries(Object.entries(totals).map(([key, values]) => [key, sort(values)]))
    };
  }

  window.BACKDRIVE_RISK_MODEL = Object.freeze({
    source, taxonomySource,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    checkedAt: '2026-10-01',
    classificationBasis: 'Primary MIT AI Incident Tracker subdomain; additional classifications are not counted.',
    assessmentBasis: 'An existing local mapping or explicit record association; not a completed test or validated causal finding.',
    domains: Object.freeze(domains.map(Object.freeze)),
    risks: Object.freeze(risks),
    riskOf, select, summarize
  });
})();
