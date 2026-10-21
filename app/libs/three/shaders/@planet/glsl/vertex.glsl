varying vec2 vUv;
varying vec2 vScreenUv;
varying vec3 vNormalView;
varying vec3 vFaceNormal;
varying vec3 vWorld;
varying vec2 vFaceCoord;
varying float vViewDepth;
attribute vec2 aFaceCoord;

void main() {
  vUv = uv;
  vNormalView = normalize(normalMatrix * normal);
  vFaceNormal = normalize(mat3(modelMatrix) * normal);
  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  vFaceCoord = aFaceCoord;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDepth = -viewPosition.z;
  vec4 clip = projectionMatrix * viewPosition;
  vScreenUv = clip.xy / clip.w * .5 + .5;
  gl_Position = clip;
}
