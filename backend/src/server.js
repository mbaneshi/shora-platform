import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { ClientToServerEvents, ServerToClientEvents, Decision, Commission, Document } from './types';

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3001",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/shora', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes - Commented out until routes are implemented
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/places', require('./routes/places'));
// app.use('/api/shora', require('./routes/shora'));
// app.use('/api/representatives', require('./routes/representatives'));
// app.use('/api/commissions', require('./routes/commissions'));
// app.use('/api/decisions', require('./routes/decisions'));
// app.use('/api/documents', require('./routes/documents'));
// app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Join a specific place's room
  socket.on('join-place', (placeId) => {
    socket.join(`place-${placeId}`);
    console.log(`👥 Client ${socket.id} joined place ${placeId}`);
  });

  // Handle decision updates
  socket.on('decision-update', (data) => {
    socket.to(`place-${data.placeId}`).emit('decision-updated', data);
  });

  // Handle commission updates
  socket.on('commission-update', (data) => {
    socket.to(`place-${data.placeId}`).emit('commission-updated', data);
  });

  // Handle document uploads
  socket.on('document-uploaded', (data) => {
    socket.to(`place-${data.placeId}`).emit('document-uploaded', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Shora Platform API Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.io server ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = { app, io };
