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
    id: 'bing-search',
    name: 'Bing Search API',
    description: 'Call the Bing Search API to search the web for information',
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
              title: { type: 'string' },
              url: { type: 'string' },
              snippet: { type: 'string' }
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
    id: 'exa-search',
    name: 'Exa Search',
    description: 'Exa Search toolkit for search and content retrieval',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query'
        },
        type: {
          type: 'string',
          enum: ['neural', 'keyword'],
          description: 'Type of search to perform'
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
              url: { type: 'string' },
              content: { type: 'string' },
              score: { type: 'number' }
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
    id: 'web-scraper',
    name: 'Web Scraper',
    description: 'Extract content from web pages',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to scrape'
        },
        selector: {
          type: 'string',
          description: 'CSS selector for content extraction'
        }
      },
      required: ['url']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        content: { type: 'string' },
        title: { type: 'string' },
        metadata: { type: 'object' }
      }
    }),
    category: 'data',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'email-sender',
    name: 'Email Sender',
    description: 'Send emails with customizable content',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient email address'
        },
        subject: {
          type: 'string',
          description: 'Email subject'
        },
        body: {
          type: 'string',
          description: 'Email body content'
        }
      },
      required: ['to', 'subject', 'body']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        messageId: { type: 'string' },
        status: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }),
    category: 'communication',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'data-processor',
    name: 'Data Processor',
    description: 'Process and transform data in various formats',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'The data to process'
        },
        operation: {
          type: 'string',
          enum: ['filter', 'transform', 'aggregate', 'sort'],
          description: 'The operation to perform'
        },
        parameters: {
          type: 'object',
          description: 'Operation-specific parameters'
        }
      },
      required: ['data', 'operation']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        processedData: { type: 'object' },
        summary: { type: 'string' },
        recordsProcessed: { type: 'number' }
      }
    }),
    category: 'data',
    version: '1.0.0',
    type: 'tool'
  },
  {
    id: 'file-reader',
    name: 'File Reader',
    description: 'Read and parse files in various formats',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Path to the file to read'
        },
        format: {
          type: 'string',
          enum: ['json', 'csv', 'txt', 'xml'],
          description: 'Expected file format'
        }
      },
      required: ['filePath']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        content: { type: 'object' },
        metadata: {
          type: 'object',
          properties: {
            size: { type: 'number' },
            lastModified: { type: 'string' },
            format: { type: 'string' }
          }
        }
      }
    }),
    category: 'file',
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