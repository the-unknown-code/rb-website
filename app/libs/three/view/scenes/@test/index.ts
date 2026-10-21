import GLAbstractScene from '../AbstractScene';
import { ISceneDefaults } from '~/libs/three/types';
import OSphere from './objects/sphere';
import { Manifest } from './manifest';

export default class TestScene extends GLAbstractScene {
	static override addToMain = false;
	static override manifest = Manifest;
	#sphere!: OSphere;

	constructor() {
		super({
			...ISceneDefaults,
			id: 'test',
		});
	}

	override initialize() {
		super.initialize();

		this.#sphere = new OSphere();
		this.add(this.#sphere);
	}

	override update(_time: number, _dt: number): void {
		this.#sphere.update(_time, _dt);
	}
}
