import { TextureLoader, Vector3, MathUtils } from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

export const createMap = (image) => {
  const map = new TextureLoader().load(image);
  return map;
};

export function monkeyPatch(
  shader,
  { defines = "", header = "", main = "", ...replaces }
) {
  let patchedShader = shader;

  const replaceAll = (str, find, rep) => str.split(find).join(rep);
  Object.keys(replaces).forEach((key) => {
    patchedShader = replaceAll(patchedShader, key, replaces[key]);
  });

  patchedShader = patchedShader.replace(
    "void main() {",
    `
    ${header}
    void main() {
      ${main}
    `
  );

  return `
    ${defines}
    ${patchedShader}
  `;
}

export const createSky = (renderer) => {
  const sky = new Sky();
  sky.scale.setScalar(450000);

  const turbidity = 10;
  const rayleigh = 3;
  const mieCoefficient = 0.005;
  const mieDirectionalG = 0.7;
  const elevation = 2;
  const azimuth = 180;
  const exposure = renderer.toneMappingExposure;

  const sun = new Vector3();
  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = turbidity;
  uniforms["rayleigh"].value = rayleigh;
  uniforms["mieCoefficient"].value = mieCoefficient;
  uniforms["mieDirectionalG"].value = mieDirectionalG;

  const phi = MathUtils.degToRad(90 - elevation);
  const theta = MathUtils.degToRad(azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms["sunPosition"].value.copy(sun);

  renderer.toneMappingExposure = exposure;

  return sky;
};
