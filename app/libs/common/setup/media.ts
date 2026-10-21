import type { ISbImage, ISbVideo } from '~/types/storyblok/components';

export enum MediaType {
	IMAGE = 'image',
	VIDEO = 'video',
}

export interface IMediaProps {
	id?: string;
	parallax?: boolean;
	type?: MediaType;
	asset: ISbImage | ISbVideo;
	three?: boolean;
	cover?: boolean;
	contain?: boolean;
	dpr?: [number, number];
	quality?: [number, number];
	priority?: boolean;
}
