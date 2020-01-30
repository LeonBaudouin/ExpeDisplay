import ControllerInterface from './ControllerInterface'
import * as THREE from 'three'

export default abstract class AbstractController
    implements ControllerInterface {
    public abstract update(component: THREE.Object3D, time: number)
    public onMount(component: THREE.Object3D) {}
}
