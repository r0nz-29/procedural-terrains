import * as THREE from 'three';

export const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.5;
  return renderer;
}