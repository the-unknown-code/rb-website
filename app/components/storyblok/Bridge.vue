<template>
	<storyblok-page-wrapper :story="story" />
</template>

<script setup lang="ts">
import { useStoryblokBridge, type ISbStoryData } from '@storyblok/js';

interface Props {
	id: number;
}

const props = withDefaults(defineProps<Props>(), {});
const story = defineModel<ISbStoryData | null> ('story', { required: false });
const refreshKey = defineModel<string | null>('refreshKey', { required: false });

const emit = defineEmits<{
	(
		e: 'story-updated',
		payload: { story: ISbStoryData; refreshKey: string }
	): void;
}>();

tryOnBeforeMount(() => {
	useStoryblokBridge(props.id, (updatedStory: ISbStoryData) => {
		story.value = updatedStory;
		refreshKey.value = `story-${props.id}-${Math.random()
			.toString(36)
			.substring(2, 7)}`;

		emit('story-updated', { story: updatedStory, refreshKey: refreshKey.value });
	});
});
</script>

<style scoped></style>
