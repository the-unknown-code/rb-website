<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const list = ref<HTMLElement | null>(null);
let context: gsap.Context | undefined;
let mediaQueries: gsap.MatchMedia | undefined;

type GridItem
	= | { id: string; type: 'text'; number: string; title: string; description: string; background?: boolean }
		| { id: string; type: 'image'; image: string; alt: string };

interface GridBlok {
	header: {
		title: string;
		description: string;
	};
	items: GridItem[];
}

const { blok } = defineProps<{ blok: GridBlok }>();

onMounted(() => {
	if (!list.value)
		return;

	context = gsap.context(() => {
		const items = Array.from(list.value?.children ?? []);

		const createTimelines = (firstFrom: gsap.TweenVars, secondFrom: gsap.TweenVars) => {
			for (let index = 0; index < items.length; index += 2) {
				const [first, second] = items.slice(index, index + 2);
				if (!first || !second)
					continue;

				const timeline = gsap.timeline({
					scrollTrigger: {
						trigger: first,
						start: 'top 100%',
						end: 'center 75%',
						scrub: true,
					},
				});

				timeline
					.fromTo(first, firstFrom, { xPercent: 0, y: 0, ease: 'none' }, 0)
					.fromTo(second, secondFrom, { xPercent: 0, y: 0, ease: 'none' }, 0);
			}
		};

		mediaQueries = gsap.matchMedia();
		mediaQueries.add('(min-width: 960px)', () => createTimelines({ xPercent: -100 }, { xPercent: 100 }));
		mediaQueries.add('(max-width: 959px)', () => createTimelines({ y: 120 }, { y: 120 }));
	}, list.value);

	nextTick(() => ScrollTrigger.refresh());
});

onBeforeUnmount(() => {
	mediaQueries?.revert();
	context?.revert();
});
</script>

<template>
	<common-section-wrapper
		class="s-grid"
		background="--brown"
	>
		<div class="layout-grid">
			<m-header-title
				:title="blok.header.title"
				:description="blok.header.description"
			/>
		</div>
		<div class="layout-grid">
			<div
				ref="list"
				class="s-grid__list layout-grid"
			>
				<div
					v-for="item in blok.items"
					:key="item.id"
					:class="{ background: item.type === 'text' && item.background }"
				>
					<template v-if="item.type === 'text'">
						<div class="p-small">
							{{ item.number }}
						</div>
						<div class="text">
							<h4>{{ item.title }}</h4>
							<p class="p-small elegant">
								{{ item.description }}
							</p>
						</div>
						<common-arrow />
					</template>
					<common-media
						v-else
						parallax
						:asset="{
							title: item.alt,
							desktop: { filename: item.image },
						}"
						cover
					/>
				</div>
			</div>
		</div>
	</common-section-wrapper>
</template>

<style lang="scss" scoped>
.s-grid {
	position: relative;
	overflow: clip;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 24px;

	.m-header-title {
		grid-column: -1 / 1;
		color: var(--white);

		@include desktop {
			grid-column: 3 / span 8;
		}
	}

	&__list {
		margin-top: 32px;
		grid-column: -1 / 1;
		--layout-columns-count: 3;

		@include desktop {
			--layout-columns-gap: 0;
			grid-column: 2 / span 10;
		}

		> div {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 100%;
			grid-column: -1 /1;

			.common-arrow {
				transition: transform .5s var(--ease-in-out-circ);
			}

			@include hover {
				.common-arrow {
					transform: translateX(10px);
				}
			}

			&:nth-child(1),
			&:nth-child(4),
			&:nth-child(5) {
				background-color: var(--white);
				justify-content: space-between;
				padding: clamp(16px, 10vw, 48px);

				@include mobile {
					aspect-ratio: 1;
				}

				@include desktop {
					height: 100%;
					cursor: pointer;
				}
			}

			&:nth-child(2),
			&:nth-child(3),
			&:nth-child(6) {
				aspect-ratio: 105 / 130;

				@include mobile {
					aspect-ratio: 1;
				}
			}

			@include mobile {
				&:nth-child(1) { order: 1; }
				&:nth-child(2) { order: 2; }
				&:nth-child(4) { order: 3; }
				&:nth-child(3) { order: 4; }
				&:nth-child(5) { order: 5; }
				&:nth-child(6) { order: 6; }
			}

			@include desktop {
				&:nth-child(1),
				&:nth-child(4),
				&:nth-child(5) {
					grid-column: span 1;
				}

				&:nth-child(2),
				&:nth-child(3),
				&:nth-child(6) {
					grid-column: span 2;
					aspect-ratio: 210 / 130;
				}
			}

			.text {
				display: flex;
				flex-direction: column;
				gap: 12px;
				max-width: 380px;

				h4 {
					text-transform: uppercase;
				}
			}
		}
	}
}
</style>
