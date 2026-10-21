import type { Material, Object3D, Vector3Like } from 'three';
import { Group, Mesh, PerspectiveCamera, Scene, Texture } from 'three';
import { ISceneDefaults, type IManifest, type IScene } from '../../types';

import GLRenderer from '../../core/Renderer';
import GLCache from '../../utils/Cache';
import GLViewport from '../../utils/Viewport';
import AbstractObject from '../objects/AbstractObject';
import GLLoader from '../../core/Loader';

/**
 * @description Base abstract scene used by the rendering engine.
 *
 * Provides a common implementation for scene management, including:
 * - Three.js Scene creation
 * - Perspective camera initialization
 * - Root Group management
 * - Renderer, viewport and cache access
 * - Common lifecycle methods (`enable`, `disable`, `resize`, `update`, `dispose`)
 *
 * Concrete scenes should extend this class and override the lifecycle methods
 * as needed.
 *
 * @author Andrea Giuffrida
 */

export default abstract class GLAbstractScene {
	static addToMain: boolean = false;
	static manifest: IManifest = [];

	static async loadManifest() {
		await GLLoader.getInstance().loadManifest((this.manifest));
	}

	#enabled = false;

	readonly #id: string;

	readonly #loader: GLLoader;
	readonly #cache: GLCache;
	readonly #viewport: GLViewport;
	readonly #renderer: GLRenderer;

	readonly #scene: Scene;
	readonly #camera: PerspectiveCamera;
	readonly #group: Group;

	protected constructor(params: IScene = ISceneDefaults) {
		this.#id = params.id;

		this.#loader = GLLoader.getInstance();
		this.#cache = GLCache.getInstance();
		this.#viewport = GLViewport.getInstance();
		this.#renderer = GLRenderer.getInstance();

		this.#scene = new Scene();

		this.#camera = new PerspectiveCamera(
			params.camera?.fov,
			this.#viewport.aspect,
			params.camera?.near,
			params.camera?.far,
		);

		this.#camera.position.copy(
			params.camera?.position as Vector3Like,
		);

		this.#group = new Group();
		this.#group.visible = false;

		this.#scene.add(this.#group);
	}

	get id() {
		return this.#id;
	}

	get enabled() {
		return this.#enabled;
	}

	get cache() {
		return this.#cache;
	}

	get loader() {
		return this.#loader;
	}

	get viewport() {
		return this.#viewport;
	}

	get renderer() {
		return this.#renderer;
	}

	get scene() {
		return this.#scene;
	}

	get camera() {
		return this.#camera;
	}

	get group() {
		return this.#group;
	}

	initialize() {
		//
	}

	enable() {
		this.#group.visible = true;
		this.#enabled = true;
	}

	disable() {
		this.#group.visible = false;
		this.#enabled = false;
	}

	update(_time: number, _dt: number) {
		if (!this.#enabled) return;
		this.onUpdate(_time, _dt);
	}

	protected onUpdate(_time: number, _dt: number) { }

	resize(_width: number, _height: number, _pHeight: number) {
		if (!this.#enabled) return;

		this.#camera.aspect = this.#viewport.aspect;
		this.#camera.updateProjectionMatrix();
	}

	add(...objects: Object3D[]) {
		for (const object of objects) {
			if (object instanceof AbstractObject) {
				object.setCamera(this.#camera);
			}
		}

		this.#group.add(...objects);
	}

	remove(...objects: Object3D[]) {
		this.#group.remove(...objects);
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
		this.disable();

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

		this.#group.clear();
		this.#scene.clear();
	}
}
