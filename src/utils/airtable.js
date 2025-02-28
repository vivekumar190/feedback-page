import axios from 'axios';

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const SESSION_TABLE_ID = 'tblgUfc6jVKd57W7T';
const STUDENT_TABLE_ID = 'tblxRTVl1GCaKjuLU';

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