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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import {
  TextFields as TextIcon,
  Settings as SettingsIcon,
  Input as InputIcon,
  Output as OutputIcon
} from '@mui/icons-material';
import type { ToolNodeData } from '../types/workflow';

const useStyles = makeStyles()((theme) => ({
  textCard: {
    minWidth: 280,
    maxWidth: 320,
    border: `2px solid ${theme.palette.success.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
    '&.selected': {
      border: `2px solid ${theme.palette.success.dark}`,
      boxShadow: theme.shadows[8],
    },
  },
  textContent: {
    padding: `${theme.spacing(2)} !important`,
    position: 'relative',
  },
  textHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.success.light,
    borderRadius: theme.shape.borderRadius,
  },
  textIcon: {
    color: theme.palette.success.main,
    fontSize: '1.5rem',
  },
  textTitle: {
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
    backgroundColor: theme.palette.success.main,
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

interface TextNodeData extends ToolNodeData {
  textType: 'input' | 'output';
  placeholder?: string;
  format?: 'plain' | 'markdown' | 'json' | 'xml';
  maxLength?: number;
}

const TextNode: React.FC<NodeProps<TextNodeData>> = ({ data, selected }) => {
  const { classes, cx } = useStyles();
  const [configOpen, setConfigOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    data.placeholder || (data.textType === 'input' ? 'Enter text...' : 'Output will appear here...')
  );
  const [format, setFormat] = useState(data.format || 'plain');
  const [maxLength, setMaxLength] = useState(data.maxLength || 1000);

  const handleConfigSave = () => {
    console.log('Saving text config:', {
      placeholder,
      format,
      maxLength,
      textType: data.textType
    });
    setConfigOpen(false);
  };

  const isInput = data.textType === 'input';

  return (
    <Box>
      {/* Handles based on text type */}
      {!isInput && (
        <Handle
          type="target"
          position={Position.Left}
          className={cx(classes.handle, classes.handleTarget)}
          id="input"
          style={{ top: '50%' }}
        />
      )}

      <Card className={cx(classes.textCard, { selected })}>
        <CardContent className={classes.textContent}>
          {/* Text Header */}
          <div className={classes.textHeader}>
            <TextIcon className={classes.textIcon} />
            <Typography variant="h6" className={classes.textTitle}>
              Text {isInput ? 'Input' : 'Output'}
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
              {isInput ? 'Text Input' : 'Text Output'} • {format.toUpperCase()}
            </Typography>
          </div>

          {/* Text Interface */}
          <div className={classes.configSection}>
            <Typography className={classes.sectionLabel}>
              {isInput ? 'Text Input' : 'Text Display'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              placeholder={placeholder}
              disabled={!isInput}
              className={classes.inputField}
              variant="outlined"
              inputProps={{
                maxLength: isInput ? maxLength : undefined
              }}
            />
          </div>

          {/* Format Info */}
          <div className={classes.configSection}>
            <Typography className={classes.sectionLabel}>
              Format
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {format === 'plain' && 'Plain text format'}
              {format === 'markdown' && 'Markdown formatting supported'}
              {format === 'json' && 'JSON structure expected'}
              {format === 'xml' && 'XML structure expected'}
            </Typography>
          </div>
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
        <DialogTitle>Configure Text {isInput ? 'Input' : 'Output'}</DialogTitle>
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

            <FormControl fullWidth margin="normal">
              <InputLabel>Text Format</InputLabel>
              <Select
                value={format}
                label="Text Format"
                onChange={(e) => setFormat(e.target.value as 'plain' | 'markdown' | 'json' | 'xml')}
              >
                <MenuItem value="plain">Plain Text</MenuItem>
                <MenuItem value="markdown">Markdown</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="xml">XML</MenuItem>
              </Select>
            </FormControl>

            {isInput && (
              <TextField
                label="Max Length"
                type="number"
                fullWidth
                margin="normal"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value) || 1000)}
                inputProps={{ min: 1, max: 10000 }}
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

export default TextNode;