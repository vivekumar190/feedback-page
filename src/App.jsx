import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu/Menu';
import FeedbackForm from './components/FeedbackForm/FeedbackForm';
import ResourcesAndCertificate from './components/ResourcesAndCertificate/ResourcesAndCertificate';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import ThankYou from './components/ThankYou/ThankYou';
import BackgroundShapes from './components/BackgroundElements/BackgroundShapes';
import SessionNotStarted from './components/SessionNotStarted/SessionNotStarted';
import { useEffect } from 'react';
import { initAmplitude } from './utils/amplitude';

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
  useEffect(() => {
    // Initialize Amplitude
    initAmplitude();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.04,
          background: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFB300' fill-rule='evenodd'%3E%3Cpath d='M30 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM15 10c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z'/%3E%3Cpath d='M45 10c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z'/%3E%3Cpath d='M15 40c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z'/%3E%3Cpath d='M45 40c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z'/%3E%3C/g%3E%3C/svg%3E")
            center center fixed,
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFA000' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm0-30c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm-30 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm0 30c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm0 30c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            center center fixed,
            linear-gradient(135deg, #fff8e1 0%, #fff 100%)
          `,
          backgroundBlendMode: 'overlay',
        }}
      />
      <BackgroundShapes />
      <BrowserRouter>
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}>
          <Header />
          <Box sx={{ flex: 1, py: 1 }}>
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/feedback" element={<FeedbackForm />} />
              <Route path="/certificate-and-resource" element={<ResourcesAndCertificate />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/not-started" element={<SessionNotStarted />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 