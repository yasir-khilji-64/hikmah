import { Box, Typography } from '@mui/material';
import { JSX } from 'react';

const ServiceUnavailable = (): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" color="error">
        Service Unavailable
      </Typography>
      <Typography variant="body1">
        The server is currently unavailable. Please try again later.
      </Typography>
    </Box>
  );
};

export { ServiceUnavailable };
