import * as THREE from 'three';

export const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    35,
    1,
    0.1,
    100
  );
  camera.position.set(0, 5, 5);
  return camera;
}