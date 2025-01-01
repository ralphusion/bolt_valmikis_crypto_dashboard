import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import { getBitcoinOHLC } from '../services/api'

export function CryptoChart({ realtimePrice }) {
  const chartContainerRef = useRef()
  const chartRef = useRef()
  const seriesRef = useRef()
  const [lastCandle, setLastCandle] = useState(null)
  const [error, setError] = useState(null)

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
      height: 300, // Adjusted height to match TopMovers card
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#7EBF8E',
      downColor: '#D2886F',
      borderVisible: false,
      wickUpColor: '#7EBF8E',
      wickDownColor: '#D2886F',
    })

    seriesRef.current = candlestickSeries
    chartRef.current = chart

    getBitcoinOHLC().then(data => {
      try {
        if (data && data.length > 0) {
          candlestickSeries.setData(data)
          setLastCandle(data[data.length - 1])
          setError(null)
        } else {
          throw new Error('No data available')
        }
      } catch (err) {
        console.error('Error setting chart data:', err)
        setError('Failed to load chart data')
      }
    }).catch(err => {
      console.error('Error fetching chart data:', err)
      setError('Failed to load chart data')
    })

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
  }, [])

  // Update the last candle with real-time price
  useEffect(() => {
    if (realtimePrice && lastCandle && seriesRef.current) {
      const updatedCandle = {
        ...lastCandle,
        high: Math.max(lastCandle.high, realtimePrice),
        low: Math.min(lastCandle.low, realtimePrice),
        close: realtimePrice
      }
      seriesRef.current.update(updatedCandle)
    }
  }, [realtimePrice, lastCandle])

  return (
    <div className="relative h-[300px]"> {/* Fixed height container */}
      {error ? (
        <div className="h-full flex items-center justify-center text-danger">
          {error}
        </div>
      ) : (
        <>
          <div ref={chartContainerRef} className="h-full" />
          {realtimePrice && (
            <div className="absolute top-4 right-4 bg-card px-4 py-2 rounded-lg">
              <span className="text-muted">Last Price: </span>
              <span className="text-light font-medium">
                ${realtimePrice.toLocaleString()}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
