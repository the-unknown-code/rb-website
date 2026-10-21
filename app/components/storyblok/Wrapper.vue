<template>
	<div v-if="activeStory">
		<slot
			:story="activeStory"
			:refresh-key="activeRefreshKey"
		/>

		<client-only>
			<storyblok-bridge
				:id="activeStory.id"
				@story-updated="handleStoryUpdate"
			/>
		</client-only>
	</div>
	<div v-else>
		story not found
	</div>
</template>

<script setup lang="ts">
import type { ISbStoryData } from '@storyblok/js';
import { useAsyncStory } from '~/libs/storyblok/stories';
import type { ISbSeo } from '~/types/storyblok/seo';

interface Props {
	url: string;
	apiOptions?: Record<string, string | number | boolean | undefined | null>;
}

const props = withDefaults(defineProps<Props>(), {
	apiOptions: () => ({}),
});

const { story, refreshKey } = await useAsyncStory(props.url, props.apiOptions);

const activeStory = ref<ISbStoryData>(story.value);
const activeRefreshKey = ref<string>(refreshKey.value);
const seo = (activeStory.value?.content?.seo as ISbSeo[] | undefined)?.[0];

useSeo(seo);
useConsole('story', story.value);

const handleStoryUpdate = ({
	story: updatedStory,
	refreshKey: updatedRefreshKey,
}: {
	story: ISbStoryData;
	refreshKey: string;
}) => {
	activeStory.value = updatedStory;
	activeRefreshKey.value = updatedRefreshKey;
};
</script>
