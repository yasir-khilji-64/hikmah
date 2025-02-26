import { Components } from '@mui/material/styles/components';

const MuiCard: Components['MuiCard'] = {
  styleOverrides: {
    root: {
      backgroundColor: '#1D1D1D',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(6px)',
    },
  },
};

export { MuiCard };
