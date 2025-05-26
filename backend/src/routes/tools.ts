import { Router, Request, Response } from 'express';
import { ToolService } from '../services/toolService';

const router = Router();
const toolService = new ToolService();

/**
 * GET /api/tools
 * Retrieve all available tool definitions
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const tools = await toolService.getTools();
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({
      error: 'Failed to fetch tools',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/tools/:id
 * Retrieve a specific tool by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tool = await toolService.getToolById(id);

    if (!tool) {
      return res.status(404).json({
        error: 'Tool not found',
        message: `Tool with ID '${id}' does not exist`
      });
    }

    res.json(tool);
  } catch (error) {
    console.error('Error fetching tool:', error);
    res.status(500).json({
      error: 'Failed to fetch tool',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;