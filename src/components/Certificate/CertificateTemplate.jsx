import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const CertificateTemplate = ({ certificateData }) => {
  return (
    <Box
      sx={{
        width: '1000px',
        height: '650px',
        bgcolor: '#fff',
        borderRadius: '24px',
        overflow: 'visible',
        position: 'relative',
        display: 'flex',
        boxShadow: '2px 4px 24px rgba(0,0,0,0.1)',
        minWidth: '1000px',
        minHeight: '600px',
        transform: 'scale(1)',
        transformOrigin: 'top left',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {/* Left Sidebar with Shapes */}
      <Box
        sx={{
          width: '100px',
          height: '100%',
          bgcolor: '#1A237E',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Yellow Circle */}
        <Box
          sx={{
            position: 'absolute',
            top: '12%',
            left: '50%',
            width: '32px',
            height: '32px',
            bgcolor: '#FFC107',
            borderRadius: '50%',
            zIndex: 2,
          }}
        />
        
        {/* Coral Circle */}
        <Box
          sx={{
            position: 'absolute',
            top: '28%',
            left: '25%',
            width: '20px',
            height: '20px',
            bgcolor: '#FF7B6B',
            borderRadius: '50%',
            zIndex: 2,
          }}
        />
        
        {/* Yellow Triangle */}
        <Box
          sx={{
            position: 'absolute',
            top: '44%',
            left: '50%',
            width: '28px',
            height: '28px',
            bgcolor: 'transparent',
            zIndex: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '14px 24px 14px 0',
              borderColor: 'transparent #FFC107 transparent transparent',
              transform: 'rotate(0deg)',
              transformOrigin: 'center',
            }
          }}
        />
        
        {/* Coral Triangle */}
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            left: '25%',
            width: '24px',
            height: '24px',
            bgcolor: 'transparent',
            zIndex: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 12px 20px 12px',
              borderColor: 'transparent transparent #FF7B6B transparent',
            }
          }}
        />
        
        {/* Yellow Square */}
        <Box
          sx={{
            position: 'absolute',
            top: '76%',
            left: '50%',
            width: '28px',
            height: '28px',
            bgcolor: '#FFC107',
            transform: 'rotate(45deg)',
            zIndex: 2,
          }}
        />
        
        {/* Coral Square */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '8%',
            left: '25%',
            width: '20px',
            height: '20px',
            bgcolor: '#FF7B6B',
            borderRadius: '2px',
            transform: 'rotate(-15deg)',
            zIndex: 2,
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          p: '40px 40px 40px 60px',
          overflow: 'visible',
        }}
      >
        {/* Flourish Logo */}
        <Box
          sx={{
            position: 'absolute',
            top: 30,
            right: 40,
          }}
        >
          <img
            src="/flourish-logo.jpeg"
            alt="Flourish"
            style={{
              height: '50px',
            }}
          />
        </Box>

        {/* Medal and Title */}
        <Box sx={{ mb: 4 }}>
          <img
            src="/medal.png"
            alt="Medal"
            style={{
              width: '80px',
              height: '80px',
              marginBottom: '32px',
            }}
          />
          <Typography
            variant="h3"
            sx={{
              color: '#1A237E',
              fontWeight: 700,
              fontSize: '42px',
              letterSpacing: '-0.02em',
            }}
          >
            Certificate of Participation
          </Typography>
        </Box>

        {/* Certificate Content */}
        <Box sx={{ mt: 5 }}>
          <Typography
            variant="body1"
            sx={{ 
              color: '#666',
              mb: 1,
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}
          >
            THIS CERTIFICATE IS PRESENTED TO
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: '#FF7B6B',
              fontWeight: 600,
              fontSize: '48px',
              mb: 2,
              letterSpacing: '-0.01em',
            }}
          >
            {certificateData.name}
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              color: '#444',
              mb: 3,
              fontSize: '16px',
              display: 'inline-block',
            }}
          >
            For attending the Flourish training session on
            <Typography 
              component="span" 
              sx={{ 
                ml: 1,
                fontWeight: 600,
                color: '#1A237E',
              }}
            >
              {format(new Date(certificateData.date), 'MMMM do yyyy')}
            </Typography>
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#1A237E',
                fontWeight: 600,
                fontSize: '24px',
                mb: 1,
              }}
            >
              Title-{certificateData.courseName}
            </Typography>
          </Box>
        </Box>

        {/* Speakers Section */}
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 40,
            width: '100%',
            display: 'flex',
            justifyContent: certificateData.speakers?.length === 1 ? 'flex-end' : 'space-between',
            px: 0,
            maxWidth: '800px',
            mx: 'auto',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {certificateData.speakers?.length === 1 ? (
            // Single speaker - show on right
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}
            >
              {certificateData.speakers[0].image ? (
                <Box
                  sx={{
                    width: '150px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  <img
                    src={certificateData.speakers[0].image}
                    alt={`${certificateData.speakers[0].name}'s Signature`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontFamily: 'Dancing Script, cursive',
                    fontSize: '32px',
                    color: '#1A237E',
                    mb: 1,
                  }}
                >
                  {certificateData.speakers[0].name}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{
                  color: '#1A237E',
                  fontWeight: 600,
                  fontSize: '14px',
                  textAlign: 'center',
                  mb: 0.5,
                }}
              >
                {certificateData.speakers[0].name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                {certificateData.speakers[0].designation}
              </Typography>
            </Box>
          ) : (
            // Multiple speakers - split between left and right sides
            <>
              {/* Left side - First speaker */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '120px',
                }}
              >
                {certificateData.speakers[0].image ? (
                  <Box
                    sx={{
                      width: '150px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                    }}
                  >
                    <img
                      src={certificateData.speakers[0].image}
                      alt={`${certificateData.speakers[0].name}'s Signature`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontFamily: 'Dancing Script, cursive',
                      fontSize: '32px',
                      color: '#1A237E',
                      mb: 1,
                    }}
                  >
                    {certificateData.speakers[0].name}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1A237E',
                    fontWeight: 600,
                    fontSize: '14px',
                    textAlign: 'center',
                    mb: 0.5,
                  }}
                >
                  {certificateData.speakers[0].name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}
                >
                  {certificateData.speakers[0].designation}
                </Typography>
              </Box>

              {/* Right side - Second speaker */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '120px',
                }}
              >
                {certificateData.speakers[1].image ? (
                  <Box
                    sx={{
                      width: '150px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      mb: 1,
                    }}
                  >
                    <img
                      src={certificateData.speakers[1].image}
                      alt={`${certificateData.speakers[1].name}'s Signature`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontFamily: 'Dancing Script, cursive',
                      fontSize: '32px',
                      color: '#1A237E',
                      mb: 1,
                    }}
                  >
                    {certificateData.speakers[1].name}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1A237E',
                    fontWeight: 600,
                    fontSize: '14px',
                    textAlign: 'center',
                    mb: 0.5,
                  }}
                >
                  {certificateData.speakers[1].name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}
                >
                  {certificateData.speakers[1].designation}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

CertificateTemplate.propTypes = {
  certificateData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    courseName: PropTypes.string.isRequired,
    speakers: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      designation: PropTypes.string,
      image: PropTypes.string,
    })),
  }).isRequired,
};

export default CertificateTemplate; 