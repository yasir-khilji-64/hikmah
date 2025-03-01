import { Components, Theme } from '@mui/material';
import { MuiButton } from './mui-button';
import { MuiCard } from './mui-card';

const components: Components<Omit<Theme, 'components'>> = {
  MuiButton: MuiButton,
  MuiCard: MuiCard,
};

export { components };
