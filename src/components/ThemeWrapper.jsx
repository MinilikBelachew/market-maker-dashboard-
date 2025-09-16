import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeWrapper = ({ children }) => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-dark-bg' 
        : 'bg-light-bg'
    }`}>
      {children}
    </div>
  )
}

export default ThemeWrapper

