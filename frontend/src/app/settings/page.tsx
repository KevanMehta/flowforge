import { Shell } from "@/components/Shell";
import { MiniCue } from "@/components/Cue";

export default function SettingsPage() {
  return (
    <Shell>
      <h1 className="mb-1 text-2xl font-semibold">Settings</h1>
      <p className="mb-5 text-sm text-slate-500">A read-only control surface for platform configuration, access, and security posture in this demo.</p>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <MiniCue label="Purpose" text="Show where production teams would manage environment, auth, API access, and safety controls." />
        <MiniCue label="Demo mode" text="These cards explain enabled platform capabilities without exposing secret values or mutable controls." />
        <MiniCue label="Production path" text="Connect these sections to secret managers, OAuth providers, audit exports, and tenant policies." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="ff-card p-4">
          <div className="font-semibold">API keys</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">OAuth-ready auth structure, JWT refresh flow, and API key storage are available in the backend schema.</p>
        </div>
        <div className="ff-card p-4">
          <div className="font-semibold">Security</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">RBAC, CORS, rate limiting, secure headers, bcrypt, and audit logs are enabled.</p>
        </div>
        <div className="ff-card p-4">
          <div className="font-semibold">Runtime environment</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">Local demo runs with deterministic AI fallbacks. Production can add OpenAI, managed Redis, RDS, and external secrets.</p>
        </div>
        <div className="ff-card p-4">
          <div className="font-semibold">Audit and compliance</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sensitive actions are modeled with audit logs so workflow changes, execution starts, and permission updates can be reviewed.</p>
        </div>
      </div>
    </Shell>
  );
}
