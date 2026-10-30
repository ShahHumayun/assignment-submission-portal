import express from 'express';
import cors from 'cors';
import { validateSubmission } from './validation.js';

export function createApp(store) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
  res.json({ message: 'Assignment Submission Portal API', docs: '/api/health' });
});

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/submissions', (req, res) => {
    res.json(store.all());
  });

  app.post('/api/submissions', (req, res) => {
    const { valid, errors, data } = validateSubmission(req.body);
    if (!valid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    const saved = store.add(data);
    res.status(201).json(saved);
  });

  return app;
}