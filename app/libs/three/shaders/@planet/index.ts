import { Pane } from 'tweakpane';
import type { IUniform, Texture } from 'three';
import GLAbstractShader from '../AbstractShader';

import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl';

export interface IMATPlanetShaderUniforms {
	uMap: IUniform<Texture | null>;
	uTrail: IUniform<Texture | null>;
	uProjection: IUniform<number>;
	uScale: IUniform<number>;
	uAberration: IUniform<number>;
	uIridescence: IUniform<number>;
	uFaceFresnel: IUniform<number>;
	uFaceEdgeSpread: IUniform<number>;
	uFaceEdgeFalloff: IUniform<number>;
	uMapEdgeFade: IUniform<number>;
	uGlassMatte: IUniform<number>;
	uGlassGrainSize: IUniform<number>;
	uRearBlur: IUniform<number>;
}

export default class MATPlanetShader extends GLAbstractShader<IMATPlanetShaderUniforms> {
	constructor() {
		super(vertexShader, fragmentShader, {
			uMap: { value: null },
			uTrail: { value: null },
			uProjection: { value: 0.12 },
			uScale: { value: 0.25 },
			uAberration: { value: 0 },
			uIridescence: { value: 1 },
			uFaceFresnel: { value: 0.15 },
			uFaceEdgeSpread: { value: 0.038 },
			uFaceEdgeFalloff: { value: 0.25 },
			uMapEdgeFade: { value: 0 },
			uGlassMatte: { value: 0.0 },
			uGlassGrainSize: { value: 0.6 },
			uRearBlur: { value: 0.25 },
		}, {
			transparent: false,
		});

		const pane = new Pane({ title: 'Glass' });

		pane.addBinding(this.uniforms.uProjection, 'value', {
			label: 'Projection', min: 0, max: 0.45,
		});
		pane.addBinding(this.uniforms.uScale, 'value', {
			label: 'Scale', min: 0.12, max: 1,
		});
		pane.addBinding(this.uniforms.uAberration, 'value', {
			label: 'Aberration', min: 0, max: 0.025,
		});
		pane.addBinding(this.uniforms.uFaceFresnel, 'value', {
			label: 'Face Fresnel', min: 0, max: 3,
		});
		pane.addBinding(this.uniforms.uFaceEdgeSpread, 'value', {
			label: 'Face Edge Spread', min: 0.02, max: 0.8,
		});
		pane.addBinding(this.uniforms.uFaceEdgeFalloff, 'value', {
			label: 'Face Edge Falloff', min: 0, max: 8,
		});
		pane.addBinding(this.uniforms.uMapEdgeFade, 'value', {
			label: 'Map Edge Fade', min: 0, max: 0.25,
		});
		pane.addBinding(this.uniforms.uGlassMatte, 'value', {
			label: 'Glass Roughness', min: 0, max: 1,
		});
		pane.addBinding(this.uniforms.uGlassGrainSize, 'value', {
			label: 'Grain Size', min: 0.1, max: 3,
		});
		pane.addBinding(this.uniforms.uRearBlur, 'value', {
			label: 'Rear Reflection Blur', min: 0, max: 2,
		});

		pane.addBinding(this.uniforms.uIridescence, 'value', {
			label: 'Iridescence',
			min: 0,
			max: 2,
		});
	}
}
