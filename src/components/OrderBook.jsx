import React from 'react'
import { Trophy, RefreshCw, AlertTriangle, Star, TrendingUp, Award, Shield, Zap } from 'lucide-react'
import marketDataService from '../services/marketDataService'
import { useTheme } from '../contexts/ThemeContext'

const OrderBook = () => {
  const [rankingsData, setRankingsData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    // Simulate loading
    setIsLoading(true)
    try {
      // Get initial data
      const makers = marketDataService.getCurrentData()
      // Sort by score descending, take top 10
      const sorted = [...makers].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10)
      // Map to order book ranking format
      setRankingsData(sorted.map((maker, idx) => ({
        id: maker.name,
        name: maker.name,
        specialty: maker.profile?.specialties?.[0] || '',
        rank: idx + 1,
        grade: maker.grade || '',
        score: maker.score || 0,
        uptime: maker.uptime ? parseFloat(maker.uptime) : 0,
        spread: maker.avgSpread || 0,
        volume: maker.volume ? maker.volume.replace('$', '').replace('M', '') : 0
      })))
      setIsLoading(false)
    } catch (e) {
      setError('Failed to load order book data')
      setIsLoading(false)
    }

    // Subscribe to updates
    const update = (makers) => {
      const sorted = [...makers].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10)
      setRankingsData(sorted.map((maker, idx) => ({
        id: maker.name,
        name: maker.name,
        specialty: maker.profile?.specialties?.[0] || '',
        rank: idx + 1,
        grade: maker.grade || '',
        score: maker.score || 0,
        uptime: maker.uptime ? parseFloat(maker.uptime) : 0,
        spread: maker.avgSpread || 0,
        volume: maker.volume ? maker.volume.replace('$', '').replace('M', '') : 0
      })))
    }
    const unsub = marketDataService.subscribe(update)
    if (!marketDataService.isUpdating()) marketDataService.startUpdates()
    return () => {
      unsub()
      marketDataService.stopUpdates()
    }
  }, [])
  const { isDarkMode } = useTheme()

  // Helper function to get ranking icon
  const getRankingIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-4 h-4 text-yellow-500" />
      case 2: return <Award className="w-4 h-4 text-gray-400" />
      case 3: return <Award className="w-4 h-4 text-amber-600" />
      default: return <Star className="w-4 h-4 text-blue-400" />
    }
  }

  // Helper function to get grade color
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'text-green-400'
      case 'A': return 'text-green-300'
      case 'B+': return 'text-yellow-400'
      case 'B': return 'text-orange-400'
      case 'C+': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

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

  // rankingsData is now from marketDataService

  return (
    <>
      
      <div className={`relative overflow-hidden border rounded-xl shadow-sm p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-dark-card to-dark-bg border-dark-border' 
          : 'bg-gradient-to-br from-light-card to-light-bg border-light-border'
      }`}>
        {/* Minimal background decoration */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-accent-purple/5 rounded-full blur-lg"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Trophy className="w-4 h-4 text-accent-blue mr-2" />
              <h2 className={`text-lg font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-light-text'
              }`}>Top Performers</h2>
            </div>
            <div className={`flex items-center space-x-1 text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span>Live Rankings</span>
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
            {rankingsData.map((maker, index) => (
              <div key={maker.id} className={`p-3 rounded-lg border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-dark-border/20 border-dark-border/30 hover:bg-dark-border/30' 
                  : 'bg-light-border/20 border-light-border/30 hover:bg-light-border/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getRankingIcon(maker.rank)}
                    <div>
                      <div className={`font-semibold text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-light-text'
                      }`}>
                        {maker.name}
                      </div>
                      <div className={`text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                      }`}>
                        {maker.specialty}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${getGradeColor(maker.grade)}`}>
                      {maker.grade}
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      Score: {maker.score}
                    </div>
                  </div>
                </div>
                
                {/* Performance metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className={`text-center p-1 rounded transition-colors duration-300 ${
                    isDarkMode ? 'bg-dark-border/20' : 'bg-light-border/20'
                  }`}>
                    <div className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-light-text'
                    }`}>
                      {maker.uptime}%
                    </div>
                    <div className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      Uptime
                    </div>
                  </div>
                  <div className={`text-center p-1 rounded transition-colors duration-300 ${
                    isDarkMode ? 'bg-dark-border/20' : 'bg-light-border/20'
                  }`}>
                    <div className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-light-text'
                    }`}>
                      {maker.spread}%
                    </div>
                    <div className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      Spread
                    </div>
                  </div>
                  <div className={`text-center p-1 rounded transition-colors duration-300 ${
                    isDarkMode ? 'bg-dark-border/20' : 'bg-light-border/20'
                  }`}>
                    <div className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-light-text'
                    }`}>
                      {maker.volume}B
                    </div>
                    <div className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      Volume
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {rankingsData.length === 0 && (
              <div className={`text-center py-8 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>
                <Trophy className="w-8 h-8 mx-auto mb-2 text-accent-blue" />
                <p className="text-sm">No rankings available</p>
                <p className="text-xs">Market maker data loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderBook