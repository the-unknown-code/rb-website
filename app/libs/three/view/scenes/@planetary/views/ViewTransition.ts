export type ViewName = 'single' | 'molecule' | 'arc';

export class ViewTransition {
	private elapsed: number = 1.55;
	private from: ViewName;
	private to: ViewName;

	constructor(initialView: ViewName, readonly duration = 2) {
		this.from = initialView;
		this.to = initialView;
	}

	change(to: ViewName) {
		this.from = this.to;
		this.to = to;
		this.elapsed = 0;
	}

	update(dt: number) {
		this.elapsed = Math.min(this.duration, this.elapsed + dt);
	}

	get source(): ViewName {
		return this.from;
	}

	get destination(): ViewName {
		return this.to;
	}

	get progress(): number {
		const t = Math.min(1, this.elapsed / this.duration);
		// Classic ease-in-out (smoothstep)
		return t < 0.5
			? 2 * t * t
			: 1 - Math.pow(-2 * t + 2, 2) / 2;
	}
}
