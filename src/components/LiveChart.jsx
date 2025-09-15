import React from 'react'
import { Activity, RefreshCw, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
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

  // Prepare data for Recharts
  const chartData = [
    {
      name: 'A+',
      count: chart.aPlusCount || 295,
      color: '#10B981'
    },
    {
      name: 'A',
      count: chart.aCount || 442,
      color: '#34D399'
    },
    {
      name: 'B+',
      count: chart.bPlusCount || 1106,
      color: '#FBBF24'
    },
    {
      name: 'B',
      count: chart.bCount || 492,
      color: '#F59E0B'
    },
    {
      name: 'C+',
      count: chart.cPlusCount || 124,
      color: '#EF4444'
    }
  ]

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded shadow-lg border ${
          isDarkMode 
            ? 'bg-dark-card border-dark-border text-white' 
            : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <p className="font-semibold">{`Rating: ${label}`}</p>
          <p className="text-sm">{`Count: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

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
        <div className={`relative h-32 mb-4 rounded-lg border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-dark-border/10 border-dark-border/20' 
            : 'bg-light-border/10 border-light-border/20'
        }`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: isDarkMode ? '#9ca3af' : '#6b7280', 
                  fontSize: 12 
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: isDarkMode ? '#9ca3af' : '#6b7280', 
                  fontSize: 10 
                }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Rating Distribution Info */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>A+ Rated</span>
            <span className={`text-xs font-bold transition-all duration-300 text-green-400`}>
              {chart.aPlusCount || 295}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>A Rated</span>
            <span className={`text-xs transition-all duration-300 text-green-300`}>
              {chart.aCount || 442}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>B+ Rated</span>
            <span className={`text-xs transition-all duration-300 text-yellow-400`}>
              {chart.bPlusCount || 1106}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>B Rated</span>
            <span className={`text-xs transition-all duration-300 text-orange-400`}>
              {chart.bCount || 492}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>C+ Rated</span>
            <span className={`text-xs transition-all duration-300 text-red-400`}>
              {chart.cPlusCount || 124}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveChart