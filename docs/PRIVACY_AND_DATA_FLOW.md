# Privacy and data-flow review guide

[Back to profile](../README.md) · [Security evidence](./QUALITY_AND_SECURITY.md)

Privacy is a system property. Before calling a feature “private”, identify **where the input originates, where it is stored, which boundary it crosses and who can retrieve it**. These are practical review prompts, not claims that all deployed systems have passed a privacy audit.

## 1. Browser-local model: Mizan Finance

[Mizan Finance source](https://github.com/rahman-997/mizan-finance) documents a local-first budgeting interface. Map the flow from form input → validation → React state → browser storage → charts/export. Review backup/restore confirmation and the effect of clearing browser storage. Check the Arabic and English routes for labels, error messages and right-to-left presentation. Local storage reduces server-side data sharing but is not encryption and does not eliminate device/browser access risks.

## 2. Browser session boundary: BookHaven

[BookHaven source](https://github.com/rahman-997/bookbookhaven) documents a same-origin browser-facing layer and HttpOnly session handling. Trace browser → Next.js route handlers → Express API → MongoDB. Inspect cookie attributes, authorization checks and object-level access. Never confuse UI hiding with server-side authorization.

## 3. Multi-service state: Eventify

[Eventify source](https://github.com/rahman-997/eventify) documents an HTTP API, a PostgreSQL authority, Redis support services and background processing. Trace where authenticated request data is validated, where durable state lives and how asynchronous side effects are scheduled. Logs, cache keys and retries deserve separate review from the primary database schema.

## Review questions

- What is the data retention model, and what survives a restart or device change?
- Are sensitive fields copied to logs, analytics, caches or background jobs?
- Is access enforced at the API/resource boundary, not only in the UI?
- What happens on invalid export files, failed writes or interrupted migrations?
- Do localization and accessibility paths preserve the same privacy guarantees?

These questions help a reviewer inspect implementation; they do not certify regulatory compliance. Review [Demo limitations](./DEMO_LIMITATIONS.md) before treating a preview environment as durable production storage.
