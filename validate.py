"""Verify the personal site's content and navigation without third-party packages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from html import unescape
import json
import re
import xml.etree.ElementTree as ET

ROOT=Path(__file__).parent
PAGES=['index.html','portfolio/index.html','cv/index.html','contact/index.html','404.html']

class Page(HTMLParser):
    def __init__(self,path):
        super().__init__(convert_charrefs=True)
        self.refs=[];self.ids=[];self.h1=0;self.lang=False;self.main=False;self.canonical=False;self.og=False;self.text=[]
        self.feed(path.read_text())
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='html': self.lang=bool(a.get('lang'))
        if tag=='h1': self.h1+=1
        if tag=='main': self.main=True
        if 'id' in a:self.ids.append(a['id'])
        if tag in ('a','link','script','img'):
            url=a.get('href',a.get('src',''))
            if url: self.refs.append(url)
        if tag=='link' and a.get('rel')=='canonical':self.canonical=True
        if tag=='meta' and a.get('property')=='og:image':
            self.og=True
            self.refs.append(urlsplit(a['content']).path)
    def handle_data(self,d): self.text.append(d)

pages={name:Page(ROOT/name) for name in PAGES}
failures=[]
def check(condition,message):
    if not condition:failures.append(message)

for name,p in pages.items():
    check(not re.search(r"\b(?:I[’']m|I[’']ve|I[’']ll|we[’']re|you[’']re|don[’']t|doesn[’']t|can[’']t|won[’']t|isn[’']t|it[’']s)\b", ' '.join(p.text), re.I), f'{name}: contraction in page copy')
    check(p.h1==1 and p.main and p.lang,f'{name}: missing accessible page structure')
    check(p.canonical and p.og,f'{name}: missing share metadata')
    check(len(set(p.ids))==len(p.ids),f'{name}: duplicate IDs')
    check('/artifacts/' not in p.refs,f'{name}: empty collection still in navigation')
    check(not any(url in p.refs for url in ['/projects/','/haruspex/','/agency-costs/']),f'{name}: unrequested project is linked')
    for url in p.refs:
        parts=urlsplit(url)
        if parts.scheme or parts.netloc:continue
        target=(ROOT/parts.path.lstrip('/')) if parts.path.startswith('/') else (ROOT/name).parent/parts.path
        if not parts.path:target=ROOT/name
        if target.is_dir():target/='index.html'
        check(target.is_file(),f'{name}: missing link or asset {url}')
        if parts.fragment and target.is_file() and target.suffix=='.html':
            ids=Page(target).ids
            check(unquote(parts.fragment) in ids,f'{name}: missing anchor {url}')

data=json.loads((ROOT/'content/site.json').read_text())
logo_data=json.loads((ROOT/'content/institution-logos.json').read_text())
for key, logo in logo_data.items():
    check((ROOT/'assets/logos'/logo['file']).is_file(), f'Missing institution logo: {key}')
    check(f'logo-{key}"' in (ROOT/'cv/index.html').read_text(), f'Institution logo absent from CV: {key}')
cv_html=(ROOT/'cv/index.html').read_text()
for row in re.findall(r'<tr>(.*?)</tr>', cv_html.split('id="education"')[0], re.S):
    check('institution-logo' in row, 'Experience entry is missing its institution mark')
archive=re.sub(r'\s+', ' ', ' '.join(pages['portfolio/index.html'].text))
for work in data['writings']:
    check(work['title'] in archive,f'Missing publication: {work["title"]}')
    check(work['url'] in pages['portfolio/index.html'].refs,f'Missing publication URL: {work["title"]}')
    check(work['venue'] in archive,f'Missing venue: {work["title"]}')
    clean=re.sub(r'[†‡§]','',work['credit']).strip()
    check(all(part.strip() in archive for part in clean.split(' · ')),f'Missing authorship or date: {work["title"]}')
cv=''.join(pages['cv/index.html'].text)
check('Curriculum Vitæ' in cv, 'CV title must use vitæ')
writing_html=(ROOT/'portfolio/index.html').read_text()
check('<details id="publication-notes"' not in writing_html and 'note-box' not in writing_html and all(f'<p id="publication-note-{i}">' in writing_html for i in [1, 2, 4]), 'Notes must remain visible together without separate boxes')
check('Peter’s Memos' in archive, 'Missing memo section')
check('brunellaism' not in writing_html, 'Removed post must not be linked')
check('<ol' not in (ROOT/'cv/index.html').read_text(), 'Only CV headings and subheadings should be numbered')
for numeral in ['I.', 'II.', 'III.', 'IV.']:
    check(numeral in cv, f'Missing CV section number {numeral}')
for entry in data['cv']['experience']:
    org=re.sub(r'[*/]+$','',entry['organization'])
    check(org in cv and entry['dates'] in cv,f'Missing CV entry: {org}')
for section in data['cv']['sections']:
    if section['label'] in ('Education',) or section['label'].startswith('Languages'):continue
    for item in section['items']:check(item in cv,f'Missing CV detail: {item}')
for org in ['Occidental College','California Institute of Technology','3.97/4.00','4.00/4.00','Classical Nahuatl','Arabic (Fuṣḥā and Lebanese)']:
    check(org in cv,f'Missing education/language detail: {org}')
markdown = (ROOT/'cv/peter-vartanian-cv.md').read_text()
markdown = re.sub(r'<img\b[^>]*>\s*', '', markdown)
check('download="peter-vartanian-cv.md"' in (ROOT/'cv/index.html').read_text(), 'CV download link is missing')
for entry in data['cv']['experience']:
    org = re.sub(r'[*/]+$', '', entry['organization'])
    check(org in markdown and entry['dates'] in markdown, f'Markdown CV omits {org}')
for label in ['Experience', 'Education', 'Languages', 'Skills & methods']:
    check(label in markdown, f'Markdown CV omits section {label}')
for institution, honors in data['cv']['institution_honors'].items():
    for honor in honors:
        for value in [honor['title'], honor['date']]:
            check(value in cv and value in markdown, f'Missing honor for {institution}: {value}')
check('>Awards</strong>' not in (ROOT/'cv/index.html').read_text(), 'Standalone Awards section remains')
for marker in ['i', 'ii', 'iii', 'iv']:
    check(f'[^{marker}]:' in markdown, f'Markdown CV omits note {marker}')
for path in ['sitemap.xml','feed.xml']:ET.parse(ROOT/path)
check('artifacts' not in (ROOT/'sitemap.xml').read_text(),'Placeholder route remains in sitemap')
check('url=/portfolio/' in (ROOT/'artifacts/index.html').read_text(),'Old artifacts bookmarks do not redirect')
if failures:
    raise SystemExit('\n'.join(failures))
print(f'Passed: {len(PAGES)} pages; {len(data["writings"])} publications; {len(data["cv"]["experience"])} experience entries; content, links, anchors, metadata, and redirects.')
