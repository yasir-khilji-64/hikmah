import { createTheme } from '@mui/material';
import { darkPalette, lightPalette } from './palette';
import { typography } from './typography';
import { shape } from './shape';
import { spacing } from './spacing';
import { zIndex } from './z-index';
import { components } from './overrides';

const darkTheme = createTheme({
  palette: darkPalette,
  typography: typography,
  shape: shape,
  spacing: spacing,
  zIndex: zIndex,
  components: components,
});
const lightTheme = createTheme({
  palette: lightPalette,
  typography: typography,
  shape: shape,
  spacing: spacing,
  zIndex: zIndex,
  components: components,
});

export { darkTheme, lightTheme };
