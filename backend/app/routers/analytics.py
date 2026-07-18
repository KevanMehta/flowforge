from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import current_user, require_roles
from ..models import Execution, NodeExecution, User, WorkerHeartbeat
from ..services.execution import analytics_overview

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
def overview(db: Session = Depends(get_db), user: User = Depends(current_user)):
    return analytics_overview(db)


@router.get("/execution-trends")
def execution_trends(db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = db.execute(
        select(func.date(Execution.created_at), Execution.status, func.count())
        .group_by(func.date(Execution.created_at), Execution.status)
        .order_by(func.date(Execution.created_at))
    ).all()
    return [
        {"date": str(day), "status": status, "count": count}
        for day, status, count in rows
    ]


@router.get("/failure-rate")
def failure_rate(db: Session = Depends(get_db), user: User = Depends(current_user)):
    rows = db.execute(
        select(NodeExecution.node_type, func.count())
        .where(NodeExecution.status == "failed")
        .group_by(NodeExecution.node_type)
    ).all()
    return [{"node_type": node_type, "failures": count} for node_type, count in rows]


@router.get("/worker-utilization")
def worker_utilization(
    db: Session = Depends(get_db), user: User = Depends(require_roles("admin"))
):
    workers = db.scalars(
        select(WorkerHeartbeat).order_by(WorkerHeartbeat.worker_name)
    ).all()
    return [
        {
            "worker": w.worker_name,
            "status": w.status,
            "utilization": w.metadata_json.get("utilization", 0),
        }
        for w in workers
    ]
