import random
from datetime import UTC, datetime, timedelta
from sqlalchemy import select
from app.database import Base, SessionLocal, engine
from app.models import (
    DeadLetterTask,
    Execution,
    ExecutionArtifact,
    ExecutionLog,
    NodeExecution,
    Role,
    Schedule,
    User,
    WorkerHeartbeat,
    Workflow,
    WorkflowEdge,
    WorkflowNode,
    WorkflowVersion,
)
from app.security import hash_password


WORKFLOWS = [
    "Customer Support AI Triage",
    "Cloud Incident Summarizer",
    "Resume Screening Pipeline",
    "Data Quality Validation Pipeline",
    "Weekly Engineering Report Generator",
]


def sample_graph(index: int) -> tuple[list[dict], list[dict]]:
    nodes = [
        {"id": f"trigger-{index}", "type": "manual_trigger", "label": "Manual Trigger", "config": {}, "position": {"x": 0, "y": 120}},
        {"id": f"validate-{index}", "type": "validate_json", "label": "Validate Input", "config": {"schema": {"required": ["text"]}}, "position": {"x": 220, "y": 120}},
        {"id": f"ai-{index}", "type": "ai_summarizer", "label": "AI Summarizer", "config": {"field": "text"}, "position": {"x": 440, "y": 80}},
        {"id": f"report-{index}", "type": "report_generator", "label": "Generate Report", "config": {"title": "Execution Report"}, "position": {"x": 660, "y": 120}},
        {"id": f"notify-{index}", "type": "slack_notification", "label": "Notify Team", "config": {"channel": "#ops"}, "position": {"x": 880, "y": 120}},
    ]
    edges = [
        {"id": f"e1-{index}", "source": f"trigger-{index}", "target": f"validate-{index}"},
        {"id": f"e2-{index}", "source": f"validate-{index}", "target": f"ai-{index}"},
        {"id": f"e3-{index}", "source": f"ai-{index}", "target": f"report-{index}"},
        {"id": f"e4-{index}", "source": f"report-{index}", "target": f"notify-{index}"},
    ]
    return nodes, edges


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.scalar(select(User).where(User.email == "admin@flowforge.dev")):
            return
        roles = {}
        for name in ["admin", "developer", "viewer"]:
            role = Role(name=name, description=f"{name.title()} role")
            db.add(role)
            roles[name] = role
        db.flush()
        users = {
            "admin": User(email="admin@flowforge.dev", full_name="Avery Admin", hashed_password=hash_password("Password123!"), role_id=roles["admin"].id),
            "developer": User(email="developer@flowforge.dev", full_name="Devon Developer", hashed_password=hash_password("Password123!"), role_id=roles["developer"].id),
            "viewer": User(email="viewer@flowforge.dev", full_name="Vivian Viewer", hashed_password=hash_password("Password123!"), role_id=roles["viewer"].id),
        }
        db.add_all(users.values())
        db.flush()

        workflows: list[Workflow] = []
        for idx, name in enumerate(WORKFLOWS, start=1):
            workflow = Workflow(owner_id=users["developer"].id, name=name, description=f"Production-style demo workflow for {name.lower()}.", status="published", current_version=4)
            db.add(workflow)
            db.flush()
            nodes, edges = sample_graph(idx)
            for node in nodes:
                db.add(WorkflowNode(workflow_id=workflow.id, node_key=node["id"], type=node["type"], label=node["label"], config=node["config"], position=node["position"]))
            for edge in edges:
                db.add(WorkflowEdge(workflow_id=workflow.id, edge_key=edge["id"], source_node_key=edge["source"], target_node_key=edge["target"]))
            graph = {"nodes": nodes, "edges": edges}
            for version in range(1, 5):
                db.add(WorkflowVersion(workflow_id=workflow.id, version=version, graph=graph, validation={"valid": True, "errors": [], "warnings": []}, created_by_id=users["developer"].id))
            workflows.append(workflow)
        db.flush()

        statuses = ["success"] * 72 + ["failed"] * 18 + ["partial"] * 5 + ["cancelled"] * 5
        for idx in range(100):
            workflow = workflows[idx % len(workflows)]
            started = datetime.now(UTC) - timedelta(hours=idx * 3)
            completed = started + timedelta(seconds=random.randint(12, 240))
            execution = Execution(
                workflow_id=workflow.id,
                triggered_by_id=users["developer"].id,
                status=statuses[idx],
                trigger_type=random.choice(["manual", "webhook", "schedule"]),
                input_payload={"text": f"Demo payload {idx} for {workflow.name}", "priority": random.choice(["low", "medium", "high"])},
                execution_plan={"levels": [["trigger"], ["validate"], ["ai"], ["report"], ["notify"]]},
                started_at=started,
                completed_at=completed,
            )
            db.add(execution)
            db.flush()
            for node_idx, node_type in enumerate(["manual_trigger", "validate_json", "ai_summarizer", "report_generator", "slack_notification"]):
                failed = statuses[idx] == "failed" and node_idx == random.randint(1, 4)
                node_execution = NodeExecution(
                    execution_id=execution.id,
                    node_key=f"{node_type}-{idx}",
                    node_type=node_type,
                    status="failed" if failed else "success",
                    attempt=2 if failed else 1,
                    input_payload={"text": "incoming"},
                    output_payload={"ok": not failed},
                    error="Simulated downstream timeout" if failed else None,
                    started_at=started + timedelta(seconds=node_idx * 9),
                    completed_at=started + timedelta(seconds=node_idx * 9 + 6),
                )
                db.add(node_execution)
                db.flush()
                for line in range(2):
                    db.add(ExecutionLog(execution_id=execution.id, node_execution_id=node_execution.id, level="ERROR" if failed and line == 1 else "INFO", message=f"{node_type} log line {line}", context={"node_type": node_type}))
            if idx < 20:
                db.add(ExecutionArtifact(execution_id=execution.id, name=f"report-{idx}.md", artifact_type="markdown", content={"markdown": f"# Report {idx}\nGenerated by FlowForge."}))

        for idx in range(5):
            db.add(WorkerHeartbeat(worker_name=f"flowforge-worker-{idx + 1}", queue_name="celery", status="online", metadata_json={"utilization": random.randint(15, 92), "processed": random.randint(100, 900)}))
        for idx in range(10):
            db.add(Schedule(workflow_id=workflows[idx % len(workflows)].id, created_by_id=users["developer"].id, name=f"Schedule {idx + 1}", cron="0 9 * * 1", is_active=idx % 4 != 0))
        for idx in range(15):
            db.add(DeadLetterTask(task_name="flowforge.execute_node", payload={"node": idx}, error="Retries exhausted", attempts=3))
        db.commit()


if __name__ == "__main__":
    seed()
