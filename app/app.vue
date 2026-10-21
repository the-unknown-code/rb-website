<template>
	<system-no-javascript />

	<client-only>
		<system-rotate-device v-if="platform.isMobileLandscape || platform.isTabletLandscape " />
		<system-offline v-if="!platform.isOnline" />
		<!-- <core-three v-if="config.three.enabled" /> -->
	</client-only>

	<div
		id="site"
		:class="[{ disabled: !site.enabled, lowPowerMode: site.isLowPowerMode, storyblok: storyblok.viewMode }]"
	>
		<nuxt-route-announcer />
		<nuxt-layout :class="[site.theme]">
			<provider-transition />
		</nuxt-layout>
	</div>
</template>

<script lang="ts" setup>
import { provideSSRWidth } from '@vueuse/core';
import useAppStore from './store/useAppStore';

const { site, platform, storyblok } = useAppStore();
const { public: { config } } = useRuntimeConfig();
provideSSRWidth(config.platform.desktopBreakpoint);
</script>

<style lang="scss">
#site {

	&.disabled {
		pointer-events: none;
	}

	&.storyblok {
		background-color: green;
	}

	&.lowPowerMode {
		background-color: var(--theme-contrast);
	}
}
</style>
