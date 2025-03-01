import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { JSX, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary = ({ children }: ErrorBoundaryProps): JSX.Element => {
  return (
    <ReactErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          textAlign="center"
        >
          <Card
            sx={{
              maxWidth: 400,
              p: 3,
              boxShadow: 3,
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <CardContent>
              <Typography variant="h5" color="error" gutterBottom>
                Oops! Something went wrong.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                An unexpected error occurred. Please try again later.
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={resetErrorBoundary}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export { ErrorBoundary };
