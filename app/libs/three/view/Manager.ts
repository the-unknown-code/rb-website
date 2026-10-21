import GLMain from './Main';
import type GLAbstractScene from './scenes/AbstractScene';
import { IThreeOutput } from '~/libs/common/setup/three';
import type { IActiveScene } from '../types';

export default class GLManager {
	static readonly #instances = new Map<string, GLManager>();

	static getInstance(key = 'default') {
		let instance = this.#instances.get(key);

		if (!instance) {
			instance = new GLManager(key);
			this.#instances.set(key, instance);
		}

		return instance;
	}

	readonly #key: string;
	readonly #main = GLMain.getInstance();
	readonly #output: IThreeOutput;

	#scenes: GLAbstractScene[] = [];
	#activeScene?: GLAbstractScene;

	constructor(key: string) {
		const {
			public: { config },
		} = useRuntimeConfig();

		this.#key = key;
		this.#output = config.three.output as IThreeOutput;
	}

	add(scene: GLAbstractScene) {
		this.#scenes.push(scene);

		if (this.isOrtho) {
			this.#main.addToScene(scene);
		}
	}

	getSceneById(id: string) {
		return this.#scenes.find(scene => scene.id === id);
	}

	setActiveScene(id: string): boolean {
		const scene = this.getSceneById(id);

		if (!scene) {
			return false;
		}

		scene.enable();
		this.#activeScene = scene;
		return true;
	}

	update(time: number, dt: number) {
		for (const scene of this.#scenes) {
			scene.update(time, dt);
		}
	}

	resize(width: number, height: number, pHeight: number) {
		this.#main.resize(width, height, pHeight);

		for (const scene of this.#scenes) {
			scene.resize(width, height, pHeight);
		}
	}

	dispose() {
		GLManager.#instances.delete(this.#key);
	}

	get isOrtho() {
		return this.#output === IThreeOutput.ORTHO;
	}

	get activeScene(): IActiveScene {
		const scene = this.isOrtho
			? undefined
			: this.#activeScene;

		return {
			scene: scene?.scene ?? this.#main.scene,
			camera: scene?.camera ?? this.#main.camera,
		};
	}
}

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		GLManager.getInstance().dispose();
	});
}
