---
layout: default
title: "Fas/Jus"
description: "A juridical-intelligence and R+D+I studio. Its animating question: what is the gray zone?"
permalink: /fas-jus
page_key: fasjus
---

# *Fas*/Jus

<p class="pv-fasjus-lede">A juridical-intelligence and R+D+I studio. Invitation only. Its animating question: <em>what is the gray zone?</em></p>

<nav class="pv-fasjus-subnav" role="tablist" aria-label="Fas/Jus sections">
  <button class="pv-fasjus-tab is-active" data-view="overview" role="tab" aria-selected="true">Overview</button>
  <button class="pv-fasjus-tab" data-view="fas" role="tab" aria-selected="false">Fas</button>
  <button class="pv-fasjus-tab" data-view="jus" role="tab" aria-selected="false">Jus</button>
</nav>

<div class="pv-fasjus-views">

  <div class="pv-fasjus-view is-active" id="pv-view-overview" role="tabpanel">
    <div class="pv-fasjus-overview-body">

      <p>In Roman jurisprudence, <em>fas</em> and <em>jus</em> are not synonyms. They are two distinct normative registers that together exhaust the space of obligation. <em>Fas</em> is divine or natural law — the unwritten, cosmic layer of what is permitted by the order of things, prior to statute and prior to state. <em>Jus</em> is positive, human law — constructed rights, obligations, and authority that states write down and enforce.</p>

      <p>The gap between them is the oldest problem in jurisprudence. It is also the definition of the gray zone.</p>

      <p>Fas/Jus is founded on the proposition that twenty-first-century statecraft has migrated almost entirely into that gap — the space where legality and legitimacy diverge, where attribution is deliberately muddied, and where the actual instruments of power are export controls, sanctions regimes, supply-chain chokepoints, and norm contestation. To act in that space with juridical coherence requires two things: a framework capable of holding the ambiguity, and an intelligence discipline capable of mapping it.</p>

      <p>The studio is the attempt to build both. It is organized in two arms.</p>

      <div class="pv-fasjus-arms">
        <div class="pv-fasjus-arm pv-fasjus-arm--fas">
          <span class="pv-fasjus-arm-label">Fas</span>
          <p>R+D+I. Builds new frameworks, methodologies, and conceptual tools for clients who are constructing something — a policy, an institution, a legal architecture. Operates before the line is drawn.</p>
        </div>
        <div class="pv-fasjus-arm pv-fasjus-arm--jus">
          <span class="pv-fasjus-arm-label">Jus</span>
          <p>Juridical intelligence. Reads the existing legal terrain and reports on it — precisely, at operational cadence, for clients who must act inside a landscape that is already contested and moving.</p>
        </div>
      </div>

      <p class="pv-fasjus-footer-note">Fortune 500 companies, scholar-practitioners, and public institutions. All engagements are confidential.</p>

    </div>
  </div>

  <div class="pv-fasjus-view pv-fasjus-view--fas" id="pv-view-fas" role="tabpanel">
    <div class="pv-fasjus-side-body">
      <p class="pv-fasjus-side-lede">R+D+I. The generative arm.</p>

      <p>Fas builds new frameworks, methodologies, and conceptual tools. Its clients are constructing something: a policy architecture, a legal instrument, an institutional design, a strategic framework for operating in contested normative terrain. Fas answers the question <em>what should this look like</em> before the statute is written, before the instrument is designed, before the line is drawn.</p>

      <p>Its output is generative rather than diagnostic. It operates at the level of the unwritten — in the space that Roman jurisprudence called <em>fas</em> — and it produces the architecture that makes coherent action possible.</p>

      <p>Engagements are by invitation and are governed by confidentiality agreements. Outputs belong to the client.</p>
    </div>
  </div>

  <div class="pv-fasjus-view pv-fasjus-view--jus" id="pv-view-jus" role="tabpanel">
    <div class="pv-fasjus-side-body">
      <p class="pv-fasjus-side-lede">Juridical intelligence. The diagnostic arm.</p>

      <p>Jus reads the existing legal terrain and reports on it — precisely, at operational cadence, for clients who must act now inside a landscape that is already contested and moving. Its output is diagnostic rather than generative. It answers the question <em>what are you dealing with</em>.</p>

      <p>It tracks the operational deployment of legal instruments in great-power competition: export controls, sanctions regimes, investment restrictions, jurisdictional assertions, norm contestation. It reads the law as terrain and reports on movement across it. Where the law's existing architecture fails to describe the actual structure of the problem, Jus names that failure precisely.</p>

      <p>Representative output: <em>Entrepôt 2.0: Hainan's "Island-Wide Independent Customs Operation" and Its Implications for Trade, Compliance, and Market Access</em> (18 January 2026). Available on request.</p>

      <p>Engagements are by invitation and are governed by confidentiality agreements.</p>
    </div>
  </div>

</div>

<script>
(function () {
  var tabs  = document.querySelectorAll('.pv-fasjus-tab');
  var views = document.querySelectorAll('.pv-fasjus-view');

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.dataset.view;
      tabs.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      views.forEach(function (v) { v.classList.remove('is-active'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById('pv-view-' + target).classList.add('is-active');
    });
  });
})();
</script>
