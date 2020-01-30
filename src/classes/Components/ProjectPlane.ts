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

        const sections: Section[] = [
            {
                texture: loader.load('./assets/cube.png'),
                title: { main: 'Cube', secondary: 'Decay' },
            },
            {
                texture: loader.load('./assets/lines.png'),
                title: { main: 'Marble', secondary: 'Lips' },
            },
        ]

        super(() => {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9, 20, 20), mat)
            mesh.scale.set(1.2, 1.2, 1.2)
            mesh.position.x = 0.9
            return mesh
        }, [
            new ScrollPlane(sections),
            new HoverPlane(backPlane),
            (_: THREE.Object3D, time: number) => {
                mat.uniforms.time.value = time
            },
        ])
    }
}

export interface Section {
    texture: THREE.Texture
    title: { main: string; secondary: string }
}
