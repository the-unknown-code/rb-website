/**
 * @description Nuxt composable for accessing the shared Lenis instance.
 * Optionally registers a scroll event listener and automatically cleans it up
 * when the component is unmounted.
 *
 * @author Andrea Giuffrida
 */

import type Lenis from 'lenis';

type LenisScrollEvent = {
	scroll: number;
	limit: number;
	velocity: number;
	direction: number;
	progress: number;
};

type ScrollCallback = (e: LenisScrollEvent) => void;

export default function useLenis(callback?: ScrollCallback) {
	const lenis = inject<Ref<Lenis | null>>('lenis-instance');

	let cleanup: (() => void) | undefined;

	if (callback && lenis) {
		watchImmediate(
			lenis,
			instance => {
				cleanup?.();

				if (!instance) return;

				instance.on('scroll', callback);
				cleanup = () => instance.off('scroll', callback);
			},
		);
	}

	tryOnBeforeUnmount(() => {
		cleanup?.();
	});

	return lenis;
}
