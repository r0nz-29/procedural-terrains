import * as THREE from "three";
import { createScene } from "./scene";
import { createCamera } from "./camera";
import { createRenderer } from "./renderer";
import { resizer } from "./resizer";
import { Loop } from "./Loop";
import { createTerrainFBM } from "./terrain_onBeforeCompile";
import { createSky } from "./utils";
import { GUI } from "dat.gui";

class World {
  constructor(container) {
    this._scene = createScene();
    this._camera = createCamera();
    this._renderer = createRenderer();
    container.appendChild(this._renderer.domElement);

    this._resizer = resizer(container, this._camera, this._renderer);
    this._time = 0.0;
    this._loop = new Loop(this._camera, this._scene, this._renderer);

    const land = createTerrainFBM(this._time);
    land.rotation.x = -Math.PI / 2;

    this._loop._needsUpdate.push(land);

    const sky = createSky(this._renderer);

    const alight = new THREE.AmbientLight(0x3c2515);

    this._scene.add(land, sky, alight);

    const sLight = {
      x: 0.1,
      y: 2,
      z: 0.1,
      intensity: 10,
      color: 0x87532c,
    };

    const spotLight = new THREE.SpotLight(sLight.color, sLight.intensity);
    spotLight.position.set(sLight.x, sLight.y, sLight.z);
    spotLight.target = land;
    this._scene.add(spotLight);
    let helper = new THREE.SpotLightHelper(spotLight);
    this._scene.add(helper);

    const gui = new GUI();

    let spLight = gui.addFolder("SpotLight");
    spLight.addColor(sLight, "color").onChange(() => {
      spotLight.color = new THREE.Color(sLight.color);
    });

    spLight.add(sLight, "x", -10, 10).onChange(() => {
      spotLight.intensity = sLight.intensity;
      spotLight.position.set(sLight.x, sLight.y, sLight.z);
      spotLight.target = land;

      this._scene.remove(helper);
      helper = new THREE.SpotLightHelper(spotLight);
      this._scene.add(helper);
    });

    spLight.add(sLight, "y", -10, 10).onChange(() => {
      spotLight.intensity = sLight.intensity;
      spotLight.position.set(sLight.x, sLight.y, sLight.z);
      spotLight.target = land;

      this._scene.remove(helper);
      helper = new THREE.SpotLightHelper(spotLight);
      this._scene.add(helper);
    });

    spLight.add(sLight, "z", -10, 10).onChange(() => {
      spotLight.intensity = sLight.intensity;
      spotLight.position.set(sLight.x, sLight.y, sLight.z);
      spotLight.target = land;

      this._scene.remove(helper);
      helper = new THREE.SpotLightHelper(spotLight);
      this._scene.add(helper);
    });

    spLight.add(sLight, "intensity", 0, 10).onChange(() => {
      spotLight.intensity = sLight.intensity;
      spotLight.position.set(sLight.x, sLight.y, sLight.z);
      spotLight.target = land;

      this._scene.remove(helper);
      helper = new THREE.SpotLightHelper(spotLight);
      this._scene.add(helper);
    });

    this._clock = new THREE.Clock();
  }

  start() {
    this._loop.start(this._clock, this._time);
  }

  stop() {
    this._loop.stop();
  }

  render() {
    this._renderer.render(this._scene, this._camera);
  }
}
export { World };
