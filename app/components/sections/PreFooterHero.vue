<template>
	<section class="s-pre-footer-hero">
		<div
			v-blur-reveal
			class="s-pre-footer-hero__media"
		>
			<common-media
				:asset="{
					title: 'Hero Placeholder',
					desktop: {
						filename: '/images/hero-placeholder.webp',
					},
				}"
				cover
				parallax
			/>
		</div>
		<div
			v-content-reveal="{ x: '5%', y: 0, duration: 1.5 }"
			class="s-pre-footer-hero__content layout-grid"
		>
			<div class="s-pre-footer-hero__content--title">
				<h2
					v-letter-reveal="{ blur: true, delay: 0.5 }"
					class="elegant"
				>
					Discover our Boutiquein <br>
					in the heart of Paris
				</h2>
				<p v-letter-reveal="{ stagger: 0.01, delay: 0.5 }">
					At 27 Rue Royale, René Boivin brings together jewellery from past and present, alongside
					more than a century of drawings, ideas and stories. We invite you to visit and discover
					them in person.
				</p>
				<div class="cta-wrapper">
					<common-button
						href="#"
						label="VISIT THE BOUTIQUE"
					/>
					<common-button
						href="#"
						label="BOOK AN APPOINTMENT"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.s-pre-footer-hero {
	position: relative;
	width: 100%;
	min-height: calc(100dvh - 48px);
	overflow-x: clip;
	color: var(--white);
	background-color: var(--black);

	display: flex;
	align-items: flex-end;
	padding-bottom: 24px;

	@include desktop {
		min-height: calc(100dvh - 96px);
		align-items: center;
		padding-bottom: 0;
	}

	&__media {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background-color: var(--black);

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

	.cta-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 2px;

		margin-top: 12px;

		@include desktop {
			flex-direction: row;
			align-items: center;
			gap: 24px;
		}
	}
}
</style>
