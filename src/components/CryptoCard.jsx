import React, { useState } from 'react'

export function CryptoCard({ crypto, onClick }) {
  const [imageError, setImageError] = useState(false)
  
  if (!crypto) return null

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative bg-card border-2 border-[#ffffff14] rounded-xl p-4 transform transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ffffff0a] active:translate-y-0">
        <div className="absolute -top-1 -left-1 w-full h-full bg-[#ffffff08] rounded-xl -z-10"></div>
        <div className="absolute -top-2 -left-2 w-full h-full bg-[#ffffff05] rounded-xl -z-20"></div>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {!imageError ? (
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-10 h-10 rounded-lg"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#ffffff14] flex items-center justify-center text-lg font-bold">
                {crypto.symbol.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg">{crypto.name}</h3>
              <span className="text-muted uppercase">{crypto.symbol}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-sm ${
            crypto.price_change_percentage_24h > 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
          }`}>
            {crypto.price_change_percentage_24h > 0 ? '↑' : '↓'}
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted">Price</span>
            <span className="font-medium">${crypto.current_price?.toLocaleString() ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Market Cap</span>
            <span className="font-medium">
              {crypto.market_cap ? `$${(crypto.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Volume (24h)</span>
            <span className="font-medium">
              {crypto.total_volume ? `$${(crypto.total_volume / 1e9).toFixed(2)}B` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm text-muted">Click to view details →</span>
        </div>
      </div>
    </div>
  )
}
