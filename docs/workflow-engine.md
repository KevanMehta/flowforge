# Workflow Engine

The workflow engine accepts a directed acyclic graph of nodes and edges.

Validation checks:

- Unique node IDs.
- Supported node types.
- Missing trigger node.
- Missing node configuration.
- Invalid edges.
- Self edges.
- Cycles.
- Disconnected nodes.

Planning uses Kahn topological sorting to produce execution levels. Nodes inside the same level can run in parallel because all dependencies have completed.

Runtime behavior:

1. Create an execution row and node execution rows.
2. Mark execution running.
3. Process each topological level.
4. Merge parent outputs for downstream input.
5. Execute node runner.
6. Store output, logs, artifacts, notification events, and errors.
7. Mark execution success, failed, partial, or cancelled.

## Reliability Model

FlowForge stores reliability metadata on execution and node-execution records:

- `idempotency_key` prevents duplicate workflow run creation when callers retry a request.
- node-level idempotency keys prevent the same node from being represented more than once for an execution.
- `lease_owner`, `lease_expires_at`, and `heartbeat_at` model worker ownership.
- active leases cause duplicate node tasks to be ignored.
- expired leases can be recovered and returned to pending state.
- `attempt`, `max_retries`, and `next_retry_at` track retry scheduling.
- exhausted retries create dead-letter task records.
- `cancel_requested` allows the execution loop to stop between nodes.
- `timeout_seconds` records expected node runtime bounds; timeout detection marks slow nodes as failed.

The local demo still runs inline after creating persisted execution records. That keeps the project easy to review, while keeping the same metadata that a queue-backed worker path needs.
