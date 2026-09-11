"""Add locally hosted institution marks to visible names, preserving the copy."""
from pathlib import Path
from html import escape
import json
import re

LOGOS = json.loads((Path(__file__).parent / 'content/institution-logos.json').read_text())
ALIASES = {escape(name): key for key, logo in LOGOS.items() for name in logo['aliases']}
NAMES = re.compile(r'(?<!\w)(?:' + '|'.join(re.escape(name) for name in sorted(ALIASES, key=len, reverse=True)) + r')(?!\w)')


def add_institution_logos(markup):
    def decorate(match):
        name = match[0]
        key = ALIASES[name]
        logo = LOGOS[key]
        # Keep the icon with the first word while allowing long names to wrap.
        first, separator, rest = name.partition(' ')
        image = f'<img class="institution-logo logo-{key}" src="/assets/logos/{logo["file"]}" width="{logo["width"]}" height="20" alt="" aria-hidden="true" decoding="async">'
        return f'<span class="institution-start">{image}{first}</span>{separator}{rest}'

    parts = re.split(r'(<[^>]+>)', markup)
    for index in range(0, len(parts), 2):
        parts[index] = NAMES.sub(decorate, parts[index])
    return ''.join(parts)


def add_markdown_logos(markdown):
    aliases = {name: key for key, logo in LOGOS.items() for name in logo['aliases']}
    names = re.compile(r'(?<!\w)(?:' + '|'.join(re.escape(name) for name in sorted(aliases, key=len, reverse=True)) + r')(?!\w)')
    def decorate(match):
        logo = LOGOS[aliases[match[0]]]
        return f'<img src="https://petervartanian.xyz/assets/logos/{logo["file"]}" width="{logo["width"]}" height="20" alt=""> {match[0]}'
    return names.sub(decorate, markdown)
