# V12 review checklist before merging

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
