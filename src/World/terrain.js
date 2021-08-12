import * as THREE from "three";
import heightmap from "./maps/heightmaps/real14.png";
import water from "./maps/textures/water1.jpg";
import rock from "./maps/textures/rock.png";
import sand from "./maps/textures/sand.jpg";
import snow from "./maps/textures/snow.jpg";
import grass from "./maps/textures/grass.jpg";
import { createMap, monkeyPatch } from "./utils";

export const createTerrain = (time) => {
  const heightMap = createMap(heightmap);
  const Water = createMap(water);
  const Sand = createMap(sand);
  const Rock = createMap(rock);
  const Snow = createMap(snow);
  const Grass = createMap(grass);

  const terrainUniforms = {
    u_time: {
      value: time,
    },
    u_heightmap: {
      value: heightMap,
    },
    // u_sand: {
    //   value: Sand,
    // },
    // u_water: {
    //   value: Water,
    // },
    // u_snow: {
    //   value: Snow,
    // },
    // u_grass: {
    //   value: Grass,
    // },
    // u_rock: {
    //   value: Rock,
    // },
    ...THREE.ShaderLib.physical.uniforms,
  };

  const SIZE = 4;
  const RESOLUTION = 1000;

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
        uniform sampler2D u_heightmap;
        
        // the function which defines the displacement
        float displace(vec2 point) {
          vec3 heightData = texture2D(u_heightmap, vec2(point.x, point.y)).rgb;
          return 0.5 * (heightData.x + heightData.y + heightData.z);
        }
      `,
      main: `
        vec3 displacedPosition = position + normal * displace(uv);
        
        //https://github.com/mrdoob/three.js/blob/c10eb1e1b3a71ee70ccbb21aad589499d92f09f4/examples/jsm/shaders/OceanShaders.js#L292-L308
        float texel = 1.0 / 1000.0;
        float texelSize = 4.0 / 1000.0;

        vec3 center = texture2D(u_heightmap, uv).rgb;
        vec3 right = vec3(texelSize, 0.0, 0.0) + texture2D(u_heightmap, uv + vec2(texel, 0.0)).rgb - center;
        vec3 left = vec3(-texelSize, 0.0, 0.0) + texture2D(u_heightmap, uv + vec2(-texel, 0.0)).rgb - center;
        vec3 top = vec3(0.0, 0.0, -texelSize) + texture2D(u_heightmap, uv + vec2(0.0, -texel)).rgb - center;
        vec3 bottom = vec3(0.0, 0.0, texelSize) + texture2D(u_heightmap, uv + vec2(0.0, texel)).rgb - center;

        vec3 topRight = cross(right, top);
        vec3 topLeft = cross(top, left);
        vec3 bottomLeft = cross(left, bottom);
        vec3 bottomRight = cross(bottom, right);

        vec3 displacedNormal = normalize(topRight + topLeft + bottomLeft + bottomRight);
      `,

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
  });

  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, RESOLUTION, RESOLUTION);
  const plane = new THREE.Mesh(geometry, material);
  return plane;
};
