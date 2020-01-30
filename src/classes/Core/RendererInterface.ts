import * as THREE from 'three'
import { Vector2 } from 'three'

export default interface RendererInterface {
    domElement: HTMLElement
    getSize(vector: Vector2): { width: number; height: number } | Vector2
    setSize(width: number, height: number): void
    render(scene: THREE.Scene, camera: THREE.Camera): void
}
