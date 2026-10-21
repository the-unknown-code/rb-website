import type { ISbAsset } from './common';
import type { ISbImage } from './components';

export interface ISbSeo {
	title: string;
	description: string;
	keywords: string;
	image?: ISbImage[];
	favicon?: ISbAsset;
}
