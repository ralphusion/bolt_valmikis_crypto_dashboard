import React, { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { getTopCryptos } from '../services/api'

export function PerformanceChart() {
  const chartContainerRef = useRef()
  const chartRef = useRef()

  useEffect(() => {
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
      height: 300,
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

    // Load Bitcoin price history
    getTopCryptos().then(cryptos => {
      const bitcoin = cryptos[0]
      if (bitcoin?.sparkline_in_7d?.price) {
        const data = bitcoin.sparkline_in_7d.price.map((price, index) => ({
          time: Math.floor((Date.now() - (168 - index) * 3600 * 1000) / 1000), // Convert to Unix timestamp
          value: price
        }))
        .sort((a, b) => a.time - b.time) // Ensure ascending order
        
        try {
          areaSeries.setData(data)
        } catch (error) {
          console.error('Error setting performance data:', error)
        }
      }
    })

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      })
    }

    window.addEventListener('resize', handleResize)
    chartRef.current = chart

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  return <div ref={chartContainerRef} />
}
