import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Link,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackIcon from "@mui/icons-material/Feedback";
import BuildIcon from "@mui/icons-material/Build";
// import SessionDetailsCard from "../SessionDetailsCard/SessionDetailsCard";
import { useState, useEffect } from "react";
import {
  getSessionDetailsAndResources,
  getSessionDetailsAndToolsResources,
} from "../../utils/airtable";
import PropTypes from "prop-types";
import SpeakerCard from "../SessionDetailsCard/SpeakerCard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format } from "date-fns";
import { trackEvent, EVENTS } from "../../utils/amplitude";

const MenuCard = ({ title, icon: Icon, onClick, sx = {} }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: "pointer",
      height: "100%",
      transition: "all 0.3s ease",
      borderRadius: 3,
      maxWidth: { xs: "100%", md: "500px" },
      mx: "auto",
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        "& .hover-gradient": {
          opacity: 1,
        },
        "& .card-icon": {
          transform: "scale(1.1) rotate(-5deg)",
          background: "linear-gradient(135deg, primary.main, secondary.main)",
        },
        "& .arrow-icon": {
          transform: "translateX(4px)",
          opacity: 1,
        },
      },
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      ...sx,
    }}
  >
    {/* Hover Gradient Effect */}
    <Box
      className="hover-gradient"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(217, 70, 239, 0.08) 100%)",
        opacity: 0,
        transition: "opacity 0.3s ease",
        zIndex: 0,
      }}
    />

    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: { xs: 3, md: 4 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <Box
        className="card-icon"
        sx={{
          mb: 2,
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366F1, #D946EF)",
          color: "white",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
        }}
      >
        <Icon
          sx={{
            fontSize: 28,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        />
      </Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          fontSize: "1.125rem",
          mb: 2,
          background: "linear-gradient(135deg, #6366F1, #D946EF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
      {/* <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        {description}
      </Typography> */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "primary.main",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        Share Now
        <Box
          className="arrow-icon"
          component="span"
          sx={{
            display: "inline-flex",
            transition: "all 0.3s ease",
            opacity: 0.7,
          }}
        >
          →
        </Box>
      </Box>
    </CardContent>
  </Card>
);

MenuCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
  sx: PropTypes.object,
};

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Add UTM parameter extraction
  const utmSource = searchParams.get("utm_source") || "";
  const utmMedium = searchParams.get("utm_medium") || "";
  const utmCampaign = searchParams.get("utm_campaign") || "";

  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toolsData, setToolsData] = useState(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const sessionId = searchParams.get("sessionid");
        if (!sessionId) {
          setError("No session ID provided");
          setLoading(false);
          return;
        }

        // Fetch session details
        const response = await getSessionDetailsAndResources(sessionId);
        setSessionDetails(response.fields);

        // Track page view after session details are loaded
        trackEvent(EVENTS.MENU_PAGE_VIEWED, {
          sessionId: response.fields?.session_id,
          sessionDate: response.fields?.session_start_date,
          topicName: response.fields?.topic_name,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign
        });

        try {
          const toolsResponse = await getSessionDetailsAndToolsResources(response.fields?.session_id);
          // Filter for tools that are shown
          const tools = toolsResponse.filter(
            record => record.fields.type === "Tool" && record.fields.show === "Yes"
          );
          setToolsData(tools);
        } catch (toolsErr) {
          console.error("Error fetching tools data:", toolsErr);
          setError("Failed to fetch tools data");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching session details:", err);
        setError("Failed to fetch session details");
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [utmSource, utmMedium, utmCampaign]); // Only re-run if UTM parameters change

  const navigateWithParams = (path) => {
    // Get all current URL parameters
    const sessionId = searchParams.get("sessionid");
    const studentId = searchParams.get("studentid");
    const speakerId = searchParams.get("speakerid");

    // Track click events based on path with UTM parameters
    if (path === "/feedback") {
      trackEvent(EVENTS.FEEDBACK_LINK_CLICKED, { 
        sessionId: sessionDetails?.session_id,
        sessionDate: sessionDetails?.session_start_date,
        topicName: sessionDetails?.topic_name,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign
      });
    }

    // Build new query string with all parameters
    const queryParams = new URLSearchParams();
    if (sessionId) queryParams.append("sessionid", sessionId);
    if (studentId) queryParams.append("studentid", studentId);
    if (speakerId) queryParams.append("speakerid", speakerId);
    if (utmSource) queryParams.append("utm_source", utmSource);
    if (utmMedium) queryParams.append("utm_medium", utmMedium);
    if (utmCampaign) queryParams.append("utm_campaign", utmCampaign);

    // Navigate with all parameters
    const queryString = queryParams.toString();
    navigate(`${path}${queryString ? `?${queryString}` : ""}`);
  };

  // Add tracking for tool clicks
  const handleToolClick = (tool) => {
    // Track tool click with UTM parameters and session data
    trackEvent(EVENTS.TOOL_CLICKED, {
      toolName: tool.fields.name,
      toolType: tool.fields.type,
      toolLink: tool.fields.link,
      sessionId: sessionDetails?.session_id,
      sessionDate: sessionDetails?.session_start_date,
      topicName: sessionDetails?.topic_name,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography>Loading session details...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 0, md: 6 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "700px" },
          mx: "1",
        }}
      >
        <Box
          sx={{
            mt: 1,
            mb: 2,
            backgroundColor: "rgba(80, 34, 158, 0.1)",
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
              gap: 2,
              mb: 1,
              fontWeight: 500,
            }}
          >
            <MenuBookIcon sx={{ fontSize: 20 }} />
            {sessionDetails?.topic_name}
          </Typography>
          <SpeakerCard sessionId={sessionDetails?.session_id} />
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
            {sessionDetails?.session_start_date
              ? format(
                  new Date(sessionDetails?.session_start_date),
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

  

        <Grid
          container
          spacing={2}
          sx={{
            maxWidth: { xs: "100%", md: "700px" },
            // mx: "auto",
            p:0,
            mt: 1
          }}
        >
          {/* Feedback Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                textAlign: "center",
                background: "linear-gradient(135deg, #6366F1, #D946EF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600
              }}
            >
              Share Your Feedback
            </Typography>
            <Card
              onClick={() => navigateWithParams("/feedback")}
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  "& .hover-gradient": {
                    opacity: 1,
                  },
                  "& .card-icon": {
                    transform: "scale(1.1) rotate(-5deg)",
                    background: "linear-gradient(135deg, #6366F1, #D946EF)",
                  }
                },
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "#fff"
              }}
            >
              {/* Hover Gradient Effect */}
              <Box
                className="hover-gradient"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(217, 70, 239, 0.08) 100%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  zIndex: 0,
                }}
              />
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  p: 3,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box
                  className="card-icon"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #6366F1, #D946EF)",
                    color: "white",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <FeedbackIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      mb: 0.5
                    }}
                  >
                    Share Feedback
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Help us enhance future sessions with your valuable insights
                  </Typography>
                </Box>
                <Box
                  className="arrow-icon"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "primary.main",
                    transition: "all 0.3s ease",
                    opacity: 0.7,
                    "&:hover": {
                      transform: "translateX(4px)",
                      opacity: 1
                    }
                  }}
                >
                  →
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Tools Section */}
          {toolsData?.length > 0 && (
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  textAlign: "center",
                  background: "linear-gradient(135deg, #6366F1, #D946EF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600
                }}
              >
                Available Tools
              </Typography>
              <Grid container spacing={2}>
                {toolsData?.map((tool) => (
                  <Grid item xs={12} key={tool.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        borderRadius: 3,
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                          "& .hover-gradient": {
                            opacity: 1,
                          },
                          "& .card-icon": {
                            transform: "scale(1.1) rotate(-5deg)",
                            background: "linear-gradient(135deg, #6366F1, #D946EF)",
                          }
                        },
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        background: "#fff"
                      }}
                    >
                      {/* Hover Gradient Effect */}
                      <Box
                        className="hover-gradient"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(217, 70, 239, 0.08) 100%)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          zIndex: 0,
                        }}
                      />
                      <Link
                        href={tool.fields.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleToolClick(tool)}
                        sx={{ 
                          textDecoration: "none",
                          display: "block",
                          "&:hover": {
                            textDecoration: "none"
                          }
                        }}
                      >
                        <CardContent
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            p: 3,
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <Box
                            className="card-icon"
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "linear-gradient(135deg, #6366F1, #D946EF)",
                              color: "white",
                              transition: "all 0.3s ease",
                              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                            }}
                          >
                            <BuildIcon sx={{ fontSize: 28 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "text.primary",
                                fontWeight: 600,
                                fontSize: "1.1rem",
                                mb: 0.5
                              }}
                            >
                              {tool.fields.name}
                            </Typography>
                            {tool.fields.sub_type && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {tool.fields.sub_type.replace(/_/g, " ")}
                              </Typography>
                            )}
                          </Box>
                          <Box
                            className="arrow-icon"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "primary.main",
                              transition: "all 0.3s ease",
                              opacity: 0.7,
                              "&:hover": {
                                transform: "translateX(4px)",
                                opacity: 1
                              }
                            }}
                          >
                            →
                          </Box>
                        </CardContent>
                      </Link>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>

        <Box sx={{ 
          mt: 4, 
          textAlign: "center",
          maxWidth: "400px",
          mx: "auto",
        }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ opacity: 0.7 }}
          >
            Your feedback helps us create better learning experiences
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Menu;
