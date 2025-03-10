const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
 
  ws.on('message', (message) => {
     // Convert Buffer to string (if necessary)
  const messageString = message.toString(); // Ensure the message is a string
  console.log('Message as string:', messageString);
    console.log('Received:', message);
     // Broadcast the message to all clients
     wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');