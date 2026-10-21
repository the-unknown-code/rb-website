/**
 * @description Composable for setting SEO metadata from Storyblok content.
 * Falls back to global SEO configuration when page-specific values are missing.
 *
 * @author Andrea Giuffrida
 */

import { useHead } from '#imports';

import { normalizeSbImage } from '~/libs/storyblok/assets';
import { generateHead } from '~/libs/storyblok/seo';
import useAppStore from '~/store/useAppStore';
import type { ISbSeo } from '~/types/storyblok/seo';

export const useSeo = (storySeo?: ISbSeo): void => {
	const $store = useAppStore();

	if (storySeo?.favicon) {
		const icon = useFavicon();
		icon.value = storySeo.favicon.filename;
	}

	const globalSeo = ($store.storyblok.config?.content.seo as ISbSeo[] | undefined)?.[0];

	const seoTitle = storySeo?.title || globalSeo?.title || '';
	const seoDescription = storySeo?.description || globalSeo?.description || '';
	const seoKeywords = storySeo?.keywords || globalSeo?.keywords || '';

	const image = storySeo?.image?.[0] ?? globalSeo?.image?.[0];
	const imageUrl = image
		? normalizeSbImage(image, [1, 1], [80, 80])?.desktop.filename ?? ''
		: '';

	useHead(
		generateHead(
			seoTitle,
			seoDescription,
			imageUrl,
			seoKeywords,
		),
	);
};
