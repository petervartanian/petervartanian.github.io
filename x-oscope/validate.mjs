import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const load = async (name) => JSON.parse(await readFile(new URL(name, import.meta.url), 'utf8'));
const [catalogue, incidents, assessments, evidence] = await Promise.all([
  load('pathways.json'), load('incidents.json'), load('assessments.json'), load('evidence.json'),
]);
const unique = (items, label) => {
  const map = new Map(items.map((item) => [item.id, item]));
  assert.equal(map.size, items.length, `Duplicate ${label} IDs`);
  return map;
};
const pathways = unique(catalogue.pathways, 'pathway');
const display = { window: {} };
vm.runInNewContext(await readFile(new URL('display.js', import.meta.url), 'utf8'), display);
assert.deepEqual(Object.keys(display.window.AuspexLabels).sort(), [...pathways.values()].filter((p) => !p.steps.every((s) => s.shortLabel)).map((p) => p.id).sort());
const groups = unique(catalogue.groups, 'group');
assert.deepEqual(catalogue.groups.map((g) => g.ordinal), ['A', 'B', 'C', 'D', 'E', 'F', 'Bonus']);
const roles = unique(catalogue.typology.roles, 'causal role');
const aiStages = unique(catalogue.typology.aiStages, 'AI stage');
const controlRoles = unique(catalogue.typology.barrierRoles, 'barrier role');
assert.equal(new Set(catalogue.pathways.map((p) => p.displayId)).size, catalogue.pathways.length);
const incidentMap = unique(incidents, 'incident');
const sources = unique(evidence.sources, 'source');
const passages = unique(evidence.passages, 'passage');
const inspectionContext = { window: {} };
vm.runInNewContext(await readFile(new URL('inspection.js', import.meta.url), 'utf8'), inspectionContext);
const inspection = inspectionContext.window.AuspexInspection;
for (const incident of incidents) if (incident.view) inspection.incidents[incident.id] = incident.view;
for (const a of assessments) for (const b of a.barriers) if (b.view) inspection.barriers[b.id] = b.view;
unique(assessments, 'assessment');
const allTargets = new Map();
assert.equal(catalogue.pathways.filter((p) => !p.comparison).length, 31);
assert.equal(catalogue.pathways.filter((p) => p.comparison).length, 6);
assert.equal(catalogue.pathways.filter((p) => p.endpoint.startsWith('human extinction') || p.endpoint.startsWith('extinction of')).length, 2);
for (const p of pathways.values()) {
  assert(groups.has(p.group), p.id);
  assert.equal(p.displayId, `${groups.get(p.group).ordinal}-${Number(p.id.split('-')[1])}`);
  assert.equal(p.comparison, p.group === 'H');
  assert.equal(p.version, catalogue.version);
  assert(p.reach.local.trim(), `${p.id}: local effects`);
  if (!p.comparison) assert(p.reach.systemic?.trim(), `${p.id}: wider effects`);
  else assert(p.reach.systemic === null || p.reach.systemic.trim());
  for (const id of p.reach.sources) assert(sources.has(id), `${p.id}: reach source`);
  const steps = unique(p.steps, `${p.id} step`);
  const edges = unique(p.edges, `${p.id} edge`);
  allTargets.set(p.id, { steps, edges });
  assert(p.steps.length >= 4);
  const labels = display.window.AuspexLabels[p.id] || p.steps.map((s) => s.shortLabel);
  assert.equal(labels.length, p.steps.length, `${p.id}: diagram labels`);
  for (const label of labels) assert(label.trim(), `${p.id}: empty diagram label`);
  assert.equal(p.edges.length, p.steps.length - 1);
  p.steps.forEach((step, i) => {
    assert.equal(step.number, i + 1);
    assert.equal(step.id, `${p.id}:${i + 1}`);
    assert(step.text.trim());
    assert(step.roles.length && step.roleBasis === 'editorial', `${step.id}: typed role`);
    for (const role of step.roles) assert(roles.has(role), `${step.id}: unknown role ${role}`);
    assert(step.aiStages.length && step.stageSources.length, `${step.id}: sourced AI stage`);
    for (const stage of step.aiStages) assert(aiStages.has(stage), `${step.id}: unknown AI stage`);
    for (const source of step.stageSources) assert(sources.has(source), `${step.id}: missing stage source`);
  });
  p.edges.forEach((edge, i) => {
    assert.equal(edge.from, p.steps[i].id);
    assert.equal(edge.to, p.steps[i + 1].id);
    assert.equal(edge.type, 'conditional');
  });
  for (const key of ['title', 'endpoint', 'basis', 'conditions', 'barrierCandidates']) assert(p[key]?.trim(), `${p.id}: ${key}`);
  if (!p.comparison) assert(p.weakestBridge?.trim(), p.id);
  for (const id of p.sources) assert(sources.has(id), `${p.id}: ${id}`);
  for (const [, id] of JSON.stringify(p).matchAll(/\[([A-Z0-9]+)\]/g)) assert(sources.has(id), `${p.id}: missing citation ${id}`);
  const local = assessments.filter((a) => a.pathway === p.id);
  assert.deepEqual(p.coverage.incidents, [...new Set(local.map((a) => a.incident))]);
  assert.equal(p.coverage.minimumMet, p.coverage.incidents.length >= 2);
  assert(p.coverage.minimumMet, `${p.id}: at least two distinct component comparisons required`);
  assert.deepEqual(p.coverage.mappedTargets, [...new Set(local.flatMap((a) => a.targets.map((t) => t.id)))]);
  assert.deepEqual(p.coverage.unassessedTargets, [...p.steps, ...p.edges].map((t) => t.id).filter((id) => !p.coverage.mappedTargets.includes(id)));
}
for (const stage of aiStages.values()) for (const id of stage.sources) assert(sources.has(id));
for (const source of sources.values()) {
  assert(source.title?.trim(), source.id);
  assert.equal(new URL(source.url).protocol, 'https:');
  if (source.retrievalSha256) {
    assert(/^[a-f0-9]{64}$/.test(source.retrievalSha256), `${source.id}: retrieval hash`);
    assert(source.hashScope?.trim() && source.access?.trim(), `${source.id}: retrieval scope and access`);
  }
}
for (const passage of passages.values()) {
  assert(sources.has(passage.source));
  assert(['quote', 'summary'].includes(passage.kind));
  for (const key of ['text', 'scope', 'locator']) assert(passage[key]?.trim(), `${passage.id}: ${key}`);
}
for (const incident of incidents) {
  if (incident.evidenceClass) assert(['ai-study','ai-deployment','ai-incident','non-ai-analogy'].includes(incident.evidenceClass), `${incident.id}: evidence class`);
  for (const source of incident.sources) assert(sources.has(source));
  for (const field of ['entity', 'intent', 'setting', 'note']) assert(incident.causalFactors[field]?.trim(), `${incident.id}: ${field}`);
}
for (const a of assessments) {
  assert(pathways.has(a.pathway));
  assert.equal(a.pathwayVersion, pathways.get(a.pathway).version);
  assert(incidentMap.has(a.incident));
  assert(a.scope?.trim());
  assert(['component', 'mechanism-comparison', 'challenge', 'countermeasure'].includes(a.relation), `${a.id}: evidence relation`);
  assert(a.reach.local.trim() && a.reach.systemic.trim(), `${a.id}: evidence and reach`);
  assert(a.reach.evidence.length, `${a.id}: reach evidence`);
  for (const id of a.reach.evidence) assert(passages.has(id), `${a.id}: reach evidence reference`);
  const view = inspection.incidents[a.incident];
  assert(view, `${a.id}: incident inspection`);
  const observations = a.trace?.length ? a.trace : view.observations || [];
  assert.equal(view.labels.length, observations.length, `${a.id}: observation labels`);
  for (const observation of observations) {
    assert(observation.text.trim());
    for (const id of observation.evidence) assert(passages.has(id), `${a.id}: observation evidence`);
  }
  for (const entry of a.trace || []) {
    assert(entry.text?.trim());
    assert(entry.evidence.length);
    for (const id of entry.evidence) assert(passages.has(id));
  }
  const targets = allTargets.get(a.pathway);
  for (const target of a.targets) {
    assert(['node', 'edge'].includes(target.kind));
    assert(['component', 'reported', 'unknown', 'contradicted'].includes(target.state));
    assert((target.kind === 'node' ? targets.steps : targets.edges).has(target.id));
  }
  unique(a.barriers, `${a.id} barrier`);
  for (const b of a.barriers) {
    assert(controlRoles.has(b.role), `${b.id}: control role`);
    const view = inspection.barriers[b.id];
    assert(view, `${b.id}: barrier diagram`);
    if (view.observation !== undefined) assert(view.observation >= 0 && view.observation < observations.length, `${b.id}: reading position`);
    if (view.resultObservation !== undefined) assert(view.resultObservation >= 0 && view.resultObservation < observations.length, `${b.id}: result reading position`);
    if (view.inputObservation !== undefined) assert(view.inputObservation >= 0 && view.inputObservation < observations.length, `${b.id}: input reading position`);
    if (view.failureRoute) assert(b.failure.trim(), `${b.id}: failure route without an assessment`);
    assert(a.targets.some((t) => t.id === b.target));
    for (const key of ['action', 'efficacy', 'title', 'outcome']) assert(b[key]?.trim());
    assert.equal(typeof b.failure, 'string');
    assert.equal(typeof b.durability, 'string');
    assert(b.evidence.length);
    for (const id of b.evidence) assert(passages.has(id));
    for (const d of b.dependencies) {
      assert(d.label.trim() && d.assessment.trim() && d.basis.trim(), `${b.id}: dependency`);
      for (const id of d.evidence) assert(passages.has(id));
    }
    if (b.reinforcement) {
      assert(b.reinforcement.label.trim());
      assert(b.reinforcement.proposal.trim() && b.reinforcement.test.trim());
      assert.equal(b.reinforcement.basis, 'Editorial proposal; effectiveness not established');
      for (const id of b.reinforcement.evidence) assert(passages.has(id));
    }
  }
  for (const id of a.evidence) assert(passages.has(id));
}
// Component evidence must not silently become a completed transition.
assert.equal(assessments.find((a) => a.id === 'HF-X02').targets[0].state, 'component');
assert.equal(assessments.find((a) => a.id === 'ED-H06').targets[0].kind, 'node');
for (const id of ['H-04', 'H-05', 'H-06']) assert.equal(pathways.get(id).reach.systemic, null, `${id}: bounded comparison must not acquire an unsupported systemic outcome`);
const bundled = { window: {} };
vm.runInNewContext(await readFile(new URL('data.js', import.meta.url), 'utf8'), bundled);
assert.deepEqual(JSON.parse(JSON.stringify(bundled.window.AuspexData)), {
  version: catalogue.version, groups: catalogue.groups, pathways: catalogue.pathways,
  incidents, assessments, evidence, typology: catalogue.typology,
});
const html = await readFile(new URL('index.html', import.meta.url), 'utf8');
assert(html.replace(/<[^>]+>/g, '').includes('Recent incidents have exposed failures of control over autonomous AI.'));
assert(html.includes('<em class="opening-question">As governments experiment with safeguards and researchers examine pathways to catastrophe, what has prevented further escalation — and will those barriers withstand more capable AI?</em>'));
assert.equal(catalogue.groups.find(g => g.id === 'F').shortTitle, 'Informational ecosystems');
const app = await readFile(new URL('app.js', import.meta.url), 'utf8');
for (const label of ['Choose a pathway', 'Trace the incidents', 'Inspect the barrier']) assert(html.includes(label));
for (const label of ['(How) did the barrier work?', 'What makes us think so?', 'How brittle is that protection?', 'What could make it fail?']) assert(app.includes(label));
assert(!/Research draft|ERO alignment|working study|provisional mapping/i.test(`${html}\n${app}`));
assert(!html.includes('framework.js'));
assert(!html.includes('assessment.js'));
assert(!html.includes('id="harm-scales"') && !html.includes('id="incident-harm-scales"'));
assert(!app.includes('Outside this comparison’s scope.'));
assert.equal(assessments.find((a) => a.incident === 'NYH-2020').relation, 'challenge');
assert.equal(assessments.find((a) => a.incident === 'DEB-2024').relation, 'countermeasure');
assert.match(incidentMap.get('SLP-2024').causalFactors.setting, /experiment/i);
assert.equal(incidents.filter((i) => i.id === 'SAB-2024').length, 1);
const staticHTML = await readFile(new URL('pathways.html', import.meta.url), 'utf8');
for (const p of pathways.values()) assert(staticHTML.includes(`id="${p.id}"`), p.id);
console.log(`Validated ${pathways.size} pathways, ${incidents.length} incidents, ${assessments.reduce((n, a) => n + a.barriers.length, 0)} barrier assessments, ${sources.size} sources, ${passages.size} passages; bundle and static reader agree.`);
