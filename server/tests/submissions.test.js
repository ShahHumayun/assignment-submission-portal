import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createStore } from '../src/store.js';

const validPayload = {
  name: 'Shah Humayun',
  registrationNumber: 'FA22-BCS-000',
  assignmentTitle: 'DevOps Lab Mid',
  submissionUrl: 'https://github.com/example/repo',
};

describe('Assignment submission API', () => {
  let app;

  beforeEach(() => {
    app = createApp(createStore());
  });

  it('saves a submission with complete details and a valid URL', async () => {
    const res = await request(app).post('/api/submissions').send(validPayload);
    expect(res.status).toBe(201);

    const list = await request(app).get('/api/submissions');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).toMatchObject(validPayload);
  });

  it('rejects a submission with a missing registration number', async () => {
    const { registrationNumber, ...payload } = validPayload;
    const res = await request(app).post('/api/submissions').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors.registrationNumber).toMatch(/required/i);
  });

  it('rejects an invalid submission URL and does not save it', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({ ...validPayload, submissionUrl: 'not-a-valid-url' });

    expect(res.status).toBe(400);
    expect(res.body.errors.submissionUrl).toBeDefined();

    const list = await request(app).get('/api/submissions');
    expect(list.body).toHaveLength(0);
  });
});