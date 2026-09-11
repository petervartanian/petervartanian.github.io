"""Export the rendered CV content as portable Markdown."""
from html import unescape
import re


def export_cv(html):
    def inline(value):
        value = re.sub(r'<sup><a[^>]*>(.*?)</a></sup>', r'[^\1]', value)
        value = re.sub(r'<span class="primary-contribution">(.*?)</span>', r'**\1**', value)
        value = re.sub(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', lambda m: f'[{m[2]}]({m[1]})', value)
        value = re.sub(r'<em>(.*?)</em>', r'*\1*', value)
        value = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', value)
        value = re.sub(r'<br\s*/?>', ' · ', value)
        return unescape(re.sub(r'<[^>]+>', '', value)).strip()

    def table(match):
        attrs, body = match.groups()
        rows = [[inline(cell).replace('|', r'\|') for cell in re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', row, re.S)]
                for row in re.findall(r'<tr\b[^>]*>(.*?)</tr>', body, re.S)]
        if len(rows[0]) == 1:
            return '\n\n' + '\n'.join('- ' + row[0] for row in rows) + '\n\n'
        headers = ['Organization', 'Dates'] if 'experience-table' in attrs else ['Language', 'ILR proficiency'] if 'language-table' in attrs else ['Award', 'Date']
        lines = [headers, ['---', '---']] + rows
        return '\n\n' + '\n'.join('| ' + ' | '.join(row) + ' |' for row in lines) + '\n\n'

    html = re.sub(r'<div class="experience-filter"[^>]*>.*?</div>', '', html, flags=re.S)
    html = re.sub(r'<summary>(.*?)</summary>', r'<h4>\1</h4>', html)
    html = re.sub(r'<a[^>]*class="download-button"[^>]*>.*?</a>', '', html)
    html = html.replace('Shaded entries', 'Bold entries')
    html = re.sub(r'<p class="experience-note"[^>]*><span class="note-badge">(.*?)</span><span>(.*?)</span></p>',
                  lambda m: '\n\n[^' + m[1] + ']: ' + inline(m[2]) + '\n\n', html, flags=re.S)
    html = re.sub(r'<ul[^>]*>(.*?)</ul>', lambda m: '\n\n' + '\n'.join('- ' + inline(item) for item in re.findall(r'<li[^>]*>(.*?)</li>', m[1], re.S)) + '\n\n', html, flags=re.S)
    html = re.sub(r'<table([^>]*)>(.*?)</table>', table, html, flags=re.S)
    html = re.sub(r'<h([1234])[^>]*>(.*?)</h\1>', lambda m: '\n\n' + '#' * int(m[1]) + ' ' + inline(m[2]) + '\n\n', html, flags=re.S)
    html = re.sub(r'<p[^>]*>(.*?)</p>', lambda m: '\n\n' + inline(m[1]) + '\n\n', html, flags=re.S)
    text = inline(html).replace('MIT AI Risk Initiative & Arcola AI', '(1) MIT AI Risk Initiative; (2) Arcola AI')
    text = re.sub(r'\n[ \t]+', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.replace('# Curriculum Vitæ', '# Peter H. Vartanian\n\nCurriculum Vitæ\n\nhttps://petervartanian.xyz/cv/', 1).strip() + '\n'
