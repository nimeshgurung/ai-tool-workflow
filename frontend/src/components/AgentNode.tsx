import React, { useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  type SelectChangeEvent
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Settings as SettingsIcon, SmartToy as AgentIcon, Edit as EditIcon } from '@mui/icons-material';
import type { ToolNodeData } from '../types/workflow';

const useStyles = makeStyles()((theme) => ({
  agentCard: {
    minWidth: 320,
    maxWidth: 380,
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
    '&.selected': {
      border: `2px solid ${theme.palette.secondary.dark}`,
      boxShadow: theme.shadows[8],
    },
  },
  agentContent: {
    padding: `${theme.spacing(2)} !important`,
    position: 'relative',
  },
  agentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.secondary.light,
    borderRadius: theme.shape.borderRadius,
  },
  agentIcon: {
    color: theme.palette.secondary.main,
    fontSize: '1.5rem',
  },
  agentTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    flex: 1,
  },
  configSection: {
    marginBottom: theme.spacing(2),
  },
  sectionLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  toolsSection: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.grey[50],
  },
  editToolsButton: {
    fontSize: '0.75rem',
    padding: theme.spacing(0.5, 1),
    minHeight: 'auto',
  },
  toolChip: {
    fontSize: '0.625rem',
    height: 20,
    margin: theme.spacing(0.25),
  },
  inputField: {
    '& .MuiInputBase-input': {
      fontSize: '0.875rem',
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
    },
  },
  handle: {
    width: 8,
    height: 8,
    backgroundColor: theme.palette.secondary.main,
    border: `2px solid ${theme.palette.background.paper}`,
  },
  handleTarget: {
    backgroundColor: theme.palette.success.main,
  },
  handleSource: {
    backgroundColor: theme.palette.warning.main,
  },
}));

// Mock available tools for the agent configuration
const AVAILABLE_TOOLS = [
  { id: 'bing-search', name: 'Bing Search API' },
  { id: 'exa-search', name: 'Exa Search' },
  { id: 'web-scraper', name: 'Web Scraper' },
  { id: 'email-sender', name: 'Email Sender' },
  { id: 'data-processor', name: 'Data Processor' },
  { id: 'file-reader', name: 'File Reader' },
];



const AgentNode: React.FC<NodeProps<ToolNodeData>> = ({ data, selected }) => {
  const { classes, cx } = useStyles();
  const [configOpen, setConfigOpen] = useState(false);
  const [toolsDialogOpen, setToolsDialogOpen] = useState(false);

  // Agent configuration state
  const [instructions, setInstructions] = useState(
    data.agentConfig?.instructions || 'You are a helpful assistant that can use tools to complete tasks.'
  );
  const [assignedTools, setAssignedTools] = useState<string[]>(
    data.agentConfig?.availableTools || []
  );

  // Update local state when node data changes (from visual connections)
  React.useEffect(() => {
    if (data.agentConfig?.availableTools) {
      setAssignedTools(data.agentConfig.availableTools);
    }
  }, [data.agentConfig?.availableTools]);

  const handleConfigSave = () => {
    // In a real implementation, this would update the node data
    console.log('Saving agent config:', {
      instructions,
      assignedTools
    });
    setConfigOpen(false);
  };

  const handleToolsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setAssignedTools(value);
  };

  const handleToolsSave = () => {
    // In a real implementation, this would update the node data
    // For now, we'll just log and close the dialog
    console.log('Saving tools assignment:', assignedTools);

    // TODO: Update the actual node data in the workflow
    // This would typically be done through a callback prop or context
    // updateNodeData(nodeId, { agentConfig: { ...agentConfig, availableTools: assignedTools } });

    setToolsDialogOpen(false);
  };

  const getAssignedToolNames = () => {
    return AVAILABLE_TOOLS
      .filter(tool => assignedTools.includes(tool.id))
      .map(tool => tool.name);
  };

  return (
    <Box>
      {/* Input handles for tool connections */}
      <Handle
        type="target"
        position={Position.Left}
        className={cx(classes.handle, classes.handleTarget)}
        id="tools"
        style={{ top: '50%' }}
      />

      <Card className={cx(classes.agentCard, { selected })}>
        <CardContent className={classes.agentContent}>
          {/* Agent Header */}
          <div className={classes.agentHeader}>
            <AgentIcon className={classes.agentIcon} />
            <Typography variant="h6" className={classes.agentTitle}>
              Agent
            </Typography>
            <IconButton
              size="small"
              onClick={() => setConfigOpen(true)}
            >
              <SettingsIcon />
            </IconButton>
          </div>



          {/* Agent Instructions Section */}
          <div className={classes.configSection}>
            <Typography className={classes.sectionLabel}>
              Agent Instructions
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="You are a helpful assistant that can..."
              className={classes.inputField}
            />
          </div>

          {/* Tools Section */}
          <div className={classes.configSection}>
            <Typography className={classes.sectionLabel}>
              Tools
            </Typography>
            <div className={classes.toolsSection}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="textSecondary">
                  Edit tools
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setToolsDialogOpen(true)}
                  className={classes.editToolsButton}
                >
                  Edit tools
                </Button>
              </Box>

              {assignedTools.length > 0 && (
                <Box>
                  {getAssignedToolNames().map((toolName) => (
                    <Chip
                      key={toolName}
                      label={toolName}
                      size="small"
                      className={classes.toolChip}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}

              {assignedTools.length === 0 && (
                <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
                  No tools assigned
                </Typography>
              )}
            </div>
          </div>

          {/* Input Section */}
          <div className={classes.configSection}>
            <Typography className={classes.sectionLabel}>
              Input
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Receiving input"
              disabled
              className={classes.inputField}
            />
          </div>
        </CardContent>
      </Card>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={cx(classes.handle, classes.handleSource)}
        id="output"
      />

      {/* Tools Selection Dialog */}
      <Dialog
        open={toolsDialogOpen}
        onClose={() => setToolsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Tools</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Select the tools this agent can use:
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Available Tools</InputLabel>
            <Select
              multiple
              value={assignedTools}
              onChange={handleToolsChange}
              input={<OutlinedInput label="Available Tools" />}
              renderValue={(selected) =>
                AVAILABLE_TOOLS
                  .filter(tool => selected.includes(tool.id))
                  .map(tool => tool.name)
                  .join(', ')
              }
            >
              {AVAILABLE_TOOLS.map((tool) => (
                <MenuItem key={tool.id} value={tool.id}>
                  <Checkbox checked={assignedTools.indexOf(tool.id) > -1} />
                  <ListItemText primary={tool.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToolsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleToolsSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Full Configuration Dialog */}
      <Dialog
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Configure Agent</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Agent Instructions"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Define what this agent should do and how it should behave..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>Cancel</Button>
          <Button onClick={handleConfigSave} variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentNode;