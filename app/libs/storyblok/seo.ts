import type { Meta } from '@unhead/schema';

export const generateHead = (
	title: string,
	description: string,
	image: string,
	keywords?: string,
	robotFollow = true,
): Parameters<typeof useHead>[0] => {
	const meta: Meta[] = [
		{
			name: 'description',
			content: description,
		},
		{
			property: 'og:title',
			content: title,
		},
		{
			property: 'og:description',
			content: description,
		},
		{
			property: 'og:image',
			content: image,
		},
		{
			property: 'og:type',
			content: 'website',
		},
		{
			name: 'twitter:title',
			content: title,
		},
		{
			name: 'twitter:description',
			content: description,
		},
		{
			name: 'twitter:image',
			content: image,
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image',
		},
	];

	if (!robotFollow) {
		meta.push({
			name: 'robots',
			content: 'noindex, nofollow',
		});
	}

	if (keywords) {
		meta.push({
			name: 'keywords',
			content: keywords,
		});
	}

	return {
		title,
		meta,
	};
};
