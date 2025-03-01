import { JSX } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ServiceUnavailable } from './components';
import { useHealthCheck } from './hooks/index/useIndex';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';

function App(): JSX.Element {
  const {
    data: healthCheck,
    error: healthCheckError,
    isLoading,
  } = useHealthCheck();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={56} />
      </Box>
    );
  }

  if (healthCheckError || healthCheck?.status === 503) {
    return <ServiceUnavailable />;
  }

  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}

export default App;
