import React, { useState } from 'react'

export function CryptoTable({ cryptos, onCryptoClick, limit = 20 }) {
  const [imageErrors, setImageErrors] = useState({})

  const handleImageError = (cryptoId) => {
    setImageErrors(prev => ({
      ...prev,
      [cryptoId]: true
    }))
  }

  // Only show up to the specified limit (default 20)
  const displayCryptos = cryptos.slice(0, limit)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-muted">
            <th className="pb-4">Name</th>
            <th className="pb-4">Price</th>
            <th className="pb-4">24h Change</th>
            <th className="pb-4">Market Cap</th>
            <th className="pb-4">Volume (24h)</th>
          </tr>
        </thead>
        <tbody>
          {displayCryptos.map((crypto) => (
            <tr 
              key={crypto.id} 
              className="border-t border-muted/10 cursor-pointer hover:bg-[#ffffff08] transition-colors"
              onClick={() => onCryptoClick(crypto)}
            >
              <td className="py-4">
                <div className="flex items-center gap-2">
                  {!imageErrors[crypto.id] ? (
                    <img 
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-6 h-6 rounded-full"
                      onError={() => handleImageError(crypto.id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#ffffff14] flex items-center justify-center text-xs">
                      {crypto.symbol.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{crypto.name}</span>
                  <span className="text-muted uppercase">{crypto.symbol}</span>
                </div>
              </td>
              <td className="py-4">
                ${crypto.current_price?.toLocaleString() ?? 'N/A'}
              </td>
              <td className={`py-4 ${crypto.price_change_percentage_24h > 0 ? 'text-success' : 'text-danger'}`}>
                {crypto.price_change_percentage_24h > 0 ? '↑' : '↓'} 
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </td>
              <td className="py-4">
                ${(crypto.market_cap / 1e9).toFixed(2)}B
              </td>
              <td className="py-4">
                ${(crypto.total_volume / 1e9).toFixed(2)}B
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
