<template>
	<picture
		v-if="image"
		:id="id"
		ref="picture"
		:class="['sb-image', { cover, parallax }]"
	>
		<source
			v-if="image.mobile"
			:media="mobileMediaQuery"
			:srcset="image.mobile.filename"
		>
		<img
			ref="imageElement"
			:src="image.desktop.filename"
			:alt="image.desktop.alt || image.title || ''"
			:title="image.desktop.title || undefined"
			:loading="priority ? 'eager' : 'lazy'"
			:fetchpriority="priority ? 'high' : 'auto'"
			decoding="async"
			draggable="false"
			@load="refreshScrollTrigger"
		>
	</picture>
</template>

<script setup lang="ts">
import type { IMediaProps } from '~/libs/common/setup/media';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { normalizeSbImage } from '~/libs/storyblok/assets';

const props = withDefaults(defineProps<IMediaProps>(), {});

const { public: { config } } = useRuntimeConfig();
const mobileMediaQuery = `(max-width: ${config.platform.desktopBreakpoint - 1}px)`;
const image = computed(() => normalizeSbImage(props.asset, props.dpr ?? [1, 1], props.quality ?? [80, 90]));
const picture = ref<HTMLElement | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);
const { isVisible } = useInView(picture, undefined, { threshold: 0 });

const refreshScrollTrigger = () => {
	requestAnimationFrame(() => ScrollTrigger.refresh());
};

const updateParallax = () => {
	if (!props.parallax || !picture.value || !imageElement.value)
		return;

	const { top, height } = picture.value.getBoundingClientRect();
	const viewportHeight = window.innerHeight;
	const progress = Math.min(1, Math.max(0, (viewportHeight - top) / (viewportHeight + height)));
	imageElement.value.style.setProperty('--parallax-y', `${(progress - 0.5) * 10}%`);
};

onMounted(updateParallax);
useFrame(() => {
	if (isVisible.value)
		updateParallax();
}, -1);
</script>

<style lang="scss" scoped>
.sb-image {
	position: relative;
	display: flex;
	overflow: hidden;

	img {
		position: relative;
		width: 100%;
		height: auto;
	}

	&.parallax img {
		transform: translate3d(0, var(--parallax-y, 0%), 0) scale(1.1);
		will-change: transform;
	}

	&.cover {

		width: 100%;
		height: 100%;

		img {
			height: 100%;
			object-fit: cover;
			object-position: center;
		}
	}
}
</style>
