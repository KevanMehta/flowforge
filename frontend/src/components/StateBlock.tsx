import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export function LoadingBlock({ label = "Loading data" }: { label?: string }) {
  return (
    <div className="ff-card flex items-center gap-3 p-4 text-sm text-slate-600">
      <Loader2 className="h-4 w-4 animate-spin text-forge" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBlock({ label = "Unable to load data" }: { label?: string }) {
  return (
    <div className="ff-card flex items-center gap-3 border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="ff-card flex items-center gap-3 p-4 text-sm text-slate-600">
      <Inbox className="h-4 w-4 text-slate-400" />
      <span>{label}</span>
    </div>
  );
}
