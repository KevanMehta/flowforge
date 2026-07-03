"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BarChart3, Boxes, Clock, GitBranch, History, LogOut, Settings, Shield, Users } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "@/stores/auth";

const nav = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/workflows", label: "Workflows", icon: GitBranch },
  { href: "/executions", label: "Executions", icon: History },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/logs", label: "Logs", icon: Boxes },
  { href: "/workers", label: "Workers", icon: Shield },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white px-4 py-5">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-forge text-sm font-bold text-white">FF</div>
          <div>
            <div className="text-lg font-semibold text-ink">FlowForge</div>
            <div className="text-xs text-slate-500">Workflow command center</div>
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={clsx("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", active ? "bg-blue-50 text-forge" : "text-slate-600 hover:bg-slate-100")}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="absolute bottom-5 left-4 right-4 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <main className="ml-64 min-h-screen p-6">{children}</main>
    </div>
  );
}
