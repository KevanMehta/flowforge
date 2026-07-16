# Security Policy

## Supported Versions

FlowForge is a portfolio reference implementation. Security fixes are applied to the `main` branch.

## Reporting a Vulnerability

Please do not open a public issue for a vulnerability.

Report security concerns by contacting the repository owner through GitHub. Include:

- affected component
- steps to reproduce
- impact
- suggested fix, if known

## Security Assumptions

- The local demo runs with demo users and demo data.
- Secrets should be supplied through environment variables and not committed.
- `JWT_SECRET` must be replaced before any non-local deployment.
- PostgreSQL, Redis, Prometheus, and Grafana should be private or protected behind trusted networking in a deployed environment.
- Notification nodes simulate delivery and do not send real email or Slack messages by default.
- AI nodes can run with deterministic local fallback. If `OPENAI_API_KEY` is provided, requests leave the local environment.

## Known Limitations

- External OAuth providers are not configured.
- Multi-tenant isolation is not implemented.
- The Terraform files are starter templates, not a hardened cloud landing zone.
- The test suite is intentionally small and does not prove complete security coverage.
