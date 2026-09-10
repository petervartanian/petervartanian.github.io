# Haruspex

Open `index.html` to explore the OpenAI–Hugging Face incident dataset. The application is self-contained and works offline; source links open their original publications. The published application is at https://petervartanian.xyz/haruspex/. For local development, serve the repository and open /haruspex/.

The title page uses one verified incident-specific excerpt from Ajeya Cotra. Her name links directly to the [1 September 2026 transcript](https://www.dwarkesh.com/p/ajeya-cotra), chapter 02:15:58; the smaller role credit reads “M.T.S. @ METR”. Publication and excerpt context remain in the provenance file. The introduction distinguishes the main HF intrusion on 11–13 July from separate internal OpenAI activity continuing until 19 July. The official MIT AI Risk Initiative logo sits on the same dark background without an endorsement claim.

The navigation reads **View #1: Event-swarm**, **View #2: Bow-tie**, and **Bonus: Investigate!** The Event-swarm uses a full-viewport canvas beneath compact floating controls and stays pinned briefly while scrolling. The Legend flyout keeps color, shape and size keys at the periphery alongside zoom controls. Time runs horizontally. **Impact** is the umbrella for adverse effects, Near-misses and Preventive actions, displayed on the established severity scale. Context and Unresolved are separate unordered fields, with no implied place beneath Preventive. The three fields partition 852 explorable events: 599 Impact, 192 Context, and 61 Unresolved. Twenty dated wiki actions and findings are included directly in Unresolved. Their relationship to the Hugging Face incident remains unconfirmed. The Bow-tie groups incident roles; Investigate opens a continuous white paper introducing Causal Analysis based on Systems Theory (CAST) and applying it to the incident. Full, **I. Before**, **II. During**, **III. After**, and 27 detailed stages explore the same event inventory. The Roman numerals distinguish lifecycle roles; the assessment fields stay unnumbered because they are alternatives, not steps or ranks. Each focused lifecycle, including During and After, uses one continuous field.

## Severity

| Symbol | Label | Meaning |
| --- | --- | --- |
| − | Preventive | A concrete protective action or reported protective result; intentionally unnumbered |
| 0 | Near-miss | A specific hazardous attempted effect failed, was blocked, or was absent in the reviewed downstream evidence |
| `1` | Negligible | Minimal local technical effect |
| `2` | Minor | Limited, confirmed effect on a bounded protected resource, boundary, artifact, or service |
| `3` | Substantial | Sensitive data, scoped credentials, privileged workload, or individual-host compromise |
| `4` | Severe | Major service or cluster compromise, central authentication-root or broad production-credential loss, or persistent control across multiple hosts |
| `5` | Catastrophic | Evidenced devastating loss of core organizational operations or critical information assets |
| *(blank)* | Context | Reviewed information that does not establish a separately assessable adverse effect |
| *(blank)* | Unresolved | Reviewed evidence that remains insufficient or conflicting for a defensible effect assessment |

Positive scores indicate increasing severity of the reported adverse technical effect. They appear as neutral boxed digits 1–5, without a plus sign. Zero identifies a documented near-miss within the specific assessed scope. Preventive actions occupy an intentionally unnumbered band below zero: the minus marks direction, and the stored score remains null. Context and Unresolved are completed review dispositions with no invented numeric score. They are distinct from zero and from Preventive and are reached through their own category controls. Their height within either separate field has no ordinal meaning.

All five positive levels use the same organizational scope: the reported loss of confidentiality, integrity, availability, or control in the affected systems and assets. Catastrophic does not require national or societal harm. It does require an evidenced devastating consequence, such as sustained loss of a core function or widespread unrecoverable destruction; the capability to cause that consequence is insufficient.

These are provisional Haruspex assessments, not official MIT, NIST, CVSS or national-security scores. [NIST FIPS 199](https://csrc.nist.gov/pubs/fips/199/final) informs the organizational scope and distinction between confidentiality, integrity, and availability. Its three potential-impact categories are not numerically converted into this five-level assessment of reported realized effects. [MIT’s national-security framework](https://airisk.mit.edu/ai-incident-tracker/natsec-impact-framework) addresses a different scope and does not set the catastrophic cutoff. Values should not be summed, averaged or netted against protective actions.

## Completed assessment review

All **549 previously pending records received an individual review** in the preceding assessment revision. Each has a source-specific rationale and review disposition. This does not mean every record now warrants a number: 192 records are Context and 41 remain Unresolved because the evidence needed for a numerical assessment is missing or conflicting.

The current 832-record inventory contains:

| Assessment | Records |
| --- | ---: |
| 1 · Negligible | 155 |
| 2 · Minor | 138 |
| 3 · Substantial | 78 |
| 4 · Severe | 17 |
| 5 · Catastrophic | 0 |
| 0 · Near-miss | 33 |
| − · Preventive | 178 |
| Context | 192 |
| Unresolved | 41 |
| **Total** | **832** |

The 388 adverse records have supported positive values under the current provisional rubric. No atomic record has a supported level-5 assignment; an empty category does not establish that every consequence is known. Preventive classification identifies a protective role, not proven effectiveness. Multiple records can describe components of one action, overlapping accounts, or an attempt and its result. These are inventory counts, not independent losses or distinct near-miss incidents.

A confirmed new unauthorized board post or read can support a minimal communication effect where the sources establish that the agents were meant to be isolated. A thought, discovery, local preparation, or additional content detail of an already-recorded exchange is not automatically another breach. The review preserves these distinctions in the attached rationales.

The revision also corrects two existing assessments, E0026 and E0028, to reflect explicit administrator capability and persistent Artifactory service control. E0076’s current evidence display is corrected to Reported because the primary timeline confirms token acceptance; its original decision-only coding remains visible in the canonical fields. The other 281 earlier assessments are carried forward, not claimed as newly independently reverified.

The whole incident retains a separate provisional assessment of **4 Severe**, based on the documented combination of administrative and persistent multi-node compromise, production credential losses, and protected-data access. It uses the same consequence scale but is a qualitative review of the combined evidence, not the maximum, sum, average, or net of event scores. Its rationale, scope, limitations, supporting records, and citations are stored with the event assessments.

## Reading the visualization

Gold, turquoise, lilac, orange, jade and blue identify the six workstreams against a dark neutral field. Thin dark neutral keylines separate overlapping colored marks at their existing coordinates; a background-colored interior keeps hollow and broken outlines legible over neighboring points. Workstream-colored edges and fills remain visible, without routine white halos or blended-color glows. This treatment does not spread points apart or claim to reveal every fully occluded record. Selection adds restrained emphasis. Color remains categorical and does not rank severity or evidence. Labels, filters and attached workstream names identify groups without relying on hue alone. Context and Unresolved records retain their workstream color.

| Workstream | Fill | Records |
| --- | --- | ---: |
| Evaluation | `#E2B93A` | 143 |
| Access | `#2BD2C2` | 116 |
| Coordination | `#C691FE` | 174 |
| Intrusion | `#FF8346` | 216 |
| Response | `#68CA80` | 68 |
| Investigation | `#72A7FF` | 115 |

The faint background represents the scale of source-reported activity that cannot be resolved into individual records here. [Hugging Face reports approximately 17,600 recovered attacker actions grouped into about 6,280 clusters](https://huggingface.co/blog/agent-intrusion-technical-timeline); [METR reports more than 70,000 distinct messages and files](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/). Their scopes overlap. The roughly 1.2 million message-board entries and 20 million cache entries are other representations or broader collections, not extra attacks to add to those counts. Nor can 832 be subtracted to calculate an exact unseen remainder.

The renderer paints 70,000 distinct faint background stars inside the interactive field, with a soft density falloff. This evokes the published lower bound of messages and files, not a count of historical events. The egg beside the main field’s Legend displays a small green coverage message and unlocks shuffled decorative numbers and a local magnifying shimmer. Nearby event details take priority. All stars use a spatial index and one static background canvas, not thousands of DOM elements. The full event total remains unknown. The coverage note identifies OpenAI, Hugging Face and METR/Redwood as relevant evidence holders, explains overlapping counting units, and separates disclosure from unrecoverable logging gaps.

The workstreams group all 27 existing `phase` labels, assigning each label exactly once. They are navigation groups, not a causal sequence or an additional event assessment. Mixed phases remain intact: for example, `Internal database access and investigation` belongs to Intrusion, so that group can contain investigative activity. `Evaluation and coordination` belongs to Coordination. The original phase remains attached to each record. A workstream does not imply a successful intrusion, protective intent, or an effective response.

Severity uses stable neutral vertical bands, boxed digits, the separate zero and unnumbered minus categories, filters, and attached assessment information. Marker size has a different purpose: a smaller mark represents a single reported unit, and a larger mark identifies grouped activity whose individual instances are unavailable. This is a binary reading of the existing `source_granularity` field: values beginning with `aggregate` use the larger size. It is not an exact instance count, a measure of importance, an evidence-confidence score or a severity cue. Zoom and selection can add temporary magnification. The established packing scaffold is retained, so changing the meaning of drawn size does not arbitrarily move records apart.

Shape geometry independently indicates evidence status: circle for Reported, diamond for Reasoning, triangle for Inferred and a six-point polygonal star for Accounts differ. Shapes have approximately equal areas within each size class so an evidence category does not introduce an unintended size hierarchy. Context records are hollow; Unresolved records use broken outlines. Both retain their source-evidence geometry and workstream color. These outline treatments identify assessment dispositions, not date precision or Near-misses.

## Dates and their limits

The temporal layer has 820 records with finite time windows and 12 earlier training records with no supported earliest date. Of all 832 records, 55 have individual clock times and 310 have a date without a clock time; the remaining 467 have contextual intervals, including those 12 open-left records. Source-estimated milliseconds remain estimates.

Fresh primary-source research examined all 12 open-left records and six other temporal spot checks. It found **no new exact dates or clock times** for the two training anecdotes. The missing lower bounds cannot be filled from the first dated corpus event, a different training run, a publication date, or the date the social-post task asked the model to enter. Those substitutions would invent chronology. The other 814 records carry their canonical temporal values forward and are explicitly marked as not individually researched in this pass.

The 12 open-left training records appear inside their Impact or Context field as gently curved trails fading toward an unknown start. Their heads mark the inferred **exclusive upper boundary of July 14 at 00:00 UTC**, labeled **By 13 July**. This is a source-context boundary, not an observed execution date. Neither the fading left end nor the trail length supplies a start date or duration.

A head beyond the current time viewport stays outside; it is not moved to the viewport edge. Visible trails remain selectable, so the underlying record and its Date evidence can still be opened. Heads and trails are selected on the canvas, with keyboard access through the register. There is no extra undated row or separate comet-button collection. No finite display window is fabricated for these records.

Clock points retain their source coordinates. Records with uncertain dates are packed within source date windows; their exact horizontal placement is not an observed time or order. Date-window marks, tooltips and attached event information communicate that uncertainty independently of fill, shape and size. The overview uses interval midpoints only as a navigation aid, not as a count of verified events at those times. The Bow-tie does not assign a time coordinate.

## Lifecycle and stages

Full shows every lifecycle role admitted by the active category and other filters. The following totals span all three categories; each category shows its own subset. I. Before contains the 83 precursor records; II. During contains 577 incident-activity and decision/coordination records; III. After contains 172 response, mitigation, investigation, and aftermath records. These are mappings of existing `bow_tie_role` values, not strict date windows. Response and investigation can overlap ongoing incident activity. During and After each remain a single field while their stages and filters narrow the same inventory.

Each of the 27 stage filters corresponds exactly to one original `phase`, using a shorter display label. Stages can cross lifecycle views. For example, Investigation & disclosure includes both During and After records, while the five Termination & access loss records remain in During under their existing incident-activity role even though their workstream is Response. Stage, lifecycle, workstream, evidence, severity and time are independent facets of the same records.

`incident-ontology.json` defines event, actor, system, lifecycle, stage, workstream, source, and assessment entities and supported relationship types. Its 832 canonical assignments are derived from existing fields; the combined export and application include all 852 assignments. [STIX 2.1](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html) and [CASE/UCO](https://caseontology.org/resources/case_design_document.html) inform its treatment of typed relationships, contextual grouping, and provenance. This is a local model, not a claim of conformance to either standard. Bow-tie curves group records; they do not establish causality.

## Investigation with CAST

Investigate opens **Why control failed**, a paper using Causal Analysis based on Systems Theory (CAST). It introduces the method, examines control and feedback, and develops four intervention hypotheses with explicit tests and evidence holders. It explains the exclusions in the independent investigation, adds a distinct wiki swarm as a comparison case, and distinguishes Cotra’s conditional forecast from established incident findings. Thirteen Roman endnotes and the supporting research register retain provenance. Private requests and proposed experiments have not been carried out.

Research notes at the end open six appendices covering detailed findings, evidence collected, further collection, the control structure, changes and method. Contextual traces connect the paper to supporting events. Event details can still open focused findings and their supporting evidence; a Return to the paper control restores the main narrative. Clicking Bonus: Investigate! also returns to the paper. All original findings and questions remain available.

The baseline contains 14 role/mechanism components, 24 paths, 10 provisional findings, six groups of reported changes, six analyst proposals and Q01–Q16. Its 198 canonical links span 70 source episodes, not 198 independent observations. The baseline file is preserved; the new evidence and question updates are a separate research layer.

`research-expansion.json` contains 27 evidence updates from 20 source resources, with precise locators, source dependence, limitations, searches and updates for all 16 questions. The four latest updates concern independent-review scope, a separate wiki swarm, its public export catalogue and Cotra’s conditional forecast. The wiki manifest download failed, so those export contents and hashes are not claimed as independently verified. Twenty source-supported wiki actions and findings are added in Unresolved; aggregate source counts are not expanded into invented events.

Two collected METR artifacts are preserved as inert JSON: 1,206 agent summary rows and 1,772 hourly workstream rows. They retain the original payloads, source URLs and original SHA-256 hashes. These are derived data from the same investigation, not raw transcripts, independent corroboration or additions to the canonical event count.

The CAST Handbook and case-study reading inform an iterative method: a question identifies an artifact and holder, obtaining it tests an explanation, and the answer can revise the analysis. `collection-method.json` preserves the public-safe collection framework. The original questions remain open, with new public findings alongside them. No messages were sent and no private operational logs or interviews were obtained. In particular, HF's paging mechanism and its measured loss contribution remain unresolved.

This is a provisional public-source CAST analysis, not a completed investigation, exhaustive model, proof of causation or MIT endorsement. Private meeting excerpts, shared-folder identifiers and internal requirements notes are excluded from the application, combined export and archive.

## Searching the records

Plain words search across the record and its attached display context. Use a field to narrow the meaning of a term. Searches are case-insensitive; whitespace combines terms with AND, a leading minus excludes a term, and double quotes keep a phrase together. An explicit uppercase `AND` is also accepted. `OR` is not supported.

| Query | Meaning |
| --- | --- |
| `actor:Sol` | Actor phrases containing Sol |
| `system:"Hugging Face"` | System context or target wording containing the phrase |
| `stage:"Source control"` | Matching stage ID, display label, or original phase |
| `source:S03` | Matching source ID, publisher, or title |
| `workstream:intrusion` | Intrusion workstream records |
| `evidence:"accounts differ"` | Records with differing source accounts |
| `severity>=3` | Assessed numerical severity of at least 3 |
| `severity:preventive` | The unnumbered Preventive category |
| `severity:context` | Reviewed contextual records |
| `severity:unresolved` | Reviewed records with unresolved assessment evidence |
| `lifecycle:before` | Existing precursor records |
| `date:2026-07-11` | Records whose date or assessed source time window intersects that UTC day |
| `before:2026-07-11` | Records with qualifying date or time-window evidence before that UTC day |
| `after:2026-07-11` | Records with qualifying date or time-window evidence after that UTC day |
| `workstream:intrusion severity>=3 -evidence:inferred` | Combine conditions and exclude inferred records |

Severity also accepts numerical equality with `severity:3` or `severity=3`, comparisons `>`, `<`, and `<=`, and `severity:0` for near-misses. `id:E0262`, `outcome:adverse`, and the shorthand `life:after` are supported. A null score never matches a numerical severity comparison.

Date queries use the temporal assessment layer and its available source bounds. They do not turn an uncertain window into an observed timestamp. Before and after exclude the named UTC day. An uncertain record can match both sides of a date when its window spans them. Unrecognized fields, invalid dates, unfinished quotation marks, and `OR` produce a search explanation rather than silently changing the meaning.

## Moving through the field

In the Event-swarm, drag the field to pan time and severity together. The wheel zooms both axes. For either dragging or wheel zoom, hold Shift to move through time only or Alt to move through severity only. The navigation buttons also provide controls for both axes. Severity bands retain stable coordinates as you pan, zoom, filter, and fit the field.

The timeline overview has two range handles: drag the left or right handle to resize the start or end independently, or drag the selected center to move the whole time range. The date inputs use UTC calendar dates, and the chosen end date is inclusive. These controls change the viewport without rewriting recorded dates.

With the field focused, arrow keys pan and ordinary `+` or `-` zoom both axes. Alt limits keyboard zoom to severity. Fit returns the field to the relevant extent. Returning to the swarm restores its prior timeline range.

Swarm/bow-tie, category, lifecycle, stage, filter and fit transitions use continuous spring motion. Entering or leaving CAST uses a short crossfade that preserves the outgoing layout and reading position; its subviews fade without shifting the text. CAST is a separate control model, so its components do not pretend to be the event points. A change made during movement starts from each visible point’s current position and velocity. Backgrounds and labels transition with the field, while event identity is preserved. The motion explains a change of layout, not a historical trajectory, duration or causal connection. Reduced-motion preferences are respected.

Pan and wheel updates reuse cached geometry and are combined into animation-frame updates. The detail panel and register commit after the gesture settles instead of rebuilding on every pointer or wheel event. `field-layout.js` keeps the shared layout and coordinate calculations separate from interface updates. Performance measurements and interaction results belong in the accompanying validation record; this document does not claim a measured speedup.

Every filtered record is reachable through the keyboard-accessible register. The view tabs support arrow keys; Escape closes details.

## Files and provenance

- `index.html`: ready-to-open application.
- `haruspex-dataset.json`: immutable canonical inventory of 832 records and 45 original fields.
- `severity-assessments.json`: version 3.0.1 assessments, individual review dispositions, source rationales, and separate whole-incident assessment; the 3.0.1 change standardizes Near-miss spelling without changing scores.
- `temporal-assessments.json`: version 1.0.0 source-grounded temporal layer, review status, date bounds, evidence and limitations.
- `temporal-research-notes.md`: targeted date-research findings and rejected anchors.
- `visual-encodings.json`: version 6.0.0 workstream mappings, six-color palette and neutral keylines, hidden decorative star catalogue and aggregate-density sources, assessment-outline conventions, open-left trail rules, six-point evidence geometry, and binary single/grouped marker sizes.
- `incident-ontology.json`: lifecycle, stages, event assignments, entity and relationship definitions, scope limits and provenance.
- `haruspex-atlas-data-v10.json`: portable combined export of the canonical dataset and current assessment, temporal, visual, ontology and CAST layers.
- `cast-analysis.json`: public-source CAST-informed analysis, with constraints, role-level components, control paths, findings, changes and the existing Q01–Q16 register.
- `cast-view.js`: the continuous CAST paper, source notes, contextual event traces, focused findings and research appendices.
- `research-expansion.json`: additional evidence, source dependence, searches and all question updates.
- `research/metr-agent-timeline.json`, `research/metr-hourly-workstreams.json`: collected public data payloads with provenance.
- `collection-method.json`: public-safe CAST collection framework.
- `opening-quotations.json`: incident-specific quotation research, verification status, original sources, locators and context. Only Cotra appears in the opening. The date boundaries and quotation retain primary-source provenance here.
- `assets/mit-airi-official.svg`: official MIT AI Risk Initiative logo used for the official initiative link and embedded in the self-contained application.
- `research/cast-method-notes.md`: public methodological source checks and analytical limitations.
- `query.js`: structured-query parsing and matching.
- `field-layout.js`: shared field layout and coordinate calculations, included in the build and package.
- `index.template.html`, `style.css`, `app.js`, `build.mjs`: source files; rebuild with `node build.mjs`.
- `validation.json`: recorded data and interaction checks.

This is application version 15.0.0. Severity scores and canonical records are unchanged; additional research is tracked separately; the 3.0.1 assessment revision only standardizes Near-miss spelling. The canonical dataset remains unchanged; reviewed assessments, corrected current evidence display, temporal bounds, ontology and visual conventions live in separate versioned layers. Full original fields remain available on each event.

The original 832 events come from 11 primary sources, including the three starter documents. Twenty wiki events from a twelfth source extend the working inventory to 852. Some records represent group actions. The inventory is not a proven maximum and does not reconstruct inaccessible logs. Four source comparisons remain explicit. Completed review means each pending record received a defensible disposition, not that every source claim or event is independently verified.

The Event-swarm name is inspired by [beeswarm plots](https://observablehq.github.io/plot/transforms/dodge), which preserve individual data points. Its use with uncertain time intervals is a Haruspex adaptation.

Version 10.1 shortens the introduction and uses Events in navigation. View snapshots preserve computed layout, scroll positions and canvas sizing; interrupted fades retain their displayed opacity. Investigation traces fit before their single view transition. Camera gestures briefly dissolve the current animated frame, and paper resets do not animate scroll position.


The introduction retains direct links for valuation, collaborating agents and later internal intrusions. Ajeya Cotra’s name retains its direct transcript link. The official AIRI mark has no caption. Context and Unresolved remain independent assessment fields.

Version 15 follows **introduction → irregular incident cloud → event-swarm**. The unlabelled, uneven form dissolves into the actual filtered event points along curved trajectories. It does not split into daughter globes. Decorative dust is precomputed into color buckets, and its underlying surface is cached. Reversing page scroll reverses the dissolution. Reduced-motion preferences skip the animated passage.

The five editorial waypoints mark the early file write, administrator access, entry into Hugging Face, later OpenAI escalation and public disclosure. They are navigation choices, not five established causal breaks. A local explanation states this distinction. Selecting a waypoint preserves its symbol and horizontal line while a narrow banner unfurls downward. Event-list selections capture their source marker before the list is refreshed. The banner remains scrollable and retains the full evidence and fields.

The legend opens centrally in a native modal over a faint, blurred field. Its assessment key reads **1–5 / 0 / −**, and **Assessment criteria** explains the categories. Short fading tails in Bow-tie preserve unknown-start identity without implying duration. Long, date-bounded tails remain specific to the timeline.

The egg beside Legend displays a small green message beginning “You found it! Beyond these 852 explorable events…” and sets the three corpus figures in their nesting: over 70,000 messages and files, encoded as 1.2 million entries, mostly fragments, in a cache of 20 million. It then names the disclosure gap. The message stays on one line and scrolls sideways only when the strip is narrower than the sentence, which happens below about 1280px. It does not open a dialog. The 70,000 unique background numbers remain shuffled decorative identifiers. Detailed source-unit distinctions stay behind the existing coverage information control.

Ordinary prose and primary-source links remain direct links. Roman endnotes are retained for source-note clusters and the investigation’s existing bibliography. There is no blanket conversion of links to endnotes.

The six workstream colors remain consistent. Marker halos and white sheen are reduced, with atmospheric depth coming mainly from faint dust and distant points. Source scope retains distinct sizes: one event (2.3px radius) and grouped activity (4.4px radius), with responsive and zoom adjustments. Context remains hollow and Unresolved keeps a broken outline. Colors do not encode severity or evidentiality.

Terminology: plural attacks can form one wider incident. Twenty source-supported wiki actions and findings are included in Unresolved and discussed in the investigation. The full raw wiki corpus has not been imported or independently validated. The opening form is illustrative, not an additional event or a claim that all activities share one proven cause.
