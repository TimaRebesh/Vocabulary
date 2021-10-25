export type EventListenerNames = 'cheer' | 'stydied' | 'nextWord' | 'countdown';

export type EventListener = {
    name: EventListenerNames;
    executor: (value?: any) => void;
}

export type LocalEventBus = {
    listeners: EventListener[];
    register: () => void;
    notify: () => void;
}

export class EventBus {
    listeners: EventListener[] = [];

    public register(listener: EventListener) {
        this.listeners.push(listener);
        return () => this.unregister(listener)
    }

    public notify(name: EventListenerNames, value?: number) {
        this.listeners.forEach(l => {
            if (l.name === name)
                value ? l.executor(value) : l.executor();
        })
    }

    private unregister(handler: EventListener) {
        this.listeners = this.listeners.filter(l => l !== handler);
    }

}
