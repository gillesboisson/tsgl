import { EventListenner } from './GameInput';


export default class EventEmitter {
  protected events: { [name: string]: EventListenner[]; } = {};

  on<EventT = any>(eventType: string, listener: (e: EventT) => void): void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }

    this.events[eventType].push(listener);
  }

  off<EventT = any>(eventType: string, listener: (e: EventT) => void): void {
    return this.removeListener<EventT>(eventType, listener);
  }

  removeListener<EventT = any>(eventType: string, listener: (e: EventT) => void): void {
    if (typeof this.events[eventType] === 'object') {
      const idx = this.events[eventType].indexOf(listener);

      if (idx !== -1) {
        this.events[eventType].splice(idx, 1);
      }
    }
  }

  emit<EventT = any>(eventType: string, event?: EventT): void {
    const listenners = this.events[eventType];

    if (listenners) {
      for (const listenner of listenners) {
        listenner(event);
      }
    }
  }

  once<EventT = any>(eventType: string, listener: (e: EventT) => void): void {
    this.on(eventType, function g(e: EventT) {
      this.removeListener(eventType, g);
      listener(e);
    });
  }
}
