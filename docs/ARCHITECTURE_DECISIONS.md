# Architecture decisions · context before technology

[Back to profile](../README.md) · [Project guide](./PROJECT_FIELD_GUIDES.md)

These are **illustrative decision lenses and review questions**, not a claim that every option was implemented in every repository. They provide a way to discuss trade-offs using inspectable examples.

## Synchronous request versus background job

| Choose a synchronous response when… | Prefer background processing when… |
| --- | --- |
| The result is fast, deterministic and needed immediately | A side effect is slow, retriable or independent from the user response |
| A request can return a definitive success/failure | The system needs durable work after the client disconnects |

**Trade-off:** queues add operational complexity, retries and duplicate-delivery concerns. [Eventify](https://github.com/rahman-997/eventify) illustrates outbox and background-worker boundaries. The existence of a queue is **not a claim** of exactly-once processing.

## Server-owned versus browser-owned data

A server-backed app can share authoritative state across devices and enforce server-side permissions, but introduces operational and privacy obligations. A local-first application can reduce server-side data exposure and support offline workflows, but backup, device loss and synchronization become the user's concern.

**Trade-off:** [Mizan Finance](https://github.com/rahman-997/mizan-finance) documents local persistence. [BookHaven](https://github.com/rahman-997/bookbookhaven) illustrates shared authoritative commerce data. The right choice depends on ownership, consistency and user expectations.

## State consistency versus fallback availability

A multi-document transaction may make invariants easier to enforce where infrastructure supports it. A carefully designed fallback may support limited demo environments, but should describe compensation behavior and limitations explicitly.

**Review prompt:** Does the implementation prevent overselling, duplicate order creation and silent partial updates? [BookHaven](https://github.com/rahman-997/bookbookhaven) documents these questions in its architecture and tests.

## When small services should stay small

For a resource-oriented service, a few explicit boundaries can be clearer than a large abstraction layer. [Venues API](https://github.com/rahman-997/venues-api) separates HTTP translation, validation, business logic and persistence while keeping the REST contract readable.

**Trade-off:** smaller modules reduce indirection, but repeated logic becomes a signal that a shared component may be justified. Measure the real complexity before extracting a framework.

## How to record a decision

1. **Context:** user-facing problem, constraints and expected load.
2. **Options:** two realistic alternatives plus why each might fail.
3. **Decision:** choose the simplest option satisfying the critical invariant.
4. **Evidence:** source links, runnable tests, benchmarks or relevant logs.
5. **Revisit trigger:** which measured change would justify revisiting the choice.

The examples above are **discussion models**, not formal ADR records or evidence of a measured performance gain. The current repository code remains the source of truth.
