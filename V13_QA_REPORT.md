# V13 QA report · field-guide expansion

## Changes

- Added a fast review path and engineering field-guide index to the profile README.
- Added five standalone Markdown guides with public repository references, explicit review questions and scope caveats.
- Added `assets/field-guide.svg` and `assets/field-guide-mobile.svg`, static illustrations verified through the SVG sanitizer and manual PNG conversion.
- Added `scripts/audit-guides.mjs`, regression tests and an offline check in GitHub Actions.

## Reproducible local checks

```bash
node --test tests/*.test.mjs
node scripts/profile-audit.mjs
node scripts/audit-guides.mjs
python3 -m unittest discover -s tests -p 'test_*.py'
python3 scripts/verify-svg.py
node scripts/check-profile-links.mjs --list
```

At the point of packaging, **77 Node.js tests**, **16 Python tests**, and **25 SVG files** passed locally. `README.md` and the five linked guides passed their offline path audits. The new SVG was rendered to PNG and inspected visually.

## Boundaries of verification

- No claimed web browser screenshot of the full GitHub README in this V13 step.
- No live uptime check of project demos was performed; URL inventory does not prove reachability.
- No claims about current deployments beyond public repository documentation.
- V13 was submitted for review through [Pull Request #8](https://github.com/rahman-997/rahman-997/pull/8). Check GitHub for its current merge status and the latest workflow results; this report does not establish live demo availability.
- GitHub Actions on the updated commit must be checked separately after uploading the branch.
