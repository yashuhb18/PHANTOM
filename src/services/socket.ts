type EventCallback = (data: any) => void;

class WebSocketClient {
  private liveWs: WebSocket | null = null;
  private narratorWs: WebSocket | null = null;
  private liveCallbacks: Set<EventCallback> = new Set();
  private narratorCallbacks: Set<EventCallback> = new Set();

  connect() {
    this.connectLive();
    this.connectNarrator();
  }

  private connectLive() {
    try {
      this.liveWs = new WebSocket('ws://localhost:8001/ws/live');
      this.liveWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.liveCallbacks.forEach((cb) => cb(data));
        } catch (e) {
          console.error('Error parsing live WS message:', e);
        }
      };
      this.liveWs.onclose = () => {
        setTimeout(() => this.connectLive(), 3000);
      };
    } catch (e) {
      console.error('Failed to connect live WS:', e);
    }
  }

  private connectNarrator() {
    try {
      this.narratorWs = new WebSocket('ws://localhost:8001/ws/narrator');
      this.narratorWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.narratorCallbacks.forEach((cb) => cb(data));
        } catch (e) {
          console.error('Error parsing narrator WS message:', e);
        }
      };
      this.narratorWs.onclose = () => {
        setTimeout(() => this.connectNarrator(), 3000);
      };
    } catch (e) {
      console.error('Failed to connect narrator WS:', e);
    }
  }

  onLiveEvent(callback: EventCallback) {
    this.liveCallbacks.add(callback);
    return () => this.liveCallbacks.delete(callback);
  }

  onNarratorMessage(callback: EventCallback) {
    this.narratorCallbacks.add(callback);
    return () => this.narratorCallbacks.delete(callback);
  }
}

export const socketClient = new WebSocketClient();
