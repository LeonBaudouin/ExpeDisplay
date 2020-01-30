export interface ListenEvent {
    getValue(): any
}

export abstract class SimpleEventListener implements ListenEvent {
    protected static value: any
    protected static instance: ListenEvent = null

    public static getInstance(): ListenEvent {
        throw new Error('You cannot get instance of an abstract class')
    }
    public abstract getValue(): any
    abstract UpdateValue(e: Event): void
}

export abstract class NativeEventListener extends SimpleEventListener {
    protected constructor(eventType: string) {
        window.addEventListener(eventType, e => this.UpdateValue(e))
        super()
    }
}
