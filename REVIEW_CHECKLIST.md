## V14 evidence-hub review

- [ ] Verify all six project records and repository links in `data/project-catalog.json`.
- [ ] Review the five new guides for scope, clarity and no unsupported deployment claims.
- [ ] Inspect desktop/mobile Evidence hub illustrations for readability.
- [ ] Check `node scripts/verify-project-catalog.mjs` and `node scripts/audit-guides.mjs`.
- [ ] Confirm workflow results for the latest review branch commit on GitHub.
- [ ] Keep external site availability explicitly unverified until probed live.

# V13 review checklist before merging

- [ ] Review Draft PR #8 (`redesign-v12` → `main`); confirm `main` remains untouched until explicitly approved.
- [ ] Follow new **Review in 10 minutes** and **Engineering field guides** links on both narrow and wide views.
- [ ] Check all five `docs/*.md` pages for accessibility, relevant source links, scope caveats and readable tables.
- [ ] Run `node scripts/audit-guides.mjs` and confirm it passes as a GitHub Actions quality step.
- [ ] Inspect `assets/field-guide.svg` and `assets/field-guide-mobile.svg` against light and dark themes and confirm the responsive switch.
- [ ] Compare all modified files with the current `main` HEAD; preserve unrelated upstream changes.
- [ ] Verify `README.md` looks correct in GitHub's own Markdown renderer (light and dark themes).
- [ ] Verify the `hero-mobile.svg` source is shown on a narrow display, and project cards stack vertically.
- [ ] Verify Arabic and Persian descriptions have connected letters, correct right-to-left order, and proper Persian ی and ک.
- [ ] Verify the five primary navigation links; expand the four grouped categories under **Explore more topics** and check all earlier technical topic anchors.
- [ ] Check all twenty-three SVGs, especially the mobile/desktop pairs for user journeys, service signals, decision paths and verification ladder, in GitHub light and dark modes, including narrow screens.
- [ ] Check local document links, including `CONTRIBUTING.md`, `REVIEW_CHECKLIST.md`, `RELEASE_NOTES.md` and `tests/profile-audit.test.mjs` (the audit verifies that they exist).
- [ ] Ensure the new diagrams labelled conceptual/illustrative are not interpreted as live metrics or confirmed product features.
- [ ] Review the explorations section for accuracy; ideas must not be mistaken for shipped features or release commitments.
- [ ] Follow each project repository link and verify its ownership and intended content.
- [ ] Open portfolio, project demo and case-study links in a regular browser (some OnRender services may be asleep or block bots).
- [ ] Review `V12_QA_REPORT.md`, then confirm the offline `quality` job passes in GitHub Actions.
- [ ] Run the public-link check manually; distinguish temporary host/bot errors from confirmed broken URLs.
- [ ] Verify that RTL paragraphs render with joined Arabic/Persian letters and that mixed-direction numbers and punctuation read correctly.
- [ ] Confirm the V12 evidence map uses stacked list items on a narrow phone. Expand **More projects** and verify all six project cards and source links.
- [ ] Confirm the three featured projects appear first, with evidence, contact and toolkit ahead of longer technical reference notes.
- [ ] Merge only after reviewing the resulting PR diff.

**Note:** Preparing this package does not give permission to upload files, open a PR or merge changes.
