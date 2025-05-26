import { z } from 'zod';

// React Flow node schema
export const ReactFlowNodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.any()).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
});

// React Flow edge schema
export const ReactFlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  type: z.string().optional(),
  animated: z.boolean().optional(),
  style: z.record(z.any()).optional(),
  data: z.record(z.any()).optional(),
});

// React Flow JSON object schema
export const ReactFlowJsonObjectSchema = z.object({
  nodes: z.array(ReactFlowNodeSchema),
  edges: z.array(ReactFlowEdgeSchema),
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number(),
  }).optional(),
});

export type ReactFlowNode = z.infer<typeof ReactFlowNodeSchema>;
export type ReactFlowEdge = z.infer<typeof ReactFlowEdgeSchema>;
export type ReactFlowJsonObject = z.infer<typeof ReactFlowJsonObjectSchema>;

// Workflow submission response
export const WorkflowResponseSchema = z.object({
  message: z.string(),
  workflowId: z.string(),
  status: z.enum(['received', 'validated', 'error']),
  errors: z.array(z.string()).optional(),
});

export type WorkflowResponse = z.infer<typeof WorkflowResponseSchema>;