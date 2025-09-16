const EventEmitter = require('events');

class MarketDataService extends EventEmitter {
  constructor() {
    super();
    this.isRunning = false;
    this.updateInterval = null;
    this.externalDataService = null;
    this.currentData = {
      marketMakers: [],
      chart: null,
      orderBook: null,
      trades: [],
      metrics: null,
      alerts: []
    };
    this.subscribers = new Set();
  }

  async initialize(externalDataService) {
    this.externalDataService = externalDataService;
    
    // Load initial data
    await this.loadInitialData();
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('Market data service initialized');
  }

  async loadInitialData() {
    try {
      // Load market makers data
      this.currentData.marketMakers = await this.externalDataService.getMarketMakersData();
      
      // Load chart data
      const btcPrice = await this.externalDataService.getBitcoinPrice();
      this.currentData.chart = {
        symbol: 'BTC/USD',
        price: btcPrice.price,
        change24h: btcPrice.change24h,
        volume: btcPrice.volume24h / 1000000000, // Convert to billions
        chartPoints: this.generateChartPoints(btcPrice.price),
        timestamp: new Date().toISOString()
      };

      // Load order book data
      const orderBook = await this.externalDataService.getOrderBook('BTCUSDT');
      this.currentData.orderBook = this.formatOrderBookData(orderBook);

      // Load trades data
      const recentTrades = await this.externalDataService.getRecentTrades('BTCUSDT', 50);
      this.currentData.trades = this.formatTradesData(recentTrades);

      // Load metrics
      this.currentData.metrics = await this.externalDataService.getMarketMetrics();

      // Initialize alerts
      this.currentData.alerts = this.generateInitialAlerts();

      console.log('Initial data loaded successfully');
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Use fallback data
      this.loadFallbackData();
    }
  }

  loadFallbackData() {
    this.currentData = {
      marketMakers: this.externalDataService.getFallbackMarketMakers(),
      chart: {
        symbol: 'BTC/USD',
        price: 43250.50,
        change24h: 2.3,
        volume: 1.2,
        chartPoints: this.generateChartPoints(43250.50),
        timestamp: new Date().toISOString()
      },
      orderBook: {
        levels: [
          { value: 5133, percentage: 85 },
          { value: 6200, percentage: 100 },
          { value: 7268, percentage: 90 }
        ]
      },
      trades: {
        totalTrades: 1556,
        bids: 2652,
        asks: 3649,
        quart: 33433
      },
      metrics: {
        totalMakers: 2459,
        volume24h: 15.4,
        averageSpread: 0.21,
        activePairs: 142
      },
      alerts: this.generateInitialAlerts()
    };
  }

  setupEventListeners() {
    // Listen for data updates and emit to subscribers
    this.on('dataUpdate', (data) => {
      this.subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    });
  }

  generateChartPoints(currentPrice) {
    const points = [];
    const basePrice = currentPrice;
    const volatility = 0.02; // 2% volatility
    
    for (let i = 0; i <= 5; i++) {
      const x = i * 20;
      const timeFactor = i * 0.2;
      
      // Generate realistic price movement
      const trend = Math.sin(timeFactor) * 0.01;
      const noise = (Math.random() - 0.5) * volatility;
      const priceChange = trend + noise;
      
      const price = basePrice * (1 + priceChange);
      const normalizedPrice = ((price - basePrice) / basePrice) * 100 + 50;
      
      points.push({ 
        x, 
        y: Math.max(5, Math.min(95, normalizedPrice)) 
      });
    }
    
    return points;
  }

  formatOrderBookData(orderBookData) {
    const levels = [];
    const maxBid = Math.max(...orderBookData.bids.map(b => b.price));
    const maxAsk = Math.max(...orderBookData.asks.map(a => a.price));
    const maxPrice = Math.max(maxBid, maxAsk);

    // Format bid levels
    orderBookData.bids.slice(0, 3).forEach(bid => {
      levels.push({
        value: Math.round(bid.quantity * 1000),
        percentage: Math.round((bid.price / maxPrice) * 100)
      });
    });

    // Format ask levels
    orderBookData.asks.slice(0, 3).forEach(ask => {
      levels.push({
        value: Math.round(ask.quantity * 1000),
        percentage: Math.round((ask.price / maxPrice) * 100)
      });
    });

    return { levels };
  }

  formatTradesData(tradesData) {
    const totalTrades = tradesData.length;
    const bids = tradesData.filter(trade => !trade.isBuyerMaker).length;
    const asks = tradesData.filter(trade => trade.isBuyerMaker).length;
    const quart = tradesData.reduce((sum, trade) => sum + trade.quantity, 0);

    return {
      totalTrades,
      bids,
      asks,
      quart: Math.round(quart)
    };
  }

  generateInitialAlerts() {
    return [
      {
        id: 1,
        type: 'info',
        message: 'System initialized successfully',
        timestamp: new Date().toISOString(),
        active: true
      },
      {
        id: 2,
        type: 'success',
        message: 'Real-time data connection established',
        timestamp: new Date().toISOString(),
        active: true
      }
    ];
  }

  async updateMarketMakers() {
    try {
      const updatedMakers = await this.externalDataService.getMarketMakersData();
      this.currentData.marketMakers = updatedMakers;
      this.emit('dataUpdate', { type: 'marketMakers', data: updatedMakers });
    } catch (error) {
      console.error('Error updating market makers:', error);
    }
  }

  async updateChart() {
    try {
      const btcPrice = await this.externalDataService.getBitcoinPrice();
      this.currentData.chart = {
        symbol: 'BTC/USD',
        price: btcPrice.price,
        change24h: btcPrice.change24h,
        volume: btcPrice.volume24h / 1000000000,
        chartPoints: this.generateChartPoints(btcPrice.price),
        timestamp: new Date().toISOString()
      };
      this.emit('dataUpdate', { type: 'chart', data: this.currentData.chart });
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }

  async updateOrderBook() {
    try {
      const orderBook = await this.externalDataService.getOrderBook('BTCUSDT');
      this.currentData.orderBook = this.formatOrderBookData(orderBook);
      this.emit('dataUpdate', { type: 'orderBook', data: this.currentData.orderBook });
    } catch (error) {
      console.error('Error updating order book:', error);
    }
  }

  async updateTrades() {
    try {
      const recentTrades = await this.externalDataService.getRecentTrades('BTCUSDT', 50);
      this.currentData.trades = this.formatTradesData(recentTrades);
      this.emit('dataUpdate', { type: 'trades', data: this.currentData.trades });
    } catch (error) {
      console.error('Error updating trades:', error);
    }
  }

  async updateMetrics() {
    try {
      const metrics = await this.externalDataService.getMarketMetrics();
      this.currentData.metrics = metrics;
      this.emit('dataUpdate', { type: 'metrics', data: metrics });
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }

  generateNewAlert() {
    const alertTypes = [
      { type: 'warning', message: 'High volatility detected in BTC/USD' },
      { type: 'info', message: 'New market maker performance update' },
      { type: 'success', message: 'Trade executed successfully' },
      { type: 'error', message: 'Connection timeout to external API' }
    ];

    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const newAlert = {
      id: Date.now(),
      type: randomAlert.type,
      message: randomAlert.message,
      timestamp: new Date().toISOString(),
      active: true
    };

    this.currentData.alerts.push(newAlert);
    
    // Keep only last 10 alerts
    if (this.currentData.alerts.length > 10) {
      this.currentData.alerts = this.currentData.alerts.slice(-10);
    }

    this.emit('dataUpdate', { type: 'alerts', data: this.currentData.alerts });
  }

  startRealTimeUpdates() {
    if (this.isRunning) return;

    this.isRunning = true;
    const updateInterval = parseInt(process.env.MARKET_DATA_UPDATE_INTERVAL) || 2000;

    this.updateInterval = setInterval(async () => {
      try {
        // Update different data at different intervals
        await Promise.all([
          this.updateChart(),
          this.updateOrderBook(),
          this.updateTrades(),
          this.updateMetrics()
        ]);

        // Update market makers less frequently
        if (Math.random() < 0.3) { // 30% chance each update
          await this.updateMarketMakers();
        }

        // Occasionally generate new alerts
        if (Math.random() < 0.1) { // 10% chance each update
          this.generateNewAlert();
        }

      } catch (error) {
        console.error('Error in real-time update cycle:', error);
      }
    }, updateInterval);

    console.log('Real-time updates started');
  }

  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isRunning = false;
    console.log('Real-time updates stopped');
  }

  // Get current data
  getCurrentData() {
    return this.currentData;
  }

  // Subscribe to data updates
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Get specific data type
  getMarketMakers() {
    return this.currentData.marketMakers;
  }

  getChart() {
    return this.currentData.chart;
  }

  getOrderBook() {
    return this.currentData.orderBook;
  }

  getTrades() {
    return this.currentData.trades;
  }

  getMetrics() {
    return this.currentData.metrics;
  }

  getAlerts() {
    return this.currentData.alerts;
  }
}

module.exports = MarketDataService;
