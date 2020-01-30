import './css/index.scss'
import Setup from './setup.ts'

let threeRaf = () => {}

Setup().then(({ raf, cb }) => {
    setTimeout(cb, 0)
    threeRaf = raf
})

raf()

function raf() {
    requestAnimationFrame(raf)
    threeRaf()
}
