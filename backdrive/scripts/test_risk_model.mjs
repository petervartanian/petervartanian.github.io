import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const site = fileURLToPath(new URL('../', import.meta.url));
const source = fs.readFileSync(`${site}risk-model.js`, 'utf8');
const context = vm.createContext({window: {}});
vm.runInContext(source, context);
const model = context.window.BACKDRIVE_RISK_MODEL;
const array = value => Array.from(value);
const ids = value => array(value).map(record => record.id);

assert.equal(model.domains.length, 7);
assert.equal(model.risks.length, 24);
assert.equal(new Set(model.risks.map(risk => risk.id)).size, 24);
assert.ok(model.risks.some(risk => risk.id === '6.4'));
assert.ok(model.risks.some(risk => risk.id === '7.5'));
assert.ok(model.risks.every(risk => risk.domainId === risk.id.split('.')[0] && risk.definition));

const records = [
  {id: 'a', tracker: {subdomain: '7.3 Lack of capability or robustness', entity: 'AI', intent: 'Unintentional', timing: 'Post-deployment'}, capability: 'Navigation', evalIds: ['e1', 'e1', 'missing'], controlId: 'c1'},
  {id: 'b', tracker: {subdomain: '4.2 Cyberattacks, weapon development or use, and mass harm', entity: 'Human', intent: 'Intentional', timing: 'Pre-deployment'}, capability: 'Unassessed', evalIds: []},
  {id: 'c', domain: 'Autonomous navigation', title: 'A robot fails', capability: 'Pressure control', controlIds: ['c2']},
  {id: 'd', tracker: {subdomain: '7.3', entity: 'Other', intent: 'Other', timing: 'Other'}, capability: 'Unassessed', evalIds: []},
  {id: 'e', tracker: {subdomain: '6.6 Environmental harm'}, hasLocalMapping: true},
  {id: 'f', tracker: {subdomain: 'Unrecognized future category', additionalSubdomains: ['7.3']}, capability: 'Unassessed'}
];
const before = JSON.stringify(records);
assert.equal(model.riskOf(records[0]), '7.3');
assert.equal(model.riskOf({tracker: {subdomain: 'Cyberattacks, weapon development or use, and mass harm'}}), '4.2');
assert.equal(model.riskOf({tracker: {subdomain: '7.9 Unknown future risk'}}), null);
assert.equal(model.riskOf({tracker: {subdomain: '7.3x'}}), null);
assert.equal(model.riskOf(records[2]), null);
assert.equal(model.riskOf(records[5]), null);
assert.deepEqual(ids(model.select(records, {risk: '7'})), ['a', 'd']);
assert.deepEqual(ids(model.select(records, {risk: '7.3', entity: 'ai', intent: 'Unintentional', timing: 'Post-deployment'})), ['a']);
assert.deepEqual(ids(model.select(records, {risk: 'unclassified'})), ['c', 'f']);
assert.deepEqual(ids(model.select(records, {entity: 'Other'})), ['d']);
assert.deepEqual(ids(model.select(records, {risk: 'not-a-risk'})), []);
assert.deepEqual(ids(model.select(records, null)), records.map(record => record.id));
assert.equal(model.summarize(records, '7.5').count, 0);

// Delayed loading is supported; all associations are read when summarize runs.
context.window.BACKDRIVE_DATA = {
  capabilities: [
    {id: 'nav', name: 'Navigation', caseIds: ['a'], evalIds: ['unrelated-evaluation']},
    {id: 'pressure', name: 'Pressure control', caseIds: ['c']},
    {id: 'unrelated-capability', name: 'Unrelated', caseIds: ['outside']}
  ],
  evaluations: [
    {id: 'e1', caseIds: ['a']},
    {id: 'e2', caseIds: ['a', 'c']},
    {id: 'e3', caseIds: []},
    {id: 'unrelated-evaluation', caseIds: ['outside']}
  ],
  controls: [
    {id: 'c1', caseId: 'a'},
    {id: 'c2', caseIds: ['c']},
    {id: 'unrelated-control', caseId: 'outside', evaluationIds: ['e1']}
  ],
  pilots: [
    {id: 'p1', caseIds: ['a'], evalIds: ['unrelated-evaluation'], controls: ['unrelated-control']},
    {id: 'p2', caseIds: [], projects: [{evidenceLinks: [{caseId: 'c', evalIds: ['e3', 'missing']}]}]},
    {id: 'unrelated-pilot', caseIds: ['outside'], evalIds: ['e1']}
  ]
};

const summary = model.summarize(records);
assert.equal(summary.count, 6);
assert.equal(summary.classifiedCount, 4);
assert.equal(summary.unclassifiedCount, 2);
assert.equal(summary.assessedCount, 3);
assert.equal(summary.unassessedCount, 3);
assert.equal(summary.evaluationMappedCount, 2);
assert.deepEqual(array(summary.capabilityIds), ['nav', 'pressure']);
assert.deepEqual(array(summary.capabilityNames), ['Navigation', 'Pressure control']);
assert.deepEqual(array(summary.evaluationIds), ['e1', 'e2', 'e3']);
assert.deepEqual(array(summary.controlIds), ['c1', 'c2']);
assert.deepEqual(array(summary.pilotIds), ['p1', 'p2']);
assert.deepEqual(array(model.summarize(records, '7').evaluationIds), ['e1', 'e2']);
assert.equal(model.summarize(records, '7').evaluationMappedCount, 1);
assert.equal(model.summarize(records, '7.5').evaluationMappedCount, 0);
assert.deepEqual(array(model.summarize(records, 'unclassified').pilotIds), ['p2']);
// A record with no forward evalIds still has its explicit reverse/project links.
assert.equal(model.summarize(records, 'unclassified').evaluationMappedCount, 1);
assert.equal(JSON.stringify(records), before, 'Filtering and summaries must preserve the original records.');

// The shipped catalog must retain every imported primary classification and
// keep supplemental records without a MIT classification discoverable.
const production = vm.createContext({window: {}});
for (const filename of ['data.js', 'imports/tracker.js', 'catalog.js', 'risk-model.js']) {
  vm.runInContext(fs.readFileSync(`${site}${filename}`, 'utf8'), production);
}
const data = production.window.BACKDRIVE_DATA;
const liveModel = production.window.BACKDRIVE_RISK_MODEL;
const live = liveModel.summarize(data.cases);
assert.equal(live.count, data.cases.length);
assert.equal(live.classifiedCount + live.unclassifiedCount, live.count);
assert.equal(live.assessedCount + live.unassessedCount, live.count);
assert.equal(live.evaluationMappedCount, data.cases.filter(record => liveModel.summarize([record]).evaluationIds.length > 0).length);
assert.equal(live.classifiedCount, data.cases.filter(record => record.tracker).length);
assert.equal(live.unclassifiedCount, data.cases.filter(record => !record.tracker).length);
assert.equal(liveModel.domains.reduce((sum, domain) => sum + liveModel.select(data.cases, {risk: domain.id}).length, 0), live.classifiedCount);
assert.equal(liveModel.risks.reduce((sum, risk) => sum + liveModel.select(data.cases, {risk: risk.id}).length, 0), live.classifiedCount);
assert.ok(live.unclassifiedCount > 0, 'The unclassified view must retain the supplemental incident records.');
console.log(`Risk model checks passed: ${live.count} records; ${live.classifiedCount} classified; ${live.unclassifiedCount} unclassified; ${live.assessedCount} with existing mappings or associations.`);
