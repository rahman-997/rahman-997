# GitHub Profile V13: Engineering field guides and reviewer routes

This V13 package is prepared locally for the open **Draft PR #8** (`redesign-v12` review branch); the V13 files have not yet been pushed. `main` remains untouched. It separates deeper technical content into five linked reference documents so the profile stays readable.

## What's new

- A **Review in 10 minutes** route before featured work, aimed at technical reviewers.
- An **Engineering field guides** index with a source → decisions → tests → reality SVG illustration with separate mobile artwork.
- Five focused Markdown guides covering reviewer workflow, project inspection paths, architecture trade-offs, quality/security evidence, and multilingual accessibility QA.
- Dependency-free local document link auditing, unit tests and a CI gate to catch missing/unsafe guide paths.
- Explicit caveats around real-site availability, the limits of CI proof and Persian QA versus shipped localization.

## Review policy

These additions describe public source and suggested inspection methods, not unverified production guarantees. The Draft PR must be reviewed in GitHub before merging; external demo uptime is a separate check.

---

# GitHub Profile V12: Proof-first reading experience

This release is a **local, unpublished refresh of V11**. It does not create branches, pull requests or changes in the GitHub repository. There are no claimed new production features.

## What changed

- Promoted three distinct featured examples, **Eventify** (backend reliability), **BookHaven** (commerce integrity) and **Mizan Finance** (local-first multilingual UX), to the first project view.
- Kept **FitFlow**, **Venues API** and **Engineering Portfolio** accessible in a native, keyboard-operable `<details>` group, rather than deleting the projects.
- Moved **Evidence and verification map** and **Let's connect** ahead of the long engineering reference, so visitors can inspect sources and reach out earlier.
- Replaced a three-column proof table with readable stacked links for narrow screens.
- Reorganized the specialist navigation into four labelled topic groups, keeping prior anchors and section content intact.
- Added `tests/profile-v12-layout.test.mjs` to guard the new content hierarchy and prevent broken links or accidental loss of project assets.

## Local verification and limitations

- **67 / 67 Node.js tests** and **16 / 16 Python tests** passed.
- **23 / 23 SVG files** passed the existing structural and security-oriented verifier.
- Offline README audit passed; **21 external destination URLs** were inventoried but not probed for uptime.
- GitHub-like HTML preview generated from README content with embedded local SVG data, checked at **1280px and 390px**, with no document horizontal overflow. Native project disclosure opened successfully at both widths.
- **The screenshots are local approximations, not actual GitHub screenshots.** Exact GitHub rendering, theme behavior, links and deployed applications still require inspection after an approved upload.

See [V12_QA_REPORT.md](./V12_QA_REPORT.md) and [REVIEW_CHECKLIST.md](./REVIEW_CHECKLIST.md).

---

# GitHub Profile V11: Verified decisions and responsive review guidance

This is a **local, unpublished package** based on V10. No files, branches or PRs have been changed on GitHub.

## Five new sections

- **Decisions in context:** compare local-first state, durable queues, inventory invariants and small HTTP services, with actual source links to Mizan Finance, Eventify, BookHaven and Venues API.
- **From feature brief to acceptance test:** illustrative Given/When/Then checkout scenarios including concurrency, failure handling and keyboard/screen-reader behavior.
- **Verification ladder:** clear distinction between unit checks, HTTP contracts, UI flows and live signals, without portraying CI badges as universal proof.
- **Incident response rehearsal:** an explicitly hypothetical detect/protect/recover/communicate/learn exercise, including rollback decisions.
- **RTL and localization QA:** an actionable Arabic/Persian checklist covering mixed direction, correct Persian **ی** and **ک**, typography, narrow layouts and assistive technology. Makes no claim that Mizan ships Persian.

The five new links live in **Explore more topics** to preserve the primary navigation. The two new illustrated areas each include an editable desktop SVG and a tailored mobile SVG. New V11 sections use stacked lists instead of multi-column Markdown tables, which are hard to read on narrow GitHub profile views.

## Verification and limitations

- **63 / 63 Node.js** tests passed, **16 / 16 Python** tests passed and **23 / 23 SVG** assets passed validation.
- README offline audit passed, and the 21 external destinations were inventoried without probing their uptime.
- Local Chromium preview at 1280px and 390px showed no document-level horizontal overflow; SVGs decoded. RTL preview was visually reviewed.
- Full command and scope details are in [V11_QA_REPORT.md](./V11_QA_REPORT.md).
- Added regression coverage for all five sections, meaningful sources and responsive `<picture>` references.
- Strengthened the offline README audit to detect missing or unsafe **relative Markdown document links**, not only missing images.
- Tests were written to expose absent content and audit gaps before adding the implementation.
- Local Markdown rendering previews are not the production GitHub renderer; test appearance in the GitHub UI before merging.
- The external URL inventory does not establish website uptime. Check the actual live demos separately.

## Before publishing

Compare this archive against the current `main` branch, review the new links and SVG variants on GitHub's dark/light modes, run Actions checks, and validate external destinations where needed. **Obtain explicit approval before creating a review branch, opening a pull request, or merging.**

---

# GitHub Profile V10: Interface journeys, privacy and operational clarity

This release is a **local, unpublished review package** continuing from V9. It does **not** modify any GitHub repository.

## What's new

- Added **User journeys and interface states**, covering ready, loading, empty, success and recovery states, with a pointer to FitFlow for source review.
- Added **Data ownership and privacy**, separating minimization, state ownership, access decisions and understandable data controls, with a Mizan Finance source pointer.
- Added **Observability and service signals**, mapping request, queue, dependency and release signals. Its diagrams are clearly illustrative, **not live production metrics**.
- Added **Developer experience and reproducibility**, with directly runnable offline commands for this repository.
- Added **Evidence and verification map**, linking source and workflows to specific review questions without treating badges as security or availability guarantees.
- Refined the long navigation into five prominent shortcuts and a GitHub-compatible **Explore more topics** details panel.
- Added four local, editable SVG illustrations: desktop and mobile variations of `user-journeys` and `service-signals`, all with accessible titles/descriptions and no remote dependencies.
- Added `tests/profile-v10-sections.test.mjs` to cover the new sections, navigation, linked evidence and responsive picture sources.

## Verified locally

- Node.js: **51 / 51** tests passed.
- Python: **16 / 16** tests passed.
- SVG files: **19 / 19** passed structural validation and CairoSVG rasterization for new variants.
- README navigation, asset references and alt text: passed offline audit.
- External links: **21** distinct destinations inventoried without performing live website health checks.
- SVG previews were rasterized locally to review the new visuals. Chromium navigation is blocked by the environment, so no browser layout/overflow or GitHub-hosted rendering check is claimed for V10.

## Before publishing

Inspect the README on actual GitHub (light and dark themes, mobile and desktop) and confirm the `<picture>` fallbacks before merging. Compare against the current default branch, run the proposed Actions workflow and check public demos manually. A review branch or PR must not be created without the account owner's approval.

---

# GitHub Profile V9: Interface craft, data contracts and resilience

This is a **local, unpublished review package** continuing from V8. Nothing was uploaded to or changed on GitHub.

## New sections and illustrations

- **Design systems and interface craft:** design tokens, reusable interactions and visual states with real project source links.
- **API and data contracts:** request validation, authorization context, invariants, response design and test boundaries, with source pointers to Venues API and BookHaven.
- **Resilience and recovery:** explicit failure states, duplicate submissions, asynchronous work, bounded retries and observable outcomes.
- **Technical writing and decisions:** a practical context / trade-offs / verification / follow-up note format, anchored to this repository's review documents.
- **Questions I am exploring:** labelled ideas rather than claims of shipped functionality or a commitment to a release.
- Three SVGs: `design-craft.svg`, `api-contracts.svg`, and `resilience.svg`, following the existing midnight/mint visual style with meaningful `<title>`, `<desc>`, alt text and no external resources.
- Five new navigation targets added to the README index, preserving the existing project cards and RTL content.

## Local verification

- First reproduced missing-content failures in `tests/profile-v9-sections.test.mjs`, then added the content.
- **45 / 45** Node.js tests passed, **16 / 16** Python tests passed.
- **15 / 15** SVGs passed `scripts/verify-svg.py`.
- README structural audit passed (anchors, local image paths, alt text, unsafe URL schemes).
- Inventory contains **21** external links; inventory is offline and does not establish uptime.
- Local Chromium review using a GitHub-like Markdown stylesheet at **1280px** and **390px**, with images decoding, no horizontal overflow and RTL direction retained. This is not the production GitHub renderer.

## Publication checks still needed

Compare the archive against the current default branch, inspect the changes in a review branch/PR **only after explicit approval**, confirm GitHub's real light/dark and narrow-screen rendering, and manually test external demos. Do not interpret temporary host or automation failures as proof of a broken project.

---

# GitHub Profile V8: Engineering practice, quality and collaboration

This is an **unpublished local review package** based on V7. No GitHub branch, pull request, or default branch was modified.

## New content

- **Engineering principles:** state ownership, failure and recovery, API boundaries, verification and architectural trade-offs.
- **Quality and security:** correctness, input and permissions, operational readiness, maintainability, and links to inspect existing CI/security workflows. Explicitly distinguishes a green badge from a blanket security guarantee.
- **Performance and accessible UX:** responsive layout, keyboard interaction, loading/perceived performance, RTL/LTR typography, and project examples.
- **Collaboration and handoff:** reproducible working agreements, reviewable changes and local contributor documentation.
- **Explore the code:** project-specific routes for inspecting the source rather than repeating project descriptions.
- Two new local SVGs: `assets/quality-gates.svg` and `assets/inclusive-ux.svg`. Both include descriptions and labels, avoid remote references and use the existing midnight/mint design system.
- Reorganized internal navigation into three responsive text rows for easy jumping to all V7/V8 sections.

## Validation enhancements and evidence

- New regression coverage in `tests/profile-v8-sections.test.mjs` for all five section anchors, meaningful content, both new illustrations and code-tour links.
- `scripts/profile-audit.mjs` now rejects unsafe `javascript:`, `vbscript:` or `data:` navigation in Markdown or HTML links. The new negative tests failed before implementation and passed afterward.
- SVG validation tests check for required named diagrams but no longer assume the asset inventory is permanently fixed at ten files.
- Node.js: **41 / 41** tests passed.
- Python: **16 / 16** tests passed.
- SVGs: **12 / 12** passed structural/security-oriented checks.
- README audit: no broken internal anchors, missing images or unsafe link schemes detected.
- Offline inventory: **21** unique external navigation targets, **not** independently verified live.
- Local Chromium preview (1280px desktop and 390px mobile): SVGs loaded, no horizontal document overflow, RTL direction present. This uses a local GitHub-like stylesheet, **not** the production GitHub Markdown renderer.

## Publication boundary

Do not replace the default branch automatically. Compare the package against current repository contents, request explicit approval for a review branch and PR, then verify actual GitHub rendering, CI and external links before merging.

---

# GitHub Profile V7: Expanded sections and architecture diagrams

This V7 package builds directly on V6. It is a **local review artifact**, not a GitHub update or a published site.

## New content

- Added five purposeful sections: **Find your starting point**, **Systems behind the screens**, **Delivery, end to end**, **AI and automation lab**, and **Languages and inclusive UX**.
- Expanded the quick-navigation menu with a second row so visitors can jump to each new area without scanning the whole README.
- Added `assets/architecture.svg` and `assets/delivery.svg`, maintaining the existing midnight / mint visual language. Both have accessible titles and descriptions and use only local resources.
- Added concise English, Arabic, Turkish and Persian copy; the RTL examples use proper Unicode letters (including Persian `ی` and `ک`) and explicit `dir="rtl"`.
- Added five regression tests for new sections, meaningful content, imagery, language support and structural integrity, plus updated counts in existing asset tests.

## Local checks

- Node.js: **35 / 35** tests passed.
- Python: **16 / 16** tests passed.
- SVG assets: **10 / 10** valid.
- Offline README navigation/assets/alt audit: passed.
- External link inventory: **21** unique destinations (no network verification or uptime claim).
- Local Chromium visual review: 1280px desktop and 390px mobile, no horizontal document overflow. New diagrams rendered locally, and RTL text was checked in the mobile preview. This is a local approximation, **not** GitHub's hosted Markdown renderer.

## Before publication

Review the package against the current repository HEAD, inspect the README with GitHub's actual rendering in light and dark themes, run the proposed CI workflow, and open external demo links manually. Do not infer that externally hosted demos are online from these local tests.

---

# GitHub Profile V6: Offline audit and rendered previews

This is a local review package for `rahman-997/rahman-997`. **No GitHub branches, pull requests, or published content were changed.**

## What changed since V5

- Added `scripts/profile-audit.mjs`, a dependency-free README structure audit that flags unresolved internal navigation anchors, missing local images, missing informative image alt text, and references that escape the repository root.
- Added `tests/profile-audit.test.mjs` with seven tests, including cases that first reproduced failures before the implementation and CI update.
- Added the offline audit to the `quality` GitHub Actions job, so it runs on relevant pushes and pull requests. Public website uptime checks remain scheduled/manual only.
- Documented the audit command and a review checklist.
- Created independent desktop, mobile and Arabic-section previews by rendering the actual Markdown and local SVG assets in Chromium. These are **offline approximations of GitHub's layout**, not screenshots of a live GitHub page. External status badges may be absent in local previews because remote assets could not be fetched.

## Verification

- `node --test tests/*.test.mjs`: **30 / 30** passed.
- `python3 -m unittest discover -s tests -p 'test_*.py'`: **16 / 16** passed.
- `python3 scripts/verify-svg.py`: **8 / 8** passed.
- `node scripts/profile-audit.mjs`: **passed** (no missing internal anchors or images detected).
- `node scripts/check-profile-links.mjs --list`: **21** unique public navigation targets inventoried, **without** live availability claims.
- Chromium preview: desktop 1280px and mobile 390px showed no horizontal document overflow; mobile picture source was selected at 390px; Arabic section was visually inspected for RTL and connected lettering.
- Upstream GitHub tags were checked for the pinned `actions/checkout` v7.0.1 and `actions/setup-node` v7.0.0 commits.

**Not verified:** End-to-end published website response, production GitHub Markdown rendering, or actual execution of the proposed GitHub Actions workflow. The direct site URLs could not be opened by the available web-access service; no availability status was inferred from this failure.

## Next step, with owner's explicit approval

1. Compare the V6 files against the latest default branch to prevent overwriting newer work.
2. Upload the files to a **review branch**, not `main`, and create a draft PR.
3. Review GitHub's rendered Markdown, especially the mobile hero, links, and Arabic RTL block.
4. Confirm CI green and manually inspect the published-site links before merging.
