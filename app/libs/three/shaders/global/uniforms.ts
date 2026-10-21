import { Uniform, Vector2 } from 'three';

/**
 * @description Shared Uniform instances for values that must be kept in sync
 * across all shader materials (e.g. uTime). Because Three.js ShaderMaterial.clone()
 * copies the Uniform object reference — not its value — every cloned material
 * automatically reads the latest value when the shared instance is updated once
 * per frame in GLManager.render().
 */

export const GlobalUniforms = {
	uTime: new Uniform(0.0),
	uDeltaTime: new Uniform(0.0),
	uMouse: new Uniform(new Vector2(0, 0)),
	uVelocity: new Uniform(new Vector2(0, 0)),
	uResolution: { value: new Vector2() },
};
