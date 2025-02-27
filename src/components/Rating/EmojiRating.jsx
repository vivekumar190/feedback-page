import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// const ratingData = [
//   { value: 1, emoji: "1", label: "Terrible" },
//   { value: 2, emoji: "2", label: "Bad" },
//   { value: 3, emoji: "3", label: "Okay" },
//   { value: 4, emoji: "4", label: "Great" },
//   { value: 5, emoji: "5", label: "Perfect" },
//   { value: 6, emoji: "6", label: "Excellent" },
//   { value: 7, emoji: "7", label: "Amazing" },
//   { value: 8, emoji: "8", label: "Outstanding" },
//   { value: 9, emoji: "9", label: "Exceptional" },
//   { value: 10, emoji: "10", label: "Perfect" },
// ];
const ratingData = [
  { value: 2, emoji: "😠", label: "Needs Improvement" },
  { value: 4, emoji: "☹️", label: "Fair" },
  { value: 6, emoji: "😐", label: "Satisfactory" },
  { value: 8, emoji: "😄", label: "Good" },
  { value: 10, emoji: "🤩", label: "Excellent" },
  // { value: 6, emoji: "😄", label: "Excellent" },
  // { value: 7, emoji: "🤩", label: "Amazing" },
  // { value: 8, emoji: "🌟", label: "Outstanding" },
  // { value: 9, emoji: "💫", label: "Exceptional" },
  // { value: 10, emoji: "💎", label: "Perfect" },
];
const RatingButton = styled(Box)(({ theme, active, hovered }) => ({
  width: 70,
  height: 70,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  position: "relative",
  backgroundColor: active ? theme.palette.primary.main : "transparent",
  border: `2px solid ${active ? theme.palette.primary.main : theme.palette.grey[200]}`,
  transform: active || hovered ? "scale(1.1)" : "scale(1)",
  
  "& .emoji": {
    fontSize: "36px",
    marginBottom: "4px",
  },
  
  "& .mobile-label": {
    fontSize: "11px",
    textAlign: "center",
    color: active ? "white" : theme.palette.text.secondary,
    display: "none",
    lineHeight: 1.2,
    padding: "0 4px",
  },

  [theme.breakpoints.down('sm')]: {
    width: 57,
    height: 57,
    "& .mobile-label": {
      display: "block",
      marginTop: "0px",
      fontSize: "7px",
    },
    "& .rating-label": {
      display: "none",
    },
    "& .emoji": {
      fontSize: "30px",
      lineHeight: 1,
      marginBottom: "2px",
    }
  },

  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    transform: "scale(1.1)",
    "& .rating-label": {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)",
    },
    "& .mobile-label": {
      color: "white",
    }
  },

  "& .rating-label": {
    position: "absolute",
    top: -30,
    left: "50%",
    transform: "translateX(-50%) translateY(10px)",
    backgroundColor: theme.palette.grey[900],
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    opacity: 0,
    visibility: "hidden",
    transition: "all 0.2s ease-in-out",
    whiteSpace: "nowrap",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "100%",
      left: "50%",
      marginLeft: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `${theme.palette.grey[900]} transparent transparent transparent`,
    },
  },
}));

const EmojiRating = ({ value, onChange }) => {
  const [hoveredValue, setHoveredValue] = useState(null);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 1 },
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: { xs: "100%", sm: "600px" },
          margin: "0 auto",
          py: 2,
          px: { xs: 1, sm: 0 }
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
            <span className="emoji">{rating.emoji}</span>
            <span className="mobile-label">{rating.label}</span>
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
            animation: "fadeIn 0.3s ease-in-out",
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          You rated: {ratingData.find((r) => r.value === value)?.label}{" "}
          {ratingData.find((r) => r.value === value)?.emoji}
        </Typography>
      )}
      
    </Box>
  );
};

export default EmojiRating;
