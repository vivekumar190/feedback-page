import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LinkIcon from '@mui/icons-material/Link';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import { getSessionDetailsAndResources, getUserDetails } from '../../utils/airtable';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CertificateTemplate from '../Certificate/CertificateTemplate';

const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    {...other}
    sx={{ py: 3 }}
  >
    {value === index && children}
  </Box>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const ResourceCard = ({ filename, url, type, thumbnails }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleClose = () => {
    setPreviewOpen(false);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <>
      <Card 
        variant="outlined" 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          borderRadius: 2,
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box 
            sx={{ 
              pt: '56.25%',
              position: 'relative',
              bgcolor: 'grey.50',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            {thumbnails?.large ? (
              <img 
                src={thumbnails.large.url}
                alt={filename}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <PictureAsPdfIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            )}
          </Box>
        </Box>
        <CardContent 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            p: 2,
          }}
        >
          <Box>
            <Typography 
              variant="subtitle1" 
              fontWeight={500}
              sx={{ 
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {filename}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PictureAsPdfIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="caption" color="text.secondary">
                {type.split('/')[1]?.toUpperCase() || type}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            mt: 'auto',
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              variant="text"
              startIcon={<OpenInNewIcon sx={{ fontSize: 18 }} />}
              onClick={handlePreview}
              size="small"
              fullWidth
              sx={{
                color: 'primary.main',
                fontSize: '0.8125rem',
                py: 0.5,
                '&:hover': {
                  bgcolor: 'primary.50',
                }
              }}
            >
              Preview
            </Button>
            <Button
              variant="text"
              startIcon={<FileDownloadIcon sx={{ fontSize: 18 }} />}
              onClick={handleDownload}
              size="small"
              fullWidth
              sx={{
                color: 'primary.main',
                fontSize: '0.8125rem',
                py: 0.5,
                '&:hover': {
                  bgcolor: 'primary.50',
                }
              }}
            >
              Download
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={previewOpen}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          m: 0, 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="subtitle1" component="div" fontWeight={500}>
            {filename}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: 'grey.500',
              '&:hover': {
                color: 'grey.700',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          <iframe
            src={url}
            title={filename}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

ResourceCard.propTypes = {
  filename: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  thumbnails: PropTypes.shape({
    small: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
    large: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
  }),
};

const CertificatePreview = ({ userData, onDownload }) => (
  <Box sx={{ px: { xs: 1, sm: 2 } }}>
    <Box sx={{ 
      mb: 3,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'center' },
      gap: 2,
      '& > button': {
        flex: { xs: '1 1 auto', sm: '0 0 auto' }
      }
    }}>
      <Typography 
        variant="h6" 
        fontWeight={600}
        sx={{ 
          textAlign: { xs: 'center', sm: 'left' },
          fontSize: { xs: '1.125rem', sm: '1.25rem' }
        }}
      >
        Certificate of Participation
      </Typography>
      <Button
        variant="contained"
        fullWidth={false}
        startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
        onClick={onDownload}
        size="small"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          width: { xs: '100%', sm: 'auto' },
          fontSize: '0.875rem',
          py: 0.75,
          px: 2,
          borderRadius: 1.5,
          '&:hover': {
            bgcolor: 'primary.dark',
          }
        }}
      >
        Download Certificate
      </Button>
    </Box>

    <Box 
      sx={{ 
        maxWidth: 900,
        margin: '0 auto',
        position: 'relative',
        bgcolor: '#fff',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: { xs: 'auto', sm: '600px' },
      }}
    >
      {/* Background Elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: '40%', sm: '30%' },
          height: { xs: '40%', sm: '30%' },
          bgcolor: 'primary.main',
          borderRadius: '0 0 0 100%',
          opacity: 0.1,
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: { xs: '40%', sm: '30%' },
          height: { xs: '40%', sm: '30%' },
          bgcolor: 'primary.main',
          borderRadius: '0 100% 0 0',
          opacity: 0.1,
        }}
      />

      {/* Certificate Content */}
      <Box 
        sx={{ 
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 2, sm: 4 },
        }}
      >
        {/* Top Section */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Box sx={{ mb: { xs: 1, sm: 2 } }}>
            <img 
              src="/medal.png" 
              alt="Medal" 
              style={{ 
                width: 40,
                height: 40,
                marginBottom: 8
              }}
            />
          </Box>
          <Typography 
            variant="h5" 
            gutterBottom 
            fontWeight={600}
            sx={{ 
              fontSize: { xs: '1.125rem', sm: '1.5rem' },
              lineHeight: 1.3
            }}
          >
            Certificate of Participation
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            This is to certify that
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '1.25rem', sm: '2rem' },
              lineHeight: 1.3,
              wordBreak: 'break-word'
            }}
          >
            {userData?.fields?.student_full_name || ''}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            from
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              my: { xs: 0.5, sm: 1 },
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              lineHeight: 1.3,
              wordBreak: 'break-word'
            }}
          >
            {userData?.fields?.school_name || ''} - Grade {userData?.fields?.grade || ''}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            has successfully participated in the
          </Typography>
          <Typography 
            variant="h5" 
            color="primary.main" 
            sx={{ 
              my: { xs: 1, sm: 2 },
              fontWeight: 500,
              fontSize: { xs: '1.125rem', sm: '1.5rem' },
              lineHeight: 1.3
            }}
          >
            Student Learning Session
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            conducted on {new Date(userData?.fields?.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>

        {/* Signature Section */}
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            mt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 4 },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box 
              sx={{ 
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                width: { xs: 100, sm: 150 },
                mb: 1,
                pt: 3
              }}
            >
              <img 
                src="/signature1.png" 
                alt="Signature" 
                style={{ 
                  width: '100%',
                  marginBottom: -15,
                  opacity: 0.8
                }}
              />
            </Box>
            <Typography 
              variant="body2" 
              fontWeight={500}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Session Instructor
            </Typography>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ textAlign: 'center', width: '100%', mt: { xs: 2, sm: 0 } }}>
          <Box sx={{ mb: { xs: 1, sm: 2 } }}>
            <img 
              src="/flourish-logo.jpeg"
              alt="Flourish"
              style={{ 
                height: 50
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

CertificatePreview.propTypes = {
  userData: PropTypes.shape({
    fields: PropTypes.shape({
      student_full_name: PropTypes.string,
      student_email_id: PropTypes.string,
      school_name: PropTypes.string,
      grade: PropTypes.string,
      created_at: PropTypes.string,
    }),
  }),
  onDownload: PropTypes.func.isRequired,
};

const ResourcesAndCertificate = () => {
  // Get IDs from URL parameters
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_detailsid');
  const studentId = searchParams.get('studentid');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessionData, userDetails] = await Promise.all([
          getSessionDetailsAndResources(sessionId),
          getUserDetails(studentId) // Use studentId here
        ]);

        setSessionDetails(sessionData);
        setUserData(userDetails);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    if (sessionId && studentId) {
      fetchData();
    } else {
      setError('Missing required parameters. Please check the URL.');
      setLoading(false);
    }
  }, [sessionId, studentId]);

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const handleCertificateDownload = () => {
    console.log('Downloading certificate...');
  };

  const certificateData = {
    name: userData?.fields?.student_full_name || '',
    courseName: sessionDetails?.fields?.sessionName || '',
    date: sessionDetails?.fields?.created_at ? 
      new Date(sessionDetails.fields.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : '',
    signatureImage: '/path-to-signature-image.png',
    signatoryName: 'SMITA TRIPATHI',
    signatoryRole: 'Education Specialist',
    logoImage: '/path-to-logo-image.png',
    resources: sessionDetails?.fields?.resources || []
  };

  const renderCertificateTab = () => {
    if (loading) {
      return <CircularProgress />;
    }

    return (
      <Box sx={{ p: 3 }}>
        <CertificateTemplate certificateData={certificateData} />
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
      }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            px: 2,
            '& .MuiTab-root': {
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 500,
            }
          }}
        >
          <Tab label="Certificate" />
          <Tab label="Resources" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {renderCertificateTab()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 2 }}>
            <Grid container spacing={3}>
              {certificateData.resources.map((resource) => (
                <Grid item xs={12} sm={6} md={4} key={resource.id}>
                  <ResourceCard 
                    filename={resource.filename}
                    url={resource.url}
                    type={resource.type}
                    thumbnails={resource.thumbnails}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ResourcesAndCertificate; 