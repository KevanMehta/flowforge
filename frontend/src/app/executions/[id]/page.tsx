"use client";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, RotateCcw } from "lucide-react";
import { Cue, MiniCue } from "@/components/Cue";
import { Shell } from "@/components/Shell";
import { StatusPill } from "@/components/StatusPill";
import { ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { api } from "@/api/client";

export default function ExecutionDetail() {
  const params = useParams();
  const id = String(params?.id || "");
  const qc = useQueryClient();
  const { data, isError, isLoading } = useQuery({ queryKey: ["execution", id], queryFn: async () => (await api.get(`/executions/${id}`)).data });
  const retry = useMutation({ mutationFn: async () => api.post(`/executions/${id}/retry`), onSuccess: () => qc.invalidateQueries({ queryKey: ["execution", id] }) });
  const cancel = useMutation({ mutationFn: async () => api.post(`/executions/${id}/cancel`), onSuccess: () => qc.invalidateQueries({ queryKey: ["execution", id] }) });
  if (isLoading) return <Shell><LoadingBlock label="Loading execution details" /></Shell>;
  if (isError || !data) return <Shell><ErrorBlock label="Unable to load execution details." /></Shell>;
  const duration = data.started_at && data.completed_at ? `${Math.round((Date.parse(data.completed_at) - Date.parse(data.started_at)) / 1000)}s` : "running";
  return (
    <Shell>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Execution {String(id).slice(0, 8)}</h1>
          <p className="text-sm text-slate-500">Triggered by {data.trigger_type}, duration {duration}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm" onClick={() => cancel.mutate()}>Cancel</button>
          <button className="rounded-md bg-forge px-3 py-2 text-sm font-semibold text-white" onClick={() => retry.mutate()}>Retry</button>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Cue icon={FileText} title="This is the run record" text="The timeline below shows each node, its attempt count, status, timing, and any captured error." />
        <Cue icon={RotateCcw} title="Retry keeps context" text="Use retry after reading the failed node. The execution will replay and preserve fresh logs." />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="ff-card p-4"><div className="text-sm text-slate-500">Status</div><StatusPill status={data.status} /></div>
        <div className="ff-card p-4"><div className="text-sm text-slate-500">Started</div><div>{data.started_at ? new Date(data.started_at).toLocaleTimeString() : "pending"}</div></div>
        <div className="ff-card p-4"><div className="text-sm text-slate-500">Completed</div><div>{data.completed_at ? new Date(data.completed_at).toLocaleTimeString() : "open"}</div></div>
        <div className="ff-card p-4"><div className="text-sm text-slate-500">Duration</div><div>{duration}</div></div>
      </div>
      <div className="mt-4 ff-card p-4">
        <div className="mb-3 font-semibold">Node timeline</div>
        <div className="mb-3 grid grid-cols-3 gap-3">
          <MiniCue label="Success" text="Node completed and passed output downstream." />
          <MiniCue label="Failed" text="Node stopped execution and stored an error for debugging." />
          <MiniCue label="Attempt" text="Retry count for this node execution." />
        </div>
        <div className="space-y-3">
          {data.nodes.map((n: any) => <div key={n.id} className="grid grid-cols-5 rounded-md border border-slate-200 p-3 text-sm"><span className="font-medium">{n.node_key}</span><span>{n.node_type}</span><StatusPill status={n.status} /><span>attempt {n.attempt}</span><span className="text-red-600">{n.error}</span></div>)}
        </div>
      </div>
    </Shell>
  );
}
