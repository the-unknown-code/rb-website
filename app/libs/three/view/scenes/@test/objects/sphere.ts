import { IObjectDefaults } from '~/libs/three/types';
import AbstractObject from '../../../objects/AbstractObject';
import type {
	BufferGeometry } from 'three';
import {
	BufferAttribute,
	DodecahedronGeometry,
	Mesh,
	Vector3,
} from 'three';
import MATPlanetShader from '~/libs/three/shaders/@planet';

export default class OSphere extends AbstractObject {
	#mesh: Mesh;

	constructor() {
		super({
			...IObjectDefaults,
			tracking: { enabled: false, id: 'tracking' },
			interactive: true,
		});

		const geometry = new DodecahedronGeometry(2, 0).toNonIndexed();
		geometry.computeVertexNormals();
		geometry.scale(1.04, 0.98, 1.02);
		this.addPentagonFaceCoordinates(geometry);

		const material = new MATPlanetShader();
		material.uniforms.uMap.value = this.cache.getTexture('texture::uv-map');

		this.#mesh = new Mesh(geometry, material);
		this.#mesh.position.set(0, 0, -5);
		this.add(this.#mesh);
	}

	private addPentagonFaceCoordinates(geometry: BufferGeometry): void {
		const position = geometry.getAttribute('position') as BufferAttribute;
		const coordinates = new Float32Array(position.count * 2);
		const objectScale = new Vector3(1.04, 0.98, 1.02);
		const point = new Vector3();
		const relative = new Vector3();
		const faceVertices: Vector3[] = [];

		for (let faceStart = 0; faceStart < position.count; faceStart += 9) {
			faceVertices.length = 0;

			for (let i = faceStart; i < faceStart + 9; i += 1) {
				point.fromBufferAttribute(position, i).divide(objectScale);

				if (!faceVertices.some(v => v.distanceToSquared(point) < 0.000001)) {
					faceVertices.push(point.clone());
				}
			}

			const [first, second, third] = faceVertices;

			if (
				faceVertices.length !== 5
				|| first === undefined
				|| second === undefined
				|| third === undefined
			) {
				continue;
			}

			const center = faceVertices.reduce(
				(sum, vertex) => sum.add(vertex),
				new Vector3(),
			).multiplyScalar(1 / faceVertices.length);

			const tangent = first.clone().sub(center).normalize();
			const normal = second.clone().sub(center)
				.cross(third.clone().sub(center))
				.normalize();
			const bitangent = new Vector3().crossVectors(normal, tangent);
			const radius = first.distanceTo(center);

			for (let i = faceStart; i < faceStart + 9; i += 1) {
				point.fromBufferAttribute(position, i).divide(objectScale);
				relative.copy(point).sub(center);

				coordinates[i * 2] = relative.dot(tangent) / radius;
				coordinates[i * 2 + 1] = relative.dot(bitangent) / radius;
			}
		}

		geometry.setAttribute('aFaceCoord', new BufferAttribute(coordinates, 2));
	}

	override update(_time: number, dt: number): void {
		super.update(_time, dt);
		this.#mesh.rotation.y += 0.0005 * dt;
		this.#mesh.rotation.x += 0.0005 * dt;
	}
}
