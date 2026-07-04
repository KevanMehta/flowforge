# Architecture

FlowForge uses a control-plane and worker-plane architecture.

The control plane is FastAPI. It owns authentication, RBAC, workflow CRUD, graph validation, versioning, execution records, logs, metrics, schedules, and analytics.

The worker plane is Celery over Redis. Workers consume execution tasks, run node logic, persist outputs, and report heartbeats. The local demo keeps execution inline after creating the same persisted execution records, which makes `docker compose up --build` usable without tuning distributed queues.

```text
Next.js UI
  -> FastAPI routers
    -> Services: auth, validation, planning, execution, audit, observability
      -> PostgreSQL
      -> Redis / Celery workers
Prometheus scrapes /metrics
Grafana provisions dashboards from infra/grafana
```

Security assumptions: single demo tenant, environment-based secrets, bcrypt passwords, JWT access tokens, refresh token structure, role checks in dependencies, ORM-only database access, CORS restrictions, secure headers, and rate limiting.
