// Comprehensive Dashboard Data Service - Generates realistic data for all dashboard components
class DashboardDataService {
  constructor() {
    this.subscribers = new Set()
    this.isRunning = false
    this.updateInterval = null
    this.baseData = this.generateBaseData()
    this.currentData = { ...this.baseData }
    this.updateCount = 0
    this.marketHours = true
    this.tradingIntensity = 1.0 // 0.5 = low, 1.0 = normal, 2.0 = high
  }

  // Generate base data for all components
  generateBaseData() {
    return {
      // Metric Cards Data
      metrics: {
        totalMakers: 2459,
        volume24h: 15.4, // in billions
        averageSpread: 0.21, // percentage
        activePairs: 142
      },

      // Live Chart Data
      chart: {
        symbol: 'BTC/USD',
        price: 43250.50,
        change24h: 2.3, // percentage
        volume: 1.2, // in billions
        chartPoints: [
          { x: 0, y: 50 },
          { x: 20, y: 45 },
          { x: 40, y: 60 },
          { x: 60, y: 55 },
          { x: 80, y: 70 },
          { x: 100, y: 65 }
        ]
      },

      // Order Book Data
      orderBook: {
        levels: [
          { value: 5133, percentage: 85 },
          { value: 6200, percentage: 100 },
          { value: 7268, percentage: 90 },
          { value: 8135, percentage: 75 },
          { value: 3100, percentage: 50 },
          { value: 1100, percentage: 25 }
        ]
      },

      // Trades Data
      trades: {
        totalTrades: 1556,
        bids: 2652,
        asks: 3649,
        quart: 33433
      },

      // Alerts Data
      alerts: [
        {
          id: 1,
          type: 'error',
          message: 'Large sell order detected',
          timestamp: new Date(),
          active: true
        },
        {
          id: 2,
          type: 'warning',
          message: 'Market maker uptime below 99%',
          timestamp: new Date(),
          active: true
        },
        {
          id: 3,
          type: 'success',
          message: 'New market maker added',
          timestamp: new Date(),
          active: true
        }
      ]
    }
  }

  // Generate realistic market behavior based on metric type
  generateRealisticVariation(baseValue, metricType, volatility = 0.05) {
    let variation = 0
    
    switch (metricType) {
      case 'price':
        // Prices change frequently but with small variations
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.3)
        break
      case 'volume':
        // Volume only increases (realistic market behavior)
        variation = Math.random() * volatility * 0.5
        break
      case 'spread':
        // Spreads change moderately
        variation = (Math.random() - 0.5) * 2 * volatility
        break
      case 'trades':
        // Trade counts change frequently and can go up or down
        variation = (Math.random() - 0.5) * 2 * volatility
        break
      case 'uptime':
        // Uptime is very stable, only small decreases
        variation = -Math.random() * volatility * 0.1
        break
      case 'latency':
        // Latency is stable with small variations
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.2)
        break
      case 'pairs':
        // Pairs count changes slowly
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.1)
        break
      case 'inventory':
        // Inventory changes moderately
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.4)
        break
      case 'pnl':
        // PnL can change significantly
        variation = (Math.random() - 0.5) * 2 * volatility
        break
      default:
        variation = (Math.random() - 0.5) * 2 * volatility
    }
    
    return baseValue * (1 + variation)
  }

  // Generate market hours simulation
  getMarketIntensity() {
    const now = new Date()
    const hour = now.getHours()
    
    // Market hours simulation (24/7 for crypto, but with intensity variations)
    if (hour >= 9 && hour <= 16) {
      // US market hours - high activity
      return 1.5
    } else if (hour >= 21 || hour <= 2) {
      // Asian market hours - moderate activity
      return 1.2
    } else if (hour >= 3 && hour <= 8) {
      // European market hours - high activity
      return 1.3
    } else {
      // Off hours - lower activity
      return 0.7
    }
  }

  // Generate realistic price movement with trends
  generatePriceMovement(currentPrice, basePrice) {
    const trend = Math.sin(this.updateCount * 0.1) * 0.02 // Long-term trend
    const noise = (Math.random() - 0.5) * 0.01 // Short-term noise
    const volatility = this.getMarketIntensity() * 0.005
    
    const change = (trend + noise) * volatility
    return currentPrice * (1 + change)
  }

  // Generate realistic chart data points with trends
  generateChartPoints() {
    const points = []
    const baseY = 50
    const marketIntensity = this.getMarketIntensity()
    const volatility = 8 * marketIntensity
    
    // Create a more realistic price movement pattern
    for (let i = 0; i <= 5; i++) {
      const x = i * 20
      const timeFactor = this.updateCount * 0.1 + i * 0.2
      
      // Combine trend, noise, and market intensity
      const trend = Math.sin(timeFactor) * 8
      const noise = (Math.random() - 0.5) * volatility
      const marketEffect = Math.sin(timeFactor * 2) * 3 * marketIntensity
      
      const y = baseY + trend + noise + marketEffect
      points.push({ x, y: Math.max(5, Math.min(95, y)) })
    }
    
    return points
  }

  // Generate realistic order book levels
  generateOrderBookLevels() {
    const levels = []
    const baseValues = [5133, 6200, 7268, 8135, 3100, 1100]
    const marketIntensity = this.getMarketIntensity()
    
    baseValues.forEach((baseValue, index) => {
      // Order book levels change more frequently during high market activity
      const volatility = 0.05 * marketIntensity
      const variation = this.generateRealisticVariation(baseValue, 'trades', volatility)
      const value = Math.round(variation)
      const percentage = Math.min(100, Math.max(5, (value / baseValue) * 100))
      levels.push({ value, percentage })
    })
    
    return levels
  }

  // Generate realistic trade data
  generateTradeData() {
    const marketIntensity = this.getMarketIntensity()
    const baseTrades = 1556
    const baseBids = 2652
    const baseAsks = 3649
    const baseQuart = 33433
    
    // Trade counts increase during high market activity
    const tradeMultiplier = 1 + (marketIntensity - 1) * 0.3
    
    return {
      totalTrades: Math.round(this.generateRealisticVariation(baseTrades * tradeMultiplier, 'trades', 0.1)),
      bids: Math.round(this.generateRealisticVariation(baseBids * tradeMultiplier, 'trades', 0.08)),
      asks: Math.round(this.generateRealisticVariation(baseAsks * tradeMultiplier, 'trades', 0.08)),
      quart: Math.round(this.generateRealisticVariation(baseQuart * tradeMultiplier, 'trades', 0.05))
    }
  }

  // Generate new alerts (occasionally)
  generateAlerts(currentAlerts) {
    const newAlerts = [...currentAlerts]
    
    // Occasionally add new alerts
    if (Math.random() < 0.1) { // 10% chance
      const alertTypes = [
        { type: 'error', message: 'High volatility detected' },
        { type: 'warning', message: 'Low liquidity warning' },
        { type: 'success', message: 'Trade executed successfully' },
        { type: 'info', message: 'Market maker performance update' }
      ]
      
      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      newAlerts.push({
        id: Date.now(),
        type: randomAlert.type,
        message: randomAlert.message,
        timestamp: new Date(),
        active: true
      })
    }
    
    // Occasionally remove old alerts
    if (Math.random() < 0.15 && newAlerts.length > 1) { // 15% chance
      const randomIndex = Math.floor(Math.random() * newAlerts.length)
      newAlerts.splice(randomIndex, 1)
    }
    
    return newAlerts
  }

  // Update all dashboard data with realistic market behavior
  updateData() {
    this.updateCount++
    const marketIntensity = this.getMarketIntensity()
    
    // Update metrics with realistic behavior
    this.currentData.metrics = {
      // Total makers change very slowly (realistic)
      totalMakers: Math.round(this.generateRealisticVariation(this.baseData.metrics.totalMakers, 'pairs', 0.01)),
      // Volume only increases (realistic market behavior)
      volume24h: parseFloat(this.generateRealisticVariation(this.currentData.metrics?.volume24h || this.baseData.metrics.volume24h, 'volume', 0.02).toFixed(1)),
      // Spreads change moderately
      averageSpread: parseFloat(this.generateRealisticVariation(this.currentData.metrics?.averageSpread || this.baseData.metrics.averageSpread, 'spread', 0.08).toFixed(2)),
      // Active pairs change slowly
      activePairs: Math.round(this.generateRealisticVariation(this.baseData.metrics.activePairs, 'pairs', 0.02))
    }

    // Update chart data with realistic price movement
    const currentPrice = this.currentData.chart?.price || this.baseData.chart.price
    const newPrice = this.generatePriceMovement(currentPrice, this.baseData.chart.price)
    const priceChange = ((newPrice - this.baseData.chart.price) / this.baseData.chart.price) * 100
    
    this.currentData.chart = {
      ...this.currentData.chart,
      symbol: this.baseData.chart.symbol,
      price: parseFloat(newPrice.toFixed(2)),
      change24h: parseFloat(priceChange.toFixed(1)),
      // Volume only increases
      volume: parseFloat(this.generateRealisticVariation(this.currentData.chart?.volume || this.baseData.chart.volume, 'volume', 0.03).toFixed(1)),
      chartPoints: this.generateChartPoints()
    }

    // Update order book (changes frequently)
    this.currentData.orderBook = {
      levels: this.generateOrderBookLevels()
    }

    // Update trades (changes frequently based on market activity)
    this.currentData.trades = this.generateTradeData()

    // Update alerts (occasionally based on market conditions)
    this.currentData.alerts = this.generateAlerts(this.currentData.alerts)

    this.notifySubscribers()
  }

  // Get current dashboard data
  getCurrentData() {
    return this.currentData
  }

  // Subscribe to data updates
  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  // Notify all subscribers of data changes
  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.currentData))
  }

  // Start real-time updates
  startUpdates(intervalMs = 2000) {
    if (this.isRunning) return
    
    this.isRunning = true
    this.updateInterval = setInterval(() => {
      this.updateData()
    }, intervalMs)
    
    // Initial update
    this.updateData()
  }

  // Stop real-time updates
  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    this.isRunning = false
  }

  // Get update status
  isUpdating() {
    return this.isRunning
  }

  // Get specific component data
  getMetricsData() {
    return this.currentData.metrics
  }

  getChartData() {
    return this.currentData.chart
  }

  getOrderBookData() {
    return this.currentData.orderBook
  }

  getTradesData() {
    return this.currentData.trades
  }

  getAlertsData() {
    return this.currentData.alerts
  }
}

// Create singleton instance
const dashboardDataService = new DashboardDataService()

export default dashboardDataService
