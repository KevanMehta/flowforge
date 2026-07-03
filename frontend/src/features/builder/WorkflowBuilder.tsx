"use client";
import { useCallback, useMemo, useState } from "react";
import ReactFlow, { addEdge, Background, Connection, Controls, Edge, MiniMap, Node, useEdgesState, useNodesState } from "reactflow";
import { Bot, Clock, Code2, GitBranch, Globe, Mail, Play, Save, ShieldCheck, Trash2, Upload } from "lucide-react";
import { api } from "@/api/client";
import { Cue, MiniCue } from "@/components/Cue";
import { Shell } from "@/components/Shell";

const palette = [
  ["manual_trigger", "Manual Trigger", Play],
  ["webhook_trigger", "Webhook", Globe],
  ["validate_json", "Validate JSON", ShieldCheck],
  ["http_request", "HTTP Request", Globe],
  ["transform_data", "Transform", Code2],
  ["ai_summarizer", "AI Summary", Bot],
  ["ai_classifier", "AI Classifier", Bot],
  ["ai_json_generator", "AI JSON", Bot],
  ["conditional_branch", "Condition", GitBranch],
  ["delay", "Delay", Clock],
  ["email_notification", "Email", Mail],
  ["slack_notification", "Slack", Mail],
  ["report_generator", "Report", Upload]
] as const;

const initialNodes: Node[] = [
  { id: "trigger", type: "default", position: { x: 0, y: 120 }, data: { label: "Manual Trigger", nodeType: "manual_trigger", config: {} } },
  { id: "validate", type: "default", position: { x: 240, y: 120 }, data: { label: "Validate Input", nodeType: "validate_json", config: { schema: { required: ["text"] } } } },
  { id: "ai", type: "default", position: { x: 480, y: 120 }, data: { label: "AI Summarizer", nodeType: "ai_summarizer", config: { field: "text" } } }
];
const initialEdges: Edge[] = [{ id: "e-trigger-validate", source: "trigger", target: "validate" }, { id: "e-validate-ai", source: "validate", target: "ai" }];

function toGraph(nodes: Node[], edges: Edge[]) {
  return {
    nodes: nodes.map((node) => ({ id: node.id, type: node.data.nodeType, label: String(node.data.label), config: node.data.config || {}, position: node.position })),
    edges: edges.map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, condition: edge.label ? String(edge.label) : null }))
  };
}

export function WorkflowBuilder({ workflow }: { workflow?: any }) {
  const startingNodes = useMemo(() => workflow?.graph?.nodes?.map((n: any) => ({ id: n.id, position: n.position, data: { label: n.label, nodeType: n.type, config: n.config } })) || initialNodes, [workflow]);
  const startingEdges = useMemo(() => workflow?.graph?.edges?.map((e: any) => ({ id: e.id, source: e.source, target: e.target, label: e.condition })) || initialEdges, [workflow]);
  const [nodes, setNodes, onNodesChange] = useNodesState(startingNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(startingEdges);
  const [selected, setSelected] = useState<Node | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState(workflow?.name || "Untitled Workflow");
  const [savedWorkflowId, setSavedWorkflowId] = useState<string | undefined>(workflow?.id);
  const [actionStatus, setActionStatus] = useState("");

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge({ ...connection, id: `e-${connection.source}-${connection.target}` }, eds)), [setEdges]);
  const addNode = (type: string, label: string) => setNodes((current) => [...current, { id: `${type}-${Date.now()}`, position: { x: 120 + current.length * 40, y: 80 + current.length * 25 }, data: { label, nodeType: type, config: defaultConfig(type) } }]);
  const graph = toGraph(nodes, edges);

  async function save() {
    const payload = { name, description: "Built visually in FlowForge", graph };
    const response = savedWorkflowId ? await api.put(`/workflows/${savedWorkflowId}`, payload) : await api.post("/workflows", payload);
    setSavedWorkflowId(response.data.id);
    setErrors([]);
    setActionStatus("Workflow saved. Version history has been updated.");
    return response.data;
  }

  async function validate() {
    try {
      const saved = await save();
      const res = await api.post(`/workflows/${saved.id}/validate`);
      setErrors(res.data.errors || []);
      setActionStatus(res.data.valid ? "Workflow is valid and ready to publish." : "Validation found issues to resolve.");
    } catch (error: any) {
      setErrors(error.response?.data?.detail || ["Validation failed"]);
      setActionStatus("");
    }
  }

  async function publish() {
    const saved = await save();
    await api.post(`/workflows/${saved.id}/publish`);
    setActionStatus("Workflow published. It can now be run from the builder or workflow list.");
  }

  async function run() {
    const saved = await save();
    await api.post(`/workflows/${saved.id}/run`, { input_payload: { text: "Run from workflow builder" }, trigger_type: "manual" });
  }

  return (
    <Shell>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input className="rounded-md border border-slate-300 px-3 py-2 text-xl font-semibold" value={name} onChange={(e) => setName(e.target.value)} />
          <button title="Validate" className="rounded-md border border-slate-300 p-2" onClick={validate}><ShieldCheck className="h-4 w-4" /></button>
          <button title="Save" className="rounded-md border border-slate-300 p-2" onClick={save}><Save className="h-4 w-4" /></button>
          <button title="Publish" className="rounded-md border border-slate-300 p-2" onClick={publish}><Upload className="h-4 w-4" /></button>
          <button title="Run" className="rounded-md bg-forge p-2 text-white" onClick={run}><Play className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-4 gap-3">
        <MiniCue label="1. Add" text="Choose a node type from the palette." />
        <MiniCue label="2. Connect" text="Drag from one node handle to another to set dependency order." />
        <MiniCue label="3. Configure" text="Select a node and edit its label or JSON settings." />
        <MiniCue label="4. Run" text="Validate, save, publish, then start a manual execution." />
      </div>
      {errors.length > 0 && <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{errors.join(" ")}</div>}
      {actionStatus && errors.length === 0 && <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{actionStatus}</div>}
      {errors.length === 0 && <div className="mb-3"><Cue icon={ShieldCheck} title="Validation checks the graph" text="FlowForge blocks cycles, missing triggers, disconnected nodes, invalid edges, and incomplete node settings before publishing." /></div>}
      <div className="grid h-[calc(100vh-120px)] grid-cols-[220px_1fr_320px] gap-4">
        <div className="ff-card overflow-auto p-3">
          <div className="mb-3 text-sm font-semibold">Node palette</div>
          <div className="mb-3 text-xs leading-5 text-slate-500">Click to add a step. Trigger nodes start runs, AI nodes transform text, notification nodes simulate delivery.</div>
          <div className="space-y-2">
            {palette.map(([type, label, Icon]) => (
              <button key={type} className="flex w-full items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={() => addNode(type, label)}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>
        <div className="ff-card overflow-hidden">
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={(_, node) => setSelected(node)} fitView>
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
        <div className="ff-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">Configuration</div>
            {selected && <button title="Delete node" className="rounded-md border border-slate-300 p-2" onClick={() => setNodes((current) => current.filter((n) => n.id !== selected.id))}><Trash2 className="h-4 w-4" /></button>}
          </div>
          {selected ? (
            <div className="space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2" value={selected.data.label} onChange={(e) => setNodes((current) => current.map((n) => (n.id === selected.id ? { ...n, data: { ...n.data, label: e.target.value } } : n)))} />
              <textarea className="h-64 w-full rounded-md border border-slate-300 p-3 font-mono text-xs" value={JSON.stringify(selected.data.config || {}, null, 2)} onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setNodes((current) => current.map((n) => (n.id === selected.id ? { ...n, data: { ...n.data, config: parsed } } : n)));
                } catch {}
              }} />
            </div>
          ) : <div className="text-sm leading-6 text-slate-500">Select a node to edit its label and JSON configuration. Required fields appear in the default config when a node is added.</div>}
        </div>
      </div>
    </Shell>
  );
}

function defaultConfig(type: string) {
  const defaults: Record<string, any> = {
    validate_json: { schema: { required: ["text"] } },
    http_request: { method: "GET", url: "https://example.com", timeout: 5 },
    ai_classifier: { categories: ["incident", "billing", "support"] },
    delay: { seconds: 1 },
    email_notification: { recipient: "ops@flowforge.dev", subject: "Workflow complete" },
    slack_notification: { channel: "#ops" },
    report_generator: { title: "Workflow Report" }
  };
  return defaults[type] || {};
}
