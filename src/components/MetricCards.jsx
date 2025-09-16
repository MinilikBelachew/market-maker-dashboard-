import React from 'react'
import { useMetricsData } from '../hooks/useDashboardData'
import { useTheme } from '../contexts/ThemeContext'
import { Star, BarChart2, DollarSign, Building2 } from 'lucide-react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

const MetricCards = () => {
  const { metrics, isLoading, error } = useMetricsData()
  const { isDarkMode } = useTheme()

  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`relative border rounded-xl p-6 animate-pulse transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-dark-card/60 border-dark-border' 
              : 'bg-light-card/60 border-light-border'
          }`}>
            <div className={`h-8 rounded mb-2 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
            <div className={`h-4 rounded w-3/4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
          </div>
        ))}
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-full bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  const metricsData = [
    {
      title: 'Total Market Makers',
      value: metrics.totalMakers.toLocaleString(),
      subtitle: 'Active Liquidity Providers',
      borderGradient: 'from-blue-500/40 via-cyan-500/40 to-blue-600/40',
      icon: <Building2 className={`w-6 h-6 ${isDarkMode ? 'text-white/90' : 'text-light-text'}`} />
    },
    {
      title: 'A+ Rated MMs',
      value: Math.floor(metrics.totalMakers * 0.12).toLocaleString(),
      subtitle: 'World-Class Providers',
      borderGradient: 'from-green-500/40 via-emerald-500/40 to-green-600/40',
      icon: <Star className={`w-6 h-6 ${isDarkMode ? 'text-white/90' : 'text-light-text'}`} />
    },
    {
      title: 'Average Rating',
      value: 'B+',
      subtitle: 'Overall Quality Score',
      borderGradient: 'from-yellow-500/40 via-amber-500/40 to-yellow-600/40',
      icon: <BarChart2 className={`w-6 h-6 ${isDarkMode ? 'text-white/90' : 'text-light-text'}`} />
    },
    {
      title: 'Financial Strength',
      value: '68%',
      subtitle: 'Capital Liquidity',
      borderGradient: 'from-green-500/40 via-emerald-500/40 to-green-600/40',
      icon: <DollarSign className={`w-6 h-6 ${isDarkMode ? 'text-white/90' : 'text-light-text'}`} />
    }
  ]
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricsData.map((metric, index) => (
        <div 
          key={index} 
          className={`relative border rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group ${
            isDarkMode 
              ? 'bg-dark-card/60 border-dark-border' 
              : 'bg-light-card/60 border-light-border'
          }`}
          
        >
          {/* Thin bluish glow border */}
          <div className="absolute inset-0 rounded-xl border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className={`text-4xl font-bold tracking-tight transition-all duration-300 ${
                isDarkMode ? 'text-white' : 'text-light-text'
              }`}>
                {metric.value}
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                isDarkMode ? 'bg-dark-border/40' : 'bg-light-border/60'
              }`}>
                {metric.icon}
              </div>
            </div>
            <div className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-light-text'
            }`}>
              {metric.title}
            </div>
            <div className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>
              {metric.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MetricCards
