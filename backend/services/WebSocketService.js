class WebSocketService {
  constructor(io) {
    this.io = io;
    this.marketDataService = null;
    this.connectedClients = new Set();
  }

  initialize(marketDataService) {
    this.marketDataService = marketDataService;
    this.setupEventHandlers();
    this.setupDataSubscriptions();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.connectedClients.add(socket);

      // Send initial data to new client
      this.sendInitialData(socket);

      // Handle client requests
      socket.on('requestData', (dataType) => {
        this.handleDataRequest(socket, dataType);
      });

      socket.on('subscribeToUpdates', (dataTypes) => {
        this.handleSubscription(socket, dataTypes);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  setupDataSubscriptions() {
    if (!this.marketDataService) return;

    // Subscribe to all data updates from market data service
    this.marketDataService.subscribe((update) => {
      this.broadcastUpdate(update);
    });
  }

  sendInitialData(socket) {
    if (!this.marketDataService) return;

    const data = this.marketDataService.getCurrentData();
    
    socket.emit('initialData', {
      marketMakers: data.marketMakers,
      chart: data.chart,
      orderBook: data.orderBook,
      trades: data.trades,
      metrics: data.metrics,
      alerts: data.alerts,
      timestamp: new Date().toISOString()
    });
  }

  handleDataRequest(socket, dataType) {
    if (!this.marketDataService) return;

    let data = null;
    
    switch (dataType) {
      case 'marketMakers':
        data = this.marketDataService.getMarketMakers();
        break;
      case 'chart':
        data = this.marketDataService.getChart();
        break;
      case 'orderBook':
        data = this.marketDataService.getOrderBook();
        break;
      case 'trades':
        data = this.marketDataService.getTrades();
        break;
      case 'metrics':
        data = this.marketDataService.getMetrics();
        break;
      case 'alerts':
        data = this.marketDataService.getAlerts();
        break;
      default:
        socket.emit('error', { message: 'Invalid data type requested' });
        return;
    }

    socket.emit('dataResponse', {
      type: dataType,
      data: data,
      timestamp: new Date().toISOString()
    });
  }

  handleSubscription(socket, dataTypes) {
    // Store subscription preferences for this socket
    socket.dataTypes = dataTypes || ['marketMakers', 'chart', 'orderBook', 'trades', 'metrics', 'alerts'];
    
    socket.emit('subscriptionConfirmed', {
      subscribedTo: socket.dataTypes,
      timestamp: new Date().toISOString()
    });
  }

  broadcastUpdate(update) {
    if (!update || !update.type || !update.data) return;

    // Broadcast to all connected clients
    this.connectedClients.forEach(socket => {
      try {
        // Check if client is subscribed to this data type
        if (!socket.dataTypes || socket.dataTypes.includes(update.type)) {
          socket.emit('dataUpdate', {
            type: update.type,
            data: update.data,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Error broadcasting to socket ${socket.id}:`, error);
      }
    });
  }

  // Send specific update to all clients
  broadcastToAll(event, data) {
    this.io.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Send update to specific client
  sendToClient(socketId, event, data) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get connection statistics
  getStats() {
    return {
      connectedClients: this.connectedClients.size,
      totalSockets: this.io.sockets.sockets.size,
      uptime: process.uptime()
    };
  }

  // Broadcast system status
  broadcastSystemStatus() {
    const stats = this.getStats();
    this.broadcastToAll('systemStatus', {
      status: 'healthy',
      stats: stats,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = WebSocketService;
