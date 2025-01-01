import React, { useState } from 'react'

export function TopMovers({ cryptos, onCryptoClick }) {
  const [imageErrors, setImageErrors] = useState({})
  
  const handleImageError = (cryptoId) => {
    setImageErrors(prev => ({
      ...prev,
      [cryptoId]: true
    }))
  }

  const sortedCryptos = [...cryptos].sort((a, b) => 
    Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)
  )

  const gainers = sortedCryptos
    .filter(crypto => crypto.price_change_percentage_24h > 0)
    .slice(0, 3)

  const losers = sortedCryptos
    .filter(crypto => crypto.price_change_percentage_24h < 0)
    .slice(0, 3)

  const CryptoCard = ({ crypto }) => (
    <div 
      onClick={() => onCryptoClick(crypto)}
      className="flex items-center justify-between p-3 rounded-lg bg-[#ffffff08] backdrop-blur-sm hover:bg-[#ffffff0f] transition-colors cursor-pointer"
    >
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
        <div>
          <div className="font-medium">{crypto.symbol.toUpperCase()}</div>
          <div className="text-sm text-muted">${crypto.current_price.toLocaleString()}</div>
        </div>
      </div>
      <div className={`text-right ${crypto.price_change_percentage_24h > 0 ? 'text-success' : 'text-danger'}`}>
        <div className="font-medium">
          {crypto.price_change_percentage_24h > 0 ? '↑' : '↓'}
          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
        </div>
        <div className="text-sm">24h</div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-3">Top Gainers</h3>
        <div className="space-y-2">
          {gainers.map(crypto => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Top Losers</h3>
        <div className="space-y-2">
          {losers.map(crypto => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      </div>
    </div>
  )
}
