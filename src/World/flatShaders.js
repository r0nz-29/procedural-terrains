export const VS = `
  uniform float u_time;
  uniform sampler2D u_water;
  uniform sampler2D u_heightmap;
  varying float height;
  varying vec3 normalInterp;
  varying vec3 pos;
  varying vec2 vuv;
  varying float vAmount;

  void main() {
    vec3 p = position;
    vuv = uv;
    mat4 boilerplate = projectionMatrix * modelViewMatrix;
    vec3 heightData = texture2D(u_heightmap, uv).rgb;
    vAmount = heightData.x;
    height = heightData.x + heightData.y + heightData.z;
    // height = ((heightData.x * 256.0 * 256.0 + heightData.y * 256.0 + heightData.z) * 0.1) - 55.0;
    vec3 newP = p + vec3(0.0, 0.0, 0.5*height);
    vec3 newNormal = normal + vec3(0.5*height);

    vec4 pos4 = modelViewMatrix * vec4(newP, 1.0);

    normalInterp = newNormal;
    pos = vec3(pos4) / pos4.w;

    gl_Position = boilerplate * vec4(newP, 1.0);
  }
`;

export const FS = `
 uniform sampler2D u_grass;
 uniform sampler2D u_sand;
 uniform sampler2D u_rock;
 uniform sampler2D u_snow;
 uniform sampler2D u_water;
 varying vec3 normalInterp;
 varying float height;
 varying vec3 pos;
 varying float vAmount;

 varying vec2 vuv;

 const vec3 lightPos 	= vec3(100,100,0);
//  const vec3 ambientColor = vec3(0.2, 0.0, 0.0);
//  const vec3 diffuseColor = vec3(0.3961, 0.2627, 0.1294); 
 const vec3 ambientColor = vec3(0.2078, 0.1372, 0.1137);
 const vec3 diffuseColor = 2.0 * vec3(0.2078, 0.1372, 0.1137);
 const vec3 specColor 	= vec3(1.0, 1.0, 1.0);
 
 void main() {
   vec4 water = (smoothstep(0.0, 0.0, vAmount) - smoothstep(0.0, 0.0, vAmount)) * texture2D( u_water, vuv );
  //  vec4 grass = (smoothstep(0.1, 0.27, vAmount) - smoothstep(0.18, 0.29, vAmount)) * texture2D( u_grass, vuv );
   vec4 grass = (smoothstep(0.0, 0.12, vAmount) - smoothstep(0.05, 0.40, vAmount)) * texture2D( u_grass, vuv );
   vec4 snow = smoothstep(0.50, 0.65, vAmount) * texture2D( u_snow, vuv );
   vec4 rock = (smoothstep(0.0, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( u_rock, vuv );
  //  vec4 sand = (smoothstep(0.0, 0.12, vAmount) - smoothstep(0.05, 0.40, vAmount)) * texture2D( u_sand, vuv );
   vec4 sand = (smoothstep(0.1, 0.27, vAmount) - smoothstep(0.18, 0.29, vAmount)) * texture2D( u_sand, vuv );

   vec3 normal = mix(normalize(normalInterp), normalize(cross(dFdx(pos), dFdy(pos))), 0.8);
   vec3 lightDir = normalize(lightPos - pos);
 
   float lambertian = max(dot(lightDir,normal), 0.0);
   float specular = 0.0;
 
   if(lambertian > 0.0) {
     vec3 viewDir = normalize(-pos);
     vec3 halfDir = normalize(lightDir + viewDir);
     float specAngle = max(dot(halfDir, normal), 0.0);
     specular = pow(specAngle, 16.0);
   }
   vec4 color = water + rock + snow ;
   if(height < 0.03) { color = texture2D(u_water, vuv);}
   gl_FragColor = vec4(ambientColor + lambertian * diffuseColor + specular * specColor, 1.0);
 }
`;
