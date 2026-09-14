/* Stable field packing; camera projection has no DOM or canvas work. */
((root) => {
  'use strict';
  const finite = Number.isFinite;
  const KIND_ORDER = { clock: 0, day: 1, window: 2 };
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
      const random = eventRandom(candidate.id);
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
      points.push({ event: point.event, id: point.id, x: rect.left + (time - range[0]) * xFactor, y, radius: point.radius * magnification, time, fraction: point.fraction, yWorld: point.yWorld, kind: point.kind, bandKey: point.bandKey, windowStart: point.start, windowEnd: point.end });
    }
    return points;
  }
  // Mixing each identifier before sampling avoids the diagonal bands produced
  // by feeding consecutive event numbers into a linear generator.
  function eventRandom(id) {
    let value = identifierSeed(id);
    return () => {
      value = (value + 0x6d2b79f5) | 0;
      let mixed = Math.imul(value ^ value >>> 15, 1 | value);
      mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, 61 | mixed);
      return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
    };
  }
  /** Ordered, dated marks share a wing with visibly tailed unknown-start marks.
   * Uncertain marks occupy a stable layout slot compatible with their bounds.
   * A slot is never returned as a timestamp or written into the source record.
   */
  function bowtie({ events, rect, mode = 'focused', radius = () => 2.3 }) {
    const width = rect.right - rect.left, height = rect.bottom - rect.top;
    if (!(width > 0 && height > 0)) throw new Error('A nonempty bow-tie rectangle is required.');
    const center = event => event._time.center;
    const ordered = events.filter(event => finite(center(event))).sort((a, b) => center(a) - center(b) || a.id.localeCompare(b.id));
    const uncertain = events.filter(event => !finite(center(event))).sort((a, b) => a.id.localeCompare(b.id));
    const slots = ordered.map((event, index) => ({ event, low: index / ordered.length, high: (index + 1) / ordered.length }));
    for (const event of uncertain) {
      if (!ordered.length) { slots.push({ event, low: 0, high: 1 }); continue; }
      const start = event._time.start, end = event._time.end;
      const low = finite(start) ? ordered.filter(item => center(item) < start).length / Math.max(1, ordered.length) : 0;
      const high = finite(end) ? ordered.filter(item => center(item) <= end).length / Math.max(1, ordered.length) : 1;
      slots.push({ event, low, high: Math.max(low, high) });
    }
    const points = [], grid = new Map();
    const largest = Math.max(2.3, ...events.map(radius));
    const cell = largest * 3.2 + 3;
    const separation = (x, y, r) => {
      const gx = Math.floor(x / cell), gy = Math.floor(y / cell);
      let nearest = Infinity;
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        for (const other of grid.get(`${gx + dx},${gy + dy}`) || []) {
          nearest = Math.min(nearest, Math.hypot(x - other.x, y - other.y) - (r + other.radius) * 1.56);
        }
      }
      return nearest;
    };
    for (const { event, low, high } of slots) {
      const random = eventRandom(event.id), r = radius(event);
      const inset = Math.min(.025, (r * 1.6 + 2) / width);
      const fraction = low + (.05 + random() * .9) * (high - low);
      const u = inset + fraction * (1 - inset * 2);
      const x = rect.left + u * width;
      const envelope = mode === 'knot' ? .08 + Math.sin(u * Math.PI) * .92
        : mode === 'before' ? 1 - u * .65 : mode === 'after' ? .35 + u * .65
        : .55 + .45 * Math.pow(Math.sin(u * Math.PI), .55);
      const extent = Math.max(0, height / 2 - r * 1.6 - 2) * envelope;
      let best;
      for (let attempt = 0; attempt < 40; attempt++) {
        const v = (random() + random() - 1);
        const y = (rect.top + rect.bottom) / 2 + v * extent;
        const clearance = separation(x, y, r);
        if (!best || clearance > best.clearance) best = { x, y, clearance };
        if (clearance >= 2) break;
      }
      const point = { event, x, y: best.y, radius: r };
      points.push(point);
      const key = `${Math.floor(x / cell)},${Math.floor(best.y / cell)}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(point);
    }
    return points;
  }
  function calendarTime(point, range) {
    const { start, end, kind } = point.event._time;
    if (kind === 'clock') return start;
    if (start === null) return end;
    if (end === null) return start;
    let a = Math.max(start, range[0]), b = Math.min(end, range[1]);
    if (b < a) { a = start; b = end; }
    return a + (point.fraction ?? .5) * (b - a);
  }
  function calendarPlan(from, to) {
    validateCamera(from.range, [0, 1], from.geometry);
    validateCamera(to.range, [0, 1], to.geometry);
    const previous = new Map(from.map(point => [point.event.id, point]));
    const next = new Map(to.map(point => [point.event.id, point]));
    return { from, to, pairs: [...new Set([...previous.keys(), ...next.keys()])].map(id => {
      const old = previous.get(id), target = next.get(id);
      return { start: old || { ...target, radius: 0, vy: 0 },
        end: target || { ...old, radius: 0, vy: 0 } };
    }) };
  }
  function calendarFrame(plan, progress, duration) {
    const t = Math.max(0, Math.min(1, progress)), ease = t * t * (3 - 2 * t);
    const seconds = duration / 1000;
    const blend = (a, b, velocity = 0) => ({
      value: a + (b - a) * ease + velocity * seconds * t * (1 - t) ** 2,
      velocity: (b - a) * 6 * t * (1 - t) / seconds + velocity * (1 - 4 * t + 3 * t * t),
    });
    // Interpolate the camera, then project every event through that same camera.
    // A logarithmic span stays positive even when a fast zoom is interrupted.
    const [a, b] = plan.from.range, [c, d] = plan.to.range;
    const [va, vb] = plan.from.rangeVelocity || [0, 0];
    const center = blend((a + b) / 2, (c + d) / 2, (va + vb) / 2);
    const logSpan = blend(Math.log(b - a), Math.log(d - c), (vb - va) / (b - a));
    const span = Math.exp(logSpan.value), spanVelocity = span * logSpan.velocity;
    const range = t === 0 ? [...plan.from.range] : t === 1 ? [...plan.to.range] : [center.value - span / 2, center.value + span / 2];
    const geometry = { ...plan.to.geometry };
    for (const key of ['left', 'right', 'top', 'bottom']) geometry[key] = blend(plan.from.geometry[key], plan.to.geometry[key]).value;
    const points = plan.pairs.map(({ start, end }) => {
      const fraction = blend(start.fraction ?? .5, end.fraction ?? .5).value;
      const time = calendarTime({ ...end, fraction }, range);
      const y = blend(start.y, end.y, start.vy || 0);
      return { ...end, fraction, time, bend: blend(start.bend || 0, end.bend || 0).value,
        x: geometry.left + (time - range[0]) / (range[1] - range[0]) * (geometry.right - geometry.left),
        y: y.value, vx: 0, vy: y.velocity,
        radius: blend(start.radius, end.radius).value,
        paintRadius: Math.max(start.paintRadius || start.radius, end.paintRadius || end.radius), alpha: 1 };
    }).filter(p => p.time !== null);
    return { range, rangeVelocity: [center.velocity - spanVelocity / 2, center.velocity + spanVelocity / 2], geometry, points };
  }
  // Fixed calendar ticks travel across the screen during a pan. They do not
  // stay at fixed pixels while their printed dates change underneath them.
  function timeTicks(range, targetCount = 8) {
    const day = 86400000;
    const steps = [1000, 5000, 15000, 60000, 300000, 900000, 3600000, 10800000, 21600000, 43200000, day, day * 2, day * 7, day * 14, day * 28, day * 56];
    const step = steps.find(value => value >= (range[1] - range[0]) / targetCount) || steps.at(-1);
    const ticks = [];
    for (let time = Math.ceil(range[0] / step) * step; time <= range[1]; time += step) ticks.push(time);
    return ticks;
  }
  root.HaruspexLayout = Object.freeze({ create, project, bowtie, calendarTime, calendarPlan, calendarFrame, timeTicks });
})(typeof window === 'undefined' ? globalThis : window);
