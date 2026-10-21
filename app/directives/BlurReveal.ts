import type { Directive } from 'vue';
import { useInView } from '~/composables/useInView';

const reveals = new WeakMap<HTMLElement, () => void>();

export const blurReveal: Directive<HTMLElement> = {
	getSSRProps() {
		return {
			style: {
				filter: 'blur(8px)',
				transition: 'filter .8s var(--ease-in-out-circ)',
			},
		};
	},
	beforeMount(element) {
		element.style.setProperty('filter', 'blur(8px)');
		element.style.setProperty('transition', 'filter .8s var(--ease-in-out-circ)');
	},
	mounted(element) {
		element.style.setProperty('filter', 'blur(8px)');
		element.style.setProperty('transition', 'filter .8s var(--ease-in-out-circ)');

		const { stop } = useInView(element, () => {
			element.style.setProperty('filter', 'blur(0)');
		}, {
			threshold: 0.2,
			once: true,
		});

		reveals.set(element, () => {
			stop();
			element.style.removeProperty('filter');
			element.style.removeProperty('transition');
		});
	},
	unmounted(element) {
		reveals.get(element)?.();
		reveals.delete(element);
	},
};
