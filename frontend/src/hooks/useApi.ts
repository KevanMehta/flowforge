"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";

export function useOverview() {
  return useQuery({ queryKey: ["overview"], queryFn: async () => (await api.get("/analytics/overview")).data });
}

export function useWorkflows() {
  return useQuery({ queryKey: ["workflows"], queryFn: async () => (await api.get("/workflows")).data });
}

export function useExecutions() {
  return useQuery({ queryKey: ["executions"], queryFn: async () => (await api.get("/executions")).data });
}

export function useWorkers() {
  return useQuery({ queryKey: ["workers"], queryFn: async () => (await api.get("/workers")).data });
}

export function useRunWorkflow(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.post(`/workflows/${id}/run`, { input_payload: { text: "Manual run from FlowForge UI", priority: "high" }, trigger_type: "manual" })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["executions"] })
  });
}
