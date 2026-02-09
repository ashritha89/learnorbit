// server.js
require('dotenv').config();

const http = require('http');
const app = require('./src/app');

const PORT = process.env.PORT || 0;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
