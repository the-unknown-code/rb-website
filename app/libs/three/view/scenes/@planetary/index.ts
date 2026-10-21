import { Pane } from 'tweakpane';
import GLAbstractScene from '../AbstractScene';
import { ISceneDefaults } from '~/libs/three/types';
import { Manifest } from './manifest';
import OPlanet from './objects/planet';
import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three';
import { ViewTransition, type ViewName } from './views/ViewTransition';
import type AbstractOrbitView from './views/AbstractOrbitView';
import type { ViewCamera } from './views/AbstractOrbitView';
import SingleOrbitView from './views/SingleOrbitView';
import MoleculeOrbitView from './views/MoleculeOrbitView';
import ArcOrbitView from './views/FrontView';

export default class PlanetaryScene extends GLAbstractScene {
	static override addToMain = true;
	static override manifest = Manifest;

	#transition = new ViewTransition('single');
	#views: Record<ViewName, AbstractOrbitView> = {
		single: new SingleOrbitView(),
		molecule: new MoleculeOrbitView(),
		arc: new ArcOrbitView(),
	};

	#tempV3 = new Vector3();
	#currentCameraTarget = new Vector3();
	#sourceCamera = new Vector3();
	#sourceTarget = new Vector3();
	#sourceUp = new Vector3(0, 1, 0);
	#sourcePlanetPositions: Vector3[] = [];
	#sourceGuidePoints: Vector3[][] = [];
	#sourceGuideOpacities: number[] = [];

	#planetCount = 10;
	#planets: OPlanet[];
	#guides: Line[];

	constructor() {
		super({
			...ISceneDefaults,
			id: 'test',
		});

		this.#planets = this.#createPlanets(this.#planetCount);
		this.#guides = this.#createGuides();
		this.camera.position.set(0, 0, 5);
		this.#currentCameraTarget.copy(this.#views.single.camera.target);

		const pane = new Pane({ title: 'Planetary Views', expanded: true });
		const viewFolder = pane.addFolder({ title: 'Views' });
		const viewButtons: Record<ViewName, string> = {
			single: 'Single',
			molecule: 'Molecule',
			arc: 'Arc',
		};

		Object.entries(viewButtons).forEach(([view, label]) => {
			viewFolder.addButton({ title: label }).on('click', () => {
				this.#setView(view as ViewName);
			});
		});
	}

	#setView(view: ViewName): void {
		if (view === this.#transition.destination && this.#transition.progress === 1) return;

		// Save exactly what is on screen before selecting the next destination.
		this.#captureCurrentState();
		this.#transition.change(view);
	}

	#captureCurrentState(): void {
		this.#sourceCamera.copy(this.camera.position);
		this.#sourceTarget.copy(this.#currentCameraTarget);
		this.#sourceUp.copy(this.camera.up);
		this.#sourcePlanetPositions = this.#planets.map(planet => planet.position.clone());
		this.#sourceGuideOpacities = this.#guides.map(line => (line.material as LineBasicMaterial).opacity);
		this.#sourceGuidePoints = this.#guides.map(line => {
			const position = line.geometry.getAttribute('position');
			if (!position) return [];
			return Array.from({ length: position.count }, (_, index) => new Vector3().fromBufferAttribute(position, index));
		});
	}

	#createPlanets(count: number): OPlanet[] {
		return Array.from({ length: count }, () => {
			const planet = new OPlanet();
			this.add(planet);
			return planet;
		});
	}

	#createGuides(): Line[] {
		return Array.from({ length: 3 }, () => {
			const line = new Line(
				new BufferGeometry(),
				new LineBasicMaterial({ color: 0x8aa7c8, transparent: true, opacity: 0.62 }),
			);
			this.add(line);
			return line;
		});
	}

	#updateCamera(from: ViewCamera, to: ViewCamera, blend: number): void {
		const startPosition = this.#sourcePlanetPositions.length ? this.#sourceCamera : from.position;
		const startTarget = this.#sourcePlanetPositions.length ? this.#sourceTarget : from.target;
		const startUp = this.#sourcePlanetPositions.length ? this.#sourceUp : from.up;

		this.camera.position.lerpVectors(startPosition, to.position, blend);
		this.camera.up.lerpVectors(startUp, to.up, blend).normalize();
		this.#currentCameraTarget.copy(this.#tempV3.lerpVectors(startTarget, to.target, blend));
		this.camera.lookAt(this.#currentCameraTarget);
	}

	#updatePlanets(from: AbstractOrbitView, to: AbstractOrbitView, blend: number, time: number): void {
		for (let index = 0; index < this.#planets.length; index++) {
			const planet = this.#planets[index] as OPlanet;
			const start = this.#sourcePlanetPositions[index] ?? from.planetPosition(index, this.#planetCount, time);
			const end = to.planetPosition(index, this.#planetCount, time);
			planet.position.lerpVectors(start, end, blend);
		}
	}

	#updateGuides(from: AbstractOrbitView, to: AbstractOrbitView, blend: number): void {
		for (let ring = 0; ring < this.#guides.length; ring++) {
			const line = this.#guides[ring] as Line;
			const isShown = ring < to.guideCount();
			const sourceOpacity = this.#sourceGuideOpacities[ring] ?? (ring < from.guideCount() ? 0.62 : 0);

			line.visible = isShown || sourceOpacity > 0.01;
			(line.material as LineBasicMaterial).opacity = sourceOpacity + ((isShown ? 0.62 : 0) - sourceOpacity) * blend;

			const points: Vector3[] = [];
			for (let step = 0; step <= 120; step++) {
				const progress = step / 120;
				const start = this.#sourceGuidePoints[ring]?.[step]
					?? from.guidePosition(progress, Math.min(ring, from.guideCount() - 1));
				const end = to.guidePosition(progress, Math.min(ring, to.guideCount() - 1));
				points.push(start.clone().lerp(end, blend));
			}
			line.geometry.dispose();
			line.geometry = new BufferGeometry().setFromPoints(points);
		}
	}

	override update(_time: number, _dt: number): void {
		this.#transition.update(_dt * 0.005);
		const blend = this.#transition.progress;
		const from = this.#views[this.#transition.source];
		const to = this.#views[this.#transition.destination];

		this.#updateCamera(from.camera, to.camera, blend);
		this.#updatePlanets(from, to, blend, _time * 0.001);
		this.#updateGuides(from, to, blend);
	}
}
