import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import type { ToolNodeData } from '../types/workflow';

const useStyles = makeStyles()((theme) => ({
  nodeCard: {
    minWidth: 200,
    maxWidth: 250,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
    '&.selected': {
      border: `2px solid ${theme.palette.secondary.main}`,
      boxShadow: theme.shadows[6],
    },
  },
  nodeContent: {
    padding: `${theme.spacing(1)} !important`,
  },
  nodeName: {
    fontWeight: 600,
    fontSize: '0.875rem',
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.2,
  },
  nodeDescription: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  categoryChip: {
    fontSize: '0.625rem',
    height: 18,
  },
  handle: {
    width: 8,
    height: 8,
    backgroundColor: theme.palette.primary.main,
    border: `2px solid ${theme.palette.background.paper}`,
  },
  handleTarget: {
    backgroundColor: theme.palette.success.main,
  },
  handleSource: {
    backgroundColor: theme.palette.warning.main,
  },
}));

const ToolNode: React.FC<NodeProps<ToolNodeData>> = ({ data, selected }) => {
  const { classes, cx } = useStyles();

  return (
    <Box>
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className={cx(classes.handle, classes.handleTarget)}
        id="input"
      />

      <Card className={cx(classes.nodeCard, { selected })}>
        <CardContent className={classes.nodeContent}>
          <Typography variant="subtitle2" className={classes.nodeName}>
            {data.toolName}
          </Typography>

          <Typography variant="body2" className={classes.nodeDescription}>
            {data.toolDescription}
          </Typography>

          {data.category && (
            <Chip
              label={data.category}
              size="small"
              variant="outlined"
              className={classes.categoryChip}
            />
          )}
        </CardContent>
      </Card>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={cx(classes.handle, classes.handleSource)}
        id="output"
      />
    </Box>
  );
};

export default ToolNode;