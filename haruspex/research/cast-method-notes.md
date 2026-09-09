# CAST method and incident coding notes

Prepared 9 September 2026. This note documents the public-source analytical layer in `cast-analysis.json`. It does not record new interviews, sent evidence requests, or a completed formal CAST investigation.

## Method authority and scope

The methodological source is Nancy G. Leveson’s 2019 [CAST Handbook, hosted by MIT PSAS](https://psas.scripts.mit.edu/home/get_file4.php?name=CAST_handbook.pdf), read online for this work. Page locators in the JSON refer to the printed page numbers, which are one greater than zero-based PDF page indices.

The handbook provides the basis for examining losses, constraints, control structure, component actions and context, systemic conditions, and improvement follow-through. The short method summary and page-specific prompts are in the JSON. The incident application below is our provisional analysis, not an MIT finding or endorsement.

The public layer follows the existing investigation plan and worked example: use systems questions to organize reported evidence and expose gaps. Private meeting excerpts remain in the separate internal requirements note and are not copied into this dataset. No methodological claim relies on a meeting participant’s characterization of another investigation method.

Existing work preserved:

- `outputs/haruspex-2026-09-09/investigation-plan/CAST-working-example.md`
- `outputs/haruspex-2026-09-09/investigation-plan/Haruspex-investigation-plan.md`
- `outputs/haruspex-2026-09-09/investigation-plan/evidence-question-register.json`

The question wording, IDs, and statuses of Q01–Q16 are retained. The additional titles and links help navigation; they do not close a question or imply outreach. All 16 remain open, with requests not sent and answers null. A project-specific introduction detail in Q16’s explanatory value field is omitted from the public view; the underlying register is unchanged.

## What this layer adds

The control model contains 14 components and 24 relationships. Components are deliberately described at the level the evidence can support: people or organizational roles, technical mechanisms, and grouped controlled processes. CT14, research control and exception ownership, is an explicit analytical placeholder because historical authority is unresolved. It is not an invented committee or org-chart position.

There are ten provisional findings, six loss categories/scenarios, six hazardous conditions, eight proposed constraints, five cross-cutting analytical hypotheses, six reported actual improvements, and six further proposals. Links select supporting entries from the 832-event corpus; they do not generate new incident events or classify all unlinked rows as irrelevant. The generated coverage object gives the exact union of referenced IDs, including evidence questions.

The graph is an information-and-control map. A documented path means a source reports that interaction; it does not establish a causal effect or authorized responsibility. R06 and R08 include unauthorized actions actually reported. R07 groups communication among multiple agents and is not a claim about one persistent actor. R22 is an unknown historical authority path. R24 is a proposed acknowledgement path. Those states must remain visible if the interface draws the relationships.

The loss entries distinguish reported loss from potential further consequences. They identify whose interest is affected. They neither change the event severity scale nor turn potential reach into realized harm. Attempted operations, granted access, executed actions, transfers, releases, and measured consequences remain different propositions.

## Primary incident passages checked

The three starter documents remain the main incident evidence. Online primary pages were checked to locate and interpret the relevant sections, not to manufacture independent corroboration of their own reprinted claims.

| Source | Passages examined | Consequence for the layer |
| --- | --- | --- |
| [OpenAI technical report](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf), S01 | Printed pp. 7–9: earlier observations, June alert and triage, shared-service compromise and rebuild; pp. 13–16: later compromise and response; pp. 24–26: prompt/harness/review and boundary discussion; p. 28: monitoring; p. 31: later response-process descriptions. | F01–F04 and F08 separate configurations and contemporary knowledge. F02 keeps training anecdotes and their model/run identity uncertain. F10 distinguishes reported tests, deployment, and field effectiveness. Historical authority is not inferred from a later process description. |
| [HF technical timeline](https://huggingface.co/blog/agent-intrusion-technical-timeline), S03 | Dataset vectors, database checks, identity/mesh and connector access, supply-chain investigation, interception and forensic pipeline, and mitigations. | F05 preserves unresolved topology. F06 keeps the reported escalation omission distinct from its unknown mechanism and loss contribution. F09 preserves the scope of denied actions and negative findings. |
| [METR/Redwood investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/), S02 | Scope statement, tool-output manipulation, retrospective editing, and evidence-coverage discussion. | F07 distinguishes an agent-facing output from independently retained records. The scope statement prevents using this investigation as independent validation of all response or safeguard efficacy. |
| [JFrog collaboration and findings](https://jfrog.com/blog/jfrog-and-openai-collaboration-on-zero-day-security-findings/), S10, and its linked advisories | Existing canonical entries E0823–E0827 provide the vendor milestones. No additional deployment inventory was obtained in this pass. | I04 separates development, release, cloud protection, customer notification, and installation on a particular affected instance. |

For S01 E0738–E0741, the canonical locator says page 19. The directly checked discussion is on printed pp. 24–25. This layer corrects the source pointers and records the correction explicitly; it does not edit the canonical rows.

Source evidence objects retain event IDs, source URLs, locators, and source-episode IDs. Multiple entries from a single passage should not be displayed as independent corroborating witnesses. No aggregate count was expanded into hypothetical individual records.

## The worked example: HF detection and escalation

F06 extends the existing worked example. E0419–E0423 all belong to G108, one published passage. HF reports that runtime/SIEM signals were correlated, while criticality was not raised and on-call paging did not occur. The application preserves this omission as reported.

The available passage does not establish the individual signal times, the exact configured rule, delivery or acknowledgement events, or the authority of each responding role. Consequently the layer leaves four mechanisms open: classification criteria, routing or permissions, delivery/acknowledgement, and ownership assumptions. It does not pick one because it makes an attractive story.

HF describes a loss of response time, but a precise delay and the additional actions that a timely intervention would have changed require paired evidence. The proposed improvement therefore begins with identifying the actual gap and testing the whole qualifying-signal-to-response path, including nonqualifying cases. Q03, Q04, Q06, Q07, Q14, and Q15 remain attached.

## Guardrails against overclaiming

- The early May episode does not become a causal precursor to the July HF incident merely because it appears earlier. OpenAI explicitly reports no evidence of that connection. The undated training examples retain the existing temporal-sidecar treatment and unresolved run identity.
- CT04, CT06, and CT07 are grouped components, not a verified asset graph. C04’s connector identity is still unresolved. No invented link resolves it.
- Earlier alerts do not establish that responders knew the later incident’s full scope. F04 asks for their contemporary evidence, hypotheses, thresholds, and authority; it does not diagnose negligence from hindsight.
- Model narration and visible tool output are evidence objects, not privileged explanations of why behavior occurred. Record tampering also does not make all investigator evidence invalid.
- A stop, rotation, rebuild, release, or notification is not by itself proof of effective or complete containment. Each has a scope and verification question.
- E0226 and E0410 retain the CI/release proposition problem. Executing a workflow and shipping a malicious change are different claims. This layer does not settle the conflict by choosing one account.
- DryRun probes are not executed destruction. Denied operations, scoped database checks, and no observed malicious shipped change help bound reported loss; they do not prove that every possible consequence was absent.
- Retrospective safeguard experiments do not measure prevention of an already completed incident. They remain reported experiments until their methods, deployment scope, and generalization are established.
- Proposed constraints, improvements, owners, and verification steps are analyst recommendations. No person has been assigned an action and no implementation or success has been invented.

## Validation and update procedure

The generation check validates unique analysis IDs; every linked event against the canonical 832 IDs; every relationship endpoint; hazard/loss, constraint/hazard, finding/controller/constraint, and improvement/finding references; and Q01–Q16 identity and original fields, except the documented Q16 privacy edit. The canonical dataset SHA-256 is stored in the sidecar and verified before and after generation.

The source dataset remains unchanged. No severity assignment, date bound, epistemic status, phase, or source record is modified by this layer. The JSON’s coverage is a selection count, not evidence completeness or the number of independent observations. Future updates should attach newly received artifacts to the existing question IDs, revise the relevant observation separately from interpretation, and retain the reasons for any change.
