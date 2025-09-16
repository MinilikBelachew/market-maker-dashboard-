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

// GET /api/market-makers - Get all market makers
router.get('/', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const marketMakers = marketDataService.getMarketMakers();
    res.json({
      success: true,
      data: marketMakers,
      count: marketMakers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market makers:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch market makers data' 
    });
  }
});

// GET /api/market-makers/:id - Get specific market maker
router.get('/:id', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const marketMakers = marketDataService.getMarketMakers();
    const marketMaker = marketMakers.find(maker => 
      maker.name.toLowerCase() === req.params.id.toLowerCase()
    );

    if (!marketMaker) {
      return res.status(404).json({ 
        success: false, 
        error: 'Market maker not found' 
      });
    }

    res.json({
      success: true,
      data: marketMaker,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market maker:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch market maker data' 
    });
  }
});

// GET /api/market-makers/stats/summary - Get market makers summary statistics
router.get('/stats/summary', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const marketMakers = marketDataService.getMarketMakers();
    
    const stats = {
      total: marketMakers.length,
      active: marketMakers.filter(m => m.status === 'active').length,
      warning: marketMakers.filter(m => m.status === 'warning').length,
      averageSpread: marketMakers.reduce((sum, m) => sum + parseFloat(m.avgSpread), 0) / marketMakers.length,
      totalVolume: marketMakers.reduce((sum, m) => {
        const volume = parseFloat(m.volume.replace('$', '').replace('M', ''));
        return sum + volume;
      }, 0),
      averageUptime: marketMakers.reduce((sum, m) => sum + parseFloat(m.uptime), 0) / marketMakers.length,
      averageLatency: marketMakers.reduce((sum, m) => sum + parseFloat(m.latency), 0) / marketMakers.length
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market makers stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch market makers statistics' 
    });
  }
});

// GET /api/market-makers/top/:metric - Get top market makers by metric
router.get('/top/:metric', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const { metric } = req.params;
    const { limit = 10 } = req.query;
    
    const marketMakers = marketDataService.getMarketMakers();
    let sortedMakers = [];

    switch (metric) {
      case 'volume':
        sortedMakers = marketMakers
          .sort((a, b) => {
            const volumeA = parseFloat(a.volume.replace('$', '').replace('M', ''));
            const volumeB = parseFloat(b.volume.replace('$', '').replace('M', ''));
            return volumeB - volumeA;
          })
          .slice(0, parseInt(limit));
        break;
      
      case 'spread':
        sortedMakers = marketMakers
          .sort((a, b) => parseFloat(a.avgSpread) - parseFloat(b.avgSpread))
          .slice(0, parseInt(limit));
        break;
      
      case 'uptime':
        sortedMakers = marketMakers
          .sort((a, b) => parseFloat(b.uptime) - parseFloat(a.uptime))
          .slice(0, parseInt(limit));
        break;
      
      case 'latency':
        sortedMakers = marketMakers
          .sort((a, b) => parseFloat(a.latency) - parseFloat(b.latency))
          .slice(0, parseInt(limit));
        break;
      
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid metric. Supported metrics: volume, spread, uptime, latency' 
        });
    }

    res.json({
      success: true,
      data: sortedMakers,
      metric: metric,
      limit: parseInt(limit),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching top market makers:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch top market makers' 
    });
  }
});

module.exports = router;
