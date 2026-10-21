/**
 * SSR-aware breakpoint composable.
 *
 * Uses the provided SSR width during server-side rendering to ensure
 * the rendered markup matches the initial client render, preventing
 * hydration mismatches. Once running on the client, it automatically
 * switches to the real browser window width and remains reactive to
 * viewport resize events.
 *
 * @author Andrea Giuffrida
 */

export const useBreakpoints = () => {
	const { public: app } = useRuntimeConfig();
	const ssrWidth = useSSRWidth() ?? app.config.platform.desktopBreakpoint;
	const { width: windowWidth } = useWindowSize();

	const width = computed(() =>
		import.meta.client
			? windowWidth.value
			: ssrWidth,
	);

	const isMobile = computed(() => width.value < app.config.platform.desktopBreakpoint);
	const isDesktop = computed(() => width.value >= app.config.platform.desktopBreakpoint);

	return {
		isMobile,
		isDesktop,
	};
};
