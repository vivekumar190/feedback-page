import { Box } from '@mui/material';

const Logo = () => {
  return (
    <Box
      component="img"
      src="/eblitylogo.png"
      alt="Eblity"
      sx={{ 
        height: 32,
        width: 'auto'
      }}
    />
  );
};

export default Logo; 