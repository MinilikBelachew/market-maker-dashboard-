import React from 'react'
import { AlertTriangle, CheckCircle, RefreshCw, Info, Shield, DollarSign, MessageSquare, Cpu, Target, AlertCircle, XCircle } from 'lucide-react'
import { useAlertsData } from '../hooks/useDashboardData'
import { useTheme } from '../contexts/ThemeContext'

const Alerts = () => {
  const { alerts, isLoading, error } = useAlertsData()
  const { isDarkMode } = useTheme()

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden border rounded-xl shadow-sm p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-light-card border-light-border'
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
          ? 'bg-dark-card border-dark-border' 
          : 'bg-light-card border-light-border'
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

  // Map red flag types to display properties
  const getRedFlagConfig = (redFlagType, severity) => {
    const configs = {
      'Balance Sheet Insolvency': {
        icon: DollarSign,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        iconColor: 'text-red-500'
      },
      'Communication Blackout': {
        icon: MessageSquare,
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        textColor: 'text-orange-400',
        iconColor: 'text-orange-500'
      },
      'Technology Failure': {
        icon: Cpu,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        iconColor: 'text-red-500'
      },
      'Poor Performance': {
        icon: Target,
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        textColor: 'text-orange-400',
        iconColor: 'text-orange-500'
      },
      'Regulatory Issues': {
        icon: Shield,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        iconColor: 'text-red-500'
      },
      'Security Breach': {
        icon: AlertCircle,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        iconColor: 'text-red-500'
      }
    }
    return configs[redFlagType] || {
      icon: AlertTriangle,
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
      textColor: 'text-gray-400',
      iconColor: 'text-gray-500'
    }
  }

  // Map alert types to display properties (fallback)
  const getAlertConfig = (type) => {
    const configs = {
      error: {
        icon: AlertTriangle,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        iconColor: 'text-red-500'
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        textColor: 'text-orange-400',
        iconColor: 'text-orange-500'
      },
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-400',
        iconColor: 'text-green-500'
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-400',
        iconColor: 'text-blue-500'
      }
    }
    return configs[type] || configs.info
  }

  return (
    <>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className={`relative overflow-hidden border rounded-xl shadow-sm p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-light-card border-light-border'
      }`}>
        {/* Minimal background decoration */}
        
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-light-text'
          }`}>HonestMM Red Flag Alerts</h2>
          <div className={`flex items-center space-x-1 text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
          }`}>
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Live Monitoring</span>
          </div>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
          {alerts.filter(alert => alert.active).map((alert) => {
            // Use red flag config if available, otherwise fallback to alert type config
            const config = alert.redFlagType 
              ? getRedFlagConfig(alert.redFlagType, alert.severity)
              : getAlertConfig(alert.type)
            
            return (
              <div
                key={alert.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700/20 border-gray-600/30 hover:bg-gray-700/30' 
                    : 'bg-gray-100/80 border-gray-200/60 hover:bg-gray-100'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <config.icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-light-text'
                    }`}>
                      {alert.marketMaker || 'System'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                      alert.severity === 'critical' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {alert.severity?.toUpperCase() || alert.type?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className={`font-medium text-xs mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {alert.redFlagType || alert.message}
                  </div>
                  
                  {alert.redFlagType && (
                    <div className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
                    }`}>
                      {alert.message}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-500' : 'text-light-text-secondary'
                    }`}>
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                    
                    {alert.condition && (
                      <span className={`text-xs px-2 py-1 rounded transition-colors duration-300 ${
                        isDarkMode ? 'bg-dark-border/20 text-gray-400' : 'bg-light-border/20 text-light-text-secondary'
                      }`}>
                        {alert.condition}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {alerts.filter(alert => alert.active).length === 0 && (
            <div className={`text-center py-8 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-light-text-secondary'
            }`}>
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-sm">No active red flag alerts</p>
              <p className="text-xs">All market makers operating normally</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default Alerts