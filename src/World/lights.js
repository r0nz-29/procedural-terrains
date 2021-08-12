import * as THREE from 'three';

export const createLights = () => {
  // const light = new THREE.DirectionalLight('white', 2);
  // light.position.set(0, 2, 0);
  // light.castShadow = true;
  // const aLight = new THREE.AmbientLight("white", 2);
  const directionalLight = new THREE.DirectionalLight(0xffaaaa, 2)
  directionalLight.position.set(5, 2, 0)

  const directionalLight2 = new THREE.DirectionalLight(0xaaaaff, 0.8)
  directionalLight2.position.set(-5, 5, 0)

  const ambientLight = new THREE.AmbientLight(0x964b00, 0.5)
  return { directionalLight, directionalLight2, ambientLight };
}