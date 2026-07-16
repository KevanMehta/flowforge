# Architecture Decision Records

These notes document the main implementation choices in FlowForge. They are intentionally short; the goal is to explain why the project is shaped this way and where the tradeoffs are.

## ADR 001: FastAPI Control Plane

**Context**

FlowForge needs an HTTP API for authentication, workflow management, graph validation, execution records, schedules, analytics, and health checks.

**Decision**

Use FastAPI with Pydantic schemas, SQLAlchemy models, and router modules organized by product area.

**Alternatives**

- Django REST Framework
- Spring Boot
- Express/NestJS

**Tradeoffs**

FastAPI keeps the Python API layer compact and makes OpenAPI docs available without extra tooling. Django would provide more built-in admin functionality, and Spring Boot would be a stronger fit for some enterprise teams, but both add more framework weight than this reference implementation needs.

**Consequences**

The API surface is easy to inspect locally at `/docs`, and the backend stays close to the workflow engine logic.

## ADR 002: PostgreSQL As The Source Of Truth

**Context**

Workflow state includes users, roles, workflow versions, nodes, edges, executions, node executions, logs, artifacts, schedules, audit logs, and worker heartbeats.

**Decision**

Use PostgreSQL with SQLAlchemy and Alembic.

**Alternatives**

- MongoDB
- SQLite
- Redis-only persistence

**Tradeoffs**

PostgreSQL fits the relational shape of the data and makes execution state inspectable. MongoDB would make graph payload storage flexible, but the project benefits from foreign keys, indexes, and explicit relationships. SQLite would simplify local setup, but it would make the worker/database story less realistic.

**Consequences**

The schema is more verbose, but it demonstrates a clearer control-plane data model.

## ADR 003: Redis And Celery Worker Model

**Context**

Workflow nodes should be represented as asynchronous work that can be retried and monitored.

**Decision**

Use Redis as the broker and Celery for worker tasks.

**Alternatives**

- Temporal
- Dramatiq
- RQ
- A custom worker loop

**Tradeoffs**

Celery is familiar in Python projects and easy to run under Docker Compose. Temporal would provide stronger durable execution semantics, but it would make the local demo heavier and shift attention away from the control-plane implementation.

**Consequences**

The repo demonstrates queue-backed worker boundaries, task execution, and heartbeat concepts without requiring a full workflow engine runtime.

## ADR 004: Inline Execution For Local Demo

**Context**

A reviewer should be able to run a workflow immediately after starting the stack.

**Decision**

Create persisted execution records and run the demo execution path inline while keeping the Celery worker structure in place.

**Alternatives**

- Require every run to go through Celery
- Use synchronous-only execution

**Tradeoffs**

Inline execution makes the demo easier to review and avoids timing issues in the UI. It is not equivalent to a full distributed execution model.

**Consequences**

The project can show execution status, logs, and artifacts quickly, while future work can move more execution paths into Celery primitives.

## ADR 005: Deterministic AI Fallback

**Context**

AI nodes should be usable in local demos and CI without a paid API key.

**Decision**

Use deterministic local behavior when `OPENAI_API_KEY` is missing.

**Alternatives**

- Require OpenAI for all AI nodes
- Remove AI nodes from local mode
- Mock AI responses only in tests

**Tradeoffs**

The fallback makes demos repeatable, but it does not represent model quality. Any behavior using an external model should be evaluated separately.

**Consequences**

AI nodes remain visible and testable without external dependencies.

## ADR 006: React Flow Builder

**Context**

The workflow editor needs node placement, edge creation, selection, and configuration.

**Decision**

Use React Flow in the Next.js frontend.

**Alternatives**

- Custom canvas implementation
- Mermaid-based text editing
- A form-only workflow editor

**Tradeoffs**

React Flow reduces canvas implementation work and supports a familiar node-graph interaction model. It also adds a specialized frontend dependency.

**Consequences**

The builder can focus on workflow concepts instead of low-level graph UI mechanics.

## ADR 007: Docker Compose Local Environment

**Context**

The project depends on a frontend, backend, PostgreSQL, Redis, worker, scheduler, Prometheus, Grafana, and Nginx.

**Decision**

Use Docker Compose as the primary local setup path.

**Alternatives**

- Local process scripts only
- Kubernetes manifests
- Cloud-first deployment

**Tradeoffs**

Compose is straightforward for a portfolio repository and keeps the review flow repeatable. Kubernetes would be more representative of some deployments, but it would add setup overhead that is not needed for this repo.

**Consequences**

A reviewer can run the stack locally with one command, and the infrastructure remains readable.

## ADR 008: Prometheus And Grafana

**Context**

Workflow systems need operational visibility into health, queue state, worker activity, and execution outcomes.

**Decision**

Expose Prometheus metrics and include Grafana provisioning.

**Alternatives**

- Logs only
- OpenTelemetry collector setup
- Hosted observability services

**Tradeoffs**

Prometheus and Grafana are easy to run locally and make the observability story inspectable. The setup is intentionally small and does not include alert routing or long-term metrics storage.

**Consequences**

The project demonstrates basic operational instrumentation without depending on external services.
