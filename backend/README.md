# AI Workflow Builder - Backend

This is the backend API for the AI Workflow Builder application. It provides endpoints for tool management and workflow processing.

## Features

- **Tool Management**: Fetch available tools from the Master Component Palette (MCP)
- **Workflow Processing**: Validate and process React Flow workflow definitions
- **Type Safety**: Full TypeScript support with Zod validation
- **Future MCP Integration**: Prepared for integration with mastra.ai MCP servers

## API Endpoints

### Tools
- `GET /api/tools` - Get all available tool definitions
- `GET /api/tools/:id` - Get a specific tool by ID

### Workflows
- `POST /api/workflows` - Submit a workflow for processing

### Health
- `GET /health` - Health check endpoint
- `GET /` - API information

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

## Project Structure

```
src/
├── routes/          # API route handlers
├── services/        # Business logic services
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Phase 1 Implementation

Currently implements:
- Mock tool definitions (3 sample tools)
- React Flow workflow validation
- Basic structural validation
- Comprehensive logging for debugging

## Future Phases

Will include:
- Live MCP server integration
- mastra.ai workflow transformation
- Workflow execution management
- Persistent storage