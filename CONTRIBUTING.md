# Maintaining the GitHub profile

This repository is a **GitHub profile README**, not a deployed website. The visual design lives in `README.md` and the twenty-three editable SVG files in `assets/`.

## Local checks

Requires Node.js 22 or later and Python 3. No npm installation or third-party dependencies are needed for verification.

```bash
node --test tests/*.test.mjs
node scripts/profile-audit.mjs
node scripts/audit-guides.mjs
python3 -m unittest discover -s tests -p "test_*.py"
python3 scripts/verify-svg.py
node scripts/check-profile-links.mjs --list
node scripts/check-profile-links.mjs
```

The offline profile audit checks navigation anchors, local image and Markdown-document links, descriptive image alt text, unsafe relative paths, and unsafe navigation URL schemes. See `REVIEW_CHECKLIST.md` before publishing. The Node tests cover Markdown link extraction (including image-wrapped badges and balanced URL parentheses), HEAD/GET fallback (including HEAD-only 404), retry behavior, concurrency, mobile-safe project layout, and local image references (including the `<picture>` source). The Python checks validate SVG syntax, safe embedded content, all viewBox coordinates, unique IDs, local resource references and accessibility labels. `--list` inspects the links without making any HTTP requests. The final command checks the external navigation links from the README with a timeout and retries, so it requires network access.

LinkedIn intentionally blocks many automated clients, so its link is shown in the inventory but excluded from network-based uptime monitoring. The link must be checked manually in a browser. GitHub Actions runs deterministic offline checks on every relevant push or pull request. External URL checks are isolated to the Sunday schedule or a manual workflow dispatch, since sleeping app hosts and bot protection can fail transiently without a code regression.

## Changing the design

- Keep the GitHub profile fast: use local SVGs rather than large remote screenshots.
- Keep quick-navigation links aligned with the exact section titles; the audit checks for broken anchors. The project guide, architecture, delivery, AI and language sections have focused tests in `tests/profile-sections.test.mjs`; the V8 engineering principles, quality, performance, collaboration and code-tour sections are covered in `tests/profile-v8-sections.test.mjs`; the V9 design-system, API-contract, resilience, decision-note and exploration sections have coverage in `tests/profile-v9-sections.test.mjs`; V10 adds test coverage for the five new sections, the collapsible topic index, source-linked evidence and mobile illustrations in `tests/profile-v10-sections.test.mjs`; V11 adds decision paths, acceptance tests, a verification ladder, incident rehearsal, RTL QA, and responsive SVG variants in `tests/profile-v11-sections.test.mjs`.
- Keep project cards in a single-column layout. GitHub strips custom CSS, so two-column HTML tables cannot reliably collapse on narrow screens.
- Update both `hero.svg` (wide) and `hero-mobile.svg` (max-width: 600px) when changing the headline. For `user-journeys`, `service-signals`, `decision-paths` and `verification-ladder` illustrations, update both desktop and `-mobile` SVG variants; GitHub selects the narrower version through `<picture>`. Keep legacy diagrams readable when scaled down.
- Maintain useful `alt` descriptions on every image.
- Make changes in `README.md`, using GitHub-compatible Markdown and HTML.
- Update or add corresponding test coverage when link parsing or check behavior changes.
- Verify rendered SVGs in both a light and dark environment; keep enough contrast.
- For Arabic and Persian copy, use `dir="rtl"`, correct Unicode shaping, Persian `ی` and `ک` (not Arabic substitutes), and inspect mixed-script punctuation.

Do not paste API keys, personal access tokens, credentials, or private information into the profile.
