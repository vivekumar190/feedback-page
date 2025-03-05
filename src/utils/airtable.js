import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSessionDetailsAndResources = async (sessionId) => {
  try {
    const response = await api.get(`/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session details and resources:', error);
    throw error;
  }
};

export const getUserDetails = async (studentId) => {
  try {
    const response = await api.get(`/user/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const getSpeakerDetails = async (sessionId) => {
  try {
    const response = await api.get(`/speaker/${sessionId}`);
    return response?.data;
  } catch (error) {
    console.error('Error fetching speaker details:', error);
    throw error;
  }
};

export const getSessionResources = async (sessionId) => {
  try {
    const response = await api.get(`/resources/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const getSessionDetailsAndToolsResources = async (sessionId) => {
  try {
    const response = await api.get(`/session-tools/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session details and tools resources:', error);
    throw error;
  }
}; 