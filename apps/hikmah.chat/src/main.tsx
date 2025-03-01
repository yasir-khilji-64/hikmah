import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeSelector } from './components';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryClientProvider } from './providers/QueryClientProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryClientProvider>
      <ThemeSelector>
        <App />
      </ThemeSelector>
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryClientProvider>
  </StrictMode>,
);
