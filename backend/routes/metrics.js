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

// GET /api/metrics - Get all metrics
router.get('/', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const metrics = marketDataService.getMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch metrics' 
    });
  }
});

// GET /api/metrics/performance - Get performance metrics
router.get('/performance', async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    const performanceMetrics = generatePerformanceMetrics(period);
    
    res.json({
      success: true,
      data: performanceMetrics,
      period: period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch performance metrics' 
    });
  }
});

// GET /api/metrics/volume - Get volume metrics
router.get('/volume', async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    const volumeMetrics = generateVolumeMetrics(period);
    
    res.json({
      success: true,
      data: volumeMetrics,
      period: period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching volume metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch volume metrics' 
    });
  }
});

// GET /api/metrics/latency - Get latency metrics
router.get('/latency', async (req, res) => {
  try {
    const latencyMetrics = generateLatencyMetrics();
    
    res.json({
      success: true,
      data: latencyMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching latency metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch latency metrics' 
    });
  }
});

// GET /api/metrics/uptime - Get uptime metrics
router.get('/uptime', async (req, res) => {
  try {
    const uptimeMetrics = generateUptimeMetrics();
    
    res.json({
      success: true,
      data: uptimeMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching uptime metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch uptime metrics' 
    });
  }
});

// GET /api/metrics/dashboard - Get dashboard summary metrics
router.get('/dashboard', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const metrics = marketDataService.getMetrics();
    const marketMakers = marketDataService.getMarketMakers();
    
    const dashboardMetrics = {
      overview: {
        totalMakers: marketMakers.length,
        activeMakers: marketMakers.filter(m => m.status === 'active').length,
        totalVolume: metrics.volume24h,
        averageSpread: metrics.averageSpread,
        activePairs: metrics.activePairs
      },
      performance: {
        averageUptime: calculateAverageUptime(marketMakers),
        averageLatency: calculateAverageLatency(marketMakers),
        averageSuccessRate: calculateAverageSuccessRate(marketMakers),
        totalPnL: calculateTotalPnL(marketMakers)
      },
      trends: {
        volumeChange: generateTrendData('volume'),
        spreadChange: generateTrendData('spread'),
        makerGrowth: generateTrendData('makers')
      }
    };
    
    res.json({
      success: true,
      data: dashboardMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard metrics' 
    });
  }
});

// Helper functions
function generatePerformanceMetrics(period) {
  const baseMetrics = {
    totalTrades: 1556,
    successfulTrades: 1523,
    failedTrades: 33,
    averageExecutionTime: 1.8,
    peakTps: 45.2,
    averageSpread: 0.21
  };

  // Adjust based on period
  const multiplier = period === '1h' ? 0.04 : period === '7d' ? 7 : 1;
  
  return {
    period: period,
    totalTrades: Math.round(baseMetrics.totalTrades * multiplier),
    successfulTrades: Math.round(baseMetrics.successfulTrades * multiplier),
    failedTrades: Math.round(baseMetrics.failedTrades * multiplier),
    successRate: parseFloat(((baseMetrics.successfulTrades / baseMetrics.totalTrades) * 100).toFixed(2)),
    averageExecutionTime: baseMetrics.averageExecutionTime,
    peakTps: baseMetrics.peakTps,
    averageSpread: baseMetrics.averageSpread,
    timestamp: new Date().toISOString()
  };
}

function generateVolumeMetrics(period) {
  const baseVolume = 15.4; // billion
  const volatility = 0.1;
  
  const volume = baseVolume * (1 + (Math.random() - 0.5) * volatility);
  
  return {
    period: period,
    totalVolume: parseFloat(volume.toFixed(2)),
    volumeChange: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)),
    averageVolume: parseFloat((volume * 0.8).toFixed(2)),
    peakVolume: parseFloat((volume * 1.5).toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

function generateLatencyMetrics() {
  return {
    averageLatency: parseFloat((Math.random() * 5 + 1).toFixed(2)),
    p50Latency: parseFloat((Math.random() * 3 + 1).toFixed(2)),
    p95Latency: parseFloat((Math.random() * 10 + 5).toFixed(2)),
    p99Latency: parseFloat((Math.random() * 20 + 10).toFixed(2)),
    maxLatency: parseFloat((Math.random() * 50 + 20).toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

function generateUptimeMetrics() {
  return {
    currentUptime: parseFloat((99.5 + Math.random() * 0.5).toFixed(2)),
    averageUptime: parseFloat((99.2 + Math.random() * 0.8).toFixed(2)),
    downtime: parseFloat((Math.random() * 0.5).toFixed(2)),
    lastIncident: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    timestamp: new Date().toISOString()
  };
}

function calculateAverageUptime(marketMakers) {
  const totalUptime = marketMakers.reduce((sum, maker) => {
    return sum + parseFloat(maker.uptime);
  }, 0);
  return parseFloat((totalUptime / marketMakers.length).toFixed(2));
}

function calculateAverageLatency(marketMakers) {
  const totalLatency = marketMakers.reduce((sum, maker) => {
    return sum + parseFloat(maker.latency);
  }, 0);
  return parseFloat((totalLatency / marketMakers.length).toFixed(2));
}

function calculateAverageSuccessRate(marketMakers) {
  const totalSuccessRate = marketMakers.reduce((sum, maker) => {
    return sum + parseFloat(maker.successRate);
  }, 0);
  return parseFloat((totalSuccessRate / marketMakers.length).toFixed(2));
}

function calculateTotalPnL(marketMakers) {
  const totalPnL = marketMakers.reduce((sum, maker) => {
    const pnl = parseFloat(maker.pnl.replace('+$', '').replace('K', ''));
    return sum + pnl;
  }, 0);
  return parseFloat(totalPnL.toFixed(2));
}

function generateTrendData(type) {
  const trends = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    let value = 0;
    
    switch (type) {
      case 'volume':
        value = Math.random() * 20 + 10;
        break;
      case 'spread':
        value = Math.random() * 0.1 + 0.15;
        break;
      case 'makers':
        value = Math.random() * 100 + 2400;
        break;
    }
    
    trends.push({
      timestamp: time.toISOString(),
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return trends;
}

module.exports = router;
