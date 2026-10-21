import type { Emitter } from 'mitt';

interface UseEventBusOptions {
	once?: boolean;
}

/**
 * Provides a typed interface for interacting with the global event bus.
 *
 * When an event and callback are provided, the listener is automatically
 * registered and removed when the current component is unmounted.
 *
 * @author Andrea Giuffrida
 * @template Events The application's event map.
 */

export const useEventBus = <
	Events extends Record<string, unknown> = Record<string, unknown>,
	K extends keyof Events = keyof Events,
>(
	event?: K,
	callback?: (payload: Events[K]) => void,
	{ once = false }: UseEventBusOptions = {},
) => {
	const { $eventBus } = useNuxtApp();
	const bus = $eventBus as Emitter<Events>;

	let handler: ((payload: Events[K]) => void) | undefined;

	if (event && callback) {
		handler = (payload: Events[K]) => {
			callback(payload);

			if (once) {
				bus.off(event, handler!);
			}
		};

		bus.on(event, handler);

		tryOnBeforeUnmount(() => {
			bus.off(event, handler!);
		});
	}

	return {
		emit: bus.emit.bind(bus),
	};
};
