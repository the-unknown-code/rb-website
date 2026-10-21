export const useAsyncStory = (
	url: string,
	apiOptions: Record<string, string | number | boolean | undefined | null> = {},
) => {
	const key = JSON.stringify({
		url,
		version: apiOptions.version,
		...apiOptions,
	});

	return useCache(key, async () => {
		const { public: app } = useRuntimeConfig();

		const refreshKey = ref(url);
		const { story } = await useAsyncStoryblok(url, {
			...apiOptions,
			lazy: false,
			api: {
				version: app.config.storyblok.forceDraft ? 'draft' : 'published',
			},
			bridge: {},
		});

		return {
			story,
			refreshKey,
		};
	});
};
