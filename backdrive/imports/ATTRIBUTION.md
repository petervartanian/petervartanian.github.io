# Incident Tracker import

BackDrive republishes an attributed snapshot of the public [MIT AI Incident Tracker](https://airisk.mit.edu/ai-incident-tracker/incident-view). Its classifications are produced by Arcola AI from reports in the [AI Incident Database](https://incidentdatabase.ai/). See `tracker-manifest.json` for the source version, retrieval time, dataset, record count, and checksums.

MIT AI Risk Initiative data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit: MIT AI Risk Initiative / MIT FutureTech and Arcola AI. Underlying AI Incident Database incident records are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), as specified in its [data license](https://incidentdatabase.ai/terms-of-use/). Credit: Responsible AI Collaborative and AI Incident Database contributors. Each incident links to its original citation page, which identifies its submitters and editors. The underlying incident-record adaptations in this import remain available under CC BY-SA 4.0; this notice does not claim that all upstream content shares one license.

No article text from the AIID reports collection, source images, or videos is reproduced. Compact source fields are retained under `tracker` and original list fields under `trackerList`. Complete, unchanged source incident objects are available by AIID ID under `records` in `detail-batches/001.json` and subsequent numbered batches. Each batch contains up to 100 records and is loaded when needed. The manifest lists every batch's record count, byte count and SHA-256 checksum. BackDrive adds stable IDs, unmapped capability/evaluation/intervention fields, and a disclosed robotics-candidate selection rule. Curated links and notes elsewhere in BackDrive are additional analysis, not MIT's classifications.

MIT's labels, inferred harms, and possible causes are LLM outputs, not confirmed findings. Voluntary incident reporting is incomplete and selective. Robotics candidates are selected from the source's AI-purpose labels or title keywords; this is a search aid, not a claim that AI caused the event or that a particular capability was involved.

## Refresh

From the website repository root:

```sh
python3 backdrive/scripts/import_tracker.py
```

The importer reads MIT's current page to identify its active dataset, then uses the same public list and detail calls found in the page's embed script. It verifies counts, unique IDs and a consistent source update timestamp. Partial downloads resume from a timestamp-specific temporary cache. It writes the JS snapshot and manifest only after all records pass validation. Review changes, update the `tracker.js` asset hash in `index.html`, and deploy through the site's normal workflow. Refreshing is manual; no background schedule is installed.

The API is part of the public interface, not a promised permanent export format. If MIT changes its embed or schema, the importer stops rather than silently publishing partial data.
