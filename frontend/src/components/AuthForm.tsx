"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import { api } from "@/api/client";
import { useAuthStore } from "@/stores/auth";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState(mode === "login" ? "admin@flowforge.dev" : "");
  const [password, setPassword] = useState("Password123!");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const payload = mode === "login" ? { email, password } : { email, password, full_name: fullName || "FlowForge User", role: "developer" };
      const res = await api.post(`/auth/${mode}`, payload);
      const me = await api.get("/auth/me", { headers: { Authorization: `Bearer ${res.data.access_token}` } });
      setAuth(res.data.access_token, me.data.role);
      router.push("/");
    } catch {
      setError("Unable to authenticate with those credentials.");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#eef3f9] p-6">
      <form onSubmit={submit} className="w-full max-w-lg ff-card p-6">
        <div className="mb-6">
          <div className="text-2xl font-semibold text-ink">{mode === "login" ? "Sign in to FlowForge" : "Create your FlowForge account"}</div>
          <div className="mt-1 text-sm text-slate-500">Start with the seeded demo workspace, then run a workflow and inspect its execution trail.</div>
        </div>
        {mode === "login" && (
          <div className="mb-4 grid gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-ink"><ShieldCheck className="h-4 w-4 text-forge" /> Demo access</div>
            <button type="button" className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setEmail("admin@flowforge.dev"); setPassword("Password123!"); }}>
              <span><span className="font-medium">Admin</span><span className="ml-2 text-slate-500">full platform view</span></span><ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
            <button type="button" className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setEmail("developer@flowforge.dev"); setPassword("Password123!"); }}>
              <span><span className="font-medium">Developer</span><span className="ml-2 text-slate-500">build and run workflows</span></span><ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
            <button type="button" className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setEmail("viewer@flowforge.dev"); setPassword("Password123!"); }}>
              <span><span className="font-medium">Viewer</span><span className="ml-2 text-slate-500">read-only operations view</span></span><ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        )}
        {mode === "register" && <div className="mb-4 flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"><UserRound className="mt-0.5 h-4 w-4 text-forge" /> New accounts start as developers so they can create and run workflows.</div>}
        {mode === "register" && <input className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />}
        <input className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div>}
        <button className="w-full rounded-md bg-forge px-4 py-2 font-semibold text-white">{mode === "login" ? "Login" : "Register"}</button>
      </form>
    </div>
  );
}
