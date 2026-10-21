<template>
	<header class="e-header">
		<div class="e-header__layout layout-grid">
			<div />
			<div :class="{ 'e-header__logo--hidden': $store.site.menu || isScrolled }">
				<img
					src="/images/logo.webp"
					alt="René Boivin"
				>
			</div>
			<div>
				<button
					:class="['e-header__menu', { open: $store.site.menu }]"
					:aria-expanded="$store.site.menu"
					aria-label="Toggle menu"
					@click="$store.site.menu = !$store.site.menu"
				>
					<span />
					<span />
					<span />
				</button>
			</div>
		</div>
		<div
			:class="['e-header__backdrop', { open: $store.site.menu }]"
			@click="closeMenu"
		/>
		<nav :class="['nav', { open: $store.site.menu }]">
			<div class="nav__content layout-grid">
				<div>
					<h3>The Maison</h3>
					<common-link href="#">
						<span class="px-small">Story</span>
					</common-link>
					<common-link href="#">
						<span class="px-small">Savoir-Faire</span>
					</common-link>
					<common-link href="#">
						<span class="px-small">Archive & Press</span>
					</common-link>
				</div>
				<div>
					<h3>Jewellery</h3>
					<common-link href="#">
						<span class="px-small">Contemporary Creations</span>
					</common-link>
					<common-link href="#">
						<span class="px-small">Heritage Creations</span>
					</common-link>
				</div>
				<div>
					<h3>Boutique</h3>
					<common-link href="#">
						<span class="px-small">Explore Our Boutique</span>
					</common-link>
					<common-link href="#">
						<span class="px-small">Book an Appointment</span>
					</common-link>
				</div>
				<div>
					<h3>Services</h3>
					<common-link href="#">
						<span class="px-small">Authentification</span>
					</common-link>
					<common-link href="#">
						<span class="px-small">Contact Us</span>
					</common-link>
				</div>
			</div>
			<div class="nav__footer layout-grid">
				<div>
					<common-input
						placeholder="Search"
						type="search"
						light
					/>
				</div>
				<div>
					<common-link href="#">
						<span class="px-small">English</span>
					</common-link>
					<common-link href="#">
						<span class="px-small">Francais</span>
					</common-link>
				</div>
			</div>
		</nav>
	</header>
</template>

<script setup lang="ts">
import useLenis from '~/composables/useLenis';
import useAppStore from '~/store/useAppStore';

const $store = useAppStore();
const isScrolled = ref(false);
const closeMenu = () => {
	$store.site.menu = false;
};

useLenis(({ scroll }) => {
	isScrolled.value = scroll > 0;
});

onKeyStroke('Escape', closeMenu);
</script>

<style lang="scss" scoped>
.e-header {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	z-index: var(--z-overlay);

	&__layout {
		position: relative;
		--layout-columns-count: 3;
		padding: 24px 24px 0 24px;
		z-index: 2;

		> div {
			display: flex;
			transition: transform 1s var(--ease-in-out-circ);

			&:nth-child(2) {
				justify-content: center;

				img {
					width: 112px;
					filter: brightness(0) invert(1);
				}
			}

			&:nth-child(3) {
				justify-content: flex-end;
			}
		}
	}

	&__logo--hidden {
		transform: translateY(-150%);
	}

	&__menu {
		position: relative;
		width: 24px;
		height: 12px;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;

		span {
			position: absolute;
			right: 0;
			width: 100%;
			height: 1px;
			background-color: var(--white);
			transform-origin: center;
			transition: all 0.35s var(--ease-in-out-circ);

			&:nth-child(1) {
				top: 0;
			}

			&:nth-child(2) {
				top: 50%;
			}

			&:nth-child(3) {
				top: 100%;
				width: 50%;
				right: 50%;
			}
		}

		&.open {
			span {
				top: 50%;
				width: 50%;

				&:nth-child(1) {
					transform: rotate(45deg);
				}

				&:nth-child(2) {
					opacity: 0;
				}

				&:nth-child(3) {
					transform: rotate(-45deg);
					right: 0;
				}
			}
		}
	}

	&__backdrop {
		position: fixed;
		inset: 0;
		z-index: 0;
		background-color: rgb(0 0 0 / 0.01);
		backdrop-filter: blur(0);
		pointer-events: none;
		transition: backdrop-filter 0.65s var(--ease-in-out-circ);

		&.open {
			backdrop-filter: blur(4px);
			pointer-events: auto;
		}
	}

	.nav {
		position: absolute;
		top: 0;
		width: 100%;
		height: auto;
		background-color: var(--brown);
		z-index: 1;
		color: var(--white);
		clip-path: inset(0 0 100% 0);
		pointer-events: none;
		transition: clip-path 0.65s var(--ease-in-out-circ);

		&.open {
			clip-path: inset(0 0 0 0);
			pointer-events: auto;
		}

		@include desktop {
			width: calc(100% - 12px);
			left: 6px;
			top: 6px;
		}

		&__content {
			padding: 32px 16px;
			--layout-columns-count: 1;

			@include mobile {
				> div {
					margin-bottom: 8px;
					text-align: center;
				}
			}

			@include desktop {
				--layout-columns-count: 4;
				max-width: 1280px;
				padding: 64px 0;
				border-bottom: 1px solid var(--white-20);
			}

			h3 {
				margin-bottom: 16px;
			}
		}

		&__footer {
			--layout-columns-count: 1;
			padding: 32px 16px 64px 16px;

			:deep(.common-input) {
					max-width: 320px;
				}

				@include mobile {
					> div {
						display: flex;
						justify-content: center;

						&:nth-child(2) {
							flex-direction: column;
							align-items: center;
							justify-content: center;
						}
					}
				}

			@include desktop {
				--layout-columns-count: 3;
				max-width: 1280px;
				padding: 32px 0 64px 0;

				> div {
					&:nth-child(1) {
						grid-column: span 2;
					}

					&:nth-child(2) {
						grid-column: span 1;
					}
				}
			}
		}
	}
}
</style>
