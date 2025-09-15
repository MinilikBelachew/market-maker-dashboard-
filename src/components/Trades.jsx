import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, RefreshCw, AlertTriangle, Shield, DollarSign, MessageSquare, Target, Cpu, Link, Search } from 'lucide-react'
import { useTradesData } from '../hooks/useDashboardData'
import marketDataService from '../services/marketDataService'
import { useTheme } from '../contexts/ThemeContext'

const Trades = () => {
  const { trades, isLoading, error } = useTradesData()
  const { isDarkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaker, setSelectedMaker] = useState(null)

  // Helper function to get pillar color based on score
  const getPillarColor = (score) => {
    if (score >= 0.9) return 'text-green-400'
    if (score >= 0.8) return 'text-green-300'
    if (score >= 0.7) return 'text-yellow-400'
    if (score >= 0.6) return 'text-orange-400'
    return 'text-red-400'
  }

  // Helper function to get progress bar color
  const getProgressColor = (score) => {
    if (score >= 0.9) return 'bg-green-400'
    if (score >= 0.8) return 'bg-green-300'
    if (score >= 0.7) return 'bg-yellow-400'
    if (score >= 0.6) return 'bg-orange-400'
    return 'bg-red-400'
  }

  // Helper function to get icon component
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Shield': return Shield
      case 'DollarSign': return DollarSign
      case 'MessageSquare': return MessageSquare
      case 'Target': return Target
      case 'Cpu': return Cpu
      case 'Link': return Link
      default: return Activity
    }
  }

  // Use market makers from marketDataService
  const [marketMakers, setMarketMakers] = useState([])

  useEffect(() => {
    // Subscribe to real-time updates
    const updateData = (data) => setMarketMakers(data)
    marketDataService.subscribe(updateData)
    // Start updates if not already running
    if (!marketDataService.isUpdating()) {
      marketDataService.startUpdates()
    }
    // Set initial data
    setMarketMakers(marketDataService.getCurrentData())
    // Cleanup
    return () => marketDataService.stopUpdates()
  }, [])

  // Filter market makers based on search
  const filteredMakers = marketMakers.filter(maker => 
    maker.name && maker.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get current market maker data
  const currentMaker = selectedMaker || trades.makerName || (marketMakers[0] && marketMakers[0].name)
  const currentMakerData = marketMakers.find(maker => maker.name === currentMaker) || marketMakers[0] || {}
  // Build pillar data from pillarScores if available
  const pillarData = currentMakerData.pillarScores ? [
    { name: 'Reputation', icon: 'Shield', score: currentMakerData.pillarScores.reputation },
    { name: 'Balance Sheet', icon: 'DollarSign', score: currentMakerData.pillarScores.balanceSheet },
    { name: 'Communication', icon: 'MessageSquare', score: currentMakerData.pillarScores.communication },
    { name: 'Pricing', icon: 'Target', score: currentMakerData.pillarScores.pricing },
    { name: 'Technology', icon: 'Cpu', score: currentMakerData.pillarScores.technology },
    { name: 'DeFi Integration', icon: 'Link', score: currentMakerData.pillarScores.defi }
  ] : []

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden border rounded-xl shadow-lg p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-dark-card to-dark-bg border-dark-border' 
          : 'bg-gradient-to-br from-light-card to-light-bg border-light-border'
      }`}>
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-8 h-8 text-accent-blue animate-spin" />
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className={`relative overflow-hidden border rounded-xl shadow-lg p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-dark-card to-dark-bg border-dark-border' 
          : 'bg-gradient-to-br from-light-card to-light-bg border-light-border'
      }`}>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // const pillarData = trades.pillars || []

  return (
    <div className={`relative overflow-hidden border rounded-xl shadow-sm p-4 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-dark-card to-dark-bg border-dark-border' 
        : 'bg-gradient-to-br from-light-card to-light-bg border-light-border'
    }`}>
      {/* Minimal background decoration */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-accent-pink/5 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-light-text'
            }`}>Market Maker Pillars</h2>
            <div className={`flex items-center space-x-1 text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>
              <Activity className="w-3 h-3 text-blue-400" />
              <span>Live Scores</span>
            </div>
          </div>
          
          {/* Search and Selection */}
          <div className="space-y-2">
            <div className="relative">
              <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`} />
              <input
                type="text"
                placeholder="Search market makers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-dark-border/20 border-dark-border/30 text-white placeholder-gray-400' 
                    : 'bg-light-border/20 border-light-border/30 text-light-text placeholder-light-text-secondary'
                }`}
              />
            </div>
            
            {/* Market Maker Selection */}
            {searchTerm && (
              <div className={`max-h-32 overflow-y-auto rounded-lg border transition-colors duration-300 ${
                isDarkMode ? 'bg-dark-border/20 border-dark-border/30' : 'bg-light-border/20 border-light-border/30'
              }`}>
                {filteredMakers.map((maker) => (
                  <button
                    key={maker.name}
                    onClick={() => {
                      setSelectedMaker(maker.name)
                      setSearchTerm('')
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-opacity-50 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-white hover:bg-dark-border/30' 
                        : 'text-light-text hover:bg-light-border/30'
                    }`}
                  >
                    {maker.name}
                  </button>
                ))}
              </div>
            )}
            
            {/* Current Selection */}
            <div className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>
              Selected: <span className="font-semibold">{currentMaker}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {pillarData.map((pillar, index) => (
            <div key={pillar.name} className={`p-2 rounded-lg border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-dark-border/10 hover:bg-dark-border/20 border-dark-border/20' 
                : 'bg-light-border/10 hover:bg-light-border/20 border-light-border/20'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  {React.createElement(getIconComponent(pillar.icon), {
                    className: `w-3 h-3 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`
                  })}
                  <span className={`font-medium text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-light-text'
                  }`}>{pillar.name}</span>
                </div>
                <div className={`font-bold text-sm ${getPillarColor(pillar.score)}`}>
                  {(pillar.score * 100).toFixed(0)}%
                </div>
              </div>
              
              {/* Progress bar */}
              <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors duration-300 ${
                isDarkMode ? 'bg-dark-border/30' : 'bg-light-border/30'
              }`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(pillar.score)}`}
                  style={{ width: `${pillar.score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Trades