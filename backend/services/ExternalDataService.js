const axios = require('axios');

class ExternalDataService {
  constructor() {
    this.coinGeckoBaseURL = 'https://api.coingecko.com/api/v3';
    this.binanceBaseURL = 'https://api.binance.com/api/v3';
    this.cryptoCompareBaseURL = 'https://min-api.cryptocompare.com/data/v2';
    
    this.apiKeys = {
      coinGecko: process.env.COINGECKO_API_KEY,
      binance: process.env.BINANCE_API_KEY,
      coinMarketCap: process.env.COINMARKETCAP_API_KEY
    };
  }

  async initialize() {
    console.log('Initializing external data services...');
    // Test API connections
    await this.testConnections();
  }

  async testConnections() {
    try {
      // Test CoinGecko
      await this.getBitcoinPrice();
      console.log('✅ CoinGecko API connected');
    } catch (error) {
      console.warn('⚠️ CoinGecko API connection failed:', error.message);
    }

    try {
      // Test Binance
      await this.getBinancePrice('BTCUSDT');
      console.log('✅ Binance API connected');
    } catch (error) {
      console.warn('⚠️ Binance API connection failed:', error.message);
    }
  }

  // Get real-time Bitcoin price from multiple sources
  async getBitcoinPrice() {
    try {
      const response = await axios.get(`${this.coinGeckoBaseURL}/simple/price`, {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_24hr_vol: true
        },
        headers: this.apiKeys.coinGecko ? {
          'x-cg-demo-api-key': this.apiKeys.coinGecko
        } : {}
      });

      const data = response.data.bitcoin;
      return {
        price: data.usd,
        change24h: data.usd_24h_change,
        volume24h: data.usd_24h_vol,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching Bitcoin price from CoinGecko:', error.message);
      throw error;
    }
  }

  // Get Binance price data
  async getBinancePrice(symbol) {
    try {
      const response = await axios.get(`${this.binanceBaseURL}/ticker/24hr`, {
        params: { symbol }
      });

      return {
        symbol: response.data.symbol,
        price: parseFloat(response.data.lastPrice),
        change24h: parseFloat(response.data.priceChangePercent),
        volume24h: parseFloat(response.data.volume),
        high24h: parseFloat(response.data.highPrice),
        low24h: parseFloat(response.data.lowPrice),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching ${symbol} price from Binance:`, error.message);
      throw error;
    }
  }

  // Get order book data from Binance
  async getOrderBook(symbol, limit = 20) {
    try {
      const response = await axios.get(`${this.binanceBaseURL}/depth`, {
        params: { symbol, limit }
      });

      return {
        symbol,
        bids: response.data.bids.map(([price, quantity]) => ({
          price: parseFloat(price),
          quantity: parseFloat(quantity)
        })),
        asks: response.data.asks.map(([price, quantity]) => ({
          price: parseFloat(price),
          quantity: parseFloat(quantity)
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching order book for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Get recent trades from Binance
  async getRecentTrades(symbol, limit = 100) {
    try {
      const response = await axios.get(`${this.binanceBaseURL}/trades`, {
        params: { symbol, limit }
      });

      return response.data.map(trade => ({
        id: trade.id,
        price: parseFloat(trade.price),
        quantity: parseFloat(trade.qty),
        time: trade.time,
        isBuyerMaker: trade.isBuyerMaker,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error(`Error fetching recent trades for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Get market makers data (simulated based on real market conditions)
  async getMarketMakersData() {
    try {
      // Get real market data to influence our market makers simulation
      const btcPrice = await this.getBitcoinPrice();
      const marketVolatility = Math.abs(btcPrice.change24h) / 100;
      
      // Use real market conditions to generate more realistic market maker data
      return this.generateRealisticMarketMakers(btcPrice, marketVolatility);
    } catch (error) {
      console.error('Error generating market makers data:', error.message);
      // Fallback to static data if external APIs fail
      return this.getFallbackMarketMakers();
    }
  }

  generateRealisticMarketMakers(btcPrice, volatility) {
    const baseMakers = [
      { name: 'Equilibrium', baseSpread: 19.3, baseVolume: 1.05, basePnl: 45.2 },
      { name: 'OnlyDegens', baseSpread: 25.6, baseVolume: 4.07, basePnl: 78.9 },
      { name: 'Arken', baseSpread: 18.9, baseVolume: 2.33, basePnl: 32.1 },
      { name: 'CryptoFlow', baseSpread: 16.7, baseVolume: 5.42, basePnl: 92.5 },
      { name: 'BlockChainPro', baseSpread: 17.5, baseVolume: 3.89, basePnl: 81.2 }
    ];

    return baseMakers.map(maker => {
      // Adjust spreads based on market volatility
      const spreadMultiplier = 1 + (volatility * 0.5);
      const volumeMultiplier = 1 + (volatility * 0.3);
      const pnlMultiplier = 1 + (volatility * 0.8);

      return {
        ...maker,
        avgSpread: (maker.baseSpread * spreadMultiplier).toFixed(1),
        volume: `$${(maker.baseVolume * volumeMultiplier).toFixed(2)}M`,
        pnl: `+$${(maker.basePnl * pnlMultiplier).toFixed(1)}K`,
        uptime: `${(99.5 + Math.random() * 0.4).toFixed(1)}%`,
        latency: `${(1.5 + Math.random() * 2).toFixed(1)}ms`,
        successRate: `${(97 + Math.random() * 2.5).toFixed(1)}%`,
        lastUpdate: new Date().toISOString()
      };
    });
  }

  getFallbackMarketMakers() {
    // Static fallback data when external APIs are unavailable
    return [
      {
        name: 'Equilibrium',
        avgSpread: '19.3',
        volume: '$1.05M',
        pnl: '+$45.2K',
        uptime: '99.8%',
        latency: '2.3ms',
        successRate: '98.7%',
        lastUpdate: new Date().toISOString()
      }
    ];
  }

  // Get market metrics
  async getMarketMetrics() {
    try {
      const btcData = await this.getBitcoinPrice();
      
      return {
        totalMakers: 2459,
        volume24h: btcData.volume24h / 1000000000, // Convert to billions
        averageSpread: 0.21,
        activePairs: 142,
        marketCap: btcData.price * 21000000, // Approximate Bitcoin market cap
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching market metrics:', error.message);
      return {
        totalMakers: 2459,
        volume24h: 15.4,
        averageSpread: 0.21,
        activePairs: 142,
        lastUpdate: new Date().toISOString()
      };
    }
  }
}

module.exports = ExternalDataService;
