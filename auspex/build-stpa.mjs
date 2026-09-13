import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

// The A.1 example is deliberately independent of the superseded catalogue model.
const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const model = JSON.parse(await read('stpa-a1.json'));
const bundle = `// Generated from stpa-a1.json by build-stpa.mjs.\nwindow.AuspexSTPAData = ${JSON.stringify(model, null, 2)};\n`;
await writeFile(new URL('stpa-data.js', import.meta.url), bundle);
const context = vm.createContext({ window: { AuspexSTPAData: model } });
vm.runInContext(await read('stpa.js'), context);
let html = await read('pathways.html');
const article = /<article id="X-01" data-group="X">[\s\S]*?<\/article>(?=<article id="X-02")/;
if (!article.test(html)) throw new Error('A.1 static article boundary not found');
const oldArticle = html.match(article)[0];
const mappedEvidence = oldArticle.match(/<!-- A1-EVIDENCE-START -->([\s\S]*?)<!-- A1-EVIDENCE-END -->/)?.[1]
  || oldArticle.match(/(<h3>Mapped evidence<\/h3>[\s\S]*?)(?=\s*<h3>Required conditions<\/h3>)/)?.[1];
if (!mappedEvidence) throw new Error('Preserved A.1 case evidence not found');
html = html.replace(article, `<article id="X-01" data-group="X"><p class="eyebrow">A.1 · Pathway</p>${context.window.AuspexSTPA.staticPage()}<!-- A1-EVIDENCE-START -->${mappedEvidence}<!-- A1-EVIDENCE-END --><a href="./?p=A.1">Explore A.1 in Auspex ↗</a></article>`);
if (!html.includes('href="stpa.css"')) html = html.replace('<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="stpa.css">');
html = html.replace(/(<a href="#X-01">)A\.1[^<]*(<\/a>)/, `$1A.1 — ${model.title}$2`);
await writeFile(new URL('pathways.html', import.meta.url), html);
console.log('Built the A.1 bundle and static reading version.');
