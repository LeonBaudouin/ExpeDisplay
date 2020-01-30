import ThreeScene from './classes/Core/ThreeScene'
import * as THREE from 'three'
import Component from './classes/Core/Component'
import OrbitControls from 'orbit-controls-es6'
import RendererInterface from './classes/Core/RendererInterface'
import Raycaster from './classes/Events/Raycaster'
import { MouseMoveListener } from './classes/Events/MouseMoveListener'
import TextureLoader from './classes/Core/TextureLoader'
import ProjectPlane from './classes/Components/ProjectPlane'
import vertexShader from './shaders/background.vert'
import fragmentShader from './shaders/background.frag'

function initWebglRenderer(size: THREE.Vector2 = null): RendererInterface {
    const renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true,
    })
    renderer.setClearColor(0x000000, 0.0)
    renderer.setSize(size ? size.x : window.innerWidth, size ? size.y : window.innerHeight)
    renderer.debug.checkShaderErrors = true
    return renderer
}

export default function Load() {
    return TextureLoader.load({}, './assets/').then(Setup)
}

function Setup(): { raf: Function; cb: Function } {
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)

    const webGLrenderer = initWebglRenderer()

    // const controls = new OrbitControls(camera, webGLrenderer.domElement)

    camera.position.z = 2

    const backPlane = new Component(() => {
        const mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(10000, 10000),
            new THREE.MeshBasicMaterial({ visible: false }),
        )
        mesh.position.z = -50
        return mesh
    })

    const components = [
        new ProjectPlane(webGLrenderer.domElement, backPlane.object3d),
        backPlane,
        new Component(() => {
            const mesh = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(window.innerWidth * 2, window.innerHeight * 2),
                new THREE.ShaderMaterial({
                    vertexShader,
                    fragmentShader,
                    uniforms: { time: { value: 0 } },
                }),
            )
            mesh.position.z = -10
            return mesh
        }, [
            (object3d: THREE.Object3D, time: number) => {
                ;(<THREE.ShaderMaterial>(<THREE.Mesh>object3d).material).uniforms.time.value = time
            },
        ]),
    ]

    const scene = new ThreeScene(new Component(() => camera), webGLrenderer, components)

    document.body.append(webGLrenderer.domElement)

    return {
        raf: () => {
            scene.update()
        },
        cb: () => {
            const mouse = new THREE.Vector2()

            document.addEventListener('mousemove', e => {
                const { clientX, clientY } = e
                mouse.x = (clientX / window.innerWidth) * 2 - 1
                mouse.y = -(clientY / window.innerHeight) * 2 + 1
                Raycaster.getInstance().Cast(camera, mouse)
                MouseMoveListener.getInstance().UpdateValue(e)
            })
        },
    }
}
