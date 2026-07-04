"use client";
import { Shell } from "@/components/Shell";
import { StatusPill } from "@/components/StatusPill";
import { useWorkers } from "@/hooks/useApi";
import { Activity, Gauge } from "lucide-react";
import { Cue } from "@/components/Cue";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/StateBlock";

export default function WorkerHealth() {
  const { data = [], isError, isLoading } = useWorkers();
  return (
    <Shell>
      <h1 className="mb-1 text-2xl font-semibold">Worker Health</h1>
      <p className="mb-5 text-sm text-slate-500">Workers execute queued workflow nodes and report heartbeats back to the control plane.</p>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Cue icon={Activity} title="Online means reachable" text="The worker heartbeat is fresh, so queued node tasks can be picked up." />
        <Cue icon={Gauge} title="Utilization shows pressure" text="High utilization is healthy during bursts, but sustained high values usually mean more workers are needed." />
      </div>
      {isLoading && <LoadingBlock label="Loading worker heartbeats" />}
      {isError && <ErrorBlock label="Unable to load worker health. Admin access may be required." />}
      {!isLoading && !isError && data.length === 0 && <EmptyBlock label="No worker heartbeats have been recorded yet." />}
      {!isLoading && !isError && data.length > 0 && <div className="grid grid-cols-3 gap-4">
        {data.map((w: any) => (
          <div key={w.id} className="ff-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Worker</div>
                <div className="mt-1 font-semibold">{w.worker_name}</div>
              </div>
              <StatusPill status={w.status} />
            </div>
            <div className="mb-3 text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Queue</span>
              <span className="ml-2 text-slate-700">{w.queue_name}</span>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Utilization</span>
                <span>{w.metadata?.utilization || 0}%</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div className="h-2 rounded bg-forge" style={{ width: `${w.metadata?.utilization || 0}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>}
    </Shell>
  );
}
