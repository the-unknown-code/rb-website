<template>
	<video
		:key="source?.filename"
		autoplay
		muted
		playsinline
	>
		<source
			:src="source?.filename"
			:type="source?.type"
		>
	</video>
</template>

<script setup lang="ts">
import type { IMediaProps } from '~/libs/common/setup/media';
import { normalizeSbVideo } from '~/libs/storyblok/assets';

const props = withDefaults(defineProps<IMediaProps>(), {});

const { isDesktop } = useBreakpoints();
const video = computed(() => normalizeSbVideo(props.asset));
const source = computed(() => isDesktop.value ? video.value?.desktop : video.value?.mobile);
</script>

<style scoped></style>
