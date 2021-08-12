// eslint-disable-next-line import/no-anonymous-default-export
export default /* GLSL */ `
  vec3 heightData = texture2D(u_heightmap, uv).rgb;
  float height = 0.5 * (heightData.x + heightData.y + heightData.z);

  vec3 displacedPosition = position + normal * height;
        
  //https://github.com/mrdoob/three.js/blob/c10eb1e1b3a71ee70ccbb21aad589499d92f09f4/examples/jsm/shaders/OceanShaders.js#L292-L308
  float texel = 1.0 / 500.0;
  float texelSize = 4.0 / 500.0;
  vec3 center = texture2D(u_heightmap, uv).rgb;
  vec3 right = vec3(texelSize, 0.0, 0.0) + texture2D(u_heightmap, uv + vec2(texel, 0.0)).rgb - center;
  vec3 left = vec3(-texelSize, 0.0, 0.0) + texture2D(u_heightmap, uv + vec2(-texel, 0.0)).rgb - center;
  vec3 top = vec3(0.0, 0.0, -texelSize) + texture2D(u_heightmap, uv + vec2(0.0, -texel)).rgb - center;
  vec3 bottom = vec3(0.0, 0.0, texelSize) + texture2D(u_heightmap, uv + vec2(0.0, texel)).rgb - center;
  vec3 topRight = cross(right, top);
  vec3 topLeft = cross(top, left);
  vec3 bottomLeft = cross(left, bottom);
  vec3 bottomRight = cross(bottom, right);
  vec3 displacedNormal = normalize(topRight + topLeft + bottomLeft + bottomRight);

  vec3 transformed = displacedPosition;
  vNormal = displacedNormal;
`;
