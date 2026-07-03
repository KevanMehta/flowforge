"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Shell } from "@/components/Shell";
import { StatusPill } from "@/components/StatusPill";
import { ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { api } from "@/api/client";

export default function WorkflowDetail() {
  const params = useParams();
  const id = String(params?.id || "");
  const { data, isError, isLoading } = useQuery({ queryKey: ["workflow", id], queryFn: async () => (await api.get(`/workflows/${id}`)).data });
  if (isLoading) return <Shell><LoadingBlock label="Loading workflow details" /></Shell>;
  if (isError || !data) return <Shell><ErrorBlock label="Unable to load workflow details." /></Shell>;
  return (
    <Shell>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <p className="text-sm text-slate-500">{data.description}</p>
        </div>
        <Link className="rounded-md bg-forge px-3 py-2 text-sm font-semibold text-white" href={`/workflows/${id}/builder`}>Open builder</Link>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="ff-card p-4"><div className="text-sm text-slate-500">Status</div><StatusPill status={data.status} /></div>
        <div className="ff-card p-4"><div className="text-sm text-slate-500">Version</div><div className="text-xl font-semibold">v{data.current_version}</div></div>
        <div className="ff-card p-4"><div className="text-sm text-slate-500">Nodes</div><div className="text-xl font-semibold">{data.graph.nodes.length}</div></div>
        <div className="ff-card p-4"><div className="text-sm text-slate-500">Edges</div><div className="text-xl font-semibold">{data.graph.edges.length}</div></div>
      </div>
      <div className="mt-4 ff-card p-4">
        <div className="mb-3 font-semibold">Graph nodes</div>
        <div className="grid grid-cols-3 gap-3">
          {data.graph.nodes.map((n: any) => <div key={n.id} className="rounded-md border border-slate-200 p-3"><div className="font-medium">{n.label}</div><div className="text-xs text-slate-500">{n.type}</div></div>)}
        </div>
      </div>
    </Shell>
  );
}
