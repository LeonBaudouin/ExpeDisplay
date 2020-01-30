uniform float progression;
uniform float mProgression;
uniform sampler2D texture1; 
uniform sampler2D texture2; 
uniform float time;
uniform vec2 mouse;
varying vec3 vUv;
varying float vPulse;
varying float vMidline;


//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

float doubleExponentialSigmoid (float x, float a){

  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  a = min(max_param_a, max(min_param_a, a));
  a = 1.0-a; // for sensible results
  
  float y = 0.;
  if (x<=0.5){
    y = (pow(2.0*x, 1.0/a))/2.0;
  } else {
    y = 1.0 - (pow(2.0*(1.0-x), 1.0/a))/2.0;
  }
  return y;
}

float exponentialEasing (float x, float a){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  a = max(min_param_a, min(max_param_a, a));
  
  if (a < 0.5){
    // emphasis
    a = 2.0*(a);
    float y = pow(x, a);
    return y;
  } else {
    // de-emphasis
    a = 2.0*(a-0.5);
    float y = pow(x, 1.0/(1.-a));
    return y;
  }
}

vec3 normalNoise(vec2 _st, float _zoom, float _speed){
	vec2 v1 = _st;
	vec2 v2 = _st;
	vec2 v3 = _st;
	float expon = pow(10.0, _zoom*2.0);
	v1 /= 1.0*expon;
	v2 /= 0.62*expon;
	v3 /= 0.83*expon;
	float n = time*_speed;
	float nr = (snoise(vec3(v1, n)) + snoise(vec3(v2, n)) + snoise(vec3(v3, n))) / 6.0 + 0.5;
	n = time * _speed + 1000.0;
	float ng = (snoise(vec3(v1, n)) + snoise(vec3(v2, n)) + snoise(vec3(v3, n))) / 6.0 + 0.5;
	return vec3(nr,ng,0.5);
}


void main() {
    vec2 pos = vUv.xy + 0.45;

    float circle = exponentialEasing(smoothstep(0., 0.2, length(pos / 0.9 - mouse)), 0.2);

    float n = snoise(vec3(pos * 2., time / 300.));
    float nn = (n + 1.) / 2.;
    float cnn = exponentialEasing(nn, 0.9);
    vec2 displacement = vec2(cnn, 0.) * 0.05;

    // vec2 dt1 = normalNoise(pos, 0.001, 0.01).xy * 0.05;
    vec2 dt1 = displacement * progression;
    vec2 dt2 = displacement * (progression - 1.);

    // vec2 dm = vec2((1. - circle) * (snoise(vec3(pos * 6., time / 200.)) + 1.) / 2., 0.);
    vec2 dm = (1. - circle) * normalNoise(pos, 0.001, 0.01).xy * 0.5 * mProgression;

    vec4 texel1 = texture2D(texture1, pos + 0.05 + dt1 + dm);
    vec4 texel2 = texture2D(texture2, pos + 0.05 + dt2 + dm);

    float m = doubleExponentialSigmoid(clamp(cnn * progression + progression, 0., 1.), 0.5);
    
    float es = 0.451 - 0.021 * exponentialEasing(mProgression, 0.6);
    // float edge = clamp((1.-step(abs(vUv.x), es)) + (1.-step(abs(vUv.y), es)), 0., 1.) * mProgression;
    // vec4 c = mix(texel1, texel2, m);
    float tm = step(vUv.x + .1, vMidline - 0.05) + (1. - smoothstep(vUv.x + .1, vMidline - 0.05, vMidline + 0.05));
    vec4 c = mix(texel1, texel2, tm * .4 + m * .6);
    
    gl_FragColor = c;
    // gl_FragColor = vec4((1. - edge) * c.rgb + edge * (1. - c.rgb), 1.);
    // gl_FragColor = vec4(normalNoise(pos, 0.001, 0.01), 1.);

}
