import { useState, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { getSessionDetailsAndToolsResources } from "../../utils/airtable";

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

const SpeakerCard = (sessionId) => {
  const [loading, setLoading] = useState(true);
  const [speakerData, setSpeakerData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!sessionId?.sessionId) return;
        
        setLoading(true);
        const response = await getSessionDetailsAndToolsResources(sessionId?.sessionId);
        // Filter for speakers that are shown
        const speakers = response.filter(
          record => record.fields.type === "Speaker" && record.fields.show === "Yes"
        );
        
        setSpeakerData(speakers);
      } catch (err) {
        console.error("Error fetching session details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId?.sessionId]);

  if (loading) return <LoadingSkeleton />;
  if (!speakerData.length) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {speakerData.map((speaker) => (
        <Box 
          key={speaker.id}
          sx={{ 
            position: 'relative',
            zIndex: 1,
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 1,
            p: 1.5,
            borderRadius: 2,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            transition: 'all 0.3s ease',
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
            {speaker.fields?.image?.[0]?.thumbnails?.small?.url ? (
              <img
                src={speaker.fields.image[0].thumbnails.small.url}
                alt={speaker.fields.name}
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
              {speaker.fields.name}
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
              {speaker.fields.sub_type}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SpeakerCard; 