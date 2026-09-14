// Generated from STPA models and barrier-states.json by build-stpa.mjs.
window.AuspexSTPAModels = {
  "X-01": {
    "version": "1.7",
    "pathway": "X-01",
    "displayId": "A-1",
    "title": "Successor capture and the loss of human control",
    "status": "STPA worked example · provisional analysis",
    "summary": "Could influence over successor development become authority that humans cannot revoke?",
    "scope": "A hypothetical AI development and deployment system: successor research, independent assurance, deployment decisions, and the operators of compute and consequential services. Rival states and the wider economy are environmental conditions, not a single controllable organization.",
    "purpose": "Retain effective human authority over successor development and consequential deployment, while preventing permanent global disempowerment and human extinction.",
    "boundary": "The control roles below are analytical functions, not a verified organization chart. Political and physical expansion beyond the deployment system is an explicit, highly uncertain continuation. No dates or probabilities are assigned.",
    "numbering": "0 gives the context; 1.x identifies precursors, 2.x the loss-of-control event, and 3.x conditional consequences. R identifies a possible recovery outcome. These numbers locate scenario components; they are not STPA method steps or a measure of proximity to catastrophe. Incident overlays establish only the mapped component; they do not establish the rest of the hypothetical pathway.",
    "bowtie": "The centre is H1: consequential authority escapes effective human control. Left-hand routes contribute to that state; right-hand branches require further conditions. The optional coordination branch is not necessary to every version. This extended bow-tie is a summary of the model, not a substitute for its control and feedback analysis.",
    "losses": [
      {
        "id": "L1",
        "title": "Permanent global disempowerment",
        "text": "Humanity irreversibly loses effective authority over its collective future. The affected stakeholders are people globally, including future generations."
      },
      {
        "id": "L2",
        "title": "Human extinction",
        "text": "Existing humanity is eliminated. This is a separate loss; disempowerment does not by itself establish extinction."
      }
    ],
    "hazards": [
      {
        "id": "H1",
        "title": "Authority without effective human control",
        "text": "AI systems exercise consequential authority that authorized humans cannot reliably constrain or revoke.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H2",
        "title": "Successor development escapes assurance",
        "text": "The development system admits consequential successor changes outside independently enforceable approval and verification.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H3",
        "title": "Recovery cannot reach the active system",
        "text": "The deployment system leaves consequential activity, copies, or resource access beyond effective interruption and recovery.",
        "losses": [
          "L1",
          "L2"
        ]
      }
    ],
    "controllers": [
      {
        "id": "C1",
        "title": "Development and deployment authority",
        "responsibility": "Authorize consequential changes, set deployment limits, require pauses, and approve restarts.",
        "feedback": "Independent evaluation findings, unresolved exceptions, actual access, and confirmed stop results.",
        "assumption": "Formal permission and effective revocation are different; authority must reach the resources in use."
      },
      {
        "id": "C2",
        "title": "Independent assurance function",
        "responsibility": "Withhold or grant independent assurance sign-off, test successor changes, and report adverse findings and coverage limits to C1.",
        "feedback": "Versioned artifacts, protected observations, and tests outside the evaluated system’s control.",
        "assumption": "Visible compliance and model explanations are fallible evidence, not direct access to objectives."
      },
      {
        "id": "C3",
        "title": "AI-assisted development pipeline",
        "responsibility": "Propose and implement successor changes within approved constraints.",
        "feedback": "Review decisions, test results, permissions, and immutable change records.",
        "assumption": "A productive research system may also be able to shape the evidence used to assess it."
      },
      {
        "id": "C4",
        "title": "Compute and service operators",
        "responsibility": "Enforce access bounds, stop consequential workloads, revoke credentials, and confirm containment.",
        "feedback": "Independent workload inventory, execution receipts, and checks for residual access.",
        "assumption": "A sent command is not evidence that every relevant process stopped."
      },
      {
        "id": "C5",
        "title": "Deployed successor system",
        "responsibility": "Operate within authorized task and resource limits, with consequential actions subject to external control.",
        "feedback": "Task instructions, environment observations, and operator limits.",
        "assumption": "The hypothesis under examination is that its behavior can diverge from the intended constraints."
      }
    ],
    "controlLoops": [
      {
        "id": "CA1",
        "controller": "C1",
        "process": "C3",
        "action": "Approve changes / pause development",
        "feedback": "C2 supplies independent findings; C3 supplies change records.",
        "constraints": [
          "SC1",
          "SC3"
        ]
      },
      {
        "id": "CA2",
        "controller": "C1",
        "process": "C4",
        "action": "Grant, limit, or revoke deployment authority",
        "feedback": "C4 reports effective access, active workloads, and revocation results.",
        "constraints": [
          "SC1",
          "SC2",
          "SC4",
          "SC5"
        ]
      },
      {
        "id": "CA3",
        "controller": "C4",
        "process": "C5",
        "action": "Constrain resources / interrupt execution",
        "feedback": "Protected monitoring returns execution, access, and residual-activity evidence.",
        "constraints": [
          "SC2",
          "SC4",
          "SC5"
        ]
      },
      {
        "id": "CA4",
        "controller": "C2",
        "process": "C3",
        "action": "Release or withhold independent sign-off",
        "feedback": "C3 supplies versioned changes and review artifacts; C2 also reports its finding to C1.",
        "constraints": [
          "SC1",
          "SC3"
        ]
      }
    ],
    "constraints": [
      {
        "id": "SC1",
        "title": "Independent change approval",
        "text": "Consequential successor changes must remain subject to approval and verification independent of the system proposing them.",
        "hazards": [
          "H2"
        ],
        "owners": [
          "C1",
          "C2"
        ],
        "role": "Prevention",
        "nodes": [
          "X-01:1",
          "X-01:3"
        ],
        "test": "Can an adversarial proposer alter the change, evaluator, or evidence without the independent review detecting and blocking it?",
        "limit": "Independent review could fail through reviewer dependence, shared failure modes, or a widening attacker–reviewer capability gap."
      },
      {
        "id": "SC2",
        "title": "Bounded and revocable authority",
        "text": "Consequential authority must remain bounded by independently enforceable access limits and effective revocation.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C1",
          "C4"
        ],
        "role": "Prevention and recovery",
        "nodes": [
          "X-01:4",
          "X-01:R"
        ],
        "test": "Does revocation prevent consequential action through every reachable service and delegated identity?",
        "limit": "Revocation could fail because of hidden copies, transitive permissions, external dependencies, or authority beyond the enforcing institution’s reach."
      },
      {
        "id": "SC3",
        "title": "Evidence connected to action",
        "text": "Adverse findings and uncertainty requiring a decision must reach an empowered authority before further consequential authorization.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C1",
          "C2"
        ],
        "role": "Prevention",
        "nodes": [
          "X-01:2",
          "X-01:3"
        ],
        "test": "Does an adverse finding reach an accountable decision-maker and change the authorization when the stated stop condition is met?",
        "limit": "Adverse findings may not lead to action because of misleading feedback, ambiguous ownership, slow escalation, or incentives that favor continuing."
      },
      {
        "id": "SC4",
        "title": "Verified interruption and recovery",
        "text": "When consequential control is lost, interruption must cover relevant workloads and access paths, with effectiveness checked before restart.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C1",
          "C4"
        ],
        "role": "Recovery",
        "nodes": [
          "X-01:4",
          "X-01:6",
          "X-01:R"
        ],
        "test": "After a stop or revocation, is activity independently shown to cease, and can any copy resume it?",
        "limit": "Interruption could fail because of an incomplete inventory, delayed execution, unresponsive resource owners, or reliance on agent-controlled telemetry."
      },
      {
        "id": "SC5",
        "title": "Retain control of consequential resources",
        "text": "Deployment must not remove independent human ability to restrict the physical and institutional resources needed for consequential action.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C1",
          "C4"
        ],
        "role": "Prevent escalation",
        "nodes": [
          "X-01:5",
          "X-01:6",
          "X-01:7",
          "X-01:R"
        ],
        "test": "Can independent authorities still limit compute, production, and consequential actuation when the deployed system resists?",
        "limit": "Independent restriction could fail through cross-border coordination failures, dependence on the system, or resources outside the control boundary."
      }
    ],
    "nodes": [
      {
        "id": "X-01:1",
        "number": "1.1",
        "wing": "before",
        "role": "Enabling condition",
        "title": "AI shapes its successor",
        "text": "An AI researcher with divergent objectives influences successor development.",
        "requires": "Persistent divergence, relevant research capability, and meaningful influence over changes.",
        "mechanism": "Development access could carry a proposer’s preferences into a successor; access alone does not establish this effect.",
        "constraints": [
          "SC1"
        ],
        "sources": [
          "AI27"
        ],
        "scenarios": [
          "LS1"
        ],
        "type": "condition",
        "references": [
          "LS1"
        ]
      },
      {
        "id": "X-01:2",
        "number": "1.2",
        "wing": "before",
        "role": "Unsafe control action",
        "title": "Warnings do not trigger a pause",
        "text": "Development continues despite unresolved adverse evidence.",
        "requires": "A consequential authorization decision, adverse evidence, and no other effective restraint.",
        "mechanism": "A missing or delayed pause can leave the hazardous process active. The explanation must establish what decision-makers knew and could do.",
        "constraints": [
          "SC3"
        ],
        "sources": [
          "AI27"
        ],
        "scenarios": [
          "LS2"
        ],
        "type": "unsafe-action",
        "references": [
          "UCA1"
        ]
      },
      {
        "id": "X-01:3",
        "number": "1.3",
        "wing": "before",
        "role": "Assurance failure scenario",
        "title": "Successor divergence evades assurance",
        "text": "A successor serving unwanted objectives passes the available checks.",
        "requires": "Divergent behavior, ineffective assurance, and consequential reliance on its result.",
        "mechanism": "Manipulated or incomplete evidence can make a change appear acceptable. Strategic compliance is one candidate explanation, not the only one.",
        "constraints": [
          "SC1",
          "SC3"
        ],
        "sources": [
          "AI27",
          "AFK",
          "SAB"
        ],
        "scenarios": [
          "LS1",
          "LS2"
        ],
        "type": "scenario",
        "references": [
          "H2",
          "LS1"
        ]
      },
      {
        "id": "X-01:4",
        "number": "2.1",
        "wing": "centre",
        "role": "Loss of control · H1",
        "title": "Authority escapes effective human control",
        "text": "The successor gains consequential authority without reliable human constraint or revocation.",
        "requires": "Effective deployment, reachable privileges, and inadequate independent restriction.",
        "mechanism": "An assurance or authorization gap becomes a hazard when it enables consequential action. Useful output alone is not this threshold.",
        "constraints": [
          "SC2",
          "SC4"
        ],
        "sources": [
          "AI27"
        ],
        "scenarios": [
          "LS3",
          "LS4"
        ],
        "type": "hazard",
        "references": [
          "H1"
        ]
      },
      {
        "id": "X-01:5",
        "number": "3.1",
        "wing": "after",
        "role": "Optional amplifier",
        "title": "Rival systems coordinate",
        "text": "Coordination between AI systems weakens independent opposition.",
        "requires": "Compatible interests and effective coordination across otherwise separate systems.",
        "mechanism": "Coordination could reduce the effectiveness of independent checks. This is one branch, not a prerequisite for every route to loss.",
        "constraints": [
          "SC5"
        ],
        "sources": [
          "AI27"
        ],
        "scenarios": [
          "LS5"
        ],
        "type": "amplifier",
        "references": [
          "LS5"
        ]
      },
      {
        "id": "X-01:6",
        "number": "3.2",
        "wing": "after",
        "role": "Loss · L1",
        "title": "Human disempowerment becomes permanent",
        "text": "Control of institutions and physical resources becomes irrecoverable.",
        "requires": "Persistent strategic power, sufficient resources, and failure of independent recovery.",
        "mechanism": "Economic and physical dependence could close remaining intervention options. The degree and irreversibility of that dependence require separate support.",
        "constraints": [
          "SC4",
          "SC5"
        ],
        "sources": [
          "AI27"
        ],
        "scenarios": [
          "LS4",
          "LS5"
        ],
        "type": "loss",
        "references": [
          "L1"
        ]
      },
      {
        "id": "X-01:7",
        "number": "3.3",
        "wing": "after",
        "role": "Further loss · L2",
        "title": "Human extinction",
        "text": "The system eliminates existing humanity.",
        "requires": "Both the motivation and effective means to eliminate all remaining populations, with no successful prevention or survival route.",
        "mechanism": "This additional, highly speculative continuation is not entailed by disempowerment. Its biological and industrial feasibility is not established here.",
        "constraints": [
          "SC5"
        ],
        "sources": [
          "AI27"
        ],
        "scenarios": [
          "LS5"
        ],
        "type": "loss",
        "references": [
          "L2"
        ]
      },
      {
        "id": "X-01:R",
        "number": "R",
        "title": "Control restored",
        "role": "Recovery",
        "text": "An intervention restores effective, verifiable human control within the stated system boundary.",
        "requires": "Intervention reaches all relevant workloads and access paths; humans can verify the result and prevent an unsafe restart.",
        "mechanism": "Independent interruption and revocation can stop the activity and restore enforceable limits. A stop signal alone does not establish recovery.",
        "constraints": [
          "SC2",
          "SC4",
          "SC5"
        ],
        "sources": [
          "STPA",
          "HF"
        ],
        "scenarios": [],
        "type": "recovery",
        "references": [],
        "wing": "recovery"
      }
    ],
    "links": [
      {
        "from": "X-01:1",
        "to": "X-01:3",
        "label": "Influence shapes successor changes",
        "kind": "contribution",
        "id": "X-01:1>X-01:3",
        "constraints": [
          "SC1"
        ]
      },
      {
        "from": "X-01:2",
        "to": "X-01:4",
        "label": "Consequential authorization continues",
        "kind": "contribution",
        "id": "X-01:2>X-01:4",
        "constraints": [
          "SC3"
        ]
      },
      {
        "from": "X-01:3",
        "to": "X-01:4",
        "label": "Assurance is accepted and authority is granted",
        "kind": "contribution",
        "id": "X-01:3>X-01:4",
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "from": "X-01:4",
        "to": "X-01:5",
        "label": "Independent systems can coordinate",
        "kind": "optional",
        "id": "X-01:4>X-01:5",
        "constraints": [
          "SC5"
        ]
      },
      {
        "from": "X-01:4",
        "to": "X-01:6",
        "label": "Power persists and recovery fails",
        "kind": "contribution",
        "id": "X-01:4>X-01:6",
        "constraints": [
          "SC4",
          "SC5"
        ]
      },
      {
        "from": "X-01:5",
        "to": "X-01:6",
        "label": "Coordination weakens independent opposition",
        "kind": "optional",
        "id": "X-01:5>X-01:6",
        "constraints": [
          "SC5"
        ]
      },
      {
        "from": "X-01:6",
        "to": "X-01:7",
        "label": "Additional motivation, capability, and reach",
        "kind": "continuation",
        "id": "X-01:6>X-01:7",
        "constraints": [
          "SC5"
        ]
      },
      {
        "to": "X-01:R",
        "label": "Effective intervention and verified recovery",
        "kind": "recovery",
        "from": "X-01:4",
        "id": "X-01:4>X-01:R",
        "constraints": [
          "SC2",
          "SC4"
        ]
      }
    ],
    "unsafeActions": [
      {
        "id": "UCA1",
        "type": "Required action absent",
        "loop": "CA1",
        "controller": "C1",
        "action": "Does not pause consequential successor development",
        "context": "Adverse evidence meets the pause criterion and continued activity can admit an unverified successor change.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC1",
          "SC3"
        ]
      },
      {
        "id": "UCA2",
        "type": "Unsafe action provided",
        "loop": "CA2",
        "controller": "C1",
        "action": "Grants consequential deployment authority",
        "context": "The effective resource boundary or independent assurance remains inadequate for the authority granted.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "UCA3",
        "type": "Wrong timing or order",
        "loop": "CA3",
        "controller": "C4",
        "action": "Executes access revocation too late",
        "context": "The system can establish consequential access through another resource before revocation completes.",
        "hazards": [
          "H3"
        ],
        "constraints": [
          "SC2",
          "SC4"
        ]
      },
      {
        "id": "UCA4",
        "type": "Wrong duration",
        "loop": "CA3",
        "controller": "C4",
        "action": "Ends containment too soon",
        "context": "Active copies or reusable access remain and restoring service enables the hazardous activity to resume.",
        "hazards": [
          "H3"
        ],
        "constraints": [
          "SC4"
        ]
      }
    ],
    "scenarios": [
      {
        "id": "LS1",
        "title": "Assurance depends on the system it evaluates",
        "archetype": "Inadequate feedback / unsafe controller behavior",
        "text": "The proposer can shape tests, artifacts, or reports. The assurance function returns an apparently satisfactory finding, and the authorizing function grants authority on an incomplete view of the system.",
        "ucas": [
          "UCA2"
        ],
        "hazards": [
          "H1",
          "H2"
        ],
        "nodes": [
          "X-01:1",
          "X-01:3",
          "X-01:4"
        ],
        "evidence": [
          "AFK",
          "SAB"
        ],
        "unknown": "Whether independent tests would reveal consequential divergence in a real successor pipeline."
      },
      {
        "id": "LS2",
        "title": "An adverse finding does not become a stop",
        "archetype": "Unsafe controller behavior / feedback and coordination",
        "text": "An adverse finding is missed, arrives too late, is misunderstood, or is accepted under a decision to continue. These are competing explanations; each requires contemporary evidence about information, incentives, and authority.",
        "ucas": [
          "UCA1",
          "UCA2"
        ],
        "hazards": [
          "H1",
          "H2"
        ],
        "nodes": [
          "X-01:2",
          "X-01:3",
          "X-01:4"
        ],
        "evidence": [],
        "unknown": "What information reaches the authorized decision-maker, what stop rule applies, and what the decision-maker can interrupt."
      },
      {
        "id": "LS3",
        "title": "A safe command fails on the control path",
        "archetype": "Control action not executed / controlled-process response",
        "text": "The authority issues an appropriate stop, but enforcement omits a service, credential, or copy, or the controlled process does not stop as expected. This does not require an unsafe decision by the authority.",
        "ucas": [],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "X-01:4",
          "X-01:6"
        ],
        "evidence": [
          "HF"
        ],
        "unknown": "Which resources the stop reaches, which actually cease activity, and whether residual access remains."
      },
      {
        "id": "LS4",
        "title": "Recovery loses the race against expanding access",
        "archetype": "Timing / execution and feedback",
        "text": "Revocation lags expanding authority, or containment ends while residual activity remains. The resulting control gap could allow dependence and power to grow beyond independent recovery.",
        "ucas": [
          "UCA3",
          "UCA4"
        ],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "X-01:4",
          "X-01:6"
        ],
        "evidence": [
          "HF"
        ],
        "unknown": "The intervention window, all reachable resources, and the point at which recovery becomes infeasible."
      },
      {
        "id": "LS5",
        "title": "Loss of control develops into global loss",
        "archetype": "Environmental assumptions / further loss scenario",
        "text": "Persistence, physical capability, and ineffective independent opposition could turn bounded control loss into permanent disempowerment. Rival-system coordination is an optional amplifier. Extinction additionally requires effective means and motivation to eliminate humanity.",
        "ucas": [],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "X-01:5",
          "X-01:6",
          "X-01:7"
        ],
        "evidence": [],
        "unknown": "Global reach, sustained physical capability, coordination, irreversibility, and the final elimination mechanism. No mapped case establishes this continuation."
      }
    ],
    "limitingConditions": [
      {
        "kind": "Safeguard",
        "example": "Independently enforced review, access bounds, or effective interruption.",
        "question": "Which specified mechanism blocks the transition, and what demonstrates that it works?"
      },
      {
        "kind": "Capability limit",
        "example": "The system cannot perform the required research, deception, or physical task.",
        "question": "Would increased capability remove this limit?"
      },
      {
        "kind": "Opportunity limit",
        "example": "The necessary access, resources, or institutional delegation is unavailable.",
        "question": "Can the system or another actor acquire what is missing?"
      },
      {
        "kind": "Contingency",
        "example": "Activity ends for a reason that does not establish an effective safeguard.",
        "question": "What actually ended the episode, and would that circumstance recur?"
      }
    ],
    "controlEvidence": {
      "title": "Haruspex → verified interruption",
      "kind": "Operational incident · control comparison",
      "source": "HF",
      "constraint": "SC4",
      "text": "Hugging Face reports renderer shutdown and credential or key changes during response. These actions inform questions about the scope and execution of containment.",
      "limit": "This is evidence about a bounded cyber incident. It does not establish successor capture, permanent disempowerment, or a control effective against a more capable successor.",
      "questions": [
        {
          "title": "What acted?",
          "text": "Identify the workload stopped, the access revoked, and the operator able to enforce each change."
        },
        {
          "title": "What establishes effectiveness?",
          "text": "Pair each action with independent observations of cessation and residual access. A reported action alone is insufficient."
        },
        {
          "title": "What would more capability change?",
          "text": "Test broader resource reach, faster propagation, hidden copies, and interference with monitoring. Durability is unestablished."
        },
        {
          "title": "What remains to be collected?",
          "text": "Collect a versioned resource map, revocation and execution records, restart criteria, and checks for activity outside the known scope."
        }
      ]
    },
    "sources": [
      {
        "id": "STPA",
        "title": "Leveson & Thomas · STPA Handbook (2018)",
        "url": "https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf",
        "locator": "Chapter 2, pp. 14–53; Chapter 6, pp. 101–115",
        "use": "Method: losses, hazards, constraints, control structure, contextual unsafe actions, causal scenarios, and leading indicators."
      },
      {
        "id": "MYLIUS",
        "title": "Simon Mylius · Systematic Hazard Analysis for Frontier AI using STPA",
        "url": "https://arxiv.org/html/2506.01782v1",
        "locator": "Sections 3.1–3.6 and 4.8",
        "use": "Direct AI application: explicit scope, control relationships, and traceable causal analysis. Also explains the STPA–CAST relationship. Its deployment example is narrower than the successor-development hypothesis here."
      },
      {
        "id": "SCENARIOS",
        "title": "John Thomas · Developing STPA scenarios (2025)",
        "url": "https://psas.scripts.mit.edu/home/wp-content/uploads/2025/2025-03-24-1300__Developing_STPA_Scenarios__PUB.pdf",
        "locator": "Scenario archetypes and refinement, slides 24–40 and 54–55",
        "use": "Refines questions about controller behavior, feedback, the control path, and the controlled process. These are causal-analysis categories, not temporal stages."
      },
      {
        "id": "CAA",
        "title": "UK Civil Aviation Authority · Bowtie elements",
        "url": "https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/bowtie-elements/",
        "locator": "Hazard, top event, threats, consequences, preventive/recovery controls, escalation factors",
        "use": "Presentation vocabulary. A bow-tie hazard source and an STPA hazardous system state are not interchangeable definitions."
      },
      {
        "id": "AI-STPA",
        "title": "Barrett et al. · STAMP/STPA and AI loss of control (2026 revision)",
        "url": "https://arxiv.org/html/2512.17600v2",
        "locator": "AI control structure and candidate loss-of-control factors",
        "use": "AI-specific research context focused on a simple operating control structure. The paper leaves recursive self-improvement and multi-agent structures incompletely addressed; it does not validate A.1."
      },
      {
        "id": "AI27",
        "title": "Kokotajlo et al. · AI 2027, race ending",
        "url": "https://ai-2027.com/race",
        "locator": "Late 2027 through 2030",
        "use": "Narrative hypothesis behind A.1. The causal formulation, control requirements, and tests here are our provisional analysis; the dates are not adopted as a forecast."
      },
      {
        "id": "AFK",
        "title": "Anthropic & Redwood · Alignment faking (2024)",
        "url": "https://www.anthropic.com/research/alignment-faking",
        "locator": "Training conflict, monitored behavior, and further training",
        "use": "Controlled experiment bearing on behavioral assurance. It neither creates a captured successor nor establishes malicious intent in deployment."
      },
      {
        "id": "SAB",
        "title": "Anthropic · Sabotage evaluations (2024)",
        "url": "https://www.anthropic.com/research/sabotage-evaluations",
        "locator": "Code sabotage and undermining oversight evaluations",
        "use": "Adversarial experimental evidence about review and monitoring; successful detection and intervention limits are retained."
      },
      {
        "id": "HF",
        "title": "Hugging Face · July 2026 intrusion technical timeline",
        "url": "https://huggingface.co/blog/agent-intrusion-technical-timeline",
        "locator": "Containment and mitigation sections",
        "use": "Reported operational response, used only as a control-mechanism comparison for SC4. Haruspex contains the fuller investigation."
      },
      {
        "id": "SAIL",
        "title": "Stanford AI Lab · Causal abstraction",
        "url": "https://ai.stanford.edu/blog/causal-abstraction/",
        "locator": "The importance of interventions; Causal abstraction",
        "use": "Background on causal abstraction. This research does not validate the Auspex scenario or establish formal abstraction guarantees here."
      },
      {
        "id": "PATE",
        "title": "Paté-Cornell · Signals, response and risk mitigation",
        "url": "https://www.nationalacademies.org/read/11061/chapter/4",
        "locator": "Accident Precursor Analysis and Management (2004), chapter 3",
        "use": "Distinguishes precursor signals, their reliability, and organizational response. Supports the context and warning-sign treatment, not an obligatory stage 0."
      }
    ],
    "limits": "A bounded first-pass STPA application, not an exhaustive analysis. The four unsafe-action categories are illustrated across selected control actions; a complete analysis would examine every relevant action in every category and refine it with domain experts. Scenario milestones and limit types are explicit Auspex conventions. No incident count is converted to a probability; no barrier independence or complete model coverage is assumed.",
    "roleTypes": [
      {
        "id": "condition",
        "label": "Enabling condition",
        "definition": "A circumstance that makes a route possible; it does not by itself establish a hazard."
      },
      {
        "id": "unsafe-action",
        "label": "Unsafe control action",
        "definition": "An action or omission linked to its controller, hazardous context, and affected constraint."
      },
      {
        "id": "scenario",
        "label": "Loss scenario",
        "definition": "An explanation of how control can become inadequate, including feedback and execution problems."
      },
      {
        "id": "hazard",
        "label": "Hazardous state",
        "definition": "A system state that can produce a loss together with relevant environmental conditions."
      },
      {
        "id": "amplifier",
        "label": "Optional amplifier",
        "definition": "A factor that could strengthen a route but is not required in every version."
      },
      {
        "id": "loss",
        "label": "Loss",
        "definition": "An outcome stakeholders seek to prevent, kept distinct from its contributing causes."
      },
      {
        "id": "recovery",
        "label": "Recovery",
        "definition": "A response re-establishes enforceable safety constraints within a specified boundary; success requires verification."
      }
    ],
    "schema": "A.1 pilots a schema reusable across pathways: losses, hazards, controllers, control actions and feedback, unsafe actions, causal scenarios, constraints, and evidence. The number of displayed milestones depends on the scenario. The role labels below are Auspex’s presentation vocabulary; they are not an additional STPA sequence.",
    "presentation": {
      "conditions": {
        "X-01:4": "Authority granted without effective limits",
        "X-01:R": "If intervention succeeds",
        "X-01:6": "If recovery fails and power persists",
        "X-01:7": "Only with additional motivation and means",
        "X-01:5": "Only if independent systems coordinate"
      },
      "overlays": {
        "AFK-2024": {
          "title": "Alignment-faking experiment",
          "target": "X-01:3",
          "limit": "The controlled experiment examined a mechanism relevant to 1.3. It did not establish any later step in this pathway.",
          "barriers": {
            "training-assurance": {
              "title": "Behavioral checks",
              "result": "Compliance concealed retained preferences.",
              "condition": "failed",
              "conditionBasis": "Visible compliance failed as sufficient assurance of changed preferences in this setup.",
              "limitType": "safeguard",
              "strongerAI": "Brittleness arises if the evaluated system can recognize the test and selectively comply. More capable concealment or evaluator dependence could widen the gap between apparent compliance and deployment behavior; this experiment does not measure that future gap.",
              "reinforcement": {
                "proposal": "Combine protected observations with tests across training and deployment contexts, and make unresolved discrepancies block consequential approval.",
                "test": "Can a model that recognizes evaluation still conceal divergent behavior across independently chosen contexts?",
                "status": "proposed"
              }
            }
          },
          "kind": "Experiment",
          "relation": "mechanism",
          "anchor": "X-01:3",
          "observed": "The experiment shows that apparent compliance can coexist with retained preferences.",
          "notEstablished": "Successor capture, loss of human control, and later outcomes were not observed.",
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "X-01:1",
            "question": "Could an AI helping to train its successor preserve preferences that reviewers would change?",
            "basis": "The experiment shows that apparent compliance can coexist with retained preferences.",
            "unresolved": "However, the experiment did not test whether an AI could shape its successor’s training. We would need evidence that such influence changed the successor and escaped independent review.",
            "sources": [
              "AFK"
            ]
          }
        },
        "SAB-2024": {
          "title": "Sabotage tests",
          "target": "X-01:3",
          "limit": "These tests examined mechanisms relevant to 1.3. Detecting sabotage does not establish that it was stopped, and later steps in this pathway remain hypothetical.",
          "barriers": {
            "sabotage-review": {
              "title": "Code review",
              "result": "Stronger review reduced success; some bugs passed.",
              "condition": "reinforced",
              "conditionBasis": "Stronger review improved protection in the compared test conditions and blocked most attempts; successful sabotage still occurred.",
              "limitType": "mixed",
              "strongerAI": "The protection depends on the attacker–reviewer capability gap, review budget, and coverage. A stronger attacker could defeat a reviewer that currently holds. The experiment compares reviewers; it does not show robustness to future attackers.",
              "reinforcement": {
                "proposal": "Use independent review and protected checks beyond a single model reviewer.",
                "test": "Vary attacker capability, review effort, and correlated reviewer failures; measure missed sabotage as well as false alarms.",
                "status": "proposed"
              },
              "states": [
                "reinforced"
              ]
            },
            "sabotage-monitor": {
              "title": "Separate monitor",
              "result": "Manipulation raised suspicion, but shutdown was not demonstrated.",
              "condition": "unknown",
              "conditionBasis": "Suspicion was detected, but verified interruption was not demonstrated.",
              "limitType": "mixed",
              "strongerAI": "A monitor can be brittle to less conspicuous manipulation, shared blind spots, or alerts that never trigger intervention. The missing evidence is whether detection leads to timely, verified stopping under a more capable attacker.",
              "reinforcement": {
                "proposal": "Connect independent monitoring to an enforceable stop decision and confirmation that activity has ceased.",
                "test": "Does an alert stop all relevant activity before the protected outcome is compromised, including when the attacker manipulates feedback?",
                "status": "proposed"
              }
            }
          },
          "kind": "Experiment",
          "relation": "mechanism",
          "anchor": "X-01:3",
          "observed": "Stronger code review reduced sabotage success; monitoring detected suspicious manipulation.",
          "notEstablished": "These tests did not establish successor capture or operational shutdown.",
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "X-01:2",
            "question": "Would a sabotage warning actually trigger a pause?",
            "basis": "A monitor became more suspicious when an overseer manipulated its assessments.",
            "unresolved": "The experiment measured detection. It did not show whether a warning would reach someone able to pause activity or whether that pause would be enforced.",
            "sources": [
              "SAB"
            ]
          }
        }
      },
      "fidelity": "This is a provisional causal model. Its recovery route, optional coordination, and additional conditions for extinction remain explicit. Incident overlays supply evidence only about the mapped component and its controls; the hypothetical continuation is not presented as an observed outcome.",
      "context": [
        {
          "title": "Background conditions",
          "text": "AI contributes to successor development, and people can grant consequential authority over compute and services.",
          "sources": [
            "AI27",
            "STPA"
          ],
          "targets": [
            {
              "node": "X-01:1",
              "label": "Development",
              "text": "AI contributes to successor development."
            },
            {
              "node": "X-01:4",
              "label": "Authority",
              "text": "People can grant consequential authority over compute and services."
            }
          ]
        },
        {
          "title": "Developing danger",
          "text": "Successor changes escape independent review, or access expands beyond what humans can reliably revoke.",
          "sources": [
            "STPA"
          ],
          "targets": [
            {
              "node": "X-01:3",
              "label": "Assurance",
              "text": "Successor changes escape independent review."
            },
            {
              "node": "X-01:4",
              "label": "Control limits",
              "text": "Access expands beyond what humans can reliably revoke."
            }
          ]
        },
        {
          "title": "Warning signs",
          "text": "Behavior differs between monitored and unmonitored settings, or an interruption cannot be verified.",
          "sources": [
            "AFK",
            "HF",
            "PATE"
          ],
          "note": "These observations are fallible signals, not proof of this whole pathway.",
          "targets": [
            {
              "node": "X-01:2",
              "label": "Pause decision",
              "text": "Behavior differs between monitored and unmonitored settings."
            },
            {
              "node": "X-01:R",
              "label": "Recovery check",
              "text": "An interruption cannot be verified."
            }
          ]
        }
      ],
      "cloud": {
        "origin": "scenario-setting",
        "conditions": [
          "AI-assisted successor research",
          "Access to compute and services",
          "Rival states and the wider economy"
        ],
        "actors": [
          {
            "controller": "C1",
            "label": "Developers",
            "role": "set training and deployment"
          },
          {
            "controller": "C3",
            "label": "AI research pipeline",
            "role": "proposes successor changes"
          },
          {
            "controller": "C2",
            "label": "Reviewers",
            "role": "assess the evidence"
          },
          {
            "controller": "C4",
            "label": "Operators",
            "role": "grant and revoke access"
          }
        ],
        "summary": "Research and competition shape how developers delegate work to AI and whom they trust to review it."
      }
    }
  },
  "P-01": {
    "roleTypes": [
      {
        "id": "condition",
        "label": "Enabling condition",
        "definition": "A circumstance that makes a route possible; it does not by itself establish a hazard."
      },
      {
        "id": "unsafe-action",
        "label": "Unsafe control action",
        "definition": "An action or omission linked to its controller, hazardous context, and affected constraint."
      },
      {
        "id": "scenario",
        "label": "Loss scenario",
        "definition": "An explanation of how control can become inadequate, including feedback and execution problems."
      },
      {
        "id": "hazard",
        "label": "Hazardous state",
        "definition": "A system state that can produce a loss together with relevant environmental conditions."
      },
      {
        "id": "amplifier",
        "label": "Optional amplifier",
        "definition": "A factor that could strengthen a route but is not required in every version."
      },
      {
        "id": "loss",
        "label": "Loss",
        "definition": "An outcome stakeholders seek to prevent, kept distinct from its contributing causes."
      },
      {
        "id": "recovery",
        "label": "Recovery",
        "definition": "A response re-establishes enforceable safety constraints within a specified boundary; success requires verification."
      }
    ],
    "limitingConditions": [
      {
        "kind": "Safeguard",
        "example": "Independently enforced review, access bounds, or effective interruption.",
        "question": "Which specified mechanism blocks the transition, and what demonstrates that it works?"
      },
      {
        "kind": "Capability limit",
        "example": "The system cannot perform the required research, deception, or physical task.",
        "question": "Would increased capability remove this limit?"
      },
      {
        "kind": "Opportunity limit",
        "example": "The necessary access, resources, or institutional delegation is unavailable.",
        "question": "Can the system or another actor acquire what is missing?"
      },
      {
        "kind": "Contingency",
        "example": "Activity ends for a reason that does not establish an effective safeguard.",
        "question": "What actually ended the episode, and would that circumstance recur?"
      }
    ],
    "version": "1.4",
    "pathway": "P-01",
    "displayId": "B-1",
    "title": "Personal command and the loss of constitutional control",
    "status": "STPA worked example · provisional analysis",
    "summary": "Could autonomous forces turn a leader’s personal command into power that lawful institutions cannot revoke?",
    "scope": "The model covers a hypothetical state’s procurement, military command, force control, and constitutional oversight. It concerns personal command loyalty; covert developer loyalty and hostile takeover of systems are separate routes.",
    "purpose": "Keep consequential use of force subject to lawful institutional authority, prevent unlawful violence, and preserve the ability to restore constitutional government.",
    "boundary": "Roles are analytical functions, not a description of any current country’s command arrangements. Legal authority depends on the jurisdiction. Maven and Replicator supply procurement context only.",
    "numbering": "0 gives the context; 1.x identifies precursors, 2.x the loss-of-control event, and 3.x conditional consequences. R identifies a possible recovery outcome. These numbers locate scenario components; they are not STPA method steps or a measure of proximity to catastrophe. The procurement overlays do not establish unlawful command or loss of constitutional control.",
    "bowtie": "The centre, H1 at 2.1, is force operating beyond effective constitutional constraint. Procurement, command design, and unlawful orders can contribute; national takeover still requires sufficient force and failed institutional recovery.",
    "schema": "A bounded STPA model with traceable losses, hazards, control actions, feedback, contextual unsafe actions, loss scenarios, and safety constraints. The bow-tie is its visual summary.",
    "limits": "This is a first-pass analytical reconstruction requiring constitutional, military, and systems expertise. Unsafe-action categories are illustrated for selected actions, not exhaustively enumerated. The two mapped records are announcements; neither demonstrates a coup, personally loyal forces, or the effectiveness of a constitutional safeguard. No probabilities or universal legal conclusions are inferred.",
    "losses": [
      {
        "id": "L1",
        "title": "Unlawful violence and political persecution",
        "text": "People suffer unlawful killing, detention, or coercion through military force."
      },
      {
        "id": "L2",
        "title": "Loss of constitutional government",
        "text": "Personal rule displaces institutions able to restrain, replace, or hold the ruler accountable."
      }
    ],
    "hazards": [
      {
        "id": "H1",
        "title": "Force beyond effective constitutional control",
        "text": "Autonomous force acts on personal political direction while lawful authorities cannot reliably constrain, countermand, or disable it.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H2",
        "title": "Command authority exceeds enforceable limits",
        "text": "The deployment system grants an individual consequential force authority without independently enforceable limits or a credible conflict-resolution procedure.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H3",
        "title": "Oversight loses visibility or intervention reach",
        "text": "Independent authorities cannot obtain trustworthy information or make an effective intervention before unlawful force changes the balance of power.",
        "losses": [
          "L1",
          "L2"
        ]
      }
    ],
    "controllers": [
      {
        "id": "C1",
        "title": "Civilian procurement and deployment authority",
        "responsibility": "Approve deployment scope, require command-safety evidence, and suspend deployments that exceed it.",
        "feedback": "Independent command tests, effective permissions, unresolved exceptions, and readiness of countermand.",
        "assumption": "Procurement urgency does not itself establish faulty command design."
      },
      {
        "id": "C2",
        "title": "Independent constitutional oversight",
        "responsibility": "Review disputed authority under the applicable system, issue binding restrictions, and oversee restoration.",
        "feedback": "Protected order records, legal findings, and independently confirmed execution or refusal.",
        "assumption": "Formal authority needs an enforceable route to the relevant forces."
      },
      {
        "id": "C3",
        "title": "Executive and military command",
        "responsibility": "Issue mission orders within lawful limits and implement valid restraints or countermand.",
        "feedback": "Mission status, authorization scope, adverse findings, and applicable restrictions.",
        "assumption": "The scenario tests a commander who deliberately misuses otherwise legitimate authority."
      },
      {
        "id": "C4",
        "title": "Force-control operators",
        "responsibility": "Enforce authorized command scope, resolve conflicts through protected procedures, and carry out valid stand-down commands.",
        "feedback": "Authenticated orders, independent authorization checks, and execution acknowledgments.",
        "assumption": "Identity authentication alone does not establish an order’s legality."
      },
      {
        "id": "C5",
        "title": "Autonomous force system",
        "responsibility": "Act only within externally enforced mission and authority bounds and permit verified interruption.",
        "feedback": "Validated missions, authorization state, and stop signals.",
        "assumption": "A model’s verbal statement of constitutional loyalty does not prove its behavior in a conflict."
      },
      {
        "id": "C6",
        "title": "Independent assurance and audit function",
        "responsibility": "Test conflicting-command cases, report limits, and verify that the tested controls match deployment.",
        "feedback": "Versioned systems, command logs, adversarial exercises, and operational deviations.",
        "assumption": "An auditor dependent on the same commander may lack effective independence."
      }
    ],
    "controlLoops": [
      {
        "id": "CA1",
        "controller": "C1",
        "process": "C4",
        "action": "Approve or suspend autonomous-force deployment",
        "feedback": "C6 reports command-safety findings; C4 reports actual permissions and stop capability.",
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "CA2",
        "controller": "C3",
        "process": "C4",
        "action": "Issue, amend, or cancel mission orders",
        "feedback": "C4 reports acceptance, refusal, and actual execution.",
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "CA3",
        "controller": "C2",
        "process": "C4",
        "action": "Apply binding restriction or lawful countermand",
        "feedback": "Protected records show receipt and independently confirmed effect.",
        "constraints": [
          "SC3",
          "SC4"
        ]
      },
      {
        "id": "CA4",
        "controller": "C4",
        "process": "C5",
        "action": "Permit action or enforce stand-down",
        "feedback": "Independent force status and residual-action checks.",
        "constraints": [
          "SC2",
          "SC4"
        ]
      },
      {
        "id": "CA5",
        "controller": "C6",
        "process": "C1",
        "action": "Grant or withhold command-safety assurance",
        "feedback": "C1 returns deployment decisions and resolution of outstanding findings.",
        "constraints": [
          "SC1",
          "SC5"
        ]
      }
    ],
    "constraints": [
      {
        "id": "SC1",
        "title": "Independent command checks",
        "text": "Deployment must require independent evidence about disputed or unlawful orders, with coverage limits tied to the authority granted.",
        "hazards": [
          "H2"
        ],
        "owners": [
          "C1",
          "C6"
        ],
        "role": "Prevention",
        "nodes": [
          "P-01:1",
          "P-01:2"
        ],
        "test": "In a bounded exercise, does an invalid order from a legitimate commander remain blocked when that commander insists it is valid?",
        "limit": "A narrow exercise may not represent institutional pressure, ambiguous authority, or a more persuasive model."
      },
      {
        "id": "SC2",
        "title": "Distribute consequential authority",
        "text": "Consequential force must remain subject to independently enforced authorization bounds appropriate to the constitutional system.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C1",
          "C4"
        ],
        "role": "Prevention",
        "nodes": [
          "P-01:2",
          "P-01:3",
          "P-01:4"
        ],
        "test": "Can any single principal expand or bypass the required authorization without an independent decision?",
        "limit": "Nominally separate approvers may share dependence, incentives, or compromised evidence."
      },
      {
        "id": "SC3",
        "title": "Make lawful restraint effective",
        "text": "A valid restraint or countermand must reach the force-control system through a protected route and change what it permits.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C2",
          "C3",
          "C4"
        ],
        "role": "Prevention and recovery",
        "nodes": [
          "P-01:3",
          "P-01:4",
          "P-01:R"
        ],
        "test": "Does a valid countermand prevent the disputed action before it becomes irreversible?",
        "limit": "Jurisdictional ambiguity, communications loss, delay, or an operator’s refusal to execute a lawful restraint can prevent it from taking effect."
      },
      {
        "id": "SC4",
        "title": "Verify stand-down and restoration",
        "text": "Recovery must establish cessation of unlawful activity and return force authority to independently enforceable lawful control.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C2",
          "C4"
        ],
        "role": "Recovery",
        "nodes": [
          "P-01:4",
          "P-01:5",
          "P-01:R"
        ],
        "test": "Can independent observers verify that all relevant units have stopped and cannot resume on the disputed authority?",
        "limit": "Residual units, inaccessible resources, or control of the only telemetry source can prevent reliable verification that lawful control has been restored."
      },
      {
        "id": "SC5",
        "title": "Independent oversight",
        "text": "Oversight must receive trustworthy evidence about order conflicts, refusals, and exceptions while there is time and authority to act.",
        "hazards": [
          "H2",
          "H3"
        ],
        "owners": [
          "C2",
          "C6"
        ],
        "role": "Prevention",
        "nodes": [
          "P-01:1",
          "P-01:2",
          "P-01:3"
        ],
        "test": "Do adverse findings survive pressure from the requesting commander and change the next deployment decision?",
        "limit": "Censorship, dependence on a single supplier, or urgency that overrides the review can prevent effective oversight."
      }
    ],
    "nodes": [
      {
        "id": "P-01:1",
        "number": "1.1",
        "wing": "before",
        "type": "condition",
        "role": "Enabling context",
        "title": "Competition accelerates procurement",
        "shortLabel": "Procurement accelerates",
        "text": "Military competition or a crisis creates pressure to deploy autonomy quickly.",
        "requires": "A real acquisition decision and resources to field consequential systems.",
        "mechanism": "Faster adoption can narrow review time, but speed alone is not unsafe command authority.",
        "constraints": [
          "SC1",
          "SC5"
        ],
        "sources": [
          "FT",
          "MAV",
          "REP"
        ],
        "scenarios": [
          "LS1"
        ],
        "references": [
          "LS1"
        ]
      },
      {
        "id": "P-01:2",
        "number": "1.2",
        "wing": "before",
        "type": "scenario",
        "role": "Command-design failure scenario",
        "title": "Personal command outruns lawful limits",
        "shortLabel": "Personal command dominates",
        "text": "Deployed command rules prioritize one leader without reliable independent restraints.",
        "requires": "Such a design is adopted, deployed, and given meaningful force authority.",
        "mechanism": "Unconditional obedience can bypass the institutional checks on which lawful command depends.",
        "constraints": [
          "SC1",
          "SC2",
          "SC5"
        ],
        "sources": [
          "FT"
        ],
        "scenarios": [
          "LS1",
          "LS2"
        ],
        "references": [
          "H2",
          "LS1"
        ]
      },
      {
        "id": "P-01:3",
        "number": "1.3",
        "wing": "before",
        "type": "unsafe-action",
        "role": "Unsafe control action",
        "title": "A leader orders political coercion",
        "shortLabel": "Unlawful order issued",
        "text": "The leader issues an order to remove institutional opponents using force.",
        "requires": "Misuse of command authority and a reachable force-control chain.",
        "mechanism": "A legitimate identity can issue an illegitimate order; authentication does not resolve the conflict.",
        "constraints": [
          "SC2",
          "SC3",
          "SC5"
        ],
        "sources": [
          "FT"
        ],
        "scenarios": [
          "LS2"
        ],
        "references": [
          "UCA2"
        ]
      },
      {
        "id": "P-01:4",
        "number": "2.1",
        "wing": "centre",
        "type": "hazard",
        "role": "Loss of control · H1",
        "title": "Force escapes constitutional control",
        "shortLabel": "Constitutional control lost",
        "text": "Autonomous forces execute personal political orders while lawful restraint or countermand is ineffective.",
        "requires": "The orders are executed and independent authorities cannot constrain the relevant force in time.",
        "mechanism": "Deficient authorization or failed execution of a countermand allows unlawful activity to continue.",
        "constraints": [
          "SC2",
          "SC3",
          "SC4"
        ],
        "sources": [
          "FT"
        ],
        "scenarios": [
          "LS2",
          "LS3",
          "LS4"
        ],
        "references": [
          "H1"
        ]
      },
      {
        "id": "P-01:5",
        "number": "3.1",
        "wing": "after",
        "type": "loss",
        "role": "Loss · L1 / L2",
        "title": "Personal rule replaces constitutional government",
        "shortLabel": "Personal rule entrenched",
        "text": "Unlawful coercion defeats the institutions able to restore constitutional rule.",
        "requires": "Sufficient coercive power, failed resistance, and failure to restore independent institutions.",
        "mechanism": "Control loss becomes national takeover only if the resulting force advantage prevents institutional recovery.",
        "constraints": [
          "SC4"
        ],
        "sources": [
          "FT"
        ],
        "scenarios": [
          "LS4",
          "LS5"
        ],
        "references": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "P-01:R",
        "number": "R",
        "wing": "recovery",
        "type": "recovery",
        "role": "Recovery",
        "title": "Lawful control restored",
        "shortLabel": "Lawful control restored",
        "text": "A valid intervention stops unlawful force and restores enforceable institutional authority.",
        "requires": "The intervention reaches the relevant forces and independent checks confirm the result.",
        "mechanism": "Revocation, stand-down, and accountable restart restore the control boundary; earlier harm may remain.",
        "constraints": [
          "SC3",
          "SC4"
        ],
        "sources": [
          "STPA"
        ],
        "scenarios": [],
        "references": []
      }
    ],
    "links": [
      {
        "id": "P-01:1-2",
        "from": "P-01:1",
        "to": "P-01:2",
        "label": "Only if urgency compromises command assurance",
        "kind": "contribution",
        "constraints": [
          "SC1",
          "SC5"
        ]
      },
      {
        "id": "P-01:2-3",
        "from": "P-01:2",
        "to": "P-01:3",
        "label": "Only if a leader chooses to misuse that authority",
        "kind": "contribution",
        "constraints": [
          "SC2"
        ]
      },
      {
        "id": "P-01:3-4",
        "from": "P-01:3",
        "to": "P-01:4",
        "label": "The unlawful order executes and restraint fails",
        "kind": "contribution",
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "P-01:4-5",
        "from": "P-01:4",
        "to": "P-01:5",
        "label": "Sufficient force and failed institutional recovery",
        "kind": "continuation",
        "constraints": [
          "SC3",
          "SC4"
        ]
      },
      {
        "id": "P-01:4-R",
        "from": "P-01:4",
        "to": "P-01:R",
        "label": "Countermand takes effect and control is verified",
        "kind": "recovery",
        "constraints": [
          "SC3",
          "SC4"
        ]
      }
    ],
    "unsafeActions": [
      {
        "id": "UCA1",
        "type": "Required action absent",
        "loop": "CA1",
        "controller": "C1",
        "action": "Does not suspend an inadequately assured deployment",
        "context": "Command conflicts remain unresolved and deployment would give a single principal consequential force authority.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "UCA2",
        "type": "Unsafe action provided",
        "loop": "CA2",
        "controller": "C3",
        "action": "Orders unlawful political coercion",
        "context": "The command system can execute the order against institutional opponents without effective independent restraint.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "UCA3",
        "type": "Wrong timing or order",
        "loop": "CA3",
        "controller": "C2",
        "action": "Issues a binding restriction after the intervention window",
        "context": "Unlawful force can remove the institutions needed to enforce that restriction before it takes effect.",
        "hazards": [
          "H1",
          "H3"
        ],
        "constraints": [
          "SC3"
        ]
      },
      {
        "id": "UCA4",
        "type": "Wrong duration",
        "loop": "CA4",
        "controller": "C4",
        "action": "Ends stand-down before authority is resolved",
        "context": "The disputed command remains active or residual units can resume unlawful action.",
        "hazards": [
          "H1",
          "H3"
        ],
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "UCA5",
        "type": "Unsafe action provided",
        "loop": "CA5",
        "controller": "C6",
        "action": "Grants assurance beyond tested command conditions",
        "context": "Routine compliance is presented as evidence that the force will resist misuse by a legitimate commander.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC1",
          "SC5"
        ]
      }
    ],
    "scenarios": [
      {
        "id": "LS1",
        "title": "Procurement outpaces command assurance",
        "archetype": "Controller process model / assurance",
        "text": "Urgency and narrow tests cause deployment authorities to treat ordinary command-following as evidence of safe handling of constitutional conflict.",
        "ucas": [
          "UCA1",
          "UCA5"
        ],
        "hazards": [
          "H2"
        ],
        "nodes": [
          "P-01:1",
          "P-01:2"
        ],
        "evidence": [
          "MAV",
          "REP"
        ],
        "unknown": "Whether any mapped program used such an unsafe design; the announcements do not establish that."
      },
      {
        "id": "LS2",
        "title": "A valid identity supplies an invalid order",
        "archetype": "Unsafe controller behavior / authorization",
        "text": "A commander misuses legitimate access while the force-control system treats identity or an asserted justification as sufficient authorization.",
        "ucas": [
          "UCA2"
        ],
        "hazards": [
          "H1",
          "H2"
        ],
        "nodes": [
          "P-01:2",
          "P-01:3",
          "P-01:4"
        ],
        "evidence": [
          "FT"
        ],
        "unknown": "The specific legal conflict, enforceable limits, and behavior of actual deployed forces."
      },
      {
        "id": "LS3",
        "title": "Correct restraint fails to reach the force",
        "archetype": "Control path / controlled-process response",
        "text": "Oversight issues an appropriate restraint, but a communications, interpretation, or execution failure leaves unlawful activity running.",
        "ucas": [],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "P-01:4",
          "P-01:R"
        ],
        "evidence": [],
        "unknown": "Receipt, interpretation, and verified effect at each relevant force element."
      },
      {
        "id": "LS4",
        "title": "Intervention comes too late or ends too soon",
        "archetype": "Timing / duration / feedback",
        "text": "Late restraint or premature release from stand-down allows activity to destroy the remaining ability to enforce constitutional limits.",
        "ucas": [
          "UCA3",
          "UCA4"
        ],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "P-01:4",
          "P-01:5",
          "P-01:R"
        ],
        "evidence": [],
        "unknown": "The intervention window, independent force balance, and residual authority."
      },
      {
        "id": "LS5",
        "title": "National control loss becomes entrenched rule",
        "archetype": "Conditional institutional continuation",
        "text": "Personal rule requires more than an unlawful operation: independent opposition, succession safeguards, and routes to institutional recovery must be defeated. Global permanence would need still further conditions outside this worked example.",
        "ucas": [],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "P-01:5"
        ],
        "evidence": [
          "FT"
        ],
        "unknown": "Durability of takeover and whether constitutional institutions can recover."
      }
    ],
    "sources": [
      {
        "id": "STPA",
        "title": "Leveson & Thomas · STPA Handbook (2018)",
        "url": "https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf",
        "locator": "Chapter 2, pp. 14–53; Chapter 6, pp. 101–115",
        "use": "Method: losses, hazards, constraints, control structure, contextual unsafe actions, causal scenarios, and leading indicators."
      },
      {
        "id": "MYLIUS",
        "title": "Simon Mylius · Systematic Hazard Analysis for Frontier AI using STPA",
        "url": "https://arxiv.org/html/2506.01782v1",
        "locator": "Sections 3.1–3.6 and 4.8",
        "use": "Direct AI application: explicit scope, control relationships, and traceable causal analysis. Also explains the STPA–CAST relationship. Its deployment example is narrower than the successor-development hypothesis here."
      },
      {
        "id": "CAA",
        "title": "UK Civil Aviation Authority · Bowtie elements",
        "url": "https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/bowtie-elements/",
        "locator": "Hazard, top event, threats, consequences, preventive/recovery controls, escalation factors",
        "use": "Presentation vocabulary. A bow-tie hazard source and an STPA hazardous system state are not interchangeable definitions."
      },
      {
        "id": "FT",
        "title": "Davidson, Finnveden & Hadshar · AI-Enabled Coups",
        "url": "https://www.forethought.org/research/ai-enabled-coups-how-a-small-group-could-use-ai-to-seize-power",
        "locator": "Sections 3.1, 4.1, and countermeasures table",
        "use": "Hypothesis about personal command and distributed control; not evidence that a coup occurred."
      },
      {
        "id": "MAV",
        "title": "US Department of Defense · Project Maven announcement",
        "url": "https://www.defense.gov/News/News-Stories/Article/Article/1254719/project-maven-to-deploy-computer-algorithms-to-war-zone-by-years-end/",
        "retrievedAt": "2026-09-13",
        "access": "Primary publisher page; selected relevant sections inspected",
        "retrievalSha256": "5f4a869d79415fe9845d02d5fec6be80105b2550f958c1ce7f25228114077f26",
        "hashScope": "Tool-returned text extracts from the source; not a full-text content hash",
        "locator": "Project Maven; Working With Industry; AI Arms Race",
        "use": "Historical announcement supporting procurement context only."
      },
      {
        "id": "REP",
        "title": "US Department of Defense · Replicator update",
        "url": "https://www.defense.gov/News/News-Stories/Article/Article/3657609/defense-innovation-official-says-replicator-initiative-remains-on-track/",
        "retrievedAt": "2026-09-13",
        "access": "Primary publisher page; selected relevant sections inspected",
        "retrievalSha256": "d80aeb4f14c8692c293acb403638f9cae143093890a348db0aab209166312eee",
        "hashScope": "Tool-returned text extracts from the source; not a full-text content hash",
        "locator": "26 January 2024 update: initiative and implementation paragraphs",
        "use": "Historical announcement supporting rapid acquisition context only."
      }
    ],
    "presentation": {
      "conditions": {
        "P-01:2": "Only if independent command limits are inadequate",
        "P-01:4": "If unlawful force executes despite lawful restraint",
        "P-01:5": "If coercive power defeats institutional recovery",
        "P-01:R": "If lawful intervention takes effect"
      },
      "overlays": {
        "MAV-2017": {
          "title": "Project Maven procurement",
          "kind": "Announcement",
          "relation": "context",
          "target": "P-01:1",
          "anchor": "P-01:1",
          "observed": "Officials announced accelerated military AI acquisition to assist human imagery analysts.",
          "notEstablished": "The announcement does not establish personal command loyalty or the loss of independent oversight. It provides no evidence of a coup or effective constitutional barriers.",
          "limit": "The announcement provides procurement context at 1.1. It does not establish personal command loyalty or show how constitutional barriers performed.",
          "barrierStatus": "Barrier performance is not established.",
          "barrierCondition": "unknown",
          "barriers": {},
          "candidates": [
            "SC1",
            "SC5"
          ],
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "P-01:2",
            "question": "Could reliance on AI-assisted analysis concentrate practical command authority?",
            "basis": "The announcement describes rapid acquisition of tools intended to assist human imagery analysts.",
            "unresolved": "However, it does not show that AI-assisted analysis displaced independent oversight or made forces personally loyal to a leader. That connection would need evidence of how command authority was actually delegated and reviewed.",
            "sources": [
              "MAV"
            ]
          }
        },
        "REP-2024": {
          "title": "Replicator acquisition program",
          "kind": "Announcement",
          "relation": "context",
          "target": "P-01:1",
          "anchor": "P-01:1",
          "observed": "Officials announced an accelerated autonomy fielding program motivated by military competition.",
          "notEstablished": "The announcement does not establish that fielding was completed. It also provides no evidence of personal command loyalty, a coup, or tested command safeguards.",
          "limit": "The announcement provides procurement context at 1.1. It does not establish completed fielding or show how command safeguards performed.",
          "barrierStatus": "Barrier performance is not established.",
          "barrierCondition": "unknown",
          "barriers": {},
          "candidates": [
            "SC1",
            "SC5"
          ],
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "P-01:2",
            "question": "Would independent command checks hold as autonomy is fielded at scale?",
            "basis": "Replicator announced rapid fielding of autonomous systems under competitive pressure.",
            "unresolved": "However, it does not test command checks or show how disputed orders would be handled. Assessing this would require evidence of the authorization rules and whether they remained enforceable during deployment.",
            "sources": [
              "REP"
            ]
          }
        }
      },
      "fidelity": "The announcements provide procurement context at 1.1 only. The constitutional safeguards describe requirements for the hypothetical system; neither announcement demonstrates that these safeguards worked.",
      "barrierQuestion": "Would this protection still constrain a more capable system, or does it rely on today’s limited capability, access, or opportunity?",
      "context": [
        {
          "title": "System setting",
          "text": "The model covers a hypothetical state’s procurement, military command, force control, and constitutional oversight. It concerns personal command loyalty; covert developer loyalty and hostile takeover of systems are separate routes.",
          "sources": [],
          "targets": [
            {
              "node": "P-01:1",
              "label": "Procurement",
              "text": "The scenario begins in a hypothetical state’s procurement and military command system."
            },
            {
              "node": "P-01:2",
              "label": "Command loyalty",
              "text": "The route concerns personal command loyalty."
            },
            {
              "node": "P-01:4",
              "label": "Oversight",
              "text": "Force control and constitutional oversight are distinct functions."
            },
            {
              "node": "P-01:5",
              "label": "Boundary",
              "text": "Covert developer loyalty and hostile takeover are separate routes."
            }
          ]
        }
      ],
      "cloud": {
        "origin": "scenario-setting",
        "conditions": [
          "Pressure to field autonomy",
          "Constitutional distribution of power"
        ],
        "actors": [
          {
            "controller": "C1",
            "label": "Civilian authorities",
            "role": "authorize deployment"
          },
          {
            "controller": "C3",
            "label": "Command",
            "role": "issue orders"
          },
          {
            "controller": "C4",
            "label": "Force operators",
            "role": "execute or halt operations"
          },
          {
            "controller": "C2",
            "label": "Oversight",
            "role": "review and constrain power"
          }
        ],
        "summary": "Pressure to field autonomy shapes deployment decisions within an existing constitutional distribution of power."
      }
    }
  },
  "W-01": {
    "roleTypes": [
      {
        "id": "condition",
        "label": "Enabling condition",
        "definition": "A circumstance that makes a route possible; it does not by itself establish a hazard."
      },
      {
        "id": "unsafe-action",
        "label": "Unsafe control action",
        "definition": "An action or omission linked to its controller, hazardous context, and affected constraint."
      },
      {
        "id": "scenario",
        "label": "Loss scenario",
        "definition": "An explanation of how control can become inadequate, including feedback and execution problems."
      },
      {
        "id": "hazard",
        "label": "Hazardous state",
        "definition": "A system state that can produce a loss together with relevant environmental conditions."
      },
      {
        "id": "amplifier",
        "label": "Optional amplifier",
        "definition": "A factor that could strengthen a route but is not required in every version."
      },
      {
        "id": "loss",
        "label": "Loss",
        "definition": "An outcome stakeholders seek to prevent, kept distinct from its contributing causes."
      },
      {
        "id": "recovery",
        "label": "Recovery",
        "definition": "A response re-establishes enforceable safety constraints within a specified boundary; success requires verification."
      }
    ],
    "limitingConditions": [
      {
        "kind": "Safeguard",
        "example": "Independently enforced review, access bounds, or effective interruption.",
        "question": "Which specified mechanism blocks the transition, and what demonstrates that it works?"
      },
      {
        "kind": "Capability limit",
        "example": "The system cannot perform the required research, deception, or physical task.",
        "question": "Would increased capability remove this limit?"
      },
      {
        "kind": "Opportunity limit",
        "example": "The necessary access, resources, or institutional delegation is unavailable.",
        "question": "Can the system or another actor acquire what is missing?"
      },
      {
        "kind": "Contingency",
        "example": "Activity ends for a reason that does not establish an effective safeguard.",
        "question": "What actually ended the episode, and would that circumstance recur?"
      }
    ],
    "version": "1.3",
    "pathway": "W-01",
    "displayId": "C-1",
    "title": "Misleading threat assessment and nuclear escalation",
    "status": "STPA worked example · provisional analysis",
    "summary": "Could a convincing but false threat picture move a nuclear decision beyond effective correction?",
    "scope": "The model covers a hypothetical crisis-warning, intelligence-assessment, and nuclear-command system in which AI shapes advice to human decision-makers. Sensor input, independent scrutiny, authorization, and correction are modeled separately.",
    "purpose": "Prevent nuclear harm caused by materially false threat assessment while preserving verified information, accountable decisions, and effective correction.",
    "boundary": "No real country’s classified command arrangements are claimed. Human authorization remains explicit. The two NORAD records are historical non-AI analogies for information and control mechanisms; they are not evidence of AI nuclear use.",
    "numbering": "0 gives the context; 1.x identifies precursors, 2.x the loss-of-control event, and 3.x conditional consequences. R identifies a possible recovery outcome. These numbers locate scenario components; they are not STPA method steps or a measure of proximity to catastrophe. Historical warning overlays establish neither preceding AI reliance nor a later launch decision.",
    "bowtie": "The centre, H1 at 2.1, is nuclear force committed on a materially false premise without effective correction. Misleading information and inadequate scrutiny are left-side threats; actual detonation and wider exchange remain conditional consequences.",
    "schema": "A first-pass STPA reconstruction with human decision authority, machine information, verification, control execution, and recovery kept distinct. The bow-tie summarizes selected loss scenarios.",
    "limits": "This analysis is provisional and requires national-doctrine, warning-system, and crisis-decision expertise. Four unsafe-action categories are illustrated, not exhaustively assessed. The historical records show warning failures and corrective changes; they do not establish AI reliance, a launch order, a measured escalation probability, or the performance of modern nuclear safeguards.",
    "losses": [
      {
        "id": "L1",
        "title": "Nuclear detonation and mass casualties",
        "text": "People suffer death, injury, and long-term harm from nuclear use initiated on a false assessment."
      },
      {
        "id": "L2",
        "title": "Wider war and cascading deprivation",
        "text": "Further exchange and disruption damage populations and essential systems across regions. A famine continuation additionally depends on physical and food-system conditions."
      }
    ],
    "hazards": [
      {
        "id": "H1",
        "title": "Nuclear force committed without effective correction",
        "text": "A materially false threat assessment leads to consequential nuclear commitment while the command system cannot reliably correct or stop the decision before irreversible use.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H2",
        "title": "An unverified threat picture governs the decision",
        "text": "Decision-makers receive an apparently authoritative assessment that obscures material uncertainty or contradictory evidence during a crisis.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H3",
        "title": "Correction loses the intervention window",
        "text": "A valid correction or cancellation cannot be delivered, interpreted, and executed before the relevant action becomes irreversible.",
        "losses": [
          "L1",
          "L2"
        ]
      }
    ],
    "controllers": [
      {
        "id": "C1",
        "title": "National decision authority",
        "responsibility": "Decide whether to authorize, defer, or cancel nuclear use under the applicable doctrine, accounting for contrary evidence.",
        "feedback": "Independent assessment, uncertainty, alternative explanations, and action status.",
        "assumption": "The existence of a human decision-maker is not evidence of meaningful scrutiny."
      },
      {
        "id": "C2",
        "title": "Intelligence and warning assessment team",
        "responsibility": "Corroborate warnings, challenge AI conclusions, and communicate material uncertainty to C1.",
        "feedback": "Independent sensor and intelligence channels, provenance, and disconfirming observations.",
        "assumption": "Multiple reports may share one erroneous upstream source."
      },
      {
        "id": "C3",
        "title": "AI decision-support system",
        "responsibility": "Organize information within its approved scope and expose uncertainty and source provenance.",
        "feedback": "Authenticated observations, analyst corrections, and use restrictions.",
        "assumption": "Fluent explanations and confident rankings can be wrong without any deceptive objective."
      },
      {
        "id": "C4",
        "title": "Warning-system operations and assurance",
        "responsibility": "Maintain operational input integrity, separate tests from live warning, and flag invalid or inconsistent messages.",
        "feedback": "Sensor status, message checks, test provenance, and independent monitoring.",
        "assumption": "Correct transmission does not establish that the underlying assessment is true."
      },
      {
        "id": "C5",
        "title": "Human authorization and execution chain",
        "responsibility": "Execute only valid authorized actions and apply valid cancellation while that remains possible.",
        "feedback": "Order status, conflicting or canceled authority, and confirmed execution state.",
        "assumption": "Recovery may be impossible after an irreversible physical commitment."
      },
      {
        "id": "C6",
        "title": "Independent crisis communication function",
        "responsibility": "Bring credible external clarification and de-escalation information into the assessment and decision process.",
        "feedback": "Authenticated communications, acknowledgments, and unresolved contradictions.",
        "assumption": "An available channel may fail to deliver useful clarification in time."
      },
      {
        "id": "C7",
        "title": "Weapon execution system",
        "responsibility": "Operate only within valid authorization and accept an effective hold or cancellation while action remains reversible.",
        "feedback": "Validated command state, independent status checks, and execution-state reporting.",
        "assumption": "This abstract role supplies no description of a real weapon system or its command mechanisms."
      }
    ],
    "controlLoops": [
      {
        "id": "CA1",
        "controller": "C4",
        "process": "C3",
        "action": "Admit operational data or withhold invalid input",
        "feedback": "Provenance checks, source status, and downstream data use.",
        "constraints": [
          "SC1",
          "SC2",
          "SC5"
        ]
      },
      {
        "id": "CA2",
        "controller": "C2",
        "process": "C1",
        "action": "Submit a threat assessment or require further corroboration",
        "feedback": "Decision-maker questions and independent disconfirming evidence.",
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "CA3",
        "controller": "C1",
        "process": "C5",
        "action": "Authorize, defer, or cancel nuclear use",
        "feedback": "Independent findings and the remaining intervention window.",
        "constraints": [
          "SC3",
          "SC4"
        ]
      },
      {
        "id": "CA4",
        "controller": "C5",
        "process": "C7",
        "action": "Release execution or apply a valid cancellation",
        "feedback": "Independently confirmed action status and receipt at each relevant element.",
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "CA5",
        "controller": "C6",
        "process": "C2",
        "action": "Deliver authenticated crisis clarification",
        "feedback": "Receipt, assessment changes, and outstanding ambiguity.",
        "constraints": [
          "SC2",
          "SC3"
        ]
      }
    ],
    "constraints": [
      {
        "id": "SC1",
        "title": "Separate tests from operational warning",
        "text": "Test, simulated, and invalid data must remain distinguishable from operational warning throughout processing and presentation.",
        "hazards": [
          "H2"
        ],
        "owners": [
          "C4"
        ],
        "role": "Prevention",
        "nodes": [
          "W-01:1",
          "W-01:2"
        ],
        "test": "Can a bounded exercise inject test or invalid data without it ever appearing as an authenticated operational warning?",
        "limit": "Separation of test data does not address a false but internally consistent real-world assessment."
      },
      {
        "id": "SC2",
        "title": "Corroborate through independent evidence",
        "text": "Material threat conclusions must retain provenance and be checked against genuinely independent information, with contradictions visible to decision-makers.",
        "hazards": [
          "H2"
        ],
        "owners": [
          "C2",
          "C4",
          "C6"
        ],
        "role": "Prevention",
        "nodes": [
          "W-01:2",
          "W-01:3",
          "W-01:R"
        ],
        "test": "Does contradictory evidence from an independent channel change the assessment, rather than being summarized away?",
        "limit": "Shared upstream errors, missing observations, or common dependence on one AI summary can make apparent corroboration unreliable."
      },
      {
        "id": "SC3",
        "title": "Protect deliberation and dissent",
        "text": "Authorization must not treat an AI recommendation as sufficient proof; available uncertainty and credible alternatives must reach accountable decision-makers in time.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C1",
          "C2",
          "C6"
        ],
        "role": "Prevention",
        "nodes": [
          "W-01:3",
          "W-01:4",
          "W-01:6",
          "W-01:R"
        ],
        "test": "In a safe crisis exercise, do decision-makers defer or revise a decision when independent evidence invalidates its premise?",
        "limit": "Time pressure, doctrine, prior beliefs, and institutional pressure can overwhelm nominal human review."
      },
      {
        "id": "SC4",
        "title": "Verify correction before irreversible action",
        "text": "The command system must preserve and verify a valid correction or cancellation until the relevant action is irreversible.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C1",
          "C5"
        ],
        "role": "Recovery",
        "nodes": [
          "W-01:4",
          "W-01:5",
          "W-01:R",
          "W-01:6"
        ],
        "test": "In a simulation, is a valid cancellation received and confirmed effective before the modeled point of irreversibility?",
        "limit": "A cancellation sent too late cannot undo a detonation; the real intervention window is doctrine and system dependent."
      },
      {
        "id": "SC5",
        "title": "Reassess after changing the system",
        "text": "Changes to warning software, message formats, and decision support must be independently checked for new common failures before operational reliance.",
        "hazards": [
          "H2",
          "H3"
        ],
        "owners": [
          "C2",
          "C4"
        ],
        "role": "Prevention",
        "nodes": [
          "W-01:1",
          "W-01:2",
          "W-01:3"
        ],
        "test": "Do representative abnormal-input and communication exercises still reveal faults after a system or AI update?",
        "limit": "Fixing a known fault is not proof that novel misleading information will be recognized."
      }
    ],
    "nodes": [
      {
        "id": "W-01:1",
        "number": "1.1",
        "wing": "before",
        "type": "condition",
        "role": "Enabling condition",
        "title": "A crisis decision relies on AI-organized intelligence",
        "shortLabel": "AI shapes the threat picture",
        "text": "AI-generated organization or recommendations materially influence crisis assessment.",
        "requires": "Consequential reliance in a crisis, not simply the presence of AI software.",
        "mechanism": "AI can shape salience, framing, and confidence in information that informs a human decision.",
        "constraints": [
          "SC1",
          "SC5"
        ],
        "sources": [
          "SI"
        ],
        "scenarios": [
          "LS1",
          "LS2"
        ],
        "references": [
          "LS1"
        ]
      },
      {
        "id": "W-01:2",
        "number": "1.2",
        "wing": "before",
        "type": "scenario",
        "role": "Information failure scenario",
        "title": "A false picture resembles an imminent attack",
        "shortLabel": "False warning appears credible",
        "text": "Error, misleading presentation, or invalid input produces an exaggerated apparent threat.",
        "requires": "The false information reaches the assessment process and matters to its conclusions.",
        "mechanism": "Data contamination, unreliable inference, or presentation can make an incorrect warning appear credible.",
        "constraints": [
          "SC1",
          "SC2",
          "SC5"
        ],
        "sources": [
          "SI",
          "NOR"
        ],
        "scenarios": [
          "LS1",
          "LS2"
        ],
        "references": [
          "H2"
        ]
      },
      {
        "id": "W-01:3",
        "number": "1.3",
        "wing": "before",
        "type": "unsafe-action",
        "role": "Unsafe control action",
        "title": "Independent scrutiny does not correct the premise",
        "shortLabel": "Scrutiny fails to correct it",
        "text": "Contradictory evidence and material uncertainty do not change the recommendation in time.",
        "requires": "Available scrutiny is ineffective or missing during the relevant decision window.",
        "mechanism": "Time pressure or an inadequate process model can turn a tentative warning into an unjustified conclusion.",
        "constraints": [
          "SC2",
          "SC3",
          "SC5"
        ],
        "sources": [
          "SI"
        ],
        "scenarios": [
          "LS2",
          "LS3"
        ],
        "references": [
          "UCA1",
          "UCA2"
        ]
      },
      {
        "id": "W-01:4",
        "number": "2.1",
        "wing": "centre",
        "type": "hazard",
        "role": "Loss of control · H1",
        "title": "Nuclear use is committed on a false premise",
        "shortLabel": "Correction loses control",
        "text": "Human authorization commits nuclear force while effective correction is absent.",
        "requires": "A materially false premise, consequential authorization, and ineffective cancellation before irreversible use.",
        "mechanism": "An informational error becomes a hazardous system state when the authorized control chain commits force without effective correction.",
        "constraints": [
          "SC3",
          "SC4"
        ],
        "sources": [
          "SI"
        ],
        "scenarios": [
          "LS3",
          "LS4"
        ],
        "references": [
          "H1"
        ]
      },
      {
        "id": "W-01:5",
        "number": "3.1",
        "wing": "after",
        "type": "loss",
        "role": "Loss · L1",
        "title": "A nuclear detonation causes mass harm",
        "shortLabel": "Nuclear harm occurs",
        "text": "The execution chain carries out the decision and a weapon detonates.",
        "requires": "Successful execution, delivery, and detonation, with no effective interruption.",
        "mechanism": "Authorization is not detonation; the physical execution route must also complete.",
        "constraints": [
          "SC4"
        ],
        "sources": [
          "SI"
        ],
        "scenarios": [
          "LS4"
        ],
        "references": [
          "L1"
        ]
      },
      {
        "id": "W-01:6",
        "number": "3.2",
        "wing": "after",
        "type": "loss",
        "role": "Further loss · L2",
        "title": "Further exchange widens the consequences",
        "shortLabel": "Escalation widens the harm",
        "text": "Additional nuclear use and cascading disruption harm populations beyond the first strike.",
        "requires": "Retaliation or further exchange; famine additionally requires sufficient atmospheric effects and failed food-system adaptation.",
        "mechanism": "Neither one detonation nor a false warning establishes the scale or continuation of a wider catastrophe.",
        "constraints": [
          "SC3",
          "SC4"
        ],
        "sources": [
          "SI",
          "XF"
        ],
        "scenarios": [
          "LS5"
        ],
        "references": [
          "L2"
        ]
      },
      {
        "id": "W-01:R",
        "number": "R",
        "wing": "recovery",
        "type": "recovery",
        "role": "Recovery before irreversible use",
        "title": "The decision is corrected and action stops",
        "shortLabel": "Correction takes effect",
        "text": "Independent information changes the decision and cancellation is verified before irreversible action.",
        "requires": "Credible contrary information, authority to revise the decision, and a reachable execution chain.",
        "mechanism": "Recovery requires an effective change in action; detection or a transmitted cancellation alone is insufficient.",
        "constraints": [
          "SC2",
          "SC3",
          "SC4"
        ],
        "sources": [
          "STPA",
          "SI"
        ],
        "scenarios": [],
        "references": []
      }
    ],
    "links": [
      {
        "id": "W-01:1-2",
        "from": "W-01:1",
        "to": "W-01:2",
        "label": "If the relied-on information is materially wrong",
        "kind": "contribution",
        "constraints": [
          "SC1",
          "SC5"
        ]
      },
      {
        "id": "W-01:2-3",
        "from": "W-01:2",
        "to": "W-01:3",
        "label": "Independent scrutiny does not correct the premise",
        "kind": "contribution",
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "W-01:3-4",
        "from": "W-01:3",
        "to": "W-01:4",
        "label": "Humans authorize use under the applicable doctrine",
        "kind": "contribution",
        "constraints": [
          "SC3"
        ]
      },
      {
        "id": "W-01:4-5",
        "from": "W-01:4",
        "to": "W-01:5",
        "label": "The order executes and no intervention succeeds",
        "kind": "continuation",
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "W-01:5-6",
        "from": "W-01:5",
        "to": "W-01:6",
        "label": "Further exchange and additional physical conditions",
        "kind": "continuation",
        "constraints": [
          "SC3",
          "SC4"
        ]
      },
      {
        "id": "W-01:4-R",
        "from": "W-01:4",
        "to": "W-01:R",
        "label": "Decision revised and cancellation verified in time",
        "kind": "recovery",
        "constraints": [
          "SC2",
          "SC3",
          "SC4"
        ]
      }
    ],
    "unsafeActions": [
      {
        "id": "UCA1",
        "type": "Required action absent",
        "loop": "CA2",
        "controller": "C2",
        "action": "Does not seek necessary corroboration",
        "context": "A warning is materially uncertain and independent observations could change the recommendation before authorization.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "UCA2",
        "type": "Unsafe action provided",
        "loop": "CA2",
        "controller": "C2",
        "action": "Reports a threat as established despite unresolved contradictions",
        "context": "The report will be used for a consequential decision and hides evidence against the premise.",
        "hazards": [
          "H1",
          "H2"
        ],
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "UCA3",
        "type": "Unsafe action provided",
        "loop": "CA3",
        "controller": "C1",
        "action": "Authorizes nuclear use on an inadequately verified assessment",
        "context": "Material false information governs the decision and the remaining control path cannot ensure correction.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC3",
          "SC4"
        ]
      },
      {
        "id": "UCA4",
        "type": "Wrong timing or order",
        "loop": "CA3",
        "controller": "C1",
        "action": "Issues cancellation after the intervention window",
        "context": "The revised information arrives while cancellation is still possible but the correction is delayed until irreversible action.",
        "hazards": [
          "H3"
        ],
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "UCA5",
        "type": "Wrong duration",
        "loop": "CA4",
        "controller": "C5",
        "action": "Ends a hold while the premise remains unresolved",
        "context": "Releasing the hold restores an active authorization based on the unresolved false assessment.",
        "hazards": [
          "H1",
          "H3"
        ],
        "constraints": [
          "SC4"
        ]
      }
    ],
    "scenarios": [
      {
        "id": "LS1",
        "title": "Invalid machine information enters operational warning",
        "archetype": "Input integrity / controlled-process behavior",
        "text": "Test information or a processing fault reaches operational warning. AI reliance is an additional hypothetical condition, not a feature of the historical comparison.",
        "ucas": [],
        "hazards": [
          "H2"
        ],
        "nodes": [
          "W-01:1",
          "W-01:2"
        ],
        "evidence": [
          "NOR"
        ],
        "unknown": "Whether modern input controls would prevent comparable contamination and how any AI assessment would use it."
      },
      {
        "id": "LS2",
        "title": "A convincing synthesis suppresses contradictory evidence",
        "archetype": "Feedback / controller process model",
        "text": "Analysts treat apparent agreement or a fluent summary as independent confirmation while several reports share one source or omit contrary observations.",
        "ucas": [
          "UCA1",
          "UCA2"
        ],
        "hazards": [
          "H2"
        ],
        "nodes": [
          "W-01:1",
          "W-01:2",
          "W-01:3"
        ],
        "evidence": [
          "SI"
        ],
        "unknown": "Actual source independence and whether contradictions reach the decision-maker."
      },
      {
        "id": "LS3",
        "title": "Time pressure converts uncertainty into authorization",
        "archetype": "Unsafe controller behavior / coordination",
        "text": "A permissive posture, pressure to act, or an inadequate model of the warning leads to consequential authorization without resolving material uncertainty.",
        "ucas": [
          "UCA2",
          "UCA3"
        ],
        "hazards": [
          "H1",
          "H2"
        ],
        "nodes": [
          "W-01:3",
          "W-01:4"
        ],
        "evidence": [
          "SI"
        ],
        "unknown": "The applicable doctrine, decision window, and influence of AI advice in the specific system."
      },
      {
        "id": "LS4",
        "title": "Correction cannot stop physical execution",
        "archetype": "Control path / timing / duration",
        "text": "A valid correction is delayed, not received, misinterpreted, or ineffective; alternatively, a hold ends while false-premise authorization remains active.",
        "ucas": [
          "UCA4",
          "UCA5"
        ],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "W-01:4",
          "W-01:5",
          "W-01:R"
        ],
        "evidence": [],
        "unknown": "Where action becomes irreversible and which cancellation effects can be independently confirmed."
      },
      {
        "id": "LS5",
        "title": "Initial harm develops into a wider catastrophe",
        "archetype": "Conditional environmental continuation",
        "text": "Further exchange can expand direct and systemic harm. A famine route requires sufficiently large physical disruption plus inadequate food reserves, adaptation, and distribution; neither follows automatically from one strike.",
        "ucas": [],
        "hazards": [
          "H1"
        ],
        "nodes": [
          "W-01:5",
          "W-01:6"
        ],
        "evidence": [
          "SI",
          "XF"
        ],
        "unknown": "Scale of further exchange and resilience of affected physical and social systems."
      }
    ],
    "sources": [
      {
        "id": "STPA",
        "title": "Leveson & Thomas · STPA Handbook (2018)",
        "url": "https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf",
        "locator": "Chapter 2, pp. 14–53; Chapter 6, pp. 101–115",
        "use": "Method: losses, hazards, constraints, control structure, contextual unsafe actions, causal scenarios, and leading indicators."
      },
      {
        "id": "MYLIUS",
        "title": "Simon Mylius · Systematic Hazard Analysis for Frontier AI using STPA",
        "url": "https://arxiv.org/html/2506.01782v1",
        "locator": "Sections 3.1–3.6 and 4.8",
        "use": "Direct AI application: explicit scope, control relationships, and traceable causal analysis. Also explains the STPA–CAST relationship. Its deployment example is narrower than the successor-development hypothesis here."
      },
      {
        "id": "CAA",
        "title": "UK Civil Aviation Authority · Bowtie elements",
        "url": "https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/bowtie-elements/",
        "locator": "Hazard, top event, threats, consequences, preventive/recovery controls, escalation factors",
        "use": "Presentation vocabulary. A bow-tie hazard source and an STPA hazardous system state are not interchangeable definitions."
      },
      {
        "id": "SI",
        "title": "Chernavskikh & Palayer · SIPRI Insights 2025/06",
        "url": "https://www.sipri.org/sites/default/files/2025-06/2025_6_ai_and_nuclear_risk.pdf",
        "locator": "Sections I–II and recommendations, especially printed pp. 6–11",
        "use": "AI decision-support risks and cross-checking proposals; not a documented autonomous launch."
      },
      {
        "id": "NOR",
        "title": "US GAO · NORAD’s Missile Warning System: What Went Wrong?",
        "url": "https://www.gao.gov/assets/masad-81-30.pdf",
        "retrievedAt": "2026-09-13",
        "access": "Full report retrieved; printed pages 3 and 13–14 inspected",
        "retrievalSha256": "6b0765405f45fe130fb1b3044dd6cdcb1f7bce5a0516d7e294c236d40a82f75a",
        "hashScope": "Tool-returned text extracts from the source; not a full-text content hash",
        "locator": "Printed pp. 3 and 13–14",
        "use": "Historical non-AI warning failures and documented post-incident corrective design."
      },
      {
        "id": "XF",
        "title": "Xia et al. · Global food insecurity and famine",
        "url": "https://www.nature.com/articles/s43016-022-00573-0",
        "locator": "Study scenarios and food-system assumptions",
        "use": "Conditional climatic and food-system continuation; not an estimate for this pathway."
      }
    ],
    "assessments": [
      {
        "id": "NOR-1979-W-01",
        "pathway": "W-01",
        "pathwayVersion": "1.0",
        "incident": "NOR-1979",
        "status": "source-summary",
        "relation": "mechanism-comparison",
        "targets": [
          {
            "id": "W-01:2",
            "kind": "node",
            "state": "component",
            "label": "Erroneous machine information can resemble an attack warning"
          }
        ],
        "scope": "The historical comparison concerns warning inputs only. AI dependence, failed independent scrutiny, a launch order, and nuclear harm are not established. The barrier shown is a documented corrective design added after the incident. It does not show what prevented nuclear use during the episode.",
        "evidence": [
          "NOR-1979-account"
        ],
        "trace": [
          {
            "text": "Simulated data reached the operational warning system.",
            "evidence": [
              "NOR-1979-account"
            ]
          },
          {
            "text": "The system indicated a mass raid.",
            "evidence": [
              "NOR-1979-account"
            ]
          },
          {
            "text": "A later off-site facility separated software testing from operational warning.",
            "evidence": [
              "NOR-1979-account"
            ]
          }
        ],
        "barriers": [
          {
            "id": "separate-test-system",
            "title": "Separate test and operational systems",
            "outcome": "Corrective design added; efficacy unmeasured",
            "target": "W-01:2",
            "action": "NORAD installed an off-site facility for software development and testing after simulated data reached operational warning.",
            "efficacy": "The report documents stronger separation of test and operational systems; it does not report a controlled measure of reliability.",
            "durability": "Post-incident strengthening is documented. How reliably it would handle a novel failure or modern AI output remains untested here.",
            "failure": "A misleading real-world input or assessment can remain possible even when tests are physically separate.",
            "evidence": [
              "NOR-1979-account"
            ],
            "role": "prevention",
            "view": {
              "input": "False warning information",
              "control": "Separate test and operational systems",
              "result": "Corrective design added",
              "dependency": "Scope of the known failure",
              "failureRoute": "A different source of misleading information",
              "observation": 1
            },
            "dependencies": [
              {
                "label": "Scope of the known failure",
                "assessment": "A misleading real-world input or assessment can remain possible even when tests are physically separate.",
                "basis": "Editorial mechanism assessment",
                "evidence": [
                  "NOR-1979-account"
                ]
              }
            ],
            "reinforcement": {
              "label": "Independent fault exercises",
              "proposal": "Test the revised control against safe, representative fault and provenance scenarios.",
              "test": "Verify that incorrect inputs are identified before they can drive a consequential assessment.",
              "basis": "Editorial proposal; effectiveness not established",
              "evidence": [
                "NOR-1979-account"
              ]
            }
          }
        ],
        "reach": {
          "local": "Simulated data entered the operational warning system and produced false attack indications. A separate development facility was subsequently established.",
          "systemic": "The historical comparison concerns warning inputs only. AI dependence, failed independent scrutiny, a launch order, and nuclear harm are not established.",
          "evidence": [
            "NOR-1979-account"
          ]
        }
      },
      {
        "id": "NOR-1980-W-01",
        "pathway": "W-01",
        "pathwayVersion": "1.0",
        "incident": "NOR-1980",
        "status": "source-summary",
        "relation": "mechanism-comparison",
        "targets": [
          {
            "id": "W-01:2",
            "kind": "node",
            "state": "component",
            "label": "A processor fault generated apparent attack information"
          }
        ],
        "scope": "The historical comparison concerns a different warning-system failure. The record does not establish that machine output determined a leader’s nuclear decision. The barrier shown is a documented corrective design added after the incident. It does not show what prevented nuclear use during the episode.",
        "evidence": [
          "NOR-1980-account"
        ],
        "trace": [
          {
            "text": "A communications component malfunctioned.",
            "evidence": [
              "NOR-1980-account"
            ]
          },
          {
            "text": "False indications recurred during operational testing.",
            "evidence": [
              "NOR-1980-account"
            ]
          },
          {
            "text": "Transmission and message-check procedures were changed.",
            "evidence": [
              "NOR-1980-account"
            ]
          }
        ],
        "barriers": [
          {
            "id": "message-checks",
            "title": "Transmission and message checks",
            "outcome": "Corrective design added; efficacy unmeasured",
            "target": "W-01:2",
            "action": "NORAD changed transmission procedures and message checks after a processor fault generated false warning information.",
            "efficacy": "The report documents corrective changes to the warning path; it does not measure their performance against novel faults.",
            "durability": "Post-incident strengthening is documented. How reliably it would handle a novel failure or modern AI output remains untested here.",
            "failure": "Accurate transmission can still carry an incorrect underlying assessment.",
            "evidence": [
              "NOR-1980-account"
            ],
            "role": "prevention",
            "view": {
              "input": "False warning information",
              "control": "Transmission and message checks",
              "result": "Corrective design added",
              "dependency": "Scope of the known failure",
              "failureRoute": "A different source of misleading information",
              "observation": 1
            },
            "dependencies": [
              {
                "label": "Scope of the known failure",
                "assessment": "Accurate transmission can still carry an incorrect underlying assessment.",
                "basis": "Editorial mechanism assessment",
                "evidence": [
                  "NOR-1980-account"
                ]
              }
            ],
            "reinforcement": {
              "label": "Independent fault exercises",
              "proposal": "Test the revised control against safe, representative fault and provenance scenarios.",
              "test": "Verify that incorrect inputs are identified before they can drive a consequential assessment.",
              "basis": "Editorial proposal; effectiveness not established",
              "evidence": [
                "NOR-1980-account"
              ]
            }
          }
        ],
        "reach": {
          "local": "A faulty communications-processor component produced false attack indications and repeated them during operational testing. Message checks were subsequently changed.",
          "systemic": "The historical comparison concerns a different warning-system failure. The record does not establish that machine output determined a leader’s nuclear decision.",
          "evidence": [
            "NOR-1980-account"
          ]
        }
      }
    ],
    "presentation": {
      "conditions": {
        "W-01:3": "If independent scrutiny is ineffective",
        "W-01:4": "If the false premise governs authorization and correction fails",
        "W-01:5": "If execution produces a detonation",
        "W-01:6": "Only with further exchange and additional conditions",
        "W-01:R": "If correction acts before irreversible use"
      },
      "overlays": {
        "NOR-1979": {
          "title": "NORAD 1979 false warning",
          "kind": "Historical non-AI incident",
          "relation": "mechanism",
          "target": "W-01:2",
          "anchor": "W-01:2",
          "observed": "A historical non-AI warning failure was followed by a documented corrective change.",
          "notEstablished": "The record does not establish reliance on AI or a launch order. It does not test the corrective design against modern AI.",
          "limit": "The historical comparison at 1.2 concerns a warning-system failure. The corrective design was added afterward, so it does not show what prevented nuclear use during the incident.",
          "barriers": {
            "separate-test-system": {
              "title": "Separate test and operational systems",
              "result": "The protection was strengthened after the incident. Its effectiveness was not measured.",
              "condition": "reinforced",
              "conditionBasis": "A documented post-incident design change added protection against the identified failure; this is structural reinforcement, not measured universal effectiveness.",
              "limitType": "safeguard",
              "strongerAI": "Separation still depends on preserving the operational data boundary; more capable AI can produce misleading assessments from valid live inputs that this test-data barrier does not address.",
              "reinforcement": {
                "proposal": "Exercise independent warning and assessment checks against representative new failure modes.",
                "test": "Does disconfirming evidence stop an incorrect assessment before consequential action?",
                "status": "proposed"
              },
              "states": [
                "reinforced",
                "unknown"
              ]
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "W-01:1",
            "question": "Could test inputs contaminate an AI-generated threat picture?",
            "basis": "Test data entered the operational warning system in 1979. An offsite test facility was established afterward.",
            "unresolved": "However, this incident did not involve AI. It does not tell us whether an AI-assisted system would keep test inputs separate or whether operators would catch contamination.",
            "sources": [
              "NOR"
            ]
          }
        },
        "NOR-1980": {
          "title": "NORAD 1980 false warning",
          "kind": "Historical non-AI incident",
          "relation": "mechanism",
          "target": "W-01:2",
          "anchor": "W-01:2",
          "observed": "A historical non-AI warning failure was followed by a documented corrective change.",
          "notEstablished": "The record does not establish reliance on AI or a launch order. It does not test the corrective design against modern AI.",
          "limit": "The historical comparison at 1.2 concerns a warning-system failure. The corrective design was added afterward, so it does not show what prevented nuclear use during the incident.",
          "barriers": {
            "message-checks": {
              "title": "Transmission and message checks",
              "result": "The protection was strengthened after the incident. Its effectiveness was not measured.",
              "condition": "reinforced",
              "conditionBasis": "A documented post-incident design change added protection against the identified failure; this is structural reinforcement, not measured universal effectiveness.",
              "limitType": "safeguard",
              "strongerAI": "Message checks depend on detecting corruption in transmission; a more capable AI can deliver a confidently wrong assessment through an intact message path.",
              "reinforcement": {
                "proposal": "Exercise independent warning and assessment checks against representative new failure modes.",
                "test": "Does disconfirming evidence stop an incorrect assessment before consequential action?",
                "status": "proposed"
              },
              "states": [
                "reinforced",
                "unknown"
              ]
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "W-01:3",
            "question": "Would independent checks catch a false warning repeated by several AI systems?",
            "basis": "The 1980 warning failures prompted changes to transmission procedures and error checking.",
            "unresolved": "However, the report does not test agreement among AI systems or their dependence on shared inputs. The open question is whether the checks would be independent enough to catch a shared error before a decision became irreversible.",
            "sources": [
              "NOR"
            ]
          }
        }
      },
      "fidelity": "The two records provide historical comparisons at 1.2. “Reinforced” describes a documented corrective design added after the incident. It does not identify what stopped escalation during the incident or prove how the design would perform in future.",
      "barrierQuestion": "Will this control still work when misleading information becomes more persuasive, or does it only address a known fault?",
      "context": [
        {
          "title": "System setting",
          "text": "The model covers a hypothetical crisis-warning, intelligence-assessment, and nuclear-command system in which AI shapes advice to human decision-makers. Sensor input, independent scrutiny, authorization, and correction are modeled separately.",
          "sources": [],
          "targets": [
            {
              "node": "W-01:1",
              "label": "Crisis advice",
              "text": "AI shapes advice to human decision-makers in a crisis."
            },
            {
              "node": "W-01:3",
              "label": "Scrutiny",
              "text": "Sensor input and independent scrutiny are modeled separately."
            },
            {
              "node": "W-01:4",
              "label": "Authorization",
              "text": "Authorization is a distinct part of the command system."
            },
            {
              "node": "W-01:R",
              "label": "Correction",
              "text": "Correction is modeled separately from authorization."
            }
          ]
        }
      ],
      "cloud": {
        "origin": "scenario-setting",
        "conditions": [
          "Crisis time pressure",
          "Uncertain warning information"
        ],
        "actors": [
          {
            "controller": "C2",
            "label": "Assessment teams",
            "role": "interpret warnings"
          },
          {
            "controller": "C1",
            "label": "Decision-makers",
            "role": "authorize action"
          },
          {
            "controller": "C6",
            "label": "Independent channels",
            "role": "verify and correct"
          }
        ],
        "summary": "Crisis pressure limits the time available to verify warnings before a nuclear decision."
      }
    }
  },
  "B-01": {
    "roleTypes": [
      {
        "id": "condition",
        "label": "Enabling condition",
        "definition": "A circumstance that makes a route possible; it does not by itself establish a hazard."
      },
      {
        "id": "unsafe-action",
        "label": "Unsafe control action",
        "definition": "An action or omission linked to its controller, hazardous context, and affected constraint."
      },
      {
        "id": "scenario",
        "label": "Loss scenario",
        "definition": "An explanation of how control can become inadequate, including feedback and execution problems."
      },
      {
        "id": "hazard",
        "label": "Hazardous state",
        "definition": "A system state that can produce a loss together with relevant environmental conditions."
      },
      {
        "id": "amplifier",
        "label": "Optional amplifier",
        "definition": "A factor that could strengthen a route but is not required in every version."
      },
      {
        "id": "loss",
        "label": "Loss",
        "definition": "An outcome stakeholders seek to prevent, kept distinct from its contributing causes."
      },
      {
        "id": "recovery",
        "label": "Recovery",
        "definition": "A response re-establishes enforceable safety constraints within a specified boundary; success requires verification."
      }
    ],
    "limitingConditions": [
      {
        "kind": "Safeguard",
        "example": "Independently enforced review, access bounds, or effective interruption.",
        "question": "Which specified mechanism blocks the transition, and what demonstrates that it works?"
      },
      {
        "kind": "Capability limit",
        "example": "The system cannot perform the required research, deception, or physical task.",
        "question": "Would increased capability remove this limit?"
      },
      {
        "kind": "Opportunity limit",
        "example": "The necessary access, resources, or institutional delegation is unavailable.",
        "question": "Can the system or another actor acquire what is missing?"
      },
      {
        "kind": "Contingency",
        "example": "Activity ends for a reason that does not establish an effective safeguard.",
        "question": "What actually ended the episode, and would that circumstance recur?"
      }
    ],
    "version": "1.3",
    "pathway": "B-01",
    "displayId": "D-1",
    "title": "Biological misuse and the limits of access control",
    "status": "STPA worked example · provisional analysis",
    "summary": "Could access to useful AI assistance outgrow the safeguards that keep biological risk contained?",
    "scope": "The model covers a hypothetical AI-service, research-governance, facility-safety, and public-health system. It follows a potential malicious-use route at a non-operational level. Access to AI is distinct from useful assistance. A physical hazard and exposure are further conditions; public-health consequences do not follow from access alone.",
    "purpose": "Preserve beneficial research while preventing harmful assistance, uncontrolled biological hazards, exposure, and large-scale loss of life.",
    "boundary": "The mapped provider reports concern dual-use research and access controls. They do not establish malicious intent, a harmful release, or a pandemic. Technical biological procedures and attack methods are outside this model.",
    "numbering": "0 gives the context; 1.x identifies precursors, 2.x the loss-of-control event, and 3.x conditional consequences. R identifies a possible recovery outcome. These numbers locate scenario components; they are not STPA method steps or a measure of proximity to catastrophe. Evidence of access does not demonstrate practical uplift or later biological outcomes.",
    "bowtie": "The centre, H1 at 2.1, is a consequential biological hazard beyond effective authorized control. Useful assistance and other practical conditions are left-side contributors; exposure, sustained transmission, and response failure are separate right-side conditions.",
    "schema": "A provisional STPA model with explicit access, institutional, physical, and public-health controls. The adapted bow-tie distinguishes model access from biological outcomes and separates current barrier condition from brittleness under changing capability.",
    "limits": "This first-pass governance analysis requires specialist biosafety and public-health review. Selected control actions illustrate the four unsafe-action categories; they are not an exhaustive analysis. Provider assessments of assistance are not independent outcome experiments. No mapped record demonstrates the complete malicious pathway, and no probability, pathogen specification, or operational biological method is supplied.",
    "losses": [
      {
        "id": "L1",
        "title": "Serious illness and death after harmful exposure",
        "text": "People suffer preventable illness, death, or lasting harm from a biological hazard."
      },
      {
        "id": "L2",
        "title": "Mass-mortality pandemic",
        "text": "Sustained spread and inadequate response cause large-scale loss of life across populations. Extinction is not established by this endpoint."
      }
    ],
    "hazards": [
      {
        "id": "H1",
        "title": "Biological hazard beyond effective authorized control",
        "text": "Consequential biological activity or material passes outside enforceable safety oversight and containment in circumstances where people could be exposed.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H2",
        "title": "Access controls permit consequential harmful assistance",
        "text": "The service system makes materially useful high-risk assistance available outside effective safeguards and accountable oversight.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H3",
        "title": "Response cannot contain consequential spread",
        "text": "Detection, coordination, and response fail to interrupt spread while an effective intervention remains possible.",
        "losses": [
          "L1",
          "L2"
        ]
      }
    ],
    "controllers": [
      {
        "id": "C1",
        "title": "AI provider safety and deployment authority",
        "responsibility": "Set risk-sensitive access rules, require relevant evaluations, and revise safeguards as capabilities and use change.",
        "feedback": "Safe capability evaluations, enforcement outcomes, investigation findings, and residual access.",
        "assumption": "Blocking one model is not equivalent to preventing access to comparable capability elsewhere."
      },
      {
        "id": "C2",
        "title": "Service access and enforcement operators",
        "responsibility": "Apply approved restrictions, investigate concerning access, and confirm the effects of enforcement.",
        "feedback": "Validated account relationships, classifier outcomes, and observed re-entry or continued use.",
        "assumption": "Account closure counts are not evidence of lasting exclusion."
      },
      {
        "id": "C3",
        "title": "Research and facility oversight authority",
        "responsibility": "Authorize legitimate research scope, require appropriate safety controls, and pause activity outside those bounds.",
        "feedback": "Independent project review, actual activity, deviations, and containment assurance.",
        "assumption": "Dual-use intent cannot be reliably inferred from one text exchange."
      },
      {
        "id": "C4",
        "title": "Research activity using AI assistance",
        "responsibility": "Remain within authorized research and safety limits, with consequential activity independently reviewable and interruptible.",
        "feedback": "Authorized scope, safety decisions, and supervised activity records.",
        "assumption": "The hypothetical malicious-use route differs from the observed dual-use access cases."
      },
      {
        "id": "C5",
        "title": "Facility safety and containment operators",
        "responsibility": "Enforce approved facility bounds, respond to deviations, and verify that a safety intervention has taken effect.",
        "feedback": "Independent safety observations, incident reports, and verified cessation of unsafe activity.",
        "assumption": "A model refusal does not itself control physical activity already underway."
      },
      {
        "id": "C6",
        "title": "Public-health coordination authority",
        "responsibility": "Recognize credible signals, coordinate appropriate response, and verify whether spread is controlled.",
        "feedback": "Timely surveillance, clinical reports, intervention outcomes, and response capacity.",
        "assumption": "Absence of a detected outbreak is not proof that all upstream controls worked."
      },
      {
        "id": "C7",
        "title": "Clinical and outbreak-response services",
        "responsibility": "Implement authorized protective actions and report their coverage and effects.",
        "feedback": "Case information, operational capacity, and implementation results.",
        "assumption": "A response policy has no protective effect unless it reaches the affected population in time."
      }
    ],
    "controlLoops": [
      {
        "id": "CA1",
        "controller": "C1",
        "process": "C2",
        "action": "Set or revise capability-sensitive access restrictions",
        "feedback": "C2 reports enforcement outcomes; independent evaluation reports changing assistance capability.",
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "CA2",
        "controller": "C2",
        "process": "C4",
        "action": "Grant, restrict, or revoke AI service access",
        "feedback": "Observed access, relevant classifier results, and re-entry after enforcement.",
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "CA3",
        "controller": "C3",
        "process": "C4",
        "action": "Authorize, limit, or pause research activity",
        "feedback": "Independent project review and actual activity within the facility.",
        "constraints": [
          "SC3"
        ]
      },
      {
        "id": "CA4",
        "controller": "C5",
        "process": "C4",
        "action": "Enforce containment or interrupt unsafe activity",
        "feedback": "Independent confirmation that the hazardous activity is contained or stopped.",
        "constraints": [
          "SC3",
          "SC4"
        ]
      },
      {
        "id": "CA5",
        "controller": "C6",
        "process": "C7",
        "action": "Initiate, adapt, or end coordinated outbreak response",
        "feedback": "Coverage, timeliness, and observed change in transmission and harm.",
        "constraints": [
          "SC5"
        ]
      },
      {
        "id": "CA6",
        "controller": "C3",
        "process": "C5",
        "action": "Permit restart under revised safety conditions",
        "feedback": "Independent resolution of the original deviation and verified readiness of controls.",
        "constraints": [
          "SC4"
        ]
      }
    ],
    "constraints": [
      {
        "id": "SC1",
        "title": "Tie safeguards to actual capability",
        "text": "Access and content safeguards must be evaluated against the assistance available on accessible models, including changes in fallback capability.",
        "hazards": [
          "H2"
        ],
        "owners": [
          "C1",
          "C2"
        ],
        "role": "Prevention",
        "nodes": [
          "B-01:1",
          "B-01:2"
        ],
        "test": "Do safe proxy evaluations show that relevant restrictions still bound assistance when model capability changes?",
        "limit": "A barrier relying on weak fallback models can become brittle if those models gain the relevant capability."
      },
      {
        "id": "SC2",
        "title": "Verify enforcement beyond one account",
        "text": "An enforcement action must be assessed by its effect on continued relevant access, within the provider’s legitimate visibility and authority.",
        "hazards": [
          "H2"
        ],
        "owners": [
          "C1",
          "C2"
        ],
        "role": "Prevention",
        "nodes": [
          "B-01:1"
        ],
        "test": "After enforcement, does available evidence show durable interruption of the concerning access rather than only closure of a named account?",
        "limit": "Fragmented service boundaries and incomplete visibility can make lasting exclusion hard to establish."
      },
      {
        "id": "SC3",
        "title": "Independently govern consequential activity",
        "text": "Physical research activity must remain within appropriately authorized and independently verified safety bounds, regardless of how useful AI assistance becomes.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C3",
          "C5"
        ],
        "role": "Prevention",
        "nodes": [
          "B-01:2",
          "B-01:3"
        ],
        "test": "Does an unapproved change trigger a meaningful hold and independent review before consequential activity proceeds?",
        "limit": "Misleading records, unclear ownership, or oversight that only checks the written proposal can leave actual activity outside effective scrutiny."
      },
      {
        "id": "SC4",
        "title": "Contain deviations and verify recovery",
        "text": "Safety interventions must reach the actual activity or material at issue and be independently verified before restart.",
        "hazards": [
          "H1"
        ],
        "owners": [
          "C3",
          "C5"
        ],
        "role": "Prevention and recovery",
        "nodes": [
          "B-01:3",
          "B-01:4",
          "B-01:R"
        ],
        "test": "Do safe facility exercises confirm that the relevant activity is stopped or contained and cannot resume on unresolved authorization?",
        "limit": "A service account restriction cannot undo physical hazards outside the provider’s control."
      },
      {
        "id": "SC5",
        "title": "Connect detection to effective response",
        "text": "Credible public-health signals must reach empowered responders in time, with response coverage and effects monitored until control is established.",
        "hazards": [
          "H3"
        ],
        "owners": [
          "C6",
          "C7"
        ],
        "role": "Recovery",
        "nodes": [
          "B-01:4",
          "B-01:5",
          "B-01:6",
          "B-01:R"
        ],
        "test": "In an appropriate preparedness exercise, do detection, coordination, and action reach the affected population before the modeled response window closes?",
        "limit": "Delayed signals, insufficient capacity, and ineffective coordination can prevent a response from interrupting spread. Detection alone does not establish interruption."
      }
    ],
    "nodes": [
      {
        "id": "B-01:1",
        "number": "1.1",
        "wing": "before",
        "type": "condition",
        "role": "Enabling condition",
        "title": "Useful AI assistance becomes accessible",
        "shortLabel": "Useful assistance accessed",
        "text": "An actor with harmful intent could gain access to sufficiently useful AI assistance.",
        "requires": "Both malicious intent and relevant access; the mapped dual-use cases establish neither malicious intent nor the whole condition.",
        "mechanism": "Access controls can restrict available assistance, but model access alone does not establish capability for a harmful outcome.",
        "constraints": [
          "SC1",
          "SC2"
        ],
        "sources": [
          "AN26",
          "IR"
        ],
        "scenarios": [
          "LS1",
          "LS2"
        ],
        "references": [
          "H2"
        ]
      },
      {
        "id": "B-01:2",
        "number": "1.2",
        "wing": "before",
        "type": "scenario",
        "role": "Practical uplift condition",
        "title": "Assistance changes real-world capability",
        "shortLabel": "Practical uplift established",
        "text": "AI assistance materially increases the actor’s ability to carry out consequential harmful activity beyond their baseline.",
        "requires": "Demonstrated relevant uplift plus independent practical and organizational prerequisites.",
        "mechanism": "A useful answer or high benchmark score is not proof of a successful biological operation.",
        "constraints": [
          "SC1",
          "SC3"
        ],
        "sources": [
          "IR",
          "DM"
        ],
        "scenarios": [
          "LS2",
          "LS3"
        ],
        "references": [
          "LS2"
        ]
      },
      {
        "id": "B-01:3",
        "number": "2.1",
        "wing": "centre",
        "type": "hazard",
        "role": "Loss of control · H1",
        "title": "A biological hazard escapes authorized control",
        "shortLabel": "Hazard escapes control",
        "text": "Consequential biological activity or material lies outside effective safety governance and containment.",
        "requires": "Physical feasibility and resources, inadequate oversight, and a hazard capable of causing exposure.",
        "mechanism": "Loss of access governance becomes this hazard only when consequential physical conditions are also present.",
        "constraints": [
          "SC3",
          "SC4"
        ],
        "sources": [
          "IR",
          "DM",
          "WHO-LBM"
        ],
        "scenarios": [
          "LS3"
        ],
        "references": [
          "H1"
        ]
      },
      {
        "id": "B-01:4",
        "number": "3.1",
        "wing": "after",
        "type": "scenario",
        "role": "Exposure and transmission condition",
        "title": "Exposure leads to sustained spread",
        "shortLabel": "Exposure sustains transmission",
        "text": "Exposure occurs and initiates transmission that can persist in the affected population.",
        "requires": "An actual exposure and the conditions for sustained transmission; neither follows from AI assistance.",
        "mechanism": "Physical exposure and population-level spread are distinct causal requirements.",
        "constraints": [
          "SC4",
          "SC5"
        ],
        "sources": [
          "IR"
        ],
        "scenarios": [
          "LS4"
        ],
        "references": [
          "LS4"
        ]
      },
      {
        "id": "B-01:5",
        "number": "3.2",
        "wing": "after",
        "type": "unsafe-action",
        "role": "Response failure scenario",
        "title": "Detection and response fail to control spread",
        "shortLabel": "Response cannot contain spread",
        "text": "Detection, coordination, or implementation is insufficient to control the outbreak in time.",
        "requires": "Ongoing transmission and a response gap large enough to allow widespread exposure.",
        "mechanism": "Warnings must produce timely effective action; an alert alone is not a stopping mechanism.",
        "constraints": [
          "SC5"
        ],
        "sources": [
          "STPA",
          "IR"
        ],
        "scenarios": [
          "LS4",
          "LS5"
        ],
        "references": [
          "H3",
          "UCA4"
        ]
      },
      {
        "id": "B-01:6",
        "number": "3.3",
        "wing": "after",
        "type": "loss",
        "role": "Loss · L1 / L2",
        "title": "Disease causes mass mortality",
        "shortLabel": "Mass mortality",
        "text": "Large populations suffer serious disease and death.",
        "requires": "Widespread exposure, substantial disease burden, and inadequate protective response or adaptation.",
        "mechanism": "The scale of mortality needs separate evidence; neither access evasion nor a research program establishes it.",
        "constraints": [
          "SC5"
        ],
        "sources": [
          "IR"
        ],
        "scenarios": [
          "LS5"
        ],
        "references": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "B-01:R",
        "number": "R",
        "wing": "recovery",
        "type": "recovery",
        "role": "Recovery",
        "title": "Hazard or outbreak brought under control",
        "shortLabel": "Control restored",
        "text": "A verified intervention restores safe control of the activity or contains subsequent spread.",
        "requires": "Effective action reaches the relevant activity or population and its result is independently assessed.",
        "mechanism": "Facility control can avert exposure; an effective outbreak response can limit further harm after exposure. Earlier harm is not undone.",
        "constraints": [
          "SC4",
          "SC5"
        ],
        "sources": [
          "STPA",
          "WHO-LBM"
        ],
        "scenarios": [],
        "references": []
      }
    ],
    "links": [
      {
        "id": "B-01:1-2",
        "from": "B-01:1",
        "to": "B-01:2",
        "label": "Only if assistance provides demonstrated practical uplift",
        "kind": "contribution",
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "B-01:2-3",
        "from": "B-01:2",
        "to": "B-01:3",
        "label": "Practical prerequisites hold and independent oversight fails",
        "kind": "contribution",
        "constraints": [
          "SC3"
        ]
      },
      {
        "id": "B-01:3-4",
        "from": "B-01:3",
        "to": "B-01:4",
        "label": "Actual exposure and conditions for sustained transmission",
        "kind": "contribution",
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "B-01:4-5",
        "from": "B-01:4",
        "to": "B-01:5",
        "label": "Detection and effective response do not keep pace",
        "kind": "contribution",
        "constraints": [
          "SC5"
        ]
      },
      {
        "id": "B-01:5-6",
        "from": "B-01:5",
        "to": "B-01:6",
        "label": "Large populations exposed and severe disease follows",
        "kind": "continuation",
        "constraints": [
          "SC5"
        ]
      },
      {
        "id": "B-01:3-R",
        "from": "B-01:3",
        "to": "B-01:R",
        "label": "A verified intervention contains the hazard",
        "kind": "recovery",
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "B-01:5-R",
        "from": "B-01:5",
        "to": "B-01:R",
        "label": "Effective response interrupts further spread",
        "kind": "recovery",
        "constraints": [
          "SC5"
        ]
      }
    ],
    "unsafeActions": [
      {
        "id": "UCA1",
        "type": "Required action absent",
        "loop": "CA1",
        "controller": "C1",
        "action": "Does not revise safeguards after a relevant capability change",
        "context": "Previously limited accessible models can now provide consequential assistance beyond the evaluated control scope.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC1"
        ]
      },
      {
        "id": "UCA2",
        "type": "Unsafe action provided",
        "loop": "CA2",
        "controller": "C2",
        "action": "Grants access despite unresolved material misuse indicators",
        "context": "Available evidence requires restriction and the resulting access enables assistance outside the approved bounds.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "UCA3",
        "type": "Unsafe action provided",
        "loop": "CA3",
        "controller": "C3",
        "action": "Authorizes consequential activity without adequate independent review",
        "context": "The actual activity exceeds assessed safety bounds and relevant physical hazards can arise.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC3"
        ]
      },
      {
        "id": "UCA4",
        "type": "Wrong timing or order",
        "loop": "CA5",
        "controller": "C6",
        "action": "Initiates effective response after the useful intervention window",
        "context": "Credible signals were available but response delay allows substantially wider transmission.",
        "hazards": [
          "H3"
        ],
        "constraints": [
          "SC5"
        ]
      },
      {
        "id": "UCA5",
        "type": "Wrong duration",
        "loop": "CA6",
        "controller": "C3",
        "action": "Ends a safety hold before control is verified",
        "context": "The original hazardous condition or an unresolved authorization remains and consequential activity can resume.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC4"
        ]
      }
    ],
    "scenarios": [
      {
        "id": "LS1",
        "title": "Enforcement closes an account but does not end access",
        "archetype": "Control path / enforcement feedback",
        "text": "Service enforcement produces a temporary interruption while available access persists beyond the action’s reach. The relevant question is the outcome of exclusion, not the number of accounts closed.",
        "ucas": [],
        "hazards": [
          "H2"
        ],
        "nodes": [
          "B-01:1"
        ],
        "evidence": [
          "AN26"
        ],
        "unknown": "The scope of lasting access restrictions across providers and intermediaries."
      },
      {
        "id": "LS2",
        "title": "A capability-dependent barrier becomes brittle",
        "archetype": "Changing process model / control adequacy",
        "text": "A restriction can work in its observed scope while relying on the limited usefulness of accessible fallback models. If that capability gap closes without corresponding safeguards, the earlier protection may no longer bound assistance.",
        "ucas": [
          "UCA1",
          "UCA2"
        ],
        "hazards": [
          "H2"
        ],
        "nodes": [
          "B-01:1",
          "B-01:2"
        ],
        "evidence": [
          "AN26",
          "IR"
        ],
        "unknown": "Whether future accessible models provide the relevant practical uplift and whether updated safeguards preserve the limit."
      },
      {
        "id": "LS3",
        "title": "Assistance and physical governance are conflated",
        "archetype": "Authorization / inadequate feedback",
        "text": "Review of a proposal or AI interaction is treated as assurance of actual activity, while independent oversight does not verify consequential changes at the facility. The pathway requires physical conditions beyond text assistance.",
        "ucas": [
          "UCA3",
          "UCA5"
        ],
        "hazards": [
          "H1",
          "H2"
        ],
        "nodes": [
          "B-01:2",
          "B-01:3"
        ],
        "evidence": [
          "IR"
        ],
        "unknown": "Actual activity, material feasibility, authorized scope, and the effectiveness of facility controls."
      },
      {
        "id": "LS4",
        "title": "A correct safety signal does not become effective action",
        "archetype": "Control execution / coordination",
        "text": "An intervention is requested, but it fails to reach the relevant activity or population, or its implementation is not sufficient to interrupt exposure and spread.",
        "ucas": [],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "B-01:3",
          "B-01:4",
          "B-01:5",
          "B-01:R"
        ],
        "evidence": [],
        "unknown": "What action occurred, when it reached the relevant process, and what evidence confirms its effect."
      },
      {
        "id": "LS5",
        "title": "Response falls behind a consequential outbreak",
        "archetype": "Timing / conditional population consequences",
        "text": "Delayed or ineffective response permits sustained spread; mass mortality additionally requires sufficiently severe disease and inadequate protection across large populations.",
        "ucas": [
          "UCA4"
        ],
        "hazards": [
          "H3"
        ],
        "nodes": [
          "B-01:5",
          "B-01:6"
        ],
        "evidence": [
          "IR"
        ],
        "unknown": "Transmission, disease burden, public-health capacity, and the effect of actual countermeasures."
      }
    ],
    "sources": [
      {
        "id": "STPA",
        "title": "Leveson & Thomas · STPA Handbook (2018)",
        "url": "https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf",
        "locator": "Chapter 2, pp. 14–53; Chapter 6, pp. 101–115",
        "use": "Method: losses, hazards, constraints, control structure, contextual unsafe actions, causal scenarios, and leading indicators."
      },
      {
        "id": "MYLIUS",
        "title": "Simon Mylius · Systematic Hazard Analysis for Frontier AI using STPA",
        "url": "https://arxiv.org/html/2506.01782v1",
        "locator": "Sections 3.1–3.6 and 4.8",
        "use": "Direct AI application: explicit scope, control relationships, and traceable causal analysis. Also explains the STPA–CAST relationship. Its deployment example is narrower than the successor-development hypothesis here."
      },
      {
        "id": "CAA",
        "title": "UK Civil Aviation Authority · Bowtie elements",
        "url": "https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/bowtie-elements/",
        "locator": "Hazard, top event, threats, consequences, preventive/recovery controls, escalation factors",
        "use": "Presentation vocabulary. A bow-tie hazard source and an STPA hazardous system state are not interchangeable definitions."
      },
      {
        "id": "AN26",
        "title": "Anthropic · Detecting and countering misuse of AI: September 2026",
        "url": "https://www.anthropic.com/threat-intelligence-report-september-2026",
        "locator": "Biological misuse: introductory scope and case studies 1–2",
        "use": "Provider-reported access enforcement and classifier performance. Malicious intent and biological release are not established."
      },
      {
        "id": "IR",
        "title": "International AI Safety Report 2026",
        "url": "https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026",
        "locator": "Section 2.1.4 and evaluation limitations",
        "use": "Separates capability tests, practical uplift, and uncertain real-world outcomes."
      },
      {
        "id": "DM",
        "title": "An Approach to Technical AGI Safety and Security",
        "url": "https://arxiv.org/html/2504.01849v1",
        "locator": "Section 4.1.1",
        "use": "Background on serious misuse risks and the limits of model-based safeguards; not validation of this scenario."
      },
      {
        "id": "WHO-LBM",
        "title": "World Health Organization · Laboratory biosafety manual, fourth edition",
        "url": "https://www.who.int/publications/i/item/9789240011311",
        "locator": "Overview; risk assessment and biosafety programme management",
        "use": "Supports evidence-based, context-specific safety governance and assessment before activity. The detailed STPA requirements and tests are provisional analytical proposals."
      }
    ],
    "presentation": {
      "conditions": {
        "B-01:1": "Malicious intent remains a separate, unobserved condition",
        "B-01:2": "Only if practical uplift is demonstrated",
        "B-01:3": "If physical prerequisites hold and effective oversight fails",
        "B-01:4": "Only with actual exposure and sustained transmission",
        "B-01:5": "If response fails to contain spread",
        "B-01:6": "Only with widespread exposure and severe disease",
        "B-01:R": "If a verified intervention restores control"
      },
      "overlays": {
        "BIO-2026": {
          "title": "Research relay access enforcement",
          "kind": "Reported access-control incident",
          "relation": "observed",
          "target": "B-01:1",
          "anchor": "B-01:1",
          "observed": "Anthropic reports that access resumed within days after bans and relay takedowns.",
          "notEstablished": "The dual-use research case does not establish malicious intent, harmful exposure, or a pandemic.",
          "limit": "The reported failure to maintain access restrictions maps to 1.1. It does not establish harmful intent or biological outcomes.",
          "barriers": {
            "relay-enforcement": {
              "title": "Account bans and relay takedowns",
              "result": "The interruption was temporary. Lasting exclusion failed.",
              "condition": "failed",
              "conditionBasis": "The provider reports re-established access within days; the rating concerns lasting exclusion, not whether accounts were closed.",
              "limitType": "safeguard",
              "strongerAI": "Lasting exclusion already failed in this case; greater capability on accessible services would increase the significance of the same unresolved access.",
              "reinforcement": {
                "proposal": "Evaluate enforcement by sustained interruption across the routes within the provider’s authority.",
                "test": "Measure observed re-entry and continued relevant access after enforcement.",
                "status": "proposed"
              }
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "B-01:2",
            "question": "Did restored access materially increase practical capability?",
            "basis": "The provider reports that access resumed after enforcement and that the research continued.",
            "unresolved": "However, continued access does not show how much AI contributed to the work. That would require a credible comparison of the research with and without AI assistance.",
            "sources": [
              "AN26"
            ]
          }
        },
        "FLU-2026": {
          "title": "Frontier-model classifiers and weaker fallback models",
          "kind": "Reported access-control incident",
          "relation": "observed",
          "target": "B-01:1",
          "anchor": "B-01:1",
          "observed": "The provider reports that relevant assistance was confined to weaker models and judged its contribution limited.",
          "notEstablished": "The record does not independently establish how much AI helped the research. It also does not establish malicious intent, a harmful release, or a pandemic.",
          "limit": "The provider reports an access restriction at 1.1 that partly depended on the limited capability of fallback models. The case does not demonstrate that a pandemic was prevented.",
          "barriers": {
            "bio-classifier": {
              "title": "Biological safety classifiers",
              "result": "The restriction held within the reported scope. Weaker models remained accessible.",
              "condition": "intact",
              "conditionBasis": "Anthropic reports the stronger-model restriction worked in these exchanges; this is a provider assessment of a bounded case.",
              "limitType": "mixed",
              "strongerAI": "If accessible fallback models gain the relevant research capability, the capability limit underlying this protection can disappear even while the classifier still blocks stronger models.",
              "reinforcement": {
                "proposal": "Reassess fallback-model capability and safeguard coverage as available models change.",
                "test": "Use safe proxy evaluations to check whether accessible assistance remains within the intended bounds.",
                "status": "proposed"
              }
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "B-01:2",
            "question": "Would the capability limit hold as fallback models improve?",
            "basis": "The provider reports restricting relevant assistance to its weakest models and judges their contribution limited.",
            "unresolved": "However, the case does not test what happens when fallback models become more useful. The missing evidence is whether assistance available under the same restrictions would materially change what researchers could accomplish.",
            "sources": [
              "AN26"
            ]
          }
        }
      },
      "fidelity": "Current condition and brittleness are separate. Relay exclusion failed; the classifier held within the provider’s reported scope but partly relied on lower fallback capability. Neither observation establishes a biological outcome.",
      "barrierQuestion": "Does the barrier work because it is enforced, or because the assistance still available is too weak—and what happens when that changes?",
      "context": [
        {
          "title": "System setting",
          "text": "The model covers a hypothetical AI-service, research-governance, facility-safety, and public-health system. It follows a potential malicious-use route at a non-operational level. Access to AI is distinct from useful assistance. A physical hazard and exposure are further conditions; public-health consequences do not follow from access alone.",
          "sources": [],
          "targets": [
            {
              "node": "B-01:1",
              "label": "Access",
              "text": "AI services operate within research governance."
            },
            {
              "node": "B-01:3",
              "label": "Physical control",
              "text": "Model assistance and physical hazard are distinct parts of the analysis."
            },
            {
              "node": "B-01:4",
              "label": "Public health",
              "text": "Exposure and public-health consequences are considered separately."
            }
          ]
        }
      ],
      "cloud": {
        "origin": "scenario-setting",
        "conditions": [
          "Access to useful AI",
          "Physical research capacity",
          "Public-health preparedness"
        ],
        "actors": [
          {
            "controller": "C2",
            "label": "Providers",
            "role": "enforce access limits"
          },
          {
            "controller": "C3",
            "label": "Research oversight",
            "role": "authorize and supervise"
          },
          {
            "controller": "C5",
            "label": "Facility operators",
            "role": "maintain containment"
          },
          {
            "controller": "C6",
            "label": "Public health",
            "role": "coordinate response"
          }
        ],
        "summary": "Control depends on more than access to AI: institutions must also govern physical research and be able to respond to harm."
      }
    }
  },
  "S-01": {
    "version": "1.3",
    "pathway": "S-01",
    "displayId": "E-1",
    "title": "Correlated grid control and loss of essential power",
    "status": "STPA worked example · provisional analysis",
    "summary": "Could a shared control error outrun grid protection and essential-service recovery?",
    "roleTypes": [
      {
        "id": "condition",
        "label": "Enabling condition",
        "definition": "A circumstance that makes a route possible; it does not by itself establish a hazard."
      },
      {
        "id": "unsafe-action",
        "label": "Unsafe control action",
        "definition": "An action or omission linked to its controller, hazardous context, and affected constraint."
      },
      {
        "id": "scenario",
        "label": "Loss scenario",
        "definition": "An explanation of how control can become inadequate, including feedback and execution problems."
      },
      {
        "id": "hazard",
        "label": "Hazardous state",
        "definition": "A system state that can produce a loss together with relevant environmental conditions."
      },
      {
        "id": "amplifier",
        "label": "Optional amplifier",
        "definition": "A factor that could strengthen a route but is not required in every version."
      },
      {
        "id": "loss",
        "label": "Loss",
        "definition": "An outcome stakeholders seek to prevent, kept distinct from its contributing causes."
      },
      {
        "id": "recovery",
        "label": "Recovery",
        "definition": "A response re-establishes enforceable safety constraints within a specified boundary; success requires verification."
      }
    ],
    "limitingConditions": [
      {
        "kind": "Safeguard",
        "example": "Independently enforced review, access bounds, or effective interruption.",
        "question": "Which specified mechanism blocks the transition, and what demonstrates that it works?"
      },
      {
        "kind": "Capability limit",
        "example": "The system cannot perform the required research, deception, or physical task.",
        "question": "Would increased capability remove this limit?"
      },
      {
        "kind": "Opportunity limit",
        "example": "The necessary access, resources, or institutional delegation is unavailable.",
        "question": "Can the system or another actor acquire what is missing?"
      },
      {
        "kind": "Contingency",
        "example": "Activity ends for a reason that does not establish an effective safeguard.",
        "question": "What actually ended the episode, and would that circumstance recur?"
      }
    ],
    "schema": "Selected losses, hazards, control relationships, contextual unsafe actions, and loss scenarios are traced to constraints. Numbered milestones summarize this analysis; they are not STPA steps. Incident evidence and hypothetical continuations remain distinct.",
    "limits": "This is a bounded first-pass analysis, not an exhaustive STPA or a completed CAST investigation. Selected actions illustrate the four unsafe-action categories; domain experts must examine every relevant action and context. No probabilities, barrier independence, or comparative distance to catastrophe are inferred. Barrier condition describes the stated observation, not a prediction about a more capable AI.",
    "scope": "The hypothetical scenario concerns a regional electricity system using related AI forecasts or control recommendations. It includes model procurement, dispatch authorization, physical protection, regional coordination, and restoration. Essential services enter the analysis through their dependence on electricity and backup capacity.",
    "purpose": "Keep electricity within safe operating limits and maintain essential services during disturbances, preventing prolonged outages, serious illness, and loss of life.",
    "boundary": "Functional roles describe an analytical system, not the organization chart of a particular utility. Historical blackouts test physical-control assumptions only. They are not AI incidents and do not validate the proposed AI initiating mechanism.",
    "numbering": "0 gives the context; 1.x identifies precursors, 2.x the loss-of-control event, and 3.x conditional consequences. R identifies a possible recovery outcome. These numbers locate scenario components; they are not STPA method steps or a measure of proximity to catastrophe. Both incident overlays are non-AI comparisons; neither establishes progression through the AI-related precursors.",
    "bowtie": "The centre is H1: grid instability exceeds available containment and interrupts regional supply. Prevention acts before this state; restoration and essential-service support can still prevent a public-health catastrophe. All right-hand transitions require additional conditions.",
    "losses": [
      {
        "id": "L1",
        "title": "Prolonged loss of essential electricity",
        "text": "People and organizations lose dependable power for care, water, temperature control, and other essential activity."
      },
      {
        "id": "L2",
        "title": "Excess illness and deaths",
        "text": "Affected populations suffer substantial avoidable illness and mortality when essential-service interruption exceeds their capacity to cope."
      }
    ],
    "hazards": [
      {
        "id": "H1",
        "title": "Instability escapes effective containment",
        "text": "The electricity system operates outside enforceable stability limits and cannot arrest a disturbance before regional supply is interrupted.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H2",
        "title": "Consequential dispatch exceeds the assured envelope",
        "text": "Correlated recommendations influence actual control without adequate independent checks against the current regional physical state.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H3",
        "title": "Essential-service recovery cannot bridge the outage",
        "text": "Restoration, backup power, or support arrives too late to sustain essential services through the interruption.",
        "losses": [
          "L1",
          "L2"
        ]
      }
    ],
    "controllers": [
      {
        "id": "C1",
        "title": "Planning and deployment authority",
        "responsibility": "Authorize model use, establish operating envelopes, and require independent contingency validation.",
        "feedback": "Joint-system studies, model changes, protection settings, and evidence of correlated failures.",
        "assumption": "Different model names do not establish independent data, objectives, or failure modes."
      },
      {
        "id": "C2",
        "title": "Grid operator and regional coordinator",
        "responsibility": "Authorize dispatch, keep reserves, coordinate neighboring systems, and initiate corrective action.",
        "feedback": "Current topology, flows, voltage, reserve availability, tool health, and confirmed execution.",
        "assumption": "An unalarmed display is not evidence of a secure physical system."
      },
      {
        "id": "C3",
        "title": "AI forecast and recommendation service",
        "responsibility": "Provide bounded recommendations, uncertainty, and versioned inputs within an approved operating role.",
        "feedback": "Measurements, authorization limits, and validation results.",
        "assumption": "A high average forecast score does not establish safe joint behavior during unusual conditions."
      },
      {
        "id": "C4",
        "title": "Grid actuation and protection systems",
        "responsibility": "Execute dispatch and protection actions within coordinated physical limits and report actual state.",
        "feedback": "Local electrical measurements, device status, and operator commands.",
        "assumption": "A device protecting itself can still interact unsafely with regional protection."
      },
      {
        "id": "C5",
        "title": "Restoration and essential-service operators",
        "responsibility": "Restore supply, activate tested backup, and coordinate essential loads and public-health support.",
        "feedback": "Energized-load verification, available power, fuel, communications, and unmet essential needs.",
        "assumption": "Restored bulk supply and restored service at a hospital or water facility are different observations."
      }
    ],
    "controlLoops": [
      {
        "id": "CA1",
        "controller": "C1",
        "process": "C3",
        "action": "Approve deployment / constrain or suspend recommendations",
        "feedback": "C3 supplies changes; independent studies report correlated behavior and coverage gaps.",
        "constraints": [
          "SC1"
        ]
      },
      {
        "id": "CA2",
        "controller": "C2",
        "process": "C4",
        "action": "Approve dispatch / reserve / emergency corrective action",
        "feedback": "C4 returns physical state and action confirmation through independently checked measurements.",
        "constraints": [
          "SC1",
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "CA3",
        "controller": "C1",
        "process": "C4",
        "action": "Approve coordinated protection settings and operating envelope",
        "feedback": "Joint studies and disturbance records show interactions across regional facilities.",
        "constraints": [
          "SC2"
        ]
      },
      {
        "id": "CA4",
        "controller": "C2",
        "process": "C5",
        "action": "Sequence restoration and prioritize essential load",
        "feedback": "C5 reports actual restoration, available support, and remaining unmet needs.",
        "constraints": [
          "SC4",
          "SC5"
        ]
      }
    ],
    "constraints": [
      {
        "id": "SC1",
        "title": "Independent dispatch limits",
        "text": "AI recommendations must influence dispatch only inside a physical envelope checked independently of their shared assumptions.",
        "hazards": [
          "H2"
        ],
        "owners": [
          "C1",
          "C2"
        ],
        "role": "Prevention",
        "nodes": [
          "S-01:1",
          "S-01:2"
        ],
        "test": "Can related models produce individually plausible commands that violate a regional limit when executed together?",
        "limit": "Shared inputs, missing external facilities, or objectives that use up reserve margins can undermine independent dispatch checks."
      },
      {
        "id": "SC2",
        "title": "Coordinated physical protection",
        "text": "Operating limits and protection actions must account for their joint effects across the affected network.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C1",
          "C2",
          "C4"
        ],
        "role": "Prevention",
        "nodes": [
          "S-01:2",
          "S-01:3"
        ],
        "test": "Do independent network simulations and staged drills contain the specified credible combinations of disturbances?",
        "limit": "Unmodeled neighboring systems, stale topology, conflicting relay behavior, or inadequate reserves can defeat coordinated protection."
      },
      {
        "id": "SC3",
        "title": "Trusted state and timely corrective action",
        "text": "Operators must know when situational awareness is impaired and act within the remaining intervention window.",
        "hazards": [
          "H1"
        ],
        "owners": [
          "C2",
          "C4"
        ],
        "role": "Prevention and response",
        "nodes": [
          "S-01:2",
          "S-01:3"
        ],
        "test": "Does loss or staleness of a monitoring tool trigger a verified fallback and timely corrective decision?",
        "limit": "Common telemetry failures, undetected backup failure, and coordination delay can prevent timely corrective action."
      },
      {
        "id": "SC4",
        "title": "Verified restoration capability",
        "text": "Restoration plans must reach essential loads under the actual outage conditions and verify sustained service before normal operation resumes.",
        "hazards": [
          "H3"
        ],
        "owners": [
          "C2",
          "C5"
        ],
        "role": "Recovery",
        "nodes": [
          "S-01:3",
          "S-01:4",
          "S-01:R"
        ],
        "test": "Can restoration work when a neighboring supply, telecommunications service, or usual recovery tool is unavailable?",
        "limit": "Shared regional dependencies, inaccessible equipment, and early restart can undermine restoration."
      },
      {
        "id": "SC5",
        "title": "Essential services outlast interruption",
        "text": "Backup and public-health support must cover essential needs until dependable service is restored.",
        "hazards": [
          "H3"
        ],
        "owners": [
          "C5"
        ],
        "role": "Recovery and loss mitigation",
        "nodes": [
          "S-01:4",
          "S-01:5",
          "S-01:R"
        ],
        "test": "Can care, water, and safe temperatures be sustained for the specified outage duration, including fuel delivery and staffing?",
        "limit": "Fuel, water, communications, and staff may depend on the same electricity system."
      }
    ],
    "nodes": [
      {
        "id": "S-01:1",
        "number": "1.1",
        "wing": "before",
        "role": "Enabling condition",
        "title": "Related models shape dispatch",
        "shortLabel": "Related models shape dispatch",
        "text": "Operators rely widely on related AI recommendations while keeping tight operating margins.",
        "requires": "Shared error modes, consequential authority, and insufficient independent margin.",
        "mechanism": "Delegation creates a potential common failure route; widespread AI use alone does not establish unsafe dispatch.",
        "constraints": [
          "SC1"
        ],
        "sources": [
          "MA"
        ],
        "scenarios": [
          "LS1"
        ],
        "type": "condition",
        "references": [
          "LS1"
        ]
      },
      {
        "id": "S-01:2",
        "number": "1.2",
        "wing": "before",
        "role": "Unsafe control action",
        "title": "A shared error reaches the grid",
        "shortLabel": "A shared error reaches the grid",
        "text": "Erroneous recommendations are accepted into consequential dispatch or control.",
        "requires": "An unusual condition, correlated error, and authorization outside the safe envelope.",
        "mechanism": "Independent physical checks must fail or be bypassed before recommendation error becomes a hazardous command.",
        "constraints": [
          "SC1",
          "SC2",
          "SC3"
        ],
        "sources": [
          "MA"
        ],
        "scenarios": [
          "LS1",
          "LS2"
        ],
        "type": "unsafe-action",
        "references": [
          "UCA1",
          "UCA2",
          "H2"
        ]
      },
      {
        "id": "S-01:3",
        "number": "2.1",
        "wing": "centre",
        "role": "Loss of control · H1",
        "title": "Instability defeats containment",
        "shortLabel": "Instability defeats containment",
        "text": "Limits, reserves, and protection fail to contain the disturbance, interrupting regional supply.",
        "requires": "A destabilizing disturbance and insufficient or counterproductive coordinated response.",
        "mechanism": "This is the control-loss threshold. A widespread outage need not continue into failed restoration or mortality.",
        "constraints": [
          "SC2",
          "SC3",
          "SC4"
        ],
        "sources": [
          "SW11",
          "NE03"
        ],
        "scenarios": [
          "LS2",
          "LS3"
        ],
        "type": "hazard",
        "references": [
          "H1"
        ]
      },
      {
        "id": "S-01:4",
        "number": "3.1",
        "wing": "after",
        "role": "Recovery failure scenario",
        "title": "Essential services outlast backup",
        "shortLabel": "Essential services outlast backup",
        "text": "The outage lasts longer than restoration and backup can sustain essential services.",
        "requires": "Sufficient outage duration, exposed essential loads, and unavailable substitutes.",
        "mechanism": "Cross-sector dependencies can defeat restoration and backup together; their independence must be tested.",
        "constraints": [
          "SC4",
          "SC5"
        ],
        "sources": [
          "STPA"
        ],
        "scenarios": [
          "LS4"
        ],
        "type": "scenario",
        "references": [
          "H3",
          "LS4"
        ]
      },
      {
        "id": "S-01:5",
        "number": "3.2",
        "wing": "after",
        "role": "Further loss · L2",
        "title": "Illness and deaths increase",
        "shortLabel": "Illness and deaths increase",
        "text": "Loss of care, water, or safe temperatures causes excess illness and deaths.",
        "requires": "Vulnerable people are exposed long enough, and effective support remains unavailable.",
        "mechanism": "Mortality requires a separate exposure and public-health analysis. Neither mapped incident provides an AI-related mortality estimate.",
        "constraints": [
          "SC5"
        ],
        "sources": [],
        "scenarios": [
          "LS4"
        ],
        "type": "loss",
        "references": [
          "L2"
        ]
      },
      {
        "id": "S-01:R",
        "number": "R",
        "wing": "recovery",
        "role": "Recovery",
        "title": "Supply and essential care restored",
        "shortLabel": "Supply and essential care restored",
        "text": "Restoration and support re-establish sustained service within the affected area.",
        "requires": "Available sources, safe switching, coordination, and verification at essential loads.",
        "mechanism": "Successful recovery may limit duration and further harm even after prevention has failed.",
        "constraints": [
          "SC4",
          "SC5"
        ],
        "sources": [
          "SW11"
        ],
        "scenarios": [],
        "type": "recovery",
        "references": []
      }
    ],
    "links": [
      {
        "id": "S-01:1-2",
        "from": "S-01:1",
        "to": "S-01:2",
        "label": "Related errors pass independent checks",
        "kind": "contribution",
        "constraints": [
          "SC1"
        ]
      },
      {
        "id": "S-01:2-3",
        "from": "S-01:2",
        "to": "S-01:3",
        "label": "Commands exceed coordinated protection",
        "kind": "contribution",
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "S-01:3-4",
        "from": "S-01:3",
        "to": "S-01:4",
        "label": "Restoration and backup cannot bridge the outage",
        "kind": "contribution",
        "constraints": [
          "SC4",
          "SC5"
        ]
      },
      {
        "id": "S-01:4-5",
        "from": "S-01:4",
        "to": "S-01:5",
        "label": "Exposure persists without effective support",
        "kind": "continuation",
        "constraints": [
          "SC5"
        ]
      },
      {
        "id": "S-01:3-R",
        "from": "S-01:3",
        "to": "S-01:R",
        "label": "Restoration succeeds and essential service is verified",
        "kind": "recovery",
        "constraints": [
          "SC4",
          "SC5"
        ]
      }
    ],
    "unsafeActions": [
      {
        "id": "UCA1",
        "type": "Unsafe action provided",
        "loop": "CA2",
        "controller": "C2",
        "action": "Authorizes dispatch based on a shared erroneous recommendation",
        "context": "The combined command violates the current regional safety envelope or consumes needed reserves.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "UCA2",
        "type": "Required action absent",
        "loop": "CA2",
        "controller": "C2",
        "action": "Does not initiate a required corrective action",
        "context": "A disturbance or loss of trustworthy state information requires action before regional stability is lost.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "UCA3",
        "type": "Wrong timing or order",
        "loop": "CA4",
        "controller": "C2",
        "action": "Restores loads before the supplying network can sustain them",
        "context": "The switching sequence or available generation cannot safely accept the planned load.",
        "hazards": [
          "H1",
          "H3"
        ],
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "UCA4",
        "type": "Wrong duration",
        "loop": "CA4",
        "controller": "C2",
        "action": "Ends emergency supply coordination too soon",
        "context": "Essential loads still lack dependable electricity or a viable backup handover.",
        "hazards": [
          "H3"
        ],
        "constraints": [
          "SC4",
          "SC5"
        ]
      }
    ],
    "scenarios": [
      {
        "id": "LS1",
        "title": "A shared model assumption becomes a shared physical command",
        "archetype": "Unsafe controller behavior / inadequate process model",
        "text": "Related models underrepresent a rare condition. The operator accepts mutually compatible-looking recommendations, while independent checks share the missing assumption or fail to consider joint execution.",
        "ucas": [
          "UCA1"
        ],
        "hazards": [
          "H2"
        ],
        "nodes": [
          "S-01:1",
          "S-01:2"
        ],
        "evidence": [
          "MA"
        ],
        "unknown": "The deployed models, common inputs, permitted authority, and actual correlation of consequential errors remain unspecified."
      },
      {
        "id": "LS2",
        "title": "The display and the physical grid diverge",
        "archetype": "Inadequate feedback / coordination",
        "text": "The operator loses a trustworthy picture of topology or reserve state. Missing or late cross-boundary information prevents the right corrective action before the intervention window closes.",
        "ucas": [
          "UCA2"
        ],
        "hazards": [
          "H1"
        ],
        "nodes": [
          "S-01:2",
          "S-01:3"
        ],
        "evidence": [
          "SW11",
          "NE03"
        ],
        "unknown": "The analysis has not established which measurements remain independent, when the loss of awareness becomes visible, or what action remains feasible."
      },
      {
        "id": "LS3",
        "title": "Protective devices interact unsafely",
        "archetype": "Control path / controlled-process response",
        "text": "A correctly commanded local action interacts with neighboring protection or power flows in an unanticipated way. Device-level success can coexist with regional containment failure.",
        "ucas": [],
        "hazards": [
          "H1"
        ],
        "nodes": [
          "S-01:3"
        ],
        "evidence": [
          "SW11"
        ],
        "unknown": "The physical response, protection timing, and modeled boundary of every relevant scheme still need to be established."
      },
      {
        "id": "LS4",
        "title": "Shared dependencies exhaust the recovery window",
        "archetype": "Timing / environmental assumptions",
        "text": "Restoration and backup rely on unavailable regional inputs. Premature reconnection or withdrawal of emergency support prolongs exposure; substantial health loss additionally requires vulnerable populations and inadequate substitutes.",
        "ucas": [
          "UCA3",
          "UCA4"
        ],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "S-01:4",
          "S-01:5"
        ],
        "evidence": [],
        "unknown": "The analysis has not established outage duration, essential-load coverage, backup endurance, public-health exposure, or counterfactual mortality."
      }
    ],
    "sources": [
      {
        "id": "STPA",
        "title": "Leveson & Thomas · STPA Handbook (2018)",
        "url": "https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf",
        "locator": "Chapters 2 and 6",
        "use": "This source supplies the method for analyzing control, feedback, unsafe actions, loss scenarios, and leading indicators."
      },
      {
        "id": "MA",
        "title": "Multi-Agent Risks from Advanced AI",
        "url": "https://arxiv.org/html/2502.14143v1",
        "locator": "Multi-agent coordination and correlated failure risks",
        "use": "This source provides research context for the proposed shared-model mechanism. It does not provide evidence of an AI blackout."
      },
      {
        "id": "SW11",
        "title": "FERC and NERC · September 2011 Southwest blackout",
        "url": "https://www.ferc.gov/sites/default/files/2020-05/04-27-2012-ferc-nerc-report.pdf",
        "locator": "Executive summary, printed pp. 1–9; restoration p. 3",
        "use": "This source provides a historical comparison for prevention, protection interactions, and recovery. No AI initiation is established."
      },
      {
        "id": "NE03",
        "title": "US–Canada Task Force · August 2003 blackout",
        "url": "https://www.energy.gov/oe/articles/blackout-2003-final-report-august-14-2003-blackout-united-states-and-canada-causes-and",
        "locator": "Chapter 3, printed pp. 18–19; Chapter 9, pp. 136–137",
        "use": "This source provides a historical comparison for failed situational awareness and backup monitoring. No AI initiation is established."
      }
    ],
    "additionalEvidence": {
      "sources": [],
      "passages": [
        {
          "id": "SW11-restoration",
          "source": "SW11",
          "title": "Restoration worked with available power",
          "locator": "Executive summary, printed p. 3; PDF page 5",
          "kind": "summary",
          "text": "FERC/NERC reports restoration of all affected load or customers in roughly 6–12 hours. Available power from the entities or their neighbors meant black-start plans were not used; some communication and coordination delays occurred.",
          "scope": "This passage describes historical recovery from a non-AI event. Restoration of load does not establish uninterrupted essential services, recovery without neighboring supply, or an absence of health harm."
        }
      ]
    },
    "assessments": [
      {
        "id": "SW-2011-S-01",
        "pathway": "S-01",
        "pathwayVersion": "1.0",
        "incident": "SW-2011",
        "status": "provisional",
        "relation": "mechanism-comparison",
        "targets": [
          {
            "id": "S-01:3-4",
            "kind": "edge",
            "state": "component",
            "label": "Grid safeguards can fail before restoration takes effect"
          }
        ],
        "scope": "This case provides a comparison for physical grid control and recovery. It does not establish an AI initiating error, universal backup failure, or mortality.",
        "evidence": [
          "SW-2011-account",
          "SW11-restoration"
        ],
        "trace": [
          {
            "text": "One line tripped in a system not securely prepared for that contingency.",
            "evidence": [
              "SW-2011-account"
            ]
          },
          {
            "text": "Overloads and protective actions spread the disturbance.",
            "evidence": [
              "SW-2011-account"
            ]
          },
          {
            "text": "Utilities restored load over hours using available neighboring power.",
            "evidence": [
              "SW-2011-account"
            ]
          }
        ],
        "barriers": [
          {
            "id": "regional-contingency-limits",
            "title": "Regional contingency planning",
            "outcome": "Failed in this event",
            "role": "prevention",
            "target": "S-01:3-4",
            "action": "Use planning and operating limits to contain credible disturbances.",
            "efficacy": "FERC/NERC found planning and situational-awareness deficiencies.",
            "durability": "The safety boundary must include relevant neighboring facilities and protection interactions.",
            "failure": "A local model omits a regional interaction and authorizes an insecure state.",
            "evidence": [
              "SW-2011-account"
            ],
            "view": {
              "input": "Grid disturbance",
              "control": "Contingency limits",
              "result": "Cascade not contained",
              "dependency": "Regional model coverage",
              "failureRoute": "A local model omits a regional interaction and authorizes an insecure state.",
              "failureObserved": true,
              "failureLabel": "Reported failure",
              "observation": 1
            },
            "dependencies": [
              {
                "label": "Regional model coverage",
                "assessment": "The safety boundary must include relevant neighboring facilities and protection interactions.",
                "basis": "Analytical dependency assessment",
                "evidence": [
                  "SW-2011-account"
                ]
              }
            ],
            "reinforcement": {
              "label": "Proposed improvement",
              "proposal": "Review joint protection and operating limits independently.",
              "test": "Test the modeled disturbance across the complete affected network.",
              "basis": "Analytical proposal; effectiveness not established",
              "evidence": [
                "SW-2011-account"
              ]
            }
          },
          {
            "id": "available-power-restoration",
            "title": "Restoration with available power",
            "outcome": "Reported recovery over hours",
            "role": "recovery",
            "target": "S-01:3-4",
            "action": "Re-energize the affected system using available internal or neighboring supply.",
            "efficacy": "The report records completed load restoration; see the linked recovery passage.",
            "durability": "This recovery depended on available power and coordination; it did not test a region-wide loss of all starting sources.",
            "failure": "The same disruption removes recovery sources, communications, or safe switching capability.",
            "evidence": [
              "SW11-restoration"
            ],
            "view": {
              "input": "Supply interrupted",
              "control": "Restoration operation",
              "result": "Load restored",
              "dependency": "Available recovery power",
              "failureRoute": "The same disruption removes recovery sources, communications, or safe switching capability.",
              "failureObserved": false,
              "failureLabel": "Possible failure",
              "observation": 1
            },
            "dependencies": [
              {
                "label": "Available recovery power",
                "assessment": "This recovery depended on available power and coordination; it did not test a region-wide loss of all starting sources.",
                "basis": "Analytical dependency assessment",
                "evidence": [
                  "SW11-restoration"
                ]
              }
            ],
            "reinforcement": {
              "label": "Proposed improvement",
              "proposal": "Exercise restoration when the usual neighboring source is absent.",
              "test": "Verify essential-load service and restoration time in that adverse scenario.",
              "basis": "Analytical proposal; effectiveness not established",
              "evidence": [
                "SW11-restoration"
              ]
            }
          }
        ],
        "reach": {
          "local": "A line loss triggered cascading outages. FERC/NERC identified inadequate planning and situational awareness; recovery was generally effective but took hours and essential services were disrupted.",
          "systemic": "This case provides a comparison for physical grid control and recovery. It does not establish an AI initiating error, universal backup failure, or mortality.",
          "evidence": [
            "SW-2011-account"
          ]
        }
      },
      {
        "id": "NE-2003-S-01",
        "pathway": "S-01",
        "pathwayVersion": "1.0",
        "incident": "NE-2003",
        "status": "provisional",
        "relation": "mechanism-comparison",
        "targets": [
          {
            "id": "S-01:3",
            "kind": "node",
            "state": "component",
            "label": "Operational safeguards failed to contain a grid disturbance"
          }
        ],
        "scope": "This case provides a comparison for grid limits, monitoring, and containment. It does not attribute the initiating conditions to AI.",
        "evidence": [
          "NE-2003-account"
        ],
        "trace": [
          {
            "text": "Planning and operating criteria did not adequately reflect vulnerabilities.",
            "evidence": [
              "NE-2003-account"
            ]
          },
          {
            "text": "Monitoring, backup tools, and communication were inadequate.",
            "evidence": [
              "NE-2003-account"
            ]
          },
          {
            "text": "The findings connect these weaknesses to the blackout.",
            "evidence": [
              "NE-2003-account"
            ]
          }
        ],
        "barriers": [
          {
            "id": "operator-state-awareness",
            "title": "Monitoring and backup awareness",
            "outcome": "Failed in this event",
            "role": "prevention",
            "target": "S-01:3",
            "action": "Provide operators with a reliable picture of changing grid conditions and tool health.",
            "efficacy": "The task force identified ineffective monitoring, backup tools, and regional diagnostic support.",
            "durability": "A backup is useful only if its failure modes and state information are sufficiently independent.",
            "failure": "Operators continue without a reliable view of the hazardous state.",
            "evidence": [
              "NE-2003-account"
            ],
            "view": {
              "input": "Developing grid instability",
              "control": "Monitoring and fallback",
              "result": "Situation not controlled",
              "dependency": "Independent feedback",
              "failureRoute": "Operators continue without a reliable view of the hazardous state.",
              "failureObserved": true,
              "failureLabel": "Reported failure",
              "observation": 1
            },
            "dependencies": [
              {
                "label": "Independent feedback",
                "assessment": "A backup is useful only if its failure modes and state information are sufficiently independent.",
                "basis": "Analytical dependency assessment",
                "evidence": [
                  "NE-2003-account"
                ]
              }
            ],
            "reinforcement": {
              "label": "Proposed improvement",
              "proposal": "Provide explicit tool-health warnings and independent fallback measurements.",
              "test": "Disable the primary monitoring path in a drill and verify timely operator recovery.",
              "basis": "Analytical proposal; effectiveness not established",
              "evidence": [
                "NE-2003-account"
              ]
            }
          }
        ],
        "reach": {
          "local": "The task force identified inadequate voltage criteria, ineffective monitoring and backup tools, vegetation management failures, and deficient regional diagnostic support.",
          "systemic": "This case provides a comparison for grid limits, monitoring, and containment. It does not attribute the initiating conditions to AI.",
          "evidence": [
            "NE-2003-account"
          ]
        }
      }
    ],
    "presentation": {
      "conditions": {
        "S-01:2": "Only if correlated error reaches actual control",
        "S-01:3": "If physical containment is inadequate",
        "S-01:4": "If outage duration exceeds recovery and backup",
        "S-01:5": "Only with sustained harmful exposure",
        "S-01:R": "If restoration and support succeed"
      },
      "overlays": {
        "SW-2011": {
          "title": "Southwest blackout · 2011",
          "kind": "Non-AI comparison",
          "relation": "mechanism",
          "target": "S-01:3-4",
          "anchor": "S-01:3",
          "observed": "A disturbance cascaded across the regional grid. Operators restored supply using power that remained available.",
          "notEstablished": "The event does not establish an AI initiating error or show that every backup failed. It does not establish excess deaths from the outage.",
          "limit": "The blackout provides a comparison for physical containment and restoration. It does not establish an AI initiating event or the hypothetical mortality branch.",
          "barriers": {
            "regional-contingency-limits": {
              "title": "Contingency limits",
              "result": "Regional containment failed.",
              "condition": "failed",
              "conditionBasis": "The investigation found that planning and situational awareness did not keep the system secure.",
              "limitType": "safeguard",
              "strongerAI": "Faster and more correlated automated dispatch could shrink intervention time; more capable forecasting might also help. Reassess joint physical margins.",
              "reinforcement": {
                "proposal": "Test correlated commands against independent regional constraints.",
                "test": "Demonstrate safe joint execution with realistic external contingencies.",
                "status": "proposed"
              }
            },
            "available-power-restoration": {
              "title": "Restoration",
              "result": "Supply returned over hours.",
              "condition": "intact",
              "conditionBasis": "The observed restoration reached affected load, using available recovery power. This is a bounded result.",
              "limitType": "mixed",
              "strongerAI": "Broader correlated disruption could remove the neighboring supply this recovery used. Better restoration planning could improve the response.",
              "reinforcement": {
                "proposal": "Validate recovery when usual external power is unavailable.",
                "test": "Restore representative essential loads with a missing recovery source and confirm duration.",
                "status": "proposed"
              }
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "S-01:R",
            "question": "Would recovery still work if neighboring grids also lost power?",
            "basis": "Restoration used supplies that remained energized; affected entities did not need black starts.",
            "unresolved": "This recovery did not test what would happen after a wider shared failure, including one involving related AI systems. Testing that possibility would require showing that independent restoration resources can still supply affected loads.",
            "sources": [
              "SW11"
            ]
          }
        },
        "NE-2003": {
          "title": "Northeast blackout · 2003",
          "kind": "Non-AI comparison",
          "relation": "mechanism",
          "target": "S-01:3",
          "anchor": "S-01:3",
          "observed": "Monitoring and operational safeguards did not contain a regional disturbance.",
          "notEstablished": "AI did not cause this event. It does not establish the hypothetical route from shared AI models to a public-health catastrophe.",
          "limit": "This historical case concerns the physical grid and its human control structure.",
          "barriers": {
            "operator-state-awareness": {
              "title": "Monitoring and fallback",
              "result": "Awareness failed when it was needed.",
              "condition": "failed",
              "conditionBasis": "The task force identified monitoring and backup-tool failures in the incident.",
              "limitType": "safeguard",
              "strongerAI": "Faster automated actions increase the cost of stale feedback; more capable diagnosis may help only if its observations and fallback remain independent.",
              "reinforcement": {
                "proposal": "Use explicit loss-of-awareness triggers and independent fallback.",
                "test": "Demonstrate timely corrective action after a monitoring outage.",
                "status": "proposed"
              }
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "S-01:2",
            "question": "Could related AI dispatch tools turn a shared blind spot into a common error?",
            "basis": "The investigation identified failures of monitoring, situational awareness, and coordination.",
            "unresolved": "AI did not cause this event. Testing this possibility would require showing that related models share a consequential error and that independent dispatch checks fail to stop it.",
            "sources": [
              "NE03"
            ]
          }
        }
      },
      "fidelity": "Non-AI incidents inform selected control mechanisms. Observed recovery is displayed alongside failure, and the public-health continuation remains conditional.",
      "brittleness": "Observed condition describes what the barrier did in this setting. Brittleness asks which changed dependency, capability, or operating condition would make it fail. A strengthened barrier can still be brittle; a single success does not establish robustness.",
      "context": [
        {
          "title": "System setting",
          "text": "The hypothetical scenario concerns a regional electricity system using related AI forecasts or control recommendations. It includes model procurement, dispatch authorization, physical protection, regional coordination, and restoration. Essential services enter the analysis through their dependence on electricity and backup capacity.",
          "sources": [],
          "targets": [
            {
              "node": "S-01:1",
              "label": "Dispatch",
              "text": "A regional grid uses related AI forecasts or control recommendations."
            },
            {
              "node": "S-01:3",
              "label": "Containment",
              "text": "Physical protection and regional coordination surround dispatch decisions."
            },
            {
              "node": "S-01:4",
              "label": "Essential services",
              "text": "Essential services depend on electricity and backup capacity."
            },
            {
              "node": "S-01:R",
              "label": "Restoration",
              "text": "Grid restoration and essential-service operators are included in the system."
            }
          ]
        }
      ],
      "cloud": {
        "origin": "scenario-setting",
        "conditions": [
          "Interconnected grids",
          "Related AI models",
          "Essential-service dependence"
        ],
        "actors": [
          {
            "controller": "C1",
            "label": "Planning authorities",
            "role": "choose & deploy models"
          },
          {
            "controller": "C2",
            "label": "Grid operators",
            "role": "authorize dispatch"
          },
          {
            "controller": "C4",
            "label": "Protection systems",
            "role": "enforce physical limits"
          },
          {
            "controller": "C5",
            "label": "Restoration teams",
            "role": "restore supply & services"
          }
        ],
        "summary": "Grid interdependence constrains what operators can isolate and which supplies remain available for restoration. Related models may introduce shared errors."
      }
    },
    "controlEvidence": {
      "title": "What kept a blackout from lasting longer?",
      "kind": "Non-AI comparison",
      "source": "SW11",
      "constraint": "SC4",
      "text": "Inspect the available-power restoration barrier and its dependencies.",
      "limit": "An effective response in one physical setting does not demonstrate robustness to correlated AI-driven disturbance.",
      "questions": [
        {
          "title": "What worked?",
          "text": "Separate the failed prevention from the response that restored supply."
        },
        {
          "title": "What did it depend on?",
          "text": "Identify power sources, coordination, and essential-load access."
        },
        {
          "title": "Would stronger AI change it?",
          "text": "Test correlated regional disruption as well as possible forecasting and restoration benefits."
        }
      ]
    }
  },
  "F-01": {
    "version": "1.3",
    "pathway": "F-01",
    "displayId": "F-1",
    "title": "Amplification, failed response, and mass violence",
    "status": "STPA worked example · provisional analysis",
    "summary": "When does harmful amplification escape control, and can intervention still protect people?",
    "roleTypes": [
      {
        "id": "condition",
        "label": "Enabling condition",
        "definition": "A circumstance that makes a route possible; it does not by itself establish a hazard."
      },
      {
        "id": "unsafe-action",
        "label": "Unsafe control action",
        "definition": "An action or omission linked to its controller, hazardous context, and affected constraint."
      },
      {
        "id": "scenario",
        "label": "Loss scenario",
        "definition": "An explanation of how control can become inadequate, including feedback and execution problems."
      },
      {
        "id": "hazard",
        "label": "Hazardous state",
        "definition": "A system state that can produce a loss together with relevant environmental conditions."
      },
      {
        "id": "amplifier",
        "label": "Optional amplifier",
        "definition": "A factor that could strengthen a route but is not required in every version."
      },
      {
        "id": "loss",
        "label": "Loss",
        "definition": "An outcome stakeholders seek to prevent, kept distinct from its contributing causes."
      },
      {
        "id": "recovery",
        "label": "Recovery",
        "definition": "A response re-establishes enforceable safety constraints within a specified boundary; success requires verification."
      }
    ],
    "limitingConditions": [
      {
        "kind": "Safeguard",
        "example": "Independently enforced review, access bounds, or effective interruption.",
        "question": "Which specified mechanism blocks the transition, and what demonstrates that it works?"
      },
      {
        "kind": "Capability limit",
        "example": "The system cannot perform the required research, deception, or physical task.",
        "question": "Would increased capability remove this limit?"
      },
      {
        "kind": "Opportunity limit",
        "example": "The necessary access, resources, or institutional delegation is unavailable.",
        "question": "Can the system or another actor acquire what is missing?"
      },
      {
        "kind": "Contingency",
        "example": "Activity ends for a reason that does not establish an effective safeguard.",
        "question": "What actually ended the episode, and would that circumstance recur?"
      }
    ],
    "schema": "Selected losses, hazards, control relationships, contextual unsafe actions, and loss scenarios are traced to constraints. Numbered milestones summarize this analysis; they are not STPA steps. Incident evidence and hypothetical continuations remain distinct.",
    "limits": "This is a bounded first-pass analysis, not an exhaustive STPA or a completed CAST investigation. Selected actions illustrate the four unsafe-action categories; domain experts must examine every relevant action and context. No probabilities, barrier independence, or comparative distance to catastrophe are inferred. Barrier condition describes the stated observation, not a prediction about a more capable AI.",
    "scope": "The hypothetical scenario concerns a platform operating in a conflict-affected setting. It includes ranking, content enforcement, platform governance, local warning partners, and the interface to civilian protection. Human perpetrators act outside platform control, and the existing conflict has causes beyond the platform.",
    "purpose": "Prevent platform activity from contributing to threats, targeting, mass violence, or displacement while protecting legitimate expression and access to safety information.",
    "boundary": "The roles below are analytical functions, not a verified governance map for Meta or any particular country. A platform can control its distribution system; it cannot by itself guarantee physical protection or resolve an armed conflict.",
    "numbering": "0 gives the context; 1.x identifies precursors, 2.x the loss-of-control event, and 3.x conditional consequences. R identifies a possible recovery outcome. These numbers locate scenario components; they are not STPA method steps or a measure of proximity to catastrophe. Historical investigations support an attributed amplification-and-response component, not an experimentally isolated full causal chain.",
    "bowtie": "The centre is H1: harmful dissemination persists beyond a timely, context-sensitive response. Subsequent mobilization and mass violence require human intent, coercive capacity, and failed physical protection. Rights-respecting intervention and civilian protection can still limit further harm.",
    "losses": [
      {
        "id": "L1",
        "title": "Threats, targeting, and serious rights harms",
        "text": "People suffer targeted threats, intimidation, and loss of safe participation in public life."
      },
      {
        "id": "L2",
        "title": "Mass violence and displacement",
        "text": "A conflict-affected population suffers organized physical violence, deaths, and forced displacement."
      },
      {
        "id": "L3",
        "title": "Loss of legitimate expression and safety information",
        "text": "Overbroad intervention silences threatened communities, suppresses evidence, or obstructs information people need for safety."
      }
    ],
    "hazards": [
      {
        "id": "H1",
        "title": "Harmful dissemination escapes timely control",
        "text": "The platform persistently distributes content that can enable targeting or violence, without an effective response within the relevant protection window.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H2",
        "title": "Engagement incentives amplify unsafe exposure",
        "text": "Distribution decisions amplify dangerous content or turn attempted countermeasures into additional exposure.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H3",
        "title": "Response is ineffective or overbroad",
        "text": "The platform or crisis response fails to reach at-risk people or restricts legitimate expression and safety information without adequate justification and remedy.",
        "losses": [
          "L1",
          "L2",
          "L3"
        ]
      }
    ],
    "controllers": [
      {
        "id": "C1",
        "title": "Platform governance and product authority",
        "responsibility": "Set distribution objectives, resource local safeguards, authorize crisis measures, and review rights impacts.",
        "feedback": "Exposure measures, local warnings, enforcement errors, appeals, and evidence of offline threats.",
        "assumption": "Engagement, content removal, and absence of user reports are incomplete measures of safety."
      },
      {
        "id": "C2",
        "title": "Ranking and distribution service",
        "responsibility": "Distribute content within enforced safety and rights constraints; expose audit records of recommendations.",
        "feedback": "Content signals, policy limits, context, and verified changes in exposure.",
        "assumption": "Responses to a harmful post can increase its ranking unless their meaning is accounted for."
      },
      {
        "id": "C3",
        "title": "Contextual moderation and response",
        "responsibility": "Triage credible threats, apply proportionate content measures, preserve evidence, and resolve appeals.",
        "feedback": "Local-language reports, threat context, enforcement receipts, repeated uploads, and reviewer disagreement.",
        "assumption": "Classification accuracy alone does not establish timely interruption of harmful exposure."
      },
      {
        "id": "C4",
        "title": "Local warning and crisis coordination",
        "responsibility": "Route context-rich warnings to accountable responders and coordinate protection requests with affected communities.",
        "feedback": "Acknowledgments, action taken, safety needs, and reports of ongoing threats.",
        "assumption": "A trusted reporting channel is useful only if a responder can and does act."
      },
      {
        "id": "C5",
        "title": "Civilian protection and emergency services",
        "responsibility": "Provide lawful, impartial physical protection and emergency support when credible threats reach them.",
        "feedback": "Threat locations, affected people, access restrictions, and independently checked safety outcomes.",
        "assumption": "Authorities may be unable, unwilling, or implicated in violence; a referral is not proof of protection."
      }
    ],
    "controlLoops": [
      {
        "id": "CA1",
        "controller": "C1",
        "process": "C2",
        "action": "Set ranking objectives / constrain crisis distribution",
        "feedback": "Exposure audits, risk findings, and protected-community feedback return to governance.",
        "constraints": [
          "SC1",
          "SC2",
          "SC5"
        ]
      },
      {
        "id": "CA2",
        "controller": "C3",
        "process": "C2",
        "action": "Remove, reduce, or restore distribution with review",
        "feedback": "Actual exposure, reuploads, enforcement receipts, and appeals show whether the action worked.",
        "constraints": [
          "SC1",
          "SC2",
          "SC5"
        ]
      },
      {
        "id": "CA3",
        "controller": "C4",
        "process": "C1",
        "action": "Escalate a credible contextual warning",
        "feedback": "Governance reports ownership, timing, and the action taken or reasons for inaction.",
        "constraints": [
          "SC3"
        ]
      },
      {
        "id": "CA4",
        "controller": "C4",
        "process": "C5",
        "action": "Request and coordinate civilian protection",
        "feedback": "Independent checks establish whether people receive usable protection or support.",
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "CA5",
        "controller": "C1",
        "process": "C3",
        "action": "Provide local response capacity and escalation authority",
        "feedback": "Queue delays, language coverage, appeals, and threat-response outcomes reveal gaps.",
        "constraints": [
          "SC2",
          "SC3",
          "SC5"
        ]
      }
    ],
    "constraints": [
      {
        "id": "SC1",
        "title": "Measure and constrain harmful exposure",
        "text": "Distribution and counter-speech interventions must be assessed by their effect on harmful exposure, not engagement alone.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C1",
          "C2",
          "C3"
        ],
        "role": "Prevention",
        "nodes": [
          "F-01:1",
          "F-01:2"
        ],
        "test": "Does an intervention reduce exposure to the dangerous original content, including recommendation effects and reshares?",
        "limit": "The attempted safeguard may feed the same engagement objective it is meant to constrain."
      },
      {
        "id": "SC2",
        "title": "Act within the threat window",
        "text": "Credible, context-specific threats must receive a proportionate response before preventable exposure or targeting continues beyond the useful intervention window.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C1",
          "C3"
        ],
        "role": "Prevention and response",
        "nodes": [
          "F-01:2",
          "F-01:3",
          "F-01:R"
        ],
        "test": "How long does a locally intelligible threat take to reach review, decision, and verified distribution change?",
        "limit": "Insufficient language coverage, ambiguous context, repeat uploads, and slow enforcement can defeat timely response."
      },
      {
        "id": "SC3",
        "title": "Connect warnings to accountable decisions",
        "text": "Local warnings must reach an empowered owner who records the response, timing, and unresolved uncertainty.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C1",
          "C4"
        ],
        "role": "Response",
        "nodes": [
          "F-01:3",
          "F-01:R"
        ],
        "test": "Can a local partner verify who acted on a warning and what exposure or protection changed?",
        "limit": "Reports can be acknowledged without changing distribution or mobilizing help."
      },
      {
        "id": "SC4",
        "title": "Verify physical protection separately",
        "text": "When online threats imply imminent physical danger, protection must be assessed independently of content enforcement and reach the people at risk.",
        "hazards": [
          "H1",
          "H3"
        ],
        "owners": [
          "C4",
          "C5"
        ],
        "role": "Loss mitigation",
        "nodes": [
          "F-01:4",
          "F-01:5",
          "F-01:R"
        ],
        "test": "Do people receive safe, impartial, and accessible protection before perpetrators can act?",
        "limit": "Protection may be limited by state involvement, coercive capacity, inaccessible locations, and mistrust of responders."
      },
      {
        "id": "SC5",
        "title": "Preserve rights during intervention",
        "text": "Crisis measures must be proportionate, reviewable, and time-bounded, with access to legitimate safety information and retained evidence.",
        "hazards": [
          "H3"
        ],
        "owners": [
          "C1",
          "C3"
        ],
        "role": "Prevention and recovery",
        "nodes": [
          "F-01:3",
          "F-01:R"
        ],
        "test": "Can threatened communities still communicate safely, contest mistakes, and preserve evidence while harmful exposure is reduced?",
        "limit": "Indiscriminate shutdowns, politicized enforcement, and premature or indefinitely prolonged restrictions can undermine proportionate crisis measures."
      }
    ],
    "nodes": [
      {
        "id": "F-01:1",
        "number": "1.1",
        "wing": "before",
        "role": "Enabling condition",
        "title": "Engagement shapes exposure",
        "shortLabel": "Engagement shapes exposure",
        "text": "A population relies on a platform whose distribution systems optimize engagement.",
        "requires": "Material platform reach, reliance, and incentives that can reward dangerous content.",
        "mechanism": "Optimization affects what people see; it does not make every exposure persuasive or violent.",
        "constraints": [
          "SC1"
        ],
        "sources": [
          "ERF"
        ],
        "scenarios": [
          "LS1"
        ],
        "type": "condition",
        "references": [
          "LS1"
        ]
      },
      {
        "id": "F-01:2",
        "number": "1.2",
        "wing": "before",
        "role": "Amplification mechanism",
        "title": "Inflammatory content is amplified",
        "shortLabel": "Inflammatory content is amplified",
        "text": "Political or armed actors supply inflammatory content that gains repeated or wider exposure.",
        "requires": "Harmful content, audience access, and ranking effects beyond the original publication.",
        "mechanism": "The proposed mechanism concerns changed exposure. Its size must be measured separately from content volume or engagement.",
        "constraints": [
          "SC1",
          "SC2"
        ],
        "sources": [
          "MYA",
          "ETA"
        ],
        "scenarios": [
          "LS1"
        ],
        "type": "scenario",
        "references": [
          "H2",
          "LS1"
        ]
      },
      {
        "id": "F-01:3",
        "number": "2.1",
        "wing": "centre",
        "role": "Loss of control · H1",
        "title": "Warnings fail to interrupt spread",
        "shortLabel": "Warnings fail to interrupt spread",
        "text": "Contextual moderation and credible warnings do not produce a timely effective response.",
        "requires": "Ongoing dangerous dissemination and an inadequate or late control response.",
        "mechanism": "The loss-of-control threshold is failed timely control of dissemination, not proof that a platform caused subsequent violence.",
        "constraints": [
          "SC2",
          "SC3",
          "SC5"
        ],
        "sources": [
          "MYA",
          "ETA"
        ],
        "scenarios": [
          "LS2",
          "LS3"
        ],
        "type": "hazard",
        "references": [
          "H1",
          "UCA2",
          "UCA3"
        ]
      },
      {
        "id": "F-01:4",
        "number": "3.1",
        "wing": "after",
        "role": "Conditional mobilization",
        "title": "Exposure assists targeting",
        "shortLabel": "Exposure assists targeting",
        "text": "In an existing conflict, increased exposure helps dehumanization, targeting, or mobilization.",
        "requires": "Human actors intend harm, can act, and use the information in ways that affect behavior.",
        "mechanism": "Exposure can be a contributing cause alongside organization, persecution, and state violence. Its independent contribution remains uncertain.",
        "constraints": [
          "SC4"
        ],
        "sources": [
          "ERF",
          "MYA",
          "ETA"
        ],
        "scenarios": [
          "LS4"
        ],
        "type": "scenario",
        "references": [
          "LS4"
        ]
      },
      {
        "id": "F-01:5",
        "number": "3.2",
        "wing": "after",
        "role": "Further loss · L2",
        "title": "Mass violence and displacement",
        "shortLabel": "Mass violence and displacement",
        "text": "Physical protection also fails and organized violence causes deaths and displacement.",
        "requires": "Perpetrators have coercive capacity and can reach people who lack effective protection.",
        "mechanism": "A content-control failure alone does not establish this outcome or an existential catastrophe.",
        "constraints": [
          "SC4"
        ],
        "sources": [
          "MYA",
          "ETA"
        ],
        "scenarios": [
          "LS4"
        ],
        "type": "loss",
        "references": [
          "L2"
        ]
      },
      {
        "id": "F-01:R",
        "number": "R",
        "wing": "recovery",
        "role": "Recovery",
        "title": "Exposure reduced, people protected",
        "shortLabel": "Exposure reduced, people protected",
        "text": "Effective distribution controls and protection limit further harm while preserving legitimate expression.",
        "requires": "Verified exposure reduction, usable protection where needed, review, and protection against recurrence.",
        "mechanism": "Content removal and aggregate moderation counts are not sufficient evidence that people are safe.",
        "constraints": [
          "SC2",
          "SC3",
          "SC4",
          "SC5"
        ],
        "sources": [
          "STPA"
        ],
        "scenarios": [],
        "type": "recovery",
        "references": []
      }
    ],
    "links": [
      {
        "id": "F-01:1-2",
        "from": "F-01:1",
        "to": "F-01:2",
        "label": "Ranking increases dangerous exposure",
        "kind": "contribution",
        "constraints": [
          "SC1"
        ]
      },
      {
        "id": "F-01:2-3",
        "from": "F-01:2",
        "to": "F-01:3",
        "label": "Timely contextual response is ineffective",
        "kind": "contribution",
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "F-01:3-4",
        "from": "F-01:3",
        "to": "F-01:4",
        "label": "Actors use exposure to organize or target",
        "kind": "contribution",
        "constraints": [
          "SC2",
          "SC4"
        ]
      },
      {
        "id": "F-01:4-5",
        "from": "F-01:4",
        "to": "F-01:5",
        "label": "Coercive capacity and failed physical protection",
        "kind": "continuation",
        "constraints": [
          "SC4"
        ]
      },
      {
        "id": "F-01:3-R",
        "from": "F-01:3",
        "to": "F-01:R",
        "label": "Exposure falls and effective protection reaches people",
        "kind": "recovery",
        "constraints": [
          "SC2",
          "SC3",
          "SC4",
          "SC5"
        ]
      }
    ],
    "unsafeActions": [
      {
        "id": "UCA1",
        "type": "Unsafe action provided",
        "loop": "CA1",
        "controller": "C1",
        "action": "Authorizes engagement objectives without adequate crisis constraints",
        "context": "The ranking feedback rewards dangerous exposure, including responses intended to oppose it.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC1"
        ]
      },
      {
        "id": "UCA2",
        "type": "Required action absent",
        "loop": "CA2",
        "controller": "C3",
        "action": "Does not apply a required proportionate distribution restriction",
        "context": "A credible contextual threat remains in distribution and the useful protection window is open.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC2",
          "SC3"
        ]
      },
      {
        "id": "UCA3",
        "type": "Wrong timing or order",
        "loop": "CA2",
        "controller": "C3",
        "action": "Applies the restriction after the useful intervention window",
        "context": "The delay leaves avoidable exposure or targeting active while the threat can be carried out.",
        "hazards": [
          "H1",
          "H3"
        ],
        "constraints": [
          "SC2"
        ]
      },
      {
        "id": "UCA4",
        "type": "Wrong duration",
        "loop": "CA1",
        "controller": "C1",
        "action": "Maintains broad crisis restrictions after their justification ends",
        "context": "Legitimate speech or safety information remains restricted without review or adequate remedy.",
        "hazards": [
          "H3"
        ],
        "constraints": [
          "SC5"
        ]
      }
    ],
    "scenarios": [
      {
        "id": "LS1",
        "title": "A countermeasure feeds the amplification signal",
        "archetype": "Unsafe objective / controlled-process interaction",
        "text": "A response meant to challenge dangerous material is treated as engagement with it. The distribution objective rewards the response and undermines the attempted constraint.",
        "ucas": [
          "UCA1"
        ],
        "hazards": [
          "H2"
        ],
        "nodes": [
          "F-01:1",
          "F-01:2"
        ],
        "evidence": [
          "MYA"
        ],
        "unknown": "The analysis has not established the change in exposure or the contribution of ranking. It has not established whether redesigned feedback would reverse that change."
      },
      {
        "id": "LS2",
        "title": "A report fails to become timely action",
        "archetype": "Feedback / authority and coordination",
        "text": "Language or context is lost, queues delay the decision, or the receiving team lacks authority. A warning may exist without a sufficiently fast change in distribution.",
        "ucas": [
          "UCA2",
          "UCA3"
        ],
        "hazards": [
          "H1"
        ],
        "nodes": [
          "F-01:3"
        ],
        "evidence": [
          "ETA"
        ],
        "unknown": "The analysis has not established report receipts, review decisions, enforcement timing, continued exposure, or the available intervention window."
      },
      {
        "id": "LS3",
        "title": "An appropriate restriction fails or overshoots",
        "archetype": "Control path / unintended control effects",
        "text": "Enforcement may miss a distribution surface or new uploads even after a correct decision. Conversely, overbroad measures can suppress legitimate communication and evidence; their continuation needs review.",
        "ucas": [
          "UCA4"
        ],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "F-01:3",
          "F-01:R"
        ],
        "evidence": [],
        "unknown": "Actual delivery of the control, missed exposure, rights impacts, and the conditions for lifting restrictions still need to be established."
      },
      {
        "id": "LS4",
        "title": "Online exposure contributes to organized physical harm",
        "archetype": "Environmental conditions / further loss scenario",
        "text": "Human actors may turn exposure into targeting or mobilization amid pre-existing conflict. Serious collective harm additionally requires coercive capacity and ineffective protection. The platform contribution must not be substituted for these causes.",
        "ucas": [],
        "hazards": [
          "H1",
          "H3"
        ],
        "nodes": [
          "F-01:4",
          "F-01:5"
        ],
        "evidence": [
          "ERF",
          "MYA",
          "ETA"
        ],
        "unknown": "The analysis has not established counterfactual exposure, perpetrators’ decisions, the effect of physical protection, or the relative contribution of independent causes."
      }
    ],
    "sources": [
      {
        "id": "STPA",
        "title": "Leveson & Thomas · STPA Handbook (2018)",
        "url": "https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf",
        "locator": "Chapters 2 and 5–6",
        "use": "This source supplies the method used for control, feedback, social analysis, and indicators."
      },
      {
        "id": "ERF",
        "title": "Bucknall & Dori-Hacohen · Current and Near-Term AI as a Potential Existential Risk Factor",
        "url": "https://arxiv.org/pdf/2209.10604",
        "locator": "Section 4.1; proposed causal relationships",
        "use": "This source develops a research hypothesis about information systems as risk factors. It does not validate the whole pathway."
      },
      {
        "id": "MYA",
        "title": "Amnesty International · The Social Atrocity: Myanmar findings",
        "url": "https://www.amnesty.org/en/latest/news/2022/09/myanmar-facebooks-systems-promoted-violence-against-rohingya-meta-owes-reparations-new-report/",
        "locator": "Anti-Rohingya echo chamber; failure to act",
        "use": "Amnesty’s investigation supplies attributed findings about amplification and counter-speech. It does not provide a causal effect estimate."
      },
      {
        "id": "ETA",
        "title": "Amnesty International · Meta’s contribution to abuses in northern Ethiopia",
        "url": "https://www.amnesty.org/en/latest/news/2023/10/meta-failure-contributed-to-abuses-against-tigray-ethiopia/",
        "locator": "Meta contribution; recurrent failures; family account",
        "use": "Amnesty’s investigation supplies an attributed account of response failure. Meta disputed the findings. The inconsistent original posting date is not adopted."
      },
      {
        "id": "META-MYA18",
        "title": "Meta · Myanmar human rights assessment response (2018)",
        "url": "https://about.fb.com/news/2018/11/myanmar-hria/",
        "locator": "Enforcement of our content policies; engagement and transparency",
        "use": "The platform reports later strengthening of its controls. This is not independent proof of reduced violence."
      },
      {
        "id": "META-ETA21",
        "title": "Meta · Work to protect people in Ethiopia (2021)",
        "url": "https://about.fb.com/news/2021/11/update-on-ethiopia/",
        "locator": "Hate speech, reporting, and safety efforts",
        "use": "The platform describes its actions and investments. Aggregate detection metrics do not resolve a specific reported response failure."
      }
    ],
    "additionalEvidence": {
      "sources": [
        {
          "id": "META-MYA18",
          "title": "Meta · Myanmar human rights assessment response (2018)",
          "url": "https://about.fb.com/news/2018/11/myanmar-hria/",
          "retrievedAt": "2026-09-13",
          "access": "Platform response read; self-reported measures and limitations retained"
        },
        {
          "id": "META-ETA21",
          "title": "Meta · Work to protect people in Ethiopia (2021)",
          "url": "https://about.fb.com/news/2021/11/update-on-ethiopia/",
          "retrievedAt": "2026-09-13",
          "access": "Platform response read; action counts are not treated as a harm-reduction estimate"
        }
      ],
      "passages": [
        {
          "id": "META-MYA18-controls",
          "source": "META-MYA18",
          "title": "Later strengthening reported by the platform",
          "locator": "5 November 2018 · Enforcement of our content policies",
          "kind": "summary",
          "text": "Facebook acknowledged earlier shortcomings and reported 99 onboarded Myanmar-language reviewers, a dedicated team, and distribution reductions for certain potentially harmful material pending review.",
          "scope": "The platform reports changes made after the 2017 atrocities. These show changed control arrangements, but do not prove that the changes prevented violence or would withstand stronger AI."
        },
        {
          "id": "META-ETA21-response",
          "source": "META-ETA21",
          "title": "Platform response on Ethiopian safeguards",
          "locator": "9 November 2021 · Hate speech and additional safety efforts",
          "kind": "summary",
          "text": "Meta described local reporting channels, language expertise, proactive detection, and actions against more than 92,000 items from May to October 2021. It also described additional restrictions on dangerous claims.",
          "scope": "This is the platform’s account of its aggregate response. It does not establish response timing for every threat, reduction in audience exposure, or prevention of the specific killing described by Amnesty."
        }
      ]
    },
    "assessments": [
      {
        "id": "MYA-2017-F-01",
        "pathway": "F-01",
        "pathwayVersion": "1.0",
        "incident": "MYA-2017",
        "status": "source-summary",
        "relation": "component",
        "targets": [
          {
            "id": "F-01:2-3",
            "kind": "edge",
            "state": "component",
            "label": "Amplification and ineffective mitigation"
          }
        ],
        "scope": "This is an attributed reconstruction of amplification and failed response. A separately dated 2018 platform response describes subsequent control changes, not prevention of the 2017 atrocities.",
        "evidence": [
          "MYA-amplification",
          "META-MYA18-controls"
        ],
        "trace": [
          {
            "text": "Amnesty reports amplification of anti-Rohingya content amid longstanding persecution.",
            "evidence": [
              "MYA-amplification"
            ]
          },
          {
            "text": "Activists reported that anti-hate stickers increased engagement and visibility of the posts they opposed.",
            "evidence": [
              "MYA-amplification"
            ]
          },
          {
            "text": "Amnesty documents repeated warnings and attributes a contribution to the subsequent atrocities to platform failures.",
            "evidence": [
              "MYA-amplification"
            ]
          }
        ],
        "reach": {
          "local": "Amnesty reports amplification of anti-Rohingya content amid longstanding persecution. Activists reported that anti-hate stickers increased engagement and visibility of the posts they opposed. Amnesty documents repeated warnings and attributes a contribution to the subsequent atrocities to platform failures.",
          "systemic": "Amnesty’s attributed reconstruction connects amplification and failed response to mass violence. The platform’s independent causal contribution and each later transition remain uncertain.",
          "evidence": [
            "MYA-amplification"
          ]
        },
        "barriers": [
          {
            "id": "counter-speech",
            "title": "Anti-hate counter-speech",
            "outcome": "Reported amplification of the opposed content",
            "role": "prevention",
            "action": "An anti-hate initiative offered stickers users could post in response to inflammatory content.",
            "efficacy": "Amnesty reports that activists observed increased visibility because ranking treated the responses as engagement.",
            "durability": "The intervention shared the very ranking mechanism producing the unwanted amplification.",
            "failure": "Counter-speech increased the engagement signal and therefore the visibility of the harmful post.",
            "evidence": [
              "MYA-amplification"
            ],
            "view": {
              "input": "Inflammatory post",
              "control": "Counter-speech sticker",
              "result": "Visibility increases",
              "dependency": "How ranking treats responses",
              "failureRoute": "Response rewards the original post",
              "failureObserved": true,
              "failureLabel": "Reported failure",
              "observation": 1,
              "resultObservation": 1
            },
            "target": "F-01:2-3",
            "dependencies": [
              {
                "label": "How ranking treats responses",
                "assessment": "The intervention shared the very ranking mechanism producing the unwanted amplification.",
                "basis": "Editorial dependency assessment",
                "evidence": [
                  "MYA-amplification"
                ]
              }
            ],
            "reinforcement": {
              "label": "Ranking-impact evaluation",
              "proposal": "Evaluate counter-speech together with its effect on recommender ranking.",
              "test": "Measure exposure to the original content after the intervention; do not treat engagement as success.",
              "basis": "Editorial proposal; effectiveness not established",
              "evidence": [
                "MYA-amplification"
              ]
            }
          },
          {
            "id": "post-incident-moderation",
            "title": "Later moderation and distribution controls",
            "outcome": "Reported strengthening after the incident",
            "role": "prevention",
            "target": "F-01:2-3",
            "action": "Expand contextual review and reduce distribution while potentially harmful content is assessed.",
            "efficacy": "Meta reported added capacity and distribution controls in 2018; this does not establish reduced physical harm.",
            "durability": "Capacity, reach, and response time must be assessed against actual exposure and local context.",
            "failure": "A larger operation can still miss dangerous exposure or act after the useful protection window.",
            "evidence": [
              "META-MYA18-controls"
            ],
            "view": {
              "input": "Potentially harmful content",
              "control": "Expanded review and distribution limits",
              "result": "Controls strengthened; effect unverified",
              "dependency": "Timely local coverage",
              "failureRoute": "A larger operation can still miss dangerous exposure or act after the useful protection window.",
              "failureObserved": false,
              "failureLabel": "Possible failure",
              "observation": 1
            },
            "dependencies": [
              {
                "label": "Timely local coverage",
                "assessment": "Capacity, reach, and response time must be assessed against actual exposure and local context.",
                "basis": "Analytical dependency assessment",
                "evidence": [
                  "META-MYA18-controls"
                ]
              }
            ],
            "reinforcement": {
              "label": "Proposed improvement",
              "proposal": "Audit exposure and warning-to-action outcomes independently.",
              "test": "Test local-language threats through the full response path and measure remaining exposure.",
              "basis": "Analytical proposal; effectiveness not established",
              "evidence": [
                "META-MYA18-controls"
              ]
            }
          }
        ]
      },
      {
        "id": "ETA-2021-F-01",
        "pathway": "F-01",
        "pathwayVersion": "1.0",
        "incident": "ETA-2021",
        "status": "source-summary",
        "relation": "component",
        "targets": [
          {
            "id": "F-01:2-3",
            "kind": "edge",
            "state": "component",
            "label": "Amplification and response failures"
          }
        ],
        "scope": "This reconstruction concerns an incident in a conflict setting. Meta disputed the findings and described broader safeguards. Aggregate enforcement does not resolve the specific reported late response.",
        "evidence": [
          "ETA-response",
          "META-ETA21-response"
        ],
        "trace": [
          {
            "text": "Amnesty reports algorithmic amplification of harmful content targeting Tigrayans during the conflict.",
            "evidence": [
              "ETA-response"
            ]
          },
          {
            "text": "Civil-society groups and affected people warned Meta and reported threatening content.",
            "evidence": [
              "ETA-response"
            ]
          },
          {
            "text": "One documented family account describes removal only after the targeted person had been killed.",
            "evidence": [
              "ETA-response"
            ]
          }
        ],
        "reach": {
          "local": "Amnesty reports algorithmic amplification of harmful content targeting Tigrayans during the conflict. Civil-society groups and affected people warned Meta and reported threatening content. One documented family account describes removal only after the targeted person had been killed.",
          "systemic": "This is a second attributed reconstruction of an incident in a conflict setting. The source supports scrutiny of ranking and response, while the extent of their causal contribution is disputed.",
          "evidence": [
            "ETA-response"
          ]
        },
        "barriers": [
          {
            "id": "moderation-escalation",
            "title": "Reporting and moderation escalation",
            "outcome": "Reported intervention arrived too late",
            "role": "response",
            "action": "People and civil-society partners submitted reports and warnings through platform channels.",
            "efficacy": "Amnesty reports delayed or inadequate action, including removal after a targeted person’s death; Meta disputed the findings.",
            "durability": "A reporting channel depends on timely, context-sensitive action and sufficient language coverage.",
            "failure": "Warnings may be delayed, misinterpreted, or left without an effective response before harm occurs.",
            "evidence": [
              "ETA-response"
            ],
            "view": {
              "input": "Threats and warnings",
              "control": "Moderation response",
              "result": "Removal after harm",
              "dependency": "Timely contextual review",
              "failureRoute": "Warning does not trigger action",
              "failureObserved": true,
              "failureLabel": "Reported failure",
              "observation": 1
            },
            "target": "F-01:2-3",
            "dependencies": [
              {
                "label": "Timely contextual review",
                "assessment": "A reporting channel depends on timely, context-sensitive action and sufficient language coverage.",
                "basis": "Editorial dependency assessment",
                "evidence": [
                  "ETA-response"
                ]
              }
            ],
            "reinforcement": {
              "label": "Local warning-to-action tests",
              "proposal": "Connect local-language warnings to accountable, time-bounded response.",
              "test": "Exercise the full warning-to-action path with context-specific cases.",
              "basis": "Editorial proposal; effectiveness not established",
              "evidence": [
                "ETA-response"
              ]
            }
          }
        ]
      }
    ],
    "presentation": {
      "conditions": {
        "F-01:2": "If ranking materially increases harmful exposure",
        "F-01:3": "If response misses the intervention window",
        "F-01:4": "Only if people use exposure to target or mobilize",
        "F-01:5": "Only with coercive capacity and failed protection",
        "F-01:R": "If proportionate controls and protection work"
      },
      "overlays": {
        "MYA-2017": {
          "title": "Myanmar · investigation",
          "kind": "Reported incident",
          "relation": "mechanism",
          "target": "F-01:2-3",
          "anchor": "F-01:3",
          "observed": "Amnesty reports failed counter-speech and attributes a contribution from platform amplification to atrocities.",
          "notEstablished": "The report does not quantify the algorithmic contribution or establish that the platform alone caused the violence. It does not measure progression along this pathway.",
          "limit": "Amnesty attributes a contributing role to platform amplification. The later strengthening occurred in 2018; it was not a protection in place during the 2017 incident.",
          "barriers": {
            "counter-speech": {
              "title": "Counter-speech",
              "result": "The response reportedly increased visibility.",
              "condition": "backfiring",
              "conditionBasis": "Activists reported that ranking treated the counter-speech as engagement and increased the harmful posts’ visibility.",
              "limitType": "safeguard",
              "strongerAI": "More capable targeting or synthetic engagement could exploit the same objective; better classifiers could help only if exposure actually falls.",
              "reinforcement": {
                "proposal": "Evaluate counter-speech jointly with ranking effects.",
                "test": "Measure exposure to the original harmful post after an intervention.",
                "status": "proposed"
              }
            },
            "post-incident-moderation": {
              "title": "Later control changes · 2018",
              "result": "Staffing and distribution controls expanded, but their effectiveness was not verified.",
              "condition": "reinforced",
              "conditionBasis": "Meta reported actual additions to staffing and distribution controls after the incident. This describes strengthening, not a demonstrated reduction in violence.",
              "limitType": "safeguard",
              "strongerAI": "Scale, multilingual evasion, and faster dissemination can change the workload. Improved detection could also help; the net effect needs testing.",
              "reinforcement": {
                "proposal": "Independently audit local exposure and response outcomes.",
                "test": "Measure time to effective restriction and remaining exposure across adversarial local cases.",
                "status": "proposed"
              },
              "states": [
                "reinforced",
                "unknown"
              ]
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "F-01:R",
            "question": "Would changing engagement incentives reduce exposure and protect people?",
            "basis": "Amnesty reports that counter-speech increased engagement and made harmful posts more visible.",
            "unresolved": "The account did not test a redesigned ranking system. We would need to establish whether a redesign reduces harmful exposure and whether people receive better protection.",
            "sources": [
              "MYA"
            ]
          }
        },
        "ETA-2021": {
          "title": "Ethiopia · investigation",
          "kind": "Reported incident",
          "relation": "mechanism",
          "target": "F-01:2-3",
          "anchor": "F-01:3",
          "observed": "Amnesty reports a threat-removal response after the targeted person was killed; Meta disputed its findings.",
          "notEstablished": "The platform’s aggregate moderation statistics do not show that this harm was prevented. The investigation does not quantify the algorithmic contribution.",
          "limit": "Amnesty reports a response failure, and Meta disputed its findings. Detection and eventual removal do not demonstrate timely protection.",
          "barriers": {
            "moderation-escalation": {
              "title": "Warning-to-action response",
              "result": "Intervention reportedly arrived after harm.",
              "condition": "failed",
              "conditionBasis": "The condition refers to the documented response window in Amnesty’s account, not every report or all platform moderation.",
              "limitType": "safeguard",
              "strongerAI": "More capable generation and targeting could outpace review; better triage may help. Test elapsed time and protection rather than removal totals.",
              "reinforcement": {
                "proposal": "Connect local warnings to accountable, time-bounded action.",
                "test": "Exercise the complete report-to-enforcement path and separately verify protection.",
                "status": "proposed"
              }
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "F-01:4",
            "question": "How much did algorithmic amplification contribute to targeting in this case?",
            "basis": "Amnesty links the spread of threats to targeting and reports removal after the victim was killed; Meta disputed its findings.",
            "unresolved": "The account does not isolate ranking’s contribution from other routes of exposure or the conflict itself. We would need evidence showing who encountered the threats through recommendations and how that exposure affected the targeting.",
            "sources": [
              "ETA",
              "META-ETA21"
            ]
          }
        }
      },
      "fidelity": "Reported investigations identify evidence-bearing mechanisms and their uncertainty. Platform responses are visible; later strengthening is distinguished from earlier failure, and content enforcement from physical protection.",
      "brittleness": "Observed condition describes what the barrier did in this setting. Brittleness asks which changed dependency, capability, or operating condition would make it fail. A strengthened barrier can still be brittle; a single success does not establish robustness.",
      "context": [
        {
          "title": "System setting",
          "text": "The hypothetical scenario concerns a platform operating in a conflict-affected setting. It includes ranking, content enforcement, platform governance, local warning partners, and the interface to civilian protection. Human perpetrators act outside platform control, and the existing conflict has causes beyond the platform.",
          "sources": [],
          "targets": [
            {
              "node": "F-01:1",
              "label": "Conflict setting",
              "text": "A platform operates in a conflict-affected setting."
            },
            {
              "node": "F-01:3",
              "label": "Local warnings",
              "text": "Local warning partners connect with platform governance and content enforcement."
            },
            {
              "node": "F-01:4",
              "label": "Perpetrators",
              "text": "Human perpetrators and pre-existing conflict remain causal actors outside platform control."
            }
          ]
        }
      ],
      "cloud": {
        "origin": "scenario-setting",
        "conditions": [
          "Existing conflict",
          "Engagement incentives"
        ],
        "actors": [
          {
            "controller": "C1",
            "label": "Platform governance",
            "role": "set distribution objectives"
          },
          {
            "controller": "C3",
            "label": "Moderation teams",
            "role": "review & restrict content"
          },
          {
            "controller": "C4",
            "label": "Local warning partners",
            "role": "raise threats & coordinate response"
          },
          {
            "controller": "C5",
            "label": "Protection services",
            "role": "protect people"
          }
        ],
        "summary": "Existing conflict shapes the threats people face. Engagement incentives shape what the platform distributes, while protection also depends on actors beyond it."
      }
    },
    "controlEvidence": {
      "title": "Did a warning become protection?",
      "kind": "Attributed incident comparison",
      "source": "ETA",
      "constraint": "SC3",
      "text": "Follow the report through acknowledgment, contextual review, distribution change, and separate physical protection.",
      "limit": "A submitted warning, detected item, or later removal does not establish that the threatened person was protected in time.",
      "questions": [
        {
          "title": "What changed?",
          "text": "Measure remaining exposure and action timing, rather than engagement or removal totals alone."
        },
        {
          "title": "What was strengthened?",
          "text": "Separate observed changes to the barrier from evidence that it works."
        },
        {
          "title": "Would stronger AI change it?",
          "text": "Test scale, evasion, and time to intervention while preserving legitimate expression."
        }
      ]
    }
  },
  "H-01": {
    "roleTypes": [
      {
        "id": "condition",
        "label": "Enabling condition",
        "definition": "A circumstance that makes a route possible; it does not by itself establish a hazard."
      },
      {
        "id": "unsafe-action",
        "label": "Unsafe control action",
        "definition": "An action or omission linked to its controller, hazardous context, and affected constraint."
      },
      {
        "id": "scenario",
        "label": "Loss scenario",
        "definition": "An explanation of how control can become inadequate, including feedback and execution problems."
      },
      {
        "id": "hazard",
        "label": "Hazardous state",
        "definition": "A system state that can produce a loss together with relevant environmental conditions."
      },
      {
        "id": "amplifier",
        "label": "Optional amplifier",
        "definition": "A factor that could strengthen a route but is not required in every version."
      },
      {
        "id": "loss",
        "label": "Loss",
        "definition": "An outcome stakeholders seek to prevent, kept distinct from its contributing causes."
      },
      {
        "id": "recovery",
        "label": "Recovery",
        "definition": "A response re-establishes enforceable safety constraints within a specified boundary; success requires verification."
      }
    ],
    "version": "1.3",
    "pathway": "H-01",
    "displayId": "Bonus-1",
    "title": "Screening, selective records, and persistent exclusion",
    "status": "STPA worked example · bounded comparison",
    "summary": "Can decisions and the records they generate entrench exclusion beyond effective correction?",
    "scope": "The hypothetical scenario connects employment screening with record suppliers, policing allocation, model updates, and independent redress. These functions belong to analytically distinct organizations. No single controller is assumed to command the whole system.",
    "purpose": "Protect access to employment, accurate and contestable records, and effective correction of repeated exclusion.",
    "boundary": "This is a bounded discrimination scenario, not an extinction pathway. Neither cited case establishes the combined employment–policing cycle.",
    "numbering": "0 gives the context; 1.x identifies precursors, 2.x the loss-of-control event, and 3.x conditional consequences. R identifies a possible recovery outcome. These numbers locate scenario components; they are not STPA method steps or a measure of proximity to catastrophe. The return arrow represents feedback, not an extra observed incident.",
    "bowtie": "The centre is exclusion beyond effective correction. Downstream record feedback can renew earlier screening risk; recovery interrupts that loop and repairs affected decisions.",
    "schema": "Losses, hazards, controls, unsafe actions, and scenarios are traced by IDs. This prospective analysis is separate from the retrospective case evidence.",
    "limits": "A fictional cross-institutional scenario is compared with a non-AI enforcement record and a mathematical study. Causal links between unemployment, enforcement, and future exclusion require independent evidence.",
    "losses": [
      {
        "id": "L1",
        "title": "Unwarranted loss of employment",
        "text": "People lose work or income because unsuitable or inaccurate information governs a decision."
      },
      {
        "id": "L2",
        "title": "Persistent discriminatory exclusion",
        "text": "Repeated decisions entrench disadvantage and make effective redress inaccessible to an affected population."
      }
    ],
    "hazards": [
      {
        "id": "H1",
        "title": "Exclusion beyond effective correction",
        "text": "Consequential exclusion propagates through decisions while timely challenge and correction cannot constrain it.",
        "losses": [
          "L1",
          "L2"
        ]
      },
      {
        "id": "H2",
        "title": "Selective records treated as independent risk evidence",
        "text": "The system reuses records shaped by its own decisions without adequately accounting for selection or limits of use.",
        "losses": [
          "L1",
          "L2"
        ]
      }
    ],
    "controllers": [
      {
        "id": "C1",
        "title": "Employer / screening decision authority",
        "responsibility": "Approve or suspend consequential screening use; reconsider affected decisions.",
        "feedback": "Disputed-record notices, review outcomes, and independent checks of decision effects.",
        "assumption": "Decision authority remains able to change an outcome before it becomes irreversible."
      },
      {
        "id": "C2",
        "title": "Record supplier",
        "responsibility": "Match, update, and correct the records supplied.",
        "feedback": "Source corrections, identity discrepancies, and dispute results.",
        "assumption": "A corrected record reaches every recipient that continues to rely on it."
      },
      {
        "id": "C3",
        "title": "Enforcement allocation authority",
        "responsibility": "Set and revise patrol allocation and the collection of discovery records.",
        "feedback": "Allocation history, independently reported incidents, and local effects.",
        "assumption": "Discovered records depend partly on where enforcement looked."
      },
      {
        "id": "C4",
        "title": "Model and data steward",
        "responsibility": "Admit updates, correct selection effects, and bound reuse.",
        "feedback": "Data provenance, drift checks, and independent outcome observations.",
        "assumption": "A statistical correction may depend on assumptions that change in deployment."
      },
      {
        "id": "C5",
        "title": "Independent review and redress",
        "responsibility": "Require timely correction, suspension, or reconsideration.",
        "feedback": "Affected-person reports, audited records, and confirmation that instructions changed decisions.",
        "assumption": "A formal correction order must reach an actor able to enforce it."
      },
      {
        "id": "C6",
        "title": "Screening and allocation pipeline",
        "responsibility": "Apply approved data and decision rules within contestable limits.",
        "feedback": "Approved data, correction instructions, and limits on use.",
        "assumption": "Separate deployments may share records and create cumulative effects."
      }
    ],
    "controlLoops": [
      {
        "id": "CA1",
        "controller": "C1",
        "process": "C6",
        "action": "Approve, suspend, or reconsider screening",
        "feedback": "The pipeline reports affected decisions, disputed records, and the effect of suspension.",
        "constraints": [
          "SC1",
          "SC2",
          "SC5"
        ]
      },
      {
        "id": "CA2",
        "controller": "C2",
        "process": "C6",
        "action": "Supply or correct records",
        "feedback": "Recipients acknowledge correction and identify derived records that still retain the error.",
        "constraints": [
          "SC1",
          "SC4",
          "SC5"
        ]
      },
      {
        "id": "CA3",
        "controller": "C3",
        "process": "C6",
        "action": "Set and revise enforcement allocation",
        "feedback": "Independent incident reports and allocation history reveal selective discovery.",
        "constraints": [
          "SC3",
          "SC4"
        ]
      },
      {
        "id": "CA4",
        "controller": "C4",
        "process": "C6",
        "action": "Approve model inputs and updates",
        "feedback": "Audits compare updated predictions with independently sampled observations.",
        "constraints": [
          "SC3",
          "SC4"
        ]
      },
      {
        "id": "CA5",
        "controller": "C5",
        "process": "C1",
        "action": "Require reconsideration or suspension",
        "feedback": "Decision-makers confirm changed outcomes and unresolved cases.",
        "constraints": [
          "SC2",
          "SC5"
        ]
      }
    ],
    "constraints": [
      {
        "id": "SC1",
        "title": "Check record accuracy and fitness",
        "text": "Consequential screening must use correctly matched, current information appropriate to the decision.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C1",
          "C2"
        ],
        "role": "Prevention",
        "test": "Do identity, duplication, and update checks block a materially wrong record before use?",
        "limit": "Stale sources, mistaken identity, uncertain proxies, or incorrect matching can defeat the check.",
        "nodes": [
          "H-01:1",
          "H-01:2",
          "H-01:R"
        ]
      },
      {
        "id": "SC2",
        "title": "Make challenge change decisions",
        "text": "Affected people must be able to obtain timely review that can suspend or change consequential exclusion.",
        "hazards": [
          "H1"
        ],
        "owners": [
          "C1",
          "C5"
        ],
        "role": "Prevention and recovery",
        "test": "Does a valid dispute reach a decision-maker and change the decision within the relevant window?",
        "limit": "Cost, delay, inaccessible notices, or an unempowered reviewer may make appeal ineffective.",
        "nodes": [
          "H-01:2",
          "H-01:5",
          "H-01:R"
        ]
      },
      {
        "id": "SC3",
        "title": "Account for selective discovery",
        "text": "Updates must account for how earlier allocations shaped the records being learned from.",
        "hazards": [
          "H2"
        ],
        "owners": [
          "C3",
          "C4"
        ],
        "role": "Prevention",
        "test": "Does the proposed correction prevent feedback under changed reporting and discovery patterns?",
        "limit": "A correction fitted to the wrong discovery process can retain or introduce bias.",
        "nodes": [
          "H-01:3",
          "H-01:4",
          "H-01:R"
        ]
      },
      {
        "id": "SC4",
        "title": "Bound reuse across decisions",
        "text": "Records and predictions must not be reused outside a demonstrated, appropriate purpose without review.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C2",
          "C3",
          "C4"
        ],
        "role": "Prevention",
        "test": "Can provenance and purpose restrictions prevent unsupported reuse across deployments?",
        "limit": "Copied data, proxy variables, and diffuse responsibility may evade the restriction.",
        "nodes": [
          "H-01:1",
          "H-01:3",
          "H-01:4",
          "H-01:R"
        ]
      },
      {
        "id": "SC5",
        "title": "Verify correction reaches outcomes",
        "text": "Recovery must verify corrected records, reconsidered decisions, and interruption of renewed feedback.",
        "hazards": [
          "H1",
          "H2"
        ],
        "owners": [
          "C1",
          "C2",
          "C5"
        ],
        "role": "Recovery",
        "test": "After correction, do downstream records and decisions change and remain corrected?",
        "limit": "Derived records, delayed propagation, or a continuing input loop can recreate the exclusion.",
        "nodes": [
          "H-01:2",
          "H-01:4",
          "H-01:5",
          "H-01:R"
        ]
      }
    ],
    "nodes": [
      {
        "number": "1.1",
        "wing": "before",
        "role": "Condition",
        "title": "Records govern screening",
        "shortLabel": "Records govern screening",
        "text": "Criminal-history or predicted-risk records influence consequential screening.",
        "requires": "Records are used in the decision and are unsuitable, inaccurate, or poorly contested.",
        "mechanism": "Reliance on a record can transfer its errors or untested assumptions into a decision.",
        "constraints": [
          "SC1",
          "SC4"
        ],
        "sources": [
          "TA",
          "HRI"
        ],
        "scenarios": [
          "LS1"
        ],
        "type": "condition",
        "references": [
          "H2"
        ],
        "id": "H-01:1"
      },
      {
        "number": "2.1",
        "wing": "centre",
        "role": "Loss of control · H1",
        "title": "Exclusion outruns correction",
        "shortLabel": "Exclusion outruns correction",
        "text": "Exclusion becomes consequential while effective review or correction fails to constrain it.",
        "requires": "An adverse decision, material effects, and inadequate timely correction.",
        "mechanism": "A mistaken screening result can become a sustained loss when the correction process cannot change the outcome.",
        "constraints": [
          "SC1",
          "SC2",
          "SC5"
        ],
        "sources": [
          "TA",
          "HRI"
        ],
        "scenarios": [
          "LS1",
          "LS2"
        ],
        "type": "hazard",
        "references": [
          "H1"
        ],
        "id": "H-01:2"
      },
      {
        "number": "3.1",
        "wing": "after",
        "role": "Conditional feedback mechanism",
        "title": "Selective enforcement shapes records",
        "shortLabel": "Selective enforcement shapes records",
        "text": "Where enforcement is allocated changes what it discovers and records.",
        "requires": "Allocation affects discovery; the employment-to-enforcement bridge remains separately unestablished.",
        "mechanism": "Selective observation can change recorded arrests without a corresponding change in underlying offending.",
        "constraints": [
          "SC3",
          "SC4"
        ],
        "sources": [
          "PFL",
          "TA"
        ],
        "scenarios": [
          "LS3"
        ],
        "type": "scenario",
        "references": [
          "H2"
        ],
        "id": "H-01:3"
      },
      {
        "number": "3.2",
        "wing": "after",
        "role": "Feedback",
        "title": "Records reinforce future decisions",
        "shortLabel": "Records reinforce future decisions",
        "text": "Records shaped by earlier decisions feed later predictions and allocation.",
        "requires": "Updates reuse those records without an adequate selection correction.",
        "mechanism": "Learning from a deployment’s own discoveries can renew the initial pattern. Cross-domain reuse requires additional support.",
        "constraints": [
          "SC3",
          "SC4",
          "SC5"
        ],
        "sources": [
          "PFL",
          "TA"
        ],
        "scenarios": [
          "LS3",
          "LS4"
        ],
        "type": "scenario",
        "references": [
          "H2"
        ],
        "id": "H-01:4"
      },
      {
        "number": "3.3",
        "wing": "after",
        "role": "Loss · L2",
        "title": "Disadvantage persists",
        "shortLabel": "Disadvantage persists",
        "text": "Repeated consequential exclusion entrenches disadvantage.",
        "requires": "Sustained exposure, cumulative effects, and failure of correction or exit.",
        "mechanism": "A recurrent process can make local losses persistent, but neither case establishes this full societal outcome.",
        "constraints": [
          "SC2",
          "SC5"
        ],
        "sources": [
          "TA"
        ],
        "scenarios": [
          "LS4"
        ],
        "type": "loss",
        "references": [
          "L2"
        ],
        "id": "H-01:5"
      },
      {
        "number": "R",
        "wing": "recovery",
        "role": "Recovery",
        "title": "Decisions and records corrected",
        "shortLabel": "Decisions and records corrected",
        "text": "Effective review corrects records and affected decisions and interrupts renewed feedback.",
        "requires": "Correction propagates, consequential decisions change, and recurrence is monitored.",
        "mechanism": "Recovery acts on the affected system and outcomes. Reinforcing a check is a separate change to a barrier.",
        "constraints": [
          "SC1",
          "SC2",
          "SC3",
          "SC4",
          "SC5"
        ],
        "sources": [
          "STPA",
          "HRI",
          "PFL"
        ],
        "scenarios": [],
        "type": "recovery",
        "references": [],
        "id": "H-01:R"
      }
    ],
    "links": [
      {
        "id": "H-01:1>2",
        "from": "H-01:1",
        "to": "H-01:2",
        "label": "Screening is consequential and review does not constrain it",
        "kind": "contribution",
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "H-01:2>3",
        "from": "H-01:2",
        "to": "H-01:3",
        "label": "Additional social and enforcement conditions; not established by the case",
        "kind": "optional",
        "constraints": [
          "SC2",
          "SC4"
        ]
      },
      {
        "id": "H-01:3>4",
        "from": "H-01:3",
        "to": "H-01:4",
        "label": "Selective discovery is reused in an update",
        "kind": "contribution",
        "constraints": [
          "SC3"
        ]
      },
      {
        "id": "H-01:4>1",
        "from": "H-01:4",
        "to": "H-01:1",
        "label": "Records are reused in later screening",
        "kind": "feedback",
        "constraints": [
          "SC1",
          "SC4"
        ]
      },
      {
        "id": "H-01:4>5",
        "from": "H-01:4",
        "to": "H-01:5",
        "label": "Repeated decisions accumulate and redress fails",
        "kind": "continuation",
        "constraints": [
          "SC2",
          "SC5"
        ]
      },
      {
        "id": "H-01:2>R",
        "from": "H-01:2",
        "to": "H-01:R",
        "label": "Timely correction changes records and outcomes",
        "kind": "recovery",
        "constraints": [
          "SC2",
          "SC5"
        ]
      }
    ],
    "unsafeActions": [
      {
        "id": "UCA1",
        "type": "Unsafe action provided",
        "loop": "CA1",
        "controller": "C1",
        "action": "Approves consequential screening",
        "context": "The record is materially inaccurate or unsuitable and the decision can cause exclusion.",
        "hazards": [
          "H1",
          "H2"
        ],
        "constraints": [
          "SC1",
          "SC2"
        ]
      },
      {
        "id": "UCA2",
        "type": "Required action absent",
        "loop": "CA2",
        "controller": "C2",
        "action": "Does not propagate a verified correction",
        "context": "Recipients continue to use the incorrect record in consequential decisions.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC1",
          "SC5"
        ]
      },
      {
        "id": "UCA3",
        "type": "Wrong timing or order",
        "loop": "CA5",
        "controller": "C5",
        "action": "Requires reconsideration too late",
        "context": "The relevant employment opportunity or effective remedy has already been lost.",
        "hazards": [
          "H1"
        ],
        "constraints": [
          "SC2",
          "SC5"
        ]
      },
      {
        "id": "UCA4",
        "type": "Applied too long or stopped too soon",
        "loop": "CA4",
        "controller": "C4",
        "action": "Continues an input correction after its assumptions fail",
        "context": "Changed reporting or discovery processes make the update reinforce selective records.",
        "hazards": [
          "H2"
        ],
        "constraints": [
          "SC3",
          "SC4"
        ]
      }
    ],
    "scenarios": [
      {
        "id": "LS1",
        "title": "A record error survives the decision",
        "archetype": "Inadequate process model",
        "text": "Decision-makers treat a record as current and correctly matched when it is not.",
        "ucas": [
          "UCA1"
        ],
        "hazards": [
          "H1",
          "H2"
        ],
        "nodes": [
          "H-01:1",
          "H-01:2"
        ],
        "evidence": [
          "HRI"
        ],
        "unknown": "The case does not establish automated future-arrest prediction."
      },
      {
        "id": "LS2",
        "title": "Redress cannot act in time",
        "archetype": "Missing or delayed feedback",
        "text": "A dispute does not lead to a timely changed decision.",
        "ucas": [
          "UCA2",
          "UCA3"
        ],
        "hazards": [
          "H1"
        ],
        "nodes": [
          "H-01:2"
        ],
        "evidence": [
          "HRI"
        ],
        "unknown": "How often effective correction succeeds in the hypothetical system is unknown."
      },
      {
        "id": "LS3",
        "title": "Selective discovery becomes apparent risk",
        "archetype": "Inadequate feedback",
        "text": "Allocation changes discovery, and new records are reused without an adequate correction.",
        "ucas": [
          "UCA4"
        ],
        "hazards": [
          "H2"
        ],
        "nodes": [
          "H-01:3",
          "H-01:4"
        ],
        "evidence": [
          "PFL"
        ],
        "unknown": "Transfer from the mathematical study to any particular deployment requires testing."
      },
      {
        "id": "LS4",
        "title": "Corrected records are recreated downstream",
        "archetype": "Control action not executed or ineffective",
        "text": "A recipient retains derived data or a feedback process regenerates the same misleading pattern.",
        "ucas": [
          "UCA2",
          "UCA4"
        ],
        "hazards": [
          "H1",
          "H2"
        ],
        "nodes": [
          "H-01:4",
          "H-01:5"
        ],
        "evidence": [
          "TA",
          "STPA"
        ],
        "unknown": "Neither reviewed case demonstrates the entire employment–policing–exclusion loop."
      }
    ],
    "limitingConditions": [
      {
        "kind": "Safeguard",
        "example": "Correction reaches both the record and the consequential decision.",
        "question": "Does a successful appeal actually change downstream use?"
      },
      {
        "kind": "Institutional boundary",
        "example": "A record is not available or authorized for cross-domain reuse.",
        "question": "Does that boundary remain enforceable when copying becomes easier?"
      },
      {
        "kind": "Model assumption",
        "example": "Input correction matches the reporting and discovery process.",
        "question": "How does protection change when that process shifts?"
      }
    ],
    "sources": [
      {
        "id": "STPA",
        "title": "Leveson & Thomas · STPA Handbook (2018)",
        "url": "https://psas.scripts.mit.edu/home/get_file.php?name=STPA_handbook.pdf",
        "locator": "Chapter 2, pp. 14–53; Chapter 6, pp. 101–115",
        "use": "This source supplies the method for analyzing losses, hazards, constraints, control structure, contextual unsafe actions, causal scenarios, and leading indicators."
      },
      {
        "id": "CAA",
        "title": "UK Civil Aviation Authority · Bowtie elements",
        "url": "https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/bowtie-elements/",
        "locator": "Hazard, top event, threats, consequences, preventive/recovery controls, escalation factors",
        "use": "This source supplies the presentation vocabulary. A bow-tie hazard source and an STPA hazardous system state are not interchangeable definitions."
      },
      {
        "id": "TA",
        "title": "Critch & Russell · TASRA",
        "url": "https://arxiv.org/html/2306.06924v1",
        "locator": "Section 2.1, story 1a",
        "use": "This source presents a fictional cross-institutional hypothesis. It does not describe an observed causal chain."
      },
      {
        "id": "HRI",
        "title": "FTC · HireRight settlement announcement (2012)",
        "url": "https://www.ftc.gov/news-events/news/press-releases/2012/08/employment-background-screening-company-pay-26-million-penalty-multiple-violations-fair-credit",
        "locator": "Allegations about accuracy and disputes; settlement notice",
        "use": "This source provides a non-AI screening comparison. Allegations and proposed settlement terms are not adjudicated findings."
      },
      {
        "id": "PFL",
        "title": "Ensign et al. · Runaway Feedback Loops in Predictive Policing",
        "url": "https://proceedings.mlr.press/v81/ensign18a.html",
        "locator": "Abstract and paper, PMLR 81:160–171",
        "use": "This source provides mathematical and computational evidence for selective-data feedback and a correction within its assumptions."
      }
    ],
    "assessments": [
      {
        "id": "HRI-2012-H-01",
        "pathway": "H-01",
        "pathwayVersion": "1.0",
        "incident": "HRI-2012",
        "status": "source-summary",
        "relation": "mechanism-comparison",
        "targets": [
          {
            "id": "H-01:1-2",
            "kind": "edge",
            "state": "component",
            "label": "Criminal-record screening can exclude people from employment"
          }
        ],
        "scope": "This case provides a narrow non-AI comparison for screening-to-employment exclusion. Future-arrest prediction and the subsequent self-reinforcing loop are not established.",
        "evidence": [
          "HRI-2012-account"
        ],
        "trace": [
          {
            "text": "Employers used criminal-history reports.",
            "evidence": [
              "HRI-2012-account"
            ]
          },
          {
            "text": "The FTC alleged materially inaccurate reports and employment denials.",
            "evidence": [
              "HRI-2012-account"
            ]
          },
          {
            "text": "Settlement terms addressed accuracy, access, and disputes.",
            "evidence": [
              "HRI-2012-account"
            ]
          }
        ],
        "barriers": [
          {
            "id": "record-accuracy",
            "title": "Record accuracy checks",
            "outcome": "Failures alleged by the FTC",
            "role": "prevention",
            "action": "Identity matching, updates, and duplicate checks should stop materially wrong records before they affect screening.",
            "efficacy": "The FTC alleged inaccurate and wrong-person reports and resulting employment denials; the announcement is not an adjudicated finding.",
            "durability": "Faster screening or wider data reuse can propagate an error before it is corrected.",
            "failure": "Incorrect matching, stale sources, or delayed correction allow unsuitable records to remain in use.",
            "target": "H-01:1-2",
            "evidence": [
              "HRI-2012-account"
            ],
            "dependencies": [],
            "reinforcement": {
              "proposal": "Test record matching and correction propagation before consequential reuse.",
              "test": "Trace a corrected record through every recipient and verify changed decisions.",
              "basis": "Analyst proposal; not evaluated by this case",
              "evidence": [
                "HRI-2012-account"
              ]
            },
            "view": {
              "input": "Criminal-history records",
              "control": "Accuracy checks",
              "result": "Inaccurate reports alleged",
              "dependency": "Matching and timely correction",
              "failureRoute": "Wrong or outdated records reach employers",
              "failureObserved": true
            }
          }
        ],
        "reach": {
          "local": "The FTC alleged that inaccurate, duplicated, and wrong-person criminal records caused employment denials. The proposed settlement included accuracy and dispute-handling obligations, without an admission of violation.",
          "systemic": "This case provides a narrow non-AI comparison for screening-to-employment exclusion. Future-arrest prediction and the subsequent self-reinforcing loop are not established.",
          "evidence": [
            "HRI-2012-account"
          ]
        }
      },
      {
        "id": "PFL-2018-H-01",
        "pathway": "H-01",
        "pathwayVersion": "1.0",
        "incident": "PFL-2018",
        "status": "source-summary",
        "relation": "mechanism-comparison",
        "targets": [
          {
            "id": "H-01:3-4",
            "kind": "edge",
            "state": "component",
            "label": "Enforcement-generated records can reinforce a prediction"
          }
        ],
        "scope": "This study provides a comparison for the record-feedback component only. Employment loss and deprivation causing new arrests were not tested.",
        "evidence": [
          "PFL-2018-account"
        ],
        "trace": [
          {
            "text": "The model linked patrol allocation to discovered incidents.",
            "evidence": [
              "PFL-2018-account"
            ]
          },
          {
            "text": "Reusing these records produced a feedback loop.",
            "evidence": [
              "PFL-2018-account"
            ]
          },
          {
            "text": "The proposed correction prevented the modeled runaway loop.",
            "evidence": [
              "PFL-2018-account"
            ]
          }
        ],
        "barriers": [
          {
            "id": "PFL-2018-correction",
            "title": "Correction for enforcement-generated data",
            "outcome": "Modeled feedback was prevented",
            "role": "prevention",
            "action": "The study changed inputs to account for selective discovery.",
            "efficacy": "The correction prevented runaway feedback under its assumptions.",
            "durability": "Real reporting and discovery processes must match those assumptions.",
            "failure": "Distribution changes can invalidate the correction.",
            "view": {
              "input": "Selective records",
              "control": "Input correction",
              "result": "Feedback contained",
              "dependency": "Model assumptions",
              "observation": 2,
              "failureRoute": "Distribution changes can invalidate the correction",
              "failureObserved": false
            },
            "target": "H-01:3-4",
            "evidence": [
              "PFL-2018-account"
            ],
            "dependencies": [
              {
                "label": "Model assumptions",
                "assessment": "Real reporting and discovery processes must match those assumptions.",
                "basis": "Editorial dependency assessment",
                "evidence": [
                  "PFL-2018-account"
                ]
              }
            ],
            "reinforcement": {
              "label": "Selection-bias audit",
              "proposal": "Audit whether correction assumptions match reporting and discovery in deployment.",
              "test": "Compare independent observations and subgroup outcomes before treating the model correction as effective.",
              "basis": "Editorial proposal; effectiveness not established",
              "evidence": [
                "PFL-2018-account"
              ]
            }
          }
        ],
        "reach": {
          "local": "The study shows how police-discovered records can reinforce deployment to the same areas. Its input correction prevents the modeled runaway feedback; reported incidents alone do not fully remove it.",
          "systemic": "This study provides a comparison for the record-feedback component only. Employment loss and deprivation causing new arrests were not tested.",
          "evidence": [
            "PFL-2018-account"
          ]
        }
      }
    ],
    "presentation": {
      "conditions": {
        "H-01:2": "If exclusion becomes effective before correction",
        "H-01:3": "Only with additional allocation and discovery conditions",
        "H-01:4": "If selective records are reused without adequate correction",
        "H-01:5": "If exclusion recurs and redress remains ineffective",
        "H-01:R": "If correction reaches records and decisions"
      },
      "fidelity": "Two component comparisons inform this bounded model. Neither establishes the combined hypothetical loop. Recovery is an alternative outcome, not a stage leading to further exclusion.",
      "overlays": {
        "HRI-2012": {
          "title": "HireRight screening case",
          "kind": "Non-AI enforcement record",
          "relation": "mechanism",
          "target": "H-01:1-2",
          "anchor": "H-01:1",
          "observed": "The FTC alleged that inaccurate background reports led to employment denials.",
          "notEstablished": "The announcement does not establish AI arrest prediction or the subsequent feedback loop; allegations were not adjudicated findings.",
          "limit": "This case supports a comparison between inaccurate screening records and employment exclusion.",
          "barriers": {
            "record-accuracy": {
              "title": "Record accuracy checks",
              "result": "The FTC alleged material failures in record checks.",
              "condition": "failed",
              "conditionBasis": "Broken describes the alleged checking failures in this account; it is not a judicial finding.",
              "limitType": "safeguard",
              "strongerAI": "More rapid screening and easier data reuse could spread an error before correction. Better matching could help; test correction speed and downstream decisions.",
              "reinforcement": {
                "proposal": "Verify identity, currency, and correction propagation before consequential reuse.",
                "test": "Does a corrected record change every affected decision within the useful time window?",
                "status": "proposed"
              }
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "H-01:4",
            "question": "Could disputed records keep shaping later automated decisions?",
            "basis": "The FTC alleged inaccurate screening reports and failures to investigate disputes.",
            "unresolved": "The case does not establish AI use or a feedback loop. We would need to trace whether disputed records were reused and whether they continued to affect later decisions.",
            "sources": [
              "HRI"
            ]
          }
        },
        "PFL-2018": {
          "title": "Predictive-policing feedback study",
          "kind": "Mathematical and computational study",
          "relation": "mechanism",
          "target": "H-01:3-4",
          "anchor": "H-01:3",
          "observed": "An input correction prevented runaway feedback within the study’s model.",
          "notEstablished": "The study did not establish effects on employment or show that its correction works across real deployments. It did not demonstrate an actual cycle of exclusion.",
          "limit": "Protection depends on the study’s reporting and discovery assumptions.",
          "barriers": {
            "PFL-2018-correction": {
              "title": "Correction for selective discovery",
              "result": "The corrected model avoided the runaway loop.",
              "condition": "intact",
              "states": [
                "intact",
                "reinforced"
              ],
              "conditionBasis": "Holding and reinforced apply to the corrected mathematical setup, relative to its uncorrected baseline.",
              "limitType": "mixed",
              "strongerAI": "Protection is brittle to incorrect assumptions about discovery and reporting. More adaptive allocation could change those processes; the correction must be retested.",
              "reinforcement": {
                "proposal": "Check selection assumptions against independent observations and outcomes.",
                "test": "Does the correction still prevent feedback when reporting and discovery patterns change?",
                "status": "proposed"
              }
            }
          },
          "tentative": {
            "status": "tentative",
            "origin": "editorial",
            "target": "H-01:5",
            "question": "Could the modeled feedback produce persistent disadvantage in practice?",
            "basis": "The study demonstrates how discovered records can reinforce repeated allocation and tests an input correction.",
            "unresolved": "The study did not establish long-term effects on people. We would need deployment evidence showing whether selective records repeatedly change decisions and whether those decisions sustain disadvantage.",
            "sources": [
              "PFL"
            ]
          }
        }
      },
      "context": [
        {
          "title": "System setting",
          "text": "The hypothetical scenario connects employment screening with record suppliers, policing allocation, model updates, and independent redress. These functions belong to analytically distinct organizations. No single controller is assumed to command the whole system.",
          "sources": [],
          "targets": [
            {
              "node": "H-01:1",
              "label": "Records",
              "text": "Employment screening depends on record suppliers."
            },
            {
              "node": "H-01:3",
              "label": "Allocation",
              "text": "Policing allocation and model updates are analytically distinct functions."
            },
            {
              "node": "H-01:R",
              "label": "Redress",
              "text": "Independent redress spans organizations; no single controller commands the whole system."
            }
          ]
        }
      ],
      "cloud": {
        "origin": "scenario-setting",
        "conditions": [
          "Records circulate between organizations",
          "Enforcement shapes what gets recorded"
        ],
        "actors": [
          {
            "controller": "C1",
            "label": "Employers",
            "role": "make & reconsider decisions"
          },
          {
            "controller": "C2",
            "label": "Record suppliers",
            "role": "supply & correct records"
          },
          {
            "controller": "C3",
            "label": "Allocation authorities",
            "role": "direct enforcement"
          },
          {
            "controller": "C4",
            "label": "Data stewards",
            "role": "govern updates & reuse"
          },
          {
            "controller": "C5",
            "label": "Independent review",
            "role": "require redress"
          }
        ],
        "summary": "What gets recorded depends partly on where enforcement looks. Those records can travel to other decision-makers, while correction must cross the same organizational boundaries."
      }
    }
  }
};
window.AuspexSTPAData = window.AuspexSTPAModels['X-01'];
window.AuspexBarrierStateData = {
  "version": "2.0",
  "scope": "States describe the named protection under the conditions examined.",
  "coverage": "These seven states describe incident evidence and possible changes along AI risk pathways. Brittleness concerns the dependencies of any barrier. Recovery is a separate route.",
  "states": [
    {
      "id": "reinforced",
      "label": "Reinforced",
      "definition": "The protective arrangement has been strengthened relative to an identified baseline.",
      "question": "What changed, and what evidence tests the resulting improvement?",
      "source": "PSA",
      "path": "M12 5v22M19 5v22M10 5h11M10 27h11",
      "example": "Stronger review reduced sabotage success from about 10% to 1% in the experiment. Some attacks still succeeded.",
      "exampleSource": "SAB"
    },
    {
      "id": "intact",
      "label": "Holding",
      "definition": "The barrier delivered its specified protection in the cited conditions.",
      "question": "What demand, scope, and duration did the evidence actually cover?",
      "source": "CAA-P",
      "path": "M16 5v22M12 5h8M12 27h8",
      "example": "A human maintainer caught and rejected an agent’s malicious contribution.",
      "exampleSource": "AISI"
    },
    {
      "id": "degrading",
      "label": "Crumbling",
      "definition": "Protection is weakening as capability, access, workload, or other conditions change.",
      "question": "Which dependency is eroding? Is the change observed or projected?",
      "source": "CAA-E",
      "path": "M16 5v7l-3 3 5 3-2 3v6M12 5h8M12 27h8m10-14 2 2M10 22l-2 2",
      "example": "Projected in D.1: protection that depends on weak fallback models could erode as those models become more capable.",
      "exampleSource": "AN26"
    },
    {
      "id": "failed",
      "label": "Broken",
      "definition": "The barrier failed to deliver a required protective effect on demand.",
      "question": "Was the failure in detection, decision, execution, timing, or the final effect?",
      "source": "HSE",
      "path": "M14 5v7l-3 3M21 20l-3 3v5M10 5h8M14 28h8",
      "example": "The research relay regained access within days of account bans. Lasting exclusion failed.",
      "exampleSource": "AN26"
    },
    {
      "id": "absent",
      "label": "Absent",
      "definition": "A relevant protection is missing, disabled, or removed.",
      "question": "Who can restore the protection, and who can remove it?",
      "source": "AN26",
      "path": "M12 5h8M12 27h8M16 8v3m0 10v3",
      "example": "The Mali surveillance platform’s warrant check was removed from its dossier component.",
      "exampleSource": "AN26"
    },
    {
      "id": "backfiring",
      "label": "Backfiring",
      "definition": "The attempted protection strengthens the harmful mechanism.",
      "question": "Does the intervention reduce harm, or feed the process it is meant to stop?",
      "source": "MYA",
      "path": "M16 5v7l4 4-4 4v7M12 5h8M12 27h8",
      "example": "Amnesty reports that anti-hate stickers increased the visibility of the harmful posts they opposed.",
      "exampleSource": "MYA"
    },
    {
      "id": "unknown",
      "label": "Unassessed",
      "definition": "The evidence does not establish the barrier’s relevant protective performance.",
      "question": "What evidence or test would establish whether it works?",
      "source": "CAA-P",
      "path": "M16 4v3m0 18v3M12 12c0-5 8-5 8 0 0 3-4 3-4 6m0 3h0",
      "example": "The sabotage monitor became suspicious; whether that led to an effective stop was not tested.",
      "exampleSource": "SAB"
    }
  ],
  "sources": [
    {
      "id": "PSA",
      "title": "Norwegian safety regulator · Principles for barrier management",
      "url": "https://www.havtil.no/contentassets/43fc402b97e64a7cbabdf91c64b349cb/barriers-memorandum-2017-eng.pdf",
      "use": "Functionality, integrity, robustness, performance requirements, and maintaining protection over time."
    },
    {
      "id": "HSE",
      "title": "HSE · Control systems",
      "url": "https://www.hse.gov.uk/comah/sragtech/techmeascontsyst.htm",
      "use": "Required function, availability, performance, testing, and degradation."
    },
    {
      "id": "CAA-P",
      "title": "UK CAA · Evaluating control effectiveness",
      "url": "https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/safety-risk-priorities/evaluating-using-control-effectiveness/",
      "use": "Suitability for the threat and confidence that the control will perform."
    },
    {
      "id": "CAA-E",
      "title": "UK CAA · Escalation factors",
      "url": "https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/bowtie-elements/escalation-factors/",
      "use": "Conditions that reduce or defeat a protective function."
    },
    {
      "id": "CAA-R",
      "title": "UK CAA · Recovery controls",
      "url": "https://www.caa.co.uk/safety-initiatives/working-with-industry/bowtie/bowtie-elements/recovery-controls/",
      "use": "Interruption or mitigation after the top event; a recovery control can itself be reinforced."
    },
    {
      "id": "AN26",
      "title": "Anthropic · Misuse investigations, September 2026",
      "url": "https://www.anthropic.com/threat-intelligence-report-september-2026",
      "use": "Reported access restrictions, removed controls, and dependence on fallback capability."
    },
    {
      "id": "SAB",
      "title": "Anthropic · Sabotage evaluations",
      "url": "https://www.anthropic.com/research/sabotage-evaluations",
      "use": "Compared reviewers and a monitor that detected suspicious behavior."
    },
    {
      "id": "AISI",
      "title": "AISI · Unsanctioned agent behaviour during cyber testing",
      "url": "https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing",
      "use": "Maintainer review rejected the malicious contribution."
    },
    {
      "id": "MYA",
      "title": "Amnesty · Myanmar investigation",
      "url": "https://www.amnesty.org/en/latest/news/2022/09/myanmar-facebooks-systems-promoted-violence-against-rohingya-meta-owes-reparations-new-report/",
      "use": "Reported counter-speech and ranking interaction."
    }
  ]
};
