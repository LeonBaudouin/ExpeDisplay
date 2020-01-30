import { Object3D } from 'three'

export default interface ControllerInterface {
    update(component: Object3D, time: number, data: object): void
    onMount(component: Object3D): void
}

export type ControllerFunction = (
    object3d: Object3D,
    time: number,
    data: object,
) => void

export type Controller = ControllerFunction | ControllerInterface
