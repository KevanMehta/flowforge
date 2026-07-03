import { LucideIcon } from "lucide-react";

export function Cue({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-slate-700">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-forge" />
      <div>
        <div className="font-semibold text-ink">{title}</div>
        <div className="mt-0.5 leading-5 text-slate-600">{text}</div>
      </div>
    </div>
  );
}

export function MiniCue({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm leading-5 text-slate-700">{text}</div>
    </div>
  );
}
