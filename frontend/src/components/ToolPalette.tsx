import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTools } from '../hooks/useTools';
import type { ToolDefinition } from '../types/tool';

const useStyles = makeStyles()((theme) => ({
  palette: {
    width: 300,
    minWidth: 300,
    maxWidth: 300,
    height: '100vh',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'auto',
    padding: theme.spacing(2),
    flexShrink: 0,
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  toolCard: {
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
    '&:active': {
      cursor: 'grabbing',
    },
  },
  toolContent: {
    padding: `${theme.spacing(1.5)} !important`,
  },
  toolName: {
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  toolDescription: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  categoryChip: {
    fontSize: '0.75rem',
    height: 20,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  errorContainer: {
    marginBottom: theme.spacing(2),
  },
}));

interface ToolPaletteProps {
  onToolDragStart?: (tool: ToolDefinition) => void;
}

const ToolPalette: React.FC<ToolPaletteProps> = ({ onToolDragStart }) => {
  const { classes } = useStyles();
  const { tools, loading, error, refetch } = useTools();

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, tool: ToolDefinition) => {
    console.log('Drag started for tool:', tool.name);
    // Set drag data with a specific key to avoid conflicts
    event.dataTransfer.setData('application/tool-data', JSON.stringify(tool));
    event.dataTransfer.effectAllowed = 'move';

    // Call optional callback
    onToolDragStart?.(tool);
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.clearData();
  };

  if (loading) {
    return (
      <Box className={classes.palette}>
        <Typography variant="h6" className={classes.header}>
          Tool Palette
        </Typography>
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      </Box>
    );
  }

  return (
    <Box className={classes.palette}>
      <Typography variant="h6" className={classes.header}>
        Tool Palette
      </Typography>

      {error && (
        <Alert
          severity="error"
          className={classes.errorContainer}
          action={
            <Typography
              variant="body2"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={refetch}
            >
              Retry
            </Typography>
          }
        >
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Drag tools to the canvas to build your workflow
      </Typography>

      <Divider sx={{ my: 2 }} />

      {tools.map((tool) => (
        <Card
          key={tool.id}
          className={classes.toolCard}
          draggable
          onDragStart={(e) => handleDragStart(e, tool)}
          onDragEnd={handleDragEnd}
        >
          <CardContent className={classes.toolContent}>
            <Typography variant="subtitle2" className={classes.toolName}>
              {tool.name}
            </Typography>
            <Typography variant="body2" className={classes.toolDescription}>
              {tool.description}
            </Typography>
            {tool.category && (
              <Chip
                label={tool.category}
                size="small"
                variant="outlined"
                className={classes.categoryChip}
              />
            )}
          </CardContent>
        </Card>
      ))}

      {tools.length === 0 && !loading && !error && (
        <Typography variant="body2" color="text.secondary" align="center">
          No tools available
        </Typography>
      )}
    </Box>
  );
};

export default ToolPalette;