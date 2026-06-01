---
layout: default
title: "Working Artifacts"
description: "Notes, experiments, datasets, and visualizations."
permalink: /working-artifacts
page_key: artifacts
---

<div class="wa-filter">
  <button class="wa-filter-btn active" data-filter="all">All</button>
  <button class="wa-filter-btn" data-filter="notes">Notes</button>
  <button class="wa-filter-btn" data-filter="experiments">Experiments</button>
  <button class="wa-filter-btn" data-filter="datasets">Datasets</button>
  <button class="wa-filter-btn" data-filter="maps">Maps</button>
</div>

<div class="wa-list">
  <a href="#" class="wa-row" data-type="notes">
    <div class="wa-row-date">May 2026</div>
    <div class="wa-row-type">Note</div>
    <div class="wa-row-title">On the grammar of dual-use regulation</div>
    <div class="wa-row-arrow">→</div>
  </a>

  <a href="#" class="wa-row" data-type="datasets">
    <div class="wa-row-date">Mar 2026</div>
    <div class="wa-row-type">Dataset</div>
    <div class="wa-row-title">Critical mineral supply chains — annotated</div>
    <div class="wa-row-arrow">→</div>
  </a>

  <a href="#" class="wa-row" data-type="maps">
    <div class="wa-row-date">Jan 2026</div>
    <div class="wa-row-type">Map</div>
    <div class="wa-row-title">EU coercive instrument deployment, 2019–2025</div>
    <div class="wa-row-arrow">→</div>
  </a>

  <a href="#" class="wa-row" data-type="experiments">
    <div class="wa-row-date">Dec 2025</div>
    <div class="wa-row-type">Experiment</div>
    <div class="wa-row-title">Modeling tariff elasticity across regional markets</div>
    <div class="wa-row-arrow">→</div>
  </a>

  <a href="#" class="wa-row" data-type="notes">
    <div class="wa-row-date">Nov 2025</div>
    <div class="wa-row-type">Note</div>
    <div class="wa-row-title">The statecraft of subsidy structures</div>
    <div class="wa-row-arrow">→</div>
  </a>

  <a href="#" class="wa-row" data-type="datasets">
    <div class="wa-row-date">Oct 2025</div>
    <div class="wa-row-type">Dataset</div>
    <div class="wa-row-title">EU trade agreements database (cleaned)</div>
    <div class="wa-row-arrow">→</div>
  </a>
</div>

<script>
document.querySelectorAll('.wa-filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const filter = this.dataset.filter;
    document.querySelectorAll('.wa-filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    document.querySelectorAll('.wa-row').forEach(row => {
      if (filter === 'all' || row.dataset.type === filter) {
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    });
  });
});
</script>
