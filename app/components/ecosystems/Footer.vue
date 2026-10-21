<template>
	<footer class="e-footer">
		<div class="e-footer__header">
			<h5>{{ content.newsletter.title }}</h5>
			<p>{{ content.newsletter.description }}</p>
			<common-input
				:placeholder="content.newsletter.placeholder"
				type="email"
			/>
		</div>
		<div class="layout-grid">
			<div
				class="e-footer__list layout-grid"
				:style="{ '--footer-columns-count': content.sections.length }"
			>
				<div
					v-for="section in content.sections"
					:key="section.id"
				>
					<p class="p-small">
						{{ section.title }}
					</p>
					<ul>
						<li
							v-for="link in section.links"
							:key="link.label"
						>
							<common-link
								:href="link.href"
								class="px-small"
							>
								{{ link.label }}
							</common-link>
						</li>
					</ul>
				</div>
				<!--
				<div class="e-footer__back-to-top">
					<div class="top">
						<common-arrow />
						<p class="px-small">
							{{ content.backToTop }}
						</p>
					</div>
				</div>
				-->
			</div>
		</div>
		<div class="layout-grid">
			<div class="e-footer__copyright layout-grid">
				<div>
					<div class="copy px-small">
						© 2026 RENE BOIVIN. ALL RIGHTS RESERVED.
					</div>
				</div>
				<div>
					<img src="/images/logo.webp">
				</div>
				<div>
					<div class="copy px-small">
						CREATED BY AMATASTUDIOS.COM
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
const content = {
	newsletter: {
		title: 'Stay close to the Maison.',
		description: 'Stories, new creations and news from the world of René Boivin.',
		placeholder: 'Your e-mail address',
	},
	sections: [
		{ id: 'maison', title: 'THE MAISON', links: [{ label: 'Story', href: '#' }, { label: 'Savoir-Faire', href: '#' }, { label: 'Archive', href: '#' }] },
		{ id: 'jewellery', title: 'JEWELLERY', links: [{ label: 'Contemporary', href: '/collection' }, { label: 'Heritage', href: '/heritage' }] },
		{ id: 'boutique', title: 'BOUTIQUE', links: [{ label: 'Explore Our Boutique', href: '#' }, { label: 'Book an Appointment', href: '#' }] },
		{ id: 'services', title: 'SERVICES', links: [{ label: 'Authentification', href: '#' }, { label: 'Press', href: '#' }, { label: 'Contact Us', href: '#' }] },
		{ id: 'follow-us', title: 'FOLLOW US', links: [{ label: 'Instagram', href: '#' }, { label: 'Linkedin', href: '#' }] },
		{ id: 'language', title: 'LANGUAGE', links: [{ label: 'English', href: '#' }, { label: 'Français', href: '#' }] },
	],
	backToTop: 'Back to the top',
};
</script>

<style lang="scss" scoped>
.e-footer {
	position: relative;
	display: flex;
	flex-direction: column;

	gap: 12px;
	padding: 48px 0;

	&__header {
		display: flex;
		flex-direction: column;
		gap: 8px;

		align-self: center;
		text-align: center;

		max-width: 460px;

		.common-input {
			margin-top: 12px;
		}
	}

	&__list {
		position: relative;
		width: 100%;
		grid-column: -1 / 1;
		margin-top: 32px;

		padding: 24px 0;
		border-top: 1px solid var(--black-20);
		border-bottom: 1px solid var(--black-20);

		@include mobile {
			max-width: 480px;

			> div {
				grid-column: span 2;
				text-align: center;
			}
		}

		@include desktop {
			grid-column: 2 / span 10;
			--layout-columns-count: var(--footer-columns-count);
		}

	&__back-to-top {
		@include desktop {
			grid-column: var(--footer-columns-count);
		}
	}

		ul {
			margin-top: 24px;
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.top {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			gap: 24px;

			.common-arrow {
				transform: rotate(-90deg);
			}
		}
	}

	&__copyright {
		position: relative;
		width: 100%;
		grid-column: -1 / 1;
		padding: 64px 0 32px 0;
		align-items: flex-end;

		img {
			width: 112px;
		}

		.copy{
			opacity: .85;
			font-size: 12px;
		}

		@include mobile {
			> div {
				grid-column: -1 / 1;
				text-align: center;

				&:nth-child(1) {
					order: 2;
				}
			}
		}

		@include desktop {
			grid-column: 2 / span 10;
			--layout-columns-count: 3;

			> div {
				display: flex;

				&:nth-child(2) {
					justify-content: center;
				}

				&:nth-child(3) {
					justify-content: flex-end;
				}
			}
		}
	}
}
</style>
