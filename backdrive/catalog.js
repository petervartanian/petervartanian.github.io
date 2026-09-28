(() => {
  'use strict';
  const data = window.BACKDRIVE_DATA;
  const imported = window.BACKDRIVE_TRACKER;
  if (!imported?.cases?.length) return;
  const aliases = imported.metadata?.localAliases || {};
  const resolve = id => aliases[id] || id;
  const curated = new Map();
  for (const item of data.cases) {
    const id = resolve(item.id);
    const existing = curated.get(id);
    curated.set(id, existing ? {
      ...existing,
      evalIds: [...new Set([...existing.evalIds, ...item.evalIds])],
      sourceNotes: [...existing.sourceNotes, ...item.sourceNotes],
      localReferences: [...new Set([...(existing.localReferences || []), item.id])]
    } : {...item, id, localReferences: item.id === id ? [] : [item.id]});
  }
  data.cases = imported.cases.map(record => {
    const mapping = curated.get(record.id);
    if (!mapping) return record;
    curated.delete(record.id);
    return {
      ...record,
      ...mapping,
      title: record.title,
      summary: record.summary,
      date: record.date,
      tracker: record.tracker,
      trackerList: record.trackerList,
      trackerDetailUrl: record.trackerDetailUrl,
      mappingSummary: mapping.summary,
      robotics: record.robotics || mapping.robotics,
      sourceNotes: [...(record.sourceNotes || []), ...mapping.sourceNotes],
      hasLocalMapping: true
    };
  });
  data.cases.push(...curated.values());
  // Keep reviewed examples near the top while preserving every imported incident.
  data.cases.sort((a, b) => Number(Boolean(b.hasLocalMapping || b.evalIds?.length)) - Number(Boolean(a.hasLocalMapping || a.evalIds?.length)));
  for (const collection of [data.evaluations, data.capabilities || [], data.pilots]) {
    for (const record of collection) {
      if (record.caseIds) record.caseIds = [...new Set(record.caseIds.map(resolve))];
      for (const project of record.projects || []) {
        for (const evidence of project.evidenceLinks || []) {
          if (evidence.caseId) evidence.caseId = resolve(evidence.caseId);
        }
      }
    }
  }
  for (const control of data.controls) if (control.caseId) control.caseId = resolve(control.caseId);
  data.trackerImport = imported.metadata;
  data.supplementCount = data.cases.filter(record => !record.tracker).length;
})();
