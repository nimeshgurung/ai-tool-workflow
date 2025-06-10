import { z } from 'zod';

// Tool definition schema as per Table 3.1.1 in Strategic Blueprint
export const ToolDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  inputSchema: z.string(), // JSON schema as string or Zod schema string
  outputSchema: z.string(), // JSON schema as string or Zod schema string
  category: z.string().optional(),
  version: z.string().optional(),
  type: z.enum(['tool', 'agent']).optional(), // Distinguish between tools and agents
});

export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;

// Mock tool definitions for initial development
export const MOCK_TOOLS: ToolDefinition[] = [
  {
    id: 'search-issues',
    name: 'Search Issues',
    description: 'Call the Search Issues API to search for issues in Blueprint',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query'
        },
        count: {
          type: 'number',
          description: 'Number of results to return',
          default: 10
        }
      },
      required: ['query']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              summary: { type: 'string' },
              id: { type: 'string' },
            }
          }
        }
      }
    }),
    category: 'search',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'risks-issues-search',
    name: 'Search Risks and Issues',
    description: 'Call the Search Risks and Issues API to search for risks and issues in Blueprint',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Team name or issue ID'
        },
        numResults: {
          type: 'number',
          description: 'Number of results to return',
          default: 5
        }
      },
      required: ['query']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              id: { type: 'string' },
              summary: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              priority: { type: 'string' },
              dueDate: { type: 'string' },
            }
          }
        }
      }
    }),
    category: 'search',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'search-teams',
    name: 'Search Teams',
    description: 'Search for teams in the platform.',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query for team names.'
        }
      },
      required: ['query']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' }
            }
          }
        }
      }
    }),
    category: 'search',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'search-objectives',
    name: 'Search Objectives',
    description: 'Search for objectives in the platform.',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query for objectives.'
        }
      },
      required: ['query']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' }
            }
          }
        }
      }
    }),
    category: 'search',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'search-key-results',
    name: 'Search Key Results',
    description: 'Search for key results in the platform.',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query for key results.'
        }
      },
      required: ['query']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              status: { type: 'string' }
            }
          }
        }
      }
    }),
    category: 'search',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'create-issue',
    name: 'Create Issue',
    description: 'Create a new issue in Gitlab.',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the issue.'
        },
        description: {
          type: 'string',
          description: 'The description of the issue.'
        },
        project_id: {
          type: 'string',
          description: 'The ID of the project to create the issue in.'
        },
        labels: {
          type: 'string',
          description: 'Comma-separated list of labels for the issue.'
        }
      },
      required: ['title', 'project_id']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        id: { type: 'number' },
        iid: { type: 'number' },
        project_id: { type: 'number' },
        title: { type: 'string' },
        web_url: { type: 'string' }
      }
    }),
    category: 'creation',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'A configurable AI agent that can use tools to complete complex tasks',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'The task for the agent to complete'
        },
        context: {
          type: 'object',
          description: 'Additional context for the task'
        }
      },
      required: ['task']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        result: { type: 'string' },
        toolsUsed: {
          type: 'array',
          items: { type: 'string' }
        },
        reasoning: { type: 'string' }
      }
    }),
    category: 'agent',
    version: '1.0.0',
    type: 'agent'
  }
];