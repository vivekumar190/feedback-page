import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import FeedbackForm from './components/FeedbackForm/FeedbackForm';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1',
      light: '#8B5CF6',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#D946EF',
      light: '#F0ABFC',
      dark: '#C026D3',
    },
    text: {
      primary: '#1F2937',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          padding: '10px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#F9FAFB'
      }}>
        <Header />
        <Box sx={{ flex: 1, py: 4 }}>
          <FeedbackForm />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App; 