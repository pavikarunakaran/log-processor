const { Worker } = require('bullmq');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Add this line at the top of your file
const supabase = require('./supabase'); // Supabase client setup
const WebSocket = require('ws'); // Import WebSocket

const Redis = require('ioredis'); // Use ioredis instead of redis

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null
});
console.log('Worker is starting...');
// WebSocket client setup
const ws = new WebSocket('ws://websocket:8080'); // Connect to WebSocket server

ws.on('open', () => {
  console.log('WebSocket connection established');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});

const worker = new Worker('log-processing-queue', async (job) => {
  console.log("Holaaaa")
  const { filePath, fileId } = job.data;
  let message= JSON.stringify({ fileId, progress:0 })
  ws.send(message);
  message = JSON.stringify({ fileId, status: 'started' });
  ws.send(message);

  console.log('File path:', filePath);

// Check if file exists before attempting to read
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('File does not exist:', err);
  } else {
    console.log('File exists, proceeding with reading.');
  }
});

const fileStream = fs.createReadStream(filePath);

fileStream.on('open', () => {
  console.log('File opened successfully.');
});

fileStream.on('error', (err) => {
  console.error('Error opening file:', err);
});

const rl = readline.createInterface({
  input: fileStream,
  output: process.stdout,  // Optional: You can redirect to process.stdout to visualize
  terminal: false
});


  // const fileStream = fs.createReadStream(filePath);
  // fileStream.on('error', (err) => {
  //   console.error('Error reading file:', err);
  // });
  // const rl = readline.createInterface({ input: fileStream });

  let errorCount = 0;
  const keywordCounts = {};
  const ipCounts = {};
  

  const regex = /\[(.*?)\] (\w+) ([^\{]+) (\{.*\})?/;

  let lineCount = 0;
  let totalLines = 0;

  // Count total lines in the file
  const countStream = fs.createReadStream(filePath);
  const countRl = readline.createInterface({ input: countStream });
  countRl.on('line', () => totalLines++);
  countRl.on('close', () => {
    console.log('Total lines:', totalLines);
  });

  rl.on('line', (line) => {
      console.log('Line:', line);
      const match = line.match(regex);
      if (match) {
          const [, timestamp, level, message, payload] = match;
          const jsonPayload = payload ? JSON.parse(payload) : {};
          console.log('match', match);
          console.log('message:', message);
          console.log('payload:', jsonPayload);
      // Track errors
      if (level === 'ERROR') errorCount++;

      // Track keywords (from .env)
      console.log('Keywords:', process.env.KEYWORDS);
      process.env.KEYWORDS.split(',').forEach((keyword) => {
        if (level.includes(keyword)) {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        }
      });

      // Track IPs
      if (jsonPayload.ip) {
        ipCounts[jsonPayload.ip] = (ipCounts[jsonPayload.ip] || 0) + 1;
      }
    }
    // Calculate progress
    lineCount++;
    const progress = totalLines > 0 ? Math.min(100, Math.floor((lineCount / totalLines) * 100)) : 0;
    console.log('Progress:', progress);

    // Broadcast progress to WebSocket
    if (ws.readyState === WebSocket.OPEN) {
      console.log('Data is sent to ws')
      const message= JSON.stringify({ fileId, progress })
      console.log('Sending to WebSocket:', message); // Check if this is a string
      ws.send(message);
    }
  });

  rl.on('close', async () => {
    // Save results to Supabase
    console.log('File reading complete.');
    // Save results to the database
    const { data, error } = await supabase.from('log_stats').insert([
      { fileId, errorCount, keywordCounts, ipCounts },
    ]);
    
    if (error) {
      console.error('Error saving to Supabase:', error);
    } else {
      console.log('Data saved to Supabase:', data);
    }

     // Broadcast job completion to WebSocket
     if (ws.readyState === WebSocket.OPEN) {
      console.log('Data is sent to ws')
      const message = JSON.stringify({ fileId, status: 'completed' });
      ws.send(message);
    }

     // Only mark as completed if it's not already done
     const jobStatus = await job.getState(); // Check the current job state
     if (jobStatus !== 'completed' && jobStatus !== 'failed') {
       await job.moveToCompleted('processed', true);
       console.log('Job completed and data saved to Supabase.');
     } else {
       console.log(`Job ${job.id} is already ${jobStatus}.`);
     }
  });
},
{ connection: redisClient } 
);

module.exports = worker;