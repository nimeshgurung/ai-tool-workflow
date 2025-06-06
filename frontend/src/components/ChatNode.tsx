import React, { useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import {
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Input as InputIcon,
  Output as OutputIcon
} from '@mui/icons-material';
import type { ToolNodeData } from '../types/workflow';

const useStyles = makeStyles()((theme) => ({
  chatCard: {
    minWidth: 280,
    maxWidth: 320,
    border: `2px solid ${theme.palette.info.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
    '&.selected': {
      border: `2px solid ${theme.palette.info.dark}`,
      boxShadow: theme.shadows[8],
    },
  },
  chatContent: {
    padding: `${theme.spacing(2)} !important`,
    position: 'relative',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.info.light,
    borderRadius: theme.shape.borderRadius,
  },
  chatIcon: {
    color: theme.palette.info.main,
    fontSize: '1.5rem',
  },
  chatTitle: {
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
    backgroundColor: theme.palette.info.main,
    border: `2px solid ${theme.palette.background.paper}`,
  },
  handleTarget: {
    backgroundColor: theme.palette.success.main,
  },
  handleSource: {
    backgroundColor: theme.palette.warning.main,
  },
  typeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
}));

interface ChatNodeData extends ToolNodeData {
  chatType: 'input' | 'output';
  placeholder?: string;
  systemMessage?: string;
}

const ChatNode: React.FC<NodeProps<ChatNodeData>> = ({ data, selected }) => {
  const { classes, cx } = useStyles();
  const [configOpen, setConfigOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    data.placeholder || (data.chatType === 'input' ? 'Enter your message...' : 'Response will appear here...')
  );
  const [systemMessage, setSystemMessage] = useState(
    data.systemMessage || 'You are a helpful assistant.'
  );

  const handleConfigSave = () => {
    console.log('Saving chat config:', {
      placeholder,
      systemMessage,
      chatType: data.chatType
    });
    setConfigOpen(false);
  };

  const isInput = data.chatType === 'input';

  return (
    <Box>
      {/* Handles based on chat type */}
      {!isInput && (
        <Handle
          type="target"
          position={Position.Left}
          className={cx(classes.handle, classes.handleTarget)}
          id="input"
          style={{ top: '50%' }}
        />
      )}

      <Card className={cx(classes.chatCard, { selected })}>
        <CardContent className={classes.chatContent}>
          {/* Chat Header */}
          <div className={classes.chatHeader}>
            <ChatIcon className={classes.chatIcon} />
            <Typography variant="h6" className={classes.chatTitle}>
              Chat {isInput ? 'Input' : 'Output'}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setConfigOpen(true)}
            >
              <SettingsIcon />
            </IconButton>
          </div>

          {/* Type Indicator */}
          <div className={classes.typeIndicator}>
            {isInput ? <InputIcon fontSize="small" /> : <OutputIcon fontSize="small" />}
            <Typography variant="caption">
              {isInput ? 'User Input' : 'System Response'}
            </Typography>
          </div>

          {/* Chat Interface */}
          <div className={classes.configSection}>
            <Typography className={classes.sectionLabel}>
              {isInput ? 'Message Input' : 'Response Display'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder={placeholder}
              disabled={!isInput}
              className={classes.inputField}
              variant="outlined"
            />
          </div>

          {/* System Message Section (for input only) */}
          {isInput && (
            <div className={classes.configSection}>
              <Typography className={classes.sectionLabel}>
                System Message
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                placeholder="System instructions..."
                className={classes.inputField}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output handle for input nodes */}
      {isInput && (
        <Handle
          type="source"
          position={Position.Right}
          className={cx(classes.handle, classes.handleSource)}
          id="output"
        />
      )}

      {/* Configuration Dialog */}
      <Dialog
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Configure Chat {isInput ? 'Input' : 'Output'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Placeholder Text"
              fullWidth
              margin="normal"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Enter placeholder text..."
            />
            {isInput && (
              <TextField
                label="System Message"
                multiline
                rows={3}
                fullWidth
                margin="normal"
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                placeholder="Define system behavior..."
              />
            )}
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

export default ChatNode;