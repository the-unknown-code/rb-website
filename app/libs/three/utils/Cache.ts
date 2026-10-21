/**
 * @description Singleton in-memory cache for storing and sharing runtime data
 * across the WebGL engine.
 *
 * Each cache instance is uniquely identified by a namespace (prefix),
 * allowing multiple isolated caches to coexist. Values are stored using
 * generic key-value pairs and can be retrieved, updated, removed, or
 * cleared through a simple API.
 *
 * Cache instances are managed internally through a singleton registry and
 * are automatically removed from the registry when {@link clear} is called,
 * allowing them to be garbage collected and recreated on demand.
 *
 * @author Andrea Giuffrida
 */

import type { Texture } from 'three';

export default class GLCache {
	static #instances = new Map<string, GLCache>();

	static getInstance(prefix = 'three') {
		if (!this.#instances.has(prefix)) {
			this.#instances.set(prefix, new GLCache(prefix));
		}

		return this.#instances.get(prefix)!;
	}

	readonly #cache = new Map<string, unknown>();
	readonly #prefix: string;

	private constructor(prefix: string) {
		this.#prefix = prefix;
	}

	setItem<T>(key: string, value: T): void {
		this.#cache.set(`${this.#prefix}:${key}`, value);
	}

	getItem<T>(key: string): T | undefined {
		return this.#cache.get(`${this.#prefix}:${key}`) as T | undefined;
	}

	getTexture(key: string): Texture {
		return this.#cache.get(`${this.#prefix}:${key}`) as Texture;
	}

	hasItem(key: string): boolean {
		return this.#cache.has(`${this.#prefix}:${key}`);
	}

	removeItem(key: string): boolean {
		return this.#cache.delete(`${this.#prefix}:${key}`);
	}

	/**
 * @description Clears all cached entries and removes this cache instance
 * from the singleton registry, allowing it to be garbage collected and
 * recreated on the next call to {@link GLCache.getInstance}.
 */
	dispose(): void {
		this.#cache.clear();
		GLCache.#instances.delete(this.#prefix);
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLCache.getInstance().dispose();
	});
}
