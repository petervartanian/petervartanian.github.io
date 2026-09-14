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
   * cached position within the full source window. That position is layout,
   * never a source timestamp. Both time and yWorld stay fixed on pan,
   * zoom or filtering. Open intervals remain in layout.unplaced.
   */
  function project(layout, { range, vertical = [0, 1], rect = layout.geometry, ids = null, clipY = true, clipX = true, magnify = true } = {}) {
    validateCamera(range, vertical, rect);
    const xFactor = (rect.right - rect.left) / (range[1] - range[0]);
    const yFactor = (rect.bottom - rect.top) / (vertical[1] - vertical[0]);
    const magnification = magnify ? Math.min(1.6, Math.pow(1 / (vertical[1] - vertical[0]), .2)) : 1;
    const points = [];
    for (const point of layout.points) {
      if (ids && !ids.has(point.id)) continue;
      if (clipX && (point.time < range[0] || point.time >= range[1])) continue;
      const y = rect.top + (point.yWorld - vertical[0]) * yFactor;
      if (clipY && (y < rect.top || y > rect.bottom)) continue;
      const time = point.time;
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
    const boundGroups = new Map();
    for (const event of uncertain) {
      const key = `${event._time.start}:${event._time.end}`;
      if (!boundGroups.has(key)) boundGroups.set(key, []);
      boundGroups.get(key).push(event);
    }
    const scatteredSlot = new Map();
    for (const members of boundGroups.values()) {
      members.sort((a,b) => eventRandom(a.id)() - eventRandom(b.id)() || a.id.localeCompare(b.id));
      members.forEach((event,index) => scatteredSlot.set(event.id,{index,count:members.length}));
    }
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
      const slot = scatteredSlot.get(event.id);
      const placement = slot ? (slot.index + .15 + random() * .7) / slot.count : .05 + random() * .9;
      const fraction = low + placement * (high - low);
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
  function calendarTime(point) {
    if (finite(point.time)) return point.time;
    const { start, end, kind } = point.event._time;
    if (kind === 'clock') return start;
    if (start === null) return end;
    if (end === null) return start;
    return start + (point.fraction ?? .5) * (end - start);
  }
  function swarmScale(range, vertical, packingRange) {
    const zoom = (packingRange[1]-packingRange[0])/(range[1]-range[0])/(vertical[1]-vertical[0]);
    return Math.min(1.8,Math.pow(Math.max(1,zoom),.12));
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
  function interpolate(a, b, velocity, t, duration) {
    const ease = t * t * (3 - 2 * t), seconds = duration / 1000;
    return { value: a + (b - a) * ease + velocity * seconds * t * (1 - t) ** 2,
      velocity: (b - a) * 6 * t * (1 - t) / seconds + velocity * (1 - 4 * t + 3 * t * t) };
  }
  function rangeFrame(from, to, velocity, t, duration) {
    const [a, b] = from, [c, d] = to, [va, vb] = velocity || [0, 0];
    const center = interpolate((a + b) / 2, (c + d) / 2, (va + vb) / 2, t, duration);
    const logSpan = interpolate(Math.log(b - a), Math.log(d - c), (vb - va) / (b - a), t, duration);
    const span = Math.exp(logSpan.value), spanVelocity = span * logSpan.velocity;
    return {
      range: t === 0 ? [...from] : t === 1 ? [...to] : [center.value - span / 2, center.value + span / 2],
      velocity: [center.velocity - spanVelocity / 2, center.velocity + spanVelocity / 2],
    };
  }
  function calendarFrame(plan, progress, duration) {
    const t = Math.max(0, Math.min(1, progress));
    const blend = (a, b, velocity = 0) => interpolate(a, b, velocity, t, duration);
    // One camera drives both the calendar axis and every date-anchored point.
    const dateCamera = rangeFrame(plan.from.range, plan.to.range, plan.from.rangeVelocity, t, duration);
    const range = dateCamera.range;
    const geometry = { ...plan.to.geometry };
    for (const key of ['left', 'right', 'top', 'bottom']) geometry[key] = blend(plan.from.geometry[key], plan.to.geometry[key]).value;
    const worldCamera = plan.from.vertical && plan.to.vertical;
    const heightCamera = worldCamera ? rangeFrame(plan.from.vertical,plan.to.vertical,plan.from.verticalVelocity,t,duration) : null;
    const vertical = heightCamera?.range;
    if (worldCamera) {
      geometry.lanes = (geometry.lanes || []).map(lane=>({...lane,
        y:geometry.top+((lane.start+lane.end)/2-vertical[0])/(vertical[1]-vertical[0])*(geometry.bottom-geometry.top),
        height:(lane.end-lane.start)/(vertical[1]-vertical[0])*(geometry.bottom-geometry.top),
      }));
    }
    const scale = worldCamera ? swarmScale(range,vertical,plan.to.packingRange) : 1;
    const points = plan.pairs.map(({ start, end }) => {
      const fraction = blend(start.fraction ?? .5, end.fraction ?? .5).value;
      const time = calendarTime({ ...end, fraction });
      const worldY = blend(start.yWorld ?? 0,end.yWorld ?? 0).value;
      const y = worldCamera ? {
        value:geometry.top+(worldY-vertical[0])/(vertical[1]-vertical[0])*(geometry.bottom-geometry.top),
        velocity:-(geometry.bottom-geometry.top)*(heightCamera.velocity[0]+(worldY-vertical[0])/(vertical[1]-vertical[0])*(heightCamera.velocity[1]-heightCamera.velocity[0]))/(vertical[1]-vertical[0]),
      } : blend(start.y,end.y,start.vy || 0);
      const u = (time-range[0])/(range[1]-range[0]);
      const radius = worldCamera ? Math.max(end.minimumRadius || 0,(end.baseRadius || end.radius)*scale) : blend(start.radius,end.radius).value;
      const bend = worldCamera && end.event._time.openStart
        ? Math.min(34,(end.bandHeight || 0)/(vertical[1]-vertical[0])*(geometry.bottom-geometry.top)*.32)*(end.event._index%2?1:-1)
        : blend(start.bend || 0,end.bend || 0).value;
      return { ...end, fraction, time, yWorld:worldY, bend,
        x:geometry.left+u*(geometry.right-geometry.left), y:y.value,
        vx:-(geometry.right-geometry.left)*(dateCamera.velocity[0]+u*(dateCamera.velocity[1]-dateCamera.velocity[0]))/(range[1]-range[0]),
        vy:y.velocity, radius,
        paintRadius:worldCamera ? Math.max(end.minimumRadius || 0,(end.baseRadius || end.radius)*1.8) : Math.max(start.paintRadius || start.radius,end.paintRadius || end.radius),
        alpha:blend(start.alpha ?? 1,end.alpha ?? 1).value };
    }).filter(p=>p.time!==null);
    return { range,rangeVelocity:dateCamera.velocity,vertical,verticalVelocity:heightCamera?.velocity,geometry,points };
  }

  // These windows are positions within one schematic bow-tie, never dates.
  function bowtieWindow(phase = 'all') {
    return { ...({
      all: { left:0, right:1, top:0, bottom:1 },
      before: { left:0, right:.32, top:.04, bottom:.96 },
      during: { left:.345, right:.655, top:.22, bottom:.78 },
      after: { left:.68, right:1, top:.04, bottom:.96 },
    }[phase] || { left:0, right:1, top:0, bottom:1 }) };
  }
  function bowtieProject(points, { camera, rect, ids = null }) {
    return points.filter(point => !ids || ids.has(point.event.id)).map(point => ({ ...point,
      x: rect.left + (point.worldX - camera.left) / (camera.right - camera.left) * (rect.right - rect.left),
      y: rect.top + (point.worldY - camera.top) / (camera.bottom - camera.top) * (rect.bottom - rect.top),
    }));
  }
  function bowtieFrame(plan, progress, duration) {
    const t = Math.max(0, Math.min(1, progress));
    const base = calendarFrame({ ...plan, pairs:[] }, t, duration);
    const start = plan.from.bowCamera, end = plan.to.bowCamera, velocity = plan.from.bowVelocity || {};
    const horizontal = rangeFrame([start.left,start.right], [end.left,end.right], [velocity.left || 0,velocity.right || 0], t, duration);
    const vertical = rangeFrame([start.top,start.bottom], [end.top,end.bottom], [velocity.top || 0,velocity.bottom || 0], t, duration);
    const camera = { left:horizontal.range[0],right:horizontal.range[1],top:vertical.range[0],bottom:vertical.range[1] };
    const bowVelocity = { left:horizontal.velocity[0],right:horizontal.velocity[1],top:vertical.velocity[0],bottom:vertical.velocity[1] };
    const members = plan.pairs.map(({start,end}) => ({ ...end,
      radius: interpolate(start.radius,end.radius,0,t,duration).value,
      paintRadius: Math.max(start.paintRadius || start.radius,end.paintRadius || end.radius), alpha:1,
    }));
    const points = bowtieProject(members,{camera,rect:base.geometry}).map(point => {
      const u = (point.worldX-camera.left)/(camera.right-camera.left);
      const v = (point.worldY-camera.top)/(camera.bottom-camera.top);
      return { ...point,
        vx: -(base.geometry.right-base.geometry.left)*(bowVelocity.left+u*(bowVelocity.right-bowVelocity.left))/(camera.right-camera.left),
        vy: -(base.geometry.bottom-base.geometry.top)*(bowVelocity.top+v*(bowVelocity.bottom-bowVelocity.top))/(camera.bottom-camera.top),
      };
    });
    return { ...base, bowCamera:camera, bowVelocity, points };
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
  root.HaruspexLayout = Object.freeze({ create, project, bowtie, calendarTime, swarmScale, calendarPlan, calendarFrame, bowtieWindow, bowtieProject, bowtieFrame, timeTicks });
})(typeof window === 'undefined' ? globalThis : window);
