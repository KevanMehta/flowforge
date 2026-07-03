"use client";
import Link from "next/link";
import { GitPullRequestArrow, Play, Plus, Sparkles } from "lucide-react";
import { Cue, MiniCue } from "@/components/Cue";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { Shell } from "@/components/Shell";
import { StatusPill } from "@/components/StatusPill";
import { useRunWorkflow, useWorkflows } from "@/hooks/useApi";

function RunButton({ id }: { id: string }) {
  const run = useRunWorkflow(id);
  return (
    <button title="Run workflow" className="rounded-md border border-slate-300 p-2 hover:bg-slate-50" onClick={() => run.mutate()}>
      <Play className="h-4 w-4" />
    </button>
  );
}

export default function WorkflowList() {
  const { data = [], isError, isLoading } = useWorkflows();
  return (
    <Shell>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <p className="text-sm text-slate-500">Versioned DAGs with validation, publishing, and manual execution.</p>
        </div>
        <Link className="flex items-center gap-2 rounded-md bg-forge px-3 py-2 text-sm font-semibold text-white" href="/workflows/builder">
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Cue icon={GitPullRequestArrow} title="Workflow = versioned DAG" text="Each row is a saved graph of connected nodes. Published workflows can be run and traced from input to final artifact." />
        <Cue icon={Sparkles} title="Quick demo path" text="Press the run icon on a published workflow, then open Executions to inspect the node-by-node result." />
      </div>
      <div className="mb-3 grid grid-cols-3 gap-3">
        <MiniCue label="Run" text="Starts a manual execution with a demo payload." />
        <MiniCue label="Edit" text="Opens the visual graph builder and node configuration panel." />
        <MiniCue label="Version" text="Every saved graph change creates a recoverable workflow version." />
      </div>
      {isLoading && <LoadingBlock label="Loading workflows" />}
      {isError && <ErrorBlock label="Unable to load workflows. Check API health and authentication." />}
      {!isLoading && !isError && data.length === 0 && <EmptyBlock label="No workflows yet. Create one from the builder to get started." />}
      {!isLoading && !isError && data.length > 0 && <div className="ff-card divide-y divide-slate-100">
        <div className="grid grid-cols-5 items-center gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span className="col-span-2">Workflow</span>
          <span>Version</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {data.map((workflow: any) => (
          <div key={workflow.id} className="grid grid-cols-5 items-center gap-4 p-4 text-sm">
            <Link href={`/workflows/${workflow.id}`} className="col-span-2 font-semibold text-forge">{workflow.name}</Link>
            <span>v{workflow.current_version}</span>
            <StatusPill status={workflow.status} />
            <div className="flex justify-end gap-2">
              <RunButton id={workflow.id} />
              <Link className="rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-50" href={`/workflows/${workflow.id}/builder`}>Edit</Link>
            </div>
          </div>
        ))}
      </div>}
    </Shell>
  );
}
