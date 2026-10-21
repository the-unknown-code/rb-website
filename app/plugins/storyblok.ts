import { useAsyncStory } from '~/libs/storyblok/stories';
import useAppStore from '~/store/useAppStore';

/**
 * Storyblok Initialization Plugin
 *
 * Initializes Storyblok-related application state during Nuxt startup.
 *
 * Responsibilities:
 * - Detects whether the application is running inside the Storyblok Visual Editor.
 * - Stores the Visual Editor state in the Pinia application store.
 * - Loads the global Storyblok configuration story.
 * - Stores the configuration story for application-wide access (e.g. SEO defaults,
 *   navigation, site settings, feature flags).
 *
 * Execution:
 * - Runs once during Nuxt application initialization.
 * - Executes before the application is rendered.
 * - Ensures Storyblok configuration and Visual Editor state are available
 *   throughout the application.
 *
 * @author Andrea Giuffrida
 * @since 1.0.0
 */

export default defineNuxtPlugin({
	parallel: false,
	async setup() {
		const $store = useAppStore();
		const $route = useRoute();

		const isStoryblokPreview = computed(() => {
			const q = $route.query;

			return !!(
				q._storyblok
				|| q['_storyblok_tk[space_id]']
				|| q['_storyblok_tk[token]']
				|| q['_storyblok_tk[timestamp]']
			);
		});

		$store.storyblok.viewMode = isStoryblokPreview.value;

		const { public: app } = useRuntimeConfig();
		const { story } = await useAsyncStory(app.config.storyblok.settings ?? 'config');
		$store.storyblok.config = story.value;
	},
});
