const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json()); // ← yeh add karo

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// Error handler
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});