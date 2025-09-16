import React from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import ThemeWrapper from './components/ThemeWrapper'
import Header from './components/Header'
import MetricCards from './components/MetricCards'
import MarketMakersTable from './components/MarketMakersTable'
import LiveChart from './components/LiveChart'
import OrderBook from './components/OrderBook'
import Alerts from './components/Alerts'
import Trades from './components/Trades'
import BottomAlerts from './components/BottomAlerts'
import Footer from './components/Footer'

const AppContent = () => {
  const { isDarkMode } = useTheme()
  
  return (
    <>
      <Header />
      <main className="w-full px-8 py-8 ">
        
        {/* Trading Pairs Grid - Under the table */}
        <div className="mt-2 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <LiveChart />
            <OrderBook />
            <Trades />
            <Alerts />
          </div>
        </div>
        
        {/* Market Makers Table - Full Width */}
        <div className="mt-8">
          <MarketMakersTable />
        </div>
        
      
        
        {/* Additional Trading Info */}
        <div className="mt-8">
          <BottomAlerts />
        </div>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <AppContent />
      </ThemeWrapper>
    </ThemeProvider>
  )
}

export default App
