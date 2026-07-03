export function Kpi({ label, value, tone = "blue" }: { label: string; value: string | number; tone?: "blue" | "green" | "orange" | "red" }) {
  const colors = { blue: "text-forge", green: "text-mint", orange: "text-ember", red: "text-red-600" };
  return (
    <div className="ff-card p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${colors[tone]}`}>{value}</div>
    </div>
  );
}
