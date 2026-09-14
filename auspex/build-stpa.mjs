import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const parse = async name => JSON.parse(await read(name));
const models = await Promise.all(['a','b','c','d','e','f','h'].map(letter => parse(`stpa-${letter}1.json`)));
const barrierStates = await parse('barrier-states.json');
const registry = Object.fromEntries(models.map(model => [model.pathway, model]));
const bundle = `// Generated from STPA models and barrier-states.json by build-stpa.mjs.\nwindow.AuspexSTPAModels = ${JSON.stringify(registry, null, 2)};\nwindow.AuspexSTPAData = window.AuspexSTPAModels['X-01'];\nwindow.AuspexBarrierStateData = ${JSON.stringify(barrierStates, null, 2)};\n`;
await writeFile(new URL('stpa-data.js', import.meta.url), bundle);
const context = vm.createContext({ window: { AuspexSTPAModels: registry, AuspexSTPAData: models[0], AuspexBarrierStateData: barrierStates } });
vm.runInContext(await read('stpa.js'), context);
const presentation = context.window.AuspexSTPA;
const [catalogue, assessments, evidence, incidents] = await Promise.all(['pathways.json','assessments.json','evidence.json','incidents.json'].map(parse));
const sources = new Map(evidence.sources.map(s => [s.id,s]));
const passages = new Map(evidence.passages.map(p => [p.id,p]));
for (const model of models) {
  for (const s of model.additionalEvidence?.sources || []) sources.set(s.id,s);
  for (const p of model.additionalEvidence?.passages || []) passages.set(p.id,p);
}
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceLinks = ids => [...new Set(ids.map(id => passages.get(id)?.source))].filter(Boolean).map((id,index) => `<a class="source-dot" href="${esc(sources.get(id).url)}" target="_blank" rel="noopener noreferrer" title="${presentation.sourceNumber(index)}. ${esc(sources.get(id).title)}" aria-label="Open source ${presentation.sourceNumber(index)}: ${esc(sources.get(id).title)}"><span class="source-disc" aria-hidden="true">${presentation.sourceNumber(index)}</span></a>`).join('');
function mappedEvidence(model) {
  const overrides = new Map((model.assessments || []).map(a => [a.id,a]));
  const cases = assessments.filter(a => a.pathway === model.pathway).map(a => overrides.get(a.id) || a);
  return `<h3>Mapped evidence</h3>${cases.map(a => {
    const overlay = model.presentation.overlays[a.incident];
    const incident = incidents.find(i => i.id === a.incident);
    const barriers = presentation.barriers(a);
    return `<section class="stpa-mapped-case"><h4>${presentation.notedTitle(overlay.title,`case-${a.id}-reference`,`case-${a.id}-footnote`,'Scope of this case')}</h4><p>${esc(incident.date)} · ${esc(overlay.kind)}</p><p>${esc(overlay.observed)}</p><p class="a1-footnote" id="case-${a.id}-footnote"><a href="#case-${a.id}-reference" aria-label="Return to case title">*</a> ${esc(overlay.limit)}</p>${barriers.length ? barriers.map(b => {
      const detail = b;
      return `<details><summary>${esc(detail.title)} · ${esc(presentation.barrierStates(detail).map(presentation.conditionLabel).join(" · "))}</summary><p class="a1-footnote">${esc(detail.conditionBasis)}</p><dl><dt>Mechanism</dt><dd>${esc(b.action)}</dd><dt>Evidence</dt><dd>${esc(b.efficacy)}</dd><dt>Brittleness</dt><dd>${esc(detail.strongerAI)}</dd><dt>Failure</dt><dd>${esc(b.failure)}</dd></dl>${detail.reinforcement ? `<p><strong>Proposed reinforcement</strong> · ${esc(detail.reinforcement.proposal)}</p><p><strong>Test</strong> · ${esc(detail.reinforcement.test)}</p>` : ''}<p>${sourceLinks(b.evidence)}</p></details>`;
    }).join('') : '<p>Barrier performance not established.</p>'}<details><summary>Case observations & evidence</summary>${(a.trace || []).map(t => `<p>${esc(t.text)}</p><p>${sourceLinks(t.evidence)}</p>`).join('')}${[...new Set([...a.evidence,...a.barriers.flatMap(b=>b.evidence)])].map(id => {
      const p = passages.get(id);
      if (!p) throw new Error(`Missing evidence ${id}`);
      return `<section><h5>${esc(p.title)}</h5><p>${esc(p.locator)}</p>${p.kind === 'quote' ? `<blockquote>${esc(p.text)}</blockquote>` : `<p>${esc(p.text)}</p>`}<p>${esc(p.scope)}</p><p>${sourceLinks([id])}</p></section>`;
    }).join('')}</details></section>`;
  }).join('')}`;
}
let html = await read('pathways.html');
for (const model of models) {
  presentation.use(model.pathway);
  const pathway = catalogue.pathways.find(p => p.id === model.pathway);
  const start = html.indexOf(`<article id="${model.pathway}" data-group="${pathway.group}">`);
  if (start < 0) throw new Error(`Missing static article ${model.pathway}`);
  const nextArticle = /<article id="[^"]+" data-group="[^"]+"[^>]*>/.exec(html.slice(start + 1));
  if (!nextArticle) throw new Error(`Missing next static article after ${model.pathway}`);
  const next = start + 1 + nextArticle.index;
  const marker = model.displayId.replace('.','');
  const article = `<article id="${model.pathway}" data-group="${pathway.group}"><p class="eyebrow">${model.displayId} · Pathway</p>${presentation.staticPage()}<!-- ${marker}-EVIDENCE-START -->${mappedEvidence(model)}<!-- ${marker}-EVIDENCE-END --><a href="./?p=${model.displayId}">Explore ${model.displayId} in Auspex ↗</a></article>`;
  html = html.slice(0,start) + article + html.slice(next);
  html = html.replace(new RegExp(`(<a href="#${model.pathway}">)[^<]*(</a>)`), `$1${model.displayId} — ${esc(model.title)}$2`);
}
// Keep unworked titles addressable while leaving their content blank.
const starts = [...html.matchAll(/<article id="([^"]+)" data-group="([^"]+)"[^>]*>/g)];
for (let i = starts.length - 1; i >= 0; i--) {
  const match = starts[i];
  if (registry[match[1]]) continue;
  const p = catalogue.pathways.find(p => p.id === match[1]);
  const end = starts[i + 1]?.index ?? html.indexOf('</main>', match.index);
  if (end < 0) throw new Error(`Missing reader boundary ${p.id}`);
  html = html.slice(0, match.index) + `<article id="${p.id}" data-group="${p.group}" data-unworked="true"><p class="eyebrow">${p.displayId} · Pathway</p><h2>${esc(p.title)}</h2></article>` + html.slice(end);
}
html = html.replace(/href="stpa.css(?:\?[^\"]*)?"/, 'href="stpa.css?v=24.5"');
await writeFile(new URL('pathways.html', import.meta.url), html);
console.log('Built seven worked examples, barrier states and matching readers; other entries are blank.');
