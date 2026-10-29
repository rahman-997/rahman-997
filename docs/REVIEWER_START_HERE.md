# Reviewer quick start · 10-minute engineering tour

> **Purpose:** a short route through public artifacts, rather than a claim that every production environment or feature is currently online. Begin with source, then verify behavior in tests and CI.

[Back to profile](../README.md) · [All project field guides](./PROJECT_FIELD_GUIDES.md)

## Minute 0–2 · Choose the kind of work

- **Full-stack systems and asynchronous jobs:** [Eventify repository](https://github.com/rahman-997/eventify).
- **Commerce and state consistency:** [BookHaven repository](https://github.com/rahman-997/bookbookhaven).
- **Privacy-first, bilingual product UX:** [Mizan Finance repository](https://github.com/rahman-997/mizan-finance).
- **Backend contract design:** [Venues API repository](https://github.com/rahman-997/venues-api).
- **Accessible offline interactions:** [FitFlow repository](https://github.com/rahman-997/fitflow-gym).

## Minute 2–5 · Follow one vertical slice

Read the project's README, then trace **input → validation → state change → user feedback**. In Eventify, follow a booking through its API and the outbox/worker boundary; in BookHaven, trace checkout through inventory and order state. The architecture descriptions in those repositories explain what to inspect, but treat them as hypotheses to confirm against the current code.

## Minute 5–7 · Check the failure path

Look for what happens on invalid input, duplicate operations, stale stock or temporarily unavailable dependencies. For backend work, inspect error contracts and retry behavior. For user interfaces, inspect loading, empty, failed and success states. A happy-path screenshot is not an incident-response test.

## Minute 7–9 · Look for independent evidence

- Inspect adjacent tests and what they actually assert.
- Check recent GitHub Actions workflow runs for the relevant commit.
- Distinguish **static checks**, **integration tests**, and **live site availability**. A green badge alone cannot establish all three.
- Review known deployment limitations in the project's README; free hosted demos may sleep.

## Minute 9–10 · Decide what to discuss

Questions worth bringing to a review: *Where does the authoritative state live? How is failure recovered? What is the smallest test that would falsify the claimed behavior? What was intentionally left out?*

For deeper reading, use the [architecture decision guide](./ARCHITECTURE_DECISIONS.md), [quality and security matrix](./QUALITY_AND_SECURITY.md), or [RTL/accessibility checklist](./RTL_AND_ACCESSIBILITY.md).

**Scope note:** this is a suggested review path, not an automated inspection of the current deployed systems. Run a project's documented checks before drawing conclusions about a particular release.
