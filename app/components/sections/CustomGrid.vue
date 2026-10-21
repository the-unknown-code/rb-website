<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ISbImage } from '~/types/storyblok/components';

gsap.registerPlugin(ScrollTrigger);

interface CustomGridBlok {
	intro: string;
	description1: string;
	description2: string;
	primaryMedia: ISbImage;
	secondaryMedia: ISbImage;
}

const { blok } = defineProps<{ blok: CustomGridBlok }>();
const layout = ref<HTMLElement | null>(null);
let context: gsap.Context | undefined;
let mediaQueries: gsap.MatchMedia | undefined;

onMounted(() => {
	if (!layout.value)
		return;

	context = gsap.context(() => {
		const images = Array.from(layout.value?.querySelectorAll<HTMLElement>('.s-custom-grid__media') ?? []);
		if (images.length !== 2)
			return;

		const createTimeline = (firstFrom: gsap.TweenVars, secondFrom: gsap.TweenVars) => gsap.timeline({
			scrollTrigger: {
				trigger: layout.value,
				start: 'top 90%',
				end: 'clamp(center 55%)',
				scrub: true,
				invalidateOnRefresh: true,
			},
		})
			.fromTo(images[0]!, firstFrom, { xPercent: 0, y: 0, ease: 'none' }, 0)
			.fromTo(images[1]!, secondFrom, { xPercent: 0, y: 0, ease: 'none' }, 0);

		mediaQueries = gsap.matchMedia();
		mediaQueries.add('(min-width: 960px)', () => createTimeline({ xPercent: -100 }, { xPercent: 100 }));
		mediaQueries.add('(max-width: 959px)', () => createTimeline({ y: 120 }, { y: 120 }));
	}, layout.value);

	nextTick(() => ScrollTrigger.refresh());
});

onBeforeUnmount(() => {
	mediaQueries?.revert();
	context?.revert();
});
</script>

<template>
	<common-section-wrapper class="s-custom-grid">
		<div
			ref="layout"
			class="s-custom-grid__layout layout-grid"
		>
			<div>
				<common-media
					class="s-custom-grid__media"
					:asset="blok.primaryMedia"
				/>

				<p v-letter-reveal="{ stagger: 0.01 }">
					Today, the Heritage Collection brings together original creations from different periods
					of this history.
				</p>
			</div>
			<div>
				<h3 v-letter-reveal="{ stagger: 0.01 }">
					{{ blok.description1 }}
				</h3>
				<common-media
					class="s-custom-grid__media"
					:asset="blok.secondaryMedia"
				/>
				<h3 v-letter-reveal="{ stagger: 0.01 }">
					{{ blok.description2 }}
				</h3>
			</div>
		</div>
	</common-section-wrapper>
</template>

<style lang="scss" scoped>
.s-custom-grid {
	position: relative;
	color: var(--black);

	&__layout {
		position: relative;
		> div {
			position: relative;
			display: flex;
			grid-column: -1/1;

			&:nth-child(1) {

				flex-direction: column;

				:deep(.sb-image) {
					max-width: 320px;
					margin: 0 auto;
				}

				p {
					position: relative;
					max-width: 320px;
					margin: 0 auto;
					padding: 32px 0;
					text-align: center;
				}
			}

			&:nth-child(2) {
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 32px;

				:deep(.sb-image) {
					max-width: 320px;
				}

				h3 {
					text-align: center;
					max-width: 320px;
				}
			}

			@media screen and (min-width: 1024px) {
				grid-column: span 6;

				&:nth-child(1) {
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;

					:deep(.sb-image) {
						position: relative;
						width: 170%;
						flex: 0 0 170%;
						max-width: none;
						left: -85%;
						flex-grow: 1;
					}

					p {
						position: absolute;
						max-width: 320px;
						margin-left: 64px;
						padding: 0;
					}
				}

				&:nth-child(2) {
					gap: 64px;
				}
			}
		}
	}
}
</style>
