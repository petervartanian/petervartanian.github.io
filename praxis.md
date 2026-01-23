---
layout: default
title: "Praxis"
description: "A timeline of institutional stations."
permalink: /praxis
page_key: praxis
---

# *Praxis*

<div class="pv-vtimeline-wrap">
  <div class="pv-vtimeline-head" aria-hidden="true">
    <div class="pv-vtimeline-head-item">Academic</div>
    <div class="pv-vtimeline-head-item">Public</div>
    <div class="pv-vtimeline-head-item">Multilateral</div>
    <div class="pv-vtimeline-head-item">Private</div>
    <div class="pv-vtimeline-head-item">Civil</div>
  </div>

  <div id="pv-vtimeline" class="pv-vtimeline" aria-label="Praxis timeline"></div>
</div>

<div id="pv-vtimeline-detail" class="pv-vtimeline-detail" aria-live="polite"></div>

<script type="application/json" id="pv-praxis-data">{{ site.data.praxis | jsonify }}</script>

<noscript>
  <ul class="pv-role-list">
  {% for r in site.data.praxis %}
    <li>{{ r.label }}</li>
  {% endfor %}
  </ul>
</noscript>
