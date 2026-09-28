# Catalog of 1+2+3 / Back\Drive

One shared catalog of incidents, capabilities, evaluations, interventions, and pilots. Back\Drive selects robotics and physical-system records from the same data.

## Data

- `imports/tracker.js`: 1,698 MIT AI Incident Tracker records from the September 28, 2026 source update. Original titles, summaries, source IDs, and classifications are preserved. Full classification details load when opened.
- `data.js`: 18 curated incident/proxy/scenario records and their connections, 15 capability/function definitions, 17 evaluations, 14 applied controls, and five pilot entries. The Sage Plant is the featured proposal, with Dusty and Derutu cases.
- `catalog.js`: merges imported records with the curated connections and resolves three duplicate local references. The merged catalog contains 1,703 unique records: 1,698 imported records, one additional incident, three physical hazard proxies, and one fictional scenario.
- `imports/mitigations.js`: the MIT mitigation source catalog, kept separate from the applied controls and their local comparisons. Its metadata records the date and provenance of the source export.
- `sources/catalogue.json`: source references for the added definitions, comparisons, and controls.

Imported records without a capability or evaluation assessment stay unassessed. An unassigned link does not establish a gap in the research literature. Robotics selection uses disclosed source-purpose/title rules, supplemented by the existing reviewed examples.

RoboHarm's 300 trial outcomes are unchanged. Additional numerical comparisons come from SummaC, dated AgentDojo results, and NIST OpenMFC. These results belong to their stated systems and test conditions. They are not field results for the linked incidents or pilot equipment. Recommendations, published experiments, and proposed local comparisons are identified separately.

Sage Plant figures remain attributed to the September 28 discussion draft. No field outcomes are recorded. The notes retain the unresolved Dusty labor-hour arithmetic, conflicting PC16 specifications, equipment-confirmation needs, and acceptance criteria still to agree. The other four pilot entries remain illustrative.

## Refresh and verify

From the website repository root:

```sh
python3 backdrive/scripts/import_tracker.py
node backdrive/scripts/validate_catalog.mjs
```

The Tracker importer discovers the active dataset from MIT's public embed, validates a complete source version, and writes a dated snapshot. Its cache supports interrupted downloads. Mitigation imports use the official public CSV export; see `imports/MITIGATIONS-ATTRIBUTION.md` and `scripts/import_mitigations.py`.

After changing an asset, update its SHA-256 prefix in `index.html`. Run the validator after updating hashes. Verify filtering, pagination, classification disclosure, capability details, evaluation results, intervention views, and both featured pilot cases in the browser before publishing. Refreshing is manual; no background schedule is installed.

## Attribution

MIT classifications: CC BY 4.0. Underlying AIID incident records: CC BY-SA 4.0. Individual incident links retain access to contributor citations. See `imports/ATTRIBUTION.md` for the full notice. The MIT mitigation export has its own attribution file. Additional mappings and operational definitions are Back\Drive assessments.

The site uses the existing original MIT, Robocurve, and Sage Plant logo assets. The dataset expansion does not alter them.
