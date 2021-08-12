import * as THREE from "three";

const VS = `
  uniform float u_time;
  uniform sampler2D u_water;
  uniform sampler2D u_heightmap;
  varying float height;
  varying vec2 vuv;
  varying vec3 n;
  varying vec3 normalInterp;
  varying vec3 pos;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 normalizeCoords (vec3 pos) {
  float length = sqrt(
    pos.x*pos.x+
    pos.y*pos.y+
    pos.z*pos.z
  );
  return vec3(
    pos.x/length,
    pos.y/length,
    pos.z/length
  );
}

#define NUM_OCTAVES 5


float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
  vuv = uv;
  mat4 boilerplate = projectionMatrix * modelViewMatrix;
  vec3 p = position;
  // vec3 np = normalizeCoords(p);
  // vec3 heightData = texture2D(u_heightmap, uv).rgb;
  // vec3 waterData = texture2D(u_water, sin(uv*0.1+0.01*u_time)).rgb;
  // height = 0.3*sin(mix(0.0, 1.0, 10.0*u_time+p.y+p.x));
  // height = 10.0*(heightData.x + heightData.y + heightData.z);
  // if(height < 0.2) { height = 0.3*(waterData.x + waterData.y + waterData.z) ;}
  float noise = fbm(uv);
  vec3 nn = normal + vec3(noise);
  n = nn;
  normalInterp = nn;
  vec3 newP = p + vec3(0.0, 0.0, 2.0 * noise);
  vec4 pos4 = modelViewMatrix * vec4(newP, 1.0);
  pos = vec3(pos4) / pos4.w;

  gl_Position = boilerplate * vec4(p + vec3(0.0, 0.0, 2.0 * noise), 1.0);
}
`;

const FS = `
varying vec3 normalInterp;
varying vec3 pos;

const vec3 lightPos     = vec3(200,60,100);
const vec3 ambientColor = vec3(0.2, 0.0, 0.0);
const vec3 diffuseColor = vec3(0.3961, 0.2627, 0.1294);
const vec3 specColor    = vec3(1.0, 1.0, 1.0);

void main() {
  vec3 normal = mix(normalize(normalInterp), normalize(cross(dFdx(pos), dFdy(pos))), 0.3);
  vec3 lightDir = normalize(lightPos - pos);

  float lambertian = max(dot(lightDir,normal), 0.0);
  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 viewDir = normalize(-pos);
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, 16.0);
  }

  gl_FragColor = vec4(ambientColor + lambertian * diffuseColor + specular * specColor, 1.0);
  // gl_FragColor = vec4(0.3, 0.5, 0.6, 1.0);
}
`;
export const createTerrain = (time) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_time: {
        value: time,
      },
    },
    vertexShader: VS,
    fragmentShader: FS,
    // side: THREE.DoubleSide,
    // wireframe: true,
  });
  const newMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaff,
    side: THREE.DoubleSide,
    // wireframe: true,
  });
  const geometry = new THREE.PlaneGeometry(10, 10, 500, 500);
  const plane = new THREE.Mesh(geometry, material);
  // console.log(plane)
  return plane;
};
