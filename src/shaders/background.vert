varying vec3 vUv;
uniform float time;

void main() {
    vUv = position;
    vec3 pos = position;
    vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}
