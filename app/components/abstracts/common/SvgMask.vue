<template>
	<div
		v-if="source"
		class="svg-mask"
		:style="maskStyle"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	svg?: string;
	storyblok?: boolean;
	size?: string;
	position?: string;
	repeat?: string;
}

const props = withDefaults(defineProps<Props>(), {
	svg: '',
	storyblok: true,
	size: 'contain',
	position: 'center',
	repeat: 'no-repeat',
});

const source = computed(() => {
	if (!props.svg) return '';

	return props.storyblok
		? props.svg.replace(/^https:\/\/a(?=\.)/, 'https://a2')
		: props.svg;
});

const maskStyle = computed(() => ({
	maskImage: `url("${source.value}")`,
	WebkitMaskImage: `url("${source.value}")`,

	maskSize: props.size,
	WebkitMaskSize: props.size,

	maskRepeat: props.repeat,
	WebkitMaskRepeat: props.repeat,

	maskPosition: props.position,
	WebkitMaskPosition: props.position,
}));
</script>

<style scoped lang="scss">
.svg-mask {
  display: block;

  width: 100%;
  height: 100%;

  background: currentColor;

  flex-shrink: 0;
}
</style>
