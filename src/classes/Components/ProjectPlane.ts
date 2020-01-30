import Component from '../Core/Component'
import * as THREE from 'three'
import ScrollPlane from '../Controller/ScrollPlane'
import HoverPlane from '../Controller/HoverPlane'
import fragmentShader from '../../shaders/plane.frag'
import vertexShader from '../../shaders/plane.vert'

export default class ProjectPlane extends Component {
    constructor(domElement: HTMLElement, backPlane: THREE.Object3D) {
        const loader = new THREE.TextureLoader()
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                progression: { value: 0 },
                mProgression: { value: 0 },
                mouse: { value: new THREE.Vector2(0.5, 0.5) },
                texture1: { value: null },
                texture2: { value: null },
                time: { value: 0 },
            },
            fragmentShader,
            vertexShader,
        })
        super(() => {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9, 20, 20), mat)
            mesh.scale.set(1.2, 1.2, 1.2)
            mesh.position.x = 1.2
            return mesh
        }, [
            new ScrollPlane(domElement, [loader.load('./assets/cube.png'), loader.load('./assets/lines.png')]),
            new HoverPlane(backPlane),
            (_: THREE.Object3D, time: number) => {
                mat.uniforms.time.value = time
            },
        ])
    }
}
