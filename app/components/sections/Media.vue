<template>
	<section class="s-media">
		<div v-blur-reveal>
			<common-media
				:asset="blok.media"
				parallax
			/>
		</div>
		<div
			v-if="blok.title || blok.description"
			class="s-media__content"
		>
			<h3 v-letter-reveal="{ stagger: 0.01, delay: 0 }">
				{{ blok.title }}
			</h3>
			<p v-letter-reveal="{ stagger: 0.01, delay: 0 }">
				{{ blok.description }}
			</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { ISbImage } from '~/types/storyblok/components';

interface MediaBlok {
	media: ISbImage;
	title?: string;
	description?: string;
}

defineProps<{ blok: MediaBlok }>();
</script>

<style lang="scss" scoped>
.s-media {
	position: relative;
	width: 100%;
	aspect-ratio: 1440 / 769;

	background-color: var(--black);
	color: var(--white);

	.sb-image {
		opacity: .78;
		@include mobile {
			width: 150vw;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	&__content {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;

		padding: 16px;
		gap: 16px;

		@include desktop {
			justify-content: center;
			padding: clamp(192px, 9vw, 256px);
		}

		h3, p {
			max-width: 460px;
		}
		@include mobile {
			p {
				font-size: 14px;
			}
		}
	}
}
</style>
