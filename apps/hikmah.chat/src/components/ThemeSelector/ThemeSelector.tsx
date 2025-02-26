import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { darkTheme, lightTheme } from '../../theme';

interface ThemeSelectorProps {
  children: ReactNode;
}

const ThemeSelector: FC<ThemeSelectorProps> = ({ children }) => {
  const systemPrefersDark: boolean = useMediaQuery(
    '(prefers-color-scheme: dark)',
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemPrefersDark);

  useEffect(() => {
    setIsDarkMode(systemPrefersDark);
  }, [systemPrefersDark]);

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export { ThemeSelector };
