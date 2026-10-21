import GLManager from './Manager';
import type GLAbstractScene from './scenes/AbstractScene';

type SceneConstructor = {
	new (): GLAbstractScene;
	readonly addToMain: boolean;
	readonly loadManifest: () => Promise<void>;
};

type SceneModule = {
	default: SceneConstructor;
};

/**
 * @description Singleton responsible for dynamically loading and registering
 * rendering scenes.
 *
 * Scene modules are automatically discovered using Vite's `import.meta.glob()`
 * and lazily imported on demand. Each module must export a default class
 * extending `GLAbstractScene`.
 *
 * Loaded scenes are instantiated and registered with `GLManager`, making them
 * available for activation, updating and rendering. Duplicate loader instances
 * are prevented through a keyed singleton pattern.
 *
 * Features:
 * - Lazy-loads scene modules.
 * - Registers scenes with the global scene manager.
 * - Supports loading individual scenes or all available scenes.
 * - Uses Vite code-splitting to reduce the initial bundle size.
 *
 * @author Andrea Giuffrida
 */

export default class GLViewLoader {
	static readonly #instances = new Map<string, GLViewLoader>();

	static getInstance(key = 'default') {
		if (!this.#instances.has(key)) {
			this.#instances.set(key, new GLViewLoader(key));
		}

		return this.#instances.get(key)!;
	}

	readonly #key: string;
	readonly #manager: GLManager;
	readonly #modules = import.meta.glob<SceneModule>([
		'./scenes/*/*.ts',
		'!./scenes/*/manifest.ts',
	]);

	private constructor(key: string) {
		this.#key = key;
		this.#manager = GLManager.getInstance();
	}

	async loadAll() {
		for (const loader of Object.values(this.#modules)) {
			await this.load(loader);
		}
	}

	async load(loader: () => Promise<SceneModule>) {
		if (!loader) {
			throw new Error(`Scene  not found.`);
		}

		const { default: Scene } = await loader();

		if (!Scene.addToMain) {
			return;
		}

		await Scene.loadManifest();
		const scene = new Scene();
		this.#manager.add(scene);
		return scene;
	}

	dispose() {
		GLViewLoader.#instances.delete(this.#key);
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLViewLoader.getInstance().dispose();
	});
}
