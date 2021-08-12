import * as THREE from "three";
import simplex_noise from "./simplex_noise_3d.glsl.js";
import { createMap, monkeyPatch } from "./utils";

export const createTerrain = (time) => {
  const terrainUniforms = {
    u_time: {
      value: time,
    },
    ...THREE.ShaderLib.physical.uniforms,
  };

  const SIZE = 4;
  const RESOLUTION = 200;

  const material = new THREE.ShaderMaterial({
    lights: true,
    extensions: {
      derivatives: true,
    },
    defines: {
      STANDARD: "",
      PHYSICAL: "",
    },
    uniforms: terrainUniforms,
    vertexShader: monkeyPatch(THREE.ShaderChunk.meshphysical_vert, {
      header: `
      uniform float u_time;
      
      ${simplex_noise}

      #define NUM_OCTAVES 7
          
      float fbm(vec3 x) {
      	float v = 0.0;
      	float a = 0.5;
      	vec3 shift = vec3(100);
      	for (int i = 0; i < NUM_OCTAVES; ++i) {
      		v += a * snoise(x);
      		x = x * 2.0 + shift;
      		a *= 0.5;
      	}
      	return v;
      }
      
      float displace(vec3 point) {
        return fbm(vec3(point.x * 0.5, point.y * 0.5, u_time)) * 0.9;
      }
      
      vec3 orthogonal(vec3 v) {
        return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        : vec3(0.0, -v.z, v.y));
      }
      
      `,
      main: `
        vec3 displacedPosition = position + normal * displace(position);
        
        float offset = ${SIZE / RESOLUTION};
      vec3 tangent = orthogonal(normal);
      vec3 bitangent = normalize(cross(normal, tangent));
      vec3 neighbour1 = position + tangent * offset;
      vec3 neighbour2 = position + bitangent * offset;
      vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
      vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);

      // https://i.ya-webdesign.com/images/vector-normals-tangent-16.png
      vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
      vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

      vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));      `,

      "#include <defaultnormal_vertex>":
        THREE.ShaderChunk.defaultnormal_vertex.replace(
          // transformedNormal will be used in the lighting calculations
          "vec3 transformedNormal = objectNormal;",
          `vec3 transformedNormal = displacedNormal;`
        ),

      // transformed is the output position
      "#include <displacementmap_vertex>": `
        transformed = displacedPosition;
      `,
    }),
    fragmentShader: THREE.ShaderChunk.meshphysical_frag,
    // wireframe: true,
    side: THREE.FrontSide,
  });

  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, RESOLUTION, RESOLUTION);
  const plane = new THREE.Mesh(geometry, material);
  return plane;
};
