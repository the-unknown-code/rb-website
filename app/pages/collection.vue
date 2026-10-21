<template>
	<main class="page-collection">
		<s-hero :blok="heroBlok" />
		<s-collection :blok="collectionBlok" />
		<s-collection :blok="collectionBlok2" />
		<s-media :blok="mediaBlok" />
		<s-collection :blok="collectionBlok3" />
		<s-collection :blok="collectionBlok4" />
		<s-media :blok="mediaBlok2" />
	</main>
</template>

<script setup lang="ts">
const heroBlok = {
	title: 'CONTEMPORARY<br><b>CREATIONS</b>',
	description: 'Familiar icons, new creations. A collection that draws on the history of René Boivin and carries its spirit forward.',
	media: {
		title: 'Hero Placeholder',
		desktop: { filename: '/images/hero-collection.webp' },
	},
	cta: { href: '#', label: 'Book an appointment' },
};

const collectionBlok = {
	background: '--brown',
	eyebrow: '01.',
	title: 'ICONS RETURN',
	items: [
		{
			media: { asset: { title: 'Contemporary Creations', desktop: { filename: '/images/icons-return-01.webp' } } },
			content: {
				eyebrow: 'Signature designs from the archives.',
			},
		},
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/icons-return-02.webp' } } },
			content: {
				subtitle: 'A century later, the fascination remains. Some creations have become inseparable from the history of René Boivin.',
				description: 'From the distinctive links of the Bague Chaîne and the sculptural forms of Bibendum to the intricate Hindou designs,each reflects the Maison\'s remarkable freedom of expression. The Bracelet Corde and the animal-inspired creations of Le Bestiaire reveal yet another side of this rich creative history.',
			},
		},
	],
};

const collectionBlok2 = {
	reverse: true,
	items: [
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/icons-return-03.webp' } }, contain: true },
			content: {
				subtitle: 'Decades after they were first imagined, these designs are being rediscoveredand brought back to life. ',
				description: 'Faithfully recreated from the archives and made once again in Paris. They preserve the forms, proportions and character that made the originals so distinctive.',
			},
		},
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/icons-return-04.webp' } }, contain: true },
			content: {
				subtitle: 'Decades after they were first imagined, these designs are being rediscoveredand brought back to life. ',
			},
		},
	],
};

const mediaBlok = {
	title: 'Different in their inspiration andexpression, they share something that has alway set René Boivinapart - a willingness to create jewellery unlike anything else.',
	media: {
		title: 'Hero Placeholder',
		desktop: { filename: '/images/collection-media.webp' },
	},

};

const collectionBlok3 = {
	background: '--red',
	eyebrow: '02.',
	title: 'NEW CREATIONS',
	items: [
		{
			media: { asset: { title: 'Contemporary Creations', desktop: { filename: '/images/new-creations-01.webp' } } },
			content: {
				eyebrow: 'The archives continue to inspire what comes next.',
			},
		},
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/new-creations-02.webp' } } },
			content: {
				subtitle: 'The history of René Boivin is filled with designers who were never particularly interested in following convention. ',
				description: 'They experimented with unusual materials, played with proportions and found beauty in forms that others might have overlooked. That curiosity remains an important part of the Maison today.',
			},
		},
	],
};

const collectionBlok4 = {
	reverse: true,
	items: [
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/new-creations-03.webp' } }, contain: true },
			content: {
				subtitle: 'Decades after they were first imagined, these designs are being rediscoveredand brought back to life.',
			},
		},
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/new-creations-04.webp' } }, contain: true },
			content: {
				subtitle: 'Decades after they were first imagined, these designs are being rediscoveredand brought back to life. ',
			},
		},
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/new-creations-05.webp' } }, contain: true },
			content: {
				description: 'Faithfully recreated from the archives and made once again in Paris. They preserve the forms, proportions and character that made the originals so distinctive.',
			},
		},
	],
};

const mediaBlok2 = {
	title: 'Different in their inspiration andexpression, they share something that has alway set René Boivinapart - a willingness to create jewellery unlike anything else.',
	media: {
		title: 'Hero Placeholder',
		desktop: { filename: '/images/collection-media-02.webp' },
	},

};
</script>

<style lang="scss" scoped>
.page-collection {
	position: relative;
	width: 100%;
}
</style>
