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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import {
  SmartToy as AgentIcon,
  Build as ToolIcon,
  Chat as ChatIcon,
  TextFields as TextIcon,
  ExpandMore as ExpandMoreIcon,
  Input as InputIcon,
  Output as OutputIcon,
} from '@mui/icons-material';
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
  section: {
    marginBottom: theme.spacing(1),
    '& .MuiAccordion-root': {
      width: '100%',
      margin: 0,
    },
    '& .MuiAccordion-root:before': {
      display: 'none',
    },
  },
  sectionHeader: {
    backgroundColor: theme.palette.grey[50],
    margin: `0 -${theme.spacing(2)}`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '& .MuiAccordionSummary-content': {
      alignItems: 'center',
      gap: theme.spacing(1),
    },
  },
  sectionContent: {
    padding: `${theme.spacing(1)} 0 !important`,
    margin: `0 -${theme.spacing(2)}`,
    paddingLeft: `${theme.spacing(2)} !important`,
    paddingRight: `${theme.spacing(2)} !important`,
  },
  toolCard: {
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.primary.main,
    },
    '&:active': {
      cursor: 'grabbing',
    },
  },
  agentCard: {
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.secondary.dark,
    },
    '&:active': {
      cursor: 'grabbing',
    },
  },
  inputCard: {
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${theme.palette.info.main}`,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.info.dark,
    },
    '&:active': {
      cursor: 'grabbing',
    },
  },
  outputCard: {
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${theme.palette.success.main}`,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.success.dark,
    },
    '&:active': {
      cursor: 'grabbing',
    },
  },
  itemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  itemIcon: {
    fontSize: '1rem',
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

interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  type: string;
  subType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  inputSchema?: string;
  outputSchema?: string;
}

// Define built-in input/output components
const INPUT_COMPONENTS: ComponentDefinition[] = [
  {
    id: 'chat-input',
    name: 'Chat Input',
    description: 'Interactive chat interface for user input',
    type: 'input',
    subType: 'chat',
    icon: ChatIcon,
  },
  {
    id: 'text-input',
    name: 'Text Input',
    description: 'Text field for structured text input',
    type: 'input',
    subType: 'text',
    icon: TextIcon,
  },
];

const OUTPUT_COMPONENTS: ComponentDefinition[] = [
  {
    id: 'chat-output',
    name: 'Chat Output',
    description: 'Display chat responses and conversations',
    type: 'output',
    subType: 'chat',
    icon: ChatIcon,
  },
  {
    id: 'text-output',
    name: 'Text Output',
    description: 'Display formatted text output',
    type: 'output',
    subType: 'text',
    icon: TextIcon,
  },
];

const ToolPalette: React.FC<ToolPaletteProps> = ({ onToolDragStart }) => {
  const { classes } = useStyles();
  const { tools, loading, error, refetch } = useTools();

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, tool: ToolDefinition | ComponentDefinition) => {
    console.log('Drag started for tool:', tool.name);
    // Set drag data with a specific key to avoid conflicts
    event.dataTransfer.setData('application/tool-data', JSON.stringify(tool));
    event.dataTransfer.effectAllowed = 'move';

    // Call optional callback
    if ('category' in tool) {
      onToolDragStart?.(tool as ToolDefinition);
    }
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.clearData();
  };

  // Filter tools by type
  const regularTools = tools.filter(tool => tool.type !== 'agent');
  const agents = tools.filter(tool => tool.type === 'agent');

  if (loading) {
    return (
      <Box className={classes.palette}>
        <Typography variant="h6" className={classes.header}>
          Component Palette
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
        Component Palette
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
        Drag components to the canvas to build your workflow
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Tools Section */}
      <Accordion defaultExpanded className={classes.section}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.sectionHeader}
        >
          <ToolIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Tools ({regularTools.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.sectionContent}>
          {regularTools.map((tool) => (
            <Card
              key={tool.id}
              className={classes.toolCard}
              draggable
              onDragStart={(e) => handleDragStart(e, tool)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className={classes.toolContent}>
                <div className={classes.itemHeader}>
                  <ToolIcon className={classes.itemIcon} color="primary" />
                  <Typography variant="subtitle2" className={classes.toolName}>
                    {tool.name}
                  </Typography>
                </div>
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
          {regularTools.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center">
              No tools available
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Inputs Section */}
      <Accordion defaultExpanded className={classes.section}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.sectionHeader}
        >
          <InputIcon color="info" />
          <Typography variant="subtitle1" fontWeight={600}>
            Inputs ({INPUT_COMPONENTS.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.sectionContent}>
          {INPUT_COMPONENTS.map((component) => {
            const IconComponent = component.icon;
            return (
              <Card
                key={component.id}
                className={classes.inputCard}
                draggable
                onDragStart={(e) => handleDragStart(e, {
                  ...component,
                  inputSchema: '{}',
                  outputSchema: '{}',
                })}
                onDragEnd={handleDragEnd}
              >
                <CardContent className={classes.toolContent}>
                  <div className={classes.itemHeader}>
                    <IconComponent className={classes.itemIcon} color="info" />
                    <Typography variant="subtitle2" className={classes.toolName}>
                      {component.name}
                    </Typography>
                  </div>
                  <Typography variant="body2" className={classes.toolDescription}>
                    {component.description}
                  </Typography>
                  <Chip
                    label="input"
                    size="small"
                    variant="outlined"
                    className={classes.categoryChip}
                    color="info"
                  />
                </CardContent>
              </Card>
            );
          })}
        </AccordionDetails>
      </Accordion>

      {/* Outputs Section */}
      <Accordion defaultExpanded className={classes.section}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.sectionHeader}
        >
          <OutputIcon color="success" />
          <Typography variant="subtitle1" fontWeight={600}>
            Outputs ({OUTPUT_COMPONENTS.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.sectionContent}>
          {OUTPUT_COMPONENTS.map((component) => {
            const IconComponent = component.icon;
            return (
              <Card
                key={component.id}
                className={classes.outputCard}
                draggable
                onDragStart={(e) => handleDragStart(e, {
                  ...component,
                  inputSchema: '{}',
                  outputSchema: '{}',
                })}
                onDragEnd={handleDragEnd}
              >
                <CardContent className={classes.toolContent}>
                  <div className={classes.itemHeader}>
                    <IconComponent className={classes.itemIcon} color="success" />
                    <Typography variant="subtitle2" className={classes.toolName}>
                      {component.name}
                    </Typography>
                  </div>
                  <Typography variant="body2" className={classes.toolDescription}>
                    {component.description}
                  </Typography>
                  <Chip
                    label="output"
                    size="small"
                    variant="outlined"
                    className={classes.categoryChip}
                    color="success"
                  />
                </CardContent>
              </Card>
            );
          })}
        </AccordionDetails>
      </Accordion>

      {/* Agents Section */}
      <Accordion defaultExpanded className={classes.section}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.sectionHeader}
        >
          <AgentIcon color="secondary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Agents ({agents.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.sectionContent}>
          {agents.map((tool) => (
            <Card
              key={tool.id}
              className={classes.agentCard}
              draggable
              onDragStart={(e) => handleDragStart(e, tool)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className={classes.toolContent}>
                <div className={classes.itemHeader}>
                  <AgentIcon className={classes.itemIcon} color="secondary" />
                  <Typography variant="subtitle2" className={classes.toolName}>
                    {tool.name}
                  </Typography>
                </div>
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
          {agents.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center">
              No agents available
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ToolPalette;