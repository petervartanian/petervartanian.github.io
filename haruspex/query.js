(() => {
  'use strict';
  const DAY = 86400000;
  const fields = ['actor', 'system', 'stage', 'source', 'workstream', 'evidence', 'severity', 'id', 'life', 'lifecycle', 'outcome', 'before', 'after', 'date'];
  const text = (value) => String(value ?? '').toLowerCase();
  function dateValue(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const instant = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(instant) && new Date(instant).toISOString().slice(0, 10) === value ? instant : null;
  }
  function extent(originalEvent, context) {
    const event = { ...originalEvent, ...context?.temporal };
    if (event.event_date) {
      const day = dateValue(event.event_date);
      if (event.event_time_utc) {
        const instant = Date.parse(`${event.event_date}T${event.event_time_utc}Z`);
        return [instant, instant + 1];
      }
      return [day, day + DAY];
    }
    return [dateValue(event.earliest_context_date || ''), dateValue(event.latest_context_date_exclusive || '')];
  }
  function compile(query) {
    const tokens = [];
    let current = ''; let quoted = false;
    for (const character of query.trim()) {
      if (character === '"') { quoted = !quoted; continue; }
      if (/\s/.test(character) && !quoted) { if (current) tokens.push(current); current = ''; }
      else current += character;
    }
    const fail = (error) => ({ error, matches: () => false });
    if (quoted) return fail('Close the quotation mark to finish your search.');
    if (current) tokens.push(current);
    const predicates = [];
    for (let token of tokens) {
      if (token === 'AND') continue;
      if (token === 'OR') return fail('Combine terms to narrow the search. OR is not supported.');
      const exclude = token.startsWith('-');
      if (exclude) token = token.slice(1);
      if (!token) continue;
      let predicate;
      const comparison = token.match(/^severity(>=|<=|>|<|=)(.*)$/i);
      const colon = token.indexOf(':');
      const field = comparison ? 'severity' : colon >= 0 ? token.slice(0, colon).toLowerCase() : null;
      const value = comparison ? comparison[2] : field ? token.slice(colon + 1) : token;
      const needle = text(value);
      if (field && !fields.includes(field)) return fail(`“${field}” is not a search field. Open Search guide for examples.`);
      if (field && !value) return fail(`Add a value after ${field}:`);
      if (field === 'severity') {
        if (/^[0-5]$/.test(value)) {
          const score = Number(value); const operator = comparison?.[1] || '=';
          predicate = (event, context) => {
            const actual = context.assessment.score;
            if (actual == null) return false;
            return operator === '>=' ? actual >= score : operator === '<=' ? actual <= score : operator === '>' ? actual > score : operator === '<' ? actual < score : actual === score;
          };
        } else if (!comparison && ['preventive', 'context', 'unresolved', 'unassessed', 'near-miss', 'near_miss'].includes(needle)) {
          predicate = (event, context) => needle.startsWith('near') ? context.assessment.score === 0 : context.assessment.band === needle;
        } else return fail('Severity accepts 0–5, preventive, context, or unresolved; for example severity>=3.');
      } else if (field === 'evidence') {
        const aliases = { reported: 'reported', reasoning: 'reasoning', inferred: 'inferred', disputed: 'disputed', 'accounts differ': 'disputed' };
        if (!aliases[needle]) return fail('Evidence accepts reported, reasoning, inferred, or "accounts differ".');
        predicate = (event) => event._status === aliases[needle];
      } else if (['before', 'after', 'date'].includes(field)) {
        const instant = dateValue(value);
        if (instant === null) return fail(`Use a valid date such as ${field}:2026-07-11.`);
        predicate = (event, context) => {
          const [start, end] = extent(event, context);
          if (start == null && end == null) return false;
          if (field === 'before') return start == null ? end <= instant : start < instant;
          if (field === 'after') return end == null ? start >= instant + DAY : end > instant + DAY;
          return (start == null || start < instant + DAY) && (end == null || end > instant);
        };
      } else {
        predicate = (event, context) => {
          const values = {
            actor: event.actor,
            system: [event.system_scope, event.target_detail].join(' '),
            stage: [context.stage?.id, context.stage?.label, context.stage?.source_phase].join(' '),
            source: [context.source?.source_id, context.source?.publisher, context.source?.title].join(' '),
            workstream: [context.workstream?.key, context.workstream?.label].join(' '),
            evidence: [event._status, event.epistemic_status, event._status === 'disputed' ? 'accounts differ' : ''].join(' '),
            id: event.id,
            life: context.lifecycle?.id,
            lifecycle: context.lifecycle?.id,
            outcome: [event.outcome, context.assessment?.outcome].join(' '),
          };
          const haystack = field ? values[field] : [...Object.values(event).filter((item) => typeof item === 'string'), ...Object.values(values)].join(' ');
          return text(haystack).includes(needle);
        };
      }
      predicates.push(exclude ? (event, context) => !predicate(event, context) : predicate);
    }
    return { error: null, matches: (event, context) => predicates.every((predicate) => predicate(event, context)) };
  }
  window.HaruspexQuery = { compile, fields };
})();
