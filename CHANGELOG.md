# Changelog

## Unreleased

- Added worker reliability metadata for idempotency, leases, retry scheduling, cancellation, timeouts, and dead-letter handling.
- Added execution state-machine tests for lease handling, duplicate prevention, retry behavior, and exhausted retries.
- Added backend formatting enforcement to CI.
- Reworked repository documentation to describe FlowForge as a reference implementation.
- Added maintainer documentation for security, contribution flow, issue reports, and pull requests.
- Added MIT license.

## 0.1.0

- Initial portfolio implementation of FlowForge.
- Added FastAPI backend, PostgreSQL models, workflow validation, execution planning, Celery worker structure, seed data, Next.js frontend, React Flow builder, Docker Compose, CI, and observability configuration.
