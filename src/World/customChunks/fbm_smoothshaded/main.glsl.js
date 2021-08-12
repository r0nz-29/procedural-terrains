const SIZE = 4;
const RESOLUTION = 200;

export default /* GLSL */ `
vec3 displacedPosition = position + normal * displace(position);
vec3 transformed = displacedPosition;

float offset = ${SIZE / RESOLUTION};
vec3 tangent = orthogonal(normal);
vec3 bitangent = normalize(cross(normal, tangent));
vec3 neighbour1 = position + tangent * offset;
vec3 neighbour2 = position + bitangent * offset;
vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);

// https://i.ya-webdesign.com/images/vector-normals-tangent-16.png
vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));

vNormal = displacedNormal;
`;
