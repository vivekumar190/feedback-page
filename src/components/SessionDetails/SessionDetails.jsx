import { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, Chip } from "@mui/material";
import axios from "axios";
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LoadingSkeleton = () => (
  <Box
    sx={{
      animation: "pulse 1.5s ease-in-out infinite",
      "@keyframes pulse": {
        "0%": { opacity: 1 },
        "50%": { opacity: 0.5 },
        "100%": { opacity: 1 },
      },
      p: 2,
      borderRadius: 3,
      bgcolor: "rgba(0,0,0,0.05)",
      display: "flex",
      gap: 2,
      alignItems: "center",
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        bgcolor: "rgba(0,0,0,0.1)",
      }}
    />
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          width: "60%",
          height: 20,
          mb: 1,
          borderRadius: 1,
          bgcolor: "rgba(0,0,0,0.1)",
        }}
      />
      <Box
        sx={{
          width: "40%",
          height: 16,
          borderRadius: 1,
          bgcolor: "rgba(0,0,0,0.1)",
        }}
      />
    </Box>
  </Box>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return { formattedDate, formattedTime };
};

const SessionDetails = () => {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const speakerId = urlParams.get("speakerId") || "recE5itVQWSprouSR";
        const sessionId = urlParams.get("sessionId") || "recOJ2j4iq7j15dlJ";

        const [speakerResponse, sessionResponse] = await Promise.all([
          axios.get(
            `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/tblgUfc6jVKd57W7T/${speakerId}`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
            },
          ),
          axios.get(
            `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/tblKQGMJd7psJqF5P/${sessionId}`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
            },
          ),
        ]);

        setSession({
          ...speakerResponse.data,
          sessionDetails: sessionResponse.data,
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching session:", error);
        setError("Failed to load session data");
      } finally {
        setLoading(false);
      }
    };

    if (import.meta.env.VITE_AIRTABLE_API_KEY) {
      fetchSession();
    } else {
      setError("API key not found");
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!session) return null;

  const { formattedDate, formattedTime } = formatDate(session.sessionDetails.fields.session_start_date);

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: 'none',
        boxShadow: { xs: 'none', md: '0 4px 24px rgba(0,0,0,0.12)' },
        background: { xs: 'transparent', md: '#fff' },
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: { xs: 'none', md: 'translateY(-4px)' },
          boxShadow: { xs: 'none', md: '0 8px 32px rgba(0,0,0,0.15)' },
        }
      }}
    >
      <Grid container spacing={{ xs: 1.5, sm: 2 }} direction="column">
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{
              color: { xs: 'white', md: 'text.primary' },
              fontWeight: 700,
              mb: { xs: 0.5, sm: 1 },
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              opacity: { xs: 0.95, md: 1 },
              lineHeight: 1.3,
            }}
          >
            {session.sessionDetails.fields.topic_name}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1.5, sm: 2 },
            mb: { xs: 1, sm: 2 },
            p: { xs: 1.25, sm: 1.5 },
            borderRadius: 2,
            bgcolor: { xs: 'rgba(255,255,255,0.1)', md: 'grey.50' },
          }}>
            <Box
              sx={{
                position: "relative",
                flexShrink: 0,
                width: { xs: 42, sm: 48 },
                height: { xs: 42, sm: 48 },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  background: 'linear-gradient(45deg, #6366F1, #D946EF)',
                  borderRadius: '50%',
                  opacity: 0.8,
                  zIndex: 0,
                }
              }}
            >
              <img
                src={session.fields.image[0].thumbnails.small.url}
                alt={session.fields.name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: "50%",
                  objectFit: "cover",
                  position: "relative",
                  zIndex: 1,
                  border: '2px solid white',
                }}
              />
            </Box>
            
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: { xs: 'white', md: 'text.primary' },
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: 1.2,
                  mb: 0.25,
                }}
              >
                {session.fields.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: { xs: 'white', md: 'text.secondary' },
                  opacity: { xs: 0.7, md: 0.9 },
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  fontWeight: 500,
                }}
              >
                Session Instructor
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            mt: 1,
            gap: { xs: 0.75, sm: 1 },
            '& .MuiChip-root': {
              height: { xs: 24, sm: 28 },
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              '& .MuiChip-icon': {
                fontSize: { xs: 14, sm: 16 },
                marginLeft: { xs: 0.5, sm: 0.75 },
              },
              '& .MuiChip-label': {
                px: { xs: 0.75, sm: 1 },
              }
            }
          }}>
            <Chip
              icon={<EventIcon sx={{ fontSize: 16 }} />}
              label={formattedDate}
              size="small"
              sx={{
                bgcolor: { xs: 'rgba(255,255,255,0.1)', md: 'primary.50' },
                color: { xs: 'white', md: 'primary.main' },
                borderRadius: '6px',
                '& .MuiChip-icon': {
                  color: { xs: 'white', md: 'primary.main' },
                },
              }}
            />
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
              label={formattedTime}
              size="small"
              sx={{
                bgcolor: { xs: 'rgba(255,255,255,0.1)', md: 'secondary.50' },
                color: { xs: 'white', md: 'secondary.main' },
                borderRadius: '6px',
                '& .MuiChip-icon': {
                  color: { xs: 'white', md: 'secondary.main' },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SessionDetails;
