import React, { useState, useMemo } from 'react'
import { CryptoCard } from './CryptoCard'

export function MarketView({ cryptos = [], onCryptoSelect }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCryptos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return cryptos // Show all cryptos when no search query

    return cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(query) ||
      crypto.symbol.toLowerCase().includes(query)
    )
  }, [cryptos, searchQuery])

  if (cryptos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted">Loading market data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-muted">
          Showing {filteredCryptos.length} of {cryptos.length} cryptocurrencies
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or symbol..."
              className="w-full md:w-[300px] px-4 py-2 bg-[#ffffff14] rounded-lg outline-none focus:ring-2 focus:ring-accent/50 text-light placeholder-muted"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-light"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredCryptos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-muted mb-2">No cryptocurrencies found matching "{searchQuery}"</div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-accent hover:text-accent/80"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCryptos.map(crypto => (
            <CryptoCard 
              key={crypto.id} 
              crypto={crypto} 
              onClick={() => onCryptoSelect(crypto)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
