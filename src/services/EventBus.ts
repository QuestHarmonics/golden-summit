export class EventBus {
  private static instance: EventBus;
  private subscribers: Map<string, Function[]>;

  private constructor() {
    this.subscribers = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(event: string, callback: Function): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(callback);

    return () => {
      const callbacks = this.subscribers.get(event);
      const index = callbacks?.indexOf(callback);
      if (callbacks && index !== undefined && index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  public publish(event: string, data?: any): void {
    this.subscribers.get(event)?.forEach(callback => callback(data));
  }
} 