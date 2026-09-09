import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('./', import.meta.url);
const datasetPath = new URL('../outputs/haruspex-2026-09-09/haruspex-dataset.json', root);
const [template, styles, app, dataset, severity, visuals, ontology, query, temporal, fieldLayout, cast, castView] = await Promise.all([
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
]);
const parsed = JSON.parse(dataset);
const encodings = JSON.parse(visuals);
const incidentOntology = JSON.parse(ontology);
const assessments = JSON.parse(severity);
const temporalAssessments = JSON.parse(temporal);
const castAnalysis = JSON.parse(cast);
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
const workstreamIndex = uniqueIndex(encodings.groups, 'key', 'Workstreams');
const stageIndex = uniqueIndex(incidentOntology.stages, 'id', 'Stages');
const lifecycleIndex = uniqueIndex(incidentOntology.lifecycle, 'id', 'Lifecycle');
const assignmentIndex = uniqueIndex(incidentOntology.assignments, 'event_id', 'Ontology assignments');
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
const html = template
  .replace('/* STYLES */', () => styles)
  .replace('/* DATASET */', () => JSON.stringify(parsed).replace(/</g, '\\u003c'))
  .replace('/* SEVERITY */', () => JSON.stringify(assessments).replace(/</g, '\\u003c'))
  .replace('/* VISUALS */', () => JSON.stringify(encodings).replace(/</g, '\\u003c'))
  .replace('/* ONTOLOGY */', () => JSON.stringify(incidentOntology).replace(/</g, '\\u003c'))
  .replace('/* TEMPORAL */', () => JSON.stringify(temporalAssessments).replace(/</g, '\\u003c'))
  .replace('/* CAST */', () => JSON.stringify(castAnalysis).replace(/</g, '\\u003c'))
  .replace('/* QUERY */', () => `${query}\n${fieldLayout}\n${castView}`)
  .replace('/* APP */', () => app.replace(/<\/script/gi, '<\\/script'));
const output = new URL('index.html', root);
await writeFile(output, html);
await writeFile(new URL('haruspex-dataset.json', root), dataset);
await writeFile(new URL('haruspex-atlas-data-v8.json', root), JSON.stringify({ ...parsed, severity_assessments: assessments, visual_encodings: encodings, incident_ontology: incidentOntology, temporal_assessments: temporalAssessments, cast_analysis: castAnalysis }, null, 2));
console.log(JSON.stringify({ output: fileURLToPath(output), events: parsed.events.length, bytes: Buffer.byteLength(html) }));
