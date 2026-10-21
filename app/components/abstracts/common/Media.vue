<template>
	<sb-image
		v-if="type === MediaType.IMAGE"
		v-bind="{ ...props, cover: props.contain ? false : props.cover }"
	/>
	<sb-video
		v-else-if="type === MediaType.VIDEO"
		v-bind="props"
	/>
</template>

<script setup lang="ts">
import { MediaType, type IMediaProps } from '~/libs/common/setup/media';

const props = withDefaults(defineProps<IMediaProps>(), {
	cover: false,
	three: false,
	type: MediaType.IMAGE,
	dpr: () => [1, 1] as [number, number],
	quality: () => [90, 80] as [number, number],
	priority: false,
	parallax: false,
	contain: false,
});
</script>

<style lang="scss" scoped>
.common-media {
	position: relative;
}
</style>
