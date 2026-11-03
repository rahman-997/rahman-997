# Release and recovery playbook

[Back to profile](../README.md) · [Project evidence](./PROJECT_EVIDENCE_INDEX.md)

This playbook describes a **recommended review routine**, not an assertion that every listed step is implemented or deployed in every repository. Production changes need project-specific checks, permissions and rollback plans.

## Before a release

1. Identify the target branch, dependency lockfile, run-time version and deployment environment.
2. Run the repository's documented typecheck, tests, build and relevant security checks. Record which tasks passed, were skipped or were unavailable.
3. Verify environment-variable names, secret ownership and migrations without copying secret values into logs or issues.
4. Test a critical happy path **and** at least one bad-input/permission/failure path.
5. Agree on rollback triggers, acceptable data changes and who can approve the release.

## During deployment

- Watch CI and deploy output for errors; inspect request IDs and health endpoints where documented.
- For [Eventify](https://github.com/rahman-997/eventify), check API readiness and any worker/backlog signals separately from a successful frontend load.
- For [BookHaven](https://github.com/rahman-997/bookbookhaven), distinguish a server response from an end-to-end checkout/inventory test.
- For [Venues API](https://github.com/rahman-997/venues-api), verify the expected error schema in addition to `/health`.

## Recovery and rollback

If a new deployment fails, stop escalating traffic to it when the hosting platform permits it, capture enough diagnostic context to reproduce the problem, and prefer a reviewed rollback to a known-good application revision. **Do not assume a code rollback reverses a database migration or restores lost data.** For storage or schema changes, plan restoration and compatibility independently, with appropriate authorization and backups.

After recovery, record impact, root cause hypotheses, failed protections, changes made and the new regression tests. A green badge only establishes the status of one workflow run, not end-to-end operational safety.

For a reviewer-friendly summary, see [Quality and security](./QUALITY_AND_SECURITY.md) and [Demo limitations](./DEMO_LIMITATIONS.md).
