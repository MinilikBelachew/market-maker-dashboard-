const express = require('express');
const router = express.Router();

// This would typically be injected via middleware
let marketDataService = null;

// Middleware to inject market data service
const injectMarketDataService = (req, res, next) => {
  marketDataService = req.app.get('marketDataService');
  next();
};

router.use(injectMarketDataService);

// GET /api/trades - Get trades data
router.get('/', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const tradesData = marketDataService.getTrades();
    
    res.json({
      success: true,
      data: tradesData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching trades data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch trades data' 
    });
  }
});

// GET /api/trades/recent - Get recent trades
router.get('/recent', async (req, res) => {
  try {
    const { limit = 50, symbol = 'BTCUSDT' } = req.query;
    
    // This would typically fetch from external API or database
    const recentTrades = generateRecentTrades(parseInt(limit), symbol);
    
    res.json({
      success: true,
      data: recentTrades,
      symbol: symbol,
      count: recentTrades.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching recent trades:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch recent trades' 
    });
  }
});

// GET /api/trades/volume - Get trading volume statistics
router.get('/volume', async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    const volumeStats = generateVolumeStats(period);
    
    res.json({
      success: true,
      data: volumeStats,
      period: period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching volume stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch volume statistics' 
    });
  }
});

// GET /api/trades/analytics - Get trading analytics
router.get('/analytics', async (req, res) => {
  try {
    const analytics = generateTradingAnalytics();
    
    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching trading analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch trading analytics' 
    });
  }
});

// Helper function to generate recent trades
function generateRecentTrades(limit, symbol) {
  const trades = [];
  const basePrice = 43250;
  const volatility = 0.001;
  
  for (let i = 0; i < limit; i++) {
    const price = basePrice * (1 + (Math.random() - 0.5) * volatility);
    const quantity = Math.random() * 10;
    const isBuyerMaker = Math.random() > 0.5;
    const time = new Date(Date.now() - i * 1000); // 1 second intervals
    
    trades.push({
      id: Date.now() - i,
      symbol: symbol,
      price: parseFloat(price.toFixed(2)),
      quantity: parseFloat(quantity.toFixed(4)),
      side: isBuyerMaker ? 'sell' : 'buy',
      isBuyerMaker: isBuyerMaker,
      timestamp: time.toISOString()
    });
  }
  
  return trades;
}

// Helper function to generate volume statistics
function generateVolumeStats(period) {
  const now = new Date();
  const baseVolume = 1000000;
  const volatility = 0.1;
  
  let dataPoints = 24; // Default for 24h
  let intervalMs = 60 * 60 * 1000; // 1 hour intervals
  
  switch (period) {
    case '1h':
      dataPoints = 12;
      intervalMs = 5 * 60 * 1000; // 5 minute intervals
      break;
    case '7d':
      dataPoints = 7;
      intervalMs = 24 * 60 * 60 * 1000; // 1 day intervals
      break;
    case '30d':
      dataPoints = 30;
      intervalMs = 24 * 60 * 60 * 1000; // 1 day intervals
      break;
  }
  
  const volumeData = [];
  let totalVolume = 0;
  
  for (let i = 0; i < dataPoints; i++) {
    const time = new Date(now.getTime() - (dataPoints - i) * intervalMs);
    const volume = baseVolume * (1 + (Math.random() - 0.5) * volatility);
    totalVolume += volume;
    
    volumeData.push({
      timestamp: time.toISOString(),
      volume: parseFloat(volume.toFixed(2)),
      cumulative: parseFloat(totalVolume.toFixed(2))
    });
  }
  
  return {
    period: period,
    totalVolume: parseFloat(totalVolume.toFixed(2)),
    averageVolume: parseFloat((totalVolume / dataPoints).toFixed(2)),
    data: volumeData
  };
}

// Helper function to generate trading analytics
function generateTradingAnalytics() {
  return {
    totalTrades: Math.floor(Math.random() * 10000) + 5000,
    totalVolume: Math.floor(Math.random() * 1000000) + 500000,
    averageTradeSize: Math.floor(Math.random() * 1000) + 500,
    buyRatio: Math.random() * 0.4 + 0.3, // 30-70%
    sellRatio: Math.random() * 0.4 + 0.3, // 30-70%
    largestTrade: Math.floor(Math.random() * 10000) + 1000,
    smallestTrade: Math.floor(Math.random() * 100) + 10,
    activeTraders: Math.floor(Math.random() * 1000) + 100,
    marketMakers: Math.floor(Math.random() * 50) + 20,
    averageLatency: Math.random() * 10 + 5, // 5-15ms
    successRate: Math.random() * 5 + 95 // 95-100%
  };
}

module.exports = router;
