<template>
	<section class="s-hero">
		<div class="s-hero__media">
			<common-media
				:asset="blok.media"
				cover
				parallax
				priority
			/>
		</div>
		<div
			v-content-reveal="{ x: '5%', y: 0, duration: 1.5 }"
			class="s-hero__content layout-grid"
		>
			<div class="s-hero__content--title">
				<h1
					v-letter-reveal="{ blur: true, delay: .5 }"
					v-html="blok.title"
				/>
				<p v-letter-reveal="{ stagger: 0.01, delay: .5 }">
					{{ blok.description }}
				</p>
				<common-button
					:href="blok.cta.href"
					:label="blok.cta.label"
				/>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import type { ISbImage } from '~/types/storyblok/components';

interface HeroBlok {
	title: string;
	description: string;
	media: ISbImage;
	cta: {
		label: string;
		href: string;
	};
}

const { blok } = defineProps<{ blok: HeroBlok }>();
</script>

<style lang="scss">
.s-hero {
	position: relative;
	width: 100%;
	min-height: 100dvh;
	overflow-x: clip;
	color: var(--white);

	display: flex;
	align-items: flex-end;
	padding-bottom: 24px;

	background-color: var(--black);

	@include desktop {
		align-items: center;
		padding-bottom: 0;
	}

	&__media {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background-color: var(--black);
		opacity: 0;
		animation: hero-media-reveal 4s ease forwards;

		img {
			opacity: .7;
		}
	}

	&__content {
		position: relative;
		height: 100%;

		@include mobile {
			padding: 12px;
		}

		&--title {
			grid-column: -1 / 1;
			display: flex;
			flex-direction: column;
			gap: 12px;

			@include desktop {
				gap: 24px;
				grid-column: 2 / span 10;
			}

			p {
				max-width: 720px;
				text-wrap: balance;
			}

			.common-button {
				margin-top: 12px;
			}
		}
	}
}

@keyframes hero-media-reveal {
	to {
		opacity: 1;
	}
}
</style>
