import type { ISbBlok } from '~/types/storyblok/story';
import { MediaType, type IMediaProps } from '../common/setup/media';
import type { ISbImage, ISbVideo } from '~/types/storyblok/components';
import { storyblokEditable } from '@storyblok/js';

interface RegistryEntry<T extends object> {
	component: string;
	node: Component;
	parser: (blok: ISbBlok) => T;
}

export const defineRegistryEntry = <T extends object>(entry: RegistryEntry<T>) => {
	return entry;
};

export const getEditableBlok = (blok: ISbBlok) => {
	return storyblokEditable(blok as Parameters<typeof storyblokEditable>[0]);
};

export const parseMedia = (blok: ISbBlok): IMediaProps => {
	console.log('>>', blok);
	return {
		type: blok.component === 'common-image' ? MediaType.IMAGE : MediaType.VIDEO,
		asset: { ...blok } as unknown as ISbImage | ISbVideo,

	};
};
