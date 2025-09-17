import React, { useState } from 'react'
import { Star, Info, X, TrendingUp, Clock, CheckCircle, AlertTriangle, XCircle, ChevronLeft, ChevronRight, Scale, Rocket, Castle, Hexagon, Sparkles, Waves, Crown, Droplets, Globe, Target, Link, Gem, Building, RefreshCw, Play, Pause } from 'lucide-react'
import { useMarketData } from '../hooks/useMarketData'
import { useTheme } from '../contexts/ThemeContext'

const MarketMakersTable = () => {
  const [favorites, setFavorites] = useState(new Set(['Equilibrium', 'CryptoFlow', 'BlockChainPro']))
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const { isDarkMode } = useTheme()

  // Use real-time market data
  const { 
    marketMakers, 
    isLoading, 
    isConnected, 
    lastUpdate, 
    error, 
    refreshData, 
    toggleUpdates 
  } = useMarketData(5000) // Update every 3 seconds (realistic for market makers)

  // Use market makers data or fallback to empty array
  const displayMarketMakers = marketMakers.length > 0 ? marketMakers : []

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden rounded-xl p-8 w-full transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-800/90 border border-slate-700/50' 
          : 'bg-gradient-to-br from-white/90 via-gray-50/80 to-white/95 border border-gray-200/60'
      }`}>
        
        
        <div className="relative flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              
              <div className={`relative p-4 rounded-full ${
                isDarkMode ? 'bg-slate-700/50' : 'bg-white/80'
              } backdrop-blur-sm border border-primary/20`}>
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className={`text-lg font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Loading Market Data</p>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Fetching real-time market maker information...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className={`relative overflow-hidden rounded-2xl p-8 w-full transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-red-900/20 via-slate-900/60 to-red-800/20 border border-red-500/30' 
          : 'bg-gradient-to-br from-red-50/80 via-white/90 to-red-50/60 border border-red-200/60'
      }`}>
        {/* Animated error background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent animate-pulse"></div>
        
        <div className="relative flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className={`relative p-4 rounded-full ${
                isDarkMode ? 'bg-red-900/30' : 'bg-red-50/80'
              } backdrop-blur-sm border border-red-500/30`}>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-red-300">Connection Error</h3>
              <p className="text-red-400/80 text-sm max-w-md">{error}</p>
              <button 
                onClick={refreshData}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const toggleFavorite = (name) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(name)) {
        newFavorites.delete(name)
      } else {
        newFavorites.add(name)
      }
      return newFavorites
    })
  }

  // Pagination logic
  const totalPages = Math.ceil(displayMarketMakers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMarketMakers = displayMarketMakers.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  const ActivityIndicator = ({ activity }) => {
    // Calculate activity intensity
    const activeCount = activity.filter(active => active).length
    const intensity = activeCount / activity.length
    const intensityPercentage = Math.round(intensity * 100)
    
    return (
      <div className="w-12 h-4 flex items-center justify-center group relative">
        <div className="flex space-x-0.5">
          {activity.map((active, index) => (
            <div
              key={index}
              className={`w-1 h-3 rounded-sm transition-all duration-300 ${
                active 
                  ? 'bg-primary animate-pulse' 
                  : 'bg-gray-700'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                boxShadow: active ? '0 0 4px rgba(0, 60, 211, 0.6)' : 'none'
              }}
            />
          ))}
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          {intensityPercentage}% Active ({activeCount}/10 periods)
        </div>
      </div>
    )
  }

  const StatusIndicator = ({ status }) => {
    const statusConfig = {
      active: { color: 'text-green-500', icon: CheckCircle },
      warning: { color: 'text-yellow-500', icon: AlertTriangle },
      error: { color: 'text-red-500', icon: XCircle },
      offline: { color: 'text-gray-500', icon: XCircle }
    }
    
    const config = statusConfig[status] || statusConfig.offline
    const IconComponent = config.icon
    
    return (
      <div className="flex items-center justify-center space-x-1">
        <IconComponent className={`w-3 h-3 ${config.color}`} />
        <span className="capitalize text-xs">{status}</span>
      </div>
    )
  }

  const ProfileModal = ({ maker, onClose }) => {
  const { isDarkMode } = useTheme()
  
    if (!maker) return null

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300   ">
      <div className={`border rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto transition-all duration-500 transform animate-in slide-in-from-bottom-4 scrollbar-hide ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-800/95 via-slate-900/90 to-slate-800/95 border-slate-700/50 backdrop-blur-xl' 
          : 'bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95 border-gray-200/60 backdrop-blur-xl'
      }`} style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none' 
      }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isDarkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-white to-gray-100'
            }`}>
              <maker.profile.avatar className={`w-6 h-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`} />
              </div>
              <div>
              <h3 className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-light-text'
              }`}>{maker.name}</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>{maker.profile.location}</p>
            </div>
            </div>
            <button 
              onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-slate-700/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className={`text-base font-semibold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-light-text'
              }`}>Description</h4>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-light-text-secondary'
              }`}>{maker.profile.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className={`text-xs font-semibold mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                }`}>Established</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>{maker.profile.established}</p>
              </div>
              <div>
                <h4 className={`text-xs font-semibold mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                }`}>Team Size</h4>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>{maker.profile.teamSize} members</p>
              </div>
            </div>

            <div>
              <h4 className={`text-base font-semibold mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-light-text'
              }`}>Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {maker.profile.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 text-xs rounded border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 border-gray-600' 
                        : 'bg-gray-200 text-gray-600 border-gray-300'
                    }`}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-base font-semibold mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-light-text'
              }`}>HonestMM Rating Framework</h4>
              
              {/* Overall Grade and Score */}
              <div className={`rounded-lg p-4 border mb-4 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700/30 border-gray-600/30' 
                  : 'bg-gray-100/50 border-gray-300/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>Overall Rating</div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-2xl font-bold transition-colors duration-300 ${
                        maker.grade === 'A+' || maker.grade === 'A' ? 'text-green-400' :
                        maker.grade === 'A-' || maker.grade === 'B+' ? 'text-blue-400' :
                        maker.grade === 'B' || maker.grade === 'B-' ? 'text-yellow-400' :
                        maker.grade === 'C+' || maker.grade === 'C' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {maker.grade}
                      </span>
                      <span className={`text-lg font-semibold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-light-text'
                      }`}>
                        {maker.honestMMScore || maker.score}/100
                      </span>
                    </div>
                  </div>
                  {maker.redFlags && maker.redFlags.length > 0 && (
                    <div className="text-right">
                      <div className="text-xs text-red-400 mb-1">⚠️ Red Flags</div>
                      <div className="text-sm text-red-300">
                        {maker.redFlags.length} Issue{maker.redFlags.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pillar Breakdown */}
              {maker.pillarScores && (
                <div className="space-y-3">
                  <h5 className={`text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-light-text'
                  }`}>Pillar Breakdown</h5>
                  
                  {Object.entries(maker.pillarScores).map(([pillar, score]) => {
                    const pillarNames = {
                      reputation: 'R - Reputation',
                      balanceSheet: 'B - Balance Sheet',
                      communication: 'C - Communication',
                      pricing: 'P - Pricing',
                      technology: 'T - Technology',
                      defi: 'D - DeFi Integration'
                    }
                    
                    const percentage = Math.round(score * 100)
                    const colorClass = percentage >= 80 ? 'text-green-400' :
                                     percentage >= 70 ? 'text-blue-400' :
                                     percentage >= 60 ? 'text-yellow-400' :
                                     percentage >= 50 ? 'text-orange-400' : 'text-red-400'
                    
                    return (
                      <div key={pillar} className={`rounded-lg p-3 border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700/20 border-gray-600/20' 
                          : 'bg-gray-100/30 border-gray-300/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className={`text-xs font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-light-text'
                          }`}>
                            {pillarNames[pillar]}
                          </div>
                          <div className={`text-sm font-bold ${colorClass}`}>
                            {percentage}/100
                          </div>
                        </div>
                        <div className={`w-full bg-gray-700 rounded-full h-1.5 mt-2`}>
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              percentage >= 80 ? 'bg-green-400' :
                              percentage >= 70 ? 'bg-blue-400' :
                              percentage >= 60 ? 'bg-yellow-400' :
                              percentage >= 50 ? 'bg-orange-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Performance Metrics */}
              <div className="mt-6">
                <h4 className={`text-base font-semibold mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-lg p-3 border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/30' 
                      : 'bg-gray-100/50 border-gray-300/30'
                  }`}>
                    <div className={`text-xs mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>Pairs</div>
                    <div className={`text-sm font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-light-text'
                    }`}>{maker.pairs}</div>
                  </div>
                  <div className={`rounded-lg p-3 border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/30' 
                      : 'bg-gray-100/50 border-gray-300/30'
                  }`}>
                    <div className={`text-xs mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>Volume</div>
                    <div className={`text-sm font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-light-text'
                    }`}>{maker.volume}</div>
                  </div>
                  <div className={`rounded-lg p-3 border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/30' 
                      : 'bg-gray-100/50 border-gray-300/30'
                  }`}>
                    <div className={`text-xs mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>Uptime</div>
                    <div className="text-sm font-bold text-green-400">{maker.uptime}</div>
                  </div>
                  <div className={`rounded-lg p-3 border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600/30' 
                      : 'bg-gray-100/50 border-gray-300/30'
                  }`}>
                    <div className={`text-xs mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>PnL</div>
                    <div className="text-sm font-bold text-green-400">{maker.pnl}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-lg p-8 w-full transition-all duration-500 ${
      isDarkMode 
        ? 'bg-dark-card border border-dark-border' 
        : 'bg-light-card border border-light-border'
    }`}>
      
      
      <div className="relative z-10 pl-2 sm:pl-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-light-text'
          }`}>
            Market Makers
          </h2>
          <div className="flex items-center space-x-4">
            {/* Real-time controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleUpdates}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isConnected 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
                title={isConnected ? 'Pause updates' : 'Resume updates'}
              >
                {isConnected ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={refreshData}
                className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white transition-all duration-200"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            {/* Status indicator */}
            <div className={`flex items-center space-x-2 text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
              }`}></div>
              <span>{isConnected ? 'Live' : 'Paused'}</span>
              {lastUpdate && (
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-light-text-secondary'
                }`}>
                  • {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className={`rounded-2xl border backdrop-blur-sm transition-all duration-500 overflow-hidden ${
          isDarkMode 
            ? 'border-slate-700/40 bg-slate-800/20' 
            : 'border-gray-300/40 bg-white/40'
        }`}>
        <div className="w-full overflow-x-auto md:overflow-x-visible pl-2 sm:pl-0">
        <table className="w-full table-fixed min-w-[800px] md:min-w-0">
          <thead>
            <tr className={`border-b transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-800/60 border-slate-600/50' 
                : 'bg-gray-50/80 border-gray-300/50'
            }`}>
              <th className={`w-12 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}><Star /></th>
              <th className={`w-32 text-left py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Name</th>
              <th className={`w-20 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Rating</th>
              <th className={`w-20 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 hidden sm:table-cell ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Tech</th>
              <th className={`w-20 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 hidden sm:table-cell ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Price</th>
              <th className={`w-20 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 hidden sm:table-cell ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>DeFi</th>
              <th className={`w-20 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 hidden md:table-cell ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Comm...</th>
              <th className={`w-20 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 hidden md:table-cell ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Reputation</th>
              <th className={`w-20 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 hidden md:table-cell ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Balance</th>
              <th className={`w-20 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Status</th>
              <th className={`w-16 text-center py-3 px-2 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 hidden md:table-cell ${
                isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
              }`}>Activity</th>
            </tr>
          </thead>
          <tbody>
            {currentMarketMakers.map((maker, index) => (
              <tr key={maker.name} className={`group transition-all duration-500 border-b ${
                isDarkMode 
                  ? 'hover:bg-slate-800/40 border-slate-700/30 hover:border-slate-600/50' 
                  : 'hover:bg-primary/5 border-gray-200/30 hover:border-gray-300/50'
              }`}>
                {/* Favorite Column */}
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => toggleFavorite(maker.name)}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      favorites.has(maker.name)
                        ? 'text-yellow-400 hover:text-yellow-300 bg-gradient-to-br from-yellow-400/20 to-amber-500/20'
                        : 'text-gray-500 hover:text-yellow-400 hover:bg-gradient-to-br hover:from-yellow-400/10 hover:to-amber-500/10'
                    }`}
                  >
                    <Star className={`w-4 h-4 transition-all duration-300 ${favorites.has(maker.name) ? 'fill-current' : ''}`} />
                  </button>
                </td>
                
                {/* Market Maker Column (Profile + Name) */}
                <td className="py-3 px-2">
                  <button
                    onClick={() => setSelectedProfile(maker)}
                    className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 w-full text-left ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-slate-700/50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-primary/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-gray-100 group-hover:bg-white'
                    }`}>
                      <maker.profile.avatar className={`w-4 h-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                      }`} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={`font-semibold text-sm transition-colors duration-300 truncate ${
                        isDarkMode ? 'text-white group-hover:text-primary/80' : 'text-gray-900 group-hover:text-primary'
                      }`}>
                        {maker.name}
                      </span>
                      <span className={`text-xs transition-colors duration-300 truncate ${
                        isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'
                      }`}>
                        {maker.profile.location}
                      </span>
                    </div>
                    <Info className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                      isDarkMode ? 'text-gray-500 group-hover:text-primary' : 'text-gray-400 group-hover:text-primary'
                    }`} />
                  </button>
                </td>
                
                {/* Rating Column */}
                <td className={`py-3 px-2 text-center text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-xs font-bold transition-all duration-300 ${
                      maker.grade === 'A+' || maker.grade === 'A' ? 
                        (isDarkMode ? 'text-green-300' : 'text-green-700') :
                      maker.grade === 'A-' || maker.grade === 'B+' ? 
                        (isDarkMode ? 'text-blue-300' : 'text-blue-700') :
                      maker.grade === 'B' || maker.grade === 'B-' ? 
                        (isDarkMode ? 'text-yellow-300' : 'text-yellow-700') :
                      maker.grade === 'C+' || maker.grade === 'C' ? 
                        (isDarkMode ? 'text-orange-300' : 'text-orange-700') :
                        (isDarkMode ? 'text-red-300' : 'text-red-700')
                    }`}>
                      {maker.grade}
                    </span>
                    <div className="text-xs text-gray-400">
                      {maker.honestMMScore || maker.score}/100
                    </div>
                    {maker.redFlags && maker.redFlags.length > 0 && (
                      <div className="text-xs text-red-400">⚠️ {maker.redFlags.length} Red Flag{maker.redFlags.length > 1 ? 's' : ''}</div>
                    )}
                  </div>
                </td>
                
                {/* Technology Column */}
                <td className={`py-3 px-2 text-center text-sm transition-colors duration-300 hidden sm:table-cell ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      maker.pillarScores?.technology >= 0.8 ? 
                        (isDarkMode ? 'text-green-400' : 'text-green-700') :
                      maker.pillarScores?.technology >= 0.6 ? 
                        (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                        (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>
                      {maker.uptime}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      {(() => {
                        const executionSpeed = parseFloat(maker.executionSpeed)
                        if (executionSpeed <= 1) return 'Fast'
                        if (executionSpeed <= 2) return 'Good'
                        return 'Slow'
                      })()}
                    </span>
                  </div>
                </td>
                
                {/* Pricing Column */}
                <td className={`py-3 px-2 text-center text-sm transition-colors duration-300 hidden sm:table-cell ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      maker.pillarScores?.pricing >= 0.8 ? 
                        (isDarkMode ? 'text-green-400' : 'text-green-700') :
                      maker.pillarScores?.pricing >= 0.6 ? 
                        (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                        (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>
                      {maker.bestSpreadToday}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      {(() => {
                        const spread = parseFloat(maker.bestSpreadToday)
                        if (spread <= 20) return 'Transparent'
                        if (spread <= 25) return 'Fair'
                        return 'Opaque'
                      })()}
                    </span>
                  </div>
                </td>
                
                {/* DeFi Integration Column */}
                <td className={`py-3 px-2 text-center text-sm transition-colors duration-300 hidden sm:table-cell ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      maker.pillarScores?.defi >= 0.8 ? 
                        (isDarkMode ? 'text-green-400' : 'text-green-700') :
                      maker.pillarScores?.defi >= 0.6 ? 
                        (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                        (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>
                      {maker.pairs}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      {(() => {
                        const specialties = maker.profile.specialties
                        if (specialties.includes('DeFi') || specialties.includes('Web3')) return 'Multi-Chain'
                        return 'Single-Chain'
                      })()}
                    </span>
                  </div>
                </td>
                
                {/* Communication Column */}
                <td className={`py-3 px-2 text-center text-sm transition-colors duration-300 hidden md:table-cell ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      maker.pillarScores?.communication >= 0.8 ? 
                        (isDarkMode ? 'text-green-400' : 'text-green-700') :
                      maker.pillarScores?.communication >= 0.6 ? 
                        (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                        (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>
                      {(() => {
                        const executionSpeed = parseFloat(maker.executionSpeed)
                        if (executionSpeed <= 1) return '15min'
                        if (executionSpeed <= 2) return '30min'
                        return '1hr+'
                      })()}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      {(() => {
                        const activeCount = maker.activity.filter(active => active).length
                        if (activeCount >= 8) return 'Transparent'
                        if (activeCount >= 6) return 'Good'
                        return 'Poor'
                      })()}
                    </span>
                  </div>
                </td>
                
                {/* Reputation Column */}
                <td className={`py-3 px-2 text-center text-sm transition-colors duration-300 hidden md:table-cell ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      maker.pillarScores?.reputation >= 0.8 ? 
                        (isDarkMode ? 'text-green-400' : 'text-green-700') :
                      maker.pillarScores?.reputation >= 0.6 ? 
                        (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                        (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>
                      {(() => {
                        const established = parseInt(maker.profile.established)
                        const yearsActive = 2025 - established
                        return `${yearsActive}yrs`
                      })()}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      {(() => {
                        const tier1Jurisdictions = ['Singapore', 'New York', 'London', 'Amsterdam', 'Monaco']
                        return tier1Jurisdictions.includes(maker.profile.location) ? 'Licensed' : 'Unlicensed'
                      })()}
                    </span>
                  </div>
                </td>
                
                {/* Balance Sheet Column */}
                <td className={`py-3 px-2 text-center text-sm transition-colors duration-300 hidden md:table-cell ${
                  isDarkMode ? 'text-white' : 'text-light-text'
                }`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      maker.pillarScores?.balanceSheet >= 0.8 ? 
                        (isDarkMode ? 'text-green-400' : 'text-green-700') :
                      maker.pillarScores?.balanceSheet >= 0.6 ? 
                        (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                        (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>
                      {maker.volumeCapacity}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      {(() => {
                        const pnl = parseFloat(maker.pnl.replace('+$', '').replace('K', ''))
                        const uptime = parseFloat(maker.uptime)
                        if (pnl > 50 && uptime > 99.5) return 'Strong'
                        if (pnl > 30) return 'Good'
                        return 'Weak'
                      })()}
                    </span>
                  </div>
                </td>
                
                {/* Status Column */}
                <td className="py-3 px-2 text-center">
                  <StatusIndicator status={maker.status} />
                </td>
                
                {/* Activity Column */}
                <td className="py-3 px-2 text-center hidden md:table-cell">
                  <ActivityIndicator activity={maker.activity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      </div>
      
      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className={`text-xs transition-colors duration-300 pl-12 z-10 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-900'
        }`}>
          Showing {startIndex + 1} to {Math.min(endIndex, displayMarketMakers.length)} of {displayMarketMakers.length} market makers
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-xl transition-all duration-300 transform ${
              currentPage === 1
                ? `cursor-not-allowed ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`
                : isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:scale-105 hover:shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-primary/10 hover:to-indigo-50 hover:scale-105 hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {(() => {
              const maxVisiblePages = 5;
              const pages = [];
              
              if (totalPages <= maxVisiblePages) {
                // Show all pages if total is less than or equal to max visible
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Smart pagination logic
                if (currentPage <= 3) {
                  // Show first pages + ellipsis + last page
                  for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                  }
                  if (totalPages > 4) {
                    pages.push('...');
                    pages.push(totalPages);
                  }
                } else if (currentPage >= totalPages - 2) {
                  // Show first page + ellipsis + last pages
                  pages.push(1);
                  if (totalPages > 4) {
                    pages.push('...');
                  }
                  for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Show first + ellipsis + current-1, current, current+1 + ellipsis + last
                  pages.push(1);
                  pages.push('...');
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                  }
                  pages.push('...');
                  pages.push(totalPages);
                }
              }
              
              return pages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className={`px-3 py-2 text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      ...
                    </span>
                  );
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? isDarkMode 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'bg-primary text-white shadow-lg shadow-primary/30'
                        : isDarkMode
                          ? 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-primary/10 hover:to-indigo-50 hover:shadow-md'
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
          </div>
          
          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-xl transition-all duration-300 transform ${
              currentPage === totalPages
                ? `cursor-not-allowed ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`
                : isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:scale-105 hover:shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-primary/10 hover:to-indigo-50 hover:scale-105 hover:shadow-md'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal maker={selectedProfile} onClose={() => setSelectedProfile(null)} />
    </div>
  )
}

export default MarketMakersTable
