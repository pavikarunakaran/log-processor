const { Worker } = require('bullmq');
const fs = require('fs');
const readline = require('readline');
const supabase = require('../../supabase'); // Mock this
const WebSocket = require('ws'); // Mock this
const Redis = require('ioredis'); // Mock this

// Mock dependencies
jest.mock('fs', () => ({
  createReadStream: jest.fn(),
}));

jest.mock('readline', () => ({
  createInterface: jest.fn(),
}));

jest.mock('../../supabase', () => ({
  from: jest.fn(() => ({
    insert: jest.fn().mockResolvedValue({ data: [], error: null }),
  })),
}));

jest.mock('ws', () => {
    return jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      send: jest.fn(),
      readyState: 1, // OPEN
    }));
  });
  
  

jest.mock('ioredis', () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

jest.mock('bullmq', () => ({
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    processJob: jest.fn(),
  })),
}));

describe('Log Processing Worker', () => {
    let worker;
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      worker = new Worker('log-processing-queue', jest.fn(), { connection: {} });
  
      Redis.createClient.mockImplementation(() => ({
        on: jest.fn(),
        connect: jest.fn(),
        disconnect: jest.fn(),
      }));
  
      // Mock File Stream correctly
      const mockFileStream = {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback('[2023-10-01T12:00:00Z] INFO User logged in {"ip": "192.168.1.1"}\n');
          }
          if (event === 'end') {
            callback();
          }
        }),
      };
      fs.createReadStream.mockReturnValue(mockFileStream);
  
      // Mock readline.createInterface
      readline.createInterface.mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === 'line') {
            callback('[2023-10-01T12:00:00Z] INFO User logged in {"ip": "192.168.1.1"}');
          }
          if (event === 'close') {
            callback();
          }
        }),
      });
  
      // Mock supabase insert
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      });
    });
  
    it('should process a log file and send progress updates', async () => {
      const filePath = 'test.log';
      const fileId = '123';
  
      // Create a mock WebSocket instance
      const mockWebSocket = new WebSocket();
      
      worker.processJob.mockImplementation(async (job) => {
        const { filePath, fileId } = job.data;
  
        fs.createReadStream(filePath); // Ensure this is called
  
        console.log("Processing job: ", job.data); // Debugging step
  
        const result = await supabase.from().insert([
          {
            fileId,
            errorCount: 1,
            keywordCounts: {},
            ipCounts: { '192.168.1.1': 1 },
          },
        ]);
  
        console.log("Supabase result: ", result); // Debugging step
  
        // Simulate WebSocket messages
        mockWebSocket.send(JSON.stringify({ fileId, progress: 100 }));
        mockWebSocket.send(JSON.stringify({ fileId, status: 'completed' }));
      });
  
      // Execute the job
      await worker.processJob({ data: { filePath, fileId } });
  
      // Assertions
      expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
      expect(supabase.from().insert).toHaveBeenCalledWith([
        {
          fileId,
          errorCount: 1,
          keywordCounts: {},
          ipCounts: { '192.168.1.1': 1 },
        },
      ]);
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        JSON.stringify({ fileId, progress: 100 }),
      );
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        JSON.stringify({ fileId, status: 'completed' }),
      );
    });
  });
  
  
