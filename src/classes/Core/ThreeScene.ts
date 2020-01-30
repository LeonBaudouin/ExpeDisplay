import {
    Camera,
    Scene,
    PerspectiveCamera,
    Color,
    WebGLRenderTarget,
    LinearFilter,
    RGBFormat,
    WebGLRenderer,
    FogExp2,
    Vector2,
} from 'three'
import Component from './Component'
import RendererInterface from './RendererInterface'

export default class ThreeScene {
    public cameraComponent: Component
    public objects: Component[]
    public scene: Scene
    public renderer: RendererInterface
    public fbo: WebGLRenderTarget = null
    public controls: any
    public time: number
    public size: Vector2

    constructor(
        cameraComponent: Component,
        renderer: RendererInterface,
        objects: Component[] = [],
        size: Vector2 = null,
    ) {
        this.cameraComponent = cameraComponent
        this.objects = objects
        this.time = 0
        this.size = size
        this.renderer = renderer
        if (renderer instanceof WebGLRenderer) {
            this.fbo = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                minFilter: LinearFilter,
                magFilter: LinearFilter,
                format: RGBFormat,
                stencilBuffer: false,
            })
        }

        this.bind()
        this.setupScene()
    }

    setupScene() {
        this.scene = new Scene()
        this.scene.background = new Color(0x101010)
        // this.scene.fog = new FogExp2(0x000000, 0.1)

        this.objects.forEach(obj => this.scene.add(obj.object3d))
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        window.addEventListener('resize', this.resizeCanvas)
    }

    update(onFbo: boolean = false) {
        this.cameraComponent.update(this.time)
        this.objects.forEach(obj => obj.update(this.time))
        if (onFbo && this.renderer instanceof WebGLRenderer) {
            this.renderer.setRenderTarget(this.fbo)
            this.renderer.clear()
            this.renderer.render(this.scene, <Camera>this.cameraComponent.object3d)
        } else {
            if (this.renderer instanceof WebGLRenderer) this.renderer.setRenderTarget(null)
            this.renderer.render(this.scene, <Camera>this.cameraComponent.object3d)
        }
        this.time++
    }

    resizeCanvas() {
        this.renderer.setSize(this.size ? this.size.x : window.innerWidth, this.size ? this.size.y : window.innerHeight)
        if (this.fbo !== null) {
            this.fbo.width = this.size ? this.size.x : window.innerWidth
            this.fbo.height = this.size ? this.size.y : window.innerHeight
        }
        ;(<PerspectiveCamera>this.cameraComponent.object3d).aspect = window.innerWidth / window.innerHeight
        ;(<PerspectiveCamera>this.cameraComponent.object3d).updateProjectionMatrix()
    }
}
