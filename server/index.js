import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create Airtable API instance
const airtableApi = axios.create({
  baseURL: `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`,
  headers: {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Proxy routes
app.get('/api/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const response = await airtableApi.get(`/tblgUfc6jVKd57W7T/${sessionId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ error: 'Failed to fetch session details' });
  }
});

app.get('/api/user/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const response = await airtableApi.get(`/tblxRTVl1GCaKjuLU/${studentId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

app.get('/api/speaker/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const response = await airtableApi.get(`/tblgUfc6jVKd57W7T/?filterByFormula=AND(%7Bsession_id%7D%3D%22${sessionId}%22%2C%7Btype%7D%3D%22Speaker%22)`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching speaker details:', error);
    res.status(500).json({ error: 'Failed to fetch speaker details' });
  }
});

app.get('/api/resources/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const response = await airtableApi.get(`/tblgUfc6jVKd57W7T`, {
      params: {
        filterByFormula: `{session_id}='${sessionId}'`,
        view: 'Grid view',
      },
    });
    res.json(response.data.records);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

app.get('/api/session-tools/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const response = await airtableApi.get(`/tblgUfc6jVKd57W7T?filterByFormula=${encodeURIComponent(`{session_id_pg}="${sessionId}"`)}`, {});
    res.json(response.data.records);
  } catch (error) {
    console.error('Error fetching session tools:', error);
    res.status(500).json({ error: 'Failed to fetch session tools' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 