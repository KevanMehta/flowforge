# Security

FlowForge implements the following safeguards:

- Password hashing with bcrypt.
- JWT access tokens and refresh-token structure.
- Role-based route dependencies for admin, developer, and viewer capabilities.
- Request validation through Pydantic schemas.
- ORM database access through SQLAlchemy to prevent SQL injection.
- CORS configuration from environment.
- Rate limiting through SlowAPI.
- Secure headers for clickjacking and content sniffing protection.
- Environment-based secrets with `.env.example`.
- Audit logs for authentication, workflow changes, execution starts, and permission-sensitive actions.

Production guidance:

- Replace `JWT_SECRET` with a long random value.
- Terminate TLS at an ALB, CDN, or Nginx.
- Use managed PostgreSQL and Redis with private networking.
- Rotate API keys and database credentials.
- Restrict Grafana and Prometheus behind SSO or VPN.
