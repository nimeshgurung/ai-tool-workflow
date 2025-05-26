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
});

export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;

// Mock tool definitions for initial development
export const MOCK_TOOLS: ToolDefinition[] = [
  {
    id: 'weather-tool',
    name: 'Weather Information',
    description: 'Get current weather information for a specified location',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The location to get weather for'
        }
      },
      required: ['location']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        temperature: { type: 'number' },
        condition: { type: 'string' },
        humidity: { type: 'number' }
      }
    }),
    category: 'data',
    version: '1.0.0'
  },
  {
    id: 'text-processor',
    name: 'Text Processor',
    description: 'Process and transform text content',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to process'
        },
        operation: {
          type: 'string',
          enum: ['uppercase', 'lowercase', 'reverse'],
          description: 'The operation to perform'
        }
      },
      required: ['text', 'operation']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        processedText: { type: 'string' },
        originalLength: { type: 'number' },
        processedLength: { type: 'number' }
      }
    }),
    category: 'text',
    version: '1.0.0'
  },
  {
    id: 'data-validator',
    name: 'Data Validator',
    description: 'Validate data against specified rules',
    inputSchema: JSON.stringify({
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'The data to validate'
        },
        rules: {
          type: 'array',
          items: { type: 'string' },
          description: 'Validation rules to apply'
        }
      },
      required: ['data', 'rules']
    }),
    outputSchema: JSON.stringify({
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        errors: {
          type: 'array',
          items: { type: 'string' }
        },
        validatedData: { type: 'object' }
      }
    }),
    category: 'validation',
    version: '1.0.0'
  }
];