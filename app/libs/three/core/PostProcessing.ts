import type { WebGLRenderer } from 'three';
import { EffectComposer, type Pass } from 'postprocessing';

/**
 * @description Singleton wrapper around the Postprocessing `EffectComposer`.
 *
 * Responsible for managing the application's post-processing pipeline,
 * including render passes, resizing and rendering. The composer is created
 * once per rendering context and can be shared across the engine through a
 * keyed singleton pattern.
 *
 * Features:
 * - Creates and owns an `EffectComposer`.
 * - Manages render passes.
 * - Handles composer resizing.
 * - Renders the complete post-processing pipeline.
 * - Properly disposes passes when no longer needed.
 *
 * @author Andrea Giuffrida
 */

export default class GLPostProcessing {
	static readonly #instances = new Map<string, GLPostProcessing>();

	static getInstance(
		renderer?: WebGLRenderer,
		key = 'default',
	) {
		const instance = this.#instances.get(key);

		if (instance) {
			return instance;
		}

		if (!renderer) {
			throw new Error(
				'GLPostProcessing must be initialized with a WebGLRenderer.',
			);
		}

		const post = new GLPostProcessing(renderer, key);

		this.#instances.set(key, post);

		return post;
	}

	readonly #key: string;
	readonly #composer: EffectComposer;

	private constructor(
		renderer: WebGLRenderer,
		key: string,
	) {
		this.#key = key;
		this.#composer = new EffectComposer(renderer);
	}

	addPass(pass: Pass) {
		this.#composer.addPass(pass);
	}

	removePass(pass: Pass) {
		const index = this.#composer.passes.indexOf(pass);

		if (index !== -1) {
			this.#composer.passes.splice(index, 1);
		}

		pass.dispose?.();
	}

	resize(width: number, height: number) {
		this.#composer.setSize(width, height);
	}

	render(delta?: number) {
		this.#composer.render(delta);
	}

	dispose() {
		for (const pass of this.#composer.passes) {
			this.removePass(pass);
		}

		this.#composer.passes.length = 0;

		GLPostProcessing.#instances.delete(this.#key);
	}

	get composer() {
		return this.#composer;
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLPostProcessing.getInstance().dispose();
	});
}
