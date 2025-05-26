import axios from 'axios';
import type { ToolDefinition } from '../types/tool';
import type { WorkflowSubmission, WorkflowResponse } from '../types/workflow';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  /**
   * Fetch all available tools from the backend
   */
  static async getTools(): Promise<ToolDefinition[]> {
    try {
      const response = await api.get<ToolDefinition[]>('/api/tools');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tools:', error);
      throw new Error('Failed to fetch tools from server');
    }
  }

  /**
   * Fetch a specific tool by ID
   */
  static async getToolById(id: string): Promise<ToolDefinition> {
    try {
      const response = await api.get<ToolDefinition>(`/api/tools/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tool ${id}:`, error);
      throw new Error(`Failed to fetch tool with ID: ${id}`);
    }
  }

  /**
   * Submit a workflow to the backend for processing
   */
  static async submitWorkflow(workflow: WorkflowSubmission): Promise<WorkflowResponse> {
    try {
      console.log('Submitting workflow:', workflow);
      const response = await api.post<WorkflowResponse>('/api/workflows', workflow);
      return response.data;
    } catch (error) {
      console.error('Failed to submit workflow:', error);

      // Handle different error types
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          // Backend returned an error response
          return error.response.data as WorkflowResponse;
        } else if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to backend server. Please ensure the backend is running.');
        }
      }

      throw new Error('Failed to submit workflow to server');
    }
  }

  /**
   * Health check endpoint
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Backend health check failed');
    }
  }
}

export default ApiService;