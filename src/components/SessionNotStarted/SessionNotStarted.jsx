import { Box, Typography, Button } from "@mui/material";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';

const SessionNotStarted = ({ sessionStartTime: propSessionStartTime }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionStartTime = propSessionStartTime || 
    (location.state?.sessionStartTime ? new Date(location.state.sessionStartTime) : new Date());

  const handleTryAgain = () => {
    navigate(-1); // This will go back to the previous URL
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 11,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.05)',
              opacity: 0.8,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }}
      >
        <AccessTimeFilledIcon
          sx={{
            fontSize: 80,
            color: 'primary.main',
            mb: 3,
            filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))',
          }}
        />
      </Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 2,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        Session Not Started Yet Or Feedback is Disabled 
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'text.secondary',
          mb: 3,
          fontSize: '1.2rem',
          opacity: 0.9,
          fontWeight: 500,
        }}
      >
        Please come back Later !!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 4,
          fontSize: '1rem',
          opacity: 0.8,
          padding: '12px 24px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {sessionStartTime ? 
          `Session starts at: ${format(sessionStartTime, "MMMM d, yyyy 'at' h:mm a")}` :
          'Session timing information not available'
        }
      </Typography>
      <Button
        variant="contained"
        onClick={handleTryAgain}
        sx={{
          borderRadius: 2,
          py: 1.5,
          px: 4,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
          background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
          '&:hover': {
            boxShadow: '0 12px 20px rgba(99, 102, 241, 0.3)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        Try Again
      </Button>
    </Box>
  );
};

export default SessionNotStarted; 