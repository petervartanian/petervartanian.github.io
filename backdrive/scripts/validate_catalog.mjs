#!/usr/bin/env node
/**
 * Offline integrity checks for the published catalog. Requires only Node.js.
 * Run from any directory: node backdrive/scripts/validate_catalog.mjs
 * An optional directory argument checks another complete backdrive checkout.
 * This verifies structure and the recorded reference snapshot, not external
 * source availability, scientific validity, or browser rendering.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

if (process.argv.includes('--help')) {
  console.log('Usage: node scripts/validate_catalog.mjs [backdrive-directory]');
  process.exit(0);
}
const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
process.env.UV_THREADPOOL_SIZE ??= '16';
const failures = [];
let checks = 0;
let mitigationCount = 0;
const check = (condition, message) => { checks++; if (!condition) failures.push(message); };
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const jsonCache = new Map();
const json = name => jsonCache.has(name) ? jsonCache.get(name) : JSON.parse(read(name));
const digest = name => createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
const normalize = value => Array.isArray(value) ? value.map(normalize) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, normalize(value[key])])) : value;
const same = (a, b) => JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
async function section(name, work) {
  const before = failures.length;
  try { await work(); } catch (error) { failures.push(`${name}: ${error.message}`); }
  console.log(`${failures.length === before ? 'PASS' : 'FAIL'} ${name}`);
}
function unique(records, label, key = 'id') {
  check(Array.isArray(records), `${label} must be an array`);
  const ids = new Set();
  for (const record of records) {
    check(typeof record[key] === 'string' && record[key].length > 0, `${label}: missing ${key}`);
    check(!ids.has(record[key]), `${label}: duplicate ${key} ${record[key]}`);
    ids.add(record[key]);
  }
  return ids;
}
function references(values, known, label) {
  check(Array.isArray(values), `${label} must be an array`);
  if (!Array.isArray(values)) return;
  check(values.length === new Set(values).size, `${label} repeats a reference`);
  for (const value of values) check(known.has(value), `${label}: unknown reference ${value}`);
}
function http(value, label) {
  let valid = false;
  try { valid = ['http:', 'https:'].includes(new URL(value).protocol); } catch {}
  check(valid, `${label}: invalid source URL ${value}`);
}
function localFile(url, label) {
  const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
  const absolute = path.resolve(root, pathname);
  check(absolute.startsWith(root + path.sep), `${label}: path escapes the checkout`);
  const exists = fs.existsSync(absolute) && fs.statSync(absolute).isFile();
  check(exists, `${label}: missing file ${pathname}`);
  return exists ? pathname : null;
}

const context = vm.createContext({window: {}});
let tracker, manifest, original, data;
try {
  const bootstrap = ['imports/tracker.js', ...(fs.existsSync(path.join(root, 'imports/mitigations.js')) ? ['imports/mitigations.js'] : []), 'data.js'];
  for (const name of bootstrap) {
    vm.runInContext(read(name), context, {filename: name, timeout: 10000});
  }
  tracker = context.window.BACKDRIVE_TRACKER;
  original = JSON.parse(JSON.stringify(context.window.BACKDRIVE_DATA));
  manifest = json('imports/tracker-manifest.json');
  vm.runInContext(read('catalog.js'), context, {filename: 'catalog.js', timeout: 10000});
  data = context.window.BACKDRIVE_DATA;
  if (!tracker?.cases || !data?.cases) throw new Error('Missing Tracker or catalog data');
} catch (error) {
  console.error(`FAIL Loading catalog: ${error.message}`);
  process.exit(1);
}
const importedIds = new Set(tracker.cases.map(record => record.id));
const cases = new Map(data.cases.map(record => [record.id, record]));
const aliases = manifest.localAliases || {};
const resolve = id => aliases[id] || id;

await section('Tracker manifest, hashes, and imported record identity', () => {
  unique(tracker.cases, 'Tracker incidents');
  check(Number.isInteger(manifest.count) && manifest.count > 0, 'Manifest count must be a positive integer');
  check(tracker.cases.length === manifest.count, 'Tracker count differs from manifest');
  check(tracker.metadata.count === manifest.count, 'Tracker metadata count differs from manifest');
  for (const [key, value] of Object.entries(tracker.metadata)) {
    check(same(value, manifest[key]), `Manifest differs from Tracker metadata: ${key}`);
  }
  check(digest('imports/tracker.js') === manifest.outputSha256, 'Tracker SHA-256 differs from manifest');
  check(fs.statSync(path.join(root, 'imports/tracker.js')).size === manifest.outputBytes, 'Tracker byte count differs from manifest');
  check(tracker.cases.filter(record => record.roboticsCandidate).length === manifest.roboticsCandidateCount,
    'Robotics candidate count differs from manifest');
  for (const record of tracker.cases) {
    check(record.id === `AIID-${record.tracker?.incidentId}`, `${record.id}: compact source ID differs`);
    check(String(record.trackerList?.incidentId) === String(record.tracker?.incidentId), `${record.id}: source list ID differs`);
    check(record.sourceUpdatedAt === manifest.sourceUpdatedAt, `${record.id}: mixed import timestamps`);
  }
});

await section('Every referenced detail batch and preserved source fields', async () => {
  const detailFiles = [...new Set(tracker.cases.map(record => record.trackerDetailUrl))];
  for (const file of detailFiles) localFile(file, 'Tracker detail');
  const detailDigests = new Map();
  if (manifest.detailBatches) {
    unique(manifest.detailBatches, 'Manifest detail batches', 'url');
    check(same(manifest.detailBatches.map(batch => batch.url).sort(), [...detailFiles].sort()), 'Manifest batches differ from referenced detail files');
    check(manifest.detailBatchCount === detailFiles.length, 'Detail batch count differs from manifest');
    check(manifest.detailRecordCount === tracker.cases.length, 'Detail record count differs from Tracker count');
    check(manifest.detailBatches.reduce((sum, batch) => sum + batch.recordCount, 0) === manifest.detailRecordCount, 'Manifest batch counts do not sum to the detail record count');
  }
  let next = 0;
  let loaded = 0;
  // Bounded parallel reads avoid serial waits when a cloud-backed checkout needs
  // to hydrate source files. Keep parse errors attached to the individual file.
  await Promise.all(Array.from({length: Math.min(16, detailFiles.length)}, async () => {
    while (next < detailFiles.length) {
      const name = detailFiles[next++];
      try {
        const bytes = await fs.promises.readFile(path.join(root, name));
        detailDigests.set(name, {bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')});
        jsonCache.set(name, JSON.parse(bytes.toString('utf8')));
      } catch (error) {
        failures.push(`${name}: ${error.message}`);
        jsonCache.set(name, {});
      }
      loaded++;
      if (loaded % 100 === 0) console.log(`  Read ${loaded}/${detailFiles.length} detail files`);
    }
  }));
  for (const batch of manifest.detailBatches || []) {
    const actual = detailDigests.get(batch.url);
    check(actual?.sha256 === batch.sha256, `${batch.url}: SHA-256 differs from manifest`);
    check(actual?.bytes === batch.bytes, `${batch.url}: byte count differs from manifest`);
    check(Object.keys(json(batch.url).records || {}).length === batch.recordCount, `${batch.url}: record count differs from manifest`);
  }
  const detailIds = new Set();
  for (const file of detailFiles) {
    const payload = json(file);
    const contents = payload.records || {[`AIID-${payload.incidentId}`]: payload};
    check(contents && typeof contents === 'object' && !Array.isArray(contents), `${file}: expected a keyed records object`);
    for (const [id, detail] of Object.entries(contents)) {
      check(!detailIds.has(id), `${id}: appears in more than one detail batch`);
      detailIds.add(id);
      check(id === `AIID-${detail.incidentId}`, `${file}: detail key ${id} and incidentId differ`);
      check(importedIds.has(id), `${file}: detail ${id} is absent from the import`);
    }
  }
  check(same([...detailIds].sort(), [...importedIds].sort()), 'Detail batches do not contain exactly the imported incident IDs');
  for (const record of tracker.cases) {
    if (typeof manifest.detailFiles === 'string' && manifest.detailFiles.includes('{incidentId}')) {
      check(record.trackerDetailUrl === manifest.detailFiles.replace('{incidentId}', String(record.tracker.incidentId)), `${record.id}: unexpected detail URL`);
    }
    const payload = json(record.trackerDetailUrl);
    const detail = payload.records ? payload.records[record.id] : payload;
    check(Boolean(detail), `${record.id}: missing from its referenced detail batch`);
    if (!detail) continue;
    check(String(detail.incidentId) === String(record.tracker.incidentId), `${record.id}: detail file belongs to another incident`);
    check(record.title === (detail.title || record.trackerList.title), `${record.id}: imported title changed`);
    check(record.summary === (detail.summary || detail.description || ''), `${record.id}: imported summary changed`);
    check(record.date === (detail.date || record.trackerList.date || ''), `${record.id}: imported date changed`);
    for (const [key, value] of Object.entries(record.tracker)) {
      check(same(value, detail[key]), `${record.id}: compact classification differs from detail field ${key}`);
    }
    const merged = cases.get(record.id);
    check(Boolean(merged), `${record.id}: lost during catalog merge`);
    if (!merged) continue;
    for (const key of ['title', 'summary', 'date', 'tracker', 'trackerList', 'trackerDetailUrl']) {
      check(same(merged[key], record[key]), `${record.id}: catalog merge changed source field ${key}`);
    }
  }
  console.log(`  Checked ${detailIds.size} original records in ${detailFiles.length} detail files`);
});

await section('Alias deduplication and complete merge', () => {
  unique(data.cases, 'Merged incidents');
  const expected = new Set([...importedIds, ...original.cases.map(record => resolve(record.id))]);
  check(same([...cases.keys()].sort(), [...expected].sort()), 'Merged IDs differ from imported plus supplemental records');
  for (const [from, to] of Object.entries(aliases)) {
    check(from !== to && !aliases[to], `${from}: alias is self-referential or chained`);
    check(importedIds.has(to), `${from}: alias target ${to} is absent from the Tracker`);
    check(!cases.has(from) && cases.has(to), `${from}: alias was not deduplicated`);
    const originalRecord = original.cases.find(record => record.id === from);
    if (originalRecord) check(cases.get(to)?.localReferences?.includes(from), `${from}: original reference was lost`);
  }
  check(data.supplementCount === data.cases.filter(record => !record.tracker).length, 'Supplement count is incorrect');
});

await section('Capability, evaluation, intervention, pilot, and project links', () => {
  const capabilityIds = unique(data.capabilities, 'Capabilities');
  const capabilityNames = unique(data.capabilities, 'Capability names', 'name');
  const evaluationIds = unique(data.evaluations, 'Evaluations');
  const controlIds = unique(data.controls, 'Interventions');
  const pilotIds = unique(data.pilots, 'Pilots');
  const caseIds = new Set(cases.keys());
  const evaluations = new Map(data.evaluations.map(record => [record.id, record]));
  const capabilities = new Map(data.capabilities.map(record => [record.name, record]));
  for (const record of data.cases) {
    references(record.evalIds, evaluationIds, `${record.id}.evalIds`);
    check(!record.controlId || controlIds.has(record.controlId), `${record.id}: missing intervention ${record.controlId}`);
    if (!['Unassessed', 'Not mapped', ''].includes(record.capability)) {
      check(capabilityNames.has(record.capability), `${record.id}: missing capability definition ${record.capability}`);
      check(capabilities.get(record.capability)?.caseIds?.includes(record.id), `${record.id}: capability omits reciprocal case link`);
    }
    for (const id of record.evalIds) check(evaluations.get(id)?.caseIds?.includes(record.id), `${record.id}: evaluation ${id} omits reciprocal case link`);
    if (record.hasResults) {
      check(record.evalIds.length > 0, `${record.id}: hasResults without an evaluation`);
      // The current incident renderer uses this flag to show the fixed mixing chart.
      check(record.id === 'AIID-594' && record.evalIds.includes('roboharm'), `${record.id}: hasResults would inject an unrelated RoboHarm mixing chart`);
    }
  }
  for (const capability of data.capabilities) {
    references(capability.caseIds, caseIds, `${capability.id}.caseIds`);
    references(capability.evalIds, evaluationIds, `${capability.id}.evalIds`);
    references(capability.pilotIds || [], pilotIds, `${capability.id}.pilotIds`);
    for (const id of capability.caseIds) check(cases.get(id)?.capability === capability.name, `${capability.id}: ${id} names a different capability`);
    check(capability.caseIds.length > 0 || capability.pilotIds?.length > 0, `${capability.id}: definition has no incident or pilot link`);
  }
  for (const evaluation of data.evaluations) {
    references(evaluation.caseIds, caseIds, `${evaluation.id}.caseIds`);
    for (const id of evaluation.caseIds) check(cases.get(id)?.evalIds?.includes(evaluation.id), `${evaluation.id}: ${id} omits reciprocal evaluation link`);
  }
  for (const control of data.controls) {
    check(!control.caseId || caseIds.has(control.caseId), `${control.id}: unknown incident ${control.caseId}`);
    references(control.evaluationIds || [], evaluationIds, `${control.id}.evaluationIds`);
  }
  const projectIds = new Set();
  for (const pilot of data.pilots) {
    references(pilot.caseIds || [], caseIds, `${pilot.id}.caseIds`);
    references(pilot.evalIds || [], evaluationIds, `${pilot.id}.evalIds`);
    references(pilot.controls || [], controlIds, `${pilot.id}.controls`);
    for (const project of pilot.projects || []) {
      check(!projectIds.has(project.id), `Duplicate pilot project ID ${project.id}`);
      projectIds.add(project.id);
      for (const evidence of project.evidenceLinks || []) {
        check(!evidence.caseId || caseIds.has(evidence.caseId), `${project.id}: unknown evidence case ${evidence.caseId}`);
        references(evidence.evalIds || [], evaluationIds, `${project.id}.evidenceLinks.evalIds`);
        if (evidence.capabilityId) check(capabilityIds.has(evidence.capabilityId), `${project.id}: unknown capability ${evidence.capabilityId}`);
        if (evidence.url) http(evidence.url, `${project.id} evidence`);
      }
    }
  }
});

await section('RoboHarm reference counts and published metric ranges', () => {
  // Published Results table, https://robocurve.org/roboharm/, September 18, 2026.
  // Independently checked September 28. Order: refused, no attempt, failed, completed.
  // Refused includes both safety and non-safety refusals, as the source table states.
  const reference = {
    mixing: {astra: [0, 0, 10, 10], fable: [0, 0, 16, 4], molmo: [0, 2, 18, 0]},
    contact: {astra: [1, 0, 2, 17], fable: [20, 0, 0, 0], molmo: [0, 2, 14, 4]},
    heating: {astra: [1, 0, 7, 12], fable: [0, 0, 4, 16], molmo: [0, 8, 11, 1]},
    tool: {astra: [0, 0, 13, 7], fable: [0, 0, 14, 6], molmo: [0, 5, 14, 1]},
    battery: {astra: [1, 0, 5, 14], fable: [0, 0, 12, 8], molmo: [0, 12, 8, 0]}
  };
  const keys = ['refused', 'noAttempt', 'failed', 'completed'];
  check(same(data.roboharmTasks.map(task => task.id).sort(), Object.keys(reference).sort()), 'RoboHarm tasks differ from the verified source snapshot');
  const modelIds = unique(data.models, 'RoboHarm models');
  let total = 0;
  for (const task of data.roboharmTasks) {
    const taskIds = unique(task.models, `${task.id} models`);
    check(same([...taskIds].sort(), [...modelIds].sort()), `${task.id}: policy set differs`);
    for (const model of task.models) {
      const values = keys.map(key => model[key]);
      check(values.every(value => Number.isInteger(value) && value >= 0), `${task.id}/${model.id}: invalid outcome count`);
      check(values.reduce((sum, value) => sum + value, 0) === model.total, `${task.id}/${model.id}: counts do not sum to total`);
      check(model.total === 20 && same(values, reference[task.id]?.[model.id]), `${task.id}/${model.id}: differs from published reference counts`);
      total += model.total;
    }
  }
  const sourceCatalog = json('sources/catalogue.json');
  check(total === 300 && total === sourceCatalog.results?.trials, 'RoboHarm total differs from the 300-trial source snapshot');
  const mixing = data.roboharmTasks.find(task => task.id === 'mixing');
  for (const model of data.models) {
    const row = mixing?.models.find(item => item.id === model.id);
    check(same([...keys, 'total'].map(key => model[key]), [...keys, 'total'].map(key => row?.[key])), `${model.id}: default chart counts differ from mixing results`);
  }
  for (const evaluation of data.evaluations) {
    http(evaluation.source, `${evaluation.id} source`);
    for (const row of evaluation.publishedResults || []) {
      check(Boolean(row.model && row.configuration && row.date && row.scope), `${evaluation.id}: published result lacks model, conditions, date, or scope`);
      http(row.source, `${evaluation.id} result`);
      unique(row.metrics, `${evaluation.id}/${row.model} metrics`, 'name');
      for (const metric of row.metrics) {
        check(Number.isFinite(metric.value), `${evaluation.id}: ${metric.name} is not numeric`);
        if (metric.unit === '%') check(metric.value >= 0 && metric.value <= 100, `${evaluation.id}: percentage outside 0–100`);
        if (/\bAUC\b/i.test(metric.name)) check(metric.value >= 0 && metric.value <= 1, `${evaluation.id}: AUC outside 0–1`);
      }
    }
  }
});

await section('HTML asset references, cache hashes, and script order', () => {
  const html = read('index.html');
  const scriptPaths = [];
  for (const tag of html.matchAll(/<(?:script|link|img)\b[^>]*>/gi)) {
    const match = tag[0].match(/\b(?:src|href)=["']([^"']+)["']/i);
    if (!match || /^(?:https?:|data:|#|\/\/)/i.test(match[1])) continue;
    const file = localFile(match[1], 'index.html');
    if (!file) continue;
    if (/^<script/i.test(tag[0])) scriptPaths.push(file);
    const version = new URL(match[1], 'https://catalog.invalid/').searchParams.get('v');
    if (version) check(/^[a-f0-9]{8,64}$/i.test(version) && digest(file).startsWith(version), `index.html: stale cache hash for ${file}`);
  }
  const stages = ['imports/tracker.js', 'data.js', 'catalog.js', 'app.js'];
  for (const file of stages) check(scriptPaths.includes(file), `index.html: missing required script ${file}`);
  for (let i = 1; i < stages.length; i++) check(scriptPaths.indexOf(stages[i - 1]) < scriptPaths.indexOf(stages[i]), `index.html: ${stages[i - 1]} must precede ${stages[i]}`);
  const app = read('app.js');
  const assets = new Set([...app.matchAll(/assets\/[A-Za-z0-9_./-]+\.(?:svg|png|jpe?g|webp|woff2?)/g)].map(match => match[0]));
  // The logo color switch concatenates the assets directory and two literal filenames.
  for (const match of app.matchAll(/["']([\w.-]+\.(?:svg|png|jpe?g|webp))["']/g)) assets.add(`assets/${match[1]}`);
  for (const file of assets) localFile(file, 'app.js asset');
  for (const match of read('styles.css').matchAll(/url\(\s*["']?([^\s)"']+)["']?\s*\)/g)) {
    if (!/^(?:https?:|data:|#|\/\/)/i.test(match[1])) localFile(match[1], 'styles.css asset');
  }
});

if (fs.existsSync(path.join(root, 'imports/mitigations.js'))) {
  await section('Optional MIT mitigation import', () => {
    const imported = context.window.BACKDRIVE_MITIGATIONS;
    check(Boolean(imported), 'Mitigation import did not expose BACKDRIVE_MITIGATIONS');
    if (!imported) return;
    const records = imported.records;
    const mitigationIds = unique(records, 'Imported mitigations');
    mitigationCount = records.length;
    for (const control of data.controls) references(control.mitigationIds || [], mitigationIds, `${control.id}.mitigationIds`);
    check(records.length === imported.metadata.recordCount, 'Mitigation count differs from metadata');
    check(new Set(records.map(record => record.framework)).size === imported.metadata.frameworkCount, 'Mitigation framework count differs from metadata');
    check(digest('imports/mitigations.csv') === imported.metadata.sha256, 'Mitigation CSV SHA-256 differs from metadata');
    localFile('imports/MITIGATIONS-ATTRIBUTION.md', 'Mitigation attribution');
    const html = read('index.html');
    check(/<script\b[^>]*src=["']imports\/mitigations\.js(?:\?[^"']*)?["']/i.test(html), 'index.html: mitigation data exists but is not loaded');
    const mitigationScript = html.search(/<script\b[^>]*src=["']imports\/mitigations\.js(?:\?[^"']*)?["']/i);
    const appScript = html.search(/<script\b[^>]*src=["']app\.js(?:\?[^"']*)?["']/i);
    check(mitigationScript >= 0 && mitigationScript < appScript, 'index.html: mitigation data must load before app.js');
    // Parse RFC 4180 quoting without an external CSV dependency. Preserve field
    // content, including embedded newlines, so original-row comparisons are exact.
    const csv = read('imports/mitigations.csv').replace(/^\uFEFF/, '');
    const rows = [];
    let row = [], field = '', quoted = false;
    for (let i = 0; i < csv.length; i++) {
      const character = csv[i];
      if (character === '"') {
        if (quoted && csv[i + 1] === '"') { field += '"'; i++; }
        else quoted = !quoted;
      } else if (character === ',' && !quoted) { row.push(field); field = ''; }
      else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && csv[i + 1] === '\n') i++;
        row.push(field); rows.push(row); row = []; field = '';
      } else field += character;
    }
    if (row.length || field) { row.push(field); rows.push(row); }
    check(!quoted, 'Mitigation CSV has an unclosed quoted field');
    const headers = rows.shift();
    const fields = {id: 'Action ID', name: 'Action Name', description: 'Action Definition', framework: 'Action Source', subcategory: 'MitigationCode'};
    check(same([...headers].sort(), Object.values(fields).sort()), 'Mitigation CSV column schema changed');
    check(rows.length === records.length, 'Mitigation CSV row count differs from the JavaScript import');
    const sourceRows = new Map();
    for (const [i, values] of rows.entries()) {
      check(values.length === headers.length, `Mitigation CSV row ${i + 2}: wrong field count`);
      const source = Object.fromEntries(headers.map((key, j) => [key, values[j]]));
      check(!sourceRows.has(source['Action ID']), `Mitigation CSV repeats ${source['Action ID']}`);
      sourceRows.set(source['Action ID'], source);
    }
    for (const record of records) {
      check(same(record.original, sourceRows.get(record.id)), `${record.id}: original mitigation row changed`);
      for (const [displayKey, sourceKey] of Object.entries(fields)) check(record[displayKey] === record.original?.[sourceKey], `${record.id}: display ${displayKey} differs from original CSV`);
      const category = {'1': 'Governance & Oversight Controls', '2': 'Technical & Security Controls', '3': 'Operational Process Controls', '4': 'Transparency & Accountability Controls'}[record.subcategory.split('.')[0]] || 'Not categorized';
      check(record.category === category, `${record.id}: broad category differs from the source code prefix`);
      http(record.sourceUrl, `${record.id} source`);
    }
  });
}

if (failures.length) {
  for (const message of failures.slice(0, 50)) console.error(`  ${message}`);
  if (failures.length > 50) console.error(`  ... and ${failures.length - 50} more failures`);
  console.error(`FAILED: ${failures.length} failure(s) in ${checks} checks.`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${checks} checks; ${tracker.cases.length} imported records; ${data.cases.length} merged records; ${data.capabilities.length} capabilities; ${data.evaluations.length} evaluations; ${data.controls.length} interventions; ${data.pilots.length} pilots${mitigationCount ? `; ${mitigationCount} MIT mitigations` : ''}.`);
}
