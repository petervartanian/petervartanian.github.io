#!/usr/bin/env python3
"""Normalize an official public MIT mitigation CSV export without network access."""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
from datetime import datetime, timezone
from pathlib import Path

PUBLIC_VIEW = 'https://airtable.com/appUJl8KRAUMeIVXs/shrWzxZUTPzwAEZ2u/tblkm9TrIQ0dW8IJY'
SOURCE_PAGE = 'https://airisk.mit.edu/ai-risk-mitigations'
CATEGORIES = {
    '1': 'Governance & Oversight Controls',
    '2': 'Technical & Security Controls',
    '3': 'Operational Process Controls',
    '4': 'Transparency & Accountability Controls',
    'X': 'Not categorized',
}
REQUIRED = ['Action ID', 'Action Name', 'Action Definition', 'Action Source', 'MitigationCode']


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv', type=Path, help='CSV downloaded from the public MIT mitigation view')
    parser.add_argument('--output-dir', type=Path, default=Path(__file__).resolve().parents[1] / 'imports')
    parser.add_argument('--source-date', default='2025-07-23', help='Date in the public database title')
    parser.add_argument('--imported-at', default=datetime.now(timezone.utc).date().isoformat())
    parser.add_argument('--provenance', default='Local public CSV export; not a live synchronization')
    args = parser.parse_args()
    raw = args.csv.read_bytes()
    reader = csv.DictReader(io.StringIO(raw.decode('utf-8-sig')))
    if reader.fieldnames != REQUIRED:
        raise SystemExit(f'Unexpected headers: {reader.fieldnames!r}')
    original_rows = list(reader)
    records = []
    seen = set()
    for row in original_rows:
        identifier = row['Action ID']
        if not identifier or identifier in seen:
            raise SystemExit(f'Missing or duplicate Action ID: {identifier!r}')
        seen.add(identifier)
        code = row['MitigationCode']
        prefix = code.split('.', 1)[0]
        records.append({
            'id': identifier,
            'name': row['Action Name'],
            'description': row['Action Definition'],
            'category': CATEGORIES.get(prefix, 'Not categorized'),
            'subcategory': code,
            'framework': row['Action Source'],
            'sourceUrl': PUBLIC_VIEW,
            'sourceReference': row['Action Source'],
            'original': row,
        })
    metadata = {
        'title': 'MIT AI Risk Mitigation Database',
        'sourceTitle': f'[PUBLIC] Mitigation Database {args.source_date}',
        'sourceDate': args.source_date,
        'importedAt': args.imported_at,
        'sourceUrl': SOURCE_PAGE,
        'publicViewUrl': PUBLIC_VIEW,
        'sourceFilename': args.csv.name,
        'sourceFileModifiedAt': datetime.fromtimestamp(args.csv.stat().st_mtime, timezone.utc).isoformat(),
        'provenance': args.provenance,
        'recordCount': len(records),
        'frameworkCount': len({row['Action Source'] for row in original_rows}),
        'sha256': hashlib.sha256(raw).hexdigest(),
        'license': 'CC BY 4.0',
        'licenseUrl': 'https://creativecommons.org/licenses/by/4.0/',
        'attribution': 'MIT AI Risk Initiative / MIT FutureTech, AI Risk Mitigation Database, July 23, 2025 export.',
        'transformations': 'Original five CSV fields retained verbatim. Display keys renamed; broad category derived from the original subcategory prefix.',
        'evidenceNote': 'These are mitigations extracted from frameworks. Inclusion does not establish effectiveness.',
        'sourceLinkNote': 'The CSV contains framework labels but no original-document URLs or Airtable record URLs. Source links open the public database; original IDs are preserved.',
    }
    args.output_dir.mkdir(parents=True, exist_ok=True)
    (args.output_dir / 'mitigations.csv').write_bytes(raw)
    (args.output_dir / 'mitigations.js').write_text(
        'window.BACKDRIVE_MITIGATIONS = ' + json.dumps({'metadata': metadata, 'records': records}, ensure_ascii=False, indent=2) + ';\n'
    )
    print(json.dumps({'records': len(records), 'frameworks': metadata['frameworkCount'], 'sha256': metadata['sha256']}))


if __name__ == '__main__':
    main()
