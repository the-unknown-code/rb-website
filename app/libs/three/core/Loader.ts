import type { WebGLRenderer } from 'three';
import {
	LoadingManager,
	SRGBColorSpace,
	Texture,
	VideoTexture,
} from 'three';

import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

import GLCache from '../utils/Cache';
import WorkerPool from '../workers/pool';
import { TManifestItemType, type IManifest, type IManifestItem } from '../types';

/**
 * @description Singleton asset loader responsible for asynchronously loading,
 * caching and managing GPU resources used throughout the rendering engine.
 *
 * The loader provides a unified API for:
 * - Loading images as `Texture` objects using a dedicated worker pool.
 * - Loading videos as `VideoTexture` instances.
 * - Loading GLTF/GLB models with support for DRACO, Meshopt and KTX2 compression.
 * - Deduplicating concurrent asset requests to avoid duplicate network fetches.
 * - Caching loaded assets for efficient reuse across the application.
 *
 * A single `LoadingManager` coordinates all Three.js asset loaders, while
 * `GLCache` stores previously loaded resources and `WorkerPool` performs
 * expensive image decoding off the main thread whenever possible.
 *
 * This class follows a keyed singleton pattern, allowing multiple isolated
 * loader instances when required (for example different rendering contexts),
 * while still sharing a consistent loading pipeline.
 *
 * @author Andrea Giuffrida
 */

export default class GLLoader {
	static readonly #instances = new Map<string, GLLoader>();

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
				'GLLoader must be initialized with a WebGLRenderer.',
			);
		}

		const loader = new GLLoader(key, renderer);

		this.#instances.set(key, loader);

		return loader;
	}

	readonly #key: string;
	readonly #cache: GLCache;
	readonly #workers: WorkerPool;
	readonly #manager: LoadingManager;

	readonly #gltfLoader: GLTFLoader;
	readonly #dracoLoader: DRACOLoader;
	readonly #ktx2Loader: KTX2Loader;

	readonly #pending = new Map<string, Promise<unknown>>();

	private constructor(
		key: string,
		renderer: WebGLRenderer,
	) {
		this.#key = key;

		this.#cache = GLCache.getInstance();
		this.#workers = new WorkerPool();
		this.#manager = new LoadingManager();

		this.#dracoLoader = new DRACOLoader(this.#manager);
		this.#dracoLoader.setDecoderPath('/libs/draco/');

		this.#ktx2Loader = new KTX2Loader(this.#manager);
		this.#ktx2Loader.setTranscoderPath('/libs/basis/');
		this.#ktx2Loader.detectSupport(renderer);

		this.#gltfLoader = new GLTFLoader(this.#manager);
		this.#gltfLoader.setDRACOLoader(this.#dracoLoader);
		this.#gltfLoader.setMeshoptDecoder(MeshoptDecoder);
		this.#gltfLoader.setKTX2Loader(this.#ktx2Loader);
	}

	async loadTexture(url: string, cacheKey = `texture:${url}`): Promise<Texture> {
		const cached = this.#cache.getItem<Texture>(cacheKey);

		if (cached) {
			return cached;
		}

		const pending = this.#pending.get(cacheKey);

		if (pending) {
			return pending as Promise<Texture>;
		}

		const promise = this.#createTexture(url);

		this.#pending.set(cacheKey, promise);

		try {
			const texture = await promise;
			this.#cache.setItem(cacheKey, texture);

			console.log('cached key', cacheKey);

			return texture;
		}
		finally {
			this.#pending.delete(cacheKey);
		}
	}

	async #createTexture(url: string): Promise<Texture> {
		const bitmap = await this.#workers.execute<ImageBitmap>('image', { url });

		const texture = new Texture(bitmap);
		texture.colorSpace = SRGBColorSpace;
		texture.needsUpdate = true;

		return texture;
	}

	async loadVideoTexture(
		url: string,
	): Promise<VideoTexture> {
		const cacheKey = `video:${url}`;
		const cached = this.#cache.getItem<VideoTexture>(cacheKey);

		if (cached) {
			return cached;
		}

		const pending = this.#pending.get(cacheKey);

		if (pending) {
			return pending as Promise<VideoTexture>;
		}

		const promise = this.#createVideoTexture(url);

		this.#pending.set(cacheKey, promise);

		try {
			const texture = await promise;
			this.#cache.setItem(cacheKey, texture);

			return texture;
		}
		finally {
			this.#pending.delete(cacheKey);
		}
	}

	async #createVideoTexture(
		url: string,
	): Promise<VideoTexture> {
		const video = document.createElement('video');

		video.src = url;
		video.crossOrigin = 'anonymous';
		video.preload = 'auto';
		video.loop = true;
		video.muted = true;
		video.playsInline = true;

		await new Promise<void>((resolve, reject) => {
			video.onloadeddata = () => resolve();
			video.onerror = () =>
				reject(new Error(`Unable to load "${url}"`));
		});

		const texture = new VideoTexture(video);
		texture.colorSpace = SRGBColorSpace;

		return texture;
	}

	async loadGLTF(url: string, cacheKey = `gltf:${url}`): Promise<GLTF> {
		const cached = this.#cache.getItem<GLTF>(cacheKey);

		if (cached) {
			return cached;
		}

		const pending = this.#pending.get(cacheKey);

		if (pending) {
			return pending as Promise<GLTF>;
		}

		const promise = new Promise<GLTF>((resolve, reject) => {
			this.#gltfLoader.load(
				url,
				resolve,
				undefined,
				reject,
			);
		});

		this.#pending.set(cacheKey, promise);

		try {
			const gltf = await promise;
			this.#cache.setItem(cacheKey, gltf);

			return gltf;
		}
		finally {
			this.#pending.delete(cacheKey);
		}
	}

	async loadManifest(manifest: IManifest) {
		await Promise.all(
			manifest.map((item: IManifestItem) => {
				switch (item.type) {
					case TManifestItemType.TEXTURE:
						return this.loadTexture(`/textures/${item.src}`, `texture::${item.id}`);

					case TManifestItemType.MODEL:
						return this.loadGLTF(`/models/${item.src}`, `gltf::${item.id}`);

					default:
						throw new Error(
							`Unsupported manifest asset type: ${item.type}`,
						);
				}
			}),
		);
	}

	has(key: string) {
		return this.#cache.hasItem(key);
	}

	remove(key: string) {
		const asset = this.#cache.getItem<Texture | VideoTexture>(key);

		asset?.dispose();
		this.#cache.removeItem(key);
	}

	/**
	 * @description Disposes all internal loaders and removes the loader
	 * instance from the singleton registry.
	 */
	dispose() {
		this.#pending.clear();
		this.#workers.dispose();
		this.#dracoLoader.dispose();
		this.#ktx2Loader.dispose();

		GLLoader.#instances.delete(this.#key);
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLLoader.getInstance().dispose();
	});
}
