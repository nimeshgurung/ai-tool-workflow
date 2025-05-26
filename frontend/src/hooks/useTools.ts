import { useState, useEffect } from 'react';
import type { ToolDefinition } from '../types/tool';
import ApiService from '../services/api';

export interface UseToolsReturn {
  tools: ToolDefinition[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTools = (): UseToolsReturn => {
  const [tools, setTools] = useState<ToolDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTools = await ApiService.getTools();
      setTools(fetchedTools);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tools';
      setError(errorMessage);
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return {
    tools,
    loading,
    error,
    refetch: fetchTools,
  };
};