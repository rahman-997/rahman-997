# V12 quality report (local verification)

**Date:** 2026-10-29  
**Scope:** GitHub profile README and its offline QA tools. No repository changes or external requests were made.

| Check | Result |
| --- | --- |
| `node --test tests/*.test.mjs` | **67 / 67 passed** |
| `python3 -m unittest discover -s tests -p 'test_*.py'` | **16 / 16 passed** |
| `python3 scripts/verify-svg.py` | **23 / 23 SVG files valid** |
| `node scripts/profile-audit.mjs` | Passed: local references, navigation and image alternatives |
| `node scripts/check-profile-links.mjs --list` | **21 unique external destinations**; inventory only |
| Local Chromium, 1280px / 390px | No document horizontal overflow; images decoded; supplementary projects disclosure toggled |

## What was tested

- A RED/GREEN regression cycle for project prioritization, earlier proof/contact, topic grouping and project disclosure.
- Original V7–V11 sections, images, project source links and localized text retained.
- A GFM-to-HTML preview was produced locally using Pandoc. Assets were embedded as inline image data and rendered in Chromium with **a GitHub-like stylesheet**. Local navigation to a server address was blocked by the browser policy, so `set_content` was used instead. Neither layout nor CSS is a guarantee of actual github.com output.
- Mobile proof-map screenshot was reviewed: stacked links remained readable and the disclosure displayed as a closed native details element. Desktop/mobile hero screenshots were also reviewed.

## Pending checks before any publishing

- Review Github renderer in light and dark themes, confirm folded projects and intra-page anchors behave as expected.
- Check all deployed URLs from a normal browser. The offline list is **not an uptime test**; sleeping free-tier services and bot protection may produce transient errors.
- Review the diff against the current `main` branch; this work was based on the local V11 archive, not a live checkout.
- Obtain explicit permission before branch creation, push, PR or merge.
