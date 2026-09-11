"""Add locally hosted institution marks to visible names, preserving the copy."""
from pathlib import Path
from html import escape
import json
import re

LOGOS = json.loads((Path(__file__).parent / 'content/institution-logos.json').read_text())
ALIASES = {escape(name): key for key, logo in LOGOS.items() for name in logo['aliases']}
NAMES = re.compile(r'(?<!\w)(?:' + '|'.join(re.escape(name) for name in sorted(ALIASES, key=len, reverse=True)) + r')(?!\w)')


def add_institution_logos(markup):
    def decorate(match, number=None):
        name = match[0]
        key = ALIASES[name]
        logo = LOGOS[key]
        if number is not None:
            name = f'({number}) {name}'
        image = f'<img class="institution-logo logo-{key}" src="/assets/logos/{logo["file"]}" width="{logo["width"]}" height="{logo["height"]}" alt="" aria-hidden="true" decoding="async">'
        return f'<span class="institution-entry"><span class="institution-logo-slot">{image}</span><span class="institution-name"><span class="institution-text">{name}</span></span></span>'

    parts = re.split(r'(<[^>]+>)', markup)
    for index in range(0, len(parts), 2):
        if parts[index] == 'MIT AI Risk Initiative &amp; Arcola AI':
            parts[index] = ' '.join(decorate(match, number) for number, match in enumerate(NAMES.finditer(parts[index]), 1))
        else:
            parts[index] = NAMES.sub(decorate, parts[index])
    result = ''.join(parts)
    # Keep joint affiliations in the same row, with each name aligned to its mark.
    result = result.replace('</span></span></span> &amp; <span class="institution-entry">', ' &amp;</span></span></span> <span class="institution-entry">')
    # Keep footnote references attached to the final institution name.
    result = re.sub(r'</span></span></span>(</span>)?(<sup>.*?</sup>)', lambda m: m[2] + '</span></span></span>' + (m[1] or ''), result)
    return result
