/**
 * @description Singleton viewport and interaction manager for the WebGL engine.
 *
 * Provides reactive access to viewport dimensions, canvas coordinates,
 * normalized pointer positions, scroll velocity and raycasting utilities.
 * Integrates with the application's resize, pointer and Lenis composables
 * to expose a unified API for rendering and interaction.
 *
 * Features:
 * - Reactive viewport width, height and aspect ratio.
 * - Canvas and normalized pointer coordinates.
 * - Scroll velocity tracking.
 * - Raycasting against interactive objects.
 * - Support for both orthographic and scene-specific cameras.
 *
 * Instances are managed through a singleton registry and can be disposed
 * when no longer needed.
 *
 * @author Andrea Giuffrida
 */

import type Lenis from 'lenis';
import type { Camera, Intersection, Object3D } from 'three';
import { Raycaster, Vector2 } from 'three';
import GLCache from './Cache';
import type { IPoint } from '../types';
import type AbstractObject from '../view/objects/AbstractObject';
import GLMain from '../view/Main';
import { IThreeOutput } from '~/libs/common/setup/three';
import { GlobalUniforms } from '../shaders/global/uniforms';

export default class GLViewport {
	static readonly #instances = new Map<string, GLViewport>();

	static getInstance(key = 'default') {
		if (!this.#instances.has(key)) {
			this.#instances.set(key, new GLViewport(key));
		}

		return this.#instances.get(key)!;
	}

	readonly #key: string;
	readonly #cache: GLCache;
	readonly #width: Ref<number>;
	readonly #height: Ref<number>;
	readonly #x: Ref<number>;
	readonly #y: Ref<number>;
	readonly #lenis?: Ref<Lenis | null>;
	readonly #raycaster: Raycaster;
	readonly #raycastCamera: Camera | undefined;
	readonly #pointer = new Vector2();

	readonly #velocity = new Vector2();
	readonly #mouse = new Vector2();
	readonly #lastMouse = new Vector2();

	#canvasTop: number = 0;
	#padding: number = 0;
	#scrollVelocity: number = 0;

	private constructor(key: string) {
		const { public: { config } } = useRuntimeConfig();

		this.#key = key;

		this.#cache = GLCache.getInstance();
		this.#lenis = useLenis();

		const { width, height } = useResize();
		const { x, y } = useMouse({
			touch: false,
			type: 'client',
		});

		this.#width = width;
		this.#height = height;
		this.#x = x;
		this.#y = y;

		this.#raycaster = new Raycaster();
		this.#raycastCamera = config.three.output === IThreeOutput.ORTHO ? GLMain.getInstance().camera : undefined;
		this.#padding = this.#cache.getItem<number>('padding') ?? 0;
	}

	raycast(object: Object3D): Intersection<Object3D> | null {
		const camera = this.#raycastCamera ?? (object as AbstractObject).camera;
		camera.updateMatrixWorld(true);
		object.updateWorldMatrix(true, true);
		this.#raycaster.setFromCamera(this.pointer, camera);

		return (
			this.#raycaster.intersectObject(object, true)[0]
			?? null
		);
	}

	update(_time: number, _dt: number) {
		const dt = Math.min(Math.max(_dt * 0.001, 0), 1 / 20);
		const alpha = 1 - Math.exp(-5 * dt);
		this.#mouse.lerp(this.uvPosition, alpha);

		this.#velocity
			.copy(this.#mouse)
			.sub(this.#lastMouse)
			.divideScalar(Math.max(dt, 1 / 240));

		GlobalUniforms.uTime.value = _time * 0.001;
		GlobalUniforms.uDeltaTime.value = dt;
		GlobalUniforms.uResolution.value.set(this.width, this.height);
		GlobalUniforms.uMouse.value.copy(this.#mouse);
		GlobalUniforms.uVelocity.value.copy(this.#velocity);

		this.#lastMouse.copy(this.#mouse);

		if (!this.#lenis?.value) return;
		this.#scrollVelocity = this.#lenis.value.velocity * 0.01;
	}

	resize(_width: number, _height: number) {

	}

	dispose() {
		GLViewport.#instances.delete(this.#key);
	}

	get width() {
		return this.#width.value;
	}

	get height() {
		return this.#height.value;
	}

	get pHeight() {
		return this.height * (1 + this.#padding * 2);
	}

	get aspect(): number {
		return this.width / this.height;
	}

	get uvPosition(): IPoint {
		return {
			x: this.#x.value / Math.max(1, this.width),
			y: 1 - this.#y.value / Math.max(1, this.height),
		};
	}

	get mouse(): Vector2 {
		return this.#mouse;
	}

	get pointer(): Vector2 {
		this.#pointer.set(
			((this.#x.value - 0) / this.width) * 2 - 1,
			-(((this.#y.value - this.#canvasTop) / this.pHeight) * 2 - 1),
		);

		return this.#pointer;
	}

	get glPosition(): IPoint {
		return {
			x: this.#x.value / Math.max(1, this.width),
			y: 1 - (this.#y.value + this.height * this.#padding) / Math.max(1, this.pHeight),
		};
	}

	get scrollVelocity() {
		return this.#scrollVelocity;
	}

	get padding(): number {
		return this.#padding;
	}

	set canvasTop(value: number) {
		this.#canvasTop = value;
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLViewport.getInstance().dispose();
	});
}
