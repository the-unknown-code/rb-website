import { Vector3 } from 'three';
import AbstractOrbitView, { type ViewCamera } from './AbstractOrbitView';

export default class ArcOrbitView extends AbstractOrbitView {
	readonly name = 'arc' as const;
	readonly camera: ViewCamera = {
		position: new Vector3(0, 1.5, 15),
		target: new Vector3(0, -1, 0),
		up: new Vector3(0, -1, 0),
	};

	planetPosition(index: number, count: number, time: number): Vector3 {
		return this.pointAt((index / count) * Math.PI * 2 + time * 0.44);
	}

	guidePosition(progress: number): Vector3 {
		return this.pointAt(progress * Math.PI);
	}

	private pointAt(phase: number): Vector3 {
		const radius = 6.8;
		return new Vector3(Math.cos(phase) * radius, 0, Math.sin(phase) * radius);
	}
}
