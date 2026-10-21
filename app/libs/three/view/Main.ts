import { Mesh, OrthographicCamera, Scene, Texture, type Material } from 'three';
import type GLAbstractScene from './scenes/AbstractScene';

/**
 * @description Singleton orthographic scene used as the engine's main render
 * layer. This scene is typically intended for fullscreen effects, screen-space
 * quads, transitions and post-processing helpers.
 *
 * The class owns a Three.js `Scene` and an `OrthographicCamera`, automatically
 * updating the camera projection according to the current viewport.
 *
 * @author Andrea Giuffrida
 */

export default class GLMain {
	static readonly #instances = new Map<string, GLMain>();

	static getInstance(key = 'default') {
		if (!this.#instances.has(key)) {
			this.#instances.set(key, new GLMain(key));
		}

		return this.#instances.get(key)!;
	}

	readonly #key: string;
	readonly #scene: Scene;
	readonly #camera: OrthographicCamera;

	private constructor(key: string) {
		this.#key = key;
		this.#scene = new Scene();
		this.#camera = new OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
	}

	addToScene(instance: GLAbstractScene) {
		this.#scene.add(instance.group);
	}

	resize(width: number, height: number, pHeight: number) {
		this.#camera.left = -width * 0.5;
		this.#camera.right = width * 0.5;
		this.#camera.top = pHeight * 0.5;
		this.#camera.bottom = -pHeight * 0.5;
		this.#camera.updateProjectionMatrix();
	}

	#disposeMaterial(material: Material) {
		for (const value of Object.values(material)) {
			if (value instanceof Texture) {
				value.dispose();
			}
		}

		material.dispose();
	}

	dispose() {
		this.#scene.traverse(object => {
			if (object instanceof Mesh) {
				object.geometry.dispose();

				const materials = Array.isArray(object.material)
					? object.material
					: [object.material];

				for (const material of materials) {
					this.#disposeMaterial(material);
				}
			}
		});

		this.#scene.clear();
		GLMain.#instances.delete(this.#key);
	}

	get scene() {
		return this.#scene;
	}

	get camera() {
		return this.#camera;
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLMain.getInstance().dispose();
	});
}
