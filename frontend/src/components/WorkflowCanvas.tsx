import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Node,
  type NodeTypes,
  type Edge,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { SaveAlt as SaveIcon } from '@mui/icons-material';

import ToolNode from './ToolNode';
import AgentNode from './AgentNode';
import type { ToolNodeData, WorkflowSubmission } from '../types/workflow';
import type { ToolDefinition } from '../types/tool';
import ApiService from '../services/api';

// Import React Flow styles
import 'reactflow/dist/style.css';

const useStyles = makeStyles()((theme) => ({
  canvasContainer: {
    width: 'calc(100vw - 300px)', // Full viewport width minus tool palette width
    height: '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
    display: 'flex',
    gap: theme.spacing(1),
  },
  reactFlowWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#fafafa',
    border: '2px dashed #ccc',
  },
}));

// Define custom node types
const nodeTypes: NodeTypes = {
  toolNode: ToolNode,
  agentNode: AgentNode,
};

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

interface WorkflowCanvasProps {
  onWorkflowSave?: (workflow: WorkflowSubmission) => void;
}

const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({ onWorkflowSave }) => {
  const { classes } = useStyles();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const { project } = useReactFlow();

    const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      deletedEdges.forEach((edge) => {
        const sourceNode = nodes.find(node => node.id === edge.source);
        const targetNode = nodes.find(node => node.id === edge.target);

        // Remove tool assignment when tool-agent edge is deleted
        if (sourceNode?.type === 'toolNode' && targetNode?.type === 'agentNode') {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === targetNode.id && node.data.agentConfig) {
                const currentTools = node.data.agentConfig.availableTools || [];
                const toolId = sourceNode.data.toolId;

                return {
                  ...node,
                  data: {
                    ...node.data,
                    agentConfig: {
                      ...node.data.agentConfig,
                      availableTools: currentTools.filter((id: string) => id !== toolId)
                    }
                  }
                };
              }
              return node;
            })
          );

          setNotification({
            open: true,
            message: `Tool "${sourceNode.data.toolName}" removed from agent`,
            severity: 'info',
          });
        }
      });
    },
    [nodes, setNodes, setNotification]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection rules
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);

      if (!sourceNode || !targetNode) return;

      // Rule: Tools cannot connect to other tools
      if (sourceNode.type === 'toolNode' && targetNode.type === 'toolNode') {
        setNotification({
          open: true,
          message: 'Tools cannot be connected directly to other tools. Connect tools to agents instead.',
          severity: 'error',
        });
        return;
      }

      // Rule: Only tools can connect to agents (not other agents)
      if (targetNode.type === 'agentNode' && sourceNode.type === 'agentNode') {
        setNotification({
          open: true,
          message: 'Agents cannot be connected to other agents directly.',
          severity: 'error',
        });
        return;
      }

      // Auto-assign tool to agent when connected
      if (sourceNode.type === 'toolNode' && targetNode.type === 'agentNode') {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === targetNode.id && node.data.agentConfig) {
              const currentTools = node.data.agentConfig.availableTools || [];
              const toolId = sourceNode.data.toolId;

              // Only add if not already assigned
              if (!currentTools.includes(toolId)) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    agentConfig: {
                      ...node.data.agentConfig,
                      availableTools: [...currentTools, toolId]
                    }
                  }
                };
              }
            }
            return node;
          })
        );

        setNotification({
          open: true,
          message: `Tool "${sourceNode.data.toolName}" assigned to agent`,
          severity: 'success',
        });
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, setNodes, nodes, setNotification]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    console.log('Drag over canvas');
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      console.log('Drop event triggered');

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) {
        console.log('No react flow bounds found');
        return;
      }

      const toolData = event.dataTransfer.getData('application/tool-data');
      console.log('Tool data from drop:', toolData);
      if (!toolData) {
        console.log('No tool data found in drop event');
        return;
      }

      try {
        const tool: ToolDefinition = JSON.parse(toolData);

        const position = project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        let nodeType = 'toolNode';
        if (tool.type === 'agent') nodeType = 'agentNode';

        const newNode: Node<ToolNodeData> = {
          id: getId(),
          type: nodeType,
          position,
          data: {
            toolId: tool.id,
            toolName: tool.name,
            toolDescription: tool.description,
            inputSchema: tool.inputSchema,
            outputSchema: tool.outputSchema,
            category: tool.category,
            type: tool.type,
            agentConfig: tool.type === 'agent' ? {
              instructions: 'You are a helpful assistant that can use tools to complete tasks.',
              availableTools: []
            } : undefined,
          },
        };

        setNodes((nds) => nds.concat(newNode));

        setNotification({
          open: true,
          message: `Added ${tool.name} to workflow`,
          severity: 'success',
        });
      } catch (error) {
        console.error('Error parsing dropped tool data:', error);
        setNotification({
          open: true,
          message: 'Error adding tool to workflow',
          severity: 'error',
        });
      }
    },
    [project, setNodes]
  );

  const handleSaveWorkflow = async () => {
    try {
      const reactFlowInstance = { toObject: () => ({ nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } }) };
      const workflowData = reactFlowInstance.toObject();

      const submission: WorkflowSubmission = {
        nodes: workflowData.nodes as Node<ToolNodeData>[],
        edges: workflowData.edges,
        viewport: workflowData.viewport,
      };

      // Call the API to submit workflow
      const response = await ApiService.submitWorkflow(submission);

      if (response.status === 'error') {
        setNotification({
          open: true,
          message: `Workflow validation failed: ${response.errors?.join(', ') || response.message}`,
          severity: 'error',
        });
      } else {
        setNotification({
          open: true,
          message: `Workflow saved successfully! ID: ${response.workflowId}`,
          severity: 'success',
        });

        // Call optional callback
        onWorkflowSave?.(submission);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to save workflow',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box className={classes.canvasContainer}>
      <div className={classes.toolbar}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveWorkflow}
          disabled={nodes.length === 0}
        >
          Save Workflow
        </Button>
      </div>

            <div
        className={classes.reactFlowWrapper}
        ref={reactFlowWrapper}
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{ minHeight: '400px' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={onEdgesDelete}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Debug drop zone indicator */}
        {nodes.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 10,
            textAlign: 'center'
          }}>
            <div>Drop tools here to start building your workflow</div>
            <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
              Canvas size: {reactFlowWrapper.current?.offsetWidth || 0} x {reactFlowWrapper.current?.offsetHeight || 0}
            </div>
          </div>
        )}
      </div>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};

export default WorkflowCanvas;