import { createSharedComposable } from '@vueuse/core';
import useAppStore from '~/store/useAppStore';

/**
 * Shared composable for controlling the global page transition state.
 *
 * Provides helper methods to start and end transitions while exposing
 * the current transition state as a reactive computed ref.
 *
 * Internally delegates to the application store, ensuring that
 * `site.transition` and related state (e.g. `site.enabled`) remain synchronized.
 *
 * @returns An object containing the transition state and control methods.
 *
 * @author Andrea Giuffrida
 */
export const useTransition = createSharedComposable(() => {
	const $store = useAppStore();

	const isTransition = computed(() => $store.site.transition.active);

	/**
	 * Sets the transition state and resolves after the specified duration.
	 */
	const setTransition = (enabled: boolean, duration = 0): Promise<void> => {
		if (import.meta.client) {
			document.documentElement.classList.toggle('is-page-transitioning', enabled);
		}

		$store.setTransition(enabled);

		if (duration <= 0) {
			return Promise.resolve();
		}

		return new Promise(resolve => {
			setTimeout(resolve, duration);
		});
	};

	const transitionStart = (duration: number = $store.site.transition.startDelay) => setTransition(true, duration);
	const transitionEnd = (duration: number = $store.site.transition.endDelay) => setTransition(false, duration);

	return {
		isTransition,
		transitionStart,
		transitionEnd,
	};
});
