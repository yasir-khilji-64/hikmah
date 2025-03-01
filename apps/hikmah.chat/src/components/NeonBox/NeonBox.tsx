import { Box, Typography } from '@mui/material';
import { JSX } from 'react';

const NeonBox = (): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'background.default',
      }}
    >
      <Box
        sx={(theme) => ({
          width: 250,
          height: 250,
          borderRadius: 3,
          border: '4px solid transparent',
          boxShadow: `0 0 48px 8px ${theme.palette.primary.main}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        })}
      >
        <Typography variant="h3" color="textPrimary">
          Hikmah.Chat
        </Typography>
      </Box>
    </Box>
  );
};

export { NeonBox };
