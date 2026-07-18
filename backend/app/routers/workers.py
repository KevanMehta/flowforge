from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import require_roles
from ..models import User, WorkerHeartbeat

router = APIRouter(prefix="/workers", tags=["workers"])


@router.get("")
def workers(
    db: Session = Depends(get_db), user: User = Depends(require_roles("admin"))
):
    return [
        {
            "id": str(w.id),
            "worker_name": w.worker_name,
            "queue_name": w.queue_name,
            "status": w.status,
            "last_seen_at": w.last_seen_at,
            "metadata": w.metadata_json,
        }
        for w in db.scalars(select(WorkerHeartbeat))
    ]


@router.get("/health")
def worker_health(
    db: Session = Depends(get_db), user: User = Depends(require_roles("admin"))
):
    items = list(db.scalars(select(WorkerHeartbeat)))
    return {"healthy": all(w.status == "online" for w in items), "workers": len(items)}


@router.get("/queue-depth")
def queue_depth(user: User = Depends(require_roles("admin"))):
    return {"queue": "celery", "depth": 0, "dead_letter": 15}
