# API

Authentication:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Users:

- `GET /users`
- `GET /users/{id}`
- `PATCH /users/{id}/role`

Workflows:

- `POST /workflows`
- `GET /workflows`
- `GET /workflows/{id}`
- `PUT /workflows/{id}`
- `DELETE /workflows/{id}`
- `POST /workflows/{id}/validate`
- `POST /workflows/{id}/publish`
- `GET /workflows/{id}/versions`
- `POST /workflows/{id}/rollback/{version_id}`

Executions:

- `POST /workflows/{id}/run`
- `GET /executions`
- `GET /executions/{id}`
- `POST /executions/{id}/cancel`
- `POST /executions/{id}/retry`
- `GET /executions/{id}/logs`
- `GET /executions/{id}/timeline`
- `GET /executions/{id}/artifacts`

Schedules, workers, analytics, health, readiness, and metrics are exposed through `/schedules`, `/workers`, `/analytics`, `/health`, `/ready`, and `/metrics`.
