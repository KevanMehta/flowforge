export type WorkflowNode = {
  id: string;
  type: string;
  label: string;
  config: Record<string, unknown>;
  position: { x?: number; y?: number };
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  condition?: string | null;
};

export type Workflow = {
  id: string;
  name: string;
  status: string;
  current_version: number;
  graph: { nodes: WorkflowNode[]; edges: WorkflowEdge[] };
};
