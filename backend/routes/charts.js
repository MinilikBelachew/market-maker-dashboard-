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

// GET /api/charts/btc - Get BTC/USD chart data
router.get('/btc', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const chartData = marketDataService.getChart();
    
    res.json({
      success: true,
      data: chartData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching BTC chart data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chart data' 
    });
  }
});

// GET /api/charts/btc/history - Get historical BTC price data
router.get('/btc/history', async (req, res) => {
  try {
    const { period = '24h', interval = '1h' } = req.query;
    
    // This would typically fetch from a database or external API
    // For now, we'll generate sample historical data
    const historicalData = generateHistoricalData(period, interval);
    
    res.json({
      success: true,
      data: historicalData,
      period: period,
      interval: interval,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch historical data' 
    });
  }
});

// GET /api/charts/btc/candles - Get candlestick data
router.get('/btc/candles', async (req, res) => {
  try {
    const { interval = '1m', limit = 100 } = req.query;
    
    // Generate sample candlestick data
    const candles = generateCandlestickData(interval, parseInt(limit));
    
    res.json({
      success: true,
      data: candles,
      interval: interval,
      count: candles.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching candlestick data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch candlestick data' 
    });
  }
});

// Helper function to generate historical data
function generateHistoricalData(period, interval) {
  const data = [];
  const now = new Date();
  let points = 24; // Default to 24 points
  
  // Adjust points based on period and interval
  switch (period) {
    case '1h':
      points = interval === '1m' ? 60 : 12;
      break;
    case '24h':
      points = interval === '1h' ? 24 : interval === '4h' ? 6 : 1;
      break;
    case '7d':
      points = interval === '1h' ? 168 : interval === '4h' ? 42 : 7;
      break;
    case '30d':
      points = interval === '4h' ? 180 : interval === '1d' ? 30 : 1;
      break;
  }
  
  const basePrice = 43250;
  const volatility = 0.02;
  
  for (let i = 0; i < points; i++) {
    const time = new Date(now.getTime() - (points - i) * getIntervalMs(interval));
    const priceChange = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + priceChange * (points - i) / points);
    
    data.push({
      timestamp: time.toISOString(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.random() * 1000000
    });
  }
  
  return data;
}

// Helper function to generate candlestick data
function generateCandlestickData(interval, limit) {
  const candles = [];
  const basePrice = 43250;
  const volatility = 0.01;
  
  for (let i = 0; i < limit; i++) {
    const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
    const close = open * (1 + (Math.random() - 0.5) * volatility);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    const volume = Math.random() * 1000000;
    
    const time = new Date(Date.now() - (limit - i) * getIntervalMs(interval));
    
    candles.push({
      timestamp: time.toISOString(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: parseFloat(volume.toFixed(2))
    });
  }
  
  return candles;
}

// Helper function to get interval in milliseconds
function getIntervalMs(interval) {
  switch (interval) {
    case '1m': return 60 * 1000;
    case '5m': return 5 * 60 * 1000;
    case '15m': return 15 * 60 * 1000;
    case '1h': return 60 * 60 * 1000;
    case '4h': return 4 * 60 * 60 * 1000;
    case '1d': return 24 * 60 * 60 * 1000;
    default: return 60 * 1000;
  }
}

module.exports = router;
