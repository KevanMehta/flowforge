"use client";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartNoAxesCombined, Timer } from "lucide-react";
import { Cue } from "@/components/Cue";
import { Shell } from "@/components/Shell";
import { Kpi } from "@/components/Kpi";
import { useOverview } from "@/hooks/useApi";

export default function AnalyticsPage() {
  const { data } = useOverview();
  const utilization = [{ worker: "w1", value: 72 }, { worker: "w2", value: 44 }, { worker: "w3", value: 81 }, { worker: "w4", value: 29 }];
  const trend = [{ t: "08:00", ms: 900 }, { t: "10:00", ms: 1200 }, { t: "12:00", ms: 840 }, { t: "14:00", ms: 1840 }];
  return (
    <Shell>
      <h1 className="mb-1 text-2xl font-semibold">Analytics</h1>
      <p className="mb-5 text-sm text-slate-500">Use these views to spot reliability, latency, and capacity trends.</p>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Cue icon={Timer} title="Latency signal" text="Average duration highlights slow workflow runs. Drill into executions when it rises." />
        <Cue icon={ChartNoAxesCombined} title="Capacity signal" text="Worker utilization and queue depth show whether background execution is keeping up." />
      </div>
      <div className="grid grid-cols-4 gap-4"><Kpi label="Avg duration" value={`${data?.average_execution_time_ms ?? 0}ms`} /><Kpi label="Success" value={`${data?.success_rate ?? 0}%`} tone="green" /><Kpi label="Failure" value={`${data?.failure_rate ?? 0}%`} tone="red" /><Kpi label="Queue" value={data?.queue_depth ?? 0} tone="orange" /></div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="ff-card h-80 p-4"><div className="mb-3 font-semibold">Execution duration</div><ResponsiveContainer><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="t" /><YAxis /><Tooltip /><Line dataKey="ms" stroke="#2563eb" /></LineChart></ResponsiveContainer></div>
        <div className="ff-card h-80 p-4"><div className="mb-3 font-semibold">Worker utilization</div><ResponsiveContainer><BarChart data={utilization}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="worker" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#10b981" /></BarChart></ResponsiveContainer></div>
      </div>
    </Shell>
  );
}
