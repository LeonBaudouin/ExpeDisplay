import { EventEmitterInterface } from './EventEmitterInterface'

export default abstract class AbstractEventEmitter<ID, INFO> implements EventEmitterInterface {
    protected callbackAssoc: Map<ID, ((info: INFO) => void)[]> = new Map()
    protected constructor() {}

    Subscribe(id: ID, callback: (info: INFO) => void) {
        if (this.callbackAssoc.has(id)) {
            this.callbackAssoc.get(id).push(callback)
        } else {
            this.callbackAssoc.set(id, [callback])
        }
    }

    Unsubscribe(id: ID, callback: (info: INFO) => void) {
        if (this.callbackAssoc.has(id)) {
            const callbacks = this.callbackAssoc.get(id)
            const index = callbacks.indexOf(callback, 0)
            if (index > -1) callbacks.splice(index, 1)
            if (callbacks.length === 0) this.callbackAssoc.delete(id)
        }
    }

    Emit(id: ID, info: INFO) {
        if (this.callbackAssoc.has(id)) {
            this.callbackAssoc.get(id).forEach(callback => callback(info))
        }
    }
}
