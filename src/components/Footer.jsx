import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const Footer = () => {
  const { isDarkMode } = useTheme()
  return (
    <footer className={`w-full mt-10 border-t px-8 py-6 transition-colors duration-300 ${
      isDarkMode ? 'border-dark-border text-gray-400' : 'border-light-border text-light-text-secondary'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          © 2025 – HonestMM Inc.
        </p>
        <div className="flex items-center gap-4 text-xs">
          <a href="#" className={`hover:underline ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>Privacy</a>
          <a href="#" className={`hover:underline ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>Terms</a>
          <a href="#" className={`hover:underline ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer


