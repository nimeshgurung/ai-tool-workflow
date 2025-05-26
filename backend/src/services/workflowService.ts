import { ReactFlowJsonObject, ReactFlowJsonObjectSchema, WorkflowResponse } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';

export class WorkflowService {
  /**
   * Process and validate a workflow submission
   */
  async processWorkflow(workflowData: unknown): Promise<WorkflowResponse> {
    try {
      // Validate the workflow structure using Zod
      const validatedWorkflow = ReactFlowJsonObjectSchema.parse(workflowData);

      // Log the validated workflow for inspection (as per PRD requirements)
      console.log('=== WORKFLOW RECEIVED ===');
      console.log('Timestamp:', new Date().toISOString());
      console.log('Nodes count:', validatedWorkflow.nodes.length);
      console.log('Edges count:', validatedWorkflow.edges.length);
      console.log('Full workflow data:', JSON.stringify(validatedWorkflow, null, 2));
      console.log('=== END WORKFLOW ===');

      // Generate a temporary workflow ID
      const workflowId = `workflow-${uuidv4()}`;

      // Perform basic structural validation
      const validationErrors = this.validateWorkflowStructure(validatedWorkflow);

      if (validationErrors.length > 0) {
        return {
          message: 'Workflow validation failed',
          workflowId,
          status: 'error',
          errors: validationErrors
        };
      }

      // TODO: In future phases, this would:
      // 1. Transform the workflow into mastra.ai format
      // 2. Submit to mastra.ai for execution
      // 3. Store workflow metadata

      return {
        message: 'Workflow data received and logged',
        workflowId,
        status: 'received'
      };

    } catch (error) {
      console.error('Workflow validation error:', error);

      return {
        message: 'Invalid workflow data structure',
        workflowId: `error-${uuidv4()}`,
        status: 'error',
        errors: [error instanceof Error ? error.message : 'Unknown validation error']
      };
    }
  }

  /**
   * Validate the logical structure of the workflow
   */
  private validateWorkflowStructure(workflow: ReactFlowJsonObject): string[] {
    const errors: string[] = [];

    // Check if workflow has at least one node
    if (workflow.nodes.length === 0) {
      errors.push('Workflow must contain at least one node');
    }

    // Validate edge connections
    const nodeIds = new Set(workflow.nodes.map(node => node.id));

    for (const edge of workflow.edges) {
      if (!nodeIds.has(edge.source)) {
        errors.push(`Edge references non-existent source node: ${edge.source}`);
      }
      if (!nodeIds.has(edge.target)) {
        errors.push(`Edge references non-existent target node: ${edge.target}`);
      }
    }

    // Check for duplicate node IDs
    const duplicateIds = this.findDuplicateIds(workflow.nodes.map(node => node.id));
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate node IDs found: ${duplicateIds.join(', ')}`);
    }

    return errors;
  }

  /**
   * Find duplicate IDs in an array
   */
  private findDuplicateIds(ids: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const id of ids) {
      if (seen.has(id)) {
        duplicates.add(id);
      } else {
        seen.add(id);
      }
    }

    return Array.from(duplicates);
  }
}