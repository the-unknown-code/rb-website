/**
 * @file platform.client.ts
 * @description
 * Initializes platform-related state for the application.
 *
 * This plugin:
 * - Detects the user's browser (Safari, Firefox).
 * - Detects whether the device is mobile.
 * - Watches media queries for mobile and tablet landscape orientations.
 * - Synchronizes platform information with the global Pinia application store.
 *
 * @author Andrea Giuffrida
 * @created 2026-07-19
 */

import useAppStore from '~/store/useAppStore';

export default defineNuxtPlugin(() => {
	const { public: { config } } = useRuntimeConfig();
	const { isMobile, isSafari, isFirefox } = useDevice();

	const $store = useAppStore();

	const isMobileLandscape = ref<boolean>(false);
	const isTabletLandscape = ref<boolean>(false);

	const mobileLandscapeMm = window.matchMedia(
		`(pointer: coarse) and (orientation: landscape) and (max-height: ${config.platform.mobileLandscapeMinWidth}px)`,
	);
	const tabletLandscapeMm = window.matchMedia(
		`(pointer: coarse) and (orientation: landscape) and (min-width: ${config.platform.tabletLandacapeMinWidth}px)`,
	);

	isMobileLandscape.value = mobileLandscapeMm.matches;
	isTabletLandscape.value = tabletLandscapeMm.matches;

	mobileLandscapeMm.addEventListener('change', e => (isMobileLandscape.value = e.matches));
	tabletLandscapeMm.addEventListener('change', e => (isTabletLandscape.value = e.matches));

	$store.platform.isMobile = isMobile;
	$store.platform.isSafari = isSafari;
	$store.platform.isFirefox = isFirefox;
	$store.platform.dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, config.three.maxDpr);

	const mobileMediaQuery = `(max-width: ${config.platform.desktopBreakpoint - 1}px)`;

	const online = useOnline();

	watchImmediate(
		[isMobileLandscape, isTabletLandscape, online],
		() => {
			$store.platform.isOnline = online.value;
			$store.platform.isMobileLandscape = isMobileLandscape.value;
			$store.platform.isTabletLandscape = isTabletLandscape.value;
			$store.platform.mobileMediaQuery = mobileMediaQuery;
		},
	);
});
