// websocket-client.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { io } = require('socket.io-client');

const socket = io('ws://localhost:3001', {
  transports: ['websocket'],
  forceNew: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
  socket.emit('message', 'Hello, WebSocket server!');
});

socket.on('news-topic', (message) => {
  console.log('Received message from server:', message);
});

socket.on('message', (message) => {
  console.log(`Received message: ${message}`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
