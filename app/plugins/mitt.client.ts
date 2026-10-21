import mitt, { type Emitter } from 'mitt';

/**
 * Creates a global event bus powered by mitt.
 *
 * @author Andrea Giuffrida
 */

export default defineNuxtPlugin(() => {
	const eventBus = mitt();

	return {
		provide: {
			eventBus,
		},
	};
});

declare module '#app' {
	interface NuxtApp {
		$eventBus: Emitter<Record<string, unknown>>;
	}
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$eventBus: Emitter<Record<string, unknown>>;
	}
}
