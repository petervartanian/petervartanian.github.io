import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const context = vm.createContext({ window: {} });
for (const file of ['families.js', 'scenarios.js']) {
  vm.runInContext(await readFile(new URL(file, import.meta.url), 'utf8'), context);
}
const { XoscopeScenarios: library, AuspexFamilies: review } = context.window;
const families = review.groups.flatMap(group => group.families);
const ids = [
  ...review.groups.map(group => group.id), ...families.map(family => family.id),
  ...library.scenarios.flatMap(scenario => [scenario.id, ...scenario.variants.map(variant => variant.id)]),
];
assert.equal(new Set(ids).size, ids.length, 'Every group, family, scenario and variant has a unique address');
assert.equal(library.nodes.size, ids.length);
assert.equal(new Set(library.documents.map(doc => doc.id)).size, library.documents.length);
for (const doc of library.documents) {
  assert.equal(new URL(doc.url).protocol, 'https:');
  assert(doc.author && doc.title && /^\d{4}-\d{2}-\d{2}$/.test(doc.date));
}
const checkSources = (entry) => {
  assert(entry.sources.length > 0, `${entry.id}: missing document mappings`);
  for (const mapping of entry.sources) {
    assert(library.documents.some(doc => doc.id === mapping.document), `${entry.id}: broken document reference`);
    assert(mapping.locator && mapping.scope, `${entry.id}: identify the passage and what it supports`);
  }
};
for (const scenario of library.scenarios) {
  const family = families.find(item => item.id === scenario.family);
  assert(family, `${scenario.id}: unknown family`);
  assert(scenario.id.startsWith(`${family.id}-`));
  assert(scenario.classification && scenario.outcome);
  assert.equal(new Set(scenario.chain.map(step => step.id)).size, scenario.chain.length);
  checkSources(scenario);
  for (const variant of scenario.variants) {
    assert(variant.id.startsWith(`${scenario.id}.`));
    assert(variant.sourceLabel, `${variant.id}: source must identify an author-supplied variant`);
    assert(variant.changes.length);
    assert(variant.changes.every(id => scenario.chain.some(step => step.id === id)), `${variant.id}: branch refers to missing steps`);
    checkSources(variant);
    assert.equal(library.trail(variant.id).length, 4);
    assert.equal(library.trail(variant.id).at(-2).id, scenario.id);
  }
}
for (const family of families) {
  assert(library.familyScenarios(family.id).length <= family.count, 'Available scenarios must not inflate review counts');
}
const handover = families.find(family => family.id === 'A-IV');
const html = library.render(handover, new Set(['A-IV-1', 'A-IV-1.c']), []);
assert(html.includes('Documents mapped to this scenario') && html.includes('Table 3, p. 22'));
assert(!html.includes('file://') && !html.includes('/Users/') && !html.includes('Systematic_Literature_Review_of_Existential_Risks_Paper.pdf'), 'Keep the private draft PDF off the public site');
assert(html.includes('target="_blank" rel="noopener noreferrer"'));
console.log(`Validated ${library.scenarios.length} scenario, ${library.scenarios.reduce((count, scenario) => count + scenario.variants.length, 0)} author-supplied variant, document mappings, hierarchy and review counts.`);
