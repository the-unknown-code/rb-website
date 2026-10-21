precision mediump float;

uniform sampler2D uMap;
uniform sampler2D uTrail;

uniform float uProjection;
uniform float uScale;
uniform float uAberration;
uniform float uFaceFresnel;
uniform float uFaceEdgeSpread;
uniform float uFaceEdgeFalloff;
uniform float uMapEdgeFade;
uniform float uGlassMatte;
uniform float uGlassGrainSize;
uniform float uRearBlur;
uniform float uIridescence;
uniform float uTime;

varying vec2 vUv;
varying vec2 vScreenUv;
varying vec3 vNormalView;
varying vec3 vFaceNormal;
varying vec3 vWorld;
varying vec2 vFaceCoord;
varying float vViewDepth;

float random(vec2 st) {
	return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	vec2 u = f * f * (3.0 - 2.0 * f);

	return mix(
		mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
		mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
		u.y
	);
}

float pentagonInterior(vec2 p) {
	const float sector = 1.2566370614;
	const float inradius = 0.8090169944;

	float edgeAngle = abs(mod(atan(p.y, p.x), sector) - sector * 0.5);
	return inradius / cos(edgeAngle) - length(p);
}

vec4 blurredReflection(vec2 sampleUv, float radius) {
	vec4 color = vec4(0.0);
	float totalWeight = 0.0;

	for (int x = -2; x <= 2; x++) {
		for (int y = -2; y <= 2; y++) {
			vec2 offset = vec2(float(x), float(y)) * radius * 0.5;
			float distanceSquared = float(x * x + y * y);
			float weight = exp(-distanceSquared * 0.42);

			color += texture2D(uMap, sampleUv + offset) * weight;
			totalWeight += weight;
		}
	}

	return color / totalWeight;
}

void main() {
	vec3 n = normalize(vFaceNormal);
	vec3 guide = abs(n.y) > .96
		? vec3(1.0, 0.0, 0.0)
		: vec3(0.0, 1.0, 0.0);

	vec3 tangent = normalize(cross(guide, n));
	vec3 bitangent = normalize(cross(n, tangent));

	vec2 faceUv = vec2(
		dot(vWorld, tangent),
		dot(vWorld, bitangent)
	) * uScale + 0.5;

	float scan = sin(vScreenUv.y * 900.0 + uTime * 12.0) * uAberration;

	vec2 uv = clamp(
		mix(vScreenUv, faceUv, uProjection) + vec2(scan, 0.0),
		0.002,
		0.998
	);

	float shift = uAberration * (
		1.0 + noise(floor(vScreenUv * 420.0) + uTime)
	);

	vec2 grainUv = vUv * (800.0 / max(uGlassGrainSize, 0.001));
	vec2 grainNormal = vec2(
		noise(grainUv + vec2(13.7, 2.1)) - 0.5,
		noise(grainUv + vec2(4.2, 19.3)) - 0.5
	);

	vec2 reflectionUv = clamp(
		uv + grainNormal * uGlassMatte * 0.05,
		0.002,
		0.998
	);

	// Pentagon edge values.
	float faceInterior = pentagonInterior(vFaceCoord);

	float edgeFresnel = exp(
		-uFaceEdgeFalloff
		* max(faceInterior, 0.0)
		/ max(uFaceEdgeSpread, 0.0001)
	);

	// Soap-bubble RGB split, restricted to face edges.
	float iridescenceMask = smoothstep(0.08, 0.82, edgeFresnel);
	float soapShift = uIridescence * iridescenceMask * 0.018;

	// Farther visible surfaces: blur and fade reflection toward black.
	float rearDepth = smoothstep(3.25, 4.95, vViewDepth);
	float blurStrength = clamp(uRearBlur / 2.0, 0.0, 1.0);
	float blurMask = rearDepth * blurStrength;
	float blurRadius = rearDepth * uRearBlur * 0.055;

	vec3 reflection = vec3(
		blurredReflection(
			clamp(
				reflectionUv + vec2(shift + soapShift, 0.0),
				0.002,
				0.998
			),
			blurRadius
		).r,

		blurredReflection(
			reflectionUv,
			blurRadius
		).g,

		blurredReflection(
			clamp(
				reflectionUv - vec2(shift + soapShift, 0.0),
				0.002,
				0.998
			),
			blurRadius
		).b
	);

	vec3 color = mix(reflection, vec3(0.0), blurMask * 0.72);

	float mapMask = smoothstep(
		0.0,
		max(uMapEdgeFade, 0.0001),
		faceInterior
	);

	color *= mix(1.0, mapMask, step(0.0001, uMapEdgeFade));

	color += texture2D(uTrail, vUv).r * vec3(3.25, 3.7, 3.2);

	float viewFresnel = pow(1.0 - abs(vNormalView.z), 1.7);

	color += viewFresnel
		* vec3(0.1, 0.35, 0.75)
		* mix(1.0, 0.3, uGlassMatte);

	color += edgeFresnel
		* uFaceFresnel
		* vec3(0.2, 0.7, 1.5)
		* mix(1.0, 0.6, uGlassMatte);

	gl_FragColor = vec4(color, 0.92);
}