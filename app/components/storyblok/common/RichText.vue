<template>
	<component
		:is="node"
		class="sb-rich-text"
	>
		<div v-html="renderHTML(doc, allowedTags)" />
	</component>
</template>

<script setup lang="ts">
import type { SbRichTextInput } from '@storyblok/richtext';
import { renderHTML } from '~/libs/storyblok/text';

interface Props {
	doc: SbRichTextInput;
	node?: string;
	allowedTags?: string[] | undefined;
}

withDefaults(defineProps<Props>(), {
	node: () => 'div',
	allowedTags: undefined,
});
</script>

<style scoped></style>
