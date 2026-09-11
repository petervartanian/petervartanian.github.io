# Peter H. Vartanian

Personal website at https://petervartanian.xyz.

The personal pages are static HTML, CSS, and JavaScript. Update publication and CV records in `content/site.json`, adjust page templates in `build.py`, then run:

```sh
python3 build.py
python3 validate.py
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. Generated pages are checked into the repository for GitHub Pages. The build has no third-party Python dependencies.

Each personal page has its own quiet colour palette in `assets/css/personal.css`. Body text uses Georgia. The name and page titles use locally hosted Sorts Mill Goudy, with its SIL Open Font License in `assets/fonts/OFL.txt`. Navigation works without JavaScript; the script enables the interactive illustration. The CV downloads as Markdown, generated alongside its web page. Publication and experience notes are always visible, with faint decorative patterns. CV headings use Roman numerals and lettered subsections; entries use borderless tables.

The homepage has an interactive SVG mobile with varied coloured shapes and a suspension thread that winds around the introduction. It supports dragging and keyboard input, rests between interactions, and respects reduced-motion preferences. Without JavaScript it remains a static illustration.

`/portfolio/` retains all published writing. `/writing/` is an alias. The old placeholder collection at `/artifacts/` redirects to `/portfolio/`.

The build updates only the personal pages. Other applications in the repository are neither modified nor linked from the personal site.
