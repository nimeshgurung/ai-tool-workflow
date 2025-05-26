# AI Workflow Builder

A sophisticated, user-friendly workflow-based system that empowers non-technical users to visually design, construct, and manage automated AI processes. Built with React Flow for intuitive workflow design and mastra.ai as the backend execution engine.

## 🚀 Phase 1 Implementation Complete

This repository contains the foundational implementation of the AI Workflow Builder with:

### ✅ Backend Features
- **Express.js API** with TypeScript and Zod validation
- **Tool Management Service** with mock tool definitions
- **Workflow Processing** with React Flow JSON validation
- **RESTful API Endpoints** for tools and workflows
- **Comprehensive Logging** for workflow inspection

### ✅ Frontend Features
- **React Flow Canvas** with drag-and-drop functionality
- **Tool Palette** with Material-UI design
- **Custom Tool Nodes** with visual distinction
- **Workflow Serialization** and backend submission
- **Real-time Validation** and user feedback
- **Responsive Design** with tss-react styling

## 🏗️ Project Structure

```
ai-workflow-builder/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic services
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── README.md
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities and theme
│   ├── package.json
│   └── README.md
├── package.json            # Workspace configuration
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Zod** - Runtime validation
- **UUID** - Unique ID generation
- **Jest** - Testing framework

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Flow** - Visual workflow editor
- **Material-UI** - UI components
- **tss-react** - Styling solution
- **Axios** - HTTP client
- **Vite** - Build tool

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Install all dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Development
```bash
# Run both backend and frontend concurrently
npm run dev

# Or run individually:
npm run dev:backend    # Starts backend on http://localhost:3001
npm run dev:frontend   # Starts frontend on http://localhost:5173
```

### Build
```bash
npm run build
```

## 📋 API Endpoints

### Tools
- `GET /api/tools` - Get all available tool definitions
- `GET /api/tools/:id` - Get specific tool by ID

### Workflows
- `POST /api/workflows` - Submit workflow for processing

### Health
- `GET /health` - Backend health check
- `GET /` - API information

## 🎯 Usage

1. **Start the Development Servers**
   ```bash
   npm run dev
   ```

2. **Open the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

3. **Build a Workflow**
   - Browse tools in the left sidebar
   - Drag tools to the canvas
   - Connect nodes by dragging between handles
   - Click "Save Workflow" to submit

4. **Monitor Backend**
   - Check console logs for workflow processing
   - Inspect submitted workflow data

## 🔧 Configuration

### Backend Environment
No environment variables required for Phase 1.

### Frontend Environment
Create `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:3001
```

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 📦 Mock Data

Phase 1 includes mock tool definitions:
- **Weather Tool** - Get weather information
- **Email Tool** - Send email notifications
- **Data Processor** - Process and transform data

## 🔮 Future Phases

### Phase 2: MCP Integration
- Live integration with mastra.ai MCP servers
- Dynamic tool discovery and loading
- Real-time tool schema validation

### Phase 3: Workflow Execution
- mastra.ai workflow execution engine
- Real-time execution monitoring
- Result visualization

### Phase 4: Advanced Features
- User authentication and authorization
- Workflow templates and sharing
- Advanced node configuration
- Workflow versioning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
1. Check the individual README files in `backend/` and `frontend/`
2. Review the console logs for debugging information
3. Ensure both servers are running on the correct ports

---

**Phase 1 Status**: ✅ Complete - Basic workflow builder with tool palette and React Flow canvas