const request = require('supertest');
const express = require('express');
const multer = require('multer');
const router = require('../../routes'); // Import your routes
const logQueue = require('../../queue'); // Mock this

// Mock multer
jest.mock('multer', () => () => ({
  single: jest.fn(() => (req, res, next) => {
    req.file = { path: 'uploads/test.log', filename: '123' };
    next();
  }),
}));

// Mock BullMQ queue
jest.mock('../../queue', () => ({
  add: jest.fn().mockResolvedValue({ id: '123' }),
}));

const app = express();
app.use(express.json());
app.use(router);

describe('API Routes', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('POST /upload-logs - should upload a log file and return a job ID', async () => {
    const response = await request(app)
      .post('/upload-logs')
      .attach('logFile', Buffer.from('test log content'), 'test.log'); // Simulate file upload

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ jobId: '123' });
    expect(logQueue.add).toHaveBeenCalledWith('process-log', {
      filePath: 'uploads/test.log',
      fileId: '123',
    });
  });
});
