"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { Shell } from "@/components/Shell";
import { WorkflowBuilder } from "@/features/builder/WorkflowBuilder";

export default function EditBuilderPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { data, isError, isLoading } = useQuery({ queryKey: ["workflow", id], queryFn: async () => (await api.get(`/workflows/${id}`)).data });
  if (isLoading) return <Shell><LoadingBlock label="Loading workflow builder" /></Shell>;
  if (isError || !data) return <Shell><ErrorBlock label="Unable to load this workflow in the builder." /></Shell>;
  return <WorkflowBuilder workflow={data} />;
}
