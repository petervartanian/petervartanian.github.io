# MIT mitigation records

The 831 records in `mitigations.csv` and `mitigations.js` come from **[PUBLIC] Mitigation Database 2025-07-23**, published by the MIT AI Risk Initiative / MIT FutureTech.

- [Project and licensing statement](https://airisk.mit.edu/ai-risk-mitigations)
- [Public database](https://airtable.com/appUJl8KRAUMeIVXs/shrWzxZUTPzwAEZ2u/tblkm9TrIQ0dW8IJY)
- [Methods and limitations](https://airisk.mit.edu/blog/mapping-ai-risk-mitigations)
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

The source was a public CSV export already present in the user's Downloads folder, with a September 23, 2026 modification time. It was imported on September 28, 2026. The public Airtable view was read on that date: its 831-record count and the first visible record (A0086_Future of Life Institute2024, AI Safety Team) matched this export. The subsequent browser download could not be confirmed; this is therefore a dated local export, not a claim that every row was freshly retrieved or synchronized.

The CSV is retained byte for byte. All five original fields are retained under `original` in the JavaScript dataset, including empty values and original spelling. Display keys are renamed, and broad categories are derived from the original subcategory prefixes. IDs are unchanged. The CSV has framework labels but no individual source-document URLs or Airtable record URLs; links therefore point to the public view. BackDrive's applied-control mappings are separate interpretations.

MIT describes these records as mitigations extracted from 13 frameworks. The collection is not an effectiveness ranking, and its inclusion of a control does not establish that the control works. Some entries were not assigned to one of the 23 substantive subcategories; their original `X` codes are preserved.

To refresh, use **More view options → Download CSV** in the public Airtable view. Run the offline converter with that file and its source date:

```sh
python3 scripts/import_mitigations.py /path/to/public-export.csv --source-date 2025-07-23 --provenance 'Official public Airtable CSV downloaded YYYY-MM-DD'
```

The converter records the import date, file modification time, row count, and SHA-256 checksum. It does not access an account, query private APIs, or schedule future downloads. Review changes before publishing.
