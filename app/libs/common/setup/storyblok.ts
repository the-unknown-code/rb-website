/**
 * Storyblok integration configuration.
 *
 * Defines the application-wide Storyblok settings used for content
 * delivery, including preview mode, global settings slug, and API
 * configuration.
 *
 * @author Andrea Giuffrida
 */

export interface IStoryblok {
	forceDraft: boolean;
	settings: string;
	apiOptions: {
		region: 'eu' | 'us' | 'ap';
	};
}

export const storyblok: IStoryblok = {
	forceDraft: process.env.STORYBLOK_FORCE_DRAFT === 'true',
	settings: 'config',
	apiOptions: {
		region: 'eu',
	},
};
