"""Build Peter's personal pages with Python 3 and no dependencies."""
from pathlib import Path
from html import escape as e
import json
import re
from hashlib import sha256
from cv_markdown import export_cv
from institution_logos import add_institution_logos, add_markdown_logos

ROOT = Path(__file__).parent
DATA = json.loads((ROOT / 'content/site.json').read_text())
NAV = [('home', 'Home', '/'), ('writing', 'Writing', '/portfolio/'), ('cv', 'CV', '/cv/'), ('contact', 'Contact', '/contact/')]
COLORS = {'home': '#faf8f7', 'writing': '#faf5f3', 'cv': '#f4f7fa', 'contact': '#f8f4f9'}
CSS_VERSION = sha256((ROOT / 'assets/css/personal.css').read_bytes()).hexdigest()[:12]
JS_VERSION = sha256((ROOT / 'assets/js/personal.js').read_bytes()).hexdigest()[:12]


def page(key, title, description, body, path):
    if key == 'cv':
        body = add_institution_logos(body)
    nav_parts = []
    for i, (k, label, url) in enumerate(NAV):
        if i:
            nav_parts.append('<span class="nav-divider" aria-hidden="true"></span>')
        nav_parts.append(f'<a href="{url}"'+(' aria-current="page"' if key == k else '')+f'>{label}</a>')
    nav = '\n'.join(nav_parts)
    name_tag = 'h1' if key == 'home' and path == '/' else 'div'
    name = 'Peter <span class="name-anchor">H.</span> Vartanian' if key == 'home' else 'Peter H. Vartanian'
    image_version = sha256((ROOT / f'assets/img/social-{key}.png').read_bytes()).hexdigest()[:12]
    image_url = f'https://petervartanian.xyz/assets/img/social-{key}.png?v={image_version}'
    image_alt = f'Peter H. Vartanian — {title}, with a composition of colored mobile shapes'
    html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(title)} — Peter H. Vartanian</title>
  <meta name="description" content="{e(description)}">
  <meta name="theme-color" content="{COLORS[key]}">
  <link rel="canonical" href="https://petervartanian.xyz{path}">
  <meta property="og:title" content="{e(title)} — Peter H. Vartanian">
  <meta property="og:description" content="{e(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://petervartanian.xyz{path}">
  <meta property="og:image" content="{image_url}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="{e(image_alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{e(title)} — Peter H. Vartanian">
  <meta name="twitter:description" content="{e(description)}">
  <meta name="twitter:image" content="{image_url}">
  <meta name="twitter:image:alt" content="{e(image_alt)}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="alternate" type="application/atom+xml" title="Writing" href="/feed.xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/SortsMillGoudy-Regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="/assets/css/personal.css?v={CSS_VERSION}">
  <script src="/assets/js/personal.js?v={JS_VERSION}" defer></script>
</head>
<body data-page="{key}">
  <a class="skip" href="#main">Skip to content</a>
  <div class="page">
    <header>
      <{name_tag} class="site-name"><a href="/">{name}</a></{name_tag}>
      <nav aria-label="Main navigation">{nav}</nav>
    </header>
    <main id="main">{body}</main>
    <footer>© 2026 Peter H. Vartanian</footer>
  </div>
</body>
</html>
'''
    target = ROOT / path.strip('/') / 'index.html' if path != '/' else ROOT / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html)


mobile_parts = [
    ('Purple semicircle', (117, 164), (117, 114), (0, 0), '<path fill="#60336d" d="M-66 0A66 66 0 1 0 66 0Z" transform="rotate(-18)"/>'),
    ('Oxidized teal oval', (421, 193), (421, 118), (0, 0), '<ellipse fill="#4e8983" rx="49" ry="74" transform="rotate(27)"/>'),
    ('Acid chartreuse quadrilateral', (207, 258), (202.4375, 216), (0, 0), '<path fill="#bac746" fill-rule="evenodd" d="M-39-12 26-47 49 18-18 54Z M-3-10a11 11 0 1 0 22 0a11 11 0 1 0-22 0 M-14 23a5 5 0 1 0 10 0a5 5 0 1 0-10 0"/>'),
    ('Clay circle', (47, 317), (47, 282), (0, 0), '<circle fill="#bf7459" r="25"/>'),
    ('Saffron oval', (279, 302), (295.7525, 218.76), (0, 0), '<ellipse fill="#d3a035" rx="50" ry="22" transform="rotate(-28)"/>'),
    ('Ink pebble', (455, 324), (455, 282), (0, 0), '<path fill="#303e45" d="M-43-4Q-9-60 30-14Q63 38 2 47Q-40 53-43-4"/>'),
    ('Terracotta ring', (130, 389), (130, 351), (0, -23), '<circle fill="none" stroke="#bd6849" stroke-width="10" r="23"/>'),
    ('Slate blue wavy strip', (330, 396), (330, 365), (-17, -24), '<path fill="none" stroke="#557ba1" stroke-width="13" stroke-linecap="round" d="M-17-24C17-24-17 0 12 0S-10 24 19 24"/>'),
    ('Mulberry crescent', (299, 150), (299.72, 63.6), (-10, -24), '<path fill="#985975" d="M18-27A32 32 0 1 0 18 27A25 25 0 0 1 18-27Z"/>'),
    ('Cinnabar burst', (50, 230), (117, 114), (0, -22), '<path fill="#c94b40" d="M0-22 4-6 18-13 9-2 29 3 8 7 14 22 1 12-8 29-7 8-23 11-12 0-21-12-5-7Z"/>'),
    ('Tangerine pennant', (190, 125), (183.8025, 72.015), (0, -17), '<path fill="#e77f31" d="M0-17 11 1 3 9 8 31-4 19-7-2Z"/>'),
    ('Periwinkle spiral', (368, 108), (366.1052, 77.796), (0, -14), '<path fill="none" stroke="#7b87d2" stroke-width="3.5" stroke-linecap="round" d="M0-14C19-14 23 13 5 17C-10 21-20 5-11-5C-5-12 7-8 8 0C9 6 2 9-2 5"/>'),
    ('Celadon wishbone', (364, 287), (382.04, 242.16), (0, -15), '<path fill="none" stroke="#91b798" stroke-width="8" stroke-linecap="round" d="M0-15Q-3 5-17 19M0-15Q0 10 15 26"/>'),
    ('Hot coral bracket', (213, 391), (223.6, 332.7025), (5, -16), '<path fill="none" stroke="#ce527e" stroke-width="7" stroke-linecap="round" d="M5-16H-7V16H5"/>'),
    ('Three linked rhombi', (427, 402), (425, 380), (0, -10), '<path fill="#747b38" stroke="#747b38" stroke-width="2.6" stroke-linejoin="round" d="M0-10 8 0 0 11-8 0Z"/><path fill="#a69745" stroke="#a69745" stroke-width="2.6" stroke-linejoin="round" d="M0 8 12 21 0 35-12 21Z"/><path fill="#747b38" d="M0 32 6 41 0 51-6 41Z"/>')
]
# Scale the attachment with its shape so every suspension line stays connected.
piece_scales = {3: .7, 5: 1.08, 8: .85, 9: .7, 10: 1.45, 11: .8, 12: 1.35, 13: 1.25, 14: .8}
mobile_parts = [(name, home, mount, (ax * piece_scales.get(i, 1), ay * piece_scales.get(i, 1)),
                 f'<g transform="scale({piece_scales.get(i, 1)})">{shape}</g>')
                for i, (name, home, mount, (ax, ay), shape) in enumerate(mobile_parts)]
mobile = '<figure class="mobile-figure"><div class="sculpture"><svg class="mobile-svg" viewBox="0 0 520 450" role="img" aria-labelledby="mobile-title"><title id="mobile-title">A hanging composition of fifteen colored paper shapes</title>'
mobile += '<g class="mobile-wires" fill="none" stroke="currentColor" stroke-width="1.25"><path d="M266 10V68 M117 114Q191 48 266 68Q352 48 421 118 M266 68V216 M47 282Q133 205 266 216Q366 221 455 282 M266 216L260 340 M130 351Q215 321 260 340Q305 322 330 365Q389 359 425 380"/>'
for i, (_, (x, y), (mx, my), (ax, ay), _) in enumerate(mobile_parts):
    mobile += f'<path data-wire="{i}" d="M{mx} {my}L{x + ax} {y + ay}"/>'
mobile += '</g>'
for i, (name, (x, y), (mx, my), (ax, ay), shape) in enumerate(mobile_parts):
    if i >= 9:
        shape = '<circle r="18" fill="transparent"/>' + shape
    mobile += f'<g class="mobile-piece" data-piece="{i}" data-name="{name}" data-home="{x},{y}" data-mount="{mx},{my}" data-attachment="{ax},{ay}" transform="translate({x} {y})">{shape}</g>'
mobile += '</svg></div></figure>'

home = f'''<div class="introduction">
  <p>I am a pertinacious thinker-and-doer who hails from <a href="https://mapcarta.com/N1938447213">Weng</a>, a hamlet in the Tyrolean Alps.</p>
  <p>I studied diplomacy and world affairs alongside literature and culture at Occidental College in Los Angeles, with additional coursework at Caltech. My work has taken me to the world’s highest deliberative fora, <em>incl.</em> the UN.</p>
  <p>I now live in Cambridge, Massachusetts, where I lead — at <a href="https://airisk.mit.edu/">MIT’s AI Risk Initiative</a> and <a href="https://www.arcolaai.com/about">Arcola AI</a> — the first ecosystem-wide study of how people interact with AI-incident data(bases).</p>
  {mobile}
</div>'''
page('home', 'Home', 'Research and writing by Peter H. Vartanian.', home, '/')


def writing_row(item, index):
    title = e(item['title'])
    if item['title'] != 'omphalOS':
        title = f'“{title}”'
    note = {1: '†', 2: '‡', 4: '§'}.get(index, '')
    credit = item['credit'].replace(note, '').strip() if note else item['credit']
    credit_lines = '<br>'.join(e(part.strip()) for part in credit.split(' · '))
    note_link = f'<sup><a class="note-ref" href="#publication-note-{index}" aria-label="Publication note {note}">{note}</a></sup>' if note else ''
    return f'''<li class="publication">
  <a class="publication-title" href="{e(item['url'])}">{title}</a>
  <p class="venue"><em>{e(item['venue'])}</em></p>
  <p class="credit">{credit_lines}{note_link}</p>
</li>'''


writing = '<h1>Writing</h1>\n'
year = None
for index, work in enumerate(DATA['writings']):
    next_year = work['published'][:4]
    if next_year != year:
        if year is not None: writing += '</ul></section>\n'
        writing += f'<section class="writing-year"><h2>{next_year}</h2><ul role="list" class="publication-list">\n'
        year = next_year
    writing += writing_row(work, index)
writing += '</ul></section>\n'
publication_notes = [
    '† This white paper received the Director’s Award from Fmr. SecState Condoleezza Rice. The publication contains an incorrect institutional affiliation; it should read Fas/Jus. <a href="/cv/">See CV.</a>',
    '‡ “Geo-legality” was cited and discussed by Hakkı Öcal in <em>Daily Sabah</em> on January 26, 2026.',
    '§ The accompanying Python/Rust/Go toolkit contains more than 20,000 SQL queries for detecting illicit procurement of AI and dual-use hardware, as well as luxury goods.'
]
writing += '<section id="publication-notes" class="publication-notes"><h2>Notes</h2>' + ''.join(f'<p id="publication-note-{index}"><span class="note-badge">{note[0]}</span><span>{note[2:]}</span></p>' for index, note in zip([1, 2, 4], publication_notes)) + '</section>'
writing += '''<section class="memos"><h2>Peter’s Memos</h2>
<ul class="memo-outline" role="list"><li><span class="memo-mark" aria-hidden="true">¶</span><p>In Kevin Roose’s <a href="https://us.macmillan.com/books/9780374618766/theagichronicles/"><em>The AGI Chronicles</em></a>, researchers and founders circulate memos to develop ideas and submit them to scrutiny.</p>
<ul role="list"><li><span class="memo-mark" aria-hidden="true">↳</span><p>My Substack, <a href="https://substack.com/@petersmemos">Peter’s Memos</a>, borrows that form to keep my penchant for long-form writing from yielding only a library of unfinished drafts.</p></li></ul>
</li></ul></section>'''
page('writing', 'Writing', 'Published writing on security, resources, law, and technology.', writing, '/portfolio/')


cv = DATA['cv']
NOTE_NUMERALS = {1: 'i', 2: 'ii', 3: 'iii', 4: 'iv'}


def org_name(text):
    match = re.search(r'([*/]+)$', text)
    if not match: return e(text)
    markers = match.group().split('/')
    name = e(text[:match.start()])
    if '*' in markers:
        name = f'<span class="primary-contribution">{name}</span>'
    for marker in markers:
        if marker == '*': continue
        number = len(marker) - 1
        name += f'<sup><a class="note-badge" href="#experience-note-{number}" aria-label="Experience note {NOTE_NUMERALS[number]}">{NOTE_NUMERALS[number]}</a></sup>'
    return name


def date_range(text):
    parts = text.split(' – ', 1)
    if len(parts) == 2:
        return f'<span class="date-part">{e(parts[0])} –</span> <span class="date-part">{e(parts[1])}</span>'
    return f'<span class="date-part">{e(text)}</span>'


def experience_rows(rows):
    result = ''
    for row in rows:
        organization = org_name(row['organization'])
        result += f'<tr><th scope="row">{organization}</th><td>{date_range(row["dates"])}</td></tr>\n'
        if row['organization'].startswith('Hoover Institution'):
            for award in cv['institution_honors']['Hoover Institution']:
                result += f'<tr class="experience-award-row"><th scope="row"><span class="experience-award">{e(award["title"])}</span></th><td>{date_range(award["date"])}</td></tr>\n'
    return result


def institution_honors(institution, academic=False):
    items = cv['institution_honors'][institution]
    if institution == 'Occidental College':
        items = [item for item in items if item['title'].startswith('ΦBK') == academic]
    return ''.join(f'<li><span class="education-award"><span>{e(item["title"])}</span> <span class="education-award-date">{e(item["date"])}</span></span></li>' for item in items)

experience = '<h3>Current</h3><table class="cv-table experience-table" aria-label="Current experience and dates"><tbody>' + experience_rows(cv['experience'][:1]) + '</tbody></table><h3>Previous</h3><table class="cv-table experience-table" aria-label="Previous experience and dates"><tbody>' + experience_rows(cv['experience'][1:]) + '</tbody></table>'


def cv_text(text):
    return re.sub(r'(?<!\w)(?:e\.g\.|i\.e\.|etc\.|incl\.|via\b)', lambda match: f'<em>{match.group()}</em>', e(text))


cv_notes = [
    'Facilitated by the <a href="https://www.cbai.ai/">Cambridge Boston Alignment Initiative</a> (CBAI) and <a href="https://coefficientgiving.org/">Coefficient Giving</a>.',
    'Facilitated by the <a href="https://sparai.org/">Supervised Program for Alignment Research</a> (SPAR) and <a href="https://kairos-project.org/">Kairos</a>.',
    'Supported by a micro-grant from a confidential European family office.',
    'Undertaken as a return engagement.'
]
experience_notes = '<aside id="experience-notes" class="experience-notes" aria-labelledby="experience-notes-title"><h3 id="experience-notes-title">Notes</h3><p class="contribution-key"><span class="primary-contribution">Shaded entries</span> indicate primary authorship or substantive responsibility for my work undertaken.</p>' + ''.join(f'<p class="experience-note" id="experience-note-{i}"><span class="note-badge">{NOTE_NUMERALS[i]}</span><span>{note}</span></p>' for i, note in enumerate(cv_notes, 1)) + '</aside>'
cv_sections = ''
for section in cv['sections']:
    if section['label'] == 'Education':
        label, anchor = 'Education', 'education'
        content = f'''<div class="education-item"><h3>Occidental College</h3>
<p class="dates"><span class="date-part">Aug. 2021 –</span> <span class="date-part">May 2025</span></p>
<div class="education-group"><p>Bachelor of Arts with Honors</p>
<ul class="education-list"><li><span class="education-label">Major #1</span>: Stuart Chevalier Program in Diplomacy + World Affairs (DWA)</li><li><span class="education-label">Major #2</span>: Comparative Studies in Literature + Culture (CSLC)</li></ul></div>
<details class="academic-record"><summary>Distinctions</summary>
<div class="education-group" id="honors"><p class="record-label">Honors</p>
<ul class="education-list"><li>GPA: 3.97/4.00</li><li><em>Summa cum Laude</em></li>{institution_honors("Occidental College", academic=True)}</ul></div>
<div class="education-group" id="awards"><p class="record-label">Awards</p>
<ul class="education-list">{institution_honors("Occidental College")}</ul></div></details></div>
<div class="education-item"><h3>California Institute of Technology</h3>
<p class="dates"><span class="date-part">Aug. 2021 –</span> <span class="date-part">May 2025</span></p>
<div class="education-group"><p>Special Student</p>
<ul class="education-list"><li><span class="education-label">Field of study</span>: Social Science (SS)</li></ul></div>
<details class="academic-record"><summary>Distinctions</summary>
<div class="education-group"><p class="record-label">Honors</p><ul class="education-list"><li>GPA: 4.00/4.00</li></ul></div>
<div class="education-group"><p class="record-label">Awards</p><ul class="education-list">{institution_honors("California Institute of Technology")}</ul></div></details></div>'''
    elif section['label'].startswith('Languages'):
        label, anchor = 'Languages', 'languages'
        content = '<section class="cv-subsection"><h3><span class="subsection-number">A.</span> Modern languages</h3><p class="quiet">My proficiencies follow the <a href="https://www.govtilr.org/Skills/ILRscale2.htm">ILR’s 0–5 scale</a> (with + marking intermediate levels).</p><table class="cv-table language-table" aria-label="Modern languages and ILR proficiency"><tbody>'
        for item in section['items']:
            if not item['level']: continue
            if item['name'] == 'Lebanese': continue
            name = 'Arabic (Fuṣḥā and Lebanese)' if item['name'] == 'Fuṣḥā' else item['name']
            content += f'<tr><th scope="row">{e(name)}</th><td>{e(item["level"])}</td></tr>'
        content += '</tbody></table></section><section class="cv-subsection"><h3><span class="subsection-number">B.</span> Philological training</h3><table class="cv-table" aria-label="Philological training"><tbody><tr><td>Ancient Greek</td></tr><tr><td>Classical Latin</td></tr><tr><td>Classical Nahuatl</td></tr></tbody></table></section>'
    else:
        label = section['label']
        anchor = re.sub(r'[^a-z]+', '-', label.lower()).strip('-')
        content = f'<table class="cv-table" aria-label="{e(label)}"><tbody>' + ''.join('<tr><td>'+cv_text(item)+'</td></tr>' for item in section['items']) + '</tbody></table>'
    major = {'Education': 'II', 'Languages': 'III'}
    minor = {'Programming': 'A', 'Tools + platforms': 'B', 'AI / Security': 'C', 'Methods': 'D'}
    if label == 'Programming':
        cv_sections += '<section class="cv-section" id="skills"><h2><span class="section-number">IV.</span> <strong class="section-text">Skills &amp; methods</strong></h2>'
    if label in minor:
        cv_sections += f'<section class="cv-subsection" id="{anchor}"><h3><span class="subsection-number">{minor[label]}.</span> {e(label)}</h3>{content}</section>\n'
    else:
        cv_sections += f'<section class="cv-section" id="{anchor}"><h2><span class="section-number">{major[label]}.</span> <strong class="section-text">{e(label)}</strong></h2>{content}</section>\n'
cv_sections += '</section>'
about = f'''<div class="title-line"><h1>Curriculum Vitæ</h1><a class="download-button" href="/cv/peter-vartanian-cv.md" download="peter-vartanian-cv.md">Download .MD</a></div>
<section class="cv-section" id="experience"><h2><span class="section-number">I.</span> <strong class="section-text">Experience</strong></h2>{experience}{experience_notes}</section>
{cv_sections}'''
page('cv', 'CV', 'Education, experience, languages, and research methods.', about, '/cv/')
(ROOT / 'cv/peter-vartanian-cv.md').write_text(add_markdown_logos(export_cv(about)))

socials = [('LinkedIn', 'https://www.linkedin.com/in/petervartanian/'), ('Substack', 'https://substack.com/@petersmemos'), ('GitHub', 'https://github.com/petervartanian'), ('Hugging Face', 'https://huggingface.co/petervartanian'), ('X', 'https://x.com/petersmemos'), ('Google Scholar', 'https://scholar.google.com/citations?user=DuD0EXEAAAAJ'), ('ORCID', 'https://orcid.org/0009-0009-8538-5811')]
social_order = ['LinkedIn', 'Substack', 'GitHub', 'X', 'Hugging Face', 'Google Scholar', 'ORCID']
socials.sort(key=lambda item: social_order.index(item[0]))
profile_values = {'LinkedIn': '@petervartanian', 'Substack': '@petersmemos', 'GitHub': '@petervartanian', 'Hugging Face': '@petervartanian', 'X': '@petersmemos', 'Google Scholar': 'DuD0EXEAAAAJ', 'ORCID': '0009-0009-8538-5811'}
def contact_label(label):
    icon = {'Email': 'email', 'Text': 'phone'}.get(label, label.lower().replace(' ', '-'))
    return f'<span class="contact-label"><img src="/assets/icons/{icon}.svg" class="contact-icon" width="19" height="19" alt="" aria-hidden="true"><span>{e(label)}</span></span>'


contact = f'''<h1>Contact</h1>
<p>I am happy to hear from you!</p>
<table class="cv-table contact-table" aria-label="Contact details"><tbody><tr><th scope="row">{contact_label("Email")}</th><td><a href="mailto:peter.vartanian@icloud.com">peter.vartanian@icloud.com</a></td></tr><tr><th scope="row">{contact_label("Text")}</th><td><a href="sms:+17477869132">+1 747 786 9132</a></td></tr></tbody></table>
<p class="profile-intro">You can also find me on:</p><table class="cv-table contact-table" aria-label="Profiles"><tbody>''' + ''.join(f'<tr><th scope="row">{contact_label(label)}</th><td><a href="{e(url)}">{e(profile_values[label])}</a></td></tr>' for label, url in socials) + '</tbody></table>'
page('contact', 'Contact', 'Get in touch with Peter H. Vartanian.', contact, '/contact/')

# Preserve old bookmarks, without publishing an empty collection.
for old, destination in [('artifacts', '/portfolio/'), ('writing', '/portfolio/')]:
    directory = ROOT / old
    directory.mkdir(exist_ok=True)
    (directory / 'index.html').write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0; url={destination}"><link rel="canonical" href="https://petervartanian.xyz{destination}"><meta name="robots" content="noindex"><title>Page moved</title></head><body><p>This page has moved. <a href="{destination}">Continue to writing.</a></p></body></html>')

page('home', 'Page not found', 'This page could not be found.', '<h1>Page not found</h1><p><a href="/">Return to the homepage.</a></p>', '/404-temp/')
(ROOT / '404.html').write_text((ROOT / '404-temp/index.html').read_text().replace('https://petervartanian.xyz/404-temp/', 'https://petervartanian.xyz/404.html'))
(ROOT / '404-temp/index.html').unlink()
(ROOT / '404-temp').rmdir()

paths = [url for _, _, url in NAV]
(ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>https://petervartanian.xyz{p}</loc></url>\n' for p in paths) + '</urlset>\n')
(ROOT / 'llms.txt').write_text('# Peter H. Vartanian\n\nResearch and writing in international security, AI governance, law, and resources.\n\n' + ''.join(f'- [{label}](https://petervartanian.xyz{url})\n' for _, label, url in NAV))
(ROOT / 'humans.txt').write_text('Name: Peter H. Vartanian\nSite: https://petervartanian.xyz/\nTypography: Georgia; Sorts Mill Goudy by Barry Schwartz (name and titles)\n')
entries = ''.join(f'<entry><title>{e(w["title"])}</title><id>{e(w["url"])}</id><link href="{e(w["url"])}"/><published>{w["published"]}T12:00:00Z</published><updated>{w["published"]}T12:00:00Z</updated><summary>{e(w["venue"]+" · "+w["credit"])}</summary></entry>' for w in DATA['writings'])
(ROOT / 'feed.xml').write_text('<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en"><title>Peter H. Vartanian — Writing</title><id>https://petervartanian.xyz/</id><link href="https://petervartanian.xyz/feed.xml" rel="self"/><link href="https://petervartanian.xyz/portfolio/"/><updated>2026-09-11T00:00:00Z</updated><author><name>Peter H. Vartanian</name></author>' + entries + '</feed>\n')
manifest = json.loads((ROOT / 'site.webmanifest').read_text())
manifest.update(description='Research and writing by Peter H. Vartanian.', background_color=COLORS['home'], theme_color=COLORS['home'])
manifest.pop('screenshots', None)
(ROOT / 'site.webmanifest').write_text(json.dumps(manifest, indent=2) + '\n')
print('Built four personal pages, redirects, 404, and site metadata.')
