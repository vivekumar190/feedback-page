import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmojiRating from "../Rating/EmojiRating"; // Added import
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PresentationIcon from '@mui/icons-material/Slideshow';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExtensionIcon from '@mui/icons-material/Extension';
import SessionDetails from '../SessionDetails/SessionDetails';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const FeatureBox = ({ icon: Icon, title, description }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mb: 2,
      transform: "translateX(0)",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateX(8px)",
        "& .feature-icon": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          transform: "scale(1.1)",
        },
      },
    }}
  >
    <Box
      className="feature-icon"
      sx={{
        mr: 1.5,
        p: 0.75,
        borderRadius: 1.5,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Icon sx={{ fontSize: 20 }} />
    </Box>
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 0.25,
          fontSize: { xs: "0.9rem", md: "1rem" },
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          maxWidth: "220px",
          lineHeight: 1.3,
          fontSize: { xs: "0.8rem", md: "0.875rem" },
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
      color: "white",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      width: 36,
      height: 36,
      backdropFilter: "blur(4px)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(-4px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      },
      transition: "all 0.3s ease-in-out",
    }}
  >
    <Icon fontSize="small" />
  </IconButton>
);

SocialButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
};

import { useNavigate } from "react-router-dom";

const formatWhatsAppNumber = (number) => {
  // Remove all non-digit characters
  const digits = number.replace(/\D/g, '');
  return digits;
};

const validateWhatsAppNumber = (number) => {
  const digits = number.replace(/\D/g, '');
  return digits.length === 10;
};

// Add validation schema
const validationSchema = Yup.object().shape({
  whatsappNumber: Yup.string()
    .matches(/^\d{10}$/, 'Please enter a valid 10-digit number')
    .required('WhatsApp number is required'),
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  rating: Yup.number()
    .required('Please select a rating')
    .oneOf([2, 4, 6, 8, 10], 'Please select a valid rating'),
  lowRatingReason: Yup.string()
    .when('rating', {
      is: (rating) => rating <= 6,
      then: () => Yup.string().required('Please select a reason for your rating'),
      otherwise: () => Yup.string(),
    }),
  otherReason: Yup.string()
    .when('lowRatingReason', {
      is: 'Other',
      then: () => Yup.string().required('Please specify your reason'),
      otherwise: () => Yup.string(),
    }),
  aspects: Yup.array().of(Yup.string()), // Array of strings
  suggestions: Yup.string(), // Optional
});

const aspects = [
  { id: 'content', label: 'Content Quality', icon: AutoAwesomeIcon },
  { id: 'presentation', label: 'Presentation', icon: PresentationIcon },
  { id: 'interaction', label: 'Interaction', icon: GroupIcon },
  { id: 'materials', label: 'Materials Provided', icon: MenuBookIcon },
  { id: 'clarity', label: 'Clarity of Explanation', icon: LightbulbIcon },
  { id: 'technical', label: 'Technical Setup', icon: SettingsIcon },
  { id: 'qa', label: 'Q&A Session', icon: QuestionAnswerIcon },
  { id: 'activities', label: 'Activities', icon: ExtensionIcon },
];

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentreg_id: "",
    student_whatsapp_number: "",
  });
  const [error, setError] = useState(false);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [lowRatingReason, setLowRatingReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const lowRatingOptions = [
    "Session content was not engaging",
    "Speaker was not clear or effective",
    "Technical issues (audio/video problems)",
    "Session pace was too fast or too slow",
    "Q&A session was not satisfactory",
    "Difficulty in understanding the topic",
    "Too much or too little interaction",
    "Other"
  ];

  const fetchUserData = async (number) => {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/appiDWCj01hUW5CtW/tbla16kSdqRkZLUO1/?filterByFormula=student_whatsapp_number=${number}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
          },
        },
      );
      const data = await response.json();
      if (data.records && data.records?.length > 0) {
        const userData = data.records[0].fields;
        
        setFormData({
          firstName: userData.student_first_name || "",
          lastName: userData.student_last_name || "",
          email: userData.student_email_id || "",
          studentreg_id: userData.student_registration || "",
          student_whatsapp_number: number,
        });

        formik.setValues({
          ...formik.values,
          whatsappNumber: number,
          firstName: userData.student_first_name || "",
          lastName: userData.student_last_name || "",
          email: userData.student_email_id || "",
        }, false);

        setIsFormEnabled(true);
        setError(false);
      } else {
        setError(true);
        setIsFormEnabled(false);
        formik.setFieldValue('whatsappNumber', number);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      formik.setFieldValue('whatsappNumber', number);
    }
  };

  const formik = useFormik({
    initialValues: {
      whatsappNumber: formData.student_whatsapp_number || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      rating: null,
      lowRatingReason: '',
      otherReason: '',
      aspects: [],
      suggestions: '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const response = await fetch(
          "https://api.airtable.com/v0/appiDWCj01hUW5CtW/tblVK77VaisYt94Ne",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              records: [
                {
                  fields: {
                    student_registration_id: formData.studentreg_id,
                    feedback: values.suggestions,
                    rating: values.rating,
                    low_rating_reason: values.rating <= 6 ? 
                      (values.lowRatingReason === 'Other' ? values.otherReason : values.lowRatingReason) 
                      : null,
                    aspects: values.aspects,
                  },
                },
              ],
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Failed to submit feedback");
        }

        setOpenSuccessDialog(true);
        setTimeout(() => {
          setOpenSuccessDialog(false);
          navigate("/thank-you");
        }, 2000);
      } catch (err) {
        console.error("Submission error:", err);
        setError(err.message || "An error occurred while submitting feedback");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleWhatsappChange = (e) => {
    let number = e.target.value;
    number = formatWhatsAppNumber(number);
    
    formik.setFieldValue('whatsappNumber', number);
    
    if (validateWhatsAppNumber(number)) {
      fetchUserData(number);
    } else {
      setIsFormEnabled(false);
      setFormData(prev => ({ ...prev, student_whatsapp_number: number }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.setValues({
      ...formik.values,
      rating: rating,
      lowRatingReason: rating <= 6 ? lowRatingReason : '',
      otherReason: lowRatingReason === 'Other' ? otherReason : '',
    }, true);
    
    formik.handleSubmit();
  };

  useEffect(() => {
    if (rating) {
      formik.setFieldValue('rating', rating);
    }
  }, [rating]);

  useEffect(() => {
    if (lowRatingReason) {
      formik.setFieldValue('lowRatingReason', lowRatingReason);
    }
  }, [lowRatingReason]);

  useEffect(() => {
    if (otherReason) {
      formik.setFieldValue('otherReason', otherReason);
    }
  }, [otherReason]);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          flexGrow: 1,
          alignItems: 'stretch',
        }}
      >
        {/* Left Panel - Enhanced styling */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            mb: { xs: 0, md: "inherit" }, // Remove margin on mobile, keep original on desktop
          }}
        >
          <Paper
            onClick={() => {
              const formElement = document.getElementById("feedback-form");
              formElement?.scrollIntoView({ behavior: "smooth" });
              formElement?.classList.add("highlight-form");
              setTimeout(
                () => formElement?.classList.remove("highlight-form"),
                2000,
              );
            }}
            sx={{
              borderRadius: 3,
              p: 3,
              color: "white",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
              },
              height: "100%",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 40px -10px rgba(99, 102, 241, 0.4)",
              background: `linear-gradient(135deg, 
                #6366F1 0%,
                #8B5CF6 50%,
                #D946EF 100%
              )`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at top right,
                  rgba(255,255,255,0.2) 0%,
                  rgba(255,255,255,0.1) 10%,
                  transparent 50%
                )`,
                pointerEvents: "none",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: "-50%",
                left: "-50%",
                right: "-50%",
                bottom: "-50%",
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
                transform: "rotate(45deg)",
                pointerEvents: "none",
                animation: "gradient-rotate 15s linear infinite",
                filter: "blur(20px)",
              },
              "@keyframes gradient-rotate": {
                "0%": {
                  transform: "rotate(0deg)",
                },
                "100%": {
                  transform: "rotate(360deg)",
                },
              },
            }}
          >
            {/* Mobile View */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {/* Header Section */}
              <Box sx={{ mb: 1, textAlign: "center" }}>
                {/* Flourish Logo */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <img
                    src="/flourish-logo.jpeg"
                    alt="Flourish Logo"
                    style={{
                      height: 50,
                      borderRadius: 5,
                    }}
                  />
                </Box>

                {/* Feedback Matters Text */}
                <Typography
                  variant="h5"
                  gutterBottom
                  fontWeight={600}
                  sx={{
                    background:
                      "linear-gradient(to right, #fff, rgba(255,255,255,0.8))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  }}
                >
                  Your Feedback Matters!
                </Typography>

                {/* Session Details */}
                <SessionDetails />
              </Box>
            </Box>

            {/* Desktop View - Full Content */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Box sx={{ position: "relative" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  fontWeight={600}
                  sx={{
                    mb: 3,
                    background:
                      "linear-gradient(to right, #fff, rgba(255,255,255,0.8))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Your Feedback Matters!
                </Typography>

                {/* Session Details for Desktop */}
                <Box sx={{ mb: 4 }}>
                  <SessionDetails />
                </Box>

                {/* Features Section */}
                <Box sx={{ mb: 2 }}>
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

                {/* Social Links Section */}
                {/* <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  <SocialButton icon={LinkedInIcon} />
                  <SocialButton icon={YouTubeIcon} />
                  <SocialButton icon={InstagramIcon} />
                </Box> */}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Enhanced styling */}
        <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
          <Paper
            id="feedback-form"
            sx={{
              borderRadius: { xs: 2.5, md: 3 },
              p: { xs: 2.5, md: 3 },
              background: "radial-gradient(ellipse at center, rgba(189, 189, 189, 0.15) 0%, transparent 70%)",
              backdropFilter: 'blur(12px)',
              boxShadow: '1 10px 32px rgba(0, 0, 0, 0.05)',
              flex: 1,
              position: "relative",
              overflow: "hidden",
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              },
              '& .MuiInputLabel-root': {
                color: 'text.primary',
              },
              '& .MuiOutlinedInput-root': {
                color: 'text.primary',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.87)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'text.secondary',
              },
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 3,
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              Share Your Experience
            </Typography>

            <Grid container spacing={2.5}>
              {/* WhatsApp Field */}
              <Grid item xs={12}>
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    id="whatsapp-field"
                    fullWidth
                    size="small"
                    label="WhatsApp Number"
                    placeholder="Enter 10 digit number"
                    required
                    value={formik.values.whatsappNumber}
                    onChange={handleWhatsappChange}
                    error={formik.touched.whatsappNumber && Boolean(formik.errors.whatsappNumber)}
                    helperText={formik.touched.whatsappNumber && formik.errors.whatsappNumber}
                    inputProps={{
                      maxLength: 10,
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        pl: 0,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        '& .MuiOutlinedInput-input': {
                          pl: 0.5,
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'primary.50',
                          '& fieldset': {
                            borderWidth: '1px',
                            borderColor: 'primary.main',
                          },
                          '& .whatsapp-prefix': {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                          }
                        },
                        '&.Mui-error': {
                          backgroundColor: 'error.50',
                          '& .whatsapp-prefix': {
                            borderColor: 'error.main',
                            color: 'error.main',
                          }
                        },
                        '& fieldset': {
                          borderColor: 'divider',
                        },
                        '&:hover fieldset': {
                          borderColor: 'divider',
                        },
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          className="whatsapp-prefix"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            pr: 1.5,
                            mr: 1.5,
                            pl: 1,
                            height: 32,
                            minWidth: 'fit-content',
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <WhatsAppIcon 
                            sx={{ 
                              fontSize: 18, 
                              color: 'primary.main',
                              mr: 0.75,
                              flexShrink: 0,
                            }} 
                          />
                          <Typography
                            component="span"
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: 'text.secondary',
                              userSelect: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            +91
                          </Typography>
                        </Box>
                      )
                    }}
                  />
                  {formik.values.whatsappNumber.length > 0 && validateWhatsAppNumber(formik.values.whatsappNumber) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'success.main',
                        boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.2)',
                      }}
                    />
                  )}
                </Box>
              </Grid>

              {/* Name Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  required
                  disabled={!isFormEnabled}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="firstName"
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: isFormEnabled ? 'background.paper' : 'action.disabledBackground',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  required
                  disabled={!isFormEnabled}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="lastName"
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: isFormEnabled ? 'background.paper' : 'action.disabledBackground',
                    }
                  }}
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  label="Email"
                  required
                  disabled={!isFormEnabled}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="email"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: isFormEnabled ? 'background.paper' : 'action.disabledBackground',
                    }
                  }}
                />
              </Grid>

              {/* Rating Field - Mandatory */}
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  How would you rate your experience?
                  <Box 
                    component="span" 
                    sx={{ 
                      color: 'error.main',
                      fontSize: '1rem',
                      lineHeight: 1
                    }}
                  >
                    *
                  </Box>
                </Typography>
                <EmojiRating
                  value={rating}
                  onChange={(newValue) => setRating(newValue)}
                  error={false}
                  sx={{
                    '& .MuiRating-root': {
                      gap: 1
                    }
                  }}
                />
              </Grid>

              {/* Low Rating Reason Dropdown */}
              {rating && rating <= 6 && (
                <Grid item xs={12}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 1 }}
                  >
                  Could you please share why?
                  </Typography>
                  
                  <FormControl 
                    fullWidth 
                    size="small"
                    error={formik.touched.lowRatingReason && Boolean(formik.errors.lowRatingReason)}
                    sx={{ 
                      mt: { xs: 0.5, sm: 1 }
                    }}
                  >
                    <InputLabel id="low-rating-reason-label">Select Reason</InputLabel>
                    <Select
                      labelId="low-rating-reason-label"
                      id="low-rating-reason"
                      value={lowRatingReason}
                      label="Select Reason"
                      onChange={(e) => {
                        setLowRatingReason(e.target.value);
                        formik.setFieldValue('lowRatingReason', e.target.value);
                      }}
                      sx={{ mb: { xs: .5, sm: 1 } }}
                    >
                      {lowRatingOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.lowRatingReason && formik.errors.lowRatingReason && (
                      <Typography 
                        color="error" 
                        variant="caption" 
                        sx={{ mt: { xs: 0.5, sm: 1 }, display: 'block' }}
                      > 
                        {formik.errors.lowRatingReason}
                      </Typography>
                    )}
                  </FormControl>

                  {/* Other Reason TextField */}
                  {lowRatingReason === "Other" && (
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      label="Please specify the reason"
                      value={otherReason}
                      onChange={(e) => {
                        setOtherReason(e.target.value);
                        formik.setFieldValue('otherReason', e.target.value);
                      }}
                      error={formik.touched.otherReason && Boolean(formik.errors.otherReason)}
                      helperText={formik.touched.otherReason && formik.errors.otherReason}
                      sx={{ 
                        mt: { xs: 1, sm: 2 },
                        mb: { xs: 1.5, sm: 3 },
                        '& .MuiFormHelperText-root': {
                          mt: { xs: 0.5, sm: 1 }
                        }
                      }}
                    />
                  )}
                </Grid>
              )}

              {/* Aspects Field - Optional */}
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{ color: 'primary.main' }}
                >
                  What aspects did you enjoy? (Optional)
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    mt: 1
                  }}
                >
                  {aspects.map((aspect) => {
                    const Icon = aspect.icon;
                    const isSelected = formik.values.aspects.includes(aspect.label);
                    
                    return (
                      <Chip
                        key={aspect.id}
                        label={aspect.label}
                        icon={
                          <Icon 
                            sx={{ 
                              fontSize: 18,
                              color: isSelected ? 'inherit' : 'primary.main',
                            }} 
                          />
                        }
                        onClick={() => {
                          const newAspects = formik.values.aspects.includes(aspect.label)
                            ? formik.values.aspects.filter(item => item !== aspect.label)
                            : [...formik.values.aspects, aspect.label];
                          formik.setFieldValue('aspects', newAspects);
                        }}
                        variant={isSelected ? "filled" : "outlined"}
                        color={isSelected ? "primary" : "default"}
                        sx={{
                          borderRadius: 2,
                          py: 2.5,
                          px: 1,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                          '& .MuiChip-icon': {
                            ml: 1,
                          },
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            bgcolor: isSelected ? 'primary.main' : 'primary.50',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(99, 102, 241, 0.2)',
                          },
                          ...(isSelected && {
                            boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
                          }),
                        }}
                      />
                    );
                  })}
                </Box>
              </Grid>

              {/* Suggestions Field - Optional */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Any suggestions? (Optional)"
                  placeholder="Share your thoughts..."
                  multiline
                  rows={3}
                  value={formik.values.suggestions}
                  onChange={(e) => formik.handleChange(e)}
                  name="suggestions"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!isFormEnabled || submitting || !rating}
                  onClick={handleSubmit}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                    }
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                <Typography
                  variant="caption"
                  align="center"
                  sx={{
                    display: 'block',
                    mt: 1,
                    color: 'text.secondary'
                  }}
                >
                  * Required fields
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Enhanced Dialog Styling */}
      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
          Success!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography>
            Your feedback has been submitted successfully.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", pb: 3 }}
        ></DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(error)}
        onClose={() => setError(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: '0 25px 50px -12px rgba(255, 152, 0, 0.25)',
          }
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          {/* Error Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: 'warning.light',
              color: 'warning.main',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.4)',
                },
                '70%': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 0 10px rgba(255, 152, 0, 0)',
                },
                '100%': {
                  transform: 'scale(1)',
                  boxShadow: '0 0 0 0 rgba(255, 152, 0, 0)',
                },
              },
            }}
          >
            <SentimentDissatisfiedIcon sx={{ fontSize: 40 }} />
          </Box>

          {/* Error Title */}
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: 'warning.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 28 }} />
            Oops!
          </Typography>

          {/* Error Message */}
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: 'text.secondary',
              maxWidth: 300,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            {typeof error === "string"
              ? error
              : "Looks like you're not registered. Please register for upcoming sessions!"}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => setError(null)}
              variant="outlined"
              color="warning"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'warning.50',
                },
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => window.open('https://flourish.ly', '_blank')}
              variant="contained"
              color="warning"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  bgcolor: 'warning.dark',
                },
              }}
            >
              Register Now
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default FeedbackForm;
