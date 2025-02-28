import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackIcon from "@mui/icons-material/Feedback";
import BuildIcon from "@mui/icons-material/Build";
import SessionDetailsCard from "../SessionDetailsCard/SessionDetailsCard";

const MenuCard = ({ title, description, icon: Icon, onClick, sx = {} }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: "pointer",
      height: "100%",
      transition: "all 0.3s ease",
      borderRadius: 3,
      maxWidth: { xs: '100%', md: '500px' },
      mx: 'auto',
      position: 'relative',
      overflow: 'hidden',
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        '& .hover-gradient': {
          opacity: 1,
        },
        '& .card-icon': {
          transform: 'scale(1.1) rotate(-5deg)',
          background: 'linear-gradient(135deg, primary.main, secondary.main)',
        },
        '& .arrow-icon': {
          transform: 'translateX(4px)',
          opacity: 1,
        }
      },
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      ...sx,
    }}
  >
    {/* Hover Gradient Effect */}
    <Box
      className="hover-gradient"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(217, 70, 239, 0.08) 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        zIndex: 0,
      }}
    />

    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: { xs: 3, md: 4 },
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        className="card-icon"
        sx={{
          mb: 2,
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: 'linear-gradient(135deg, #6366F1, #D946EF)',
          color: "white",
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
        }}
      >
        <Icon 
          sx={{ 
            fontSize: 28,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }} 
        />
      </Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          fontSize: "1.125rem",
          mb: 2,
          background: 'linear-gradient(135deg, #6366F1, #D946EF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        {description}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'primary.main',
          fontWeight: 500,
          fontSize: '0.875rem',
        }}
      >
        Share Now
        <Box
          className="arrow-icon"
          component="span"
          sx={{
            display: 'inline-flex',
            transition: 'all 0.3s ease',
            opacity: 0.7,
          }}
        >
          →
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const navigateWithParams = (path) => {
    // Get all current URL parameters
    const sessionId = searchParams.get("sessionid");
    const studentId = searchParams.get("studentid");
    const speakerId = searchParams.get("speakerid");

    // Build new query string with all parameters
    const queryParams = new URLSearchParams();
    if (sessionId) queryParams.append("sessionid", sessionId);
    if (studentId) queryParams.append("studentid", studentId);
    if (speakerId) queryParams.append("speakerid", speakerId);

    // Navigate with all parameters
    const queryString = queryParams.toString();
    navigate(`${path}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 4, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '700px' },
          mx: 'auto',
        }}
      >
        {/* Session Title Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              textAlign: 'center',
              mb: 1,
            }}
          >
            Welcome to the Session
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Please take a moment to share your feedback and help us improve
          </Typography>
        </Box>

        {/* Speaker Details Card */}
        <Box 
          sx={{ 
            mb: 4,
            background: '#fff',
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <SessionDetailsCard />
        </Box>

        <Grid 
          container 
          spacing={3}
          sx={{
            maxWidth: { xs: '100%', md: '500px' },
            mx: 'auto',
          }}
        >
          <Grid item xs={12}>
            <MenuCard
              title="Share Feedback"
              description="Your insights are valuable! Help us enhance future sessions by sharing your experience and suggestions."
              icon={FeedbackIcon}
              onClick={() => navigateWithParams("/feedback")}
              sx={{
                background: '#fff',
                maxWidth: '100%',
                mx: 'auto',
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 4, 
          textAlign: 'center',
          maxWidth: '400px',
          mx: 'auto',
        }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ opacity: 0.7 }}
          >
            Your feedback helps us create better learning experiences
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Menu;
