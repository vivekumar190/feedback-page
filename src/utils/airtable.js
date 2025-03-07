import axios from 'axios';

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const SESSION_TABLE_ID = 'tblgUfc6jVKd57W7T';
const STUDENT_TABLE_ID = 'tblxRTVl1GCaKjuLU';
const SESSION_DETAILS_TABLE_ID = 'tblgUfc6jVKd57W7T';
const airtableApi = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const getSessionDetailsAndResources = async (sessionId) => {
  try {
    const response = await airtableApi.get(`/${SESSION_TABLE_ID}/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session details and resources:', error);
    throw error;
  }
};

export const getUserDetails = async (studentId) => {
  try {
    const response = await airtableApi.get(`/${STUDENT_TABLE_ID}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};


export const getSpeakerDetails = async (sessionId) => {
  try {
    const response = await airtableApi.get(`/${SESSION_DETAILS_TABLE_ID}/?filterByFormula=AND(%7Bsession_id%7D%3D%22${sessionId}%22%2C%7Btype%7D%3D%22Speaker%22)`);
    return response?.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const getSessionResources = async (sessionId) => {
  try {
    const response = await airtableApi.get(`/${SESSION_TABLE_ID}`, {
      params: {
        filterByFormula: `{session_id}='${sessionId}'`,
        view: 'Grid view',
      },
    });
    return response.data.records;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const getSessionDetailsAndToolsResources = async (sessionId) => {
  try {
    const response = await airtableApi.get(`/${SESSION_DETAILS_TABLE_ID}?filterByFormula=${encodeURIComponent(`{session_id_pg}="${sessionId}"`)}`, {
    
    });
    return response.data.records;
  } catch (error) {
    console.error('Error fetching session details and tools resources:', error);
    throw error;
  }
};

export const getUserDataByEmail = async (email, sessionId) => {
  try {
    const response = await airtableApi.get(`/${STUDENT_TABLE_ID}?filterByFormula=${encodeURIComponent(`AND({student_email_id}="${email}",{session_id_pg}="${sessionId}")`)}`);
    return response.data.records;
  } catch (error) {
    console.error('Error fetching user data by email:', error);
    throw error;
  }
};

export const getUserDataById = async (studentId) => {
  try {
    const response = await airtableApi.get(`/${STUDENT_TABLE_ID}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data by ID:', error);
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await airtableApi.post('/tblVK77VaisYt94Ne', {
      records: [
        {
          fields: {
            student_registration_id: feedbackData.studentreg_id,
            feedback: feedbackData.suggestions,
            rating: feedbackData.rating,
            low_rating_reason: feedbackData.rating <= 6
              ? feedbackData.lowRatingReason === "Other"
                ? feedbackData.otherReason
                : feedbackData.lowRatingReason
              : null,
            aspects: feedbackData.aspects,
          },
        },
      ],
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}; 