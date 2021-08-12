import * as THREE from "three";
import header from "./customChunks/fbm_smoothshaded/header.glsl.js";
import main from "./customChunks/fbm_smoothshaded/main.glsl.js";
import main_heightmap from "./customChunks/heightmap_smoothshaded/main.glsl.js";
import heightmap from "./maps/heightmaps/real14.png";

export const createTerrainFBM = (time) => {
  const SIZE = 4;
  const RESOLUTION = 200;

  const material = new THREE.MeshPhysicalMaterial({
    side: THREE.FrontSide,
    color: 0xaaaaff,
    metalness: 3,
    roughness: 1,
  });

  material.userData.u_time = { value: time };
  // console.log(material);

  material.onBeforeCompile = (shader) => {
    shader.uniforms.u_time = material.userData.u_time;
    // console.log(shader);
    shader.vertexShader = header + "\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      main
    );
  };

  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, RESOLUTION, RESOLUTION);
  const plane = new THREE.Mesh(geometry, material);
  return plane;
};

export const createTerrain = (time) => {
  const SIZE = 4;
  const RESOLUTION = 500;
  const heightMap = new THREE.TextureLoader().load(heightmap);

  const material = new THREE.MeshPhysicalMaterial({
    side: THREE.FrontSide,
  });

  material.userData.u_heightmap = { value: heightMap };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.u_heightmap = material.userData.u_heightmap;

    shader.vertexShader =
      `uniform sampler2D u_heightmap;\n` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      main_heightmap
    );
  };

  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, RESOLUTION, RESOLUTION);
  const plane = new THREE.Mesh(geometry, material);
  return plane;
};

export const createTerrain3 = () => {
  const SIZE = 4;
  const RESOLUTION = 1000;
  const heightMap = new THREE.TextureLoader().load(heightmap);

  const material = new THREE.MeshStandardMaterial({
    side: THREE.FrontSide,
    displacementMap: heightMap,
  });

  material.userData.u_heightmap = { value: heightMap };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.u_heightmap = material.userData.u_heightmap;

    shader.vertexShader =
      `uniform sampler2D u_heightmap;\n` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
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
      vec3 transformed = position;
      vNormal = displacedNormal;
      
      `
    );
  };

  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, RESOLUTION, RESOLUTION);
  const plane = new THREE.Mesh(geometry, material);
  return plane;
};
