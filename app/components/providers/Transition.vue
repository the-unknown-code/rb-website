<template>
	<transition mode="out-in">
		<nuxt-page />
	</transition>

	<teleport to="body">
		<div
			id="page-transition"
			ref="$el"
		>
			<img src="/images/logo.webp">
		</div>
	</teleport>
</template>

<script setup lang="ts">
import gsap from 'gsap/all';
import useAppStore from '~/store/useAppStore';

const $router = useRouter();
const $store = useAppStore();

const $el = ref<HTMLElement>();
const timeline = gsap.timeline({ paused: true });
const { transitionEnd } = useTransition();
let releaseTimer: ReturnType<typeof setTimeout> | undefined;

$router.beforeEach(async (to, from) => {
	if (to.fullPath !== from.fullPath && !$store.site.transition.active) {
		await useTransition().transitionStart();
	}
});

const onTransitionEnd = () => {
	// Add here all useful action. eg: ScrollTrigger.refresh()
};

const initialize = () => {
	if (!$el.value) return;
	timeline.to($el.value, {
		duration: 0.25,
		autoAlpha: 0,
	});
};

$router.afterEach(() => {
	nextTick(() => {
		clearTimeout(releaseTimer);
		releaseTimer = setTimeout(() => {
			transitionEnd().then(onTransitionEnd);
		}, 250);
	});
});

watch(() => $store.site.transition.active, (t: boolean) => {
	if (t) {
		timeline.delay(0).reverse();
	}
	else {
		timeline.delay(0).play();
	}
}, { flush: 'sync' });

tryOnMounted(() => {
	initialize();
	releaseTimer = setTimeout(() => {
		transitionEnd().then(onTransitionEnd);
	}, 1000);
});

tryOnBeforeUnmount(() => clearTimeout(releaseTimer));
</script>

<style lang="scss" scoped>
#page-transition {
	position: fixed;
	inset: 0;
	background-color: var(--white);
	z-index: var(--z-max);
	pointer-events: none;
	opacity: 1;

	display: flex;
	justify-content: center;
	align-items: center;

	img {
		width: 132px;
	}
}

:global(html.is-page-transitioning) #page-transition {
	opacity: 1 !important;
	visibility: visible !important;
}
</style>
