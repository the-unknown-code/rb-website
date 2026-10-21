import { defineStore } from 'pinia';
import type { ISbStoryData } from '@storyblok/js';

interface AppState {
	site: {
		menu: boolean;
		enabled: boolean;
		isLowPowerMode: boolean;
		theme: string;
		transition: {
			active: boolean;
			startDelay: number;
			endDelay: number;
		};
	};
	three: {
		active: boolean;
		ready: boolean;
	};
	platform: {
		isOnline: boolean;
		isMobile: boolean;
		isSafari: boolean;
		isFirefox: boolean;
		isMobileLandscape: boolean;
		isTabletLandscape: boolean;
		mobileMediaQuery: string;
		dpr: number;
	};
	params: Array<{ key: string; value: string }>;
	storyblok: {
		config: ISbStoryData<Record<string, unknown>> | null;
		viewMode: boolean;
	};
}

export default defineStore('app.store', {
	state: (): AppState => ({
		site: {
			enabled: true,
			menu: false,
			isLowPowerMode: false,
			theme: 'theme-light',
			transition: {
				active: true,
				startDelay: 500,
				endDelay: 250,
			},
		},
		three: {
			active: false,
			ready: false,
		},
		platform: {
			isOnline: true,
			isMobile: false,
			isSafari: false,
			isFirefox: false,
			isMobileLandscape: false,
			isTabletLandscape: false,
			mobileMediaQuery: '',
			dpr: 1,
		},
		params: [],
		storyblok: {
			config: null,
			viewMode: false,
		},
	}),

	actions: {
		setTransition(transition: boolean) {
			this.site.transition.active = transition;
			this.site.enabled = !transition;
		},
	},

});
