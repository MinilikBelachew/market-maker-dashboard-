const { Pool } = require('pg');

class DatabaseService {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async initialize() {
    try {
      // Database configuration
      const config = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'market_makers',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
      };

      this.pool = new Pool(config);
      
      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      this.isConnected = true;
      console.log('✅ Database connected successfully');
      
      // Create tables if they don't exist
      await this.createTables();
      
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      this.isConnected = false;
      // Don't throw error - allow app to run without database
    }
  }

  async createTables() {
    if (!this.isConnected) return;

    const createTablesQuery = `
      -- Market Makers Table
      CREATE TABLE IF NOT EXISTS market_makers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        avg_spread DECIMAL(10,2),
        volume VARCHAR(50),
        inventory VARCHAR(50),
        pnl VARCHAR(50),
        uptime DECIMAL(5,2),
        latency DECIMAL(10,2),
        execution_speed DECIMAL(10,2),
        success_rate DECIMAL(5,2),
        volume_capacity VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        grade VARCHAR(10),
        score INTEGER,
        pillar_scores JSONB,
        red_flags JSONB,
        profile JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Trades Table
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(20) NOT NULL,
        price DECIMAL(20,8) NOT NULL,
        quantity DECIMAL(20,8) NOT NULL,
        side VARCHAR(10) NOT NULL,
        is_buyer_maker BOOLEAN DEFAULT FALSE,
        maker_id INTEGER REFERENCES market_makers(id),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Alerts Table
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'medium',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Market Data Table
      CREATE TABLE IF NOT EXISTS market_data (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(20) NOT NULL,
        price DECIMAL(20,8) NOT NULL,
        change_24h DECIMAL(10,4),
        volume_24h DECIMAL(20,2),
        high_24h DECIMAL(20,8),
        low_24h DECIMAL(20,8),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Order Book Table
      CREATE TABLE IF NOT EXISTS order_book (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(20) NOT NULL,
        side VARCHAR(10) NOT NULL,
        price DECIMAL(20,8) NOT NULL,
        quantity DECIMAL(20,8) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_trades_symbol_timestamp ON trades(symbol, timestamp);
      CREATE INDEX IF NOT EXISTS idx_trades_maker_id ON trades(maker_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(active);
      CREATE INDEX IF NOT EXISTS idx_market_data_symbol_timestamp ON market_data(symbol, timestamp);
      CREATE INDEX IF NOT EXISTS idx_order_book_symbol_side ON order_book(symbol, side);
    `;

    try {
      await this.pool.query(createTablesQuery);
      console.log('✅ Database tables created/verified');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }

  async query(text, params = []) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getClient() {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    return await this.pool.connect();
  }

  // Market Makers CRUD operations
  async getMarketMakers() {
    const result = await this.query('SELECT * FROM market_makers ORDER BY name');
    return result.rows;
  }

  async getMarketMakerById(id) {
    const result = await this.query('SELECT * FROM market_makers WHERE id = $1', [id]);
    return result.rows[0];
  }

  async createMarketMaker(makerData) {
    const {
      name, avgSpread, volume, inventory, pnl, uptime, latency,
      executionSpeed, successRate, volumeCapacity, status, grade, score,
      pillarScores, redFlags, profile
    } = makerData;

    const result = await this.query(`
      INSERT INTO market_makers (
        name, avg_spread, volume, inventory, pnl, uptime, latency,
        execution_speed, success_rate, volume_capacity, status, grade, score,
        pillar_scores, red_flags, profile
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      name, avgSpread, volume, inventory, pnl, uptime, latency,
      executionSpeed, successRate, volumeCapacity, status, grade, score,
      JSON.stringify(pillarScores), JSON.stringify(redFlags), JSON.stringify(profile)
    ]);

    return result.rows[0];
  }

  async updateMarketMaker(id, makerData) {
    const fields = Object.keys(makerData);
    const values = Object.values(makerData);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    const result = await this.query(`
      UPDATE market_makers 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `, [id, ...values]);

    return result.rows[0];
  }

  async deleteMarketMaker(id) {
    const result = await this.query('DELETE FROM market_makers WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Trades operations
  async getTrades(limit = 100, symbol = null) {
    let query = 'SELECT * FROM trades';
    const params = [];
    
    if (symbol) {
      query += ' WHERE symbol = $1';
      params.push(symbol);
    }
    
    query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await this.query(query, params);
    return result.rows;
  }

  async createTrade(tradeData) {
    const { symbol, price, quantity, side, isBuyerMaker, makerId } = tradeData;
    
    const result = await this.query(`
      INSERT INTO trades (symbol, price, quantity, side, is_buyer_maker, maker_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [symbol, price, quantity, side, isBuyerMaker, makerId]);

    return result.rows[0];
  }

  // Alerts operations
  async getAlerts(activeOnly = false) {
    let query = 'SELECT * FROM alerts';
    const params = [];
    
    if (activeOnly) {
      query += ' WHERE active = $1';
      params.push(true);
    }
    
    query += ' ORDER BY created_at DESC';

    const result = await this.query(query, params);
    return result.rows;
  }

  async createAlert(alertData) {
    const { type, message, priority = 'medium' } = alertData;
    
    const result = await this.query(`
      INSERT INTO alerts (type, message, priority)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [type, message, priority]);

    return result.rows[0];
  }

  async updateAlert(id, alertData) {
    const fields = Object.keys(alertData);
    const values = Object.values(alertData);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    const result = await this.query(`
      UPDATE alerts 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `, [id, ...values]);

    return result.rows[0];
  }

  async deleteAlert(id) {
    const result = await this.query('DELETE FROM alerts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Market data operations
  async saveMarketData(marketData) {
    const { symbol, price, change24h, volume24h, high24h, low24h } = marketData;
    
    const result = await this.query(`
      INSERT INTO market_data (symbol, price, change_24h, volume_24h, high_24h, low_24h)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [symbol, price, change24h, volume24h, high24h, low24h]);

    return result.rows[0];
  }

  async getLatestMarketData(symbol) {
    const result = await this.query(`
      SELECT * FROM market_data 
      WHERE symbol = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `, [symbol]);

    return result.rows[0];
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      return {
        status: 'healthy',
        connected: this.isConnected,
        currentTime: result.rows[0].current_time
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        connected: false,
        error: error.message
      };
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log('Database connection closed');
    }
  }
}

module.exports = DatabaseService;
