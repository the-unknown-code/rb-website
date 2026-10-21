import { LinearSRGBColorSpace, WebGLRenderer } from 'three';
import useAppStore from '~/store/useAppStore';
import GLViewport from '../utils/Viewport';
import GLManager from '../view/Manager';
import GLPostProcessing from './PostProcessing';

/**
 * @description Singleton wrapper around Three.js `WebGLRenderer`.
 *
 * Responsible for creating and configuring the application's rendering
 * context, handling viewport resizing and rendering the active scene.
 * When enabled, rendering is delegated to a `GLPostProcessing` pipeline.
 *
 * Features:
 * - Creates and configures a WebGL renderer.
 * - Supports optional post-processing.
 * - Handles viewport resizing.
 * - Exposes the renderer canvas.
 * - Properly disposes GPU resources.
 *
 * @author Andrea Giuffrida
 */
export default class GLRenderer {
	static readonly #instances = new Map<string, GLRenderer>();

	static getInstance(key = 'default') {
		if (!this.#instances.has(key)) {
			this.#instances.set(key, new GLRenderer(key));
		}

		return this.#instances.get(key)!;
	}

	readonly #key: string;
	readonly #renderer: WebGLRenderer;

	readonly #viewport: GLViewport;
	readonly #manager: GLManager;
	readonly #composer?: GLPostProcessing;
	readonly #scroll: boolean;

	readonly #rect: ReturnType<typeof useElementBounding>;

	private constructor(key: string) {
		const { public: { config } } = useRuntimeConfig();
		const $store = useAppStore();

		this.#key = key;

		this.#viewport = GLViewport.getInstance();
		this.#manager = GLManager.getInstance();
		this.#scroll = !config.three.fixed;

		this.#renderer = new WebGLRenderer({
			alpha: true,
			antialias: false,
			powerPreference: 'high-performance',
		});

		this.#renderer.setPixelRatio($store.platform.dpr);
		this.#renderer.outputColorSpace = LinearSRGBColorSpace;
		this.#rect = useElementBounding(this.#renderer.domElement);

		if (config.three.postProcessing) {
			this.#composer = GLPostProcessing.getInstance(this.#renderer);
		}
	}

	scroll() {
		const scrollY = window.scrollY - window.innerHeight * this.#viewport.padding;
		this.#viewport.canvasTop = this.#rect.top.value;
		this.domElement.style.transform = `translate3d(0, ${scrollY}px, 0)`;
	}

	render(_time: number, dt: number) {
		if (this.#scroll) this.scroll();

		if (this.#composer) {
			this.#composer.render(dt);
			return;
		}

		const activeScene = this.#manager.activeScene;

		if (!activeScene) {
			return;
		}

		this.#renderer.render(
			activeScene.scene,
			activeScene.camera,
		);
	}

	resize(width: number, height: number, _pHeight: number) {
		this.#renderer.setSize(width, _pHeight);
		this.#composer?.resize(width, _pHeight);
	}

	dispose() {
		this.#composer?.dispose();

		this.#renderer.dispose();
		this.#renderer.forceContextLoss();

		GLRenderer.#instances.delete(this.#key);
	}

	get domElement(): HTMLCanvasElement {
		return this.#renderer.domElement;
	}

	get r(): WebGLRenderer {
		return this.#renderer;
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLRenderer.getInstance().dispose();
	});
}
