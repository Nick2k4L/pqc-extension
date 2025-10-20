import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import PQCChecker from './components/popup';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PQCChecker />
    </ThemeProvider>
  );
}

export default App;