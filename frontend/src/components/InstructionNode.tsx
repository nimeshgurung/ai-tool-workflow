import React, { useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Description as InstructionIcon } from '@mui/icons-material';
import type { ToolNodeData } from '../types/workflow';

const useStyles = makeStyles()((theme) => ({
  instructionCard: {
    minWidth: 250,
    maxWidth: 300,
    border: `2px solid ${theme.palette.info.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.info.light,
    boxShadow: theme.shadows[3],
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
    '&.selected': {
      border: `2px solid ${theme.palette.info.dark}`,
      boxShadow: theme.shadows[8],
    },
  },
  instructionContent: {
    padding: `${theme.spacing(1.5)} !important`,
    position: 'relative',
  },
  instructionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  instructionIcon: {
    color: theme.palette.info.main,
    fontSize: '1.2rem',
  },
  instructionName: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.2,
    flex: 1,
  },
  handle: {
    width: 8,
    height: 8,
    backgroundColor: theme.palette.info.main,
    border: `2px solid ${theme.palette.background.paper}`,
  },
  handleSource: {
    backgroundColor: theme.palette.info.main,
  },
}));

const InstructionNode: React.FC<NodeProps<ToolNodeData>> = ({ selected }) => {
  const { classes, cx } = useStyles();
  const [instructions, setInstructions] = useState(
    'You are a helpful assistant that can use tools to complete tasks.'
  );

  return (
    <Box>
      <Card className={cx(classes.instructionCard, { selected })}>
        <CardContent className={classes.instructionContent}>
          <div className={classes.instructionHeader}>
            <InstructionIcon className={classes.instructionIcon} />
            <Typography variant="subtitle2" className={classes.instructionName}>
              Instructions
            </Typography>
          </div>

          <TextField
            size="small"
            placeholder="Enter agent instructions..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
          />
        </CardContent>
      </Card>

      {/* Output handle to connect to agent */}
      <Handle
        type="source"
        position={Position.Right}
        className={cx(classes.handle, classes.handleSource)}
        id="instructions-output"
      />
    </Box>
  );
};

export default InstructionNode;