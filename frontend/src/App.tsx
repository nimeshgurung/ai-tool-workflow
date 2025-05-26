import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { theme } from './utils/theme';
import ToolPalette from './components/ToolPalette';
import WorkflowCanvas from './components/WorkflowCanvas';
import type { WorkflowSubmission } from './types/workflow';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
}));

const App: React.FC = () => {
  const { classes } = useStyles();

  const handleWorkflowSave = (workflow: WorkflowSubmission) => {
    console.log('Workflow saved:', workflow);
    // Additional handling can be added here
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={classes.root}>
        <ToolPalette />
        <WorkflowCanvas onWorkflowSave={handleWorkflowSave} />
      </Box>
    </ThemeProvider>
  );
};

export default App;