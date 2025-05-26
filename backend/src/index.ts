import express from 'express';
import cors from 'cors';
import toolsRouter from './routes/tools';
import workflowsRouter from './routes/workflows';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for complex workflows
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tools', toolsRouter);
app.use('/api/workflows', workflowsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ai-workflow-builder-backend'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Workflow Builder Backend API',
    version: '1.0.0',
    endpoints: {
      tools: '/api/tools',
      workflows: '/api/workflows',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Workflow Builder Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Tools API: http://localhost:${PORT}/api/tools`);
  console.log(`⚡ Workflows API: http://localhost:${PORT}/api/workflows`);
});