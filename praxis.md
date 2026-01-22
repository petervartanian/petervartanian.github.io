---
layout: default
title: "Praxis"
description: "A full timeline of institutional stations, rendered as overlapping monthly strata."
permalink: /praxis
page_key: praxis
---

# Praxis

{% assign palette = "#c95a74|#2a9d8f|#e07a5f|#6d597a|#3d5a80|#8f2d56|#4a7c59|#f2cc8f|#81b29a|#f4a261|#457b9d|#ffb703|#219ebc|#9b5de5|#00bbf9|#00f5d4" | split: "|" %}

{% assign min_year = 3000 %}
{% for r in site.data.praxis %}
  {% assign sy = r.start | split: "-" | first | plus: 0 %}
  {% if sy < min_year %}{% assign min_year = sy %}{% endif %}
{% endfor %}

{% assign now_year = site.time | date: "%Y" | plus: 0 %}
{% assign now_month = site.time | date: "%m" | plus: 0 %}
{% assign now_idx = now_year | times: 12 | plus: now_month %}

<div class="pv-month-grid-wrap" role="region" aria-label="Praxis timeline">
  <div class="pv-month-grid-head" role="row">
    <div class="pv-year-label pv-year-label-head" aria-hidden="true"></div>
    {% assign month_names = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec" | split: "|" %}
    {% for name in month_names %}
      <div class="pv-month-label" aria-hidden="true">{{ name }}</div>
    {% endfor %}
  </div>

  <div class="pv-month-grid" role="grid">
    {% for y in (min_year..now_year) %}
      <div class="pv-year-row" role="row">
        <div class="pv-year-label" role="rowheader">{{ y }}</div>

        {% for m in (1..12) %}
          {% assign month_idx = y | times: 12 | plus: m %}
          {% if month_idx > now_idx %}
            <div class="pv-month-cell is-future" role="gridcell" aria-hidden="true"></div>
          {% else %}
            {% assign count = 0 %}
            {% capture role_lines %}{% endcapture %}
            {% capture chips %}{% endcapture %}

            {% for r in site.data.praxis %}
              {% assign s = r.start | split: "-" %}
              {% assign sy = s[0] | plus: 0 %}
              {% assign sm = s[1] | plus: 0 %}
              {% assign sidx = sy | times: 12 | plus: sm %}

              {% if r.end == nil %}
                {% assign eidx = now_idx %}
              {% else %}
                {% assign e = r.end | split: "-" %}
                {% assign ey = e[0] | plus: 0 %}
                {% assign em = e[1] | plus: 0 %}
                {% assign eidx = ey | times: 12 | plus: em %}
              {% endif %}

              {% if month_idx >= sidx and month_idx <= eidx %}
                {% assign count = count | plus: 1 %}
                {% assign c = palette[forloop.index0 | modulo: palette.size] %}
                {% capture chips %}{{ chips }}<span class="pv-chip" style="--chip-color: {{ c }};"></span>{% endcapture %}
                {% capture role_lines %}{{ role_lines }}{{ r.label }}&#10;{% endcapture %}
              {% endif %}
            {% endfor %}

            {% assign mm = m | prepend: "00" | slice: -2, 2 %}
            <div class="pv-month-cell{% if count > 0 %} has-roles{% endif %}"
                 role="gridcell"
                 tabindex="{% if count > 0 %}0{% else %}-1{% endif %}"
                 style="--n: {{ count }};"
                 data-month="{{ y }}-{{ mm }}"
                 data-roles="{{ role_lines | strip }}"
                 title="{{ role_lines | strip }}">
              <span class="pv-chips" aria-hidden="true">{{ chips }}</span>
            </div>
          {% endif %}
        {% endfor %}
      </div>
    {% endfor %}
  </div>

  <div id="pv-praxis-detail" class="pv-month-detail" aria-live="polite"></div>
</div>

<div class="pv-praxis-places" aria-label="Praxis places">
  {% for r in site.data.praxis %}
    <div class="pv-praxis-place">{{ r.label }}</div>
  {% endfor %}
</div>
