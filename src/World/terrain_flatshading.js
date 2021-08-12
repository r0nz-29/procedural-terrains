import * as THREE from "three";
import heightmap from "./maps/heightmaps/river.png";

let lat = (28.47893 * Math.PI) / 180;
let lon = (87.50817 * Math.PI) / 180;

let x = lon;
let y = Math.log(Math.tan(lat) + 1 / Math.cos(lat));

let newX = (1 + x / Math.PI) / 2;
let newY = (1 - y / Math.PI) / 2;

let zoom = 14;

let n = Math.pow(2, zoom);

let finalX = Math.floor(newX * n);
let finalY = Math.floor(newY * n);

console.log(finalX, finalY);

// const VS_bak = `
//   uniform float u_time;
//   uniform sampler2D u_water;
//   uniform sampler2D u_heightmap;
//   varying float height;
//   varying vec2 vuv;
//   varying vec3 n;

//   void main() {
//     vuv = uv;
//     mat4 boilerplate = projectionMatrix * modelViewMatrix;
//     vec3 p = position;
//     vec3 heightData = texture2D(u_heightmap, uv).rgb;
//     vec3 waterData = texture2D(u_water, sin(uv*0.1+0.01*u_time)).rgb;
//     // height = 0.3*sin(mix(0.0, 1.0, 10.0*u_time+p.y+p.x));
//     height = 10*(heightData.x + heightData.y + heightData.z);
//     // if(height < 0.2) { height = 0.3*(waterData.x + waterData.y + waterData.z) ;}
//     vec3 newP = p + vec3(0.0, 0.0, 0.1*height);
//     n = normal + vec3(0.01*height);
//     gl_Position = boilerplate * vec4(newP, 1.0);
//   }
// `;

const VS = `
  uniform float u_time;
  uniform sampler2D u_water;
  uniform sampler2D u_heightmap;
  varying float height;
  varying vec3 normalInterp;
  varying vec3 pos;
  varying vec2 vuv;
  varying float vAmount;

  void main() {
    vec3 p = position;
    vuv = uv;
    mat4 boilerplate = projectionMatrix * modelViewMatrix;
    vec3 heightData = texture2D(u_heightmap, uv).rgb;
    vAmount = heightData.x;
    height = heightData.x + heightData.y + heightData.z;
    // height = ((heightData.x * 256.0 * 256.0 + heightData.y * 256.0 + heightData.z) * 0.1) - 55.0;
    vec3 newP = p + vec3(0.0, 0.0, height);
    vec3 newNormal = normal + vec3(height);

    vec4 pos4 = modelViewMatrix * vec4(newP, 1.0);

    normalInterp = newNormal;
    pos = vec3(pos4) / pos4.w;

    gl_Position = boilerplate * vec4(newP, 1.0);
  }
`;

// const VS_for_lambert = `
//   void main() {
//     vec3 p = position;
//     vec3 heightData = texture2D(u_heightmap, uv).rgb;
//     float height = 10.0*(heightData.x + heightData.y + heightData.z);
//     vec3 newP = p + vec3(0.0, 0.0, 0.1*height);
//   }
// `;

// const FS_bak = `
//   uniform sampler2D u_colormap;
//   uniform float u_time;
//   uniform sampler2D u_water;
//   varying float height;
//   varying vec2 vuv;
//   varying vec3 n;

//   void main() {
//     vec3 teXture = texture2D(u_colormap, vuv).rgb;
//     vec3 water = texture2D(u_water, sin(vuv*0.1+0.01*u_time)).rgb;
//     vec3 color = teXture;
//     // if(height < 0.7) {color = water;}
//     gl_FragColor = vec4(clamp(n-vec3(0.0, 0.0, 1.0), 0.0, 1.0), 1.0);
//   }
// `;

const FS = `
 uniform sampler2D u_grass;
 uniform sampler2D u_sand;
 uniform sampler2D u_rock;
 uniform sampler2D u_snow;
 uniform sampler2D u_water;
 varying vec3 normalInterp;
 varying float height;
 varying vec3 pos;
 varying float vAmount;

 varying vec2 vuv;

 const vec3 lightPos 	= vec3(100,100,0);
 const vec3 ambientColor = vec3(0.2, 0.0, 0.0);
 const vec3 diffuseColor = vec3(0.3961, 0.2627, 0.1294); 
//  const vec3 ambientColor = vec3(0.2078, 0.1372, 0.1137);
//  const vec3 diffuseColor = vec3(0.0, 0.0, 0.0);
 const vec3 specColor 	= vec3(1.0, 1.0, 1.0);
 
 void main() {
  //  vec4 water = (smoothstep(0.0, 0.0, vAmount) - smoothstep(0.0, 0.0, vAmount)) * texture2D( u_water, vuv );
  //  vec4 grass = (smoothstep(0.1, 0.27, vAmount) - smoothstep(0.18, 0.29, vAmount)) * texture2D( u_grass, vuv );
  //  vec4 grass = (smoothstep(0.0, 0.12, vAmount) - smoothstep(0.05, 0.40, vAmount)) * texture2D( u_grass, vuv );
  //  vec4 snow = smoothstep(0.50, 0.65, vAmount) * texture2D( u_snow, vuv );
  //  vec4 rock = (smoothstep(0.0, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( u_rock, vuv );
  //  vec4 sand = (smoothstep(0.0, 0.12, vAmount) - smoothstep(0.05, 0.40, vAmount)) * texture2D( u_sand, vuv );
  //  vec4 sand = (smoothstep(0.1, 0.27, vAmount) - smoothstep(0.18, 0.29, vAmount)) * texture2D( u_sand, vuv );

   vec3 normal = mix(normalize(normalInterp), normalize(cross(dFdx(pos), dFdy(pos))), 0.8);
   vec3 lightDir = normalize(lightPos - pos);
 
   float lambertian = max(dot(lightDir,normal), 0.0);
   float specular = 0.0;
 
   if(lambertian > 0.0) {
     vec3 viewDir = normalize(-pos);
     vec3 halfDir = normalize(lightDir + viewDir);
     float specAngle = max(dot(halfDir, normal), 0.0);
     specular = pow(specAngle, 16.0);
   }
  //  vec4 color = water + rock + snow ;
  //  if(height < 0.03) { color = texture2D(u_water, vuv);}
   gl_FragColor = vec4(ambientColor + lambertian * diffuseColor + specular * specColor, 1.0);
 }
`;

export const createTerrain = (time) => {
  const heightMap = new THREE.TextureLoader().load(heightmap);
  heightMap.wrapS = THREE.MirroredRepeatWrapping;
  heightMap.wrapT = THREE.MirroredRepeatWrapping;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_time: {
        value: time,
      },
      u_heightmap: {
        value: heightMap,
      },
    },
    vertexShader: VS,
    fragmentShader: FS,
    side: THREE.DoubleSide,
    // wireframe: true,
  });

  // const material = new THREE.MeshLambertMaterial({color: 0xafafaf, side: THREE.DoubleSide});
  // material.userData.u_heightmap = { value: heightMap };
  // material.onBeforeCompile = (shader) => {
  //   shader.uniforms.u_heightmap = material.userData.u_heightmap;
  //   shader.vertexShader = "uniform sampler2D u_heightmap;\n" + shader.vertexShader;
  //   shader.vertexShader = shader.vertexShader.replace(
  //     '#include <begin_vertex>',
  //     `
  //       vec3 p = position;
  //       vec3 heightData = texture2D(u_heightmap, uv).rgb;
  //       float height = (heightData.x + heightData.y + heightData.z);
  //       vec3 newP = p + normal * height;
  //       vec3 transformed = newP;
  //     `
  //   );
  // }

  const geometry = new THREE.PlaneGeometry(7, 7, 500, 500);
  const plane = new THREE.Mesh(geometry, material);
  // plane.castShadow = true;
  // plane.receiveShadow = true;
  // console.log(geometry);
  return plane;
};
