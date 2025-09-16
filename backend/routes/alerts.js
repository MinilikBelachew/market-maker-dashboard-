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

// GET /api/alerts - Get all alerts
router.get('/', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const alerts = marketDataService.getAlerts();
    
    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch alerts' 
    });
  }
});

// GET /api/alerts/active - Get only active alerts
router.get('/active', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const allAlerts = marketDataService.getAlerts();
    const activeAlerts = allAlerts.filter(alert => alert.active);
    
    res.json({
      success: true,
      data: activeAlerts,
      count: activeAlerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch active alerts' 
    });
  }
});

// GET /api/alerts/:type - Get alerts by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['error', 'warning', 'success', 'info'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid alert type. Valid types: error, warning, success, info' 
      });
    }

    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const allAlerts = marketDataService.getAlerts();
    const filteredAlerts = allAlerts.filter(alert => alert.type === type);
    
    res.json({
      success: true,
      data: filteredAlerts,
      type: type,
      count: filteredAlerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching alerts by type:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch alerts by type' 
    });
  }
});

// POST /api/alerts - Create new alert
router.post('/', async (req, res) => {
  try {
    const { type, message, priority = 'medium' } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Type and message are required' 
      });
    }

    const validTypes = ['error', 'warning', 'success', 'info'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid alert type. Valid types: error, warning, success, info' 
      });
    }

    const newAlert = {
      id: Date.now(),
      type: type,
      message: message,
      priority: priority,
      timestamp: new Date().toISOString(),
      active: true
    };

    // In a real application, this would be stored in a database
    // For now, we'll just return the created alert
    res.status(201).json({
      success: true,
      data: newAlert,
      message: 'Alert created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create alert' 
    });
  }
});

// PUT /api/alerts/:id - Update alert status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { active, message } = req.body;
    
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const alerts = marketDataService.getAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === parseInt(id));
    
    if (alertIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Alert not found' 
      });
    }

    // Update alert
    if (active !== undefined) {
      alerts[alertIndex].active = active;
    }
    if (message) {
      alerts[alertIndex].message = message;
    }
    alerts[alertIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: alerts[alertIndex],
      message: 'Alert updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update alert' 
    });
  }
});

// DELETE /api/alerts/:id - Delete alert
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const alerts = marketDataService.getAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === parseInt(id));
    
    if (alertIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Alert not found' 
      });
    }

    // Remove alert
    const deletedAlert = alerts.splice(alertIndex, 1)[0];

    res.json({
      success: true,
      data: deletedAlert,
      message: 'Alert deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete alert' 
    });
  }
});

// GET /api/alerts/stats/summary - Get alert statistics
router.get('/stats/summary', async (req, res) => {
  try {
    if (!marketDataService) {
      return res.status(503).json({ error: 'Market data service not available' });
    }

    const alerts = marketDataService.getAlerts();
    
    const stats = {
      total: alerts.length,
      active: alerts.filter(alert => alert.active).length,
      inactive: alerts.filter(alert => !alert.active).length,
      byType: {
        error: alerts.filter(alert => alert.type === 'error').length,
        warning: alerts.filter(alert => alert.type === 'warning').length,
        success: alerts.filter(alert => alert.type === 'success').length,
        info: alerts.filter(alert => alert.type === 'info').length
      },
      recent: alerts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching alert statistics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch alert statistics' 
    });
  }
});

module.exports = router;
