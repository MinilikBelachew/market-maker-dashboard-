import { useState, useEffect, useCallback } from 'react'
import marketDataService from '../services/marketDataService'

// Custom hook for managing real-time market data
export const useMarketData = (updateInterval = 2000) => {
  const [marketMakers, setMarketMakers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)

  // Handle data updates
  const handleDataUpdate = useCallback((newData) => {
    setMarketMakers(newData)
    setLastUpdate(new Date())
    setIsLoading(false)
    setError(null)
  }, [])

  // Initialize data service
  useEffect(() => {
    try {
      // Get initial data
      const initialData = marketDataService.getCurrentData()
      setMarketMakers(initialData)
      setIsLoading(false)
      setIsConnected(true)

      // Subscribe to updates
      const unsubscribe = marketDataService.subscribe(handleDataUpdate)

      // Start real-time updates
      marketDataService.startUpdates(updateInterval)

      return () => {
        unsubscribe()
        marketDataService.stopUpdates()
        setIsConnected(false)
      }
    } catch (err) {
      setError('Failed to initialize market data service')
      setIsLoading(false)
      console.error('Market data initialization error:', err)
    }
  }, [handleDataUpdate, updateInterval])

  // Manual refresh function
  const refreshData = useCallback(() => {
    try {
      marketDataService.updateData()
    } catch (err) {
      setError('Failed to refresh data')
      console.error('Data refresh error:', err)
    }
  }, [])

  // Toggle updates
  const toggleUpdates = useCallback(() => {
    if (marketDataService.isUpdating()) {
      marketDataService.stopUpdates()
      setIsConnected(false)
    } else {
      marketDataService.startUpdates(updateInterval)
      setIsConnected(true)
    }
  }, [updateInterval])

  return {
    marketMakers,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    toggleUpdates
  }
}

export default useMarketData
