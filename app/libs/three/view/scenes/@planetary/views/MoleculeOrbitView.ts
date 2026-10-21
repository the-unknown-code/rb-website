import { Vector3 } from 'three';
import AbstractOrbitView, { type ViewCamera } from './AbstractOrbitView';

export default class MoleculeOrbitView extends AbstractOrbitView {
	readonly name = 'molecule' as const;
	readonly camera: ViewCamera = {
		position: new Vector3(0, 1.5, 20),
		target: new Vector3(),
		up: new Vector3(0, 1, 0),
	};

	planetPosition(index: number, count: number, time: number): Vector3 {
		const ring = index % 3;
		const phase = (index / count) * Math.PI * 2 + time * 0.44 + ring * 0.45;
		return this.pointAt(phase, ring);
	}

	guidePosition(progress: number, ring: number): Vector3 {
		return this.pointAt(progress * Math.PI * 2, ring);
	}

	override guideCount(): number {
		return 3;
	}

	private pointAt(phase: number, ring: number): Vector3 {
		const rotation = ring * Math.PI / 3;
		const radius = 5.25;
		const visibleMinorRadius = 1.9;
		const depthRadius = Math.sqrt(radius ** 2 - visibleMinorRadius ** 2);
		const x = Math.cos(phase) * radius;
		const y = Math.sin(phase) * visibleMinorRadius;

		return new Vector3(
			x * Math.cos(rotation) - y * Math.sin(rotation),
			x * Math.sin(rotation) + y * Math.cos(rotation),
			Math.sin(phase) * depthRadius,
		);
	}
}
