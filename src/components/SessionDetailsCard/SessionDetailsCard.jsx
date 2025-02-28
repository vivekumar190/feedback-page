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

const SessionDetailsCard = () => {
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

  const { formattedDate, formattedTime } = formatDate(speakerData.fields.session_start_date[0]);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Background Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: -24,
          left: -24,
          right: -24,
          bottom: -24,
          background: '#fff',
          zIndex: 0,
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      />

      {/* Session Title */}
      <Typography
        variant="h6"
        sx={{
          position: 'relative',
          zIndex: 1,
          fontWeight: 600,
          color: 'text.primary',
          mb: 3,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          lineHeight: 1.3,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 40,
            height: 3,
            borderRadius: 1,
            background: 'linear-gradient(90deg, #6366F1, #D946EF)',
          },
        }}
      >
        {speakerData.fields.topic_name[0]}
      </Typography>

      {/* Speaker Info */}
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
          bgcolor: 'rgba(99, 102, 241, 0.04)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            bgcolor: 'rgba(99, 102, 241, 0.08)',
          },
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
            border: '2px solid',
            borderColor: '#6366F1',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
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
                display: 'block',
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
                bgcolor: '#6366F1',
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

      {/* Date and Time */}
      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 1,
          '& .MuiChip-root': {
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
          },
        }}
      >
        <Chip
          icon={<EventIcon />}
          label={formattedDate}
          size="small"
          sx={{
            bgcolor: 'rgba(99, 102, 241, 0.08)',
            color: 'primary.main',
            borderRadius: 2,
            height: 32,
            '& .MuiChip-label': {
              px: 1.5,
              fontWeight: 500,
            },
            '& .MuiChip-icon': {
              color: 'primary.main',
              fontSize: 18,
            },
          }}
        />
        <Chip
          icon={<AccessTimeIcon />}
          label={formattedTime}
          size="small"
          sx={{
            bgcolor: 'rgba(217, 70, 239, 0.08)',
            color: 'secondary.main',
            borderRadius: 2,
            height: 32,
            '& .MuiChip-label': {
              px: 1.5,
              fontWeight: 500,
            },
            '& .MuiChip-icon': {
              color: 'secondary.main',
              fontSize: 18,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SessionDetailsCard; 