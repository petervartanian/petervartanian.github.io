# Auspex

Choose a pathway and inspect its barriers. Add an incident to examine case evidence.

Serve the repository root and open `/auspex/`. The interface also works directly from
`index.html`, using local assets and a bundled data file. No runtime dependencies.
`pathways.html` provides a static reader of the worked examples without JavaScript.

## Seven STPA worked examples

A-1, B-1, C-1, D-1, E-1, F-1, and Bonus-1 use the models in `stpa-[a-fh]1.json`.
I selects a pathway; II places dated incident evidence on its relevant component;
III inspects the barrier. The dated choices are always visible. Select a case to add
its card, another to switch, or the selected case / × to clear it. There are no
No / Maybe / Yes modes.

Each incident card keeps its observed or reported finding, barrier assessments,
sources, and scope note together. Its open question expands in the same card,
with the cited basis and what remains unknown. The related component is highlighted;
the evidence and barrier states remain at the original assessed component. There
is no second incident card. The fourteen questions are editorial proposals and
do not establish another pathway component.

Open questions use `explore=1`. Older `overlay=maybe&i=…` links open that question
inside the selected case. An old chooser-only link simply shows the dated choices.
Incident choices show a bold name followed by an unbolded date in parentheses.
Dates use month-first order and ordinal days, such as September 8th 2011. Paired
dates and year ranges remain intact. Month-only records retain their known precision.
Reporting qualifiers and midpoint separators are omitted from these petite labels.
The original date records remain unchanged in the source data.

0 is a cloud portrait of the scenario setting, with a small numeral. The conditions
and controller roles are selected for each case; their counts are not fixed. A short
account explains how the setting shapes decisions. It is always readable and has no extra selector.
The original system scope and warning-sign notes remain in the research reader.
The cloud is a presentation of the assumed setting, not a new causal stage or a
substitute for the STPA control structure. Feedback can reshape upstream conditions.

Each of the 68 proposed-barrier marks across 42 routes opens one named barrier.
The small capped mark has an invisible 28px button target and no surrounding frame.
It opens III without requiring an incident. The assessment asks whether the protection
would hold against more capable AI and keeps relevant evidence visible.

“Strengthen this barrier” replaces that reading with a proposed change in the same
card. Every model constraint has a tailored improvement, a practical test, and a
remaining vulnerability. A short line names the responsible controllers. Incident
barriers use their existing improvement proposals, while unassessed candidate barriers
use the corresponding model constraint. “Back to assessment” restores the original
reading. There is no supporting disclosure, simulated success, or new assessed state.
The original state glyph and source evidence remain visible throughout. A small
illustration in the proposal sheet thickens its barrier on opening, then gently pulses
every three seconds. Reduced-motion preferences and the static reader show the
finished illustration without animation.

Proposed selections use `s=<route-id>&c=<constraint-id>`. Incident assessments retain
`b=<barrier-id>`. `strengthen=1` opens the proposed change and supports browser history
and reload. Selecting a different barrier resets the view. Closing the inspector clears
it. The static reader includes all proposed changes as ordinary readable content.

Clearing or switching a dated case preserves an independently open route inspector.
Opening an incident barrier or changing pathways clears the proposed selection.
Close and Escape restore focus to the mark. Caveats use a compact bold label
followed by a slash and the visible text, within a four-sided Caveat box. Scope footnotes contain complete sentences.

Every model contains losses, hazards, control and feedback relationships, constraints,
contextual unsafe control actions, causal scenarios, and a conditional recovery route.
The bow-tie map summarizes this provisional analysis; the four UCA categories are
represented across selected actions, not exhaustively assessed for every action.

The map uses **0. Context**, **1. Precursors**, **2. Event**, **3. Consequences**,
with components numbered within their region (1.1, 1.2, 2.1, 3.1…). The region heading is
**Recovery**. Its node marker retains R.
Connections share a horizontal height wherever their boxes and other attachment points
allow it, retaining the destination height when possible. Otherwise, level departures
and arrivals are joined by rounded bends through a clear gap or above an obstruction.
Straight route segments are always horizontal or vertical. Arrowheads approach box
borders squarely, and overlapping bends use separate lanes where the gutter permits. Optional branches use long dashes,
feedback round dots and double chevrons, and recovery two fine parallel green lines with a filled
arrowhead. Possible contribution and conditional consequence keep their data meanings
but share the forward-arrow style. Conditions remain in component text and route
descriptions. The Paths key explains the visible route conventions.

Proposed barriers use a short, slightly darker capped mark across the route.
A small gap keeps the mark clear on single, double, dashed and dotted lines; the key includes the named safeguards for the
current pathway. A safeguard is an intentional barrier; proposed identifies its status,
not its protective performance. Actual barrier states stay attached to incident evidence.

Pathway labels use A-1 / Bonus-1 throughout the catalogue. Old A.1 / Bonus.1 links and
searches remain supported; internal component addresses and evidence anchors are stable.
Every map has a clickable key for path types, barriers, and recovery
versus reinforcement. It includes conditional consequences and feedback, even when
those marks are absent from the currently selected map. The static reader includes
the same definitions at `pathways.html#map-key`. Proposed safeguards are subordinate
to Barriers in the key, alongside the state explanations. Proposed and assessed
barriers share a thin card frame and the relevant state symbol.

The other 30 entries show their titles and no case content, in both the application and
static reader. Their underlying catalogue records are retained for future work.

`barrier-states.json` defines seven symbols: Reinforced, Holding, Crumbling, Broken,
Absent, Backfiring, and Unassessed. Only applicable states appear on a selected barrier.
Their buttons open definitions and source examples. Brittleness asks which changes in
capability or conditions would defeat the protection; observed and projected erosion
must remain distinguishable. Recovery is a separate route, whose controls can themselves
hold, fail, or be reinforced. These are editorial labels, not an STPA rating scale.

Recovery uses two fine parallel lines and one filled arrowhead; feedback uses a squared, dotted
return loop and double chevrons. Matching symbols in the key distinguish the routes
without relying on color. The proposed barrier stays perpendicular to the route.

Source references use filled circles in case overlays, barrier explanations, and the
recovery card, with small i/ii/iii labels within each source group. Ordinary pathway
boxes omit repeated source circles; their citations remain in the full research notes.
Each circle retains its source title and keyboard access; case evidence opens the
existing passage reader. Asterisks stay next to the text they qualify. Recovery retains
its green tint and route; its source circles have pale neutral fills and dark numerals. Arrow
attachments are separated on each card edge, and successive bends reuse clear lanes
instead of drifting outside the map.

Maven and Replicator expose proposed safeguards with unassessed performance and test
questions. Their announcements remain contextual evidence. Later corrective changes are
dated; new improvements are labeled “Proposed change.” Scope notes use paired
asterisks and smaller text. The Myanmar counter-speech intervention is Backfiring in
the attributed account. Bonus-1 separates the FTC allegations from the mathematical
predictive-policing comparison and includes the latter’s feedback loop and correction.

Models may override assessments and add evidence by stable ID. Build and validate:

```sh
node build-stpa.mjs
node validate-stpa.mjs
node validate-interactions.mjs
node validate.mjs
```

The catalogue below describes retained source data, including unworked entries.

## Content

The register contains 31 catastrophe pathway hypotheses and six bounded-harm comparisons.
Visible IDs follow the family letters; canonical evidence addresses remain stable:

- A-1–A-6 (X-01–X-06): extinction and permanent global disempowerment.
- B-1–B-6 (P-01–P-06): human political takeover.
- C-1–C-8 (W-01–W-08): interstate conflict, nuclear escalation and mass violence.
- D-1–D-2 (B-01–B-02): pandemics.
- E-1–E-7 (S-01–S-07): sectoral and cross-sector catastrophes.
- F-1–F-2 (F-01–F-02): informational ecosystems and collective response.
- Bonus-1–Bonus-6 (H-01–H-06): comparison cases.

Each pathway preserves the register's causal steps, required conditions, source basis,
candidate barriers, variants and weakest bridge. Political lock-in and nuclear famine
continuations are separately expandable, without changing the base endpoint.
Basis codes distinguish source narratives/models (N), reconstructions (R) and observations
or experiments (O). Every source reference resolves to a named publication and URL.

### Causal model and faceted typology

The map displays source-crosswalked **AI-specific stages**: development, evaluation and
oversight, deployment and delegation, optimization and error, access and execution,
persistent operation, resource and capability scaling, information and beliefs,
institutional dependence, command and authority, feedback and coordination, safety
boundaries, harmful exposure, response and recovery, and terminal consequences.
Assignments are explicit editorial annotations, not inferred from a component's position.
The full source-derived causal statements and original evidence addresses are retained.

The research basis includes [Bucknall and Dori-Hacohen's ERO-linked AIES paper](https://ar5iv.labs.arxiv.org/html/2209.10604),
[ERO's hardware verification taxonomy](https://arxiv.org/html/2607.22619),
and [Chin's dimensional/pathway framework](https://arxiv.org/html/2508.06411), together
with each scenario's original sources. The information-ecosystem family reconstructs
the first paper's intermediate-risk-factor argument, with distinct amplification/violence
and collective-crisis-response routes. These are editorial reconstructions, not an official
ERO taxonomy or an exhaustive catalogue.

Every source-derived component has one or more explicit causal roles: **Condition, Trigger,
Mechanism, Control failure, Propagation, Intermediate effect, Proximal harm, Distal harm**.
Their definitions and parent classes are in `pathways.json` → `typology`, accessible through
“How to read this.” Roles can repeat, overlap or be absent; they are not a fixed stage ladder.
Original component/edge addresses remain stable for evidence and deep links.

This is an editorial adaptation of the [UK CAA bow-tie framework](https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/bowtie-elements/),
extended for multi-step propagation and consequence distance. It is not an official external
taxonomy or a claim that every pathway is one bow-tie. The annotations distinguish causal
function from incident chronology and evidential status.

**Proximal/distal denotes causal distance within the account**, not geographic reach, severity
or elapsed time. A proximal harm can be catastrophic. The earlier reach annotations remain
in the data; redundant local/wider-effects panels have been removed from both readers.
The model and exact mapping scope carry the relevant consequences and evidence limits.
The city-plan, Tempe and tutoring records retain their bounded scope.

Incident entity, intent and setting adapt the [MIT AI Risk Repository](https://airisk.mit.edu/risks)
causal factors. Setting refines the activity actually reported without assuming an evaluation
was pre-deployment. Unresolved intent remains explicit. These describe the incident and do
not inherit an intention or outcome from its hypothetical catastrophe pathway.
The [CSET AI Harm Framework](https://cset.georgetown.edu/publication/adding-structure-to-ai-harm/)
informs the separation of realized from potential harms and the modular classification approach.

## Incident and barrier records

Seventy-three distinct case records supply 85 exact-component mappings across all
31 base pathways and six bounded comparisons. They include:

- OpenAI–Hugging Face: internal-network persistence and reported containment; renderer
  shutdown and failed alert escalation. X-02:2–3 concerns persistence; X-04:2 connects
  OpenAI's reward-hacking findings to proxy exploitation. Both are component evidence.
- Tempe pedestrian collision: the human fallback failure in H-05.
- GPT-based mathematics tutoring: measured unaided performance at H-06:4. The outcome
  is attached to a state, not used to validate the uncertain learning-process mediator.
- A deployed care-allocation algorithm: proxy failure, biased allocation and a tested
  correction, connected to X-04 and S-03 using one stable incident identity.
- Klarna's staffing reversal; AI-assisted military-supplier theft and state surveillance;
  research-relay access evasion; AI-assisted espionage; Operation Spider's Web; and the
  AISI maintainer-review incident. Each mapping states the supported component.
- Four Anthropic evaluation-originated intrusions into third-party systems: malicious PyPI
  publication, voluntary scope recognition, a similarly named target and a run-budget stop.
  The September alignment assessment supersedes July's interpretation of model reasoning.
  The fifteen PyPI installations are described as likely security scanners, with one scanner
  leaking credentials for a live database.
- Mali's locally deployed surveillance platform, Uyghur profiling and covert recruitment,
  and political broadcasts and opponent targeting in CAR. Provider bans, request refusals
  and the removed warrant check have separate, limited findings.
- Autonomous military-drone development: software omitting human engagement approval,
  tested in simulation and on development hardware. W-08:2 is a development-stage
  component; civilian-targeting intent and operational deployment are not established.
- High-risk dual-use influenza research restricted to weaker models, and the AI-orchestrated
  PaperCut intrusion campaign. Neither a biological release nor a service cascade is claimed.

- Eleven additions cover Sleeper Agents, alignment faking, the sabotage-evaluation series,
  agentic-misalignment simulations, Myanmar and Ethiopia recommender-system investigations,
  a Facebook feed experiment, AI-assisted conspiracy-belief correction, a multi-agent
  wargame study, and two contrasting sepsis-model evaluations/implementations.
- Constructed models and simulations are visibly identified. The sabotage series counts
  once, even though it examines multiple interventions. A repeated mapping does not create
  another incident identity.
- The Facebook null result is evidence challenging a proposed link; belief correction and
  the Prisma implementation are countermeasure evidence. Their favorable findings are
  retained with the same care as adverse results. Clinical association is not causation;
  prediction errors are not established patient deaths.

**Every pathway has at least two distinct case records.** Counts include deployed events,
experiments, models, procurement announcements and explicitly marked non-AI comparisons.
This is a component-coverage minimum, not independent replication or full-pathway validation.
Records may share investigators or source institutions. Many later transitions still lack
observations; all mapped and unassessed targets remain explicit in `pathway.coverage`.
An unidentified stopping barrier remains unassessed.

The 41 additional records include control and isolation studies; industrial deployments;
procurement reports; historical early-warning, conflict, laboratory, grid, market and bank
failures; greenhouse control trials; and studies of work, education, communication, therapy
and group deliberation. Exact scopes retain null and favorable results. The four-part
sabotage series remains one identity when reused across pathways. Historical military
comparisons establish only specified decision or control mechanisms, not AI-induced war.

The synchronized register contains 98 sources, 86 evidence passages and 50 barrier
assessments. Thirty-five distinct barrier configurations include explicitly unvalidated
reinforcement proposals and test questions. Source entries state extraction limits;
new-source retrieval hashes identify the inspected extract or downloaded report, not
unread portions. Private retrieval snapshots and authoring files are excluded from this site.

The four barrier questions, in order, are:

1. (How) did the barrier work?
2. What makes us think so?
3. How durable is that protection?
4. What could make it fail?

Quotes and summaries are distinct records. Each has a locator, source and scope. Barrier
actions, evidential findings, durability and failure conditions are stored separately. An empty failure
assessment renders as “Not assessed.” Pathways without an incident assessment expose
candidate controls without presenting them as observed successful interventions.

Barrier outcomes are source-specific findings, not ordinal or probability scores.
Dependencies and possible reinforcement are explicit records. Reinforcement is labelled
as an editorial proposal with an evaluation question; the durability graphic uses a dashed
branch and diamond to distinguish it from an existing dependency. ERO's resource-access,
hidden-capacity and escape-from-control questions appear in the reading guide with their
hardware-governance scope and limitations.

## Files

- `index.html`, `style.css`, `app.js`: interface and interactions.
- `display.js`: original compact diagram labels; additions may carry `step.shortLabel`.
- `inspection.js`: original observation and diagram configuration. Synchronized `view`
  records in the generated data extend these without a second hand-maintained table.
- `visual.js`: linked incident diagrams, dependency views and failure routes.
- `pathways.json`: pathways, typed causal components, conditional edges, reach and the typology codebook.
- `incidents.json`: stable incident identities, causal factors and source references.
- `assessments.json`: incident-to-pathway targets, evidence/reach, sourced traces and typed barrier assessments.
- `evidence.json`: publications, exact quotes and source-specific summaries.
- `data.js`: local bundle of those four data files, for HTTP and direct-file use.
- `pathways.html`: generated static reader of the same register.
- `validate.mjs`: structural, referential, evidence-scope and bundle checks.
- `mark.svg`: original Auspex bird.
- `identity.html`, `assets/haruspex-mark.svg`: bird and entrail-mark specimens.
- `framework.js`, `assessment.js`: retained source records from the earlier prototype;
  neither is loaded by this interface.
- `assets/provenance.json`: provenance for the MIT AIRI and ERO marks in the masthead.

Data files, `data.js`, and the static reader are generated together from register version
1.0 (September 12, 2026), plus the September 13 source-reviewed extension. Keep them
synchronized when updating research. Validation:

```sh
node validate.mjs
```

The original brand uses Sorts Mill Goudy (`../assets/fonts/OFL.txt`). The interface uses
locally hosted Space Grotesk (`assets/FONT-LICENSES.txt`), with system sans-serif fallbacks.

## Interaction

- The landing view has no selected pathway. Three full-width presentation groups use the
  platinum review's grouping: influence passes to AI systems; power concentrates in a narrow
  human group; and AI extends what humans can destroy. Their eight family entries use
  A-I through A-IV, B-I through B-II, and C-I through C-II. Each expands to a family-level
  premise and causal pathway. `families.js` records the source, printed-page locators,
  and the review's scenario counts; these counts do not imply that all 95 individual
  source-scenario maps have been imported. The family content is a paraphrase of the
  September 15, 2026 draft, not an empirical assessment.
- X-Extras has a count derived from its six existing comparisons. Its heading starts at
  the former Bonus label position. Blue, gold, and rose group backgrounds contain wider
  family color ranges, defined in `families.css`. The earlier worked pathways and their
  evidence remain accessible through search, the selector, and existing links.
  Choosing one opens its causal map and incident reading; “All pathways” clears the selection.
  Only a valid explicit `p` URL parameter opens a pathway directly. Invalid IDs return to
  the overview. Browser history restores the overview as well as selected readings.
- The two-line headline uses ordinary, unstretched lettering. Its desktop container follows
  the paragraph height; on phones it uses its natural height. The paragraph remains justified
  with its last line left-aligned.
- The canvas is near-neutral cool white (`#f7f9fc`). A–F have distinct colors and
  monochrome-readable motifs, repeated in category cards, the selected family heading,
  and the pathway selector: A charcoal/converging rings, B purple/one controlling node above three subordinate nodes,
  C red/opposing ranks of simple wedges, D leaf green/organic clusters, E amber/a cascading sequence of tipping blocks,
  F blue/information waves. These are subject-matter identities, not severity rankings.
  Main accents use warm umber. The masthead displays the MIT AIRI and ERO marks with a
  shared monochrome CSS treatment. A small, muted, unlinked footer reads “Created with 💙 by Peter H. Vartanian (2026)”,
  matching Haruspex’s less prominent author credit.
- The pathway selector searches IDs, titles, causal content, sources and connected incidents.
  Exact-word matches take precedence over substring matches; comparisons have their own group.
  The overview label says “Find a pathway or incident:” and both fields say “Search...”; matching incidents appear as direct results so a search for
  Mali opens that incident rather than the first unrelated case on its pathway.
- `/` focuses overview search or opens the selector while a pathway is selected;
  arrow keys navigate results; Enter selects; Escape closes and
  restores focus. Buttons and links also work with ordinary Tab navigation.
- The causal map distinguishes selectable states from conditional transitions. Each selection
  filters incidents and barriers to that exact target. Case counts indicate available
  assessments, not the number of completed transitions. Component evidence is identified
  in the incident reading.
- Map controls follow causal order with Tab or the arrow keys; Home and End reach the first
  and last states. Enter or Space selects. Mobile uses a vertical map with the same targets.
- The evidence layer beneath the graph groups cases and barrier outcomes by the exact node
  or connection they address. Selecting a case updates the target, reading and barrier;
  selecting its paired-bar marker opens that particular barrier. “Cases ↓” reopens this
  layer even after the causal map has been collapsed.
- Observation headings remain visible; selecting one reveals its full account. Source links
  stay available. Empty incident states offer a direct route to documented cases.
- Selecting an observation highlights the corresponding part of the incident diagram.
  Diagram controls lead back to their source-linked observations. Alert escalation has no
  assigned observation position in the shorter Hugging Face trace.
- URL parameters `p`, `t`, `i`, `b`, `o` and `q` restore pathway, target, incident, barrier,
  observation and question. Browser Back restores
  previous selections. Incompatible IDs are normalized to the selected pathway's records.
  `p` writes visible IDs such as `A-2`; legacy IDs such as `X-02` remain valid aliases.
  `t` retains canonical component addresses to preserve existing evidence links.
- On narrow screens, selecting a map target reveals its reading. The pathway return control
  opens the causal argument and restores that target. Selecting an observation expands it
  in place; “Inspect barrier” reveals the diagram. Diagram controls,
  the return control and Escape lead back to the selected observation.
- Action, Evidence, Durability and Failure tabs reveal the original full barrier questions
  and their associated views. Each barrier is classified as prevention, containment,
  detection/response or an execution limit, relative to its assessed target.
  Left/right arrows, Home and End navigate these tabs. Source buttons open the relevant
  passages in a dialog and restore focus on dismissal.
- Diagram positions are schematic. The eleven internal nodes and the reported 86% reduction
  in bias on one measure are incident-specific observations. Neither is a catastrophe-progress
  measure. Conditional failure routes and documented failures are explicitly distinguished.
- Conditions, variants and continuations expand in place. Color and position never encode
  risk probability or a fraction of a completed catastrophe.
- Motion follows `prefers-reduced-motion`.

Browser checks cover navigation, mobile overflow, evidence expansion, deep links, browser
history, keyboard focus, bidirectional observation/diagram selection, source dialogs,
target-specific evidence, malformed selections and the static reader.

The opening claim carries four Roman-numeral links (i–iv) in four small consecutive inline blocks.
The numerals and adjoining box outlines share the headline’s dark rainbow; the blocks have no gaps, match the adjacent AI text’s capital-letter height including their borders, and fit each small numeral with 2px horizontal padding. Numerals remain at .6em. The terminal AI text and boxes share a single inline flex row and cap-height alignment.
Each reference concerns a distinct incident: Mythos 5's PyPI malware, the public-wiki
coordination, AISI's maintainer-targeting episode, and the Hugging Face intrusion.
Link labels distinguish report dates, event dates and outcomes; the wiki researchers
consider that activity distinct from the Hugging Face swarm. The question continues within the same paragraph,
in italic warm umber. A–F use separate colors and motifs; colors do not rank severity.

Category cards share explicit title/letter and count/motif rows. Letters and motifs have
the same horizontal center; letters and category titles have the same vertical center.
The + x-risk lettering uses a dark six-color spectrum; the question remains italic warm umber.

Section numerals sit in identical 24px circular SVG badges. Every ring and numeral has
an explicit center at (12, 12); numeral strokes are 10px tall and remain the same size
for I, II and III. Native text-box trimming aligns the badge to the main capital-letter
height, excluding descender tails. This is an optical alignment choice: the center of the
full ink extent, including p/y tails, would put the badge lower. Older browsers use a
capital-height/baseline fallback. Pixel screenshots independently verify the chosen
reference; geometric SVG equality alone is not treated as proof of visual alignment.
At widths below 350px, the chooser context can wrap to avoid crowding the section heading.

`validate-interactions.mjs` checks application state and accessible control markup in
an isolated harness. Its authored rectangles check route/target alignment; they do
not measure a browser page or establish actual responsive layout.

The four inspector tabs were removed. Old `q=` links normalize to the single reading;
no incident evidence or underlying STPA fields were removed.
