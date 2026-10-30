# V14 QA report · Evidence hub

## Scope

- Introduced a short **Evidence hub** section before featured projects and linked a responsive SVG diagram.
- Added five standalone, project-grounded review guides: project evidence index, demo limitations, privacy/data flow, release/recovery, and collaboration/handoff.
- Added six curated public repository entries in `data/project-catalog.json` and an offline cross-reference validator.
- Changed the guide auditor to include all `docs/*.md` automatically, not a hardcoded subset.
- Expanded the pull-request CI path filters to include `docs/**` and `data/**`, and added the project-catalog quality check.

## Reproducible checks

```bash
node --test tests/*.test.mjs
python3 -m unittest discover -s tests -p 'test_*.py'
node scripts/profile-audit.mjs
node scripts/audit-guides.mjs
node scripts/verify-project-catalog.mjs
python3 scripts/verify-svg.py
node scripts/check-profile-links.mjs --list
```

When V14 was packaged, **87 Node.js tests and 16 Python tests** passed locally. All **27 SVG files** passed structural checks; the two new diagrams were also rasterized and visually inspected. The project catalog passed consistency checks for all six repositories; ten guide files passed local-link audits.

## Scope of confidence

The checks above do not establish the availability of externally hosted demos, endpoint security, current deployment status or complete compliance. The previews are local renders of original SVG files, not screenshots of GitHub's live README. Confirm GitHub Actions on the resulting branch commit separately, and do not merge without review of the draft pull request.
