/**
 * @file assets.ts
 * @description
 * Utility functions for Storyblok assets and images.
 *
 * Provides helpers to:
 * - Normalize Storyblok image objects so desktop and mobile assets always exist.
 * - Generate optimized Storyblok Image Service URLs.
 * - Extract original image dimensions from Storyblok asset URLs.
 *
 * @author Andrea Giuffrida
 * @created 2026-07-21
 */

import type { ISbAsset } from '~/types/storyblok/common';
import type { ISbImage, ISbVideo } from '~/types/storyblok/components';

const DESKTOP_WIDTH = 1440;
const MOBILE_WIDTH = 720;

const getDimensionsFromSbUrl = (
	url: string,
): { width: number; height: number } | null => {
	const match = url.match(/\/(\d+)x(\d+)\//);

	if (!match) {
		return null;
	}

	return {
		width: Number(match[1]),
		height: Number(match[2]),
	};
};

const getSbCorsUrl = (url: string): string =>
	url.replace(/^https:\/\/a(?=\.storyblok\.com\/)/, 'https://a2');

const sbFormat = (
	url: string,
	size: number,
	dpr: number,
	quality: number,
): string => {
	if (!url.startsWith('https://a')) {
		return url;
	}

	const dimensions = getDimensionsFromSbUrl(url);
	const width = dimensions
		? Math.min(size * dpr, dimensions.width)
		: size * dpr;

	return `${getSbCorsUrl(url)}/m/${Math.round(width)}x0/filters:format(avif):quality(${quality})`;
};

export const normalizeSbImage = (
	image: ISbImage,
	dpr: [number, number],
	quality: [number, number],
): ISbImage | null => {
	const desktopAsset = image.desktop ?? image.mobile;
	const mobileAsset = image.mobile ?? image.desktop;

	if (!desktopAsset || !mobileAsset) {
		return null;
	}

	return {
		...image,
		desktop: {
			...desktopAsset,
			filename: sbFormat(
				desktopAsset.filename,
				DESKTOP_WIDTH,
				dpr[0],
				quality[0],
			),
		},
		mobile: {
			...mobileAsset,
			filename: sbFormat(
				mobileAsset.filename,
				MOBILE_WIDTH,
				dpr[1],
				quality[1],
			),
		},
	};
};

export interface INormalizedSbVideo {
	title: string;
	desktop: ISbAsset & {
		type: string;
	};
	mobile: ISbAsset & {
		type: string;
	};
}

const getVideoMimeType = (filename: string): string => {
	const extension = filename.split('.').pop()?.toLowerCase();

	switch (extension) {
		case 'mp4':
			return 'video/mp4';
		case 'webm':
			return 'video/webm';
		case 'ogg':
		case 'ogv':
			return 'video/ogg';
		case 'mov':
			return 'video/quicktime';
		default:
			return 'application/octet-stream';
	}
};

export const normalizeSbVideo = (
	video: ISbVideo,
): INormalizedSbVideo => {
	const desktopAsset = video.desktop ?? video.mobile;
	const mobileAsset = video.mobile ?? video.desktop;

	return {
		...video,
		desktop: {
			...desktopAsset,
			type: getVideoMimeType(desktopAsset.filename),
		},
		mobile: {
			...mobileAsset,
			type: getVideoMimeType(mobileAsset.filename),
		},
	};
};
