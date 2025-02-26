import { Components, Theme } from '@mui/material';

const MuiButton: Components<Theme>['MuiButton'] = {
  styleOverrides: {
    root: {
      borderRadius: 8,
      transition: 'all 0.3s ease-out',
    },
    textPrimary: ({ theme }) => ({
      color: theme.palette.primary.light,
    }),
    textSecondary: ({ theme }) => ({
      color: theme.palette.secondary.light,
    }),
    outlinedPrimary: ({ theme }) => ({
      color: theme.palette.primary.light,
    }),
    outlinedSecondary: ({ theme }) => ({
      color: theme.palette.secondary.light,
    }),
    // text: ({ theme }) => ({
    //   color: theme.palette.primary.light,
    // }),
    // outlined: ({ theme }) => ({
    //   color: theme.palette.primary.light,
    // }),
  },
};

export { MuiButton };
