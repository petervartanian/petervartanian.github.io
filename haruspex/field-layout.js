/* Stable field packing; camera projection has no DOM or canvas work. */
((root) => {
  'use strict';
  const finite = Number.isFinite;
  const KIND_ORDER = { clock: 0, day: 1, window: 2 };
  function seeded(seed) {
    let value = seed >>> 0;
    return () => { value = (1664525 * value + 1013904223) >>> 0; return value / 4294967296; };
  }
  function identifierSeed(id) {
    let seed = 2166136261;
    for (let i = 0; i < id.length; i += 1) seed = Math.imul(seed ^ id.charCodeAt(i), 16777619);
    return seed >>> 0;
  }
  function validateCamera(range, vertical, rect) {
    if (!Array.isArray(range) || !range.every(finite) || range[1] <= range[0]) throw new Error('A finite increasing time range is required.');
    if (!Array.isArray(vertical) || !vertical.every(finite) || vertical[1] <= vertical[0]) throw new Error('A finite increasing vertical range is required.');
    if (!rect || !['left', 'right', 'top', 'bottom'].every((key) => finite(rect[key])) || rect.right <= rect.left || rect.bottom <= rect.top) throw new Error('A nonempty field rectangle is required.');
  }
  function intersects(time, range) {
    return time.kind === 'clock'
      ? time.start >= range[0] && time.start < range[1]
      : (time.start === null || time.start < range[1]) && (time.end === null || time.end > range[0]);
  }
  /**
   * Call when geometry, data or severity bands change, not on camera/filter input.
   * events use the app's {_time:{start,end,kind}, id} shape. bandKey and radius
   * are caller-supplied pure accessors. Band start/end coordinates are normalized.
   * No input event, time extent, band or rectangle is mutated.
   */
  function create({ events, bands, range, rect, bandKey, radius = () => 2.2 }) {
    validateCamera(range, [0, 1], rect);
    const bandMap = new Map(bands.map((band) => [String(band.key), band]));
    const identifiers = new Set();
    const unplaced = [];
    const omitted = [];
    const candidates = [];
    for (const event of events) {
      if (identifiers.has(event.id)) throw new Error(`Duplicate event ID: ${event.id}`);
      identifiers.add(event.id);
      const time = event._time;
      if (!time || !finite(time.start) || !finite(time.end)) { unplaced.push(event); continue; }
      if (time.kind !== 'clock' && time.end <= time.start) throw new Error(`Invalid source time window: ${event.id}`);
      if (time.kind === 'clock' && time.end !== time.start) throw new Error(`Clock event must be an instant: ${event.id}`);
      if (!intersects(time, range)) { omitted.push(event); continue; }
      const key = String(bandKey(event));
      const band = bandMap.get(key);
      if (!band || !finite(band.start) || !finite(band.end) || band.end <= band.start) throw new Error(`Invalid severity band: ${event.id}`);
      const r = radius(event);
      if (!finite(r) || r <= 0) throw new Error(`Invalid marker radius: ${event.id}`);
      candidates.push({ event, id: event.id, kind: time.kind, start: time.start, end: time.end, bandKey: key, band, radius: r });
    }
    candidates.sort((a, b) => (KIND_ORDER[a.kind] ?? 2) - (KIND_ORDER[b.kind] ?? 2) || a.id.localeCompare(b.id));
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const timeWidth = range[1] - range[0];
    const grid = new Map();
    const cell = Math.max(12, ...candidates.map((point) => point.radius * 3.2 + 2));
    const gridKey = (x, y) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
    const clearance = (x, y, radius) => {
      const gx = Math.floor(x / cell); const gy = Math.floor(y / cell);
      let margin = Infinity;
      for (let dx = -1; dx <= 1; dx += 1) for (let dy = -1; dy <= 1; dy += 1) {
        for (const prior of grid.get(`${gx + dx},${gy + dy}`) || []) {
          // Account conservatively for equal-area triangular marker extents.
          margin = Math.min(margin, Math.hypot(prior.x - x, prior.y - y) - (radius + prior.radius) * 1.56);
        }
      }
      return margin;
    };
    const points = [];
    let attempts = 0;
    for (const candidate of candidates) {
      const random = seeded(identifierSeed(candidate.id));
      const { band } = candidate;
      let best;
      for (let i = 0; i < 30; i += 1) {
        attempts += 1;
        const fraction = candidate.kind === 'clock' ? 0 : .03 + random() * .94;
        const time = candidate.kind === 'clock' ? candidate.start : candidate.start + fraction * (candidate.end - candidate.start);
        const x = rect.left + (time - range[0]) / timeWidth * width;
        const normalizedWave = Math.sin((x / Math.max(1, rect.right)) * 7 + band.start * 8) * Math.min(13 / height, (band.end - band.start) * .1);
        const yWorld = (band.start + band.end) / 2 + normalizedWave + (random() - .5) * (band.end - band.start) * .62;
        const y = rect.top + yWorld * height;
        const space = clearance(x, y, candidate.radius);
        if (!best || space > best.space) best = { x, y, yWorld, fraction, time, space };
        if (space >= 2) break;
      }
      const point = { event: candidate.event, id: candidate.id, kind: candidate.kind, start: candidate.start, end: candidate.end, bandKey: candidate.bandKey, radius: candidate.radius, time: best.time, fraction: best.fraction, yWorld: best.yWorld };
      points.push(point);
      const key = gridKey(best.x, best.y);
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push({ x: best.x, y: best.y, radius: candidate.radius });
    }
    return { version: '1.0.0', points, unplaced, omitted, geometry: { ...rect }, packingRange: [...range], diagnostics: { candidates: candidates.length, attempts } };
  }
  /**
   * A single inexpensive pass. ids is an optional Set of filter-matching IDs.
   * Clock coordinates preserve source instants. Uncertain points reuse their
   * cached fraction within the current source-window intersection. That moving
   * position is layout, never a source timestamp. yWorld never changes on pan,
   * zoom or filtering. Open intervals remain in layout.unplaced.
   */
  function project(layout, { range, vertical = [0, 1], rect = layout.geometry, ids = null, clipY = true, magnify = true } = {}) {
    validateCamera(range, vertical, rect);
    const xFactor = (rect.right - rect.left) / (range[1] - range[0]);
    const yFactor = (rect.bottom - rect.top) / (vertical[1] - vertical[0]);
    const magnification = magnify ? Math.min(1.6, Math.pow(1 / (vertical[1] - vertical[0]), .2)) : 1;
    const points = [];
    for (const point of layout.points) {
      if (ids && !ids.has(point.id)) continue;
      if (!intersects(point, range)) continue;
      const y = rect.top + (point.yWorld - vertical[0]) * yFactor;
      if (clipY && (y < rect.top || y > rect.bottom)) continue;
      const start = Math.max(point.start, range[0]);
      const end = Math.min(point.end, range[1]);
      const time = point.kind === 'clock' ? point.start : start + point.fraction * (end - start);
      points.push({ event: point.event, id: point.id, x: rect.left + (time - range[0]) * xFactor, y, radius: point.radius * magnification, time, yWorld: point.yWorld, kind: point.kind, bandKey: point.bandKey, windowStart: point.start, windowEnd: point.end });
    }
    return points;
  }
  root.HaruspexLayout = Object.freeze({ create, project });
})(typeof window === 'undefined' ? globalThis : window);
