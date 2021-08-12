import simplex_noise_3d from "../../simplex_noise_3d.glsl.js";

export default /* GLSL */ `

${simplex_noise_3d}

uniform float u_time;

#define NUM_OCTAVES 9

float fbm(vec3 x) {
  float v = 0.0;
  float a = 0.5;
  vec3 shift = vec3(100);
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * snoise(x);
    x = x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float displace(vec3 point) {
return fbm(vec3(point.x * 0.5, point.y * 0.5, u_time * 0.3)) * 0.7;
}

vec3 orthogonal(vec3 v) {
return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
: vec3(0.0, -v.z, v.y));
}

`;
