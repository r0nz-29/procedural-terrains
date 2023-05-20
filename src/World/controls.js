import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls';

export const createControls = (camera, canvas, type) => {
  if(type==="orbit") {
    const controls = new OrbitControls(camera, canvas);
    controls.autoRotate = true;
    controls.enableDamping = true;
    return controls;
  };
  if(type==="firstPerson"){
    const controls = new FirstPersonControls(camera, canvas);
    return controls;
  }
}
