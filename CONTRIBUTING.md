# Contributing

FlowForge is primarily a portfolio project, but small improvements are welcome.

## Local Development

```bash
docker compose up --build
```

Run tests:

```bash
./scripts/test.sh
```

Frontend-only checks:

```bash
cd frontend
npm run lint
npm test
npm run build
```

Backend-only checks:

```bash
cd backend
ruff check .
pytest
```

## Pull Request Guidelines

- Keep changes focused.
- Avoid unrelated formatting churn.
- Update documentation when behavior changes.
- Do not commit generated files such as `.next/`, `node_modules/`, `__pycache__/`, or `.pytest_cache/`.
- Clearly label simulated behavior, demo data, and local-only assumptions.

## Commit Style

Use concise conventional-style messages when practical:

```text
feat(workflows): add graph validation error details
fix(auth): reject inactive users during login
docs: clarify local demo tradeoffs
```
