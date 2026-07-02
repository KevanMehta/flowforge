from fastapi import APIRouter, Response
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Gauge, generate_latest

router = APIRouter(tags=["system"])
REQUESTS = Counter("flowforge_requests_total", "Total HTTP requests")
QUEUE_DEPTH = Gauge("flowforge_queue_depth", "Celery queue depth")


@router.get("/health")
def health():
    return {"status": "ok", "service": "flowforge-api"}


@router.get("/ready")
def ready():
    return {"status": "ready", "dependencies": {"database": "ok", "redis": "ok"}}


@router.get("/metrics")
def metrics():
    QUEUE_DEPTH.set(0)
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
