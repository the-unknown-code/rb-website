import type { Camera } from 'three';
import { Object3D } from 'three';
import type { ShallowRef } from 'vue';
import { IObjectDefaults, type IObject } from '../../types';
import GLViewport from '../../utils/Viewport';
import GLCache from '../../utils/Cache';

/**
 * @description Base interactive object for the WebGL engine.
 *
 * Extends Three.js `Object3D` with support for:
 * - DOM element tracking and viewport synchronisation.
 * - Visibility-based enable/disable behaviour.
 * - Pointer interaction through the engine raycaster.
 * - Per-frame update lifecycle.
 *
 * Objects can optionally track a DOM element to automatically update their
 * world position and expose a normalized scroll progress value. When
 * `interactive` is enabled, subclasses can react to pointer events by
 * overriding the provided lifecycle methods.
 *
 * Pointer lifecycle:
 * - `onPointerEnter()`
 * - `onPointerLeave()`
 * - `onPointerMove()`
 *
 * Update lifecycle:
 * - `onUpdate(time, dt)`
 *
 * @author Andrea Giuffrida
 */

export default abstract class AbstractObject extends Object3D {
	protected readonly params: IObject;

	readonly #cache = GLCache.getInstance();
	readonly #viewport = GLViewport.getInstance();

	#enabled: boolean = true;
	#hovered: boolean = false;
	#progress: number = 0;
	#camera?: Camera;

	#element = ref<HTMLElement | null>(null);
	#rect?: ReturnType<typeof useElementBounding>;
	#inView?: ShallowRef<boolean>;

	#stopTrackingWatch?: () => void;
	#stopListeners: Array<() => void> = [];

	constructor(params: IObject = IObjectDefaults) {
		super();

		this.params = params;

		if (params.tracking.enabled) {
			this.initializeTracking();
		}
	}

	protected async initializeTracking() {
		await nextTick();

		this.#element.value = document.getElementById(this.params.tracking.id);

		if (!this.#element.value) {
			console.warn(
				`AbstractObject: element "${this.params.tracking.id}" not found.`,
			);
			return;
		}

		this.#rect = useElementBounding(this.#element);
		this.#inView = useElementVisibility(this.#element);

		this.#stopTrackingWatch = watchImmediate(this.#inView, visible => {
			this.#enabled = visible;
		});
	}

	/**
	 * Synchronizes the object's position with its tracked DOM element.
	 */
	protected updatePosition() {
		if (!this.#rect) return;

		const { width: screenWidth, height: screenHeight } = this.#viewport;
		const { width, height, left, top } = this.#rect;

		const centerX = left.value + width.value * 0.5;
		const centerY = top.value + height.value * 0.5;

		this.position.set(
			centerX - screenWidth * 0.5,
			-(centerY - screenHeight * 0.5),
			0,
		);

		const range = screenHeight * 0.5 + height.value * 0.5;
		const distance = centerY - screenHeight * 0.5;
		this.#progress = 1 - Math.abs(Math.max(-1, Math.min(1, distance / range)));
	}

	protected updateRaycast() {
		const hit = this.#viewport.raycast(this);

		if (hit) {
			this.#hovered = hit !== null;

			if (hit !== null) {
				this.onPointerEnter();
			}
			else {
				this.onPointerLeave();
			}
		}

		if (hit) {
			this.onPointerMove();
		}
	}

	update(time: number, dt: number) {
		if (!this.#enabled) {
			return;
		}

		this.onUpdate(time, dt);

		if (this.params.tracking.enabled) {
			this.updatePosition();
		}

		if (this.params.interactive) {
			this.updateRaycast();
		}
	}

	setCamera(camera: Camera) {
		this.#camera = camera;
	}

	enable() {
		this.#enabled = true;
	}

	disable() {
		this.#enabled = false;
	}

	dispose() {
		this.#stopTrackingWatch?.();

		this.#stopListeners.forEach(stop => stop());
		this.#stopListeners.length = 0;

		this.#element.value = null;
		this.#rect = undefined;
		this.#inView = undefined;
	}

	/**
	 * Called every frame while the object is enabled.
	 */
	protected onUpdate(_time: number, _dt: number) {}

	/**
	 * Called once when the pointer enters the object.
	 */
	protected onPointerEnter() {}

	/**
	 * Called once when the pointer leaves the object.
	 */
	protected onPointerLeave() {}

	/**
	 * Called every frame while the pointer hovers the object.
	 */
	protected onPointerMove() {}

	get cache() {
		return this.#cache;
	}

	get viewport() {
		return this.#viewport;
	}

	get camera() {
		return this.#camera as Camera;
	}

	get enabled() {
		return this.#enabled;
	}

	get hovered() {
		return this.#hovered;
	}

	get progress() {
		return this.#progress;
	}
}
