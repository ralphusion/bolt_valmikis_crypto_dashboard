const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const BINANCE_API = 'https://api.binance.com/api/v3'

// Sample data for initial state
const sampleData = {
  marketStats: {
    marketCap: 2100000000000,
    volume: 84200000000,
    btcDominance: 42.1
  },
  cryptos: Array(50).fill(null).map((_, index) => ({
    id: `crypto-${index + 1}`,
    symbol: `sym${index + 1}`,
    name: `Crypto ${index + 1}`,
    image: `https://assets.coingecko.com/coins/images/${index + 1}/small/placeholder.png`,
    current_price: 1000 / (index + 1),
    market_cap: 1000000000 / (index + 1),
    market_cap_rank: index + 1,
    total_volume: 500000000 / (index + 1),
    price_change_percentage_24h: (Math.random() * 20) - 10,
    sparkline_in_7d: { price: Array(168).fill(1000 / (index + 1)) },
    circulating_supply: 1000000 * (index + 1),
    max_supply: index % 2 === 0 ? 2000000 * (index + 1) : null,
    ath: 2000 / (index + 1)
  }))
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

export async function getMarketStats() {
  try {
    const data = await fetchWithRetry(`${COINGECKO_API}/global`)
    return {
      marketCap: data.data.total_market_cap.usd,
      volume: data.data.total_volume.usd,
      btcDominance: data.data.market_cap_percentage.btc
    }
  } catch (error) {
    console.warn('Failed to fetch market stats:', error)
    return sampleData.marketStats
  }
}

export async function getTopCryptos() {
  try {
    const data = await fetchWithRetry(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=true&price_change_percentage=24h&locale=en`
    )
    
    return data.map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      current_price: crypto.current_price,
      market_cap: crypto.market_cap,
      market_cap_rank: crypto.market_cap_rank,
      total_volume: crypto.total_volume,
      price_change_percentage_24h: crypto.price_change_percentage_24h,
      sparkline_in_7d: crypto.sparkline_in_7d,
      circulating_supply: crypto.circulating_supply,
      max_supply: crypto.max_supply,
      ath: crypto.ath
    }))
  } catch (error) {
    console.warn('Failed to fetch top cryptos:', error)
    return sampleData.cryptos
  }
}

export async function getBitcoinOHLC() {
  try {
    const data = await fetchWithRetry(
      `${BINANCE_API}/klines?symbol=BTCUSDT&interval=1h&limit=168`
    )
    
    return data.map(([time, open, high, low, close]) => ({
      time: Math.floor(time / 1000),
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close)
    })).sort((a, b) => a.time - b.time)
  } catch (error) {
    console.warn('Failed to fetch OHLC data:', error)
    // Return sample OHLC data for the last 168 hours (7 days)
    return Array(168).fill(0).map((_, i) => ({
      time: Math.floor(Date.now() / 1000) - (167 - i) * 3600,
      open: 42000,
      high: 42100,
      low: 41900,
      close: 42050
    }))
  }
}

export async function getCryptoOHLC(symbol, timeframe = '1h', limit = 168) {
  try {
    const data = await fetchWithRetry(
      `${BINANCE_API}/klines?symbol=${symbol.toUpperCase()}USDT&interval=${timeframe}&limit=${limit}`
    )
    
    return data.map(([time, open, high, low, close]) => ({
      time: Math.floor(time / 1000),
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close)
    })).sort((a, b) => a.time - b.time)
  } catch (error) {
    console.warn(`Failed to fetch OHLC data for ${symbol}:`, error)
    // Return sample data
    return Array(limit).fill(0).map((_, i) => ({
      time: Math.floor(Date.now() / 1000) - (limit - 1 - i) * 3600,
      open: 100,
      high: 101,
      low: 99,
      close: 100.5
    }))
  }
}
