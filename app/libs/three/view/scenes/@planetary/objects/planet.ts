import { IObjectDefaults } from '~/libs/three/types';
import AbstractObject from '../../../objects/AbstractObject';
import { DodecahedronGeometry, Mesh, MeshNormalMaterial } from 'three';
// import MATPlanetShader from '~/libs/three/shaders/@planet';

export default class OPlanet extends AbstractObject {
	#mesh: Mesh;

	constructor() {
		super({
			...IObjectDefaults,
			tracking: { enabled: false, id: 'tracking' },
			interactive: true,
		});

		const geometry = new DodecahedronGeometry(0.5, 0).toNonIndexed();
		geometry.computeVertexNormals();

		const material = new MeshNormalMaterial();
		// material.uniforms.uMap.value = this.cache.getTexture('texture::uv-map');

		this.#mesh = new Mesh(geometry, material);
		this.#mesh.position.set(0, 0, 0);
		this.add(this.#mesh);
	}

	override update(_time: number, dt: number): void {
		super.update(_time, dt);
		this.#mesh.rotation.y += 0.0005 * dt;
		this.#mesh.rotation.x += 0.0005 * dt;
	}
}
