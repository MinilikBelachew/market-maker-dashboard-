import { useState, useEffect, useCallback } from 'react'
import realisticDataService from '../services/realisticDataService'

// Custom hook for managing all dashboard data
export const useDashboardData = () => {
  const [data, setData] = useState(realisticDataService.getCurrentData())
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)

  // Handle data updates
  const handleDataUpdate = useCallback((newData) => {
    setData(newData)
    setLastUpdate(new Date())
    setIsLoading(false)
    setError(null)
  }, [])

  // Initialize data service
  useEffect(() => {
    try {
      // Get initial data
      const initialData = realisticDataService.getCurrentData()
      setData(initialData)
      setIsLoading(false)
      setIsConnected(true)

      // Subscribe to updates
      const unsubscribe = realisticDataService.subscribe(handleDataUpdate)

      // Start realistic updates with different frequencies
      realisticDataService.startUpdates()

      return () => {
        unsubscribe()
        realisticDataService.stopUpdates()
        setIsConnected(false)
      }
    } catch (err) {
      setError('Failed to initialize dashboard data service')
      setIsLoading(false)
      console.error('Dashboard data initialization error:', err)
    }
  }, [handleDataUpdate])

  // Manual refresh function
  const refreshData = useCallback(() => {
    try {
      // Trigger all updates
      realisticDataService.updateMetrics()
      realisticDataService.updateChart()
      realisticDataService.updateOrderBook()
      realisticDataService.updateTrades()
      realisticDataService.updateAlerts()
    } catch (err) {
      setError('Failed to refresh data')
      console.error('Data refresh error:', err)
    }
  }, [])

  // Toggle updates
  const toggleUpdates = useCallback(() => {
    if (realisticDataService.isUpdating()) {
      realisticDataService.stopUpdates()
      setIsConnected(false)
    } else {
      realisticDataService.startUpdates()
      setIsConnected(true)
    }
  }, [])

  return {
    data,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    toggleUpdates
  }
}

// Individual hooks for specific components
export const useMetricsData = () => {
  const { data, isLoading, isConnected, lastUpdate, error, refreshData, toggleUpdates } = useDashboardData()
  
  return {
    metrics: data.metrics,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    toggleUpdates
  }
}

export const useChartData = () => {
  const { data, isLoading, isConnected, lastUpdate, error, refreshData, toggleUpdates } = useDashboardData()
  
  return {
    chart: data.chart,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    toggleUpdates
  }
}

export const useOrderBookData = () => {
  const { data, isLoading, isConnected, lastUpdate, error, refreshData, toggleUpdates } = useDashboardData()
  
  return {
    orderBook: data.orderBook,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    toggleUpdates
  }
}

export const useTradesData = () => {
  const { data, isLoading, isConnected, lastUpdate, error, refreshData, toggleUpdates } = useDashboardData()
  
  return {
    trades: data.trades,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    toggleUpdates
  }
}

export const useAlertsData = () => {
  const { data, isLoading, isConnected, lastUpdate, error, refreshData, toggleUpdates } = useDashboardData()
  
  return {
    alerts: data.alerts,
    isLoading,
    isConnected,
    lastUpdate,
    error,
    refreshData,
    toggleUpdates
  }
}

export default useDashboardData
