/**
 * Tracks window resize events and optionally executes a debounced callback
 * whenever the window dimensions change.
 *
 * @author Andrea Giuffrida
 * @param callback Optional callback invoked after a resize event.
 * @param debounce Debounce delay in milliseconds. Defaults to `40`.
 * @returns Reactive `width` and `height` refs from `useWindowSize()`.
 */

export const useResize = (
	callback?: (width: number, height: number) => void,
	debounce = 40,
	immediate: boolean = true,
) => {
	const { width, height } = useWindowSize();

	watch(
		[width, height],
		useDebounceFn(() => callback?.(width.value, height.value), debounce),
		{ immediate });

	return { width, height };
};
