import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('./', import.meta.url);
const datasetPath = new URL('../outputs/haruspex-2026-09-09/haruspex-dataset.json', root);
const [template, styles, app, dataset, severity, visuals, ontology, query, temporal, fieldLayout, cast, castView, research, quotations, collectionMethod, airiLogo, arrival] = await Promise.all([
  readFile(new URL('index.template.html', root), 'utf8'),
  readFile(new URL('style.css', root), 'utf8'),
  readFile(new URL('app.js', root), 'utf8'),
  readFile(datasetPath, 'utf8').catch(() => readFile(new URL('haruspex-dataset.json', root), 'utf8')),
  readFile(new URL('severity-assessments.json', root), 'utf8'),
  readFile(new URL('visual-encodings.json', root), 'utf8'),
  readFile(new URL('incident-ontology.json', root), 'utf8'),
  readFile(new URL('query.js', root), 'utf8'),
  readFile(new URL('temporal-assessments.json', root), 'utf8'),
  readFile(new URL('field-layout.js', root), 'utf8'),
  readFile(new URL('cast-analysis.json', root), 'utf8'),
  readFile(new URL('cast-view.js', root), 'utf8'),
  readFile(new URL('research-expansion.json', root), 'utf8'),
  readFile(new URL('opening-quotations.json', root), 'utf8'),
  readFile(new URL('collection-method.json', root), 'utf8'),
  readFile(new URL('assets/mit-airi-official.svg', root), 'utf8'),
  readFile(new URL('arrival.js', root), 'utf8'),
]);
const fontsDir = new URL('assets/fonts/', root);
const fontFiles = (await readdir(fontsDir)).filter((name) => /^spectral-\d+-(normal|italic)\.woff2$/.test(name)).sort();
const fontFaces = (await Promise.all(fontFiles.map(async (name) => {
  const [, weight, style] = name.match(/^spectral-(\d+)-(normal|italic)\.woff2$/);
  const data = await readFile(new URL(name, fontsDir));
  return `@font-face{font-family:Spectral;font-style:${style};font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${data.toString('base64')}) format('woff2')}`;
}))).join('');
const parsed = JSON.parse(dataset);
const encodings = JSON.parse(visuals);
const incidentOntology = JSON.parse(ontology);
const assessments = JSON.parse(severity);
const temporalAssessments = JSON.parse(temporal);
const castAnalysis = JSON.parse(cast);
const researchExpansion = {...JSON.parse(research), collection_method: JSON.parse(collectionMethod)};
const openingQuotations = JSON.parse(quotations);
function requireValid(condition, message) {
  if (!condition) throw new Error(`Invalid incident data: ${message}`);
}
function uniqueIndex(items, key, label) {
  const index = new Map();
  items.forEach((item) => {
    const id = item[key];
    requireValid(typeof id === 'string' && id.length > 0, `${label} has a missing identifier.`);
    requireValid(!index.has(id), `${label} contains duplicate identifier ${id}.`);
    index.set(id, item);
  });
  return index;
}
const eventIndex = uniqueIndex(parsed.events, 'id', 'Events');
requireValid(eventIndex.size === 832 && parsed.events.every(event => Object.keys(event).length === 45), 'The canonical inventory must retain 832 records with 45 fields each.');
const castCollections = ['controllers','relationships','findings','improvements','questions','losses','hazards','constraints','systemic_factors'];
const castItems = castCollections.flatMap(key => castAnalysis[key]);
const castIndex = uniqueIndex(castItems, 'id', 'CAST items');
const controllerIds = new Set(castAnalysis.controllers.map(item => item.id));
const questionIds = new Set(castAnalysis.questions.map(item => item.id));
requireValid(questionIds.size === 16 && Array.from({length:16}, (_,i)=>`Q${String(i+1).padStart(2,'0')}`).every(id=>questionIds.has(id)), 'CAST must preserve the 16 existing question identifiers.');
const castEventIds = new Set();
for (const item of castItems) {
  for (const id of item.event_ids || []) {
    requireValid(eventIndex.has(id), `CAST item ${item.id} references unknown event ${id}.`);
    castEventIds.add(id);
  }
  for (const id of item.question_ids || []) requireValid(questionIds.has(id), `CAST item ${item.id} references unknown question ${id}.`);
  for (const key of ['controller_ids','constraint_ids','addresses_finding_ids','related_finding_ids']) {
    for (const id of item[key] || []) requireValid(castIndex.has(id), `CAST item ${item.id} references unknown ${key} ${id}.`);
  }
  for (const source of item.source_evidence || []) {
    requireValid(/^https:\/\//.test(source.url) && !!source.locator && !!source.supports, `CAST item ${item.id} has incomplete source provenance.`);
    for (const id of source.event_ids || []) requireValid(eventIndex.has(id), `CAST source in ${item.id} references unknown event ${id}.`);
  }
}
for (const path of castAnalysis.relationships) {
  requireValid(controllerIds.has(path.from) && controllerIds.has(path.to), `CAST path ${path.id} has an unknown endpoint.`);
  requireValid(['control_action','feedback','coordination'].includes(path.type) && ['documented','reported_omission','proposed','unknown'].includes(path.status), `CAST path ${path.id} has an invalid type or status.`);
}
requireValid(castAnalysis.questions.every(q => q.request_status === 'not_sent' && q.evidence_status === 'open'), 'Questions must not imply outreach or evidence that has not occurred.');
requireValid(castAnalysis.improvements.every(item => ['reported_actual','analyst_proposal'].includes(item.kind)), 'Changes must distinguish reported actions and analyst proposals.');
requireValid(castAnalysis.coverage.linked_event_count === castEventIds.size, 'CAST linked-event coverage count is incorrect.');
const researchSources = uniqueIndex(researchExpansion.sources, 'source_id', 'New sources');
const researchItems = uniqueIndex(researchExpansion.evidence_items, 'id', 'Additional evidence');
for (const source of researchSources.values()) if (source.local_artifact) {
  requireValid(/^research\/[a-z0-9-]+\.json$/.test(source.local_artifact), 'Collected artifact must use a local inert JSON path.');
  const artifact = JSON.parse(await readFile(new URL(source.local_artifact, root), 'utf8'));
  requireValid(artifact.original_url === source.url && artifact.original_sha256 === source.sha256 && artifact.data, `Artifact provenance mismatch for ${source.source_id}.`);
}
requireValid(researchExpansion.coverage.evidence_items === researchItems.size, 'Additional-evidence coverage count is incorrect.');
const questionUpdates = uniqueIndex(researchExpansion.question_updates, 'question_id', 'Question updates');
requireValid(questionUpdates.size === questionIds.size, 'Every investigation question requires a research update.');
for (const item of researchItems.values()) {
  requireValid(researchSources.has(item.source_id), `Missing research source for ${item.id}.`);
  requireValid(/^https:\/\//.test(item.url) && item.locator && item.novelty && item.limitations, `Incomplete evidence provenance for ${item.id}.`);
  for (const id of item.event_ids) requireValid(eventIndex.has(id), `Unknown research event ${id}.`);
  for (const id of item.finding_ids) requireValid(castIndex.get(id)?.controller_ids, `Unknown finding ${id}.`);
  for (const id of item.question_ids) requireValid(questionIds.has(id), `Unknown question ${id}.`);
}
for (const update of questionUpdates.values()) {
  requireValid(questionIds.has(update.question_id) && update.request_status === 'not_sent', 'Research updates must preserve question identity and outreach status.');
  for (const id of update.new_evidence_ids) requireValid(researchItems.has(id), `Unknown evidence update ${id}.`);
  requireValid(update.collection_plan.length && update.collection_plan.every(step => step.artifact && step.holder && step.method && step.decision_test), `Missing collection details for ${update.question_id}.`);
}
requireValid(openingQuotations.quotations.every(item => item.quote && item.author && item.locator && /^https:\/\//.test(item.url)), 'Opening quotations require exact provenance.');
const workstreamIndex = uniqueIndex(encodings.groups, 'key', 'Workstreams');
const stageIndex = uniqueIndex(incidentOntology.stages, 'id', 'Stages');
const lifecycleIndex = uniqueIndex(incidentOntology.lifecycle, 'id', 'Lifecycle');
const assignmentIndex = uniqueIndex(incidentOntology.assignments, 'event_id', 'Ontology assignments');
const supplementalIndex=uniqueIndex((researchExpansion.supplemental_events || []).map(item=>item.event),'id','Supplemental events');
const additionalSources=uniqueIndex(researchExpansion.additional_sources || [],'source_id','Additional event sources');
for(const item of researchExpansion.supplemental_events || []){
  requireValid(!eventIndex.has(item.event.id) && Object.keys(item.event).length===45, 'Supplemental events require unique IDs and all 45 fields.');
  requireValid(additionalSources.has(item.event.source_id) && item.event.source_locator && item.event.source_url, 'Supplemental events require primary-source provenance.');
  requireValid(item.assessment.id===item.event.id && item.assessment.band==='unresolved' && item.assessment.score===null, 'Wiki events retain their unresolved incident relationship.');
  requireValid(stageIndex.has(item.assignment.stage_id) && lifecycleIndex.has(item.assignment.lifecycle_id), 'Supplemental stage and lifecycle must exist.');
  requireValid(Number.isFinite(Date.parse(item.temporal.event_date)) && item.temporal.event_id===item.event.id, 'Supplemental dates require a source date.');
}
const sourcePhases = new Set(parsed.events.map((event) => event.phase));
const assignedPhases = encodings.groups.flatMap((group) => group.phases);
requireValid(sourcePhases.size === 27, 'The canonical inventory must contain exactly 27 source phases.');
requireValid(assignedPhases.length === sourcePhases.size
  && new Set(assignedPhases).size === assignedPhases.length
  && assignedPhases.every((phase) => sourcePhases.has(phase)),
'Every canonical source phase must belong to exactly one workstream, without extra phases.');
const phaseWorkstreams = new Map(encodings.groups.flatMap((group) => group.phases.map((phase) => [phase, group.key])));
const stagePhases = incidentOntology.stages.map((stage) => stage.source_phase);
requireValid(stagePhases.length === sourcePhases.size
  && new Set(stagePhases).size === stagePhases.length
  && stagePhases.every((phase) => sourcePhases.has(phase)),
'The stages must map the 27 canonical source phases exactly once.');
const roleLifecycle = new Map();
incidentOntology.lifecycle.forEach((life) => {
  life.roles.forEach((role) => {
    requireValid(!roleLifecycle.has(role), `Incident role ${role} belongs to multiple lifecycle groups.`);
    roleLifecycle.set(role, life.id);
  });
});
incidentOntology.stages.forEach((stage) => {
  requireValid(workstreamIndex.has(stage.workstream_id), `Stage ${stage.id} references an unknown workstream.`);
  requireValid(stage.workstream_id === phaseWorkstreams.get(stage.source_phase), `Stage ${stage.id} disagrees with its phase's workstream.`);
});
requireValid(assignmentIndex.size === eventIndex.size, 'Every canonical event must have exactly one ontology assignment.');
incidentOntology.assignments.forEach((assignment) => {
  const event = eventIndex.get(assignment.event_id);
  const stage = stageIndex.get(assignment.stage_id);
  requireValid(!!event, `Assignment ${assignment.event_id} does not identify a canonical event.`);
  requireValid(!!stage, `Assignment ${assignment.event_id} references an unknown stage.`);
  requireValid(lifecycleIndex.has(assignment.lifecycle_id), `Assignment ${assignment.event_id} references an unknown lifecycle group.`);
  requireValid(workstreamIndex.has(assignment.workstream_id), `Assignment ${assignment.event_id} references an unknown workstream.`);
  requireValid(stage.source_phase === event.phase, `Assignment ${assignment.event_id} disagrees with the event's source phase.`);
  requireValid(assignment.lifecycle_id === roleLifecycle.get(event.bow_tie_role), `Assignment ${assignment.event_id} disagrees with the event's incident role.`);
  requireValid(assignment.workstream_id === stage.workstream_id, `Assignment ${assignment.event_id} disagrees with its stage's workstream.`);
});
incidentOntology.stages.forEach((stage) => {
  const members = incidentOntology.assignments.filter((assignment) => assignment.stage_id === stage.id);
  requireValid(stage.count === members.length, `Stage ${stage.id} has an incorrect event count.`);
  incidentOntology.lifecycle.forEach((life) => {
    const count = members.filter((assignment) => assignment.lifecycle_id === life.id).length;
    requireValid(stage.lifecycle_counts[life.id] === count, `Stage ${stage.id} has an incorrect ${life.id} count.`);
  });
});
incidentOntology.lifecycle.forEach((life) => {
  const count = incidentOntology.assignments.filter((assignment) => assignment.lifecycle_id === life.id).length;
  requireValid(life.count === count, `Lifecycle group ${life.id} has an incorrect event count.`);
});
const severityIndex = uniqueIndex(assessments.records, 'id', 'Severity assessments');
requireValid(severityIndex.size === eventIndex.size, 'Every event must have one severity review disposition.');
for (const [id, assessment] of severityIndex) {
  requireValid(eventIndex.has(id), `Unknown severity event ${id}.`);
  requireValid(assessment.score === null ? ['preventive', 'context', 'unresolved'].includes(assessment.band)
    : Number.isInteger(assessment.score) && assessment.score >= 0 && assessment.score <= 5
      && assessment.band === (assessment.score === 0 ? 'near_miss' : 'adverse'), `Invalid severity disposition for ${id}.`);
  requireValid(!!assessment.rationale && !!assessment.review_status && assessment.source_evidence.length > 0, `Missing review provenance for ${id}.`);
}
for (const [key, count] of Object.entries(assessments.counts)) {
  const actual = assessments.records.filter((record) => record.score === null ? record.band === key : String(record.score) === key).length;
  requireValid(actual === count, `Incorrect severity count for ${key}.`);
}
for (const rule of assessments.rules) {
  for (const id of rule.event_ids) {
    const record = severityIndex.get(id);
    requireValid(!!record && record.score === rule.score && record.band === rule.band, `Rule ${rule.id} conflicts with current record ${id}.`);
  }
}
const timeIndex = uniqueIndex(temporalAssessments.records, 'event_id', 'Temporal assessments');
requireValid(timeIndex.size === eventIndex.size, 'Every event must have one temporal assessment.');
for (const [id, timing] of timeIndex) {
  requireValid(eventIndex.has(id), `Unknown temporal event ${id}.`);
  const a = timing.earliest_context_date && Date.parse(timing.earliest_context_date);
  const b = timing.latest_context_date_exclusive && Date.parse(timing.latest_context_date_exclusive);
  requireValid(a == null || b == null || a < b, `Invalid date bounds for ${id}.`);
}
const htmlText = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const heroQuote = openingQuotations.quotations.find(item => item.id === openingQuotations.recommendation.hero);
requireValid(!!heroQuote, 'Opening quote must resolve.');
const html = template
  .replace('/* OPENING_QUOTE */', () => htmlText(heroQuote.quote))
  .replace('/* OPENING_AUTHOR */', () => htmlText(heroQuote.author))
  .replace('/* OPENING_URL */', () => htmlText(heroQuote.url))
  .replace('/* AIRI_LOGO */', () => `data:image/svg+xml;base64,${Buffer.from(airiLogo).toString('base64')}`)
  .replace('/* STYLES */', () => fontFaces + styles)
  .replace('/* DATASET */', () => JSON.stringify(parsed).replace(/</g, '\\u003c'))
  .replace('/* SEVERITY */', () => JSON.stringify(assessments).replace(/</g, '\\u003c'))
  .replace('/* VISUALS */', () => JSON.stringify(encodings).replace(/</g, '\\u003c'))
  .replace('/* ONTOLOGY */', () => JSON.stringify(incidentOntology).replace(/</g, '\\u003c'))
  .replace('/* TEMPORAL */', () => JSON.stringify(temporalAssessments).replace(/</g, '\\u003c'))
  .replace('/* CAST */', () => JSON.stringify(castAnalysis).replace(/</g, '\\u003c'))
  .replace('/* RESEARCH */', () => JSON.stringify(researchExpansion).replace(/</g, '\\u003c'))
  .replace('/* QUOTATIONS */', () => JSON.stringify(openingQuotations).replace(/</g, '\\u003c'))
  .replace('/* QUERY */', () => `${query}\n${fieldLayout}\n${castView}\n${arrival}`)
  .replace('/* APP */', () => app.replace(/<\/script/gi, '<\\/script'));
const output = new URL('index.html', root);
await writeFile(output, html);
await writeFile(new URL('haruspex-dataset.json', root), dataset);
const extras=researchExpansion.supplemental_events||[];
const combinedOntology=structuredClone(incidentOntology);
for(const item of extras){combinedOntology.assignments.push(item.assignment);combinedOntology.lifecycle.find(l=>l.id===item.assignment.lifecycle_id).count++;const stage=combinedOntology.stages.find(s=>s.id===item.assignment.stage_id);stage.count++;stage.lifecycle_counts[item.assignment.lifecycle_id]++;if(!stage.source_ids.includes(item.event.source_id))stage.source_ids.push(item.event.source_id);}
const combinedAssessments=structuredClone(assessments);combinedAssessments.records.push(...extras.map(item=>item.assessment));combinedAssessments.total_records=combinedAssessments.records.length;
combinedAssessments.scale.values.find(v=>v.band==='unresolved').definition='The cited evidence leaves the effect, authorization, scope, or relationship to this incident unsettled. Each event explains what remains unknown. No numerical score is assigned.';
combinedAssessments.counts.unresolved=(combinedAssessments.counts.unresolved||0)+extras.length;
const combinedTemporal={...temporalAssessments,records:[...temporalAssessments.records,...extras.map(item=>item.temporal)]};
const mergedEvents=[...parsed.events,...extras.map(item=>item.event)],mergedSources=[...parsed.sources,...(researchExpansion.additional_sources||[])];
const addedEvents=extras;
combinedAssessments.total_records=mergedEvents.length;
combinedAssessments.counts.unresolved=41+addedEvents.length;combinedAssessments.outcome_counts.unresolved=41+addedEvents.length;
combinedAssessments.scale.display_conventions.size='Size distinguishes a single reported unit from grouped activity, not severity or the number of underlying instances.';
combinedAssessments.scale.display_conventions.shape='Circle: Reported; diamond: Reasoning; triangle: Inferred; six-point star: Accounts differ.';
combinedAssessments.scale.display_conventions.review_dispositions='Context and Unresolved are separate unordered fields. Hollow and broken outlines preserve workstream colors and evidence shapes.';
combinedTemporal.counts.events=mergedEvents.length;combinedTemporal.counts.with_event_date=mergedEvents.filter(e=>e.event_date).length;
combinedTemporal.counts.finite_context_windows=combinedTemporal.records.filter(e=>e.earliest_context_date&&e.latest_context_date_exclusive).length;
combinedTemporal.counts.time_precision={};combinedTemporal.counts.assessment_status={};
for(const record of combinedTemporal.records){combinedTemporal.counts.time_precision[record.time_precision]=(combinedTemporal.counts.time_precision[record.time_precision]||0)+1;combinedTemporal.counts.assessment_status[record.assessment_status]=(combinedTemporal.counts.assessment_status[record.assessment_status]||0)+1;}
combinedTemporal.scope+=' The working inventory additionally includes 20 dated wiki actions and findings from the Nightingale investigation.';
combinedOntology.counts.events=mergedEvents.length;combinedOntology.counts.incident_sources=mergedSources.length;combinedOntology.counts.system_contexts=new Set(mergedEvents.map(e=>e.system_scope)).size;
combinedOntology.counts.lifecycle=Object.fromEntries(combinedOntology.lifecycle.map(l=>[l.id,l.count]));combinedOntology.counts.workstream={};
for(const item of combinedOntology.assignments)combinedOntology.counts.workstream[item.workstream_id]=(combinedOntology.counts.workstream[item.workstream_id]||0)+1;
combinedOntology.scopes.inventory='852 explorable events: 832 canonical events plus 20 wiki actions and findings in Unresolved. This is a working inventory, not a proven maximum. Wiki activity has no confirmed connection to the Hugging Face incident.';
await writeFile(new URL('haruspex-atlas-data-v10.json', root), JSON.stringify({ ...parsed, metadata:{...parsed.metadata,version:'1.2',as_of:'2026-09-10',event_count:mergedEvents.length,source_count:mergedSources.length,canonical_event_count:832,previous_inventory_count:832,additional_events:20,additional_event_scope:'Twenty wiki actions and findings in Unresolved; connection to the Hugging Face incident unconfirmed.'}, events:[...parsed.events,...extras.map(item=>item.event)], sources:[...parsed.sources,...(researchExpansion.additional_sources||[])], severity_assessments:combinedAssessments, visual_encodings: encodings, incident_ontology: combinedOntology, temporal_assessments: combinedTemporal, cast_analysis: castAnalysis, research_expansion: researchExpansion, opening_quotations: openingQuotations }, null, 2));
console.log(JSON.stringify({ output: fileURLToPath(output), events: parsed.events.length + supplementalIndex.size, bytes: Buffer.byteLength(html) }));
