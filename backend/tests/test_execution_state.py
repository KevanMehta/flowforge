from datetime import timedelta
from types import SimpleNamespace
from uuid import uuid4

import pytest

from app.engine.state import (
    InvalidStateTransition,
    RetryPolicy,
    lease_is_active,
    transition,
    utcnow,
)
from app.models.enums import ExecutionStatus
from app.services.execution import ExecutionService


class FakeSession:
    def __init__(self):
        self.added = []

    def add(self, obj):
        self.added.append(obj)


def node_execution(**overrides):
    values = {
        "id": uuid4(),
        "execution_id": uuid4(),
        "node_key": "summarize",
        "node_type": "ai_summarizer",
        "status": ExecutionStatus.pending.value,
        "attempt": 0,
        "max_retries": 1,
        "lease_owner": None,
        "lease_expires_at": None,
        "heartbeat_at": None,
        "timeout_seconds": 30,
        "next_retry_at": None,
        "input_payload": {},
        "output_payload": {},
        "error": None,
        "started_at": None,
        "completed_at": None,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def test_state_machine_rejects_terminal_transition():
    with pytest.raises(InvalidStateTransition):
        transition(ExecutionStatus.success.value, ExecutionStatus.running.value)


def test_retry_policy_uses_exponential_backoff():
    policy = RetryPolicy(max_retries=3, base_delay_seconds=2, max_delay_seconds=10)

    assert policy.should_retry(1) is True
    assert policy.should_retry(4) is False
    assert policy.next_delay(1) == 2
    assert policy.next_delay(3) == 8
    assert policy.next_delay(5) == 10


def test_active_lease_prevents_duplicate_node_execution():
    service = ExecutionService(FakeSession())
    node = node_execution(
        status=ExecutionStatus.running.value,
        lease_owner="worker-a",
        lease_expires_at=utcnow() + timedelta(seconds=30),
    )

    acquired = service._acquire_node_lease(node, "worker-b")

    assert acquired is False
    assert node.lease_owner == "worker-a"


def test_expired_lease_can_be_reacquired():
    service = ExecutionService(FakeSession())
    node = node_execution(
        status=ExecutionStatus.running.value,
        lease_owner="worker-a",
        lease_expires_at=utcnow() - timedelta(seconds=1),
    )

    acquired = service._acquire_node_lease(node, "worker-b")

    assert acquired is True
    assert node.lease_owner == "worker-b"
    assert lease_is_active(node.lease_expires_at)


def test_node_failure_schedules_retry_before_dead_letter():
    service = ExecutionService(FakeSession())
    execution = SimpleNamespace(id=uuid4())
    node = node_execution(attempt=1, max_retries=1)

    service._handle_node_failure(
        execution,
        node,
        {"label": "Summarize"},
        RuntimeError("temporary failure"),
        RetryPolicy(max_retries=1),
    )

    assert node.status == ExecutionStatus.pending.value
    assert node.next_retry_at is not None
    assert node.error == "temporary failure"


def test_node_failure_writes_dead_letter_after_retries_exhausted():
    fake_db = FakeSession()
    service = ExecutionService(fake_db)
    execution = SimpleNamespace(id=uuid4())
    node = node_execution(attempt=2, max_retries=1, input_payload={"text": "hello"})

    service._handle_node_failure(
        execution,
        node,
        {"label": "Summarize"},
        RuntimeError("permanent failure"),
        RetryPolicy(max_retries=1),
    )

    assert node.status == ExecutionStatus.failed.value
    assert any(item.__class__.__name__ == "DeadLetterTask" for item in fake_db.added)
