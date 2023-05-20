# Procedural Terrains with three.js

Terrains developed using three.js and GLSL Shaders. There are multiple terrain configurations stored in the `src/World` folder.
Whole web application runs on React.js and is bootstrapped with `create-react-app`.

**Note :- The three.js code executes from a `World` class inside the react app, so it is portable and can be used with any library / framework**

## Some Terrains in this repo 

All these terrains are generated manually by altering the vertices and materials of a `Plane Mesh`, instead of pre-built objects imported from blender. 

### Terrain generated with heightmaps using glsl vertex shaders.
demo : https://heightmap-terrain.vercel.app/

### Terrain generated with noise functions 
demo : https://terrain-fbm.vercel.app/

### Flat-Shaded terrain (Lambertian shading with custom Fragment Shader)
demo : https://terrain-flatshaded.vercel.app/

### Smooth shaded Terrain built by modifying three's default materials (using onBeforeCompile() method)
demo : https://terrain-obc.vercel.app/
