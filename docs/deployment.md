# Deployment

Local deployment:

```bash
docker compose up --build
```

AWS deployment path:

1. Build and push backend and frontend images to ECR.
2. Provision RDS PostgreSQL and ElastiCache Redis.
3. Deploy backend, worker, scheduler, and frontend services on ECS Fargate.
4. Put the frontend/API behind an Application Load Balancer.
5. Scrape `/metrics` with managed Prometheus or a Prometheus task.
6. Import the Grafana dashboard from `infra/grafana/dashboards`.
7. Store secrets in AWS Secrets Manager or SSM Parameter Store.

Terraform templates in `infra/terraform` provide a starting cluster, RDS instance, and Redis cluster.
