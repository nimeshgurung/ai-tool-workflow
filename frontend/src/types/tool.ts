// Tool definition interface matching backend
export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  inputSchema: string; // JSON schema as string
  outputSchema: string; // JSON schema as string
  category?: string;
  version?: string;
  type?: 'tool' | 'agent'; // Distinguish between tools and agents
}

// Agent-specific configuration
export interface AgentConfig {
  instructions: string;
  availableTools: string[]; // Array of tool IDs that this agent can use
  modelProvider?: string;
  modelName?: string;
  apiKey?: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export type ToolsApiResponse = ApiResponse<ToolDefinition[]>;
export type ToolApiResponse = ApiResponse<ToolDefinition>;