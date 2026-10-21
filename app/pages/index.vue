<template>
	<main class="page-index">
		<s-hero :blok="heroBlok" />
		<s-collection :blok="collectionBlok" />
		<s-grid :blok="gridBlok" />
		<s-pre-footer-hero />
	</main>
</template>

<script setup lang="ts">
const heroBlok = {
	title: 'THE MAISON<br><b>OF RENÉ BOIVIN</b>',
	description: 'From its beginnings in Paris in 1890, René Boivin has been shaped by creative freedom, remarkable people and a desire to do things differently.',
	media: {
		title: 'Hero Placeholder',
		desktop: { filename: '/images/hero-placeholder.webp' },
	},
	cta: { href: '#', label: 'Discover the mansion' },
};

const collectionBlok = {
	background: '--white',
	title: 'THE COLLECTIONS',
	items: [
		{
			media: { asset: { title: 'Contemporary Creations', desktop: { filename: '/images/collection-01.webp' } } },
			content: {
				title: 'CONTEMPORARY CREATIONS',
				subtitle: 'Timeless design for today.',
				description: 'Familiar icons, new creations. A collection that draws on the history of René Boivin and carries its spirit forward.',
				cta: { href: '/collection', label: 'Discover the Collection' },
			},
		},
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/collection-02.webp' } } },
			content: {
				title: 'HERITAGE CREATIONS',
				subtitle: 'Over a century of creation.',
				description: 'Exceptional creations from the Maison’s past, each carrying the character of its time. Pieces to discover, collect and pass on.',
				cta: { href: '/collection', label: 'Discover the Collection' },
			},
		},
	],
};

const gridBlok = {
	header: {
		title: 'Our Universe',
		description: 'René Boivin is a world shaped by creativity, craftsmanship and more thana century of history. Discover the archives, expertise and savoir-faire that continue to define the Maison today.',
	},
	items: [
		{ id: 'archives', type: 'text' as const, number: '01.', title: 'ARCHIVES', description: 'Drawings, photographs and documents tell the story of René Boivin from within. A living record of the ideas, people and creations that have shaped the Maison since 1890', background: false },
		{ id: 'universe-01', type: 'image' as const, image: '/images/universe-01.webp', alt: 'universe-01' },
		{ id: 'universe-02', type: 'image' as const, image: '/images/universe-02.webp', alt: 'universe-02' },
		{ id: 'savoir-faire', type: 'text' as const, number: '02.', title: 'SAVOIR-FAIRE', description: 'Behind every René Boivin creation is the work of skilled hands. Drawing, shaping, setting and finishing come together through techniques refined over generations.', background: false },
		{ id: 'services', type: 'text' as const, number: '03.', title: 'SERVICES', description: 'With more than a century of creations to trace, the Maison’s archives hold an exceptional knowledge of its past. Through its authentication service, René Boivin researches and certifies historic pieces attributed to the Maison.', background: true },
		{ id: 'universe-03', type: 'image' as const, image: '/images/universe-03.webp', alt: 'universe-03' },
	],
};
</script>

<style lang="scss" scoped>
.page-index {
	position: relative;
	width: 100%;
}
</style>
