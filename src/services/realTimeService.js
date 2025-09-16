// Real-time service for connecting to the backend WebSocket server
class RealTimeService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscribers = new Map();
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }

  // Initialize WebSocket connection
  connect() {
    try {
      this.socket = new WebSocket(`ws://${this.backendUrl.replace('http://', '')}`);
      
      this.socket.onopen = () => {
        console.log('✅ Connected to backend WebSocket');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifySubscribers('connection', { status: 'connected' });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('❌ WebSocket connection closed');
        this.isConnected = false;
        this.notifySubscribers('connection', { status: 'disconnected' });
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifySubscribers('error', { message: 'WebSocket connection error' });
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  // Handle incoming messages
  handleMessage(data) {
    switch (data.type) {
      case 'initialData':
        this.notifySubscribers('initialData', data);
        break;
      case 'dataUpdate':
        this.notifySubscribers('dataUpdate', data);
        break;
      case 'systemStatus':
        this.notifySubscribers('systemStatus', data);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  // Subscribe to specific data types
  subscribe(dataTypes, callback) {
    const subscriptionId = Date.now() + Math.random();
    this.subscribers.set(subscriptionId, { dataTypes, callback });

    // Request subscription from server
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'subscribeToUpdates',
        dataTypes: dataTypes
      }));
    }

    return () => this.subscribers.delete(subscriptionId);
  }

  // Subscribe to all updates
  subscribeToAll(callback) {
    return this.subscribe(['marketMakers', 'chart', 'orderBook', 'trades', 'metrics', 'alerts'], callback);
  }

  // Request specific data
  requestData(dataType) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'requestData',
        dataType: dataType
      }));
    }
  }

  // Notify all subscribers
  notifySubscribers(type, data) {
    this.subscribers.forEach(({ callback }) => {
      try {
        callback(type, data);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.notifySubscribers('error', { message: 'Max reconnection attempts reached' });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.subscribers.clear();
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscribers: this.subscribers.size
    };
  }
}

// Create singleton instance
const realTimeService = new RealTimeService();

export default realTimeService;
