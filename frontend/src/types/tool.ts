// Tool definition interface matching backend
export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  inputSchema: string; // JSON schema as string
  outputSchema: string; // JSON schema as string
  category?: string;
  version?: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ToolsApiResponse extends ApiResponse<ToolDefinition[]> {}
export interface ToolApiResponse extends ApiResponse<ToolDefinition> {}