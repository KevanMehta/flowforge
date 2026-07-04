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

Retry resets failed node state and replays the execution. Dead-letter tasks store exhausted retry metadata.
