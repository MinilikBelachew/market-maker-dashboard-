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
        name: 'Wintermute', 
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
          location: 'London, UK',
          established: '2021',
          teamSize: '25',
          specialties: ['DeFi', 'Yield Farming', 'Liquidity Mining']
        }
      },
      { 
        name: 'GSR', 
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
          location: 'London, UK',
          established: '2020',
          teamSize: '18',
          specialties: ['Meme Coins', 'High-Frequency Trading', 'Social Trading']
        }
      },
      { 
        name: 'IMC', 
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
          location: 'Amsterdam, Netherlands',
          established: '2019',
          teamSize: '32',
          specialties: ['Institutional Trading', 'Risk Management', 'Compliance']
        }
      },
      { 
        name: 'Flow Traders', 
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
          location: 'Amsterdam, Netherlands',
          established: '2022',
          teamSize: '12',
          specialties: ['Algorithmic Trading', 'Mathematical Models', 'Quantitative Analysis']
        }
      },
      { 
        name: 'Reform DAO', 
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
          location: 'Malta',
          established: '2021',
          teamSize: '20',
          specialties: ['AI Trading', 'Machine Learning', 'Advanced Analytics']
        }
      },
      { 
        name: 'Portofino', 
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
          location: 'Zug, Switzerland',
          established: '2020',
          teamSize: '28',
          specialties: ['Cross-Chain Trading', 'Liquidity Provision', 'Market Making']
        }
      },
      { 
        name: 'Kairon Labs', 
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
          location: 'Antwerp, Belgium',
          established: '2018',
          teamSize: '22',
          specialties: ['Traditional Finance', 'Options Trading', 'Portfolio Management']
        }
      },
      { 
        name: 'Gotbit', 
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
          location: 'Lisbon, Portugal',
          established: '2021',
          teamSize: '24',
          specialties: ['Liquidity Mining', 'Staking', 'Yield Optimization']
        }
      },
      { 
        name: 'DWF Labs', 
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
          location: 'Dubai, UAE',
          established: '2023',
          teamSize: '8',
          specialties: ['Emerging Markets', 'Startup Tokens', 'Community Building']
        }
      },
      { 
        name: 'Flowdesk', 
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
          location: 'London, UK',
          established: '2020',
          teamSize: '15',
          specialties: ['Bitcoin', 'Blockchain Technology', 'Cryptocurrency Trading']
        }
      },
      { 
        name: 'Orcabay', 
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
          location: 'Ljubljana, Slovenia',
          established: '2021',
          teamSize: '19',
          specialties: ['Altcoins', 'Token Analysis', 'Market Research']
        }
      },
      { 
        name: 'Acheron Trading', 
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
          location: 'Singapore',
          established: '2020',
          teamSize: '26',
          specialties: ['Digital Assets', 'Web3', 'Decentralized Finance']
        }
      },
      { 
        name: 'Amber Group', 
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
          location: 'Singapore',
          established: '2022',
          teamSize: '10',
          specialties: ['New Listings', 'Token Launches', 'Early Stage Trading']
        }
      },
      { 
        name: 'QCP Capital', 
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
          location: 'Singapore',
          established: '2019',
          teamSize: '30',
          specialties: ['Blockchain Infrastructure', 'Enterprise Solutions', 'Smart Contracts']
        }
      },
      { 
        name: 'Keyrock', 
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
          location: 'Brussels, Belgium',
          established: '2021',
          teamSize: '16',
          specialties: ['Premium Trading', 'VIP Services', 'Exclusive Access']
        }
      },
      { 
        name: 'Algoz', 
        basePairs: 120, 
        baseAvgSpread: 21.5, 
        baseVolume: 1.85, 
        baseInventory: 1.9,
        basePnl: 28.7,
        baseUptime: 98.8,
        baseLatency: 2.9,
        baseExecutionSpeed: 1.7,
        baseSuccessRate: 96.8,
        baseVolumeCapacity: 3.2,
        status: 'active',
        profile: {
          avatar: Target,
          description: 'Innovative trading solutions with advanced algorithms',
          location: 'Tel Aviv, Israel',
          established: '2020',
          teamSize: '14',
          specialties: ['Algorithmic Trading', 'Innovation', 'Technology']
        }
      },
      { 
        name: 'Bluesky Capital', 
        basePairs: 95, 
        baseAvgSpread: 23.8, 
        baseVolume: 1.42, 
        baseInventory: 1.6,
        basePnl: 19.3,
        baseUptime: 98.2,
        baseLatency: 3.4,
        baseExecutionSpeed: 2.3,
        baseSuccessRate: 95.1,
        baseVolumeCapacity: 2.1,
        status: 'warning',
        profile: {
          avatar: Globe,
          description: 'Capital markets specialist with traditional finance expertise',
          location: 'New York, USA',
          established: '2019',
          teamSize: '11',
          specialties: ['Capital Markets', 'Traditional Finance', 'Investment']
        }
      },
      { 
        name: 'Nestoris.io', 
        basePairs: 68, 
        baseAvgSpread: 26.2, 
        baseVolume: 0.98, 
        baseInventory: 1.1,
        basePnl: 12.4,
        baseUptime: 97.5,
        baseLatency: 4.1,
        baseExecutionSpeed: 3.2,
        baseSuccessRate: 92.8,
        baseVolumeCapacity: 1.5,
        status: 'warning',
        profile: {
          avatar: Building,
          description: 'Emerging market maker with focus on new technologies',
          location: '(Unknown)',
          established: '2023',
          teamSize: '6',
          specialties: ['Emerging Tech', 'New Markets', 'Innovation']
        }
      },
      { 
        name: 'Kronos Research', 
        basePairs: 185, 
        baseAvgSpread: 18.7, 
        baseVolume: 3.76, 
        baseInventory: 3.2,
        basePnl: 67.8,
        baseUptime: 99.4,
        baseLatency: 1.8,
        baseExecutionSpeed: 0.9,
        baseSuccessRate: 98.5,
        baseVolumeCapacity: 6.8,
        status: 'active',
        profile: {
          avatar: Crown,
          description: 'Research-driven market maker with quantitative approach',
          location: 'Taipei, Taiwan',
          established: '2018',
          teamSize: '23',
          specialties: ['Quantitative Research', 'Data Analysis', 'Market Research']
        }
      },
      { 
        name: 'Efficient Frontier', 
        basePairs: 156, 
        baseAvgSpread: 20.1, 
        baseVolume: 2.89, 
        baseInventory: 2.4,
        basePnl: 43.6,
        baseUptime: 99.1,
        baseLatency: 2.3,
        baseExecutionSpeed: 1.4,
        baseSuccessRate: 97.9,
        baseVolumeCapacity: 4.3,
        status: 'active',
        profile: {
          avatar: Target,
          description: 'Efficient trading strategies with optimal execution',
          location: 'New York, USA',
          established: '2020',
          teamSize: '17',
          specialties: ['Efficient Trading', 'Optimization', 'Strategy']
        }
      },
      { 
        name: 'AlphaTheta', 
        basePairs: 134, 
        baseAvgSpread: 22.3, 
        baseVolume: 2.15, 
        baseInventory: 1.8,
        basePnl: 31.2,
        baseUptime: 98.7,
        baseLatency: 2.8,
        baseExecutionSpeed: 1.9,
        baseSuccessRate: 96.4,
        baseVolumeCapacity: 3.1,
        status: 'active',
        profile: {
          avatar: Sparkles,
          description: 'Alpha generation through advanced mathematical models',
          location: 'Tokyo, Japan',
          established: '2021',
          teamSize: '13',
          specialties: ['Alpha Generation', 'Mathematical Models', 'Quantitative Trading']
        }
      },
      { 
        name: 'Arrakis Finance', 
        basePairs: 89, 
        baseAvgSpread: 24.7, 
        baseVolume: 1.67, 
        baseInventory: 1.4,
        basePnl: 22.8,
        baseUptime: 98.3,
        baseLatency: 3.1,
        baseExecutionSpeed: 2.2,
        baseSuccessRate: 95.7,
        baseVolumeCapacity: 2.3,
        status: 'active',
        profile: {
          avatar: Waves,
          description: 'DeFi-focused market maker with liquidity solutions',
          location: 'San Francisco, USA',
          established: '2022',
          teamSize: '9',
          specialties: ['DeFi', 'Liquidity Solutions', 'Decentralized Trading']
        }
      },
      { 
        name: 'CKS Systems', 
        basePairs: 112, 
        baseAvgSpread: 23.1, 
        baseVolume: 1.93, 
        baseInventory: 1.7,
        basePnl: 26.4,
        baseUptime: 98.9,
        baseLatency: 2.6,
        baseExecutionSpeed: 1.8,
        baseSuccessRate: 96.9,
        baseVolumeCapacity: 2.8,
        status: 'active',
        profile: {
          avatar: Building,
          description: 'Systems-driven approach to market making',
          location: 'London, UK',
          established: '2020',
          teamSize: '12',
          specialties: ['Systems Trading', 'Automation', 'Technology']
        }
      },
      { 
        name: 'Elk Capital', 
        basePairs: 98, 
        baseAvgSpread: 24.9, 
        baseVolume: 1.54, 
        baseInventory: 1.3,
        basePnl: 18.7,
        baseUptime: 98.1,
        baseLatency: 3.3,
        baseExecutionSpeed: 2.4,
        baseSuccessRate: 94.8,
        baseVolumeCapacity: 2.0,
        status: 'warning',
        profile: {
          avatar: Crown,
          description: 'Capital-focused trading with strategic investments',
          location: 'New York, USA',
          established: '2021',
          teamSize: '10',
          specialties: ['Capital Investment', 'Strategic Trading', 'Portfolio Management']
        }
      },
      { 
        name: 'Tophash Digital', 
        basePairs: 87, 
        baseAvgSpread: 25.4, 
        baseVolume: 1.38, 
        baseInventory: 1.2,
        basePnl: 16.9,
        baseUptime: 97.8,
        baseLatency: 3.6,
        baseExecutionSpeed: 2.7,
        baseSuccessRate: 94.2,
        baseVolumeCapacity: 1.8,
        status: 'warning',
        profile: {
          avatar: Globe,
          description: 'Digital asset specialist with innovative solutions',
          location: 'Singapore',
          established: '2022',
          teamSize: '8',
          specialties: ['Digital Assets', 'Innovation', 'Technology Solutions']
        }
      },
      { 
        name: 'Prycto', 
        basePairs: 76, 
        baseAvgSpread: 26.8, 
        baseVolume: 1.21, 
        baseInventory: 1.0,
        basePnl: 14.3,
        baseUptime: 97.2,
        baseLatency: 3.9,
        baseExecutionSpeed: 3.1,
        baseSuccessRate: 93.5,
        baseVolumeCapacity: 1.6,
        status: 'warning',
        profile: {
          avatar: Target,
          description: 'Cryptocurrency trading with focus on emerging markets',
          location: '(Unknown)',
          established: '2023',
          teamSize: '7',
          specialties: ['Cryptocurrency', 'Emerging Markets', 'Trading']
        }
      },
      { 
        name: 'EasyMM', 
        basePairs: 69, 
        baseAvgSpread: 27.2, 
        baseVolume: 1.08, 
        baseInventory: 0.9,
        basePnl: 12.1,
        baseUptime: 96.8,
        baseLatency: 4.2,
        baseExecutionSpeed: 3.4,
        baseSuccessRate: 92.7,
        baseVolumeCapacity: 1.4,
        status: 'warning',
        profile: {
          avatar: Waves,
          description: 'Simple and accessible market making solutions',
          location: '(Unknown)',
          established: '2023',
          teamSize: '5',
          specialties: ['Accessibility', 'Simple Solutions', 'Market Making']
        }
      },
      { 
        name: 'Cicada', 
        basePairs: 145, 
        baseAvgSpread: 21.7, 
        baseVolume: 2.67, 
        baseInventory: 2.2,
        basePnl: 38.9,
        baseUptime: 99.0,
        baseLatency: 2.4,
        baseExecutionSpeed: 1.5,
        baseSuccessRate: 97.6,
        baseVolumeCapacity: 3.9,
        status: 'active',
        profile: {
          avatar: Hexagon,
          description: 'Cyclical trading patterns with algorithmic precision',
          location: 'New York, USA',
          established: '2020',
          teamSize: '16',
          specialties: ['Algorithmic Trading', 'Pattern Recognition', 'Cyclical Analysis']
        }
      },
      { 
        name: 'G20', 
        basePairs: 167, 
        baseAvgSpread: 19.8, 
        baseVolume: 3.14, 
        baseInventory: 2.7,
        basePnl: 52.3,
        baseUptime: 99.3,
        baseLatency: 2.1,
        baseExecutionSpeed: 1.2,
        baseSuccessRate: 98.2,
        baseVolumeCapacity: 5.1,
        status: 'active',
        profile: {
          avatar: Crown,
          description: 'Global market maker with institutional-grade services',
          location: 'London, UK',
          established: '2019',
          teamSize: '21',
          specialties: ['Global Markets', 'Institutional Services', 'International Trading']
        }
      },
      { 
        name: 'Cyant Arb', 
        basePairs: 103, 
        baseAvgSpread: 23.6, 
        baseVolume: 1.78, 
        baseInventory: 1.5,
        basePnl: 24.7,
        baseUptime: 98.4,
        baseLatency: 3.0,
        baseExecutionSpeed: 2.1,
        baseSuccessRate: 95.9,
        baseVolumeCapacity: 2.6,
        status: 'active',
        profile: {
          avatar: Link,
          description: 'Arbitrage specialist with cross-market expertise',
          location: 'Nicosia, Cyprus',
          established: '2021',
          teamSize: '11',
          specialties: ['Arbitrage', 'Cross-Market Trading', 'Price Discovery']
        }
      },
      { 
        name: 'Pulsar Trading', 
        basePairs: 178, 
        baseAvgSpread: 18.4, 
        baseVolume: 3.45, 
        baseInventory: 2.9,
        basePnl: 61.2,
        baseUptime: 99.5,
        baseLatency: 1.7,
        baseExecutionSpeed: 1.0,
        baseSuccessRate: 98.7,
        baseVolumeCapacity: 6.2,
        status: 'active',
        profile: {
          avatar: Sparkles,
          description: 'High-frequency trading with stellar performance',
          location: 'Hong Kong',
          established: '2018',
          teamSize: '24',
          specialties: ['High-Frequency Trading', 'Performance Optimization', 'Speed Trading']
        }
      },
      { 
        name: 'Raven', 
        basePairs: 134, 
        baseAvgSpread: 22.1, 
        baseVolume: 2.31, 
        baseInventory: 1.9,
        basePnl: 33.8,
        baseUptime: 98.8,
        baseLatency: 2.7,
        baseExecutionSpeed: 1.8,
        baseSuccessRate: 97.1,
        baseVolumeCapacity: 3.4,
        status: 'active',
        profile: {
          avatar: Crown,
          description: 'Strategic market making with intelligent execution',
          location: 'London, UK',
          established: '2020',
          teamSize: '15',
          specialties: ['Strategic Trading', 'Intelligent Execution', 'Market Analysis']
        }
      },
      { 
        name: 'JST Digital', 
        basePairs: 56, 
        baseAvgSpread: 28.9, 
        baseVolume: 0.87, 
        baseInventory: 0.7,
        basePnl: 8.4,
        baseUptime: 95.3,
        baseLatency: 4.8,
        baseExecutionSpeed: 3.9,
        baseSuccessRate: 89.2,
        baseVolumeCapacity: 1.1,
        status: 'warning',
        profile: {
          avatar: Building,
          description: 'Digital trading solutions with emerging market focus',
          location: 'New York, USA',
          established: '2023',
          teamSize: '4',
          specialties: ['Digital Solutions', 'Emerging Markets', 'New Technology']
        }
      },
      { 
        name: 'XBT', 
        basePairs: 189, 
        baseAvgSpread: 17.9, 
        baseVolume: 3.78, 
        baseInventory: 3.1,
        basePnl: 68.5,
        baseUptime: 99.6,
        baseLatency: 1.6,
        baseExecutionSpeed: 0.8,
        baseSuccessRate: 98.9,
        baseVolumeCapacity: 7.1,
        status: 'active',
        profile: {
          avatar: Target,
          description: 'Bitcoin-focused trading with extensive market coverage',
          location: 'Stockholm, Sweden',
          established: '2017',
          teamSize: '27',
          specialties: ['Bitcoin Trading', 'Market Coverage', 'Cryptocurrency']
        }
      },
      { 
        name: 'Selini Capital', 
        basePairs: 123, 
        baseAvgSpread: 22.8, 
        baseVolume: 2.04, 
        baseInventory: 1.7,
        basePnl: 29.6,
        baseUptime: 98.6,
        baseLatency: 2.9,
        baseExecutionSpeed: 2.0,
        baseSuccessRate: 96.7,
        baseVolumeCapacity: 3.0,
        status: 'active',
        profile: {
          avatar: Gem,
          description: 'Capital management with focus on sustainable growth',
          location: 'Malta',
          established: '2021',
          teamSize: '13',
          specialties: ['Capital Management', 'Sustainable Growth', 'Investment Strategy']
        }
      },
      { 
        name: 'Gravity Team', 
        basePairs: 156, 
        baseAvgSpread: 20.6, 
        baseVolume: 2.89, 
        baseInventory: 2.4,
        basePnl: 44.1,
        baseUptime: 99.2,
        baseLatency: 2.2,
        baseExecutionSpeed: 1.3,
        baseSuccessRate: 98.0,
        baseVolumeCapacity: 4.5,
        status: 'active',
        profile: {
          avatar: Globe,
          description: 'Team-driven approach to market making excellence',
          location: 'London, UK',
          established: '2020',
          teamSize: '18',
          specialties: ['Team Trading', 'Market Excellence', 'Collaborative Approach']
        }
      },
      { 
        name: 'FalconX', 
        basePairs: 201, 
        baseAvgSpread: 16.8, 
        baseVolume: 5.23, 
        baseInventory: 4.3,
        basePnl: 89.7,
        baseUptime: 99.8,
        baseLatency: 1.3,
        baseExecutionSpeed: 0.6,
        baseSuccessRate: 99.4,
        baseVolumeCapacity: 11.2,
        status: 'active',
        profile: {
          avatar: Rocket,
          description: 'Premier institutional trading platform with global reach',
          location: 'New York, USA',
          established: '2018',
          teamSize: '35',
          specialties: ['Institutional Trading', 'Global Reach', 'Premium Services']
        }
      },
      { 
        name: 'Galaxy Digital', 
        basePairs: 187, 
        baseAvgSpread: 18.1, 
        baseVolume: 4.12, 
        baseInventory: 3.6,
        basePnl: 75.8,
        baseUptime: 99.7,
        baseLatency: 1.5,
        baseExecutionSpeed: 0.7,
        baseSuccessRate: 99.0,
        baseVolumeCapacity: 8.7,
        status: 'active',
        profile: {
          avatar: Sparkles,
          description: 'Digital asset investment and trading powerhouse',
          location: 'New York, USA',
          established: '2018',
          teamSize: '32',
          specialties: ['Digital Assets', 'Investment', 'Institutional Services']
        }
      },
      { 
        name: 'Presto Labs', 
        basePairs: 142, 
        baseAvgSpread: 21.3, 
        baseVolume: 2.56, 
        baseInventory: 2.1,
        basePnl: 37.4,
        baseUptime: 99.0,
        baseLatency: 2.5,
        baseExecutionSpeed: 1.6,
        baseSuccessRate: 97.8,
        baseVolumeCapacity: 3.8,
        status: 'active',
        profile: {
          avatar: Target,
          description: 'Laboratory for innovative trading technologies',
          location: 'Singapore',
          established: '2021',
          teamSize: '14',
          specialties: ['Innovation', 'Trading Technology', 'Research & Development']
        }
      },
      { 
        name: 'Tanius Tech', 
        basePairs: 98, 
        baseAvgSpread: 24.5, 
        baseVolume: 1.67, 
        baseInventory: 1.4,
        basePnl: 21.9,
        baseUptime: 98.3,
        baseLatency: 3.2,
        baseExecutionSpeed: 2.3,
        baseSuccessRate: 95.6,
        baseVolumeCapacity: 2.4,
        status: 'active',
        profile: {
          avatar: Building,
          description: 'Technology-driven trading solutions and market making',
          location: 'California, USA',
          established: '2022',
          teamSize: '9',
          specialties: ['Technology Solutions', 'Innovation', 'Market Making Technology']
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
