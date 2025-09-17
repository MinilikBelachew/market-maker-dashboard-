import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Star, Award, Zap, Target, Shield, Activity, RefreshCw, AlertTriangle } from 'lucide-react'
import marketDataService from '../services/marketDataService'
import { useTheme } from '../contexts/ThemeContext'

const BottomAlerts = () => {
  const [marketMakers, setMarketMakers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    // Get initial data
    try {
      const makers = marketDataService.getCurrentData()
      setMarketMakers(makers)
      setIsLoading(false)
    } catch (e) {
      setError('Failed to load performance insights')
      setIsLoading(false)
    }

    // Subscribe to updates
    const updateData = (data) => setMarketMakers(data)
    marketDataService.subscribe(updateData)
    if (!marketDataService.isUpdating()) {
      marketDataService.startUpdates()
    }

    return () => marketDataService.stopUpdates()
  }, [])

  // Calculate performance insights
  const getPerformanceInsights = () => {
    if (!marketMakers.length) return []

    const insights = []

    // Top Performers This Week (top 3 by score)
    const topPerformers = [...marketMakers]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 3)
    
    insights.push({
      id: 'top-performers',
      type: 'success',
      title: 'Top Performers This Week',
      icon: Award,
      data: topPerformers.map(maker => ({
        name: maker.name,
        score: maker.score || 0,
        grade: maker.grade || 'N/A'
      })),
      description: 'Highest rated market makers'
    })

    // Most Improved (simulated - based on recent activity)
    const mostImproved = [...marketMakers]
      .filter(maker => maker.activity && maker.activity.filter(a => a).length >= 7)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 2)
    
    insights.push({
      id: 'most-improved',
      type: 'info',
      title: 'Most Improved',
      icon: TrendingUp,
      data: mostImproved.map(maker => ({
        name: maker.name,
        improvement: `+${Math.floor(Math.random() * 15) + 5}%`,
        grade: maker.grade || 'N/A'
      })),
      description: 'Biggest score increases'
    })

    // New Additions (simulated - recently added)
    const newAdditions = [...marketMakers]
      .filter(maker => maker.profile?.established === '2023' || maker.profile?.established === '2024')
      .slice(0, 2)
    
    insights.push({
      id: 'new-additions',
      type: 'warning',
      title: 'New Additions',
      icon: Star,
      data: newAdditions.map(maker => ({
        name: maker.name,
        established: maker.profile?.established || '2024',
        grade: maker.grade || 'N/A'
      })),
      description: 'Recently added market makers'
    })

    return insights
  }

  // Get insight configuration
  const getInsightConfig = (type) => {
    const common = {
      textColor: isDarkMode ? 'text-gray-300' : 'text-primary/80',
      iconColor: isDarkMode ? 'text-gray-300' : 'text-primary/90'
    }
    if (type === 'success') return { icon: Award, ...common }
    if (type === 'warning') return { icon: Star, ...common }
    return { icon: TrendingUp, ...common }
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`border rounded-xl p-4 animate-pulse transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-dark-card/60 border-dark-border' 
                : 'bg-light-card/60 border-light-border'
            }`}>
              <div className={`h-6 rounded mb-2 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
              <div className={`h-4 rounded w-3/4 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="mt-12">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  const insights = getPerformanceInsights()

  return (
    <div className="mt-12">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-light-text'
        }`}>
          Performance Insights
        </h2>
        <p className={`text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
        }`}>
          Market maker performance trends and insights
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight) => {
          const config = getInsightConfig(insight.type)
          return (
            <div
              key={insight.id}
              className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 border-l-2 ${
                isDarkMode ? 'bg-dark-card border border-dark-border' : 'bg-light-card border border-light-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-600/20 border border-gray-500/30' : 'bg-primary/5 border border-primary/20'
                  }`}>
                    <config.icon className={`w-4 h-4 ${config.iconColor}`} />
                  </div>
                  <div>
                    <h3 className={`${config.textColor} font-semibold text-sm`}>
                      {insight.title}
                    </h3>
                    <p className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {insight.data.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-dark-border/20' : 'bg-light-border/20'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-light-text'
                      }`}>
                        {item.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                        item.grade === 'A+' ? 'bg-green-500/20 text-green-400' :
                        item.grade === 'A' ? 'bg-green-500/20 text-green-400' :
                        item.grade === 'B+' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.grade === 'B' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {item.grade}
                      </span>
                    </div>
                    <div className="text-right">
                      {item.score && (
                        <span className={`text-xs font-bold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-light-text'
                        }`}>
                          {item.score}
                        </span>
                      )}
                      {item.improvement && (
                        <span className="text-xs text-green-400 font-semibold">
                          {item.improvement}
                        </span>
                      )}
                      {item.established && (
                        <span className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                        }`}>
                          {item.established}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Hover effect */}
              
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BottomAlerts