import type { MaybeElementRef } from '@vueuse/core';

/**
 * Observes whether an element enters the viewport using the
 * Intersection Observer API.
 *
 * Supports configurable `rootMargin` and `threshold`, and can optionally
 * stop observing after the element becomes visible for the first time.
 *
 * @author Andrea Giuffrida
 * @param target The target element or element ref to observe.
 * @param callback Optional callback invoked when the target enters the viewport.
 * @param options Configuration options for the observer.
 * @param options.rootMargin Margin around the root used when calculating visibility. Defaults to `'0px'`.
 * @param options.threshold Percentage of the target's visibility required to trigger. Defaults to `1`.
 * @param options.once Whether to stop observing after the element becomes visible once. Defaults to `false`.
 * @returns An object containing the reactive `isVisible` state.
 */

interface UseInViewOptions {
	rootMargin?: string;
	threshold?: number;
	once?: boolean;
}

export const useInView = (
	target: MaybeElementRef,
	callback?: () => void,
	{
		rootMargin = '0px',
		threshold = 1,
		once = false,
	}: UseInViewOptions = {},
) => {
	const { isVisible, stop } = useElementVisibility(target, {
		rootMargin,
		threshold,
		controls: true,
	});

	const stopTracking = () => {
		stop();
		unwatch();
	};

	const unwatch = watch(isVisible, visible => {
		if (!visible)
			return;

		callback?.();

		if (once) {
			stopTracking();
		}
	});

	tryOnBeforeUnmount(stopTracking);

	return { isVisible, stop: stopTracking };
};
