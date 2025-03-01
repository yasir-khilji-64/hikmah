import { Box, Container, Typography } from '@mui/material';
import { ChatInput } from '../components';
import { JSX } from 'react';

const HomePage = (): JSX.Element => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100vh',
        justifyContent: 'flex-start',
        paddingY: 2,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h3" color="textPrimary" gutterBottom>
          Welcome to Hikmah.Chat
        </Typography>
        <Box sx={{ width: '100%' }}>
          <ChatInput />
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
