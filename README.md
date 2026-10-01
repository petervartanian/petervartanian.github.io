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

## AI Risk Correlator

`/correlator/` contains the compiled AI Risk Correlator app, with its own namespaced assets and embeddable views. The source project is maintained separately; the personal-page build must not rewrite these files. The unpublished preprint PDF is not part of the public package. Draft citations point to the access-controlled Overleaf project.

The former `/x-oscope/` and `/auspex/` applications have been removed; their entry pages redirect to `/correlator/`. Git history retains the previous versions. The `/200/` catalogue uses the new name and URL, including a presentation migration for previously encrypted catalogues. Its authentication and encrypted research resources are unchanged.

Shared links use four 1200 × 630 preview images with backgrounds matching their pages. The preview artwork can be regenerated with `scripts/preview_cards.py` (Pillow) and `scripts/render_preview_cards.cjs` (Sharp); these optional tools are not needed to build the site. Approved PNGs live in `assets/img/social-*.png`.

## 200

`/200/` is an unlisted experiment directory. Its catalog and Arcolens resources are encrypted with AES-256-GCM before publication. The password derives a non-extractable browser key using PBKDF2-SHA-256 with a random 32-byte salt and 600,000 iterations. No password or plaintext Arcolens export is committed. The existing public tools retain their original direct URLs; inclusion in this directory does not make those older routes private.

A service worker scoped to `/200/` decrypts pages and downloads after unlocking. An eight-hour session stores a non-extractable key in IndexedDB, never the password; Lock clears access and returns open experiment tabs to the gate. Decrypted responses use `Cache-Control: no-store`. The directory is excluded from the sitemap and has `noindex, nofollow` metadata. Client-side encryption depends on password strength and is not server-side authorization or an account system.

To update Arcolens, run `scripts/build-200.mjs` with `--arcolens-source` pointing to its approved `simon-review` directory and `--delivery-manifest` pointing to `v2/review/completion/DELIVERY_MANIFEST.json`. Supply the existing password on standard input. The builder verifies every source checksum, encrypts each resource, and emits only ciphertext and public encryption parameters into `200/vault/`. It does not alter the source analysis or call an LLM. Rebuilding with a different password re-encrypts the current files; old ciphertext in Git history remains tied to its original password.

Run `node --test scripts/test-200.mjs` for routing, wrong-password, tampering, session, and logout checks. Run `node scripts/verify-200.mjs` with the password on standard input to decrypt and check every packaged resource and internal link. Public site builds do not need the password and do not rebuild the encrypted resources.
