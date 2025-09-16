// Real-Time Market Maker Pricing Service
class RealTimePricingService {
  constructor() {
    this.subscribers = new Set()
    this.isRunning = false
    this.updateInterval = null
    this.currentPricing = new Map()
    this.websockets = new Map()
  }

  // Fetch real-time order book data to calculate spreads
  async fetchOrderBookData(exchange, symbol = 'BTCUSDT') {
    const endpoints = {
      binance: `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=20`,
      coinbase: `https://api.exchange.coinbase.com/products/BTC-USD/book?level=2`,
      kraken: `https://api.kraken.com/0/public/Depth?pair=XBTUSD&count=20`
    }

    try {
      const response = await fetch(endpoints[exchange])
      const data = await response.json()
      return this.parseOrderBookData(data, exchange)
    } catch (error) {
      console.error(`Error fetching ${exchange} order book:`, error)
      return null
    }
  }

  // Parse order book data to extract market maker pricing
  parseOrderBookData(data, exchange) {
    let bids = []
    let asks = []

    switch (exchange) {
      case 'binance':
        bids = data.bids?.map(([price, quantity]) => ({ price: parseFloat(price), quantity: parseFloat(quantity) })) || []
        asks = data.asks?.map(([price, quantity]) => ({ price: parseFloat(price), quantity: parseFloat(quantity) })) || []
        break
      case 'coinbase':
        bids = data.bids?.map(([price, quantity]) => ({ price: parseFloat(price), quantity: parseFloat(quantity) })) || []
        asks = data.asks?.map(([price, quantity]) => ({ price: parseFloat(price), quantity: parseFloat(quantity) })) || []
        break
      case 'kraken':
        const pair = Object.keys(data.result || {})[0]
        if (pair) {
          bids = data.result[pair].bids?.map(([price, quantity]) => ({ price: parseFloat(price), quantity: parseFloat(quantity) })) || []
          asks = data.result[pair].asks?.map(([price, quantity]) => ({ price: parseFloat(price), quantity: parseFloat(quantity) })) || []
        }
        break
    }

    if (bids.length === 0 || asks.length === 0) return null

    const bestBid = Math.max(...bids.map(b => b.price))
    const bestAsk = Math.min(...asks.map(a => a.price))
    const spread = bestAsk - bestBid
    const spreadPercentage = ((spread / bestBid) * 100).toFixed(4)

    return {
      exchange,
      bestBid,
      bestAsk,
      spread,
      spreadPercentage,
      bidDepth: bids.reduce((sum, bid) => sum + bid.quantity, 0),
      askDepth: asks.reduce((sum, ask) => sum + ask.quantity, 0),
      timestamp: new Date().toISOString(),
      // Estimate market maker tiers based on order sizes
      marketMakerTiers: this.identifyMarketMakerTiers(bids, asks)
    }
  }

  // Identify potential market maker tiers based on order patterns
  identifyMarketMakerTiers(bids, asks) {
    const largeBids = bids.filter(bid => bid.quantity > 1).length // Large orders likely from MMs
    const largeAsks = asks.filter(ask => ask.quantity > 1).length
    
    return {
      institutionalTier: largeBids + largeAsks, // Count of large orders
      retailTier: bids.length + asks.length - largeBids - largeAsks,
      averageInstitutionalSize: this.calculateAverageSize(bids.concat(asks).filter(order => order.quantity > 1)),
      averageRetailSize: this.calculateAverageSize(bids.concat(asks).filter(order => order.quantity <= 1))
    }
  }

  calculateAverageSize(orders) {
    if (orders.length === 0) return 0
    return orders.reduce((sum, order) => sum + order.quantity, 0) / orders.length
  }

  // Fetch pricing for multiple exchanges
  async fetchAllExchangePricing() {
    const exchanges = ['binance', 'coinbase', 'kraken']
    const promises = exchanges.map(exchange => this.fetchOrderBookData(exchange))
    
    try {
      const results = await Promise.all(promises)
      const validResults = results.filter(result => result !== null)
      
      // Update current pricing map
      validResults.forEach(result => {
        this.currentPricing.set(result.exchange, result)
      })

      return validResults
    } catch (error) {
      console.error('Error fetching all exchange pricing:', error)
      return []
    }
  }

  // Calculate market maker performance metrics
  calculateMarketMakerMetrics(pricingData) {
    if (pricingData.length === 0) return {}

    const spreads = pricingData.map(data => parseFloat(data.spreadPercentage))
    const avgSpread = spreads.reduce((sum, spread) => sum + spread, 0) / spreads.length

    return {
      averageSpread: avgSpread.toFixed(4),
      tightestSpread: Math.min(...spreads).toFixed(4),
      widestSpread: Math.max(...spreads).toFixed(4),
      spreadVariance: this.calculateVariance(spreads).toFixed(4),
      totalLiquidity: pricingData.reduce((sum, data) => sum + data.bidDepth + data.askDepth, 0),
      exchangeCount: pricingData.length,
      lastUpdate: new Date().toISOString()
    }
  }

  calculateVariance(numbers) {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2))
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length
  }

  // WebSocket connections for real-time updates
  startWebSocketConnections() {
    // Binance WebSocket
    const binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth20@100ms')
    binanceWs.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const parsed = this.parseOrderBookData(data, 'binance')
      if (parsed) {
        this.currentPricing.set('binance', parsed)
        this.notifySubscribers()
      }
    }
    this.websockets.set('binance', binanceWs)

    // Add more WebSocket connections for other exchanges
  }

  // Update pricing data
  async updatePricing() {
    const pricingData = await this.fetchAllExchangePricing()
    const metrics = this.calculateMarketMakerMetrics(pricingData)
    
    this.notifySubscribers({
      pricing: Array.from(this.currentPricing.values()),
      metrics
    })
  }

  // Get current pricing data
  getCurrentPricing() {
    return {
      pricing: Array.from(this.currentPricing.values()),
      metrics: this.calculateMarketMakerMetrics(Array.from(this.currentPricing.values()))
    }
  }

  // Subscribe to pricing updates
  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  // Notify subscribers
  notifySubscribers(data = null) {
    const currentData = data || this.getCurrentPricing()
    this.subscribers.forEach(callback => callback(currentData))
  }

  // Start real-time updates
  startUpdates(intervalMs = 5000) {
    if (this.isRunning) return
    
    this.isRunning = true
    
    // Start WebSocket connections for fastest updates
    this.startWebSocketConnections()
    
    // Fallback polling for exchanges without WebSocket
    this.updateInterval = setInterval(() => {
      this.updatePricing()
    }, intervalMs)
    
    // Initial update
    this.updatePricing()
  }

  // Stop updates
  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    
    // Close WebSocket connections
    this.websockets.forEach(ws => ws.close())
    this.websockets.clear()
    
    this.isRunning = false
  }

  isUpdating() {
    return this.isRunning
  }
}

// Create singleton instance
const realTimePricingService = new RealTimePricingService()

export default realTimePricingService
