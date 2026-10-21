import { ShaderMaterial, type ShaderMaterialParameters } from 'three';
import { GlobalUniforms } from './global/uniforms';

export default abstract class GLAbstractShader<
	TUniforms extends object = object,
> extends ShaderMaterial {
	declare uniforms: typeof GlobalUniforms & TUniforms;

	constructor(
		vertexShader: string,
		fragmentShader: string,
		uniforms: TUniforms = {} as TUniforms,
		params: Partial<ShaderMaterialParameters> = {},
	) {
		super({
			vertexShader,
			fragmentShader,
			uniforms: {
				...GlobalUniforms,
				...uniforms,
			},
			...params,
		});
	}

	resize(width: number, height: number) {
		this.uniforms.uResolution.value.set(width, height);
	}

	destroy() {
		this.dispose();
	}
}
