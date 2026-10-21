import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import type { Directive } from 'vue';
import { useInView } from '../composables/useInView';
import { GSAPEase } from '~/libs/gsap/const';

gsap.registerPlugin(SplitText);

const reveals = new WeakMap<HTMLElement, () => void>();

interface LetterRevealOptions {
	duration?: number;
	delay?: number;
	stagger?: number;
	blur?: boolean;
}

export const letterReveal: Directive<HTMLElement, LetterRevealOptions | undefined> = {
	getSSRProps(binding) {
		return {
			style: {
				opacity: 0.1,
				...(binding.value?.blur ? { filter: 'blur(4px)' } : {}),
			},
		};
	},
	beforeMount(element, binding) {
		element.style.opacity = '0.1';
		if (binding.value?.blur)
			element.style.filter = 'blur(4px)';
	},
	mounted(element, binding) {
		const { duration = 1, delay = 0, stagger = 0.025, blur = false } = binding.value ?? {};
		const split = SplitText.create(element, { type: 'words, chars' });
		gsap.set(split.words, { whiteSpace: 'nowrap' });
		const startParams = { opacity: 0.1, ...(blur ? { filter: 'blur(4px)' } : {}) };
		const endParams = { ease: GSAPEase.SLOW_IN_OUT, opacity: 1, duration, delay, stagger, ...(blur ? { filter: 'blur(0px)' } : {}), paused: true };

		gsap.set(split.chars, startParams);
		element.style.removeProperty('opacity');
		if (blur)
			element.style.removeProperty('filter');
		const tween = gsap.fromTo(split.chars,
			startParams,
			endParams,
		);
		const { stop } = useInView(element, () => tween.play(), {
			threshold: 0.2,
			once: true,
		});

		reveals.set(element, () => {
			stop();
			tween.kill();
			split.revert();
		});
	},
	unmounted(element) {
		reveals.get(element)?.();
		reveals.delete(element);
	},
};
