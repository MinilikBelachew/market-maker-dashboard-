// Simple test script to verify real-time data service
import marketDataService from './src/services/marketDataService.js'

console.log('🚀 Testing Market Data Service...\n')

// Get initial data
console.log('📊 Initial data:')
const initialData = marketDataService.getCurrentData()
console.log(`Found ${initialData.length} market makers`)
console.log('Sample data:', initialData[0])

// Subscribe to updates
console.log('\n🔄 Starting real-time updates...')
const unsubscribe = marketDataService.subscribe((data) => {
  console.log(`\n⏰ Update at ${new Date().toLocaleTimeString()}`)
  console.log(`📈 Sample changes:`)
  console.log(`  - ${data[0].name}: PnL ${data[0].pnl}, Volume ${data[0].volume}`)
  console.log(`  - ${data[1].name}: PnL ${data[1].pnl}, Volume ${data[1].volume}`)
})

// Start updates
marketDataService.startUpdates(3000) // Update every 3 seconds

// Stop after 15 seconds
setTimeout(() => {
  console.log('\n⏹️  Stopping updates...')
  marketDataService.stopUpdates()
  unsubscribe()
  console.log('✅ Test completed!')
  process.exit(0)
}, 15000)
