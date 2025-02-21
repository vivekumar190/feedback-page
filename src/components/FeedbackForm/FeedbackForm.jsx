import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  Paper,
  IconButton,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EmojiRating from '../Rating/EmojiRating';

const FeatureBox = ({ icon: Icon, title, description }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 2,
      transform: 'translateX(0)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateX(8px)',
        '& .feature-icon': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          transform: 'scale(1.1)',
        }
      }
    }}
  >
    <Box 
      className="feature-icon"
      sx={{ 
        mr: 1.5, 
        p: 0.75,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Icon sx={{ fontSize: 20 }} />
    </Box>
    <Box>
      <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.25 }}>
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          opacity: 0.9,
          maxWidth: '220px',
          lineHeight: 1.3,
          fontSize: '0.875rem'
        }}
      >
        {description}
      </Typography>
    </Box>
  </Box>
);

FeatureBox.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const SocialButton = ({ icon: Icon }) => (
  <IconButton 
    size="small"
    sx={{ 
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      width: 36,
      height: 36,
      backdropFilter: 'blur(4px)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      transition: 'all 0.3s ease-in-out',
    }}
  >
    <Icon fontSize="small" />
  </IconButton>
);

SocialButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
};

const FeedbackForm = () => {
  const [rating, setRating] = useState(null);

  const aspects = [
    'Content Quality',
    'Presentation',
    'Interaction',
    'Materials',
    'Technical Setup',
    'Q&A Session'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Left Panel */}
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              borderRadius: 3,
              p: 3,
              color: 'white',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.4)',
              background: `linear-gradient(135deg, 
                #6366F1 0%,
                #8B5CF6 50%,
                #D946EF 100%
              )`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at top right,
                  rgba(255,255,255,0.2) 0%,
                  rgba(255,255,255,0.1) 10%,
                  transparent 50%
                )`,
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                right: '-50%',
                bottom: '-50%',
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                transform: 'rotate(45deg)',
                pointerEvents: 'none',
                animation: 'gradient-rotate 15s linear infinite',
                filter: 'blur(20px)',
              },
              '@keyframes gradient-rotate': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                }
              }
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                fontWeight={600}
                sx={{ 
                  mb: 3,
                  background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.8))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Your Feedback Matters!
              </Typography>

              <Box sx={{ mb: 4 }}>
                <FeatureBox 
                  icon={ChatBubbleOutlineIcon}
                  title="Share Your Thoughts"
                  description="Help us improve your experience with valuable feedback"
                />
                <FeatureBox 
                  icon={AccessTimeIcon}
                  title="Quick & Easy"
                  description="Takes only 2 minutes to complete the feedback"
                />
                <FeatureBox 
                  icon={EmojiEventsIcon}
                  title="Get Certificate"
                  description="Receive your participation certificate instantly"
                />
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  mb: 3,
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    filter: 'blur(8px)',
                    zIndex: -1,
                  }
                }}
              >
                <SocialButton icon={LinkedInIcon} />
                <SocialButton icon={YouTubeIcon} />
                <SocialButton icon={InstagramIcon} />
              </Box>

              <Box 
                sx={{ 
                  position: 'relative',
                  mt: 4,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    filter: 'blur(15px)',
                    zIndex: 0,
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -20,
                      height: '40%',
                      background: 'linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.3))',
                      borderRadius: '0 0 24px 24px',
                    }
                  }}
                >
                  <img 
                    src="/feedback1.jpg" 
                    alt="Feedback"
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '24px',
                      transform: 'scale(1.02)',
                      filter: 'contrast(1.1) brightness(1.1)',
                      mixBlendMode: 'luminosity',
                      opacity: 0.9,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600} sx={{ fontSize: '1.5rem' }}>
              Share Your Experience
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                fontSize: '0.875rem'
              }}
            >
              ~2 min
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  placeholder="E.g. Jane"
                  required
                  sx={{ fontSize: '0.875rem' }}
                  InputProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  placeholder="E.g. Doe"
                  required
                  sx={{ fontSize: '0.875rem' }}
                  InputProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Select
                    defaultValue="+91"
                    size="small"
                    sx={{ 
                      minWidth: 80,
                      fontSize: '0.875rem',
                      '& .MuiSelect-select': {
                        py: 1
                      }
                    }}
                  >
                    <MenuItem value="+91" sx={{ fontSize: '0.875rem' }}>+91</MenuItem>
                    <MenuItem value="+1" sx={{ fontSize: '0.875rem' }}>+1</MenuItem>
                    <MenuItem value="+44" sx={{ fontSize: '0.875rem' }}>+44</MenuItem>
                  </Select>
                  <TextField
                    fullWidth
                    size="small"
                    label="WhatsApp Number"
                    required
                    placeholder="Enter your number"
                    sx={{ fontSize: '0.875rem' }}
                    InputProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                    InputLabelProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  type="email"
                  placeholder="E.g. abc@gmail.com"
                  required
                  sx={{ fontSize: '0.875rem' }}
                  InputProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <EmojiRating 
                  value={rating} 
                  onChange={(newValue) => setRating(newValue)} 
                />
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  gutterBottom 
                  fontWeight={500}
                  sx={{ fontSize: '0.875rem' }}
                >
                  What aspects did you enjoy most?
                </Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {aspects.map((aspect) => (
                      <Grid item xs={12} sm={6} key={aspect}>
                        <FormControlLabel
                          control={<Checkbox size="small" />}
                          label={
                            <Typography 
                              variant="body2" 
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {aspect}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Do you have any suggestions for future sessions?"
                  placeholder="E.g. Increasing session time"
                  multiline
                  rows={3}
                  sx={{ fontSize: '0.875rem' }}
                  InputProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ 
                    py: 1.25,
                    fontSize: '0.875rem'
                  }}
                >
                  Submit Feedback
                </Button>
                <Typography 
                  variant="body2" 
                  align="center" 
                  sx={{ 
                    mt: 1.5, 
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  Submit feedback to receive your certificate link.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FeedbackForm; 