# Architecture Decisions

This document captures the main implementation choices in FlowForge and the tradeoffs behind them.

## FastAPI for the Control Plane

FastAPI keeps the API layer explicit, typed, and easy to inspect through OpenAPI. The project uses routers for product areas, Pydantic for request validation, SQLAlchemy for persistence, and dependency-based RBAC for protected routes.

## Celery and Redis for Worker Execution

Celery and Redis are familiar, battle-tested choices for queue-backed Python workers. FlowForge models workflow execution as persisted execution and node-execution records so workers can report status, logs, outputs, and retry attempts back to the control plane.

## Inline Local Execution for the Demo

The local demo runs executions inline after creating the same database records used by the worker model. This keeps the product responsive for a reviewer running `docker compose up --build`, while preserving the queue/worker structure for future distributed execution.

## Deterministic AI Fallback

AI nodes do not require a paid API key. When `OPENAI_API_KEY` is absent, summarization, classification, and JSON generation use deterministic local logic. This makes the repository repeatable in CI and usable in local demos.

## React Flow for the Builder

React Flow provides a proven canvas interaction model for node graphs. FlowForge keeps the builder focused on workflow authoring: add nodes, connect edges, configure JSON, validate, publish, and run.

## PostgreSQL as the Source of Truth

Workflows, versions, executions, node executions, logs, artifacts, schedules, audit records, and worker heartbeats are stored in PostgreSQL. This favors clear relational integrity and inspectable state over an opaque in-memory orchestrator.

## Prometheus and Grafana for Observability

The platform exposes health, readiness, and Prometheus metrics. Grafana provisioning is included so the demo has an operations story from the first startup.
