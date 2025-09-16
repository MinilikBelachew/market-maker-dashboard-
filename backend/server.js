const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const MarketDataService = require('./services/MarketDataService');
const DatabaseService = require('./services/DatabaseService');
const WebSocketService = require('./services/WebSocketService');
const ExternalDataService = require('./services/ExternalDataService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Initialize services
const databaseService = new DatabaseService();
const marketDataService = new MarketDataService();
const externalDataService = new ExternalDataService();
const webSocketService = new WebSocketService(io);

// API Routes
app.use('/api/market-makers', require('./routes/marketMakers'));
app.use('/api/trades', require('./routes/trades'));
app.use('/api/charts', require('./routes/charts'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/metrics', require('./routes/metrics'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize services and start server
async function startServer() {
  try {
    // Initialize database
    await databaseService.initialize();
    console.log('✅ Database initialized');

    // Initialize external data service
    await externalDataService.initialize();
    console.log('✅ External data service initialized');

    // Initialize market data service with real data
    await marketDataService.initialize(externalDataService);
    console.log('✅ Market data service initialized');

    // Initialize WebSocket service
    webSocketService.initialize(marketDataService);
    console.log('✅ WebSocket service initialized');

    // Make services available to routes
    app.set('marketDataService', marketDataService);
    app.set('databaseService', databaseService);
    app.set('externalDataService', externalDataService);
    app.set('webSocketService', webSocketService);

    // Start real-time data updates
    marketDataService.startRealTimeUpdates();
    console.log('✅ Real-time updates started');

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 WebSocket server ready for real-time connections`);
      console.log(`🌐 API endpoints available at http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  marketDataService.stopRealTimeUpdates();
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();
