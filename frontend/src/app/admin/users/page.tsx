"use client";
import { useQuery } from "@tanstack/react-query";
import { Shell } from "@/components/Shell";
import { StatusPill } from "@/components/StatusPill";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/StateBlock";
import { api } from "@/api/client";

export default function AdminUsers() {
  const { data = [], isError, isLoading } = useQuery({ queryKey: ["users"], queryFn: async () => (await api.get("/users")).data });
  return (
    <Shell>
      <h1 className="mb-1 text-2xl font-semibold">Admin Users</h1>
      <p className="mb-5 text-sm text-slate-500">Review demo users, assigned roles, and account status.</p>
      {isLoading && <LoadingBlock label="Loading users" />}
      {isError && <ErrorBlock label="Unable to load users. Admin access may be required." />}
      {!isLoading && !isError && data.length === 0 && <EmptyBlock label="No users are available." />}
      {!isLoading && !isError && data.length > 0 && <div className="ff-card divide-y divide-slate-100">
        <div className="grid grid-cols-[1.1fr_1.5fr_120px_120px] items-center gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        {data.map((u: any) => (
          <div key={u.id} className="grid grid-cols-[1.1fr_1.5fr_120px_120px] items-center gap-4 p-4 text-sm">
            <span className="font-semibold">{u.full_name}</span>
            <span className="text-slate-600">{u.email}</span>
            <span className="capitalize">{u.role}</span>
            <StatusPill status={u.is_active ? "active" : "disabled"} />
          </div>
        ))}
      </div>}
    </Shell>
  );
}
