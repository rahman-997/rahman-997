# V11 Quality Report (local verification)

## Verified on 2026-10-29

| Check | Result |
| --- | --- |
| Node.js `node --test tests/*.test.mjs` | 63 / 63 passed |
| Python `python3 -m unittest discover -s tests -p "test_*.py"` | 16 / 16 passed |
| SVG structural/security-oriented checks | 23 / 23 valid |
| Offline README headings, images, local Markdown links and unsafe URL schemes | Passed |
| External HTTP(S) URL inventory | 21 unique destinations (not probed for uptime) |
| Local Chromium preview: 1280px desktop | Images decoded, no horizontal overflow |
| Local Chromium preview: 390px phone | Images decoded, no horizontal overflow |
| Arabic/Persian preview: 390px | RTL blocks present; manual visual inspection of joined text |

The preview was generated from Markdown with a local GitHub-like stylesheet and self-contained SVG image data. It is **not** a GitHub-hosted screenshot and does not prove how GitHub will render every element. Actual site availability and live link responses were not confirmed. Neither GitHub source nor its default branch was modified.

## Additional V11 regression coverage

- Five V11 sections and accessible responsive illustrations.
- Source-linked decision examples, concrete acceptance criteria, incident rehearsal and RTL QA.
- No three-column Markdown tables in the two illustrated new sections.
- Relative Markdown document links that are missing or traverse outside repository are reported by the audit.

## Before release

Verify actual GitHub rendering in light/dark themes and on a narrow device. Review the existing `main` diff, manually check live demos and only then decide whether to create a review branch and pull request. Uploading requires explicit permission.
