import { Router, Request, Response } from 'express';
import { WorkflowService } from '../services/workflowService';

const router = Router();
const workflowService = new WorkflowService();

/**
 * POST /api/workflows
 * Submit a workflow for processing and validation
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const workflowData = req.body;

    // Process the workflow through the service
    const result = await workflowService.processWorkflow(workflowData);

    // Return appropriate status code based on result
    const statusCode = result.status === 'error' ? 400 : 200;

    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Workflow processing error:', error);
    res.status(500).json({
      message: 'Internal server error during workflow processing',
      workflowId: `error-${Date.now()}`,
      status: 'error',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    });
  }
});

export default router;