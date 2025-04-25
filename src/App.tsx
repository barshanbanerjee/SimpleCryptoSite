import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { store } from './store/store';
import CryptoTable from './components/CryptoTable';

// Create a dark theme with better colors
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88',
    },
    secondary: {
      main: '#00b8ff',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
          <AppBar position="static" elevation={0} sx={{ background: 'transparent' }}>
            <Toolbar>
              <Typography variant="h1" sx={{ flexGrow: 1, fontSize: '1.5rem', fontWeight: 600 }}>
                Crypto Tracker
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <CryptoTable />
          </Container>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
