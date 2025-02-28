import { Box } from '@mui/material';

const Logo = () => {
  return (
    <Box
      component="img"
      src="/flourish-logo.jpeg"
      alt="Flourish"
      sx={{ 
        height: 50,
        width: 'auto'
      }}
    />
  );
};

export default Logo; 