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
    const { question, profile } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'A valid question string is required.' });
    }
    const result = await generateRAGAnswer(question.trim(), profile);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/recommendations', (req, res) => {
  const department = String(req.query.department || '').toLowerCase();
  const interest = String(req.query.interest || '').toLowerCase();
  const hay = (item) => JSON.stringify(item).toLowerCase();

  const events = campusKnowledge.events.filter((e) => {
    const s = hay(e);
    const matchDept = !department || s.includes(department);
    const matchInterest = !interest || s.includes(interest);
    return matchDept && matchInterest;
  }).slice(0, 4);

  const notices = campusKnowledge.notices.slice(0, 3);
  const academic = campusKnowledge.academic.filter((a) => {
    const s = hay(a);
    return !department || s.includes(department) || s.includes(interest);
  }).slice(0, 3);

  const services = campusKnowledge.services.slice(0, 3);
  const faculty = campusKnowledge.faculty.filter((f) => hay(f).includes(department)).slice(0, 3);

  res.json({
    events: events.length ? events : campusKnowledge.events.slice(0, 3),
    notices,
    academic: academic.length ? academic : campusKnowledge.academic.slice(0, 3),
    services,
    faculty: faculty.length ? faculty : campusKnowledge.faculty.slice(0, 2)
  });
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
