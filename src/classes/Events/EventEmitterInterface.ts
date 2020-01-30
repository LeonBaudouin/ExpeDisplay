export interface EventEmitterInterface {
    Subscribe(id: any, method: (info: any) => void): void
    Emit(id: any, info: any): void
}
