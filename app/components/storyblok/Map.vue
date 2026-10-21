<template>
	<component
		:is="entry.node"
		v-for="(entry, index) in mappedBloks"
		:key="`${refreshKey}-${entry.rawBlok._uid || index}`"
		v-bind="{
			...entry.props,
			...(entry.componentProps ?? {}),
			...entry.editableBlok,
		}"
	/>
</template>

<script setup lang="ts">
import { defineRegistryEntry, getEditableBlok, parseMedia } from '~/libs/storyblok/parser';
import type { ISbBlok } from '~/types/storyblok/story';

interface Props {
	bloks?: ISbBlok[];
	refreshKey?: string;
}

const props = withDefaults(defineProps<Props>(), { bloks: () => [], refreshKey: '' });
const CommonMedia = defineAsyncComponent(() => import('~/components/abstracts/common/Media.vue'));

const components = [
	defineRegistryEntry({ component: 'common-image', node: CommonMedia, parser: parseMedia }),
	defineRegistryEntry({ component: 'common-video', node: CommonMedia, parser: parseMedia }),
];

const mappedBloks = computed(() =>
	props.bloks.flatMap(rawBlok => {
		const component = components.find(c => c.component === rawBlok.component);

		if (!component) {
			return [];
		}

		return [{
			node: component.node,
			props: component.parser(rawBlok),
			componentProps: rawBlok.componentProps,
			editableBlok: getEditableBlok(rawBlok),
			rawBlok,
		}];
	}),
);
</script>

<style scoped></style>
