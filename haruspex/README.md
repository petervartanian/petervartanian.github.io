# Haruspex

Open `index.html` to explore the OpenAI–Hugging Face incident dataset. The application is self-contained and works offline; source links open their original publications. The local preview is at http://127.0.0.1:8788/ while the preview server is running.

An opening title page introduces the incident and links its primary accounts. The Event swarm uses a full-viewport canvas beneath compact floating controls and stays pinned briefly while scrolling. The Legend flyout keeps color, shape and size keys at the periphery alongside zoom controls. Time runs horizontally. Impact & prevention uses one severity scale vertically; Context and Unresolved are separate unordered fields, with no implied place beneath Preventive. The three fields partition the same 832 records (599, 192 and 41). The optional Bow tie groups incident roles. CAST adds an evidence-linked systems investigation. Full, Before, During, and After views and 27 detailed stages explore the same event inventory. Each focused lifecycle, including During and After, uses one continuous field.

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

Gold, turquoise, lilac, orange, jade and blue identify the six workstreams against a dark neutral field. Matched outlines avoid white halos and mixed-color glows; selection adds restrained emphasis. Color remains categorical and does not rank severity or evidence. Labels, filters and attached workstream names identify groups without relying on hue alone. Context and Unresolved records retain their workstream color.

| Workstream | Fill | Records |
| --- | --- | ---: |
| Evaluation | `#E2B93A` | 143 |
| Access | `#2BD2C2` | 116 |
| Coordination | `#C691FE` | 174 |
| Intrusion | `#FF8346` | 216 |
| Response | `#68CA80` | 68 |
| Investigation | `#72A7FF` | 115 |

The faint background represents the scale of source-reported activity that cannot be resolved into individual records here. [Hugging Face reports approximately 17,600 recovered attacker actions grouped into about 6,280 clusters](https://huggingface.co/blog/agent-intrusion-technical-timeline); [METR reports more than 70,000 distinct messages and files](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/). Their scopes overlap. The roughly 1.2 million message-board entries and 20 million cache entries are other representations or broader collections, not extra attacks to add to those counts. Nor can 832 be subtracted to calculate an exact unseen remainder.

The renderer uses 5,000–22,000 tiny density marks according to the viewport. That number describes visual density, not events. The marks have no individual IDs, dates, severity or evidence status and cannot be selected. They do not contribute to the 832-record inventory or active filter counts. Their positions and opacity do not encode chronology, confidence, probability or causal relationships.

The workstreams group all 27 existing `phase` labels, assigning each label exactly once. They are navigation groups, not a causal sequence or an additional event assessment. Mixed phases remain intact: for example, `Internal database access and investigation` belongs to Intrusion, so that group can contain investigative activity. `Evaluation and coordination` belongs to Coordination. The original phase remains attached to each record. A workstream does not imply a successful intrusion, protective intent, or an effective response.

Severity uses stable neutral vertical bands, boxed digits, the separate zero and unnumbered minus categories, filters, and attached assessment information. Marker area increases modestly across positive levels 1–5. Near-miss, Preventive, Context and Unresolved use the same small baseline. Area is ordinal emphasis, not a ratio of harm or an estimate of probability; zoom, selection and hover can add temporary visual emphasis.

Shape geometry independently indicates evidence status: circle for Reported, diamond for Reasoning, triangle for Inferred and hexagon for Accounts differ. Shapes have approximately equal areas at each severity so an evidence category does not introduce an unintended size hierarchy. Context records are hollow; Unresolved records use broken outlines. Both retain their source-evidence geometry and workstream color. These outline treatments identify assessment dispositions, not date precision or Near-misses.

## Dates and their limits

The temporal layer has 820 records with finite time windows and 12 earlier training records with no supported earliest date. Of all 832 records, 55 have individual clock times and 310 have a date without a clock time; the remaining 467 have contextual intervals, including those 12 open-left records. Source-estimated milliseconds remain estimates.

Fresh primary-source research examined all 12 open-left records and six other temporal spot checks. It found **no new exact dates or clock times** for the two training anecdotes. The missing lower bounds cannot be filled from the first dated corpus event, a different training run, a publication date, or the date the social-post task asked the model to enter. Those substitutions would invent chronology. The other 814 records carry their canonical temporal values forward and are explicitly marked as not individually researched in this pass.

The 12 open-left training records appear inside their Impact or Context field as gently curved trails fading toward an unknown start. Their heads mark the inferred **exclusive upper boundary of July 14 at 00:00 UTC**, labeled **By 13 July**. This is a source-context boundary, not an observed execution date. Neither the fading left end nor the trail length supplies a start date or duration.

A head beyond the current time viewport stays outside; it is not moved to the viewport edge. Visible trails remain selectable, so the underlying record and its Date evidence can still be opened. Heads and trails are selected on the canvas, with keyboard access through the register. There is no extra undated row or separate comet-button collection. No finite display window is fabricated for these records.

Clock points retain their source coordinates. Records with uncertain dates are packed within source date windows; their exact horizontal placement is not an observed time or order. Date-window marks, tooltips and attached event information communicate that uncertainty independently of fill, shape and size. The overview uses interval midpoints only as a navigation aid, not as a count of verified events at those times. The Bow tie does not assign a time coordinate.

## Lifecycle and stages

Full shows every lifecycle role admitted by the active category and other filters. The following totals span all three categories; each category shows its own subset. Before contains the 83 precursor records; During contains 577 incident-activity and decision/coordination records; After contains 172 response, mitigation, investigation, and aftermath records. These are mappings of existing `bow_tie_role` values, not strict date windows. Response and investigation can overlap ongoing incident activity. During and After each remain a single field while their stages and filters narrow the same inventory.

Each of the 27 stage filters corresponds exactly to one original `phase`, using a shorter display label. Stages can cross lifecycle views. For example, Investigation & disclosure includes both During and After records, while the five Termination & access loss records remain in During under their existing incident-activity role even though their workstream is Response. Stage, lifecycle, workstream, evidence, severity and time are independent facets of the same records.

`incident-ontology.json` defines event, actor, system, lifecycle, stage, workstream, source, and assessment entities and supported relationship types. Its 832 assignments are derived from existing fields. [STIX 2.1](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html) and [CASE/UCO](https://caseontology.org/resources/case_design_document.html) inform its treatment of typed relationships, contextual grouping, and provenance. This is a local model, not a claim of conformance to either standard. Bow-tie curves group records; they do not establish causality.

## Investigation with CAST

The CAST view follows the systems-question approach agreed for this explorer. It contains **14 role/mechanism components, 24 control or information paths, 10 provisional findings, six groups of reported changes, six analyst proposals, and 16 open evidence questions**. Its links cover 198 canonical records across 70 source episodes. Those links are a selection of supporting claims, not 198 independent observations or a complete causal model.

The [MIT-hosted CAST Handbook](https://psas.scripts.mit.edu/home/get_file4.php?name=CAST_handbook.pdf) informs questions about losses, required constraints, responsibilities, actions, feedback, context and improvement verification. The Scope view explains the adaptation. This is a preliminary public-source checklist, not a completed formal CAST investigation or MIT endorsement.

Solid control paths describe reported relationships. Fine solid lines carry feedback or coordination; dashes indicate reported omissions, unknown historical paths or proposals. Click a path or component for its evidence and limits. Findings separate observation, interpretation, alternative explanations and unknowns. Changes separate reported actions from proposed improvements, with responsible-role descriptions and verification needs. None assigns work or claims an intervention is optimal.

Q01–Q16 preserve the existing investigation register. All remain open and no requests have been sent. The interface exposes the evidence needed and related source records. The HF escalation example keeps one source passage as one evidence episode; it does not invent alert timestamps or establish how much additional harm an earlier page would have prevented. May activity is not automatically a cause of the July HF incident.

Private meeting excerpts and internal requirements notes are excluded from the application, combined export and downloadable bundle. Only public-source incident analysis is included.

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

In the Event swarm, drag the field to pan time and severity together. The wheel zooms both axes. For either dragging or wheel zoom, hold Shift to move through time only or Alt to move through severity only. The navigation buttons also provide controls for both axes. Severity bands retain stable coordinates as you pan, zoom, filter, and fit the field.

The timeline overview has two range handles: drag the left or right handle to resize the start or end independently, or drag the selected center to move the whole time range. The date inputs use UTC calendar dates, and the chosen end date is inclusive. These controls change the viewport without rewriting recorded dates.

With the field focused, arrow keys pan and ordinary `+` or `-` zoom both axes. Alt limits keyboard zoom to severity. Fit returns the field to the relevant extent. Returning to the swarm restores its prior timeline range.

Swarm/bow-tie, category, lifecycle, stage, filter and fit transitions use continuous spring motion. Entering or leaving CAST uses a short crossfade and spatial transition; its subviews also transition. CAST is a separate control model, so its components do not pretend to be the event points. A change made during movement starts from each visible point’s current position and velocity. Backgrounds and labels transition with the field, while event identity is preserved. The motion explains a change of layout, not a historical trajectory, duration or causal connection. Reduced-motion preferences are respected.

Pan and wheel updates reuse cached geometry and are combined into animation-frame updates. The detail panel and register commit after the gesture settles instead of rebuilding on every pointer or wheel event. `field-layout.js` keeps the shared layout and coordinate calculations separate from interface updates. Performance measurements and interaction results belong in the accompanying validation record; this document does not claim a measured speedup.

Every filtered record is reachable through the keyboard-accessible register. The view tabs support arrow keys; Escape closes details.

## Files and provenance

- `index.html`: ready-to-open application.
- `haruspex-dataset.json`: immutable canonical inventory of 832 records and 45 original fields.
- `severity-assessments.json`: version 3.0.1 assessments, individual review dispositions, source rationales, and separate whole-incident assessment; the 3.0.1 change standardizes Near-miss spelling without changing scores.
- `temporal-assessments.json`: version 1.0.0 source-grounded temporal layer, review status, date bounds, evidence and limitations.
- `temporal-research-notes.md`: targeted date-research findings and rejected anchors.
- `visual-encodings.json`: version 5.0.0 workstream mappings, restored six-color palette, aggregate-density sources, assessment-outline conventions, open-left trail rules, and marker-area conventions.
- `incident-ontology.json`: lifecycle, stages, event assignments, entity and relationship definitions, scope limits and provenance.
- `haruspex-atlas-data-v8.json`: portable combined export of the canonical dataset and current assessment, temporal, visual, ontology and CAST layers.
- `cast-analysis.json`: public-source CAST-informed analysis, with constraints, role-level components, control paths, findings, changes and the existing Q01–Q16 register.
- `cast-view.js`: interactive control map and analytical record views.
- `research/cast-method-notes.md`: public methodological source checks and analytical limitations.
- `query.js`: structured-query parsing and matching.
- `field-layout.js`: shared field layout and coordinate calculations, included in the build and package.
- `index.template.html`, `style.css`, `app.js`, `build.mjs`: source files; rebuild with `node build.mjs`.
- `validation.json`: recorded data and interaction checks.

This is application version 8.0.0. The v6 assessment scores and research findings are unchanged; the 3.0.1 assessment revision only standardizes Near-miss spelling. The canonical dataset remains unchanged; reviewed assessments, corrected current evidence display, temporal bounds, ontology and visual conventions live in separate versioned layers. Full original fields remain available on each event.

The 832 records are a working inventory drawn from 11 primary sources, including the three starter documents. Some records represent group actions. The inventory is not a proven maximum and does not reconstruct inaccessible logs. Four source comparisons remain explicit. Completed review means each pending record received a defensible disposition, not that every source claim or event is independently verified.

The Event swarm name is inspired by [beeswarm plots](https://observablehq.github.io/plot/transforms/dodge), which preserve individual data points. Its use with uncertain time intervals is a Haruspex adaptation.
