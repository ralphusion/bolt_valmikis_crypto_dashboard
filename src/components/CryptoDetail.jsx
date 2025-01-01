import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'

export function CryptoDetail({ crypto }) {
  const chartContainerRef = useRef()
  const [chartError, setChartError] = useState(false)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#141413' },
        textColor: '#828179',
      },
      grid: {
        vertLines: { color: '#ffffff10' },
        horzLines: { color: '#ffffff10' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })

    const areaSeries = chart.addAreaSeries({
      lineColor: '#8989DE',
      topColor: '#8989DE20',
      bottomColor: 'transparent',
      lineWidth: 2,
    })

    try {
      if (crypto?.sparkline_in_7d?.price) {
        const data = crypto.sparkline_in_7d.price
          .map((price, index) => ({
            time: Math.floor(Date.now() / 1000) - (168 - index) * 3600,
            value: price
          }))
          .filter(item => !isNaN(item.value))
          .sort((a, b) => a.time - b.time)

        if (data.length > 0) {
          areaSeries.setData(data)
        } else {
          setChartError(true)
        }
      }
    } catch (error) {
      console.error('Chart error:', error)
      setChartError(true)
    }

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [crypto])

  return (
    <div className="space-y-6">
      <div className="bg-card border-2 border-[#ffffff14] rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-16 h-16 rounded-xl"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `https://via.placeholder.com/64x64.png?text=${crypto.symbol.charAt(0)}`
            }}
          />
          <div>
            <h2 className="text-2xl font-bold">{crypto.name}</h2>
            <span className="text-muted uppercase">{crypto.symbol}</span>
          </div>
          <div className={`ml-auto px-3 py-1 rounded-lg text-lg ${
            crypto.price_change_percentage_24h > 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
          }`}>
            {crypto.price_change_percentage_24h > 0 ? '↑' : '↓'}
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#ffffff08] rounded-lg p-4">
            <div className="text-muted mb-1">Price</div>
            <div className="text-xl font-bold">${crypto.current_price?.toLocaleString() ?? 'N/A'}</div>
          </div>
          <div className="bg-[#ffffff08] rounded-lg p-4">
            <div className="text-muted mb-1">Market Cap</div>
            <div className="text-xl font-bold">
              {crypto.market_cap ? `$${(crypto.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
            </div>
          </div>
          <div className="bg-[#ffffff08] rounded-lg p-4">
            <div className="text-muted mb-1">Volume (24h)</div>
            <div className="text-xl font-bold">
              {crypto.total_volume ? `$${(crypto.total_volume / 1e9).toFixed(2)}B` : 'N/A'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Price Chart (7D)</h3>
          {chartError ? (
            <div className="h-[400px] flex items-center justify-center text-muted">
              Chart data unavailable
            </div>
          ) : (
            <div ref={chartContainerRef} />
          )}
        </div>
      </div>

      <div className="bg-card border-2 border-[#ffffff14] rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-muted mb-2">Circulating Supply</div>
            <div className="font-medium">
              {crypto.circulating_supply 
                ? `${crypto.circulating_supply.toLocaleString()} ${crypto.symbol.toUpperCase()}`
                : 'N/A'
              }
            </div>
          </div>
          <div>
            <div className="text-muted mb-2">Max Supply</div>
            <div className="font-medium">
              {crypto.max_supply 
                ? `${crypto.max_supply.toLocaleString()} ${crypto.symbol.toUpperCase()}`
                : 'Unlimited'
              }
            </div>
          </div>
          <div>
            <div className="text-muted mb-2">All-Time High</div>
            <div className="font-medium">
              {crypto.ath ? `$${crypto.ath.toLocaleString()}` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-muted mb-2">Market Cap Rank</div>
            <div className="font-medium">
              {crypto.market_cap_rank ? `#${crypto.market_cap_rank}` : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
