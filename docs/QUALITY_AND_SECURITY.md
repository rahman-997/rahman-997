# Quality and security · a verification matrix

[Back to profile](../README.md) · [Reviewer guide](./REVIEWER_START_HERE.md)

A healthy workflow answers a narrow question about a particular commit. **CI is not proof** that every production endpoint, configuration and user journey is safe, and a passing scan does not guarantee the absence of vulnerabilities.

## Layers of verification

| Layer | What it can catch | What it cannot guarantee |
| --- | --- | --- |
| Static checks | Type errors, formatting, obvious security patterns | Runtime behavior and integration correctness |
| Unit tests | Branches and invariants in isolated logic | Real network, database and browser behavior |
| HTTP/integration tests | Contract regressions, middleware, persistence assumptions | All infrastructure configurations |
| Browser UX checks | Keyboard, navigation, loading/error states on tested devices | Every assistive technology and locale |
| Deployed smoke checks | Reachability of specific routes at a specific time | Long-term availability or security |

## Inspect real examples

- [Eventify](https://github.com/rahman-997/eventify): consult its README and workflows for security gates, auth boundaries, background work and observability checks.
- [BookHaven](https://github.com/rahman-997/bookbookhaven): review session boundaries, checkout/inventory tests, CSP/CORS choices and the transaction-oriented test profile.
- [Venues API](https://github.com/rahman-997/venues-api): inspect schema validation, HTTP status codes, request limits, and typecheck/test/build workflows.
- [Mizan Finance](https://github.com/rahman-997/mizan-finance): inspect validated local data flows, accessibility handling and behavior tests. Financial data in the local demo is not sent to a project-managed server according to its README; verify the deployed version separately.

## Practical pre-review checklist

- [ ] The reviewed commit SHA matches the code being discussed.
- [ ] CI completed successfully for that commit, not just for the default branch last week.
- [ ] The repository documents supported runtime versions, secrets and setup steps.
- [ ] Failure paths and permission checks have tests, not only happy-path demos.
- [ ] URLs that sleep, redirect or block automated probes are not reported as indisputably broken.
- [ ] Risks and deployment-specific limitations remain visible.

## Profile repository checks

Run these dependency-light local commands at the repository root:

```bash
node --test tests/*.test.mjs
node scripts/profile-audit.mjs
python3 -m unittest discover -s tests -p 'test_*.py'
python3 scripts/verify-svg.py
```

The [profile workflow](https://github.com/rahman-997/rahman-997/actions/workflows/link-health.yml) runs offline checks on Pull Requests; external link availability is handled separately on a schedule or by manual dispatch. **A green profile badge does not guarantee live site uptime.**

## Security boundaries

Never publish access tokens, production secrets or user data in screenshots, README examples or workflow logs. Avoid adding third-party external images or scripts to a public profile without reviewing their privacy implications. Document threat assumptions and what was actually tested.
