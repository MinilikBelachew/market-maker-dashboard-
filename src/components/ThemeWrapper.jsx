import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeWrapper = ({ children }) => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg' 
        : 'bg-gradient-to-br from-light-bg via-light-card to-light-bg'
    }`}>
      {children}
    </div>
  )
}

export default ThemeWrapper

