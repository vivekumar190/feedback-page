import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ py: 3, borderTop: '1px solid #eee' }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Eblity. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="text.secondary" underline="none">
              Privacy Policy
            </Link>
            <Link href="#" color="text.secondary" underline="none">
              Terms of Service
            </Link>
            <Link href="#" color="text.secondary" underline="none">
              Contact Support
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 