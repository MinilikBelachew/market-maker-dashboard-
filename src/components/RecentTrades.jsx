import React, { useState, useEffect } from 'react'

const RecentTrades = () => {
  const [trades, setTrades] = useState([
    {
      id: 1,
      marketMaker: 'CryptoFlow',
      pair: 'BTC/USD',
      side: 'buy',
      price: '$67,234.50',
      volume: '0.25 BTC',
      time: '2s ago',
      status: 'success',
      slippage: '0.02%'
    },
    {
      id: 2,
      marketMaker: 'BlockChainPro',
      pair: 'ETH/USD',
      side: 'sell',
      price: '$3,456.78',
      volume: '2.5 ETH',
      time: '5s ago',
      status: 'success',
      slippage: '0.01%'
    },
    {
      id: 3,
      marketMaker: 'OnlyDegens',
      pair: 'SOL/USD',
      side: 'buy',
      price: '$198.45',
      volume: '15 SOL',
      time: '8s ago',
      status: 'success',
      slippage: '0.05%'
    },
    {
      id: 4,
      marketMaker: 'Astro',
      pair: 'BTC/USD',
      side: 'sell',
      price: '$67,198.30',
      volume: '0.15 BTC',
      time: '12s ago',
      status: 'success',
      slippage: '0.03%'
    },
    {
      id: 5,
      marketMaker: 'TokenMaster',
      pair: 'DOGE/USD',
      side: 'buy',
      price: '$0.0845',
      volume: '5000 DOGE',
      time: '15s ago',
      status: 'failed',
      slippage: '0.15%'
    },
    {
      id: 6,
      marketMaker: 'DigitalFlow',
      pair: 'ADA/USD',
      side: 'sell',
      price: '$0.4567',
      volume: '100 ADA',
      time: '18s ago',
      status: 'success',
      slippage: '0.01%'
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-500/20'
      case 'failed': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getSideColor = (side) => {
    return side === 'buy' ? 'text-green-400' : 'text-red-400'
  }

  const getSideIcon = (side) => {
    return side === 'buy' ? '↗️' : '↘️'
  }

  return (
    <div className="relative overflow-hidden bg-dark-card border border-dark-border rounded-2xl shadow-xl p-6">
      {/* Background decoration */}
      
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Recent Trades
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="group flex items-center justify-between p-3 bg-dark-border/20 rounded-xl border border-dark-border/30 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                {/* Trade Side Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getSideColor(trade.side)} bg-dark-border/50`}>
                  {getSideIcon(trade.side)}
                </div>
                
                {/* Trade Details */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold text-sm">{trade.pair}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(trade.status)}`}>
                      {trade.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {trade.marketMaker} • {trade.time}
                  </div>
                </div>
              </div>
              
              {/* Price and Volume */}
              <div className="text-right">
                <div className={`font-bold text-sm ${getSideColor(trade.side)}`}>
                  {trade.price}
                </div>
                <div className="text-xs text-gray-400">
                  {trade.volume}
                </div>
                <div className="text-xs text-gray-500">
                  Slippage: {trade.slippage}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-dark-border/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">5</div>
              <div className="text-xs text-gray-400">Successful</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">1</div>
              <div className="text-xs text-gray-400">Failed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">0.05%</div>
              <div className="text-xs text-gray-400">Avg Slippage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentTrades

