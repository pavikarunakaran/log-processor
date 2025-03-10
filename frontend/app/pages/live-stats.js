import { WebSocketServer } from 'ws';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Create a WebSocket server
    const wss = new WebSocketServer({ noServer: true });

    // Handle WebSocket connections
    wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (message) => {
        console.log('Received:', message);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    // Upgrade the HTTP request to a WebSocket connection
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, req);
    });

    res.status(200).end();
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
