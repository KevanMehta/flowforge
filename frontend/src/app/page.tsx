"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, GitBranch, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Cue, MiniCue } from "@/components/Cue";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { Shell } from "@/components/Shell";
import { Kpi } from "@/components/Kpi";
import { StatusPill } from "@/components/StatusPill";
import { useExecutions, useOverview } from "@/hooks/useApi";

const trends = [
  { day: "Mon", executions: 28, failures: 2 },
  { day: "Tue", executions: 34, failures: 5 },
  { day: "Wed", executions: 41, failures: 3 },
  { day: "Thu", executions: 38, failures: 4 },
  { day: "Fri", executions: 52, failures: 6 }
];

export default function Dashboard() {
  const { data: overview, isError: overviewError, isLoading: overviewLoading } = useOverview();
  const { data: executions = [], isError: executionsError, isLoading: executionsLoading } = useExecutions();
  return (
    <Shell>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-slate-500">Operational health across workflows, workers, queues, and AI nodes.</p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Cue icon={Activity} title="What you are seeing" text="This workspace is preloaded with demo workflows, execution history, workers, logs, and failures so the platform can be explored immediately." />
        <Cue icon={GitBranch} title="Best first click" text="Open Workflows, run Customer Support AI Triage, then inspect the generated execution timeline and logs." />
        <Cue icon={PlayCircle} title="Try the builder" text="Create a small DAG, validate it, publish it, and run it from the visual canvas." />
      </div>
      {overviewLoading && <LoadingBlock label="Loading dashboard metrics" />}
      {overviewError && <ErrorBlock label="Unable to load dashboard metrics." />}
      {!overviewLoading && !overviewError && <div className="grid grid-cols-6 gap-4">
        <Kpi label="Workflows" value={overview?.total_workflows ?? 0} />
        <Kpi label="Executions" value={overview?.total_executions ?? 0} />
        <Kpi label="Success rate" value={`${overview?.success_rate ?? 0}%`} tone="green" />
        <Kpi label="Failure rate" value={`${overview?.failure_rate ?? 0}%`} tone="red" />
        <Kpi label="Queue depth" value={overview?.queue_depth ?? 0} tone="orange" />
        <Kpi label="Workers" value={overview?.active_workers ?? 0} />
      </div>}
      <div className="mt-4 grid grid-cols-5 gap-4">
        <div className="ff-card col-span-3 p-4">
          <div className="mb-3 font-semibold">Executions over time</div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area dataKey="executions" stroke="#2563eb" fill="#bfdbfe" />
                <Area dataKey="failures" stroke="#ef4444" fill="#fecaca" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="ff-card col-span-2 p-4">
          <div className="mb-3 font-semibold">Failed nodes by type</div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={[{ type: "HTTP", count: 6 }, { type: "AI", count: 4 }, { type: "Notify", count: 3 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <MiniCue label="Success rate" text="Completed executions divided by all seeded runs. Drops here usually point to node or integration failures." />
        <MiniCue label="Queue depth" text="How much work is waiting for workers. A growing queue means more capacity or fewer schedules may be needed." />
        <MiniCue label="Failed nodes" text="The fastest path to debugging. Start with the node type, then drill into execution logs." />
      </div>
      <div className="mt-4 ff-card p-4">
        <div className="mb-3 font-semibold">Recent failed executions</div>
        <div className="mb-2 text-sm text-slate-500">Click any execution in the history page to see node status, retries, logs, and artifacts.</div>
        <div className="divide-y divide-slate-100">
          <div className="grid grid-cols-[1fr_120px_120px] items-center py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Execution ID</span>
            <span>Trigger</span>
            <span>Status</span>
          </div>
          {executionsLoading && <div className="py-3"><LoadingBlock label="Loading failed executions" /></div>}
          {executionsError && <div className="py-3"><ErrorBlock label="Unable to load failed executions." /></div>}
          {!executionsLoading && !executionsError && executions.filter((e: any) => e.status === "failed").length === 0 && <div className="py-3"><EmptyBlock label="No failed executions in the current dataset." /></div>}
          {!executionsLoading && !executionsError && executions.filter((e: any) => e.status === "failed").slice(0, 6).map((e: any) => (
            <Link key={e.id} href={`/executions/${e.id}`} className="grid grid-cols-[1fr_120px_120px] items-center py-3 text-sm hover:bg-slate-50">
              <span className="font-mono text-slate-600">{e.id.slice(0, 8)}</span>
              <span>{e.trigger_type}</span>
              <StatusPill status={e.status} />
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
