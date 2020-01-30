import { addWheelListener } from '../Utils/AddWheelListener'
import { TweenLite, Power2 } from 'gsap'
import AbstractController from '../Core/AbstractController'

export default class ScrollPlane extends AbstractController {
    private currentIndex: number
    private textures: THREE.Texture[]
    private component: THREE.Object3D
    private isScrolling: boolean

    constructor(domELement: HTMLElement, textures: THREE.Texture[]) {
        super()
        this.textures = textures
        addWheelListener(domELement, (e: WheelEvent) => {
            let distance: number
            e.preventDefault()

            if (e.deltaMode === 1) {
                distance = e.deltaY * 50
            } else {
                distance = e.deltaY
            }

            if (Math.abs(distance) > 80) {
                this.move(distance)
            }
        })
    }

    public update(component: THREE.Object3D, time: number) {}

    onMount(component: THREE.Object3D): void {
        this.component = component
        this.currentIndex = 0
        this.getUniforms().texture1.value = this.textures[this.currentIndex]
        this.getUniforms().texture2.value = this.textures[this.currentIndex + 1]
    }

    private move(direction: number) {
        if (direction < 0) {
            this.previous()
        } else {
            this.next()
        }
    }

    private previous() {
        if (this.isScrolling) return
        this.isScrolling = true
        const prevI = (this.currentIndex - 1 + this.textures.length) % this.textures.length
        const uniforms = this.getUniforms()
        uniforms.progression.value = 1
        uniforms.texture1.value = this.textures[prevI]
        uniforms.texture2.value = this.textures[this.currentIndex]
        TweenLite.to(uniforms.progression, 1, {
            value: 0,
            ease: Power2.easeOut,
            onComplete: () => {
                this.isScrolling = false
                this.currentIndex = prevI
            },
        })
    }

    private next() {
        if (this.isScrolling) return
        this.isScrolling = true
        const nextI = (this.currentIndex + 1) % this.textures.length
        const uniforms = this.getUniforms()
        uniforms.progression.value = 0
        uniforms.texture1.value = this.textures[this.currentIndex]
        uniforms.texture2.value = this.textures[nextI]
        TweenLite.to(uniforms.progression, 1, {
            value: 1,
            ease: Power2.easeOut,
            onComplete: () => {
                this.isScrolling = false
                this.currentIndex = nextI
            },
        })
    }

    getUniforms(): { [name: string]: THREE.IUniform } {
        return (<THREE.ShaderMaterial>(<THREE.Mesh>this.component).material).uniforms
    }
}
