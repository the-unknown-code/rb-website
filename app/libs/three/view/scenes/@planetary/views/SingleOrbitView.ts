import { Vector3 } from 'three';
import AbstractOrbitView, { type ViewCamera } from './AbstractOrbitView';

export default class SingleOrbitView extends AbstractOrbitView {
	readonly name = 'single' as const;
	readonly camera: ViewCamera = {
		position: new Vector3(0, 0, 20),
		target: new Vector3(),
		up: new Vector3(-Math.PI / 2, -1, 0),
	};

	planetPosition(index: number, count: number, time: number): Vector3 {
		const phase = (index / count) * Math.PI * 2 + time * 0.44;
		return this.pointAt(phase);
	}

	guidePosition(progress: number): Vector3 {
		return this.pointAt(progress * Math.PI * 2);
	}

	private pointAt(phase: number): Vector3 {
		// A real 3D circle. It looks elliptical only because it is tilted to camera.
		const radius = 6.2;
		const visibleMinorRadius = 2.35;
		const depthRadius = Math.sqrt(radius ** 2 - visibleMinorRadius ** 2);
		return new Vector3(
			Math.cos(phase) * radius,
			Math.sin(phase) * visibleMinorRadius,
			Math.sin(phase) * depthRadius,
		);
	}
}
