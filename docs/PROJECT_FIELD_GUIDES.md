# Project field guides · what to inspect and why

[Back to profile](../README.md) · [10-minute review](./REVIEWER_START_HERE.md)

Each guide is a **reading map** based on the public project descriptions. It does not substitute for examining the latest source or running the tests. The most interesting question is rarely *which framework* was used, but *which invariant it protects*.

## Eventify · booking, waitlists and durable follow-ups

**Source:** [rahman-997/eventify](https://github.com/rahman-997/eventify)

1. Start with the repository's system architecture: React/Vite PWA, Express API, PostgreSQL/Prisma, Redis and BullMQ.
2. Trace a booking when capacity is available, then inspect the full-capacity waitlist branch.
3. Look at the **PostgreSQL outbox** and queued side effects. Ask how an accepted action survives transient Redis or worker failure.
4. Verify ownership, authorization, input validation and refresh-token handling against the corresponding tests.
5. Compare `/health`, `/ready` and metrics semantics before calling any endpoint a deployment guarantee.

**Review question:** If a worker restarts after a booking has committed, which work must be retried and what keeps it from producing an inconsistent outcome?

## BookHaven · commerce and inventory integrity

**Source:** [rahman-997/bookbookhaven](https://github.com/rahman-997/bookbookhaven)

1. Trace catalog discovery, book details, cart, checkout and order status transitions.
2. Study the browser-facing Next.js BFF session boundary and the Express service API.
3. Check stock mutation and cancellation flows, especially concurrent checkout behavior.
4. Contrast MongoDB transaction-capable deployments with any explicitly documented fallback behavior.
5. Read the repository's architecture notes and tests for concurrency and authorization claims.

**Review question:** What happens when two customers try to purchase the final copy, or a checkout fails after reserving inventory?

## Mizan Finance · data ownership and RTL UX

**Source:** [rahman-997/mizan-finance](https://github.com/rahman-997/mizan-finance)

1. Identify where transactions and budgets are stored in the browser, and the trade-offs of local-first persistence.
2. Review validated forms, monthly budget calculations, search and filtering.
3. Inspect bilingual English/Arabic UI behavior and right-to-left layouts.
4. Review JSON backup and restore confirmation and storage limits.
5. Check state transitions for empty data, save errors and offline app-shell behavior.

**Review question:** Can a user tell exactly which information stays on their device, and can they recover it after clearing browser storage?

## Venues API · small services with clear contracts

**Source:** [rahman-997/venues-api](https://github.com/rahman-997/venues-api)

1. Walk from routes through controllers and services to the JSON store.
2. Inspect Zod validation and status codes for malformed requests, invalid input, unknown resources and conflict cases.
3. Check the limits on requests and pagination, plus correlation IDs and error formatting.
4. Look at startup/shutdown behavior and tests for the HTTP contract.
5. Remember that the hosted demo's JSON storage is not advertised as durable production persistence.

**Review question:** Does a client receive a predictable error shape, without a leaked stack trace, across every error class?

## FitFlow · offline interactions and accessible state

**Source:** [rahman-997/fitflow-gym](https://github.com/rahman-997/fitflow-gym)

Review the guided sessions, progress tracking and PWA/offline interactions. Verify keyboard and accessible states against the actual interface rather than inferring accessibility from a screenshot.

**Review question:** What happens if the app goes offline during a timed session and later resumes?

## Comparison lens

| Question | Useful first stop |
| --- | --- |
| Durable async work | Eventify outbox/worker |
| Inventory consistency | BookHaven checkout |
| Local-first ownership | Mizan Finance persistence |
| Versioned HTTP contracts | Venues API routes and tests |
| Accessible offline interactions | FitFlow user states |

These links lead to public repositories, not test results certified by this profile. For repeatable verification, use [quality and security](./QUALITY_AND_SECURITY.md).
