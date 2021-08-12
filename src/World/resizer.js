const setSize = (container, camera, renderer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

export const resizer = (container, camera, renderer) => {
  setSize(container, camera, renderer);
  window.addEventListener('resize', ()=>{
    setSize(container, camera, renderer);
  });
}
