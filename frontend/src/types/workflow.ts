import type { Node, Edge } from 'reactflow';
import type { ToolDefinition, AgentConfig } from './tool';

// Extended React Flow types with our tool data
export interface ToolNodeData {
  toolId: string;
  toolName: string;
  toolDescription: string;
  inputSchema: string;
  outputSchema: string;
  category?: string;
  type?: 'tool' | 'agent' | 'input' | 'output';
  agentConfig?: AgentConfig; // Agent-specific configuration
  // Chat node specific properties
  chatType?: 'input' | 'output';
  placeholder?: string;
  systemMessage?: string;
  // Text node specific properties
  textType?: 'input' | 'output';
  format?: 'plain' | 'markdown' | 'json' | 'xml';
  maxLength?: number;
}

export type ToolNode = Node<ToolNodeData>;

// Workflow submission types
export interface WorkflowSubmission {
  nodes: ToolNode[];
  edges: Edge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

// Workflow response from backend
export interface WorkflowResponse {
  message: string;
  workflowId: string;
  status: 'received' | 'validated' | 'error';
  errors?: string[];
}

// Drag and drop types
export interface DragItem {
  type: string;
  tool: ToolDefinition;
}