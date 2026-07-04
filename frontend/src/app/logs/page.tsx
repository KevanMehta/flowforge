"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListFilter } from "lucide-react";
import { Cue } from "@/components/Cue";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { Shell } from "@/components/Shell";
import { useExecutions } from "@/hooks/useApi";
import { api } from "@/api/client";

export default function LogsViewer() {
  const { data: executions = [] } = useExecutions();
  const [selected, setSelected] = useState("");
  const executionId = selected || executions[0]?.id;
  const { data: logs = [], isError, isLoading } = useQuery({ queryKey: ["logs", executionId], enabled: Boolean(executionId), queryFn: async () => (await api.get(`/executions/${executionId}/logs`)).data });
  return (
    <Shell>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Logs Viewer</h1>
          <p className="text-sm text-slate-500">Select an execution to trace node starts, completions, and errors.</p>
        </div>
        <select className="rounded-md border border-slate-300 px-3 py-2" value={executionId} onChange={(e) => setSelected(e.target.value)}>
          {executions.map((e: any) => <option key={e.id} value={e.id}>{e.id.slice(0, 8)} {e.status}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <Cue icon={ListFilter} title="How to read logs" text="INFO lines show progress through the DAG. ERROR lines include failed node context and are the best starting point for retries." />
      </div>
      {!executionId && <EmptyBlock label="No executions are available yet. Run a workflow to generate logs." />}
      {executionId && isLoading && <LoadingBlock label="Loading execution logs" />}
      {executionId && isError && <ErrorBlock label="Unable to load logs for this execution." />}
      {executionId && !isLoading && !isError && logs.length === 0 && <EmptyBlock label="This execution does not have logs yet." />}
      {executionId && !isLoading && !isError && logs.length > 0 && <div className="ff-card overflow-hidden">
        <div className="grid grid-cols-[90px_1fr_180px] border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Level</span>
          <span>Message</span>
          <span>Time</span>
        </div>
        {logs.map((log: any) => <div key={log.id} className="grid grid-cols-[90px_1fr_180px] border-b border-slate-100 px-4 py-2 font-mono text-xs"><span>{log.level}</span><span>{log.message}</span><span>{new Date(log.created_at).toLocaleTimeString()}</span></div>)}
      </div>}
    </Shell>
  );
}
