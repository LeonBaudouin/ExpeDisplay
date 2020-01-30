import AbstractController from '../Core/AbstractController'
import * as THREE from 'three'
import Raycaster, { OrdereredIntersection } from '../Events/Raycaster'
import SmoothedPoint from '../Utils/SmoothPoint'
import { TweenLite, Power2 } from 'gsap'

export default class HoverPlane extends AbstractController {
    private cursorSmooth: SmoothedPoint
    private component: THREE.Object3D
    private isHovered: boolean
    private progTween: any
    private scaleTween: any

    constructor(backPlane: THREE.Object3D) {
        super()
        Raycaster.getInstance().Subscribe(backPlane, (e: OrdereredIntersection) => {
            if (e.order === 0 && this.isHovered) {
                this.mouseLeave()
                this.isHovered = false
            }
        })
    }

    public onMount(component: THREE.Object3D) {
        this.component = component
        const uniforms = this.getUniforms()

        this.cursorSmooth = new SmoothedPoint(
            new THREE.Vector2(0.05, 0.05),
            new THREE.Vector2(uniforms.mouse.value.x, uniforms.mouse.value.y),
        )

        Raycaster.getInstance().Subscribe(component, (e: OrdereredIntersection) => {
            if (!this.isHovered) {
                this.mouseEnter()
                this.isHovered = true
            }
            this.cursorSmooth.setTarget(e.uv)
        })
    }

    public update(component: THREE.Object3D) {
        const point = this.cursorSmooth.getPoint()
        const uniforms = this.getUniforms()
        uniforms.mouse.value = point
        component.rotation.x = (point.y - 0.5) * 0.4
        component.rotation.y = (point.x - 0.5) * 0.7
        this.cursorSmooth.Smooth()
    }

    private mouseLeave() {
        const uniforms = this.getUniforms()
        this.cursorSmooth.setTarget({ x: 0.5, y: 0.5 })
        if (this.progTween) this.progTween.kill()
        this.progTween = TweenLite.to(uniforms.mProgression, 0.5, {
            value: 0,
            ease: Power2.easeOut,
        })
        if (this.scaleTween) this.scaleTween.kill()
        this.scaleTween = TweenLite.to(this.component.scale, 0.5, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            ease: Power2.easeOut,
        })
    }

    private mouseEnter() {
        const uniforms = this.getUniforms()
        this.cursorSmooth.setSpeed({ x: 0.05, y: 0.05 })
        if (this.progTween) this.progTween.kill()
        this.progTween = TweenLite.to(uniforms.mProgression, 0.5, {
            value: 1,
            ease: Power2.easeOut,
        })
        if (this.scaleTween) this.scaleTween.kill()
        this.scaleTween = TweenLite.to(this.component.scale, 0.5, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            ease: Power2.easeOut,
        })
    }

    private getUniforms(): { [name: string]: THREE.IUniform } {
        return (<THREE.ShaderMaterial>(<THREE.Mesh>this.component).material).uniforms
    }
}
