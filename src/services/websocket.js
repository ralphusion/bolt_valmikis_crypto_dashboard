export class CryptoWebSocket {
  constructor(onMessage) {
    this.ws = null
    this.onMessage = onMessage
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.subscriptions = new Set()
  }

  connect() {
    try {
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws')

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.subscribeToAll()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.onMessage(data)
        } catch (error) {
          console.error('WebSocket message error:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          setTimeout(() => this.connect(), 1000 * this.reconnectAttempts)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }

  subscribe(symbol) {
    const sub = symbol.toLowerCase()
    if (!this.subscriptions.has(sub)) {
      this.subscriptions.add(sub)
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          method: 'SUBSCRIBE',
          params: [`${sub}@trade`],
          id: Date.now()
        }))
      }
    }
  }

  subscribeToAll() {
    if (this.ws?.readyState === WebSocket.OPEN && this.subscriptions.size > 0) {
      this.ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: Array.from(this.subscriptions).map(s => `${s}@trade`),
        id: Date.now()
      }))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
