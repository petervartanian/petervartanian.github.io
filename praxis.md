---
layout: default
title: "Praxis"
description: "A full timeline of institutional stations."
permalink: /praxis
page_key: praxis
---

# Praxis

<div class="pv-timeline-wrap">
  <div id="pv-timeline" class="pv-timeline" aria-label="Timeline of roles"></div>
</div>

<noscript>
<ul class="pv-role-list">
{% for r in site.data.praxis %}
  <li>{{ r.label }}</li>
{% endfor %}
</ul>
</noscript>

<script>
(() => {
  const data = {{ site.data.praxis | jsonify }};
  const el = document.getElementById('pv-timeline');
  if (!el || !Array.isArray(data) || data.length === 0) return;

  const toMonthIndex = (ym) => {
    const [y,m] = ym.split('-').map(Number);
    return y * 12 + (m - 1);
  };
  const fromMonthIndex = (idx) => {
    const y = Math.floor(idx / 12);
    const m = (idx % 12) + 1;
    return {y, m};
  };
  const pad2 = (n) => String(n).padStart(2,'0');

  const startIdx = Math.min(...data.map(r => toMonthIndex(r.start)));
  const now = new Date();
  const endIdx = Math.max(
    ...data.map(r => r.end ? toMonthIndex(r.end) : (now.getFullYear()*12 + now.getMonth()))
  );

  const groupOrder = ["Industry","Government","Multilateral","Think tank","Consortia","Academia","Philanthropy","Entrepreneurship","Open infrastructure","Competitions","Media"];
  const groups = new Map();
  for (const r of data) {
    const g = r.group || "Other";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(r);
  }

  const groupColor = {
    "Industry": "#b36a3c",
    "Government": "#3d5a80",
    "Multilateral": "#2a9d8f",
    "Think tank": "#6d597a",
    "Consortia": "#8f5e2b",
    "Academia": "#5f6f52",
    "Philanthropy": "#c95a74",
    "Entrepreneurship": "#e07a5f",
    "Open infrastructure": "#457b9d",
    "Competitions": "#9b5de5",
    "Media": "#219ebc",
    "Other": "#555"
  };

  const orderedGroups = [];
  for (const g of groupOrder) if (groups.has(g)) orderedGroups.push([g, groups.get(g)]);
  for (const [g, arr] of groups.entries()) if (!groupOrder.includes(g)) orderedGroups.push([g, arr]);

  const monthCount = (endIdx - startIdx) + 1;
  const cellW = 14;
  const rowH = 22;
  const groupGap = 18;
  const leftPad = 240;
  const topPad = 34;
  const width = leftPad + (monthCount * cellW) + 24;

  let rowCount = 0;
  for (const [,arr] of orderedGroups) rowCount += arr.length;
  const height = topPad + (rowCount * rowH) + (orderedGroups.length - 1) * groupGap + 30;

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", height);
  svg.classList.add("pv-timeline-svg");

  const years = new Set();
  for (let i = startIdx; i <= endIdx; i++) years.add(fromMonthIndex(i).y);
  for (const y of Array.from(years).sort((a,b)=>a-b)) {
    const janIdx = y*12;
    const x = leftPad + (janIdx - startIdx) * cellW;
    if (x < leftPad || x > width) continue;

    const line = document.createElementNS(ns,"line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", topPad-18);
    line.setAttribute("x2", x);
    line.setAttribute("y2", height-16);
    line.setAttribute("class","pv-year-line");
    svg.appendChild(line);

    const t = document.createElementNS(ns,"text");
    t.setAttribute("x", x + 2);
    t.setAttribute("y", topPad-22);
    t.setAttribute("class","pv-year-label");
    t.textContent = String(y);
    svg.appendChild(t);
  }

  let yCursor = topPad;
  for (const [g, arr] of orderedGroups) {
    const gl = document.createElementNS(ns,"text");
    gl.setAttribute("x", 16);
    gl.setAttribute("y", yCursor - 8);
    gl.setAttribute("class","pv-group-label");
    gl.textContent = g;
    svg.appendChild(gl);

    for (const r of arr) {
      const rowY = yCursor;

      const tl = document.createElementNS(ns,"text");
      tl.setAttribute("x", 16);
      tl.setAttribute("y", rowY + 15);
      tl.setAttribute("class","pv-role-label");
      tl.textContent = r.label;
      svg.appendChild(tl);

      const s = toMonthIndex(r.start);
      const e = r.end ? toMonthIndex(r.end) : (now.getFullYear()*12 + now.getMonth());
      const x = leftPad + (s - startIdx) * cellW;
      const w = ((e - s) + 1) * cellW;

      const rect = document.createElementNS(ns,"rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", rowY + 5);
      rect.setAttribute("width", Math.max(2, w));
      rect.setAttribute("height", 12);
      rect.setAttribute("rx", 6);
      rect.setAttribute("fill", groupColor[g] || groupColor["Other"]);
      rect.setAttribute("opacity", "0.85");
      rect.setAttribute("class","pv-role-bar");

      const st = fromMonthIndex(s);
      const en = fromMonthIndex(e);
      const title = document.createElementNS(ns,"title");
      title.textContent = `${r.label} · ${st.y}-${pad2(st.m)} → ${en.y}-${pad2(en.m)}`;
      rect.appendChild(title);

      svg.appendChild(rect);

      yCursor += rowH;
    }
    yCursor += groupGap;
  }

  el.innerHTML = "";
  el.appendChild(svg);
})();
</script>
