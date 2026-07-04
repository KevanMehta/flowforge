"use client";
import Link from "next/link";
import { History, RotateCcw } from "lucide-react";
import { Cue } from "@/components/Cue";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { Shell } from "@/components/Shell";
import { StatusPill } from "@/components/StatusPill";
import { useExecutions } from "@/hooks/useApi";

export default function ExecutionHistory() {
  const { data = [], isError, isLoading } = useExecutions();
  return (
    <Shell>
      <h1 className="mb-1 text-2xl font-semibold">Execution History</h1>
      <p className="mb-5 text-sm text-slate-500">Recent workflow runs, retries, cancellations, and scheduled triggers.</p>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Cue icon={History} title="Execution = one workflow run" text="Open a run to see overall status, timing, trigger type, node timeline, logs, artifacts, retry, and cancel controls." />
        <Cue icon={RotateCcw} title="Failures are inspectable" text="Failed runs keep node errors and attempts, so you can retry the workflow after checking the logs." />
      </div>
      {isLoading && <LoadingBlock label="Loading executions" />}
      {isError && <ErrorBlock label="Unable to load executions. Check API health and authentication." />}
      {!isLoading && !isError && data.length === 0 && <EmptyBlock label="No executions yet. Run a workflow to create the first execution record." />}
      {!isLoading && !isError && data.length > 0 && <div className="ff-card divide-y divide-slate-100">
        <div className="grid grid-cols-5 items-center gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Execution ID</span>
          <span>Trigger</span>
          <span>Status</span>
          <span>Started</span>
          <span>Completed</span>
        </div>
        {data.map((e: any) => (
          <Link key={e.id} href={`/executions/${e.id}`} className="grid grid-cols-5 items-center gap-4 p-4 text-sm hover:bg-slate-50">
            <span className="font-mono">{e.id.slice(0, 8)}</span>
            <span>{e.trigger_type}</span>
            <StatusPill status={e.status} />
            <span>{e.started_at ? new Date(e.started_at).toLocaleString() : "pending"}</span>
            <span>{e.completed_at ? new Date(e.completed_at).toLocaleString() : "open"}</span>
          </Link>
        ))}
      </div>}
    </Shell>
  );
}
