import React, { useState } from 'react'
import { CryptoCard } from './CryptoCard'
import { CryptoDetail } from './CryptoDetail'

export function MarketView({ cryptos = [], onCryptoSelect }) {
  const [selectedCrypto, setSelectedCrypto] = useState(null)

  if (cryptos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted">Loading market data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {selectedCrypto ? (
        <div>
          <button 
            onClick={() => setSelectedCrypto(null)}
            className="mb-4 px-4 py-2 bg-[#ffffff14] hover:bg-[#ffffff1f] rounded-lg transition-colors"
          >
            ← Back to Market
          </button>
          <CryptoDetail crypto={selectedCrypto} />
        </div>
      ) : (
        <>
          <div className="text-muted mb-4">
            Showing {cryptos.length} cryptocurrencies
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cryptos.map(crypto => (
              <CryptoCard 
                key={crypto.id} 
                crypto={crypto} 
                onClick={() => {
                  if (onCryptoSelect) {
                    onCryptoSelect(crypto)
                  } else {
                    setSelectedCrypto(crypto)
                  }
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
