"""worker reliability metadata

Revision ID: 0002_worker_reliability
Revises: 0001_initial
Create Date: 2026-07-17
"""

from alembic import op
import sqlalchemy as sa


revision = "0002_worker_reliability"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "executions", sa.Column("idempotency_key", sa.String(length=160), nullable=True)
    )
    op.add_column(
        "executions",
        sa.Column(
            "cancel_requested", sa.Boolean(), server_default=sa.false(), nullable=False
        ),
    )
    op.create_index(
        "ix_executions_cancel_requested", "executions", ["cancel_requested"]
    )
    op.create_index(
        "ix_execution_workflow_idempotency",
        "executions",
        ["workflow_id", "idempotency_key"],
        unique=True,
    )

    op.add_column(
        "node_executions",
        sa.Column("idempotency_key", sa.String(length=220), nullable=True),
    )
    op.add_column(
        "node_executions",
        sa.Column("lease_owner", sa.String(length=160), nullable=True),
    )
    op.add_column(
        "node_executions",
        sa.Column("lease_expires_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "node_executions",
        sa.Column("heartbeat_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "node_executions",
        sa.Column("timeout_seconds", sa.Integer(), server_default="30", nullable=False),
    )
    op.add_column(
        "node_executions",
        sa.Column("next_retry_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.execute(
        "UPDATE node_executions SET idempotency_key = execution_id::text || ':' || node_key WHERE idempotency_key IS NULL"
    )
    op.alter_column("node_executions", "idempotency_key", nullable=False)
    op.create_index(
        "ix_node_execution_idempotency",
        "node_executions",
        ["idempotency_key"],
        unique=True,
    )
    op.create_index(
        "ix_node_executions_lease_owner", "node_executions", ["lease_owner"]
    )
    op.create_index(
        "ix_node_executions_lease_expires_at", "node_executions", ["lease_expires_at"]
    )
    op.create_index(
        "ix_node_executions_next_retry_at", "node_executions", ["next_retry_at"]
    )


def downgrade():
    op.drop_index("ix_node_executions_next_retry_at", table_name="node_executions")
    op.drop_index("ix_node_executions_lease_expires_at", table_name="node_executions")
    op.drop_index("ix_node_executions_lease_owner", table_name="node_executions")
    op.drop_index("ix_node_execution_idempotency", table_name="node_executions")
    op.drop_column("node_executions", "next_retry_at")
    op.drop_column("node_executions", "timeout_seconds")
    op.drop_column("node_executions", "heartbeat_at")
    op.drop_column("node_executions", "lease_expires_at")
    op.drop_column("node_executions", "lease_owner")
    op.drop_column("node_executions", "idempotency_key")

    op.drop_index("ix_execution_workflow_idempotency", table_name="executions")
    op.drop_index("ix_executions_cancel_requested", table_name="executions")
    op.drop_column("executions", "cancel_requested")
    op.drop_column("executions", "idempotency_key")
