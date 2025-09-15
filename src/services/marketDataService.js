// Market Data Service - Generates realistic market maker data with real-time updates
import { Scale, Rocket, Castle, Hexagon, Sparkles, Waves, Crown, Droplets, Globe, Target, Link, Gem, Building } from 'lucide-react'

class MarketDataService {
  constructor() {
    this.subscribers = new Set()
    this.isRunning = false
    this.updateInterval = null
    this.baseData = this.generateBaseData()
    this.currentData = [...this.baseData]
  }

  // Generate base market maker data
  generateBaseData() {
    const baseMarketMakers = [
      { 
        name: 'Equilibrium', 
        basePairs: 277, 
        baseAvgSpread: 19.3, 
        baseVolume: 1.05, 
        baseInventory: 2.1,
        basePnl: 45.2,
        baseUptime: 99.8,
        baseLatency: 2.3,
        baseExecutionSpeed: 1.8,
        baseSuccessRate: 98.7,
        baseVolumeCapacity: 5.2,
        status: 'active',
        profile: {
          avatar: Scale,
          description: 'Leading market maker specializing in DeFi protocols',
          location: 'Singapore',
          established: '2021',
          teamSize: '25',
          specialties: ['DeFi', 'Yield Farming', 'Liquidity Mining']
        }
      },
      { 
        name: 'OnlyDegens', 
        basePairs: 169, 
        baseAvgSpread: 25.6, 
        baseVolume: 4.07, 
        baseInventory: 3.2,
        basePnl: 78.9,
        baseUptime: 99.5,
        baseLatency: 1.8,
        baseExecutionSpeed: 0.9,
        baseSuccessRate: 97.2,
        baseVolumeCapacity: 8.5,
        status: 'active',
        profile: {
          avatar: Rocket,
          description: 'High-frequency trading specialist with meme coin expertise',
          location: 'New York',
          established: '2020',
          teamSize: '18',
          specialties: ['Meme Coins', 'High-Frequency Trading', 'Social Trading']
        }
      },
      { 
        name: 'Arken', 
        basePairs: 142, 
        baseAvgSpread: 18.9, 
        baseVolume: 2.33, 
        baseInventory: 1.8,
        basePnl: 32.1,
        baseUptime: 98.9,
        baseLatency: 3.1,
        baseExecutionSpeed: 2.4,
        baseSuccessRate: 96.1,
        baseVolumeCapacity: 3.8,
        status: 'warning',
        profile: {
          avatar: Castle,
          description: 'Institutional-grade market maker with traditional finance background',
          location: 'London',
          established: '2019',
          teamSize: '32',
          specialties: ['Institutional Trading', 'Risk Management', 'Compliance']
        }
      },
      { 
        name: 'Hexagon', 
        basePairs: 98, 
        baseAvgSpread: 22.1, 
        baseVolume: 1.89, 
        baseInventory: 1.2,
        basePnl: 28.4,
        baseUptime: 99.2,
        baseLatency: 2.7,
        baseExecutionSpeed: 1.6,
        baseSuccessRate: 98.9,
        baseVolumeCapacity: 2.5,
        status: 'active',
        profile: {
          avatar: Hexagon,
          description: 'Geometric trading algorithms with mathematical precision',
          location: 'Tokyo',
          established: '2022',
          teamSize: '12',
          specialties: ['Algorithmic Trading', 'Mathematical Models', 'Quantitative Analysis']
        }
      },
      { 
        name: 'Astro', 
        basePairs: 76, 
        baseAvgSpread: 20.5, 
        baseVolume: 3.21, 
        baseInventory: 2.8,
        basePnl: 67.3,
        baseUptime: 99.9,
        baseLatency: 1.5,
        baseExecutionSpeed: 0.7,
        baseSuccessRate: 99.2,
        baseVolumeCapacity: 4.2,
        status: 'active',
        profile: {
          avatar: Sparkles,
          description: 'Space-age technology meets cryptocurrency market making',
          location: 'San Francisco',
          established: '2021',
          teamSize: '20',
          specialties: ['AI Trading', 'Machine Learning', 'Advanced Analytics']
        }
      },
      { 
        name: 'CryptoFlow', 
        basePairs: 203, 
        baseAvgSpread: 16.7, 
        baseVolume: 5.42, 
        baseInventory: 4.1,
        basePnl: 92.5,
        baseUptime: 99.7,
        baseLatency: 1.2,
        baseExecutionSpeed: 0.5,
        baseSuccessRate: 99.5,
        baseVolumeCapacity: 12.8,
        status: 'active',
        profile: {
          avatar: Waves,
          description: 'Top-tier market maker with exceptional liquidity provision',
          location: 'Zurich',
          established: '2020',
          teamSize: '28',
          specialties: ['Cross-Chain Trading', 'Liquidity Provision', 'Market Making']
        }
      },
      { 
        name: 'TradeMaster', 
        basePairs: 156, 
        baseAvgSpread: 21.4, 
        baseVolume: 2.87, 
        baseInventory: 2.3,
        basePnl: 41.7,
        baseUptime: 99.1,
        baseLatency: 2.8,
        baseExecutionSpeed: 1.2,
        baseSuccessRate: 97.8,
        baseVolumeCapacity: 4.8,
        status: 'active',
        profile: {
          avatar: Crown,
          description: 'Master traders with decades of financial market experience',
          location: 'Hong Kong',
          established: '2018',
          teamSize: '22',
          specialties: ['Traditional Finance', 'Options Trading', 'Portfolio Management']
        }
      },
      { 
        name: 'LiquidityPro', 
        basePairs: 189, 
        baseAvgSpread: 17.8, 
        baseVolume: 3.65, 
        baseInventory: 3.7,
        basePnl: 58.3,
        baseUptime: 99.6,
        baseLatency: 1.9,
        baseExecutionSpeed: 0.8,
        baseSuccessRate: 98.3,
        baseVolumeCapacity: 7.2,
        status: 'active',
        profile: {
          avatar: Droplets,
          description: 'Professional liquidity providers with institutional backing',
          location: 'Dubai',
          established: '2021',
          teamSize: '24',
          specialties: ['Liquidity Mining', 'Staking', 'Yield Optimization']
        }
      },
      { 
        name: 'MarketKing', 
        basePairs: 134, 
        baseAvgSpread: 23.2, 
        baseVolume: 1.98, 
        baseInventory: 1.5,
        basePnl: 25.9,
        baseUptime: 98.7,
        baseLatency: 3.5,
        baseExecutionSpeed: 2.1,
        baseSuccessRate: 95.4,
        baseVolumeCapacity: 2.8,
        status: 'warning',
        profile: {
          avatar: Crown,
          description: 'Emerging market maker with ambitious growth plans',
          location: 'Miami',
          established: '2023',
          teamSize: '8',
          specialties: ['Emerging Markets', 'Startup Tokens', 'Community Building']
        }
      },
      { 
        name: 'BitTrader', 
        basePairs: 167, 
        baseAvgSpread: 19.6, 
        baseVolume: 2.54, 
        baseInventory: 2.9,
        basePnl: 36.8,
        baseUptime: 99.4,
        baseLatency: 2.1,
        baseExecutionSpeed: 1.1,
        baseSuccessRate: 98.1,
        baseVolumeCapacity: 4.1,
        status: 'active',
        profile: {
          avatar: Building,
          description: 'Bitcoin-focused market maker with deep blockchain expertise',
          location: 'Austin',
          established: '2020',
          teamSize: '15',
          specialties: ['Bitcoin', 'Blockchain Technology', 'Cryptocurrency Trading']
        }
      },
      { 
        name: 'CoinMaker', 
        basePairs: 145, 
        baseAvgSpread: 20.8, 
        baseVolume: 3.12, 
        baseInventory: 2.6,
        basePnl: 49.1,
        baseUptime: 99.3,
        baseLatency: 2.4,
        baseExecutionSpeed: 1.4,
        baseSuccessRate: 97.5,
        baseVolumeCapacity: 5.3,
        status: 'active',
        profile: {
          avatar: Target,
          description: 'Multi-coin specialist with comprehensive altcoin coverage',
          location: 'Seoul',
          established: '2021',
          teamSize: '19',
          specialties: ['Altcoins', 'Token Analysis', 'Market Research']
        }
      },
      { 
        name: 'DigitalFlow', 
        basePairs: 178, 
        baseAvgSpread: 18.2, 
        baseVolume: 4.28, 
        baseInventory: 3.4,
        basePnl: 73.6,
        baseUptime: 99.8,
        baseLatency: 1.6,
        baseExecutionSpeed: 0.6,
        baseSuccessRate: 99.1,
        baseVolumeCapacity: 8.9,
        status: 'active',
        profile: {
          avatar: Globe,
          description: 'Digital-first market maker with cutting-edge technology',
          location: 'Berlin',
          established: '2020',
          teamSize: '26',
          specialties: ['Digital Assets', 'Web3', 'Decentralized Finance']
        }
      },
      { 
        name: 'TokenMaster', 
        basePairs: 112, 
        baseAvgSpread: 24.1, 
        baseVolume: 1.76, 
        baseInventory: 1.8,
        basePnl: 22.4,
        baseUptime: 98.5,
        baseLatency: 3.2,
        baseExecutionSpeed: 2.8,
        baseSuccessRate: 94.7,
        baseVolumeCapacity: 2.2,
        status: 'warning',
        profile: {
          avatar: Target,
          description: 'Token-focused market maker specializing in new listings',
          location: 'Toronto',
          established: '2022',
          teamSize: '10',
          specialties: ['New Listings', 'Token Launches', 'Early Stage Trading']
        }
      },
      { 
        name: 'BlockChainPro', 
        basePairs: 198, 
        baseAvgSpread: 17.5, 
        baseVolume: 3.89, 
        baseInventory: 3.8,
        basePnl: 81.2,
        baseUptime: 99.7,
        baseLatency: 1.4,
        baseExecutionSpeed: 0.4,
        baseSuccessRate: 99.3,
        baseVolumeCapacity: 9.1,
        status: 'active',
        profile: {
          avatar: Link,
          description: 'Blockchain infrastructure experts with enterprise solutions',
          location: 'Amsterdam',
          established: '2019',
          teamSize: '30',
          specialties: ['Blockchain Infrastructure', 'Enterprise Solutions', 'Smart Contracts']
        }
      },
      { 
        name: 'CryptoElite', 
        basePairs: 165, 
        baseAvgSpread: 19.7, 
        baseVolume: 2.96, 
        baseInventory: 2.7,
        basePnl: 44.5,
        baseUptime: 99.2,
        baseLatency: 2.2,
        baseExecutionSpeed: 1.3,
        baseSuccessRate: 98.6,
        baseVolumeCapacity: 4.7,
        status: 'active',
        profile: {
          avatar: Gem,
          description: 'Elite cryptocurrency traders with premium service offerings',
          location: 'Monaco',
          established: '2021',
          teamSize: '16',
          specialties: ['Premium Trading', 'VIP Services', 'Exclusive Access']
        }
      }
    ]

    return baseMarketMakers
  }

  // Generate realistic market behavior based on metric type
  generateRealisticVariation(baseValue, metricType, volatility = 0.05) {
    let variation = 0
    
    switch (metricType) {
      case 'pairs':
        // Pairs change very slowly (realistic)
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.1)
        break
      case 'spread':
        // Spreads change moderately
        variation = (Math.random() - 0.5) * 2 * volatility
        break
      case 'volume':
        // Volume only increases (realistic market behavior)
        variation = Math.random() * volatility * 0.3
        break
      case 'inventory':
        // Inventory changes moderately
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.4)
        break
      case 'pnl':
        // PnL can change significantly
        variation = (Math.random() - 0.5) * 2 * volatility
        break
      case 'uptime':
        // Uptime is very stable, only small decreases
        variation = -Math.random() * volatility * 0.05
        break
      case 'latency':
        // Latency is stable with small variations
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.2)
        break
      case 'executionSpeed':
        // Execution speed is stable with small variations
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.3)
        break
      case 'successRate':
        // Success rate is very stable
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.1)
        break
      case 'volumeCapacity':
        // Volume capacity changes slowly
        variation = (Math.random() - 0.5) * 2 * (volatility * 0.2)
        break
      default:
        variation = (Math.random() - 0.5) * 2 * volatility
    }
    
    return baseValue * (1 + variation)
  }

  // Generate activity pattern (array of 1s and 0s)
  generateActivity() {
    const activity = []
    for (let i = 0; i < 10; i++) {
      // Higher chance of activity for better performers
      const activityChance = Math.random() > 0.3
      activity.push(activityChance ? 1 : 0)
    }
    return activity
  }

  // Generate last trade time
  generateLastTrade() {
    const seconds = Math.floor(Math.random() * 10) + 1
    return `${seconds}s ago`
  }

  // Calculate HonestMM Rating Framework scores for each pillar (0.0-1.0)
  calculatePillarScores(maker) {
    const spread = parseFloat(maker.avgSpread)
    const successRate = parseFloat(maker.successRate)
    const uptime = parseFloat(maker.uptime)
    const executionSpeed = parseFloat(maker.executionSpeed)
    const volume = parseFloat(maker.volume.replace('$', '').replace('M', ''))
    
    // R - Reputation (Track record, compliance, endorsements)
    const reputation = this.calculateReputationScore(maker)
    
    // B - Balance Sheet (Capital adequacy, liquidity, risk controls)
    const balanceSheet = this.calculateBalanceSheetScore(maker, volume)
    
    // C - Communication (Transparency, incident reporting, responsiveness)
    const communication = this.calculateCommunicationScore(maker)
    
    // P - Pricing (Fee transparency, cost fairness, value delivery)
    const pricing = this.calculatePricingScore(maker, spread)
    
    // T - Technology (Uptime, latency, security)
    const technology = this.calculateTechnologyScore(maker, uptime, executionSpeed)
    
    // D - DeFi Integration (On-chain presence, smart contracts, multi-chain)
    const defi = this.calculateDeFiScore(maker)
    
    return { reputation, balanceSheet, communication, pricing, technology, defi }
  }

  // R - Reputation Score
  calculateReputationScore(maker) {
    let score = 0.5 // Base score
    
    // Track record (tenure)
    const established = parseInt(maker.profile.established)
    const yearsActive = 2025 - established
    if (yearsActive >= 5) score += 0.3
    else if (yearsActive >= 3) score += 0.2
    else if (yearsActive >= 1) score += 0.1
    
    // Regulatory compliance (simulated based on location)
    const tier1Jurisdictions = ['Singapore', 'New York', 'London', 'Amsterdam', 'Monaco']
    if (tier1Jurisdictions.includes(maker.profile.location)) score += 0.2
    
    // Client endorsements (simulated based on volume and status)
    if (parseFloat(maker.volume.replace('$', '').replace('M', '')) > 3) score += 0.1
    if (maker.status === 'active') score += 0.1
    
    return Math.min(1.0, score)
  }

  // B - Balance Sheet Score
  calculateBalanceSheetScore(maker, volume) {
    let score = 0.3 // Base score
    
    // Capital adequacy (based on volume capacity)
    const volumeCapacity = parseFloat(maker.volumeCapacity.replace('$', '').replace('M', ''))
    if (volumeCapacity >= 8) score += 0.4
    else if (volumeCapacity >= 5) score += 0.3
    else if (volumeCapacity >= 3) score += 0.2
    else score += 0.1
    
    // Liquidity reserves (simulated based on PnL and uptime)
    const pnl = parseFloat(maker.pnl.replace('+$', '').replace('K', ''))
    if (pnl > 50 && parseFloat(maker.uptime) > 99.5) score += 0.2
    else if (pnl > 30) score += 0.1
    
    // Risk controls (simulated based on success rate)
    const successRate = parseFloat(maker.successRate)
    if (successRate >= 99) score += 0.1
    else if (successRate >= 98) score += 0.05
    
    return Math.min(1.0, score)
  }

  // C - Communication Score
  calculateCommunicationScore(maker) {
    let score = 0.4 // Base score
    
    // Incident reporting (based on status and uptime)
    if (maker.status === 'active' && parseFloat(maker.uptime) > 99) score += 0.3
    else if (maker.status === 'warning') score += 0.1
    
    // Stakeholder updates (simulated based on activity)
    const activeCount = maker.activity.filter(active => active).length
    if (activeCount >= 8) score += 0.2
    else if (activeCount >= 6) score += 0.1
    
    // Counterparty liaison (simulated based on response time)
    const executionSpeed = parseFloat(maker.executionSpeed)
    if (executionSpeed <= 1) score += 0.1
    else if (executionSpeed <= 2) score += 0.05
    
    return Math.min(1.0, score)
  }

  // P - Pricing Score
  calculatePricingScore(maker, spread) {
    let score = 0.5 // Base score
    
    // Fee transparency (simulated based on spread consistency)
    if (spread <= 20) score += 0.2
    else if (spread <= 25) score += 0.1
    
    // Cost fairness (lower spreads = better)
    if (spread <= 15) score += 0.2
    else if (spread <= 20) score += 0.15
    else if (spread <= 25) score += 0.1
    else score += 0.05
    
    // Value delivery (based on success rate and volume)
    const successRate = parseFloat(maker.successRate)
    if (successRate >= 99) score += 0.1
    else if (successRate >= 98) score += 0.05
    
    return Math.min(1.0, score)
  }

  // T - Technology Score
  calculateTechnologyScore(maker, uptime, executionSpeed) {
    let score = 0.3 // Base score
    
    // System uptime
    if (uptime >= 99.9) score += 0.4
    else if (uptime >= 99.5) score += 0.3
    else if (uptime >= 99) score += 0.2
    else score += 0.1
    
    // Latency & throughput
    if (executionSpeed <= 1) score += 0.2
    else if (executionSpeed <= 1.5) score += 0.15
    else if (executionSpeed <= 2) score += 0.1
    else score += 0.05
    
    // Security posture (simulated based on status)
    if (maker.status === 'active') score += 0.1
    
    return Math.min(1.0, score)
  }

  // D - DeFi Integration Score
  calculateDeFiScore(maker) {
    let score = 0.4 // Base score
    
    // On-chain liquidity (simulated based on pairs and volume)
    const pairs = maker.pairs
    if (pairs >= 200) score += 0.3
    else if (pairs >= 150) score += 0.2
    else if (pairs >= 100) score += 0.1
    
    // Smart contract security (simulated based on team size and location)
    const teamSize = parseInt(maker.profile.teamSize)
    if (teamSize >= 25) score += 0.2
    else if (teamSize >= 15) score += 0.1
    
    // Multi-chain coverage (simulated based on specialties)
    const specialties = maker.profile.specialties
    if (specialties.includes('DeFi') || specialties.includes('Web3')) score += 0.1
    
    return Math.min(1.0, score)
  }

  // Check for red flags that result in automatic F grade
  checkRedFlags(maker) {
    const redFlags = []
    
    // Balance Sheet Insolvency (simulated - negative PnL)
    const pnl = parseFloat(maker.pnl.replace('+$', '').replace('K', ''))
    if (pnl < 0) redFlags.push('Balance Sheet Insolvency')
    
    // Communication Blackout (simulated - very low uptime)
    if (parseFloat(maker.uptime) < 95) redFlags.push('Communication Blackout')
    
    // Technology failure (simulated - very slow execution)
    if (parseFloat(maker.executionSpeed) > 5) redFlags.push('Technology Failure')
    
    // Low success rate
    if (parseFloat(maker.successRate) < 90) redFlags.push('Poor Performance')
    
    return redFlags
  }

  // Calculate HonestMM grade based on pillar scores
  calculateHonestMMGrade(pillarScores, redFlags) {
    // If any red flags, automatic F
    if (redFlags.length > 0) return 'F'
    
    // Calculate composite score (0.0-1.0)
    const { reputation, balanceSheet, communication, pricing, technology, defi } = pillarScores
    const compositeScore = (reputation + balanceSheet + communication + pricing + technology + defi) / 6
    
    // Convert to percentage for display
    const percentageScore = Math.round(compositeScore * 100)
    
    // Map to letter grade according to HonestMM framework
    if (compositeScore >= 0.95 && balanceSheet >= 0.90 && technology >= 0.90 && 
        reputation >= 0.80 && communication >= 0.80 && pricing >= 0.80 && defi >= 0.80) {
      return { grade: 'A+', score: percentageScore }
    }
    if (compositeScore >= 0.90 && balanceSheet >= 0.85 && 
        reputation >= 0.75 && communication >= 0.75 && pricing >= 0.75 && technology >= 0.75 && defi >= 0.75) {
      return { grade: 'A', score: percentageScore }
    }
    if (compositeScore >= 0.75 && pricing >= 0.70 && defi >= 0.70) {
      return { grade: 'B', score: percentageScore }
    }
    if (compositeScore >= 0.60) {
      return { grade: 'C', score: percentageScore }
    }
    if (compositeScore >= 0.50) {
      return { grade: 'D', score: percentageScore }
    }
    return { grade: 'F', score: percentageScore }
  }

  // Update market maker data with realistic variations
  updateMarketMakerData(maker) {
    const updatedMaker = {
      ...maker,
      // Pairs change very slowly (realistic)
      pairs: Math.round(this.generateRealisticVariation(maker.basePairs, 'pairs', 0.01)),
      // Spreads change moderately
      avgSpread: this.generateRealisticVariation(maker.baseAvgSpread, 'spread', 0.03).toFixed(1),
      // Volume only increases (realistic market behavior)
      volume: `$${(this.generateRealisticVariation(maker.baseVolume, 'volume', 0.02)).toFixed(2)}M`,
      // Inventory changes moderately
      inventory: `$${(this.generateRealisticVariation(maker.baseInventory, 'inventory', 0.02)).toFixed(1)}M`,
      // PnL can change significantly
      pnl: `+$${(this.generateRealisticVariation(maker.basePnl, 'pnl', 0.08)).toFixed(1)}K`,
      // Uptime is very stable, only small decreases
      uptime: `${(this.generateRealisticVariation(maker.baseUptime, 'uptime', 0.001)).toFixed(1)}%`,
      // Latency is stable with small variations
      latency: `${(this.generateRealisticVariation(maker.baseLatency, 'latency', 0.01)).toFixed(1)}ms`,
      // Execution speed is stable with small variations
      executionSpeed: `${(this.generateRealisticVariation(maker.baseExecutionSpeed, 'executionSpeed', 0.02)).toFixed(1)}s`,
      // Success rate is very stable
      successRate: `${(this.generateRealisticVariation(maker.baseSuccessRate, 'successRate', 0.002)).toFixed(1)}%`,
      // Volume capacity changes slowly
      volumeCapacity: `$${(this.generateRealisticVariation(maker.baseVolumeCapacity, 'volumeCapacity', 0.01)).toFixed(1)}M`,
      bestSpreadToday: `${(this.generateRealisticVariation(maker.baseAvgSpread, 'spread', 0.02)).toFixed(1)}%`,
      activity: this.generateActivity(),
      lastTrade: this.generateLastTrade(),
      // Occasionally change status (very rare)
      status: Math.random() > 0.98 ? (maker.status === 'active' ? 'warning' : 'active') : maker.status
    }

    // Calculate HonestMM Rating Framework scores
    const pillarScores = this.calculatePillarScores(updatedMaker)
    const redFlags = this.checkRedFlags(updatedMaker)
    const honestMMGrade = this.calculateHonestMMGrade(pillarScores, redFlags)
    
    // Add HonestMM data to the maker
    updatedMaker.grade = honestMMGrade.grade
    updatedMaker.score = honestMMGrade.score
    updatedMaker.pillarScores = pillarScores
    updatedMaker.redFlags = redFlags
    updatedMaker.honestMMScore = honestMMGrade.score

    return updatedMaker
  }

  // Get current market data
  getCurrentData() {
    return this.currentData
  }

  // Update all market maker data
  updateData() {
    this.currentData = this.baseData.map(maker => this.updateMarketMakerData(maker))
    this.notifySubscribers()
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
}

// Create singleton instance
const marketDataService = new MarketDataService()

export default marketDataService
