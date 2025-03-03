import { useState, useEffect, useCallback } from "react";
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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmojiRating from "../Rating/EmojiRating"; // Added import
import { useFormik } from "formik";
import * as Yup from "yup";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PresentationIcon from "@mui/icons-material/Slideshow";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SettingsIcon from "@mui/icons-material/Settings";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ExtensionIcon from "@mui/icons-material/Extension";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useNavigate } from "react-router-dom";
import { format, isBefore } from "date-fns";
import SessionNotStarted from "../SessionNotStarted/SessionNotStarted";
import { getSessionDetailsAndResources } from "../../utils/airtable";
import SpeakerCard from "../SessionDetailsCard/SpeakerCard";

const FeatureBox = ({ icon: Icon, title, description }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mb: 2,
      transform: "translateX(0)",
      transition: "all 0.3s ease-in-out",
      cursor: "default",
      // "&:hover": {
      //   transform: "translateX(8px)",
      //   "& .feature-icon": {
      //     backgroundColor: "rgba(255, 255, 255, 0.2)",
      //     transform: "scale(1.1)",
      //   },
      // },
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

const formatWhatsAppNumber = (number) => {
  // Convert number to string if it's a number type
  const numStr = number?.toString() || "";
  // Remove all non-digit characters
  const digits = numStr.replace(/\D/g, "");
  return digits;
};

const validateWhatsAppNumber = (number) => {
  // Convert number to string if it's a number type
  const numStr = number?.toString() || "";
  // Remove all non-digit characters
  const digits = numStr.replace(/\D/g, "");
  return digits.length === 10;
};

// Add validation schema
const validationSchema = Yup.object().shape({
  // whatsappNumber: Yup.string()
  //   .matches(/^\d{10}$/, "Please enter a valid 10-digit number")
  //   .required("WhatsApp number is required"),
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  rating: Yup.number()
    .required("Please select a rating")
    .oneOf([2, 4, 6, 8, 10], "Please select a valid rating"),
  lowRatingReason: Yup.string().when("rating", {
    is: (rating) => rating && rating <= 6,
    then: () => Yup.string().required("Please select a reason for your rating"),
    otherwise: () => Yup.string(),
  }),
  otherReason: Yup.string().when(["lowRatingReason", "rating"], {
    is: (lowRatingReason, rating) =>
      rating && rating <= 6 && lowRatingReason === "Other",
    then: () => Yup.string().required("Please specify your reason"),
    otherwise: () => Yup.string(),
  }),
  aspects: Yup.array().of(Yup.string()),
  suggestions: Yup.string(),
});

const aspects = [
  { id: "content", label: "Content Quality", icon: AutoAwesomeIcon },
  { id: "presentation", label: "Presentation", icon: PresentationIcon },
  { id: "interaction", label: "Interaction", icon: GroupIcon },
  { id: "materials", label: "Materials Provided", icon: MenuBookIcon },
  { id: "clarity", label: "Clarity of Explanation", icon: LightbulbIcon },
  { id: "technical", label: "Technical Setup", icon: SettingsIcon },
  { id: "qa", label: "Q&A Session", icon: QuestionAnswerIcon },
  { id: "activities", label: "Activities", icon: ExtensionIcon },
];

const FeedbackForm = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openInvalidLinkDialog, setOpenInvalidLinkDialog] = useState(!searchParams.get("sessionid"));
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
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isSessionStarted, setIsSessionStarted] = useState(true);
  const [sessionImage, setSessionImage] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({
    topic: "",
    date: "",
    duration: "",
    sessionId: "",
  });
  const [emailTimeout, setEmailTimeout] = useState(null);

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Function to fetch user data by student ID
  const fetchUserDataById = async (studentId) => {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/appiDWCj01hUW5CtW/tblxRTVl1GCaKjuLU/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
          },
        },
      );
      const data = await response.json();
      if (data) {
        const userData = data.fields;
        setFormData({
          firstName: Array.isArray(userData.student_first_name)
            ? userData.student_first_name[0].replace(/"/g, "")
            : "",
          lastName: Array.isArray(userData.student_last_name)
            ? userData.student_last_name[0].replace(/"/g, "")
            : "",
          email: Array.isArray(userData.student_email_id)
            ? userData.student_email_id[0].replace(/"/g, "")
            : "",
          studentreg_id: [userData.record_id] || "",
          student_whatsapp_number: Array.isArray(
            userData.student_whatsapp_number,
          )
            ? userData.student_whatsapp_number[0].replace(/"/g, "")
            : "",
        });

        await formik.setValues({
          ...formik.values,
          firstName: Array.isArray(userData.student_first_name)
            ? userData.student_first_name[0].replace(/"/g, "")
            : "",
          lastName: Array.isArray(userData.student_last_name)
            ? userData.student_last_name[0].replace(/"/g, "")
            : "",
          email: Array.isArray(userData.student_email_id)
            ? userData.student_email_id[0].replace(/"/g, "")
            : "",
          whatsappNumber: Array.isArray(userData.student_whatsapp_number)
            ? userData.student_whatsapp_number[0].replace(/"/g, "")
            : "",
        });

        // Validate form after setting values
        await formik.validateForm();
        formik.setTouched({
          firstName: true,
          lastName: true,
          email: true,
          // whatsappNumber: true,
        });

        setIsFormEnabled(true);
        setError(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(true);
    }
  };

  const lowRatingOptions = [
    "Content not relevant",
    "Poor presentation",
    "Technical issues",
    "Lack of interaction",
    "Other",
  ];

  // Define formik
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      // whatsappNumber: "",
      rating: "",
      lowRatingReason: "",
      otherReason: "",
      aspects: [],
      suggestions: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        // const sessionId = searchParams.get("sessionid");
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
                    low_rating_reason:
                      values.rating <= 6
                        ? values.lowRatingReason === "Other"
                          ? values.otherReason
                          : values.lowRatingReason
                        : null,
                    aspects: values.aspects,
                  },
                },
              ],
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || "Failed to submit feedback",
          );
        }

        setOpenSuccessDialog(true);

        // Check for fromcertificate parameter and handle redirect
        const fromCertificate = searchParams.get("fromcertificate");
        const studentId = searchParams.get("studentid");

        setTimeout(() => {
          if (fromCertificate === "yes" && studentId) {
            // Preserve all existing URL parameters except 'fromcertificate'
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("fromcertificate");
            navigate(`/certificate-and-resource?${newParams.toString()}`);
          } else {
            navigate("/thank-you");
          }
        }, 2000);
      } catch (error) {
        console.error("Error submitting feedback:", error);
        setError(
          error.message || "Failed to submit feedback. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Add useEffect hooks after all function definitions
  useEffect(() => {
    const checkSessionTime = async () => {
      try {
        const sessionId = searchParams.get("sessionid");
        if (sessionId) {
          const sessionDetails = await getSessionDetailsAndResources(sessionId);
          const sessionDate = new Date(
            sessionDetails.fields.session_start_date,
          );
          setSessionStartTime(sessionDate);

          // Store session image if available
          if (sessionDetails.fields.session_details_image) {
            setSessionImage(sessionDetails.fields.session_details_image[0].url);
          }

          // Store session details
          setSessionDetails({
            topic: sessionDetails.fields.topic_name || "",
            date: sessionDetails.fields.session_start_date || "",
            duration: sessionDetails.fields.duration_minute || "",
            sessionId: sessionDetails.fields.session_id || "",
          });

          // Check if feedback is disabled for this session
          if (sessionDetails.fields.show_feedback === "no") {
            navigate("/not-started", {
              state: {
                sessionStartTime: sessionDetails.fields.session_start_date,
              },
            });
            return;
          }

          // Check if current time is before session start time
          const now = new Date();
          setIsSessionStarted(!isBefore(now, sessionDate));
        }
      } catch (error) {
        console.error("Error checking session time:", error);
      }
    };
    checkSessionTime();
  }, []);

  useEffect(() => {
    const studentId = searchParams.get("studentid");
    if (studentId) {
      fetchUserDataById(studentId);
    }
  }, []);

  useEffect(() => {
    if (rating) {
      formik.setFieldValue("rating", rating);
    }
  }, [rating]);

  useEffect(() => {
    if (lowRatingReason) {
      formik.setFieldValue("lowRatingReason", lowRatingReason);
    }
  }, [lowRatingReason]);

  useEffect(() => {
    if (otherReason) {
      formik.setFieldValue("otherReason", otherReason);
    }
  }, [otherReason]);

  // Early return if session hasn't started
  if (!isSessionStarted && sessionStartTime) {
    return <SessionNotStarted sessionStartTime={sessionStartTime} />;
  }

  // Function to fetch user data by Email
  const fetchUserDataByEmail = useCallback(
    async (email) => {
      if (!emailRegex.test(email)) {
        return;
      }

      try {
        const response = await fetch(
        `https://api.airtable.com/v0/appiDWCj01hUW5CtW/tblxRTVl1GCaKjuLU?filterByFormula=AND(%7Bstudent_email_id%7D%3D%22${email}%22%2C%7Bsession_id_pg%7D%3D%22${sessionDetails?.sessionId}%22)`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
            },
          },
        );
        const data = await response.json();
        if (data.records && data.records.length > 0) {
          const userData = data.records[0];
          // Clean and format the data
          const cleanData = {
            firstName: Array.isArray(userData.fields.student_first_name)
              ? userData.fields.student_first_name[0].replace(/"/g, "")
              : userData.fields.student_first_name || "",
            lastName: Array.isArray(userData.fields.student_last_name)
              ? userData.fields.student_last_name[0].replace(/"/g, "")
              : userData.fields.student_last_name || "",
            email: Array.isArray(userData.fields.student_email_id)
              ? userData.fields.student_email_id[0].replace(/"/g, "")
              : userData.fields.student_email_id || "",
            whatsappNumber: Array.isArray(
              userData.fields.student_whatsapp_number,
            )
              ? userData.fields.student_whatsapp_number[0].replace(/"/g, "")
              : userData.fields.student_whatsapp_number || "",
          };

          setFormData({
            firstName: cleanData.firstName,
            lastName: cleanData.lastName,
            email: cleanData.email,
            studentreg_id: [userData.id] || "",
            student_whatsapp_number: cleanData.whatsappNumber,
          });

          // Update formik values
          formik.setValues(
            {
              ...formik.values,
              firstName: cleanData.firstName,
              lastName: cleanData.lastName,
              email: cleanData.email,
              whatsappNumber: cleanData.whatsappNumber,
            },
            false,
          );

          setIsFormEnabled(true);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(true);
      }
    },
    [formik],
  );

  // Handle email input change
  const handleEmailChange = (e) => {
    const email = e.target.value;
    formik.handleChange(e); // Use formik's handleChange instead

    // Clear any existing timeout
    if (emailTimeout) {
      clearTimeout(emailTimeout);
    }

    // Set a new timeout to fetch data after user stops typing
    const newTimeout = setTimeout(() => {
      if (emailRegex.test(email)) {
        fetchUserDataByEmail(email);
      }
    }, 1000); // Wait 1 second after user stops typing

    setEmailTimeout(newTimeout);
  };

  const handleWhatsappChange = (e) => {
    // let number = e.target.value;
    // number = formatWhatsAppNumber(number);

    // formik.setFieldValue("whatsappNumber", number);

    // if (validateWhatsAppNumber(number)) {
    //   fetchUserData(number);
    // } else {
    //   setIsFormEnabled(false);
    //   setFormData((prev) => ({ ...prev, student_whatsapp_number: number }));
    // }
  };

  // Existing fetchUserData function remains unchanged
  // const fetchUserData = async (number) => {
  //   try {
  //     const response = await fetch(
  //       `https://api.airtable.com/v0/appiDWCj01hUW5CtW/tblxRTVl1GCaKjuLU/?filterByFormula=student_whatsapp_number=${number}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
  //         },
  //       },
  //     );
  //     const data = await response.json();
  //     if (data.records && data.records?.length > 0) {
  //       const userData = data.records[0].fields;

  //       setFormData({
  //         firstName: Array.isArray(userData.student_first_name)
  //           ? userData.student_first_name[0].replace(/"/g, "")
  //           : "",
  //         lastName: Array.isArray(userData.student_last_name)
  //           ? userData.student_last_name[0].replace(/"/g, "")
  //           : "",
  //         email: Array.isArray(userData.student_email_id)
  //           ? userData.student_email_id[0].replace(/"/g, "")
  //           : "",
  //         studentreg_id: [userData.record_id] || "",
  //         student_whatsapp_number: Array.isArray(
  //           userData.student_whatsapp_number,
  //         )
  //           ? userData.student_whatsapp_number[0].replace(/"/g, "")
  //           : number.toString(),
  //       });

  //       formik.setValues(
  //         {
  //           ...formik.values,
  //           whatsappNumber: Array.isArray(userData.student_whatsapp_number)
  //             ? userData.student_whatsapp_number[0].replace(/"/g, "")
  //             : number.toString(),
  //           firstName: Array.isArray(userData.student_first_name)
  //             ? userData.student_first_name[0].replace(/"/g, "")
  //             : "",
  //           lastName: Array.isArray(userData.student_last_name)
  //             ? userData.student_last_name[0].replace(/"/g, "")
  //             : "",
  //           email: Array.isArray(userData.student_email_id)
  //             ? userData.student_email_id[0].replace(/"/g, "")
  //             : "",
  //         },
  //         false,
  //       );

  //       setIsFormEnabled(true);
  //       setError(false);
  //     } else {
  //       setError(true);
  //       setIsFormEnabled(false);
  //       formik.setFieldValue("whatsappNumber", number);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     formik.setFieldValue("whatsappNumber", number);
  //   }
  // };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog
        open={openInvalidLinkDialog}
        onClose={() => navigate("/")}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: "0 25px 50px -12px rgba(255, 152, 0, 0.25)",
          },
        }}
      >
        <Box sx={{ textAlign: "center", p: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              bgcolor: "error.light",
              color: "error.main",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 0 0 rgba(211, 47, 47, 0.4)",
                },
                "70%": {
                  transform: "scale(1.05)",
                  boxShadow: "0 0 0 10px rgba(211, 47, 47, 0)",
                },
                "100%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 0 0 rgba(211, 47, 47, 0)",
                },
              },
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "error.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            Invalid Link
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "text.secondary",
              maxWidth: 300,
              mx: "auto",
              lineHeight: 1.5,
            }}
          >
            This feedback form link appears to be invalid. Please make sure you have the correct URL.
          </Typography>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
                bgcolor: "error.dark",
              },
            }}
          >
            Go Back
          </Button>
        </Box>
      </Dialog>

      <Grid
        container
        spacing={3}
        sx={{
          flexGrow: 1,
          alignItems: "stretch",
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
              // color: "white",
              color: sessionImage ? "black" : "white",
              cursor: "pointer",
              transition: "transform 0.2s",
              // "&:hover": {
              //   transform: "scale(1.02)",
              // },
              height: "100%",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 40px -10px rgba(99, 102, 241, 0.4)",
              backgroundImage: sessionImage
                ? `url(${sessionImage})`
                : `linear-gradient(135deg, 
                #6366F1 0%,
                #8B5CF6 70%,
                #D946EF 100%
              )`,
              backgroundSize: "cover",
              backgroundPosition: "center",

              "&::before": sessionImage
                ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: "blur(2px)",
                    // background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 20%)',
                    zIndex: 1,
                  }
                : {},
              "& > *": {
                position: "relative",
                zIndex: 2,
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
            {/* <Box sx={{ display: { xs: "block", md: "none" } }}>

              <Box sx={{ mb: 1, }}>
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
                <Box sx={{ mb: .5 ,p:2,mt:4}}>
                <SessionDetailsCard />
                </Box>
              </Box>
            </Box> */}

            {/* Desktop View - Full Content */}
            <Box>
              <Box sx={{ position: "relative", cursor: "default" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "1.5rem", md: "1.8rem" },
                  }}
                >
                  Your Feedback Matters !
                </Typography>

                {/* Session Details */}
                <Box
                  sx={{
                    mt: 3,
                    mb: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 2,
                    p: 2,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    <MenuBookIcon sx={{ fontSize: 20 }} />
                    {sessionDetails?.topic}
                  </Typography>
                  <SpeakerCard sessionId={sessionDetails?.sessionId}/>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 18 }} />
                    {sessionDetails.date
                      ? format(
                          new Date(sessionDetails.date),
                          "MMMM d, yyyy 'at' h:mm a",
                        )
                      : ""}
                  </Typography>

                  {/* <Typography
                    variant="subtitle1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: 500,
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 18 }} />
                    Duration: {sessionDetails.duration}
                  </Typography> */}
                </Box>

                {/* Features Section */}
                <Box sx={{ mb: 2, display: { xs: "none", md: "block" } }}>
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
                  {/* <FeatureBox
                    icon={EmojiEventsIcon}
                    title="Get Certificate"
                    description="Receive your participation certificate."
                  /> */}
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
        <Grid item xs={12} md={7} sx={{ display: "flex" }}>
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            sx={{
              borderRadius: { xs: 2.5, md: 3 },
              p: { xs: 2.5, md: 3 },
              background:
                "radial-gradient(ellipse at center, rgba(189, 189, 189, 0.15) 0%, transparent 70%)",
              backdropFilter: "blur(12px)",
              boxShadow: "1 10px 32px rgba(0, 0, 0, 0.05)",
              flex: 1,
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              },
              "& .MuiInputLabel-root": {
                color: "text.primary",
              },
              "& .MuiOutlinedInput-root": {
                color: "text.primary",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
              "& .MuiFormHelperText-root": {
                color: "text.secondary",
              },
            }}
          >
            <Typography
              variant="h7"
              gutterBottom
              sx={{
                mb: 1,
                color: "primary.main",
                fontWeight: 600,
                fontSize: { xs: "1.125rem", sm: "1.4rem" },
              }}
            >
              Share Your Experience
            </Typography>
            <Typography
              variant="caption"
              fontWeight={500}
              sx={{
                display: "block",
                mt: 0,
                mb: 3,
                color: "text.secondary",
              }}
            >
              Fill the form to get your certificate and resources
            </Typography>

            <Grid container spacing={2.5}>
              {/* Email Field - Moved to top */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  label="Email"
                  required
                  value={formik.values.email}
                  onChange={handleEmailChange}
                  onBlur={formik.handleBlur}
                  name="email"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    },
                  }}
                />
              </Grid>

              {/* First Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  required
                  disabled={!isFormEnabled}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  name="firstName"
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: isFormEnabled
                        ? "background.paper"
                        : "action.disabledBackground",
                    },
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
                  name="lastName"
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: isFormEnabled
                        ? "background.paper"
                        : "action.disabledBackground",
                    },
                  }}
                />
              </Grid>

              {/* WhatsApp Field */}
              <Grid item xs={12}>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    id="whatsapp-field"
                    fullWidth
                    size="small"
                    type="text"
                    label="WhatsApp Number"
                    placeholder="Your WhatsApp Mumber"
                    required
                    value={formik.values.whatsappNumber}
                    // onChange={handleWhatsappChange}
                    // error={
                    //   formik.touched.whatsappNumber &&
                    //   Boolean(formik.errors.whatsappNumber)
                    // }
                    // helperText={
                    //   formik.touched.whatsappNumber &&
                    //   formik.errors.whatsappNumber
                    // }
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      // pattern: "[0-9]*",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        pl: 0,
                        borderRadius: 2,
                        backgroundColor: "background.paper",
                        "& .MuiOutlinedInput-input": {
                          pl: 0.5,
                        },
                        "&.Mui-focused": {
                          backgroundColor: "primary.50",
                          "& fieldset": {
                            borderWidth: "1px",
                            borderColor: "primary.main",
                          },
                          "& .whatsapp-prefix": {
                            borderColor: "primary.main",
                            color: "primary.main",
                          },
                        },
                        "&.Mui-error": {
                          backgroundColor: "error.50",
                          "& .whatsapp-prefix": {
                            borderColor: "error.main",
                            color: "error.main",
                          },
                        },
                        "& fieldset": {
                          borderColor: "divider",
                        },
                        "&:hover fieldset": {
                          borderColor: "divider",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          className="whatsapp-prefix"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid",
                            borderColor: "divider",
                            pr: 1.5,
                            mr: 1.5,
                            pl: 1,
                            height: 32,
                            minWidth: "fit-content",
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <WhatsAppIcon
                            sx={{
                              fontSize: 18,
                              color: "primary.main",
                              mr: 0.75,
                              flexShrink: 0,
                            }}
                          />
                          {/* <Typography
                            component="span"
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "text.secondary",
                              userSelect: "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            +91
                          </Typography> */}
                        </Box>
                      ),
                    }}
                  />
                  {/* {formik.values.whatsappNumber.length > 0 &&
                    validateWhatsAppNumber(formik.values.whatsappNumber) && (
                      <Box
                        sx={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "success.main",
                          boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.2)",
                        }}
                      />
                    )} */}
                </Box>
              </Grid>
              {/* Rating Field */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  How would you rate your experience?
                  <Box
                    component="span"
                    sx={{
                      color: "error.main",
                      fontSize: "1rem",
                      lineHeight: 1,
                    }}
                  >
                    *
                  </Box>
                </Typography>
                <EmojiRating
                  value={formik.values.rating}
                  onChange={(newValue) => {
                    formik.setFieldValue("rating", newValue);
                    formik.setFieldTouched("rating", true, false);
                    // Clear low rating fields if rating becomes high
                    if (newValue > 6) {
                      formik.setFieldValue("lowRatingReason", "");
                      formik.setFieldValue("otherReason", "");
                      // Also clear touched state for these fields
                      formik.setFieldTouched("lowRatingReason", false);
                      formik.setFieldTouched("otherReason", false);
                    }
                    // Validate form after rating change
                    formik.validateForm().then(() => {
                      formik.setTouched({
                        ...formik.touched,
                        rating: true,
                      });
                    });
                  }}
                  error={false}
                  sx={{
                    "& .MuiRating-root": {
                      gap: 1,
                    },
                  }}
                />
              </Grid>

              {/* Low Rating Reason Dropdown */}
              {formik.values.rating && formik.values.rating <= 6 && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "primary.main" }}
                  >
                    Could you please share why?{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "error.main",
                        fontSize: "1rem",
                        lineHeight: 1,
                      }}
                    >
                      *
                    </Box>
                  </Typography>

                  <FormControl
                    fullWidth
                    size="small"
                    error={
                      formik.touched.lowRatingReason &&
                      Boolean(formik.errors.lowRatingReason)
                    }
                    sx={{
                      mt: { xs: 1, sm: 2 },
                    }}
                  >
                    <InputLabel id="low-rating-reason-label">
                      Select Reason
                    </InputLabel>
                    <Select
                      labelId="low-rating-reason-label"
                      id="low-rating-reason"
                      name="lowRatingReason"
                      onBlur={formik.handleBlur}
                      value={formik.values.lowRatingReason}
                      label="Select Reason"
                      onChange={(e) => {
                        formik.setFieldValue("lowRatingReason", e.target.value);
                        formik.setFieldTouched("lowRatingReason", true, false);
                        if (e.target.value !== "Other") {
                          formik.setFieldValue("otherReason", "");
                          formik.setFieldTouched("otherReason", false);
                        }
                        // Validate form immediately after changing reason
                        formik.validateForm().then(() => {
                          formik.setTouched({
                            ...formik.touched,
                            lowRatingReason: true,
                          });
                        });
                      }}
                      sx={{ mb: { xs: 0.5, sm: 1 } }}
                    >
                      {lowRatingOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.lowRatingReason &&
                      formik.errors.lowRatingReason && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ mt: { xs: 0.5, sm: 1 }, display: "block" }}
                        >
                          {formik.errors.lowRatingReason}
                        </Typography>
                      )}
                  </FormControl>

                  {/* Other Reason TextField */}
                  {formik.values.lowRatingReason === "Other" && (
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      name="otherReason"
                      onBlur={formik.handleBlur}
                      label="Please specify the reason"
                      value={formik.values.otherReason}
                      onChange={(e) => {
                        formik.setFieldValue("otherReason", e.target.value);
                        formik.setFieldTouched("otherReason", true, false);
                      }}
                      error={
                        formik.touched.otherReason &&
                        Boolean(formik.errors.otherReason)
                      }
                      helperText={
                        formik.touched.otherReason && formik.errors.otherReason
                      }
                      sx={{
                        mt: { xs: 1, sm: 2 },
                        mb: { xs: 1.5, sm: 0 },
                        "& .MuiFormHelperText-root": {
                          mt: { xs: 0.5, sm: 1 },
                        },
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
                  sx={{ color: "primary.main", mt: 0, pt: 0 }}
                >
                  What aspects did you enjoy? (Optional)
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1.5,
                  }}
                >
                  {aspects.map((aspect) => {
                    const Icon = aspect.icon;
                    const isSelected = formik.values.aspects.includes(
                      aspect.label,
                    );

                    return (
                      <Chip
                        key={aspect.id}
                        label={aspect.label}
                        icon={
                          <Icon
                            sx={{
                              fontSize: 18,
                              color: isSelected ? "inherit" : "primary.main",
                            }}
                          />
                        }
                        onClick={() => {
                          const newAspects = formik.values.aspects.includes(
                            aspect.label,
                          )
                            ? formik.values.aspects.filter(
                                (item) => item !== aspect.label,
                              )
                            : [...formik.values.aspects, aspect.label];
                          formik.setFieldValue("aspects", newAspects);
                        }}
                        variant={isSelected ? "filled" : "outlined"}
                        color={isSelected ? "primary" : "default"}
                        sx={{
                          borderRadius: 2,
                          py: 2.5,
                          px: 1,
                          "& .MuiChip-label": {
                            px: 1,
                          },
                          "& .MuiChip-icon": {
                            ml: 1,
                          },
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            bgcolor: isSelected ? "primary.main" : "primary.50",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 8px rgba(99, 102, 241, 0.2)",
                          },
                          ...(isSelected && {
                            boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)",
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
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    },
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={
                    !isFormEnabled ||
                    submitting ||
                    !formik.isValid ||
                    formik.isSubmitting
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
                <Typography
                  variant="caption"
                  align="center"
                  sx={{
                    display: "block",
                    mt: 1,
                    color: "text.secondary",
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
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 3 }}>Success!</DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography>
            Your feedback has been submitted successfully.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}></DialogActions>
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
            boxShadow: "0 25px 50px -12px rgba(255, 152, 0, 0.25)",
          },
        }}
      >
        <Box sx={{ textAlign: "center", p: 2 }}>
          {/* Error Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              bgcolor: "warning.light",
              color: "warning.main",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 0 0 rgba(255, 152, 0, 0.4)",
                },
                "70%": {
                  transform: "scale(1.05)",
                  boxShadow: "0 0 0 10px rgba(255, 152, 0, 0)",
                },
                "100%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 0 0 rgba(255, 152, 0, 0)",
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
              color: "warning.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              color: "text.secondary",
              maxWidth: 300,
              mx: "auto",
              lineHeight: 1.5,
            }}
          >
            {typeof error === "string"
              ? error
              : "Looks like you're not registered. Please register for upcoming sessions!"}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              onClick={() => setError(null)}
              variant="outlined"
              color="warning"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  bgcolor: "warning.50",
                },
              }}
            >
              Close
            </Button>
            {/* <Button
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
            </Button> */}
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default FeedbackForm;
