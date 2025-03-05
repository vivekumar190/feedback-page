import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import confetti from 'canvas-confetti';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import { trackEvent, EVENTS } from "../../utils/amplitude";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Track page view when component mounts
    trackEvent(EVENTS.THANK_YOU_PAGE_VIEWED);

    // Fire initial confetti burst
    const duration = .7 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const firework = () => {
      const defaults = { 
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        shapes: ['star', 'circle'],
        colors: ['#FFD700', '#FFA000', '#FFB300', '#FFCA28', '#FFE57F']
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    };

    // Fire the first burst
    firework();

    // Add click handler for additional bursts
    const handleClick = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      
      confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 160,
        origin: { x, y },
        colors: ['#FFD700', '#FFA000', '#FFB300', '#FFCA28', '#FFE57F'],
        shapes: ['star', 'circle'],
        zIndex: 0,
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: "center",
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #fffbf2 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #FFD700, #FFA000)',
          }
        }}
      >
        {/* Illustration with Success Message */}
        <Box
          sx={{
            position: 'relative',
            mb: 4,
          }}
        >
          <Box
            sx={{
              animation: 'floatAnimation 3s ease-in-out infinite',
              '@keyframes floatAnimation': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-10px)',
                },
              },
            }}
          >
            <img
              src="/8183402.jpg"
              alt="Happy Children Learning"
              style={{
                maxWidth: "320px",
                width: "100%",
                // borderRadius: "20px",
                marginBottom: "2rem",
                // boxShadow: "0 12px 24px rgba(255, 193, 7, 0.1)",
              }}
            />
          </Box>
          
          {/* Success Message */}
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 3,
              background: 'linear-gradient(45deg, #FFD700, #FFA000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'fadeIn 0.8s ease-out forwards',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            Your feedback has been submitted successfully! 🎉
          </Typography>
        </Box>

        {/* Certificate Message */}
        <Box 
          sx={{ 
            maxWidth: 480, 
            mx: 'auto',
            mb: 4,
            animation: 'slideUp 0.8s ease-out forwards',
            '@keyframes slideUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: '#FFF8E1',
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: '#FFB300',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SchoolIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: '#F57F17',
                fontWeight: 500,
                textAlign: 'left',
                lineHeight: 1.5,
              }}
            >
              Your certificate download link will be sent to you shortly!
            </Typography>
          </Box>
        </Box>

        {/* Action Button */}

      </Box>
    </Container>
  );
};

export default ThankYou;
