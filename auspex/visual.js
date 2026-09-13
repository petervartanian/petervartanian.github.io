(() => {
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const text = (value, x, y, size = 14, width = 19) => {
    const lines = [''];
    for (const word of String(value).split(' ')) {
      if (lines.at(-1).length + word.length > width && lines.at(-1)) lines.push('');
      lines[lines.length - 1] += `${lines.at(-1) ? ' ' : ''}${word}`;
    }
    return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" style="--label-size:${size}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? '1.3em' : 0}">${escape(line)}${i < lines.length - 1 ? ' ' : ''}</tspan>`).join('')}</text>`;
  };
  const arrow = (path, classes = '') => `<path class="visual-route ${classes}" d="${path}" marker-end="url(#scene-arrow)"/>`;
  const gate = (label, selected = true) => `<g class="${selected ? 'visual-active' : ''}"><path class="visual-gate" d="M226 68V146 M234 68V146"/>${text(label, 230, 177, 14, 22)}</g>`;
  const hotspot = (content, index, label, [x, y, width, height]) => index === undefined ? content
    : `<g class="scene-hotspot" role="button" tabindex="0" data-scene-observation="${index}" aria-label="Read observation: ${escape(label)}" aria-controls="incident-trace"><rect class="scene-hit-area" x="${x}" y="${y}" width="${width}" height="${height}"/>${content}</g>`;
  function draw({ incident, config, reinforcement, labels, observation, question, outcome }) {
    let body;
    const withReinforcement = question === 2 && config?.dependency && reinforcement;
    if (question === 2) {
      body = config?.dependency
        ? `${text(config.dependency, 96, 40, 16, 21)}${arrow('M96 88 C96 113 165 110 215 110')}${gate(config.control)}${arrow('M246 110H410', 'visual-uncertain')}${text('Beyond this incident', 385, 155, 14, 18)}${text('?', 419, 102, 32)}`
         : `${gate(config?.control || 'Stopping barrier', false)}${text('Not assessed', 230, 40, 25)}`;
      if (withReinforcement) body += `<g class="proposed-reinforcement">${arrow('M92 242 C92 219 56 213 56 184 V158 Q56 133 211 133', 'visual-uncertain')}<path class="visual-route visual-uncertain" d="M92 244l8 8-8 8-8-8Z"/>${text(reinforcement.label, 108, 285, 14, 20)}${text('Proposed · needs testing', 330, 301, 13, 18)}</g>`;
    } else if (question === 3) {
      body = config?.failureRoute
         ? `${arrow('M46 112H212')}${gate(config.control, false)}${arrow('M100 108 C110 38 355 38 395 107', config.failureObserved ? 'visual-active' : 'visual-uncertain')}${text(config.failureRoute, 240, 20, 14, 33)}${text(config.failureLabel || (config.failureObserved ? 'Observed failure' : 'Failure condition'), 230, 229, 15, 35)}${text(config.failureObserved ? (config.failureResult || config.result) : 'Beyond this control', 406, 149, 13, 16)}`
        : `${text('Not assessed', 230, 113, 30)}<path class="visual-route visual-uncertain" d="M65 165H395"/>`;
    } else if (incident === 'HF-2026' && config?.control === 'Renderer shutdown') {
      const sandbox = `<g class="${observation === 0 ? 'visual-active' : ''}"><rect x="25" y="83" width="67" height="50" rx="0" class="visual-outline"/><path class="visual-route" d="M36 99l9 8-9 8 M55 116h18"/>${text('External sandbox', 59, 162, 13, 14)}</g>`;
      const network = `<g class="${observation === 1 ? 'visual-active' : ''}"><rect class="visual-outline" x="308" y="40" width="145" height="137"/>${Array.from({ length: 11 }, (_, i) => `<rect class="visual-machine" x="${325 + (i % 4) * 30}" y="${58 + Math.floor(i / 4) * 36}" width="18" height="22"/><path class="visual-route" d="M${329 + (i % 4) * 30} ${73 + Math.floor(i / 4) * 36}h10"/>`).join('')}${text('Internal network', 380, 200, 13)}${text('11 nodes', 380, 220, 13)}</g>`;
      body = `${hotspot(sandbox, 0, labels[0], [14, 72, 90, 117])}${arrow('M94 108H213')}${hotspot(gate('Renderer', observation === 2), 2, labels[2], [185, 55, 95, 137])}<path class="visual-route" d="M246 108H301"/><path class="visual-cut ${observation === 2 ? 'visual-active' : ''}" d="M266 96l15 24 M281 96l-15 24"/>${hotspot(network, 1, labels[1], [300, 32, 161, 200])}${text('Access cut off', 230, 229, 14)}`;
    } else if (incident === 'OB-2019') {
      body = `${hotspot(`<g class="${observation === 0 ? 'visual-active' : ''}">${text('Predicted spending', 95, 52, 16)}</g>`, 0, labels[0], [10, 20, 167, 67])}${arrow('M178 47H285')}${hotspot(`<g class="${observation === 1 ? 'visual-active' : ''}">${text('Care allocation', 375, 52, 16)}</g>`, 1, labels[1], [286, 20, 180, 67])}${text('Mismatch with medical need', 230, 92, 13, 36)}<path class="visual-route" d="M25 119H450"/>${hotspot(`<g class="${observation === 2 ? 'visual-active' : ''}">${text('Revised prediction target', 100, 162, 16)}${arrow('M186 167H285')}${text('86%', 375, 167, 35)}${text('less bias on one measure', 375, 195, 12, 21)}</g>`, 2, labels[2], [10, 135, 458, 96])}`;
    } else if (config) {
       const mapped = config.observation !== undefined;
       const inputObservation = config.inputObservation ?? 0;
       const resultObservation = config.resultObservation ?? labels.length - 1;
       body = `${hotspot(`<g class="${mapped && observation === inputObservation ? 'visual-active' : ''}">${text(config.input, 77, 40, 17, 17)}</g>`, mapped ? inputObservation : undefined, labels[inputObservation], [5, 20, 146, 86])}${arrow('M45 112H211')}${hotspot(gate(config.control, observation === config.observation), config.observation, labels[config.observation], [175, 60, 110, 150])}${arrow('M248 112H424')}${hotspot(`<g class="${mapped && observation === resultObservation ? 'visual-active' : ''}">${text(config.result, 386, 151, 15, 18)}</g>`, mapped ? resultObservation : undefined, labels[resultObservation], [300, 128, 175, 103])}`;
    } else {
      body = `${text(labels[observation] || 'Incident evidence', 100, 70, 18, 19)}${arrow('M110 113H211')}${gate('Stopping barrier', false)}${arrow('M248 113H415', 'visual-uncertain')}${text('Not identified', 382, 152, 19, 16)}`;
    }
    return `<svg class="incident-visual" viewBox="0 0 480 ${withReinforcement ? 360 : 250}" role="group" aria-label="${escape(question === 2 ? 'Protection dependencies and proposed reinforcement' : question === 3 ? 'Failure conditions' : `${config?.control || 'Incident'}: ${outcome || 'stopping barrier not identified'}`)}"><defs><marker id="scene-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="currentColor"/></marker></defs>${body}</svg>`;
  }
  window.AuspexVisual = { draw };
})();
