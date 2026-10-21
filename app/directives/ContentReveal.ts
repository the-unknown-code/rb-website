import gsap from 'gsap';
import type { Directive } from 'vue';
import { useInView } from '~/composables/useInView';
import { GSAPEase } from '~/libs/gsap/const';

interface ContentRevealOptions {
	x?: number | string;
	y?: number | string;
	opacity?: number;
	duration?: number;
}

const reveals = new WeakMap<HTMLElement, () => void>();

const cssLength = (value: number | string) => typeof value === 'number' ? `${value}px` : value;

const setInitialState = (element: HTMLElement, binding: ContentRevealOptions | undefined) => {
	const { x = 0, y = '20%', opacity = 0 } = binding ?? {};
	element.style.opacity = String(opacity);
	element.style.transform = `translate(${cssLength(x)}, ${cssLength(y)})`;
};

export const contentReveal: Directive<HTMLElement, ContentRevealOptions | undefined> = {
	getSSRProps(binding) {
		const { x = 0, y = '20%', opacity = 0 } = binding.value ?? {};
		return {
			style: {
				opacity,
				transform: `translate(${cssLength(x)}, ${cssLength(y)})`,
			},
		};
	},
	beforeMount(element, binding) {
		setInitialState(element, binding.value);
	},
	mounted(element, binding) {
		const { x = 0, y = '20%', opacity = 0, duration = 1 } = binding.value ?? {};

		// Replace the SSR transform with GSAP's transform before the next paint.
		element.style.removeProperty('transform');
		gsap.set(element, { x, y, opacity });
		const tween = gsap.to(element, {
			x: 0,
			y: 0,
			opacity: 1,
			duration,
			ease: GSAPEase.SLOW_IN_OUT,
			paused: true,
		});
		const { stop } = useInView(element, () => tween.play(), {
			threshold: 0.2,
			once: true,
		});

		reveals.set(element, () => {
			stop();
			tween.kill();
		});
	},
	unmounted(element) {
		reveals.get(element)?.();
		reveals.delete(element);
	},
};
