// Requires sharp. Run with --apply to size CV marks from the contact reference.
// --report=/absolute/directory writes the complete before/after measurements.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'content/institution-logos.json');
const logos = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const circles = new Set(['oxy', 'caltech', 'hoover', 'nti', 'change', 'verum', 'bis', 'state', 'newspaper']);
const round = value => Math.round(value * 100) / 100;

function convexHull(points) {
  points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = list => {
    const out = [];
    for (const point of list) {
      while (out.length > 1 && cross(out.at(-2), out.at(-1), point) <= 0) out.pop();
      out.push(point);
    }
    return out.slice(0, -1);
  };
  return [...half(points), ...half([...points].reverse())];
}

async function measure(asset) {
  const source = path.join(root, asset.source);
  const native = await sharp(source).metadata();
  const {data, info} = await sharp(source, {density: 384})
    .resize(1024, 1024, {fit: 'inside'}).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  let painted = 0, left = info.width, right = 0, top = info.height, bottom = 0;
  const boundary = [];
  for (let y = 0; y < info.height; y++) {
    let first = info.width, last = -1;
    for (let x = 0; x < info.width; x++) {
      const alpha = data[(y * info.width + x) * 4 + 3] / 255;
      painted += alpha;
      if (alpha >= .5) {first = Math.min(first, x); last = x;}
    }
    if (last >= 0) {
      boundary.push([first, y], [last + 1, y + 1]);
      left = Math.min(left, first); right = Math.max(right, last + 1);
      top = Math.min(top, y); bottom = y + 1;
    }
  }
  const hull = convexHull(boundary);
  const footprint = Math.abs(hull.reduce((sum, p, i) => {
    const q = hull[(i + 1) % hull.length];
    return sum + p[0] * q[1] - q[0] * p[1];
  }, 0)) / 2;
  const atWidth = width => {
    const scale = width / info.width;
    return {
      width: round(width), height: round(width * native.height / native.width),
      visible_width: round((right - left) * scale), visible_height: round((bottom - top) * scale),
      painted_area: round(painted * scale * scale), footprint_area: round(footprint * scale * scale),
    };
  };
  const beforeWidth = asset.kind === 'contact' ? 19 * info.width / Math.max(info.width, info.height) : logos[asset.id].width;
  return {...asset, before: atWidth(beforeWidth), atWidth, footprint, rasterWidth: info.width, span: Math.max(right - left, bottom - top)};
}

(async () => {
  const assets = [
    ...Object.entries(logos).map(([id, logo]) => ({kind: 'cv', id, name: logo.aliases[0], source: `assets/logos/${logo.file}`})),
    ...fs.readdirSync(path.join(root, 'assets/icons')).filter(file => file.endsWith('.svg'))
      .map(file => ({kind: 'contact', id: path.basename(file, '.svg'), name: path.basename(file, '.svg'), source: `assets/icons/${file}`})),
  ];
  const measured = [];
  for (const asset of assets) measured.push(await measure(asset));
  const references = measured.filter(row => row.kind === 'contact').map(row => row.before.footprint_area).sort((a, b) => a - b);
  const target = references[Math.floor(references.length / 2)];
  const diameter = Math.sqrt(4 * target / Math.PI);
  const baseWidths = new Map(measured.map(row => [row.id, row.kind === 'contact' ? row.before.width :
    row.rasterWidth * (circles.has(row.id) ? diameter / row.span : Math.sqrt(target / row.footprint))]));
  const report = {contact_box_px: 19, target_footprint_px2: target, circle_visible_diameter_px: round(diameter), rows: []};
  for (const row of measured) {
    let width = row.before.width;
    let rule = 'unchanged contact reference';
    if (row.kind === 'cv') {
      width = baseWidths.get(row.id);
      rule = circles.has(row.id) ? 'common visible diameter' : 'common outer footprint area';
      const referenceId = logos[row.id].painted_area_reference;
      if (referenceId) {
        const reference = measured.find(item => item.kind === 'cv' && item.id === referenceId);
        if (!reference) throw new Error(`Missing painted-area reference: ${referenceId}`);
        const referenceArea = reference.atWidth(baseWidths.get(referenceId)).painted_area;
        width *= Math.sqrt(referenceArea / row.atWidth(width).painted_area);
        rule = `painted area matched to ${reference.name}`;
      }
      logos[row.id].width = round(width);
      logos[row.id].height = row.atWidth(width).height;
    }
    report.rows.push({kind: row.kind, id: row.id, name: row.name, source: row.source, rule, before: row.before, after: row.atWidth(round(width))});
  }
  if (process.argv.includes('--apply')) fs.writeFileSync(configPath, JSON.stringify(logos, null, 2) + '\n');
  const destination = process.argv.find(arg => arg.startsWith('--report='))?.slice(9);
  if (destination) {
    fs.mkdirSync(destination, {recursive: true});
    fs.writeFileSync(path.join(destination, 'logo-measurements.json'), JSON.stringify(report, null, 2) + '\n');
    const fields = ['width', 'height', 'visible_width', 'visible_height', 'painted_area', 'footprint_area'];
    const csv = value => '"' + String(value).replaceAll('"', '""') + '"';
    const lines = [['kind', 'logo', 'rule', ...fields.map(f => 'before_' + f), ...fields.map(f => 'after_' + f)].map(csv).join(',')];
    for (const row of report.rows) lines.push([row.kind, row.name, row.rule, ...fields.map(f => row.before[f]), ...fields.map(f => row.after[f])].map(csv).join(','));
    fs.writeFileSync(path.join(destination, 'logo-measurements.csv'), lines.join('\n') + '\n');
  }
  console.log(JSON.stringify(report, null, 2));
})().catch(error => {console.error(error); process.exit(1);});
