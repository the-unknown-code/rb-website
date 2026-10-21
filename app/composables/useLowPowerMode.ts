/**
 * @file useLowPowerMode.ts
 * @description Vue composable for estimating whether the current device is
 * likely operating in a low-power or resource-constrained state.
 *
 * The composable combines multiple browser signals, including:
 * - Battery level and charging status (Battery Status API)
 * - Data Saver preference (Network Information API)
 * - Reduced motion accessibility preference
 * - Runtime FPS sampling
 * - Hardware concurrency
 * - Device memory
 *
 * These signals are weighted to produce a confidence score and a boolean
 * indicating whether the device is likely in low power mode.
 *
 * @author Andrea Giuffrida
 * @created 2026-07-21
 */

import Tempus from 'tempus';

interface IPowerSignals {
	batterySupported: boolean;
	batteryLevel: number | null;
	batteryCharging: boolean | null;
	saveData: boolean;
	reducedMotion: boolean;
	fps: number | null;
	fpsRatio: number | null;
	hardwareConcurrency: number;
	deviceMemory: number | null;
}

interface INavigatorWithDeviceMemory extends Navigator {
	deviceMemory?: number;
}

interface IBatteryManager extends EventTarget {
	readonly charging: boolean;
	readonly level: number;

	addEventListener(
		type: 'levelchange' | 'chargingchange',
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
}

interface INavigatorWithBattery extends Navigator {
	getBattery?(): Promise<IBatteryManager>;
}

interface INetworkInformation extends EventTarget {
	readonly saveData: boolean;

	addEventListener(
		type: 'change',
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
}

interface INavigatorWithConnection extends Navigator {
	connection?: INetworkInformation;
}

export const useLowPowerMode = (confidenceRatio: number = 0.5) => {
	const signals = reactive<IPowerSignals>({
		batterySupported: false,
		batteryLevel: null,
		batteryCharging: null,
		saveData: false,
		reducedMotion: false,
		fps: null,
		fpsRatio: null,
		hardwareConcurrency: navigator.hardwareConcurrency ?? 4,
		deviceMemory: (navigator as INavigatorWithDeviceMemory).deviceMemory ?? null,
	});

	const confidence = ref(0);
	const isLikelyLowPower = computed(() => confidence.value >= confidenceRatio);

	let unsubscribeRaf: ReturnType<typeof Tempus.add> = undefined;

	const recompute = () => {
		let score = 0;
		let weight = 0;

		if (signals.batterySupported && signals.batteryLevel !== null) {
			weight += 3;

			if (signals.batteryLevel < 0.2 && !signals.batteryCharging) {
				score += 3;
			}
			else if (signals.batteryLevel < 0.3 && !signals.batteryCharging) {
				score += 1.5;
			}
		}

		weight += 1;
		if (signals.saveData) score += 1;

		weight += 1;
		if (signals.reducedMotion) score += 0.5;

		if (signals.fpsRatio !== null) {
			weight += 3;

			if (signals.fpsRatio < 0.6) {
				score += 3;
			}
			else if (signals.fpsRatio < 0.85) {
				score += 1.5;
			}
		}

		confidence.value = weight > 0 ? Math.min(score / weight, 1) : 0;
	};

	const checkBattery = async () => {
		const nav = navigator as INavigatorWithBattery;

		if (!nav.getBattery) return;

		signals.batterySupported = true;

		const battery = await nav.getBattery();

		const update = () => {
			signals.batteryLevel = battery.level;
			signals.batteryCharging = battery.charging;
			recompute();
		};

		update();

		battery.addEventListener('levelchange', update);
		battery.addEventListener('chargingchange', update);
	};

	const checkSaveData = () => {
		const conn = (navigator as INavigatorWithConnection).connection;

		if (!conn) return;

		signals.saveData = conn.saveData;

		conn.addEventListener('change', () => {
			signals.saveData = conn.saveData;
			recompute();
		});
	};

	const checkReducedMotion = () => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

		signals.reducedMotion = mq.matches;

		mq.addEventListener('change', e => {
			signals.reducedMotion = e.matches;
			recompute();
		});
	};

	const measureFps = (sampleFrames = 60) => {
		let frames = 0;
		let start: number | null = null;
		const expected = 60;

		unsubscribeRaf = Tempus.add(({ time }: { time: number }) => {
			if (start === null) start = time;

			frames++;

			if (frames >= sampleFrames) {
				const elapsed = time - start;
				const fps = (frames / elapsed) * 1000;

				signals.fps = Math.round(fps);
				signals.fpsRatio = fps / expected;

				recompute();

				unsubscribeRaf?.();
				unsubscribeRaf = undefined;
			}
		});
	};

	tryOnMounted(() => {
		checkBattery();
		checkSaveData();
		checkReducedMotion();
		measureFps();
	});

	tryOnBeforeUnmount(() => {
		unsubscribeRaf?.();
		unsubscribeRaf = undefined;
	});

	return {
		signals: readonly(signals),
		confidence: readonly(confidence),
		isLikelyLowPower,
	};
};
