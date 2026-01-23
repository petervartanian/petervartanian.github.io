(function () {
  function $(id) { return document.getElementById(id); }

  var dataEl = $('pv-praxis-data');
  var host = $('pv-vtimeline');
  var detail = $('pv-vtimeline-detail');
  if (!dataEl || !host) return;

  var data;
  try {
    data = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  if (!Array.isArray(data) || data.length === 0) return;

  var GROUPS = ['Academic', 'Public', 'Multilateral', 'Private', 'Civil'];

  function monthIndex(ym) {
    var parts = String(ym || '').split('-');
    if (parts.length !== 2) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    if (!isFinite(y) || !isFinite(m)) return null;
    return y * 12 + (m - 1);
  }

  function pad2(n) { return String(n).padStart(2, '0'); }
  function idxToYM(idx) {
    var y = Math.floor(idx / 12);
    var m = (idx % 12) + 1;
    return { y: y, m: m, ym: y + '-' + pad2(m) };
  }

  var now = new Date();
  var nowIdx = now.getFullYear() * 12 + now.getMonth();

  // Normalize and filter.
  var rows = data
    .map(function (r) {
      var s = monthIndex(r.start);
      var e = r.end ? monthIndex(r.end) : nowIdx;
      if (s === null || e === null) return null;
      return {
        label: r.label || '',
        group: GROUPS.indexOf(r.group) >= 0 ? r.group : 'Civil',
        start: s,
        end: e,
      };
    })
    .filter(Boolean)
    .sort(function (a, b) {
      if (a.start !== b.start) return a.start - b.start;
      return (a.end - b.end);
    });

  if (rows.length === 0) return;

  var minStart = Math.min.apply(null, rows.map(function (r) { return r.start; }));
  var maxEnd = Math.max.apply(null, rows.map(function (r) { return r.end; }));

  // Layout constants.
  var PX_PER_MONTH = 18;
  var TOP_PAD = 14;
  var BOTTOM_PAD = 18;
  var HEIGHT = TOP_PAD + (maxEnd - minStart + 1) * PX_PER_MONTH + BOTTOM_PAD;

  host.style.height = HEIGHT + 'px';

  // Build DOM.
  host.innerHTML = '';

  var axis = document.createElement('div');
  axis.className = 'pv-vtimeline-axis';
  host.appendChild(axis);

  var grid = document.createElement('div');
  grid.className = 'pv-vtimeline-grid';
  host.appendChild(grid);

  // Axis: year ticks at January.
  var yStart = Math.floor(minStart / 12);
  var yEnd = Math.floor(maxEnd / 12);
  for (var y = yStart; y <= yEnd; y++) {
    var janIdx = y * 12;
    if (janIdx < minStart || janIdx > maxEnd) continue;
    var yPos = TOP_PAD + (janIdx - minStart) * PX_PER_MONTH;

    var line = document.createElement('div');
    line.className = 'pv-vtimeline-axis-line';
    line.style.top = yPos + 'px';
    host.appendChild(line);

    var yl = document.createElement('div');
    yl.className = 'pv-vtimeline-axis-year';
    yl.style.top = yPos + 'px';
    yl.textContent = String(y);
    axis.appendChild(yl);
  }

  // Group lanes.
  var groups = {};
  GROUPS.forEach(function (g) { groups[g] = []; });
  rows.forEach(function (r) { groups[r.group].push(r); });

  // Assign sub-lanes within each group to avoid overlaps.
  function assignLanes(arr) {
    var lanesEnd = [];
    arr.forEach(function (r) {
      var assigned = -1;
      for (var i = 0; i < lanesEnd.length; i++) {
        if (r.start > lanesEnd[i]) { assigned = i; break; }
      }
      if (assigned === -1) {
        assigned = lanesEnd.length;
        lanesEnd.push(r.end);
      } else {
        lanesEnd[assigned] = r.end;
      }
      r._lane = assigned;
    });
    return Math.max(1, lanesEnd.length);
  }

  // Colors (muted, mineral).
  var COLORS = {
    Academic: '#384B5A',
    Public: '#7A2D2B',
    Multilateral: '#1F6F78',
    Private: '#8A6D3B',
    Civil: '#3F6F4C'
  };

  function renderDetail(r) {
    if (!detail) return;
    var s = idxToYM(r.start);
    var e = idxToYM(r.end);
    detail.innerHTML =
      '<div class="pv-detail-title">' + escapeHtml(r.label) + '</div>' +
      '<div class="pv-detail-meta">' + escapeHtml(r.group) + ' · ' + s.ym + ' → ' + e.ym + '</div>';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  GROUPS.forEach(function (g) {
    var lane = document.createElement('div');
    lane.className = 'pv-vtimeline-lane';
    grid.appendChild(lane);

    var arr = groups[g].slice().sort(function (a, b) {
      if (a.start !== b.start) return a.start - b.start;
      return a.end - b.end;
    });

    var laneCount = assignLanes(arr);
    lane.style.setProperty('--pv-lanes', laneCount);

    arr.forEach(function (r) {
      var top = TOP_PAD + (r.start - minStart) * PX_PER_MONTH;
      var h = (r.end - r.start + 1) * PX_PER_MONTH;

      var block = document.createElement('div');
      block.className = 'pv-vtimeline-block pv-vtimeline-block--' + (g || '').toLowerCase();
      block.style.top = top + 'px';
      block.style.height = Math.max(14, h) + 'px';
      block.style.background = COLORS[g] || '#555';

      // Lane positioning in percentages.
      var leftPct = (r._lane / laneCount) * 100;
      var widthPct = (1 / laneCount) * 100;
      block.style.left = 'calc(' + leftPct + '% + 6px)';
      block.style.width = 'calc(' + widthPct + '% - 12px)';

      block.setAttribute('tabindex', '0');
      block.setAttribute('role', 'button');
      block.setAttribute('aria-label', r.label);

      block.addEventListener('click', function () { renderDetail(r); });
      block.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          renderDetail(r);
        }
      });

      var title = document.createElement('div');
      title.style.display = 'none';
      block.appendChild(title);

      lane.appendChild(block);
    });
  });

  // Default: show the earliest role.
  renderDetail(rows[0]);
})();
