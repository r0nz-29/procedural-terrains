# Procedural Terrains with three.js

Terrains developed using three.js and GLSL Shaders. There are multiple terrain configurations stored in the `src/World` folder.
Whole web application runs on React.js and is bootstrapped with `create-react-app`.

**Note :- The three.js code executes from a `World` class inside the react app, so it is portable and can be used with any library / framework**

## Some Terrains in this repo 

All these terrains are generated manually by altering the vertices and materials of a `Plane Mesh`, instead of pre-built objects imported from blender. 

### Terrain generated with heightmaps using glsl vertex shaders.
demo : https://terrain-heightmap.herokuapp.com/

### Terrain generated with noise functions 
demo : https://terrain-noise.herokuapp.com/

### Terrain which are Flat Shaded (Lambertian shading with custon Fragment Shader)
demo : https://terrain-flatshaded.herokuapp.com/

### Terrain which are Smooth Shaded (Gourad and Blinn shading with custom Flat Shader)
demo : https://terrain-heightmap.herokuapp.com/

### Smooth shaded Terrain built by modifying three's default materials (using onBeforeCompile() method)
demo : https://terrain-smoothshaded-obc.herokuapp.com/
