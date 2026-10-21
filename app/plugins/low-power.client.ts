/**
 * -----------------------------------------------------------------------------
 * @file low-power.client
 * @description
 * Initializes the global low power mode detector on the client and synchronizes
 * its state with the application store. The detector observes browser signals
 * such as battery status, reduced motion preference, Save-Data, and rendering
 * performance to estimate whether the device is likely operating in a low-power
 * state.
 *
 * File: plugins/low-power.client.ts
 *
 * @author Andrea Giuffrida
 * @created 2026-07-19
 * -----------------------------------------------------------------------------
 */

import useAppStore from '~/store/useAppStore';

// plugins/low-power.client.ts
export default defineNuxtPlugin(() => {
	const $store = useAppStore();
	const { isLikelyLowPower } = useLowPowerMode();

	watchImmediate(isLikelyLowPower, v => {
		$store.site.isLowPowerMode = v;
	});
});
