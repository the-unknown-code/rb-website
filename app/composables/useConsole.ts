/**
 * Logs messages to the browser console only on the client.
 *
 * Logging is enabled automatically during development. In production,
 * logging is disabled unless `runtimeConfig.public.forceConsole` is set
 * to `true`, allowing console output for debugging.
 *
 * @author Andrea Giuffrida
 * @param {...unknown[]} args - Values to print to the console.
 */

export const useConsole = (...args: unknown[]) => {
	const { public: app } = useRuntimeConfig();

	if (import.meta.client && (import.meta.dev || app.forceConsole)) {
		console.log(...args);
	}
};
