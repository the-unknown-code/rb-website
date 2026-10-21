<template>
	<main
		ref="$wrapper"
		class="lenis"
	>
		<div
			ref="$content"
			class="lenis--content"
		>
			<slot />
		</div>
	</main>
</template>

<script setup lang="ts">
import Lenis from 'lenis';
import Tempus from 'tempus';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useAppStore from '~/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

const { root, options } = defineProps({
	root: {
		type: Boolean,
		default: true,
	},
	options: {
		type: Object,
		default: () => { },
	},
});

const { hook } = useNuxtApp();
const $store = useAppStore();
const $wrapper = ref<HTMLElement>();
const $content = ref<HTMLElement>();
const lenis = shallowRef<Lenis | null>(null);
const unsubscribe = ref();
const scope = effectScope();

provide('lenis-instance', lenis);

const resetScroll = async () => {
	await nextTick();
	window.scrollTo(0, 0);
	lenis.value?.scrollTo(0, { immediate: true, force: true });
	lenis.value?.resize();
	ScrollTrigger.refresh();
};

const initializeLenis = () => {
	if (lenis.value) return;

	lenis.value = new Lenis({
		...(!root
			? {
					wrapper: $wrapper.value,
					content: $content.value,
				}
			: {
					...options,
				}
		),
	});

	lenis.value.scrollTo(0, { immediate: true });
	lenis.value.on('scroll', ScrollTrigger.update);

	unsubscribe.value = Tempus.add(({ time }: { time: number }) => {
		lenis.value?.raf(time);
	});
};

hook('page:finish', async () => {
	await resetScroll();
});

const dispose = () => {
	scope.stop();
	unsubscribe.value?.();
	lenis.value?.off('scroll', ScrollTrigger.update);
	lenis.value?.destroy();
};

scope.run(() => {
	watch(() => $store.site.enabled, (enabled: boolean) => {
		lenis.value?.[enabled ? 'start' : 'stop']();
	});

	watch(() => $store.site.menu, (menu: boolean) => {
		lenis.value?.[menu ? 'stop' : 'start']();
	});

	watch(() => $store.site.isLowPowerMode, (isLowPower: boolean) => {
		if (isLowPower) dispose();
		else initializeLenis();
	});
});

tryOnMounted(() => {
	window.history.scrollRestoration = 'manual';
	if (!lenis.value) {
		initializeLenis();
	}
	resetScroll();
});

tryOnBeforeUnmount(() => {

});
</script>

<style lang="scss" scoped>
.lenis {
	position: relative;
	color: var(--theme-fg);
	min-height: 100dvh;
	z-index: var(--z-content);
}
</style>
