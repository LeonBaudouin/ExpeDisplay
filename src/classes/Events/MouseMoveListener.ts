import { ListenEvent, NativeEventListener } from './SimpleEventListener'
import * as THREE from 'three'

export class MouseMoveListener extends NativeEventListener {
    protected static instance: MouseMoveListener = null
    protected static value: THREE.Vector2 = new THREE.Vector2()

    public static getInstance(): MouseMoveListener {
        if (MouseMoveListener.instance === null)
            MouseMoveListener.instance = new MouseMoveListener()

        return MouseMoveListener.instance
    }

    private constructor() {
        super('mousemove')
    }

    public getValue() {
        return MouseMoveListener.value
    }

    public UpdateValue(e: MouseEvent) {
        MouseMoveListener.value.x = e.clientX
        MouseMoveListener.value.y = e.clientY
    }
}
