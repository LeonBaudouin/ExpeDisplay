import { TextureLoader as NativeTextureLoader } from 'three'
import * as THREE from 'three'

export default class TextureLoader {
    static load(
        modelPath: string[] | { [name: string]: string },
        assetPath: string = '',
    ): Promise<THREE.Texture[] | { [name: string]: THREE.Texture }> {
        if (!Array.isArray(modelPath)) {
            const keys = Object.keys(modelPath)
            const values = keys.map(key => modelPath[key])
            return Promise.all(
                values.map(p => assetPath + p).map(TextureLoader.loadOne),
            ).then(textures => {
                const output: { [name: string]: THREE.Texture } = {}
                textures.forEach((texture, index) => {
                    output[keys[index]] = texture
                })
                return output
            })
        } else {
            return Promise.all(
                modelPath.map(p => assetPath + p).map(TextureLoader.loadOne),
            )
        }
    }

    static loadOne(path: string): Promise<THREE.Texture> {
        const loader = TextureLoader.getNativeLoader()
        return new Promise((resolve, reject) => {
            loader.load(path, resolve, TextureLoader.updateXhr, reject)
        })
    }

    static updateXhr(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    }

    static getNativeLoader(): NativeTextureLoader {
        if (_nativeLoader == null) _nativeLoader = new NativeTextureLoader()

        return _nativeLoader
    }
}

let _nativeLoader = null
