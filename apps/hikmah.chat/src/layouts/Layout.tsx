import { JSX, PropsWithChildren, Suspense } from 'react';
import { useModels } from '../hooks/index/useIndex';
import { Appbar } from '../components';
import { Box, CircularProgress } from '@mui/material';

const ModelsWrapper = (): JSX.Element => {
  const { data: models } = useModels();
  return <Appbar title="Hikmah.Chat" models={models.data} />;
};

const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <>
      <Suspense
        fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <CircularProgress size={56} />
          </Box>
        }
      >
        <ModelsWrapper />
      </Suspense>
      <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0 }}>{children}</Box>
    </>
  );
};

export default Layout;
