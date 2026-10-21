#ifndef RANDOM_GLSL
#include ./random.glsl
#endif

// Value noise — smooth interpolation between random grid points
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}