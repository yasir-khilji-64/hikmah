import { JSX } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Appbar, NeonBox, ServiceUnavailable } from './components';
import { useHealthCheck, useModels } from './hooks/index/useIndex';

function App(): JSX.Element {
  const {
    data: healthCheck,
    error: healthCheckError,
    isLoading,
  } = useHealthCheck();
  const isServiceAvailable = healthCheck?.status !== 503 && !healthCheckError;

  const { data: models } = useModels(isServiceAvailable);

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
  if (!models?.data) {
    return <></>;
  }
  return (
    <>
      <Appbar title="Hikmah Chat" models={models?.data} />
      <NeonBox />
    </>
  );
}

export default App;
