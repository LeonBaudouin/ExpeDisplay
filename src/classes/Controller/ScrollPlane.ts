import { addWheelListener } from '../Utils/AddWheelListener'
import { TweenLite, Power2 } from 'gsap'
import AbstractController from '../Core/AbstractController'
import { Section } from '../Components/ProjectPlane'

export default class ScrollPlane extends AbstractController {
    private currentIndex: number
    private sections: Section[]
    private component: THREE.Object3D
    private isScrolling: boolean
    private titleSet: TitleSet

    constructor(sections: Section[]) {
        super()
        this.sections = sections

        this.titleSet = {
            main: {
                container: document.querySelector('.title-main-container'),
                first: document.querySelector('.title-main-first'),
                second: document.querySelector('.title-main-second'),
            },
            secondary: {
                container: document.querySelector('.title-secondary-container'),
                first: document.querySelector('.title-secondary-first'),
                second: document.querySelector('.title-secondary-second'),
            },
        }

        addWheelListener(document.body, (e: WheelEvent) => {
            let distance: number

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
        this.getUniforms().texture1.value = this.sections[this.currentIndex].texture
        this.getUniforms().texture2.value = this.sections[this.currentIndex + 1].texture
    }

    private move(direction: number) {
        if (direction < 0) {
            const index = (this.currentIndex - 1 + this.sections.length) % this.sections.length
            this.goTo(index, direction)
        } else {
            const index = (this.currentIndex + 1) % this.sections.length
            this.goTo(index, direction)
        }
    }

    private goTo(index: number, direction: number = 1) {
        if (this.isScrolling) return
        this.isScrolling = true
        this.updateUniforms(index, direction)
        this.updateTexts(index, direction)
    }

    private updateTexts(index: number, direction: number = 1) {
        const currentTitle = this.sections[this.currentIndex].title
        const nextTitle = this.sections[index].title
        if (direction > 0) {
            this.setTexts(nextTitle, currentTitle)
            TweenLite.to(this.titleSet.main.container, 0, { y: '-57%', z: '0.001' })
            TweenLite.to(this.titleSet.secondary.container, 0, { y: '-57%', z: '0.001' })
            TweenLite.to(this.titleSet.main.container, 0.5, { y: '-7%', z: '0.001' })
            TweenLite.to(this.titleSet.secondary.container, 0.5, { y: '-7%', z: '0.001' })
        } else {
            TweenLite.to(this.titleSet.main.container, 0.5, { y: '-57%', z: '0.001' })
            TweenLite.to(this.titleSet.secondary.container, 0.5, {
                y: '-57%',
                z: '0.001',
                onComplete: () => {
                    this.setTexts(nextTitle, currentTitle)
                    TweenLite.to(this.titleSet.main.container, 0, { y: '-7%', z: '0.001' })
                    TweenLite.to(this.titleSet.secondary.container, 0, { y: '-7%', z: '0.001' })
                },
            })
        }
    }

    private setTexts(firstText: { main: string; secondary: string }, secondText: { main: string; secondary: string }) {
        this.titleSet.main.first.textContent = firstText.main
        this.titleSet.main.second.textContent = secondText.main
        this.titleSet.secondary.first.textContent = firstText.secondary
        this.titleSet.secondary.second.textContent = secondText.secondary
    }

    private updateUniforms(index: number, direction: number = 1) {
        const uniforms = this.getUniforms()
        const currentTexture = this.sections[this.currentIndex].texture
        const nextTexture = this.sections[index].texture

        uniforms.progression.value = direction > 0 ? 0 : 1
        uniforms.texture1.value = direction > 0 ? currentTexture : nextTexture
        uniforms.texture2.value = direction > 0 ? nextTexture : currentTexture

        TweenLite.to(uniforms.progression, 1, {
            value: direction > 0 ? 1 : 0,
            ease: Power2.easeOut,
            onComplete: () => {
                this.isScrolling = false
                this.currentIndex = index
            },
        })
    }

    getUniforms(): { [name: string]: THREE.IUniform } {
        return (<THREE.ShaderMaterial>(<THREE.Mesh>this.component).material).uniforms
    }
}

interface TitleSet {
    main: TitleSubset
    secondary: TitleSubset
}

interface TitleSubset {
    first: HTMLElement
    second: HTMLElement
    container: HTMLElement
}
