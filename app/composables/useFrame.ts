import Tempus, { type TempusCallback } from 'tempus';

/**
 * Registers a callback with Tempus and automatically unsubscribes when the
 * component is unmounted.
 *
 * The callback is executed on every animation frame, receiving the current
 * time and the delta time since the previous frame.
 *
 * @author Andrea Giuffrida
 * @param callback Function invoked on each animation frame.
 * @param priority Execution priority. Higher values run earlier. Defaults to `0`.
 */

export const useFrame = (
	callback: TempusCallback,
	priority = 0,
) => {
	let unsubscribe: (() => void) | undefined;

	tryOnMounted(() => {
		unsubscribe = Tempus.add(callback, { priority });
	});

	tryOnBeforeUnmount(() => {
		unsubscribe?.();
	});

	return {
		stop: () => unsubscribe?.(),
	};
};
