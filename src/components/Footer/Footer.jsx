import React from 'react';
import { Box, Container, IconButton, Typography, Stack, Link } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import SupportIcon from '@mui/icons-material/HeadsetMic';

const Footer = () => {
  const socialLinks = [
    { 
      icon: LinkedInIcon, 
      url: 'https://www.linkedin.com/company/flourishly/',
      color: '#0A66C2'
    },
    { 
      icon: YouTubeIcon, 
      url: 'https://www.youtube.com/@flourishly',
      color: '#FF0000'
    },
    { 
      icon: InstagramIcon, 
      url: 'https://www.instagram.com/eblity_/',
      color: '#E4405F'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bottom: 0,
        left: 0,
        right: 0,
        py: { xs: 1.5, sm: 2 },
        px: { xs: 2, sm: 3 },
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Logo and Copyright */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src="/flourish-logo.jpeg"
              alt="Flourish Logo"
              style={{
                height: 40,
                borderRadius: 8
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500
              }}
            >
              © {new Date().getFullYear()} Eblity. All rights reserved.
            </Typography>
          </Box>

          {/* Center Section - Support */}
          <Link
            href="mailto:support@eblity.com"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.secondary',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: 'primary.main',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <SupportIcon sx={{ fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500
              }}
            >
              Contact Support
            </Typography>
          </Link>

          {/* Social Links */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              '& .MuiIconButton-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)'
                }
              }
            }}
          >
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: social.color,
                  '&:hover': {
                    color: social.color,
                    bgcolor: `${social.color}15`
                  }
                }}
              >
                <social.icon />
              </IconButton>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 