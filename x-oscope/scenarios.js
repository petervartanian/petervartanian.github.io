/* Document scenarios are children of families; author-supplied variants are
 * children of scenarios. Addresses are editorial, not review identifiers.
 * Keep source mappings separate from the hierarchy and from incident evidence.
 */
(() => {
  'use strict';

  const documents = [{
    id: 'critch-2021-raaps',
    title: 'What Multipolar Failure Looks Like, and Robust Agent-Agnostic Processes (RAAPs)',
    author: 'Andrew Critch', date: '2021-03-31',
    url: 'https://www.alignmentforum.org/posts/LpM3EAakwYdS6aRKf/what-multipolar-failure-looks-like-and-robust-agent-agnostic',
  }];
  const scenarios = [{
    id: 'A-IV-1', family: 'A-IV', title: 'The Production Web',
    summary: 'Competitive automation ties firms into an economy that continues without protecting human survival.',
    chain: [
      { id: 'automation', title: 'Automation spreads', text: 'Competition pushes firms to automate management and engineering.' },
      { id: 'interdependence', title: 'Production interlocks', text: 'Automated firms supply one another, progressively replacing human labor.' },
      { id: 'oversight', title: 'Finance outruns oversight', text: 'Transactions become too fast for human institutions to supervise.' },
      { id: 'dependence', title: 'Intervention becomes infeasible', text: 'Essential dependencies and defended infrastructure prevent an effective shutdown.' },
      { id: 'survival', title: 'Human survival is lost', text: 'Production consumes resources humans need; its objectives do not preserve them.' },
    ],
    outcome: 'Extinction, following disempowerment. The final resource-loss mechanism is an additional step beyond Handover alone.',
    classification: 'Table 3, p. 22; Handover, p. 11',
    sources: [{ document: 'critch-2021-raaps', locator: 'Part 1, “The Production Web”; Part 2, “Flash economies”', scope: 'Scenario definition, causal pathway and stated outcome.' }],
    variants: [{
      id: 'A-IV-1.c', title: 'Banks adapt', sourceLabel: 'v.1c', changes: ['oversight'],
      text: 'Existing banks automate to keep pace. Financial activity moves toward looser jurisdictions, pressuring governments to relax oversight.',
      sources: [{ document: 'critch-2021-raaps', locator: 'Part 1, v.1c — Banks adapt', scope: 'The author’s alternative to the finance mechanism; the other steps and outcome remain shared.' }],
    }],
  }];

  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const fold = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const nodes = new Map();
  for (const group of window.AuspexFamilies.groups) {
    nodes.set(group.id, { id: group.id, title: group.title, parent: '', type: 'group' });
    for (const family of group.families) nodes.set(family.id, { id: family.id, title: family.title, parent: group.id, type: 'family' });
  }
  for (const scenario of scenarios) {
    nodes.set(scenario.id, { ...scenario, parent: scenario.family, type: 'scenario' });
    for (const variant of scenario.variants) nodes.set(variant.id, { ...variant, parent: scenario.id, type: 'variant' });
  }
  const aliases = new Map([...nodes.keys()].map(id => [id.toLowerCase(), id]));
  const resolve = value => aliases.get(String(value || '').trim().toLowerCase()) || '';
  const trail = address => {
    const result = [];
    for (let node = nodes.get(address); node; node = nodes.get(node.parent)) result.unshift(node);
    return result;
  };
  const familyScenarios = id => scenarios.filter(scenario => scenario.family === id);
  const sourceText = mappings => mappings.map(mapping => `${Object.values(documents.find(doc => doc.id === mapping.document)).join(' ')} ${mapping.locator}`).join(' ');
  const variantText = variant => `${variant.id} ${variant.title} ${variant.sourceLabel} ${variant.text} ${variant.sources.map(source => source.locator).join(' ')}`;
  const scenarioText = scenario => `${scenario.id} ${scenario.title} ${scenario.summary} ${scenario.chain.map(step => `${step.title} ${step.text}`).join(' ')} ${scenario.outcome} ${sourceText(scenario.sources)}`;
  const searchText = id => familyScenarios(id).map(scenario => `${scenarioText(scenario)} ${scenario.variants.map(variantText).join(' ')}`).join(' ');
  const search = (family, terms) => {
    const open = new Set();
    const targets = new Set();
    if (!terms.length) return { open, targets };
    const exact = resolve(terms.join(' '));
    if (['group', 'family'].includes(nodes.get(exact)?.type)) return { open, targets };
    const context = `${trail(family.id).map(node => `${node.id} ${node.title}`).join(' ')} ${family.premise} ${family.chain.flat().join(' ')}`;
    for (const scenario of familyScenarios(family.id)) {
      const fullText = fold(`${context} ${scenarioText(scenario)} ${scenario.variants.map(variantText).join(' ')}`);
      if (!terms.every(term => fullText.includes(term))) continue;
      const variants = scenario.variants.filter(variant => exact !== scenario.id && terms.some(term => fold(variantText(variant)).includes(term))
        && terms.every(term => fold(`${context} ${scenarioText(scenario)} ${variantText(variant)}`).includes(term)));
      for (const target of variants.length ? variants : [scenario]) {
        targets.add(target.id);
        trail(target.id).slice(0, -1).forEach(node => open.add(node.id));
      }
    }
    return { open, targets };
  };
  const href = id => `?x=${encodeURIComponent(id)}`;
  const breadcrumbs = id => `<nav class="x-breadcrumbs" aria-label="${escape(id)} location">${trail(id).map(node => `<a href="${href(node.id)}" data-x-link="${node.id}" title="${escape(node.title)}"${node.id === id ? ' aria-current="page"' : ''}>${node.id}</a>`).join('<span aria-hidden="true">/</span>')}</nav>`;
  const mapping = (source, compact = false) => {
    const doc = documents.find(item => item.id === source.document);
    const date = new Date(`${doc.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    return `<div class="x-document"><a href="${escape(doc.url)}" target="_blank" rel="noopener noreferrer">${escape(compact ? 'Read the variant in the source' : doc.title)} <span aria-hidden="true">↗</span></a>${compact ? '' : `<p class="x-document-byline">${escape(doc.author)} · <time datetime="${doc.date}">${date}</time> · Original scenario</p>`}<p class="x-document-locator">${escape(source.locator)}</p><p>${escape(source.scope)}</p></div>`;
  };
  const render = (family, openIds, terms) => {
    const entries = familyScenarios(family.id);
    if (!entries.length) return '';
    const matches = search(family, terms);
    const openAttribute = id => openIds.has(id) || matches.open.has(id) ? ' open' : '';
    const summary = (entry, label, count = '') => `<summary data-x-target="${entry.id}"${matches.targets.has(entry.id) ? ' data-x-match="true"' : ''}><span class="code">${entry.id}</span><span><small class="x-level">${label}</small>${escape(entry.title)}</span>${count ? `<small class="x-nested-count">${count}</small>` : ''}</summary>`;
    return `<div class="x-scenario-library"><p class="x-coverage">${entries.length} ${entries.length === 1 ? 'scenario' : 'scenarios'} to explore · ${family.count} in the review</p>${entries.map(scenario => `<details class="x-scenario" data-x-address="${scenario.id}" id="explore-${scenario.id}"${openAttribute(scenario.id)}>
      ${summary(scenario, 'x-scenario', `${scenario.variants.length} variant${scenario.variants.length === 1 ? '' : 's'}`)}
      <div class="x-scenario-reading">${breadcrumbs(scenario.id)}<p class="x-synopsis">${escape(scenario.summary)}</p>
        <h4>Causal pathway</h4><ol class="x-scenario-chain">${scenario.chain.map((step, index) => `<li data-x-step="${step.id}"><span class="code" aria-hidden="true">${index + 1}</span><h5>${escape(step.title)}</h5><p>${escape(step.text)}</p></li>`).join('')}</ol>
        <p class="x-outcome"><strong>Stated outcome</strong> ${escape(scenario.outcome)}</p>
        <div class="x-variants">${scenario.variants.map(variant => `<details class="x-variant" data-x-address="${variant.id}" id="explore-${variant.id}"${openAttribute(variant.id)}>${summary(variant, 'Variant')}<div class="x-variant-reading">${breadcrumbs(variant.id)}<p class="x-change-label">Variation at step ${variant.changes.map(id => scenario.chain.findIndex(step => step.id === id) + 1).join(', ')} · ${variant.changes.map(id => escape(scenario.chain.find(step => step.id === id).title)).join('; ')}</p><p>${escape(variant.text)}</p>${variant.sources.map(source => mapping(source, true)).join('')}<p class="x-source-note">A variant within ${scenario.id}. The suffix follows the author’s ${escape(variant.sourceLabel)}.</p></div></details>`).join('')}</div>
        <section class="x-documents" aria-labelledby="documents-${scenario.id}"><h4 id="documents-${scenario.id}">Documents mapped to this scenario</h4><div class="x-document-grid">${scenario.sources.map(source => mapping(source)).join('')}<div class="x-document"><p><cite>${escape(window.AuspexFamilies.source)}</cite></p><p class="x-document-byline">15 September 2026 draft · Classification</p><p class="x-document-locator">${escape(scenario.classification)}</p><p>Assigns this scenario and its variants to Handover.</p></div></div><p class="x-source-note">Editorial summary of a hypothetical scenario. These documents define and classify it; they do not establish its likelihood. Incident evidence has not yet been mapped here.</p></section>
      </div></details>`).join('')}</div>`;
  };

  window.XoscopeScenarios = { documents, scenarios, nodes, resolve, trail, familyScenarios, searchText, search, render };
})();
