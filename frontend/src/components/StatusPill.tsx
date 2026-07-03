import clsx from "clsx";

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
        status === "success" && "bg-emerald-50 text-emerald-700",
        status === "failed" && "bg-red-50 text-red-700",
        status === "running" && "bg-blue-50 text-blue-700",
        status === "published" && "bg-blue-50 text-blue-700",
        !["success", "failed", "running", "published"].includes(status) && "bg-slate-100 text-slate-700"
      )}
    >
      {status}
    </span>
  );
}
