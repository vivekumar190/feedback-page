import { useState, useEffect } from "react";
import { Box, Typography, Chip, Skeleton } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { getSessionDetailsAndResources, getUserDetails } from "../../utils/airtable";

const LoadingSkeleton = () => (
  <Box sx={{ width: '100%' }}>
    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton variant="circular" width={48} height={48} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="30%" />
      </Box>
    </Box>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Skeleton variant="rounded" width={120} height={24} />
      <Skeleton variant="rounded" width={100} height={24} />
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

const SpeakerCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [speakerData, setSpeakerData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("sessionid");
        const speakerId = urlParams.get("speakerid");

        if (!sessionId || !speakerId) {
          throw new Error("Missing session or speaker ID");
        }

        const [sessionDetails, speakerDetails] = await Promise.all([
          getSessionDetailsAndResources(sessionId),
          getUserDetails(speakerId)
        ]);

        setSessionData(sessionDetails);
        setSpeakerData(speakerDetails);
        setError(null);
      } catch (err) {
        console.error("Error fetching session details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error || !sessionData || !speakerData) return null;

  const { formattedDate, formattedTime } = formatDate(sessionData.fields.session_start_date);

  return (
 


      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 2.5,
          p: 1.5,
          borderRadius: 2,
        //   bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          transition: 'all 0.3s ease',
        //   '&:hover': {
        //     transform: 'translateY(-2px)',
        //     boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        //     bgcolor: 'rgba(255, 255, 255, 0.9)',
        //   },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 48,
            height: 48,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -2,
              background: 'linear-gradient(45deg, primary.main, primary.light)',
              borderRadius: '50%',
              padding: 2,
            },
          }}
        >
          {speakerData.fields.image?.[0]?.thumbnails?.small?.url ? (
            <img
              src={speakerData.fields.image[0].thumbnails.small.url}
              alt={speakerData.fields.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.light',
                color: 'white',
              }}
            >
              <PersonIcon />
            </Box>
          )}
        </Box>
        
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              mb: 0.5,
              letterSpacing: '-0.01em',
            }}
          >
            {speakerData.fields.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&::before': {
                content: '""',
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                opacity: 0.5,
              },
            }}
          >
            Session Instructor
          </Typography>
        </Box>
      </Box>

  );
};

export default SpeakerCard; 