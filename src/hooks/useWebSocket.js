import { useEffect, useRef } from 'react'

const WS_URL = 'wss://stream.binance.com:9443/ws'

export function useWebSocket(symbol, onMessage) {
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket(WS_URL)

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@trade`],
        id: 1
      }))
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [symbol, onMessage])

  return ws.current
}
