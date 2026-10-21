import Tempus, { type TempusCallback, type TempusState } from 'tempus';

import GLCache from './utils/Cache';
import GLViewport from './utils/Viewport';
import GLRenderer from './core/Renderer';
import GLManager from './view/Manager';
import GLLoader from './core/Loader';
import GLViewLoader from './view/ViewLoader';

/**
 * @description Singleton application controller for the WebGL engine.
 *
 * Manages the rendering lifecycle, update loop, and shared engine
 * services such as the viewport and cache. The application integrates
 * with Tempus to drive the render loop and exposes methods to start,
 * stop, and dispose the engine.
 *
 * Instances are managed through a singleton registry and can be
 * recreated after disposal.
 *
 * @author Andrea Giuffrida
 */

export default class GLApplication {
	static readonly #instances = new Map<string, GLApplication>();

	static getInstance(key: string = 'default') {
		if (!this.#instances.has(key)) {
			this.#instances.set(key, new GLApplication(key));
		}

		return this.#instances.get(key)!;
	}

	readonly #key: string;
	readonly #cache: GLCache;
	readonly #viewport: GLViewport;
	readonly #renderer: GLRenderer;
	readonly #manager: GLManager;
	readonly #viewLoader: GLViewLoader;

	readonly #updateFn: TempusCallback;

	#enabled: boolean = false;
	// #lowPower: boolean = false;
	#rafCancelFn?: () => void;

	constructor(key: string) {
		this.#key = key;

		const { public: { config } } = useRuntimeConfig();
		this.#cache = GLCache.getInstance();
		this.#cache.setItem('padding', config.three.padding);

		this.#viewport = GLViewport.getInstance();
		this.#renderer = GLRenderer.getInstance();
		this.#manager = GLManager.getInstance();
		this.#viewLoader = GLViewLoader.getInstance();

		// Initialize loader services
		GLLoader.getInstance(this.#renderer.r);
		this.#updateFn = this.update.bind(this);
	}

	async preload() {
		await this.#viewLoader.loadAll();
	}

	setActiveScene(id: string) {
		this.#manager.setActiveScene(id);
	}

	start() {
		if (this.#enabled) return;

		this.#enabled = true;
		this.#rafCancelFn = Tempus.add(this.#updateFn, { priority: -1 });
	}

	stop() {
		if (!this.#enabled) return;

		this.#enabled = false;
		this.#rafCancelFn?.();
		this.#rafCancelFn = undefined;
	}

	resize() {
		const { width, height, pHeight } = this.#viewport;

		this.#viewport.resize(width, height);
		this.#manager.resize(width, height, pHeight);
		this.#renderer.resize(width, height, pHeight);
	}

	private update(state: TempusState) {
		if (!this.#enabled) return;

		this.#viewport.update(state.time, state.deltaTime);
		this.#manager.update(state.time, state.deltaTime);
		this.#renderer.render(state.time, state.deltaTime);
	}

	dispose() {
		this.stop();

		this.#cache.dispose();
		this.#viewport.dispose();
		this.#renderer.dispose();
		this.#manager.dispose();
		this.#viewLoader.dispose();

		GLApplication.#instances.delete(this.#key);
	}

	get domElement(): HTMLCanvasElement {
		return this.#renderer.domElement;
	}

	set lowPowerMode(v: boolean) {
		// this.#lowPower = v;
		this[v ? 'stop' : 'start']();
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLApplication.getInstance().dispose();
	});
}
