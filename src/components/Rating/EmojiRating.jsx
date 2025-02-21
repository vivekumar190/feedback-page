import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ratingData = [
  { value: 1, emoji: '😠', label: 'Terrible' },
  { value: 2, emoji: '☹️', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
  { value: 6, emoji: '😄', label: 'Excellent' },
  { value: 7, emoji: '🤩', label: 'Amazing' },
  { value: 8, emoji: '🌟', label: 'Outstanding' },
  { value: 9, emoji: '💫', label: 'Exceptional' },
  { value: 10, emoji: '💎', label: 'Perfect' },
];

const RatingButton = styled(Box)(({ theme, active, hovered }) => ({
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '24px',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  border: `2px solid ${active ? theme.palette.primary.main : theme.palette.grey[200]}`,
  transform: (active || hovered) ? 'scale(1.1)' : 'scale(1)',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'scale(1.1)',
    '& .rating-label': {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)',
    }
  },
  '& .rating-label': {
    position: 'absolute',
    top: -30,
    left: '50%',
    transform: 'translateX(-50%) translateY(10px)',
    backgroundColor: theme.palette.grey[900],
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: '50%',
      marginLeft: '-5px',
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: `${theme.palette.grey[900]} transparent transparent transparent`,
    }
  }
}));

const EmojiRating = ({ value, onChange }) => {
  const [hoveredValue, setHoveredValue] = useState(null);

  return (
    <Box>
      <Typography variant="body1" fontWeight={500} gutterBottom>
        How would you rate your overall experience of the webinar?*
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          py: 2
        }}
      >
        {ratingData.map((rating) => (
          <RatingButton
            key={rating.value}
            active={value === rating.value}
            hovered={hoveredValue === rating.value}
            onClick={() => onChange(rating.value)}
            onMouseEnter={() => setHoveredValue(rating.value)}
            onMouseLeave={() => setHoveredValue(null)}
          >
            {rating.emoji}
            <span className="rating-label">{rating.label}</span>
          </RatingButton>
        ))}
      </Box>
      {value && (
        <Typography 
          variant="body2" 
          color="primary" 
          align="center"
          sx={{ 
            mt: 2,
            animation: 'fadeIn 0.3s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          You rated: {ratingData.find(r => r.value === value)?.label} {ratingData.find(r => r.value === value)?.emoji}
        </Typography>
      )}
    </Box>
  );
};

export default EmojiRating; 