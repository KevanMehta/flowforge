from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from ..models.enums import ExecutionStatus


TERMINAL_STATUSES = {
    ExecutionStatus.success.value,
    ExecutionStatus.failed.value,
    ExecutionStatus.cancelled.value,
    ExecutionStatus.partial.value,
    ExecutionStatus.skipped.value,
}


RETRYABLE_STATUSES = {
    ExecutionStatus.pending.value,
    ExecutionStatus.failed.value,
}


class InvalidStateTransition(RuntimeError):
    pass


@dataclass(frozen=True)
class RetryPolicy:
    max_retries: int = 3
    base_delay_seconds: int = 2
    max_delay_seconds: int = 60

    def next_delay(self, attempt: int) -> int:
        delay = self.base_delay_seconds * (2 ** max(attempt - 1, 0))
        return min(delay, self.max_delay_seconds)

    def should_retry(self, attempt: int) -> bool:
        return attempt <= self.max_retries


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def transition(current: str, target: str) -> str:
    allowed = {
        ExecutionStatus.pending.value: {
            ExecutionStatus.running.value,
            ExecutionStatus.cancelled.value,
            ExecutionStatus.failed.value,
        },
        ExecutionStatus.running.value: {
            ExecutionStatus.success.value,
            ExecutionStatus.failed.value,
            ExecutionStatus.cancelled.value,
            ExecutionStatus.partial.value,
        },
        ExecutionStatus.failed.value: {
            ExecutionStatus.pending.value,
            ExecutionStatus.running.value,
            ExecutionStatus.cancelled.value,
        },
        ExecutionStatus.success.value: set(),
        ExecutionStatus.cancelled.value: set(),
        ExecutionStatus.partial.value: set(),
        ExecutionStatus.skipped.value: set(),
    }
    if target == current:
        return target
    if target not in allowed.get(current, set()):
        raise InvalidStateTransition(f"Cannot transition from {current} to {target}.")
    return target


def lease_is_active(
    lease_expires_at: datetime | None, now: datetime | None = None
) -> bool:
    return lease_expires_at is not None and lease_expires_at > (now or utcnow())


def retry_at(
    policy: RetryPolicy, attempt: int, now: datetime | None = None
) -> datetime:
    return (now or utcnow()) + timedelta(seconds=policy.next_delay(attempt))
