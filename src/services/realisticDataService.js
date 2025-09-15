// Realistic Data Service - Simulates real-world market behavior with different update frequencies
class RealisticDataService {
  constructor() {
    this.subscribers = new Set()
    this.isRunning = false
    this.intervals = {}
    this.baseData = this.generateBaseData()
    this.currentData = { ...this.baseData }
    this.updateCount = 0
    this.marketHours = true
    this.tradingIntensity = 1.0
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

      // Live Chart Data - Market Maker Rating Distribution
      chart: {
        symbol: 'MM Rating Distribution',
        aPlusCount: 295,
        aCount: 442,
        bPlusCount: 1106,
        bCount: 492,
        cPlusCount: 124,
        ratingDistribution: [
          { x: 0, 'A+': 12, 'A': 18, 'B+': 45, 'B': 20, 'C+': 5 },
          { x: 20, 'A+': 13, 'A': 19, 'B+': 44, 'B': 19, 'C+': 5 },
          { x: 40, 'A+': 14, 'A': 20, 'B+': 43, 'B': 18, 'C+': 5 },
          { x: 60, 'A+': 15, 'A': 21, 'B+': 42, 'B': 17, 'C+': 5 },
          { x: 80, 'A+': 16, 'A': 22, 'B+': 41, 'B': 16, 'C+': 5 },
          { x: 100, 'A+': 17, 'A': 23, 'B+': 40, 'B': 15, 'C+': 5 }
        ]
      },

      // Market Maker Performance Rankings
      orderBook: {
        rankings: [
          {
            id: 1,
            rank: 1,
            name: 'Alpha Liquidity',
            specialty: 'Institutional Trading',
            grade: 'A+',
            score: 0.96,
            uptime: 99.8,
            spread: 0.12,
            volume: 2.4
          },
          {
            id: 2,
            rank: 2,
            name: 'Prime Market Makers',
            specialty: 'DeFi Protocols',
            grade: 'A+',
            score: 0.94,
            uptime: 99.6,
            spread: 0.15,
            volume: 1.8
          },
          {
            id: 3,
            rank: 3,
            name: 'CryptoFlow Capital',
            specialty: 'Multi-Chain',
            grade: 'A',
            score: 0.91,
            uptime: 99.4,
            spread: 0.18,
            volume: 1.5
          },
          {
            id: 4,
            rank: 4,
            name: 'LiquidBridge',
            specialty: 'Cross-Chain',
            grade: 'A',
            score: 0.89,
            uptime: 99.2,
            spread: 0.21,
            volume: 1.2
          },
          {
            id: 5,
            rank: 5,
            name: 'Velocity Trading',
            specialty: 'High-Frequency',
            grade: 'B+',
            score: 0.85,
            uptime: 98.9,
            spread: 0.25,
            volume: 0.9
          }
        ]
      },

      // Individual Market Maker Pillar Performance Data
      trades: {
        makerName: 'Alpha Liquidity',
        pillars: [
          {
            name: 'Reputation',
            icon: 'Shield',
            score: 0.94
          },
          {
            name: 'Balance Sheet',
            icon: 'DollarSign',
            score: 0.96
          },
          {
            name: 'Communication',
            icon: 'MessageSquare',
            score: 0.89
          },
          {
            name: 'Pricing',
            icon: 'Target',
            score: 0.92
          },
          {
            name: 'Technology',
            icon: 'Cpu',
            score: 0.95
          },
          {
            name: 'DeFi Integration',
            icon: 'Link',
            score: 0.87
          }
        ]
      },

      // Alerts Data - HonestMM Red Flag Alerts
      alerts: [
        {
          id: 1,
          type: 'error',
          message: 'Arken: Balance Sheet Insolvency - Negative PnL detected',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          active: true,
          marketMaker: 'Arken',
          redFlagType: 'Balance Sheet Insolvency',
          severity: 'critical'
        },
        {
          id: 2,
          type: 'warning',
          message: 'MarketKing: Communication Blackout - Uptime below 95%',
          timestamp: new Date(Date.now() - 180000), // 3 minutes ago
          active: true,
          marketMaker: 'MarketKing',
          redFlagType: 'Communication Blackout',
          severity: 'high'
        },
        {
          id: 3,
          type: 'error',
          message: 'TokenMaster: Technology Failure - Execution speed >5s',
          timestamp: new Date(Date.now() - 120000), // 2 minutes ago
          active: true,
          marketMaker: 'TokenMaster',
          redFlagType: 'Technology Failure',
          severity: 'critical'
        },
        {
          id: 4,
          type: 'warning',
          message: 'BitTrader: Poor Performance - Success rate <90%',
          timestamp: new Date(Date.now() - 60000), // 1 minute ago
          active: true,
          marketMaker: 'BitTrader',
          redFlagType: 'Poor Performance',
          severity: 'high'
        }
      ]
    }
  }

  // Get market intensity based on time of day
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

  // Generate realistic variation based on metric type
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

  // Generate realistic rating distribution changes
  generateRatingDistribution(currentDistribution) {
    const newDistribution = []
    
    for (let i = 0; i <= 100; i += 20) {
      const currentPoint = currentDistribution.find(p => p.x === i) || {
        x: i,
        'A+': 12 + Math.random() * 2,
        'A': 18 + Math.random() * 2,
        'B+': 45 + Math.random() * 3,
        'B': 20 + Math.random() * 2,
        'C+': 5 + Math.random() * 1
      }
      
      // Add more noticeable variations to create visible trends
      const variation = (Math.random() - 0.5) * 1.5
      const trend = Math.sin(i * 0.1 + this.updateCount * 0.05) * 0.8
      const newPoint = {
        x: i,
        'A+': Math.max(8, Math.min(18, currentPoint['A+'] + variation + trend)),
        'A': Math.max(12, Math.min(25, currentPoint['A'] + variation - trend * 0.5)),
        'B+': Math.max(35, Math.min(55, currentPoint['B+'] + variation - trend * 0.3)),
        'B': Math.max(15, Math.min(28, currentPoint['B'] + variation + trend * 0.7)),
        'C+': Math.max(2, Math.min(10, currentPoint['C+'] + variation + trend * 0.2))
      }
      
      newDistribution.push(newPoint)
    }
    
    return newDistribution
  }

  // Update metrics (slow changes - every 10 seconds)
  updateMetrics() {
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
    this.notifySubscribers()
  }

  // Update chart data (fast changes - every 1 second)
  updateChart() {
    // Generate realistic rating distribution changes
    const currentDistribution = this.currentData.chart?.ratingDistribution || this.baseData.chart.ratingDistribution
    const newDistribution = this.generateRatingDistribution(currentDistribution)
    
    // Calculate current counts from distribution
    const latestPoint = newDistribution[newDistribution.length - 1]
    const totalMMs = 2459 // Total market makers
    
    this.currentData.chart = {
      ...this.currentData.chart,
      symbol: 'MM Rating Distribution',
      aPlusCount: Math.round(totalMMs * (latestPoint['A+'] / 100)),
      aCount: Math.round(totalMMs * (latestPoint['A'] / 100)),
      bPlusCount: Math.round(totalMMs * (latestPoint['B+'] / 100)),
      bCount: Math.round(totalMMs * (latestPoint['B'] / 100)),
      cPlusCount: Math.round(totalMMs * (latestPoint['C+'] / 100)),
      ratingDistribution: newDistribution
    }
    this.notifySubscribers()
  }

  // Update market maker rankings (medium changes - every 3 seconds)
  updateOrderBook() {
    const currentRankings = this.currentData.orderBook?.rankings || this.baseData.orderBook.rankings
    const marketIntensity = this.getMarketIntensity()
    
    const updatedRankings = currentRankings.map((maker, index) => {
      // Add small variations to performance metrics
      const scoreVariation = (Math.random() - 0.5) * 0.02 * marketIntensity
      const uptimeVariation = (Math.random() - 0.5) * 0.1 * marketIntensity
      const spreadVariation = (Math.random() - 0.5) * 0.02 * marketIntensity
      const volumeVariation = (Math.random() - 0.5) * 0.1 * marketIntensity
      
      const newScore = Math.max(0.5, Math.min(1.0, maker.score + scoreVariation))
      const newUptime = Math.max(95, Math.min(100, maker.uptime + uptimeVariation))
      const newSpread = Math.max(0.05, Math.min(0.5, maker.spread + spreadVariation))
      const newVolume = Math.max(0.1, Math.min(5.0, maker.volume + volumeVariation))
      
      // Determine grade based on score
      let newGrade = 'C+'
      if (newScore >= 0.95) newGrade = 'A+'
      else if (newScore >= 0.90) newGrade = 'A'
      else if (newScore >= 0.80) newGrade = 'B+'
      else if (newScore >= 0.70) newGrade = 'B'
      
      return {
        ...maker,
        score: parseFloat(newScore.toFixed(3)),
        uptime: parseFloat(newUptime.toFixed(1)),
        spread: parseFloat(newSpread.toFixed(2)),
        volume: parseFloat(newVolume.toFixed(1)),
        grade: newGrade
      }
    })
    
    // Sort by score to maintain rankings
    updatedRankings.sort((a, b) => b.score - a.score)
    updatedRankings.forEach((maker, index) => {
      maker.rank = index + 1
    })
    
    this.currentData.orderBook = { rankings: updatedRankings }
    this.notifySubscribers()
  }

  // Update individual market maker pillar performance (cycle through different MMs)
  updateTrades() {
    // Cycle through different market makers every 10 seconds
    if (this.updateCount % 5 === 0) { // Every 10 seconds (5 * 2 seconds)
      const marketMakers = [
        { name: 'Alpha Liquidity', pillars: [
          { name: 'Reputation', icon: 'Shield', score: 0.94 },
          { name: 'Balance Sheet', icon: 'DollarSign', score: 0.96 },
          { name: 'Communication', icon: 'MessageSquare', score: 0.89 },
          { name: 'Pricing', icon: 'Target', score: 0.92 },
          { name: 'Technology', icon: 'Cpu', score: 0.95 },
          { name: 'DeFi Integration', icon: 'Link', score: 0.87 }
        ]},
        { name: 'Prime Market Makers', pillars: [
          { name: 'Reputation', icon: 'Shield', score: 0.91 },
          { name: 'Balance Sheet', icon: 'DollarSign', score: 0.88 },
          { name: 'Communication', icon: 'MessageSquare', score: 0.85 },
          { name: 'Pricing', icon: 'Target', score: 0.89 },
          { name: 'Technology', icon: 'Cpu', score: 0.92 },
          { name: 'DeFi Integration', icon: 'Link', score: 0.94 }
        ]},
        { name: 'CryptoFlow Capital', pillars: [
          { name: 'Reputation', icon: 'Shield', score: 0.87 },
          { name: 'Balance Sheet', icon: 'DollarSign', score: 0.82 },
          { name: 'Communication', icon: 'MessageSquare', score: 0.79 },
          { name: 'Pricing', icon: 'Target', score: 0.85 },
          { name: 'Technology', icon: 'Cpu', score: 0.88 },
          { name: 'DeFi Integration', icon: 'Link', score: 0.76 }
        ]}
      ]
      
      const currentIndex = Math.floor(this.updateCount / 5) % marketMakers.length
      const selectedMaker = marketMakers[currentIndex]
      
      this.currentData.trades = {
        makerName: selectedMaker.name,
        pillars: selectedMaker.pillars
      }
      this.notifySubscribers()
    }
  }

  // Update alerts - HonestMM Red Flag Alerts (every 20 seconds)
  updateAlerts() {
    const newAlerts = [...this.currentData.alerts]
    
    // Occasionally add new red flag alerts (8% chance)
    if (Math.random() < 0.08) {
      const redFlagTypes = [
        {
          type: 'error',
          redFlagType: 'Balance Sheet Insolvency',
          message: 'Negative PnL detected',
          severity: 'critical',
          condition: 'pnl < 0'
        },
        {
          type: 'warning',
          redFlagType: 'Communication Blackout',
          message: 'Uptime below 95%',
          severity: 'high',
          condition: 'uptime < 95%'
        },
        {
          type: 'error',
          redFlagType: 'Technology Failure',
          message: 'Execution speed >5s',
          severity: 'critical',
          condition: 'executionSpeed > 5'
        },
        {
          type: 'warning',
          redFlagType: 'Poor Performance',
          message: 'Success rate <90%',
          severity: 'high',
          condition: 'successRate < 90'
        },
        {
          type: 'error',
          redFlagType: 'Regulatory Issues',
          message: 'Compliance violation detected',
          severity: 'critical',
          condition: 'compliance_issue'
        },
        {
          type: 'warning',
          redFlagType: 'Security Breach',
          message: 'Suspicious activity detected',
          severity: 'high',
          condition: 'security_breach'
        }
      ]
      
      // Get random market maker names from the service
      const marketMakerNames = [
        'Equilibrium', 'OnlyDegens', 'Arken', 'Hexagon', 'Astro', 'CryptoFlow',
        'TradeMaster', 'LiquidityPro', 'MarketKing', 'BitTrader', 'CoinMaker',
        'DigitalFlow', 'TokenMaster', 'BlockChainPro', 'CryptoElite'
      ]
      
      const randomRedFlag = redFlagTypes[Math.floor(Math.random() * redFlagTypes.length)]
      const randomMaker = marketMakerNames[Math.floor(Math.random() * marketMakerNames.length)]
      
      newAlerts.push({
        id: Date.now(),
        type: randomRedFlag.type,
        message: `${randomMaker}: ${randomRedFlag.redFlagType} - ${randomRedFlag.message}`,
        timestamp: new Date(),
        active: true,
        marketMaker: randomMaker,
        redFlagType: randomRedFlag.redFlagType,
        severity: randomRedFlag.severity,
        condition: randomRedFlag.condition
      })
    }
    
    // Occasionally resolve old alerts (12% chance)
    if (Math.random() < 0.12) {
      const activeAlerts = newAlerts.filter(alert => alert.active)
      if (activeAlerts.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeAlerts.length)
        const alertToResolve = activeAlerts[randomIndex]
        alertToResolve.active = false
        alertToResolve.resolvedAt = new Date()
        alertToResolve.resolution = 'Auto-resolved by system'
      }
    }
    
    // Keep only last 20 alerts to prevent memory issues
    if (newAlerts.length > 20) {
      newAlerts.splice(0, newAlerts.length - 20)
    }
    
    this.currentData.alerts = newAlerts
    this.notifySubscribers()
  }

  // Start realistic updates with different frequencies
  startUpdates() {
    if (this.isRunning) return
    
    this.isRunning = true
    
    // Different update frequencies for different components
    this.intervals.metrics = setInterval(() => this.updateMetrics(), 10000) // 10 seconds
    this.intervals.chart = setInterval(() => this.updateChart(), 1000) // 1 second
    this.intervals.orderBook = setInterval(() => this.updateOrderBook(), 3000) // 3 seconds
    this.intervals.trades = setInterval(() => this.updateTrades(), 2000) // 2 seconds
    this.intervals.alerts = setInterval(() => this.updateAlerts(), 15000) // 15 seconds
    
    // Initial updates
    this.updateMetrics()
    this.updateChart()
    this.updateOrderBook()
    this.updateTrades()
    this.updateAlerts()
  }

  // Stop all updates
  stopUpdates() {
    Object.values(this.intervals).forEach(interval => clearInterval(interval))
    this.intervals = {}
    this.isRunning = false
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

  // Get current data
  getCurrentData() {
    return this.currentData
  }

  // Get update status
  isUpdating() {
    return this.isRunning
  }
}

// Create singleton instance
const realisticDataService = new RealisticDataService()

export default realisticDataService
