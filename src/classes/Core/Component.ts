import { Object3D } from 'three'
import { Controller } from './ControllerInterface'

export default class Component {
    public object3d: Object3D
    public controllers: Controller[]
    public children: Component[]
    public data: object

    constructor(
        object3dCallback: () => Object3D,
        controllers: Controller[] = [],
        data: object = {},
        children: Component[] = [],
    ) {
        this.object3d = object3dCallback()
        this.controllers = controllers
        this.children = children
        this.children.forEach(child => {
            this.object3d.add(child.object3d)
        })
        this.controllers.forEach(controller => {
            if (typeof controller == 'object') {
                controller.onMount(this.object3d)
            }
        })
    }

    update(time: number) {
        this.controllers.forEach(controller => {
            if (typeof controller == 'object') {
                controller.update(this.object3d, time, this.data)
            } else if (typeof controller == 'function') {
                controller(this.object3d, time, this.data)
            }
        })
        this.children.forEach(child => {
            child.update(time)
        })
    }
}
