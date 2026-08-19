import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateRAGAnswer, campusKnowledge } from './ragEngine.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', university: 'GM University', timestamp: new Date().toISOString() });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'A valid question string is required.' });
    }
    const result = await generateRAGAnswer(question.trim());
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const category = (req.query.category || 'all').toLowerCase();

  const allRecords = [
    ...campusKnowledge.departments.map(i => ({ ...i, type: 'Department' })),
    ...campusKnowledge.faculty.map(i => ({ ...i, type: 'Faculty' })),
    ...campusKnowledge.facilities.map(i => ({ ...i, type: 'Facility' })),
    ...campusKnowledge.events.map(i => ({ ...i, type: 'Event' })),
    ...campusKnowledge.notices.map(i => ({ ...i, type: 'Notice' })),
    ...campusKnowledge.services.map(i => ({ ...i, type: 'Student Service' })),
    ...campusKnowledge.academic.map(i => ({ ...i, type: 'Academic Resource' }))
  ];

  let filtered = allRecords;
  if (category !== 'all') filtered = filtered.filter(item => item.type.toLowerCase().includes(category));
  if (query) filtered = filtered.filter(item => JSON.stringify(item).toLowerCase().includes(query));

  res.json({ total: filtered.length, results: filtered });
});

app.get('/api/events', (req, res) => res.json(campusKnowledge.events));
app.get('/api/notices', (req, res) => res.json(campusKnowledge.notices));
app.get('/api/student-services', (req, res) => res.json(campusKnowledge.services));
app.get('/api/academic-resources', (req, res) => res.json(campusKnowledge.academic));

app.listen(PORT, () => {
  console.log('🚀 GM Smart Campus Assistant Backend Active on Port ' + PORT);
});
