import React from 'react'
import { TrendingUp, Activity, RefreshCw, AlertTriangle, Star, Award, Target, AlertCircle } from 'lucide-react'
import { useChartData } from '../hooks/useDashboardData'
import { useTheme } from '../contexts/ThemeContext'

const LiveChart = () => {
  const { chart, isLoading, error } = useChartData()
  const { isDarkMode } = useTheme()

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden border rounded-xl shadow-lg p-4 w-full transition-colors duration-300 ${
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
      <div className={`relative overflow-hidden border rounded-xl shadow-lg p-4 w-full transition-colors duration-300 ${
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

  const chartData = chart.ratingDistribution || chart.chartPoints

  // Create bar chart data for rating distribution
  const createBarChartData = () => {
    const ratingTiers = ['A+', 'A', 'B+', 'B', 'C+']
    const colors = {
      'A+': '#10B981', // Green
      'A': '#34D399', // Light green
      'B+': '#FBBF24', // Yellow
      'B': '#F59E0B', // Orange
      'C+': '#EF4444'  // Red
    }
    
    const counts = {
      'A+': chart.aPlusCount || 295,
      'A': chart.aCount || 442,
      'B+': chart.bPlusCount || 1106,
      'B': chart.bCount || 492,
      'C+': chart.cPlusCount || 124
    }
    
    const maxCount = Math.max(...Object.values(counts))
    
    return ratingTiers.map((tier, index) => {
      const count = counts[tier]
      const height = (count / maxCount) * 60 // Scale to chart height
      const x = 10 + (index * 18) // Bar positions
      const y = 70 - height // Bottom-up positioning
      
      return {
        tier,
        count,
        x,
        y,
        height,
        color: colors[tier],
        width: 15
      }
    })
  }

  const barData = createBarChartData()

  return (
    <div className={`relative overflow-hidden border rounded-xl shadow-sm p-4 w-full transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-dark-card to-dark-bg border-dark-border' 
        : 'bg-gradient-to-br from-light-card to-light-bg border-light-border'
    }`}>
      {/* Minimal background decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-accent-blue/5 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-light-text'
          }`}>
            MM Rating Distribution
          </h2>
          <div className={`flex items-center space-x-2 text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
          }`}>
            <Activity className="w-3 h-3 text-green-400 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      
        {/* Chart Container */}
        <div className={`relative h-32 mb-4 rounded-lg p-2 border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-dark-border/10 border-dark-border/20' 
            : 'bg-light-border/10 border-light-border/20'
        }`}>
          <svg
            className="w-full h-full"
            viewBox="0 0 100 80"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.3"/>
              </pattern>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <rect width="100" height="80" fill="url(#grid)" />
            
            {/* Bar chart for rating distribution */}
            {barData.map((bar, index) => (
              <g key={bar.tier}>
                {/* Bar rectangle */}
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={bar.color}
                  fillOpacity="0.8"
                  rx="2"
                  ry="2"
                />
                {/* Bar border */}
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill="none"
                  stroke={bar.color}
                  strokeWidth="1"
                  rx="2"
                  ry="2"
                />
                {/* Count label on top of bar */}
                <text
                  x={bar.x + bar.width / 2}
                  y={bar.y - 2}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isDarkMode ? '#ffffff' : '#374151'}
                  fontWeight="bold"
                >
                  {bar.count}
                </text>
                {/* Rating label below bar */}
                <text
                  x={bar.x + bar.width / 2}
                  y="85"
                  textAnchor="middle"
                  fontSize="7"
                  fill={isDarkMode ? '#9ca3af' : '#6b7280'}
                >
                  {bar.tier}
                </text>
              </g>
            ))}
          </svg>
        </div>
        
        {/* Rating Distribution Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>A+ Rated</span>
            <span className={`text-sm font-bold transition-all duration-300 text-green-400`}>
              {chart.aPlusCount || 295}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>A Rated</span>
            <span className={`text-sm transition-all duration-300 text-green-300`}>
              {chart.aCount || 442}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>B+ Rated</span>
            <span className={`text-sm transition-all duration-300 text-yellow-400`}>
              {chart.bPlusCount || 1106}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>B Rated</span>
            <span className={`text-sm transition-all duration-300 text-orange-400`}>
              {chart.bCount || 492}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>C+ Rated</span>
            <span className={`text-sm transition-all duration-300 text-red-400`}>
              {chart.cPlusCount || 124}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveChart