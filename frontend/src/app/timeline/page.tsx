"use client";
import { Shell } from "@/components/Shell";
import { StatusPill } from "@/components/StatusPill";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { useExecutions } from "@/hooks/useApi";

export default function TimelinePage() {
  const { data = [], isError, isLoading } = useExecutions();
  return (
    <Shell>
      <h1 className="mb-1 text-2xl font-semibold">Execution Timeline</h1>
      <p className="mb-5 text-sm text-slate-500">A quick chronological scan of recent workflow runs.</p>
      {isLoading && <LoadingBlock label="Loading execution timeline" />}
      {isError && <ErrorBlock label="Unable to load the execution timeline." />}
      {!isLoading && !isError && data.length === 0 && <EmptyBlock label="No timeline events yet. Run a workflow to populate this view." />}
      {!isLoading && !isError && data.length > 0 && <div className="ff-card p-4">
        <div className="grid grid-cols-[140px_1fr_120px] border-b border-slate-200 pb-3 pl-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Run date</span>
          <span>Execution ID</span>
          <span>Status</span>
        </div>
        {data.slice(0, 20).map((e: any) => <div key={e.id} className="grid grid-cols-[140px_1fr_120px] border-l-2 border-blue-200 py-3 pl-4 text-sm"><span>{new Date(e.started_at).toLocaleDateString()}</span><span className="font-mono">{e.id.slice(0, 12)}</span><StatusPill status={e.status} /></div>)}
      </div>}
    </Shell>
  );
}
