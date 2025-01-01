import React, { useEffect, useState, useCallback } from 'react'
import { StatsCard } from './components/StatsCard'
import { CryptoChart } from './components/CryptoChart'
import { CryptoTable } from './components/CryptoTable'
import { TopMovers } from './components/TopMovers'
import { MarketView } from './components/MarketView'
import { CryptoDetail } from './components/CryptoDetail'
import { getMarketStats, getTopCryptos } from './services/api'
import { CryptoWebSocket } from './services/websocket'

export default function App() {
  const [marketStats, setMarketStats] = useState({
    marketCap: 0,
    volume: 0,
    btcDominance: 0
  })
  const [topCryptos, setTopCryptos] = useState([])
  const [realTimePrices, setRealTimePrices] = useState({})
  const [activeView, setActiveView] = useState('dashboard')
  const [previousView, setPreviousView] = useState('dashboard')
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleWebSocketMessage = useCallback((data) => {
    if (data.e === 'trade') {
      setRealTimePrices(prev => ({
        ...prev,
        [data.s.replace('USDT', '').toLowerCase()]: {
          price: parseFloat(data.p),
          time: data.T
        }
      }))
    }
  }, [])

  useEffect(() => {
    let ws = new CryptoWebSocket(handleWebSocketMessage)
    
    const fetchAndUpdateData = async () => {
      try {
        setIsLoading(true)
        const [stats, cryptos] = await Promise.all([
          getMarketStats(),
          getTopCryptos()
        ])
        setMarketStats(stats)
        setTopCryptos(cryptos)
        
        // Subscribe to WebSocket feeds for each crypto
        cryptos.forEach(crypto => {
          ws.subscribe(`${crypto.symbol}usdt`)
        })
        
        setError(null)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load data. Retrying...')
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchAndUpdateData()

    // Connect WebSocket
    ws.connect()

    // Polling for market stats and other non-WebSocket data
    const statsInterval = setInterval(() => {
      getMarketStats().then(setMarketStats).catch(console.error)
    }, 30000)

    // Full refresh every 5 minutes
    const refreshInterval = setInterval(fetchAndUpdateData, 300000)

    return () => {
      clearInterval(statsInterval)
      clearInterval(refreshInterval)
      ws.disconnect()
    }
  }, [handleWebSocketMessage])

  // Update crypto prices with real-time data
  const cryptosWithRealTime = topCryptos.map(crypto => {
    const realtimeData = realTimePrices[crypto.symbol.toLowerCase()]
    if (realtimeData) {
      const priceChange = ((realtimeData.price - crypto.current_price) / crypto.current_price) * 100
      return {
        ...crypto,
        current_price: realtimeData.price,
        price_change_percentage_24h: crypto.price_change_percentage_24h + priceChange
      }
    }
    return crypto
  })

  const handleCryptoSelect = (crypto) => {
    setPreviousView(activeView)
    setSelectedCrypto(crypto)
    setActiveView('detail')
  }

  const handleBackClick = () => {
    setSelectedCrypto(null)
    setActiveView(previousView)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  const renderContent = () => {
    if (activeView === 'detail' && selectedCrypto) {
      return (
        <div>
          <button 
            onClick={handleBackClick}
            className="mb-4 px-4 py-2 bg-[#ffffff14] hover:bg-[#ffffff1f] rounded-lg transition-colors"
          >
            ← Back to {previousView === 'dashboard' ? 'Overview' : 'Market'}
          </button>
          <CryptoDetail crypto={selectedCrypto} />
        </div>
      )
    }

    if (activeView === 'dashboard') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard
              title="Market Cap"
              value={`$${(marketStats.marketCap / 1e12).toFixed(2)}T`}
              change={2.4}
              isPositive={true}
            />
            <StatsCard
              title="24h Volume"
              value={`$${(marketStats.volume / 1e9).toFixed(2)}B`}
              change={5.1}
              isPositive={true}
            />
            <StatsCard
              title="BTC Dominance"
              value={`${marketStats.btcDominance.toFixed(1)}%`}
              change={0.8}
              isPositive={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-6 backdrop-blur-sm h-[400px]">
                <h2 className="text-xl font-semibold mb-4">Bitcoin Price</h2>
                <CryptoChart realtimePrice={realTimePrices.btc?.price} />
              </div>
            </div>
            <div>
              <div className="bg-card rounded-xl p-6 backdrop-blur-sm h-[400px]">
                <h2 className="text-xl font-semibold mb-4">Top Movers</h2>
                <div className="overflow-y-auto h-[332px]">
                  <TopMovers 
                    cryptos={cryptosWithRealTime} 
                    onCryptoClick={handleCryptoSelect}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Top Cryptocurrencies</h2>
            <CryptoTable 
              cryptos={cryptosWithRealTime} 
              onCryptoClick={handleCryptoSelect}
              limit={20}
            />
          </div>
        </>
      )
    }

    return (
      <MarketView 
        cryptos={cryptosWithRealTime} 
        onCryptoSelect={handleCryptoSelect}
      />
    )
  }

  return (
    <div className="min-h-screen bg-dark text-light p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Valmiki's Crypto Dashboard</h1>
        <p className="text-muted">Real-time market overview</p>
        {error && (
          <div className="mt-2 text-sm text-danger bg-danger/10 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => {
              setActiveView('dashboard')
              setSelectedCrypto(null)
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'dashboard' 
                ? 'bg-[#ffffff14] text-light' 
                : 'text-muted hover:text-light'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setActiveView('market')
              setSelectedCrypto(null)
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'market' 
                ? 'bg-[#ffffff14] text-light' 
                : 'text-muted hover:text-light'
            }`}
          >
            View Market
          </button>
        </div>
      </header>

      {renderContent()}
    </div>
  )
}
