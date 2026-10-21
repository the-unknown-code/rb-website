import type { ISbAsset } from './common';

export interface ISbImage {
	title: string;
	desktop: ISbAsset;
	mobile?: ISbAsset;
}

export interface ISbVideo {
	title: string;
	desktop: ISbAsset;
	mobile?: ISbAsset;
}
