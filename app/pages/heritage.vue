<template>
	<main class="page-heritage">
		<s-hero :blok="heroBlok" />
		<s-collection :blok="collectionBlok" />
		<s-custom-grid :blok="customGridBlok" />
		<s-media :blok="mediaBlok" />
	</main>
</template>

<script setup lang="ts">
const heroBlok = {
	title: 'CONTEMPORARY<br><b>CREATIONS</b>',
	description: 'Familiar icons, new creations. A collection that draws on the history of René Boivin and carries its spirit forward.',
	media: {
		title: 'Hero Placeholder',
		desktop: { filename: '/images/hero-heritage.webp' },
	},
	cta: { href: '#', label: 'Book an appointment' },
};

const collectionBlok = {
	background: '--brown',
	title: 'OVER A CENTURY OF CREATION',
	items: [
		{
			media: { asset: { title: 'Contemporary Creations', desktop: { filename: '/images/century-01.webp' } } },
			content: {
				subtitle: 'For more than a century, René Boivin has created jewellery unlike anything else. Pieces that challenged the conventions of their time.',
			},
		},
		{
			media: { asset: { title: 'Heritage Creations', desktop: { filename: '/images/century-02.webp' } } },
			content: {
				subtitle: 'Pieces that explored unusual forms and materials, and reflected the personalities of the remarkable women who helped shape the Maison.',
				description: 'Today, the Heritage Collection brings together original creations from different periods of this history. From the bold, sculptural designs of Suzanne Belperron to the imaginative worlds of Juliette Moutard and the modern simplicity of Marie-Caroline de Brosses, each piece offers a glimpse into a particular moment in the life of René Boivin.',
			},
		},
	],
};

const mediaBlok = {
	title: 'Some were created for extraordinary clients. Others reveal the experiments, inspirations and changing tastes of the decades in which they were made. ',
	description: 'Carefully preserved, rediscovered and brought together once again, they offer an opportunity to experience the creativity of René Boivin through the original pieces themselves. ',
	media: {
		title: 'Hero Placeholder',
		desktop: { filename: '/images/heritage-media.webp' },
	},

};

const customGridBlok = {
	intro: 'What brings them together is a certain freedom of expression. An unusual combination of stones, an unexpected shape.',
	description1: 'Today, the Heritage Collection brings together original creations from different periods of this history.',
	description2: 'A detail that reveals itself only on closer inspection. These are jewels that were never intended to look like everything else.',
	primaryMedia: {
		title: 'Heritage jewel',
		desktop: { filename: '/images/necklace.webp' },
		contain: true,
	},
	secondaryMedia: {
		title: 'Heritage jewel detail',
		desktop: { filename: '/images/earring.webp' },
	},
};
</script>

<style lang="scss" scoped>
.page-heritage {
	position: relative;
	width: 100%;
}
</style>
