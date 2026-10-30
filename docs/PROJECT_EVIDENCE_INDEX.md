# Project evidence index

[Back to profile](../README.md) · [Review route](./REVIEWER_START_HERE.md) · [Catalog data](../data/project-catalog.json)

This index is a **navigation aid**, not a claim that every feature is currently deployed. Start with the linked source repository and inspect the current branch, tests, release history and workflow results. The machine-readable inventory in `data/project-catalog.json` is checked locally and in CI.

## Which repository answers which question?

- **Eventify — reliability of bookings and side effects:** [source](https://github.com/rahman-997/eventify). Trace booking → capacity/waitlist → PostgreSQL outbox → worker processing. Look for the handling of duplicates, retries, storage boundaries and health/readiness signals. Avoid inferring availability from a badge alone.
- **BookHaven — commerce consistency:** [source](https://github.com/rahman-997/bookbookhaven). Explore cart and checkout state transitions, inventory coordination and browser session boundaries. Cross-check architecture documentation against route handlers, services and tests.
- **Mizan Finance — privacy-first interface:** [source](https://github.com/rahman-997/mizan-finance). Check how transactions and budgets are persisted in the browser, how data export/restore works and how RTL layout is tested. A local-first design is not a substitute for reviewing browser-data risks.
- **FitFlow — accessible interaction:** [source](https://github.com/rahman-997/fitflow-gym). Inspect focus handling, guided intervals, progress persistence and offline behavior. A PWA manifest alone does not establish accessibility.
- **Venues API — predictable REST boundaries:** [source](https://github.com/rahman-997/venues-api). Inspect request validation, service boundaries, structured errors and contract tests. Hosted JSON persistence is documented as ephemeral.
- **Engineering Portfolio — communication and delivery:** [source](https://github.com/rahman-997/portfolio). Review project case-study links, production checks and build workflows; distinguish authored descriptions from code evidence.

## Practical evidence ladder

1. **Claim:** What does the README or case study say?
2. **Implementation:** Which files, services or tests make the claim inspectable?
3. **Verification:** Is there a focused test reproducing the behavior? Does CI run it?
4. **Operations:** Is the production environment equivalent to the test environment?
5. **Limit:** Which failure modes and deployment conditions are not proven?

When reviewing a project, record a specific source path and test name rather than a broad statement such as “production-ready”. This guide intentionally avoids fabricated success rates, performance metrics or uptime claims.

For availability constraints, see [Demo limitations](./DEMO_LIMITATIONS.md). For deployment checks, use the [Release and recovery](./RELEASE_AND_RECOVERY.md) playbook.
