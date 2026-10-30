# Collaboration, review and handoff

[Back to profile](../README.md) · [Reviewer quick start](./REVIEWER_START_HERE.md)

Good delivery leaves enough context for the next engineer to understand **intent, boundaries and uncertainty**, without reverse-engineering every decision. This is a proposed collaboration routine; it is not a claim that every historical repository change followed the same process.

## A practical review brief

- **Problem:** Which user or system outcome is being changed?
- **Constraints:** Which security, privacy, accessibility, availability and performance limits matter?
- **Change:** Which interfaces, data contracts, background jobs or shared components are affected?
- **Evidence:** Which test, screen recording, source path or CI log substantiates the result?
- **Rollback:** What is reversible, and what requires a migration/backfill or external coordination?

## Review by risk

A static copy change needs text, layout and localization review. A new form requires validation, loading, error, keyboard and recovery states. A database migration needs compatibility, backup and restoration planning. An API authorization change needs object-level negative tests. An asynchronous workflow needs duplicate/retry/out-of-order reasoning.

Example repositories for review practice: [Eventify](https://github.com/rahman-997/eventify) for asynchronous effects; [BookHaven](https://github.com/rahman-997/bookbookhaven) for commerce state; [Mizan Finance](https://github.com/rahman-997/mizan-finance) for local persistence and localization; [FitFlow](https://github.com/rahman-997/fitflow-gym) for interaction states.

## Handoff checklist

1. Describe local setup and the exact commands that passed in the current environment.
2. State needed configuration keys without exposing actual secrets.
3. Link code entry points, API contracts, routes and data models.
4. Keep screenshots in context: size, date, viewport, and whether they were captured locally or from a live deployment.
5. Mark unknowns explicitly instead of presenting assumptions as completed QA.

The goal is reproducible engineering communication: another developer should be able to inspect, challenge and extend the work with minimal ambiguity.
