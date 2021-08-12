# Procedural Terrains with three.js

Terrains developed using three.js and GLSL Shaders. There are multiple terrain configurations stored in the `src/World` folder.
Whole web application runs on React.js and is bootstrapped with `create-react-app`.

**Note :- The three.js code executes from a `World` class inside the react app, so it is portable and can be used with any library / framework**

## Some Terrains in this repo 

### Terrain generated with heightmaps using glsl vertex shaders.

### Terrain generated with noise functions 

### Terrain which are Flat Shaded (Lambertian shading with custon Fragment Shader)

### Terrain which are Smooth Shaded (Gourad and Blinn shading with custon Flat Shader)

### Smooth shaded Terrain built by modifying three's default materials (using onBeforeCompile() method)
