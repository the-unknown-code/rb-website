import type { Vector3 } from 'three';
import type { ViewName } from './ViewTransition';

export type ViewCamera = {
	position: Vector3;
	target: Vector3;
	up: Vector3;
};

export default abstract class AbstractOrbitView {
	abstract readonly name: ViewName;
	abstract readonly camera: ViewCamera;

	abstract planetPosition(index: number, count: number, time: number): Vector3;
	abstract guidePosition(progress: number, ring: number): Vector3;

	planetOpacity(): number {
		return 1;
	}

	guideCount(): number {
		return 1;
	}
}
