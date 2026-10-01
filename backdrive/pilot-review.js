/* Proposed pilot criteria, surfaced from the existing catalog without changing them. */
(function () {
  'use strict';

  const text = value => typeof value === 'string' ? value : '';
  const escape = value => text(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const entries = value => Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.trim()) : [];
  const list = value => '<ul class="pilot-review-list">' + entries(value).map(item => '<li>' + escape(item) + '</li>').join('') + '</ul>';

  function group(label, value, className) {
    return entries(value).length ? '<div class="' + className + '"><dt>' + escape(label) + '</dt><dd>' + list(value) + '</dd></div>' : '';
  }

  function publicSources(item) {
    const candidates = [item.noteSources, item.sources, item.evidenceLinks].flatMap(value => Array.isArray(value) ? value : []);
    const seen = new Set();
    return candidates.filter(source => {
      if (!source || !text(source.url) || !text(source.label)) return false;
      try {
        const url = new URL(source.url);
        if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || seen.has(url.href)) return false;
        seen.add(url.href);
        return true;
      } catch (_) {
        return false;
      }
    }).map(source => '<li><a href="' + escape(source.url) + '" target="_blank" rel="noopener noreferrer">' + escape(source.label) + '</a></li>').join('');
  }

  function render(pilot, project) {
    const item = project && project.proposedDetails ? project : pilot;
    const details = item && item.proposedDetails;
    if (!details || typeof details !== 'object') return '';

    const criteria = group('Acceptance criteria', details.acceptanceCriteria, 'pilot-review-acceptance') +
      group('Stop criteria', details.stopCriteria, 'pilot-review-stop');
    const method = [
      ['Baseline', 'baselineMethod'],
      ['Comparison', 'comparisonDesign'],
      ['Configuration to confirm', 'equipmentToConfirm'],
      ['Evidence still needed', 'remainingEvidence'],
      ['Observations to record', 'observationFields'],
      ['Costs to record', 'costFields'],
      ['Review roles', 'reviewRoles']
    ].map(([label, key]) => group(label, details[key], 'pilot-review-method-group')).join('');
    if (!criteria && !method) return '';
    const sources = publicSources(item);

    return '<section class="pilot-review" aria-label="Decision review for ' + escape(item.label || item.name || 'this pilot') + '">' +
      '<div class="pilot-review-heading"><h3>Decision review</h3><p class="pilot-review-status">Criteria are provisional. No field results are recorded.</p></div>' +
      (details.decision ? '<p class="pilot-review-question">' + escape(details.decision) + '</p>' : '') +
      (criteria ? '<dl class="pilot-review-criteria">' + criteria + '</dl>' : '') +
      (method || sources ? '<details class="pilot-review-method"><summary>Method, evidence, and reviewers</summary>' +
        (method ? '<dl class="pilot-review-method-fields">' + method + '</dl>' : '') +
        (sources ? '<div class="pilot-review-sources"><h4>Public source material</h4><ul>' + sources + '</ul></div>' : '') +
        '</details>' : '') + '</section>';
  }

  window.BACKDRIVE_PILOT_REVIEW = Object.freeze({ render });
})();
