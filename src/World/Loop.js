import { createControls } from "./controls";

class Loop {
  constructor(camera, scene, renderer) {
    this._camera = camera;
    this._scene = scene;
    this._renderer = renderer;
    this._needsUpdate = [];
    this._controls = createControls(
      this._camera,
      this._renderer.domElement,
      "orbit"
    );
    // this._controls.lookSpeed = 0.05;
    // this._controls.movementSpeed = 0.4;
    // this._controls.noFly = true;
    // this._controls.lookVertical = true;
    // this._controls.constrainVertical = true;
    // this._controls.verticalMin = 1.3;
    // this._controls.verticalMax = 1.8;
    // this._controls.activeLook = true;
    // console.log(this._controls);
    this._objectsWithBehaviour = [];
  }

  start(clock, time) {
    this._renderer.setAnimationLoop(() => {
      //update controls
      this._controls.update(clock.getDelta());

      // //update uniforms
      this._needsUpdate.forEach((obj) => {
        console.log(obj.material);
        obj.material.userData.u_time.value += 0.005;
      });

      //animate objects
      this._objectsWithBehaviour.forEach((obj) => {
        obj.behaviour();
      });

      //re-render scene
      this._renderer.render(this._scene, this._camera);
    });
  }

  stop() {
    this._renderer.setAnimationLoop(null);
  }
}

export { Loop };
