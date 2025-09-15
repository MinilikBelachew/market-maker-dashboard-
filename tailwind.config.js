/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-bg': '#1A1A2E',
        'dark-card': '#16213E',
        'dark-border': '#0F3460',
        
        // Light theme colors
        'light-bg': '#F8FAFC',
        'light-card': '#FFFFFF',
        'light-border': '#E2E8F0',
        'light-text': '#1E293B',
        'light-text-secondary': '#64748B',
        
        // Accent colors (same for both themes)
        'accent-blue': '#00D4FF',
        'accent-purple': '#8B5CF6',
        'accent-pink': '#EC4899',
        'success-green': '#10B981',
        'warning-orange': '#F59E0B',
        'error-red': '#EF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
