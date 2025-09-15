import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, Bell, Sun, Moon, User, Settings, ChevronDown, Menu, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const buttonRef = useRef(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    if (showUserMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const isMobile = window.innerWidth < 768
      setDropdownPosition({
        top: rect.bottom + 8,
        right: isMobile ? 16 : window.innerWidth - rect.right
      })
    }
  }, [showUserMenu])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.mobile-menu')) {
        setShowMobileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMobileMenu])

  return (
    <header className={`relative border-b transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-dark-card via-dark-bg to-dark-card border-dark-border/50 backdrop-blur-xl' 
        : 'bg-gradient-to-r from-light-card via-light-bg to-light-card border-light-border/50 backdrop-blur-xl'
    }`}>
    

      <div className="w-full px-4 py-2 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center">
            <div className="font-bold text-xl sm:text-2xl">
              <span className="text-black dark:text-white">Honest</span>
              <span className="text-blue-600">MM.</span>
            </div>
          </div>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div> 
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={`md:hidden p-2.5 transition-all duration-300 rounded-xl ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-dark-border/30' 
                  : 'text-light-text-secondary hover:text-light-text hover:bg-light-border/30'
              }`}
            >
              <Search className="h-5 w-5" />
            </button>
            

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative p-2.5 transition-all duration-300 rounded-xl group ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-dark-border/30' 
                  : 'text-light-text-secondary hover:text-light-text hover:bg-light-border/30'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300" />
              ) : (
                <Moon className="h-5 w-5 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
              )}
            </button>

            {/* Desktop User Profile Dropdown */}
            <div className="hidden sm:block relative">
              <button
                ref={buttonRef}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white bg-gray-800 border-gray-700 hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop Dropdown Menu Portal */}
              {showUserMenu && createPortal(
                <div className={`fixed w-64 rounded-lg shadow-xl border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`} style={{ 
                  top: dropdownPosition.top,
                  right: dropdownPosition.right,
                  zIndex: 999999
                }}>
                  <div className={`p-4 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <User className={`w-5 h-5 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          User
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          user@honstmm.com
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center space-x-3 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center space-x-3 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </button>
                    <div className={`border-t my-2 ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}></div>
                    <button className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center space-x-3 text-red-500 hover:bg-red-50 ${
                      isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                    }`}>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`sm:hidden p-2.5 transition-all duration-300 rounded-xl ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-dark-border/30' 
                  : 'text-light-text-secondary hover:text-light-text hover:bg-light-border/30'
              }`}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={`mobile-menu sm:hidden absolute top-full left-0 right-0 border-t shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`} style={{ zIndex: 999998 }}>
            <div className="p-4">
              {/* Mobile User Profile */}
              <div className={`flex items-center space-x-3 p-3 rounded-lg mb-4 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <User className={`w-5 h-5 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    User
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    user@honstmm.com
                  </div>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="space-y-2">
                <button className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
                <div className={`border-t my-3 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}></div>
                <button className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 text-red-500 ${
                  isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                }`}>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header