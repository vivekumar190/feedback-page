import { Box } from '@mui/material';

const BackgroundShapes = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.3,
        '& svg': {
          position: 'absolute',
          transition: 'transform 3s ease-in-out',
          animation: 'float 6s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      }}
    >
      {/* Pencil - Top Left */}
      <svg width="100" height="20" viewBox="0 0 100 20" style={{ top: '5%', left: '5%', transform: 'rotate(45deg)' }}>
        <path d="M0 10 L80 10 L90 5 L80 0 L80 20 L90 15 Z" fill="#FFB300" />
        <path d="M90 5 L100 10 L90 15 L80 20 L80 0 Z" fill="#FFA000" />
      </svg>

      {/* Book - Top Right */}
      <svg width="60" height="60" viewBox="0 0 60 60" style={{ top: '8%', right: '8%' }}>
        <path d="M10 10 L50 10 L50 50 L10 50 Z" fill="#FFD700" />
        <path d="M50 10 L55 15 L55 55 L50 50 Z" fill="#FFA000" />
        <path d="M10 50 L50 50 L55 55 L15 55 Z" fill="#FFB300" />
      </svg>

      {/* Graduation Cap - Bottom Left */}
      <svg width="80" height="40" viewBox="0 0 80 40" style={{ bottom: '20%', left: '18%' }}>
        <path d="M0 20 L40 0 L80 20 L40 40 Z" fill="#6366F1" />
        <path d="M35 25 L45 25 L45 35 L40 40 L35 35 Z" fill="#4F46E5" />
      </svg>

      {/* Stars - Scattered */}
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ top: '20%', left: '12%' }}>
        <path d="M10 0 L13 7 L20 7 L15 12 L17 20 L10 15 L3 20 L5 12 L0 7 L7 7 Z" fill="#FFD700" />
      </svg>
      <svg width="15" height="15" viewBox="0 0 20 20" style={{ top: '15%', right: '15%' }}>
        <path d="M10 0 L13 7 L20 7 L15 12 L17 20 L10 15 L3 20 L5 12 L0 7 L7 7 Z" fill="#FFA000" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 20 20" style={{ bottom: '15%', right: '10%' }}>
        <path d="M10 0 L13 7 L20 7 L15 12 L17 20 L10 15 L3 20 L5 12 L0 7 L7 7 Z" fill="#6366F1" />
      </svg>

      {/* Light Bulb - Top Center */}
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ top: '5%', left: '48%' }}>
        <path d="M15 0 A15 15 0 0 1 25 0 A20 20 0 0 1 25 30 L15 30 A20 20 0 0 1 15 0" fill="#8B5CF6" />
        <path d="M15 32 L25 32 L23 50 L17 50 Z" fill="#6366F1" />
      </svg>

      {/* Atom - Bottom Center */}
      <svg width="60" height="60" viewBox="0 0 60 60" style={{ bottom: '5%', left: '45%' }}>
        <circle cx="30" cy="30" r="5" fill="#D946EF" />
        <ellipse cx="30" cy="30" rx="25" ry="10" stroke="#F0ABFC" fill="none" transform="rotate(0 30 30)" />
        <ellipse cx="30" cy="30" rx="25" ry="10" stroke="#F0ABFC" fill="none" transform="rotate(60 30 30)" />
        <ellipse cx="30" cy="30" rx="25" ry="10" stroke="#F0ABFC" fill="none" transform="rotate(120 30 30)" />
      </svg>

      {/* Mathematical Symbols */}
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ top: '30%', left: '3%' }}>
        <path d="M0 15 H40 V25 H0 Z M15 0 V40" fill="#4F46E5" />
      </svg>
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ bottom: '20%', right: '5%' }}>
        <path d="M5 20 L35 20 M20 5 L20 35" stroke="#FFB300" strokeWidth="5" />
      </svg>

      {/* Paint Palette - Bottom Left */}
      <svg width="70" height="50" viewBox="0 0 70 50" style={{ bottom: '8%', left: '5%' }}>
        <path d="M10 25 A25 25 0 0 1 60 25 A20 20 0 0 1 35 45 A20 20 0 0 1 10 25" fill="#F0ABFC" />
        <circle cx="20" cy="20" r="5" fill="#6366F1" />
        <circle cx="35" cy="15" r="5" fill="#FFD700" />
        <circle cx="50" cy="20" r="5" fill="#4F46E5" />
        <circle cx="35" cy="30" r="5" fill="#FFA000" />
      </svg>

      {/* DNA Helix - Right Center */}
      <svg width="30" height="80" viewBox="0 0 30 80" style={{ top: '40%', right: '5%' }}>
        <path d="M15 0 Q30 20 15 40 Q0 60 15 80" stroke="#D946EF" fill="none" />
        <path d="M15 0 Q0 20 15 40 Q30 60 15 80" stroke="#8B5CF6" fill="none" />
      </svg>
    </Box>
  );
};

export default BackgroundShapes; 