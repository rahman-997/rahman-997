# Demo limitations and verification boundaries

[Back to profile](../README.md) · [Project evidence](./PROJECT_EVIDENCE_INDEX.md)

**A live link is an invitation to explore, not a guarantee of continuous availability.** The demo links in this profile may use free-tier or resource-constrained infrastructure. A recent successful CI run is not proof that a public URL currently responds.

## When a demo does not respond

1. Confirm that the target URL still matches the link in the repository's current README.
2. If the service is on a sleeping host, allow for its normal cold-start behaviour. A browser timeout does not automatically prove a broken application.
3. Prefer the linked source code, tests and case study while a deployment is unavailable.
4. Record time, URL, response status and what environment was tested before reporting a failure.
5. Never treat a manually loaded homepage as a substitute for testing authentication, authorization, state transitions and persistence.

## Data durability may differ by project

- **Eventify:** The [repository](https://github.com/rahman-997/eventify) documents a PostgreSQL-authoritative booking model and Redis as auxiliary infrastructure. Demo behavior depends on deployed configuration and its health.
- **BookHaven:** The [repository](https://github.com/rahman-997/bookbookhaven) documents durable MongoDB Atlas as a production option and a disposable database fallback for preview environments. Preview data may reset.
- **Venues API:** The [repository](https://github.com/rahman-997/venues-api) describes a JSON store whose hosted filesystem may be ephemeral. A successful request does not establish long-lived persistence.
- **Mizan Finance:** The [repository](https://github.com/rahman-997/mizan-finance) documents browser-local storage. Different browsers, private windows or cleared site data can expose different records.
- **FitFlow:** Check the [source](https://github.com/rahman-997/fitflow-gym) for specific PWA/offline capabilities before assuming the complete application is usable offline.

## Evidence labels

- **Repository documented:** The current project README describes a capability.
- **Test observed:** A specific local or CI test was executed and produced a result.
- **Live observed:** A dated request or browser session confirmed a specific public behavior.
- **Not verified:** No suitable observation is available. This is not proof of failure.

The profile makes no uptime guarantee, and the static catalog cannot guarantee current availability. For security or data-sensitive flows, use the source and a controlled test environment instead of real personal information in public demos.
