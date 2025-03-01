import { ExpandMore, Menu } from '@mui/icons-material';
import {
  AppBar,
  Box,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { FC } from 'react';
import { useStore } from '../../state';

interface AppbarProps {
  models: string[];
  title: string;
  onMenuClick?: () => void;
}

const Appbar: FC<AppbarProps> = ({ models, title, onMenuClick }) => {
  const theme = useTheme();
  const { selectedModel, setSelectedModel } = useStore();

  const handleModelChange = (event: SelectChangeEvent<string>): void => {
    setSelectedModel(event.target.value);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: theme.palette.background.paper,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <Toolbar>
        {onMenuClick && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
        )}

        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 500 }}
          color="textPrimary"
        >
          {title}
        </Typography>

        {models.length > 0 && (
          <Box>
            <Select
              variant="standard"
              disableUnderline
              value={selectedModel}
              onChange={handleModelChange}
              displayEmpty
              autoWidth={true}
              IconComponent={ExpandMore}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                minWidth: 120,
              }}
            >
              {models.map((model) => (
                <MenuItem value={model} key={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export { Appbar };
